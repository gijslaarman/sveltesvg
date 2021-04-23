#!/usr/bin/env node
'use strict'
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

type templateFunction = (key: string) => string
class SvelteSvg {
  private inputDir: string
  private outputDir: string
  private templatePath: string
  private removedFileCount: number
  private typescript: boolean
  private filesToIndex: string[]
  private template: templateFunction

  constructor(options: typeof argOptions) {
    this.inputDir = path.resolve(options.in)
    this.outputDir = path.resolve(options.out)
    this.templatePath = options.templatePath || ''
    this.typescript = options.ts || false
    this.template = createTemplate
    this.removedFileCount = 0
    this.filesToIndex = []
    this.generateIcons()
  }

  private async getTemplate() {
    return new Promise(async (resolve) => {
      if (this.templatePath) {
        const templateFile: { default: templateFunction } = await import(
          path.resolve(this.templatePath)
        )
        console.log(
          `${chalk.green('Using template from:')} ${this.templatePath}`
        )
        resolve(templateFile.default)
      } else {
        resolve(createTemplate)
      }
    })
  }

  private createDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      console.log(chalk.yellow(`Creating output directory: ${this.outputDir}`))
      fs.mkdirSync(this.outputDir)
    }
  }

  private removeFile(file: string): string {
    const isJsFile = /(\.ts)|(\.js)/
    const filePath = path.join(this.outputDir + `/${file}`)
    fs.unlinkSync(filePath)
    isJsFile.test(file) ? false : this.removedFileCount++
    return 'done'
  }

  private checkAndRemoveOldfiles() {
    const files = fs.readdirSync(this.outputDir)
    files.map((file) => this.removeFile(file))
    console.log(chalk.yellow(`Removed ${this.removedFileCount} icons.`))
  }

  private writeIconTemplateToDir(item: string) {
    if (!item.endsWith('.svg')) return 'Not a svg'
    const filePath = path.resolve(this.inputDir, item)
    const fileName = capitalize(item.replace('.svg', '').replace(/ /g, ''))

    const data = fs.readFileSync(filePath, { encoding: 'utf8' })
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

    fs.writeFileSync(pathToWrite, this.template(svg), {
      encoding: 'utf8',
    })
  }

  private getNewIcons() {
    const files = fs.readdirSync(this.inputDir)

    files.forEach((file) => this.writeIconTemplateToDir(file))
    fs.writeFileSync(
      `${this.outputDir}/index.${this.typescript ? 'ts' : 'js'}`,
      createIndexFile(this.filesToIndex)
    )
    console.log(chalk.green(`Added ${this.filesToIndex.length} new icons.`))
  }

  private generateIcons() {
    this.getTemplate().then((template) => {
      // @ts-expect-error
      this.template = template
      this.createDir()
      this.checkAndRemoveOldfiles()
      this.getNewIcons()
    })
  }
}

export default new SvelteSvg(argOptions)
