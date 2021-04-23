#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { optimize } from 'svgo'
import chalk from 'chalk'
import {
  capitalize,
  createIndexFile,
  createTemplate,
  argOptions,
} from './utils'

class SvelteSvg {
  private inputDir: string
  private outputDir: string
  private removedFileCount: number
  private filesToIndex: string[]

  constructor(options: typeof argOptions) {
    this.inputDir = path.resolve(options.in)
    this.outputDir = path.resolve(options.out)
    this.removedFileCount = 0
    this.filesToIndex = []

    this.generateIcons()
  }

  private createDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir)
    }
  }

  private removeFiles(files: string[]): void {
    for (const file of files) {
      const isJsFile = /(\.ts)|(\.js)/
      const filePath = path.join(this.outputDir + `/${file}`)
      fs.unlinkSync(filePath)
      isJsFile.test(file) ? false : this.removedFileCount++
    }
  }

  private checkAndRemoveOldfiles() {
    return new Promise<void>((resolve, reject) => {
      fs.readdir(this.outputDir, (err, files) => {
        if (err) reject(err)
        this.removeFiles(files)
        console.log(chalk.yellow(`Removed ${this.removedFileCount} icons.`))
        resolve()
      })
    })
  }

  private writeIconTemplateToDir(item: string) {
    return new Promise<void>((resolve) => {
      if (!item.endsWith('.svg')) return resolve()
      const filePath = path.resolve(this.inputDir, item)
      const fileName = capitalize(item.replace('.svg', '').replace(/ /g, ''))

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err

        const result = optimize(data, {
          path: filePath,
          plugins: [
            'removeDoctype',
            'removeXMLProcInst',
            'removeComments',
            'removeMetadata',
            'removeEditorsNSData',
            'cleanupAttrs',
            'mergeStyles',
            'inlineStyles',
            'minifyStyles',
            'cleanupIDs',
            'removeUselessDefs',
            'cleanupNumericValues',
            'removeUnknownsAndDefaults',
            'removeNonInheritableGroupAttrs',
            'removeUselessStrokeAndFill',
            'removeViewBox',
            'cleanupEnableBackground',
            'removeHiddenElems',
            'removeEmptyText',
            'convertShapeToPath',
            'convertEllipseToCircle',
            'moveElemsAttrsToGroup',
            'moveGroupAttrsToElems',
            'collapseGroups',
            'convertPathData',
            'convertTransform',
            'removeEmptyAttrs',
            'removeEmptyContainers',
            'mergePaths',
            'removeUnusedNS',
            'sortDefsChildren',
            'removeTitle',
            'removeDesc',
            {
              name: 'convertColors',
              params: {
                currentColor: true,
              },
            },
            {
              name: 'cleanupIDs',
              params: {
                remove: true,
                prefix: fileName,
              },
            },
          ],
        })
        this.filesToIndex.push(fileName)

        const svg = result.data.replace('>', ` {...$$$$props}>`)

        const pathToWrite = `${this.outputDir}/${fileName}.svelte`
        fs.writeFile(pathToWrite, createTemplate(svg), 'utf8', () => resolve())
      })
    })
  }

  private getNewIcons() {
    fs.readdir(this.inputDir, (err, files) => {
      if (err) throw err

      const writingFiles = files.map((item) => {
        this.writeIconTemplateToDir(item)
      })

      Promise.all(writingFiles).then(() => {
        fs.writeFile(
          `${this.outputDir}/index.ts`,
          createIndexFile(this.filesToIndex),
          'utf8',
          () =>
            console.log(
              chalk.green(`Added ${this.filesToIndex.length} new icons.`)
            )
        )
      })
    })
  }

  private generateIcons() {
    this.createDir()
    this.checkAndRemoveOldfiles().then(() => {
      this.getNewIcons()
    })
  }
}

export default new SvelteSvg(argOptions)
