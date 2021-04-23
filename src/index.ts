#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { optimize } from 'svgo'
import {
  capitalize,
  createIndexFile,
  createTemplate,
  argOptions,
} from './utils'

console.log('hello world!!')

// const dir = path.join(__dirname, argOptions.in)
// const outputDir = path.join(__dirname, argOptions.out)

// const removeOldfiles = () => {
//   return new Promise<void>((resolve, reject) => {
//     fs.readdir(outputDir, (err, files) => {
//       if (err) reject(err)
//       let removedFileCount = -1 // index.ts will also count as a file, but is not an icon.

//       for (const file of files) {
//         fs.unlinkSync(path.join(outputDir + `/${file}`))
//         removedFileCount++
//       }

//       console.log('\x1b[33m', `Removed ${removedFileCount} icons.`, '\x1b[0m')
//       resolve()
//     })
//   })
// }

// removeOldfiles().then(() => {
//   fs.readdir(dir, (err, files) => {
//     const filesToIndex: string[] = []
//     if (err) throw err

//     const writingFiles = files.map((item) => {
//       return new Promise<void>((resolve) => {
//         if (!item.endsWith('.svg')) return resolve()
//         const filePath = path.resolve(dir, item)
//         const fileName = capitalize(item.replace('.svg', '').replace(/ /g, ''))

//         fs.readFile(filePath, 'utf8', (err, data) => {
//           if (err) throw err

//           const result = optimize(data, {
//             path: filePath,
//             plugins: [
//               {
//                 name: 'convertColors',
//                 params: {
//                   currentColor: true,
//                 },
//               },
//               {
//                 name: 'cleanupIDs',
//                 params: {
//                   remove: true,
//                   prefix: fileName,
//                 },
//               },
//             ],
//           })
//           filesToIndex.push(fileName)

//           const svg = result.data.replace('>', ` {...$$$$props}>`)

//           const pathToWrite = `${outputDir}/${fileName}.svelte`
//           fs.writeFile(pathToWrite, createTemplate(svg), 'utf8', () =>
//             resolve()
//           )
//         })
//       })
//     })

//     Promise.all(writingFiles).then(() => {
//       fs.writeFile(
//         `${outputDir}/index.ts`,
//         createIndexFile(filesToIndex),
//         'utf8',
//         () =>
//           console.log(
//             '\x1b[32m',
//             `Added ${filesToIndex.length} new icons.`,
//             '\x1b[0m'
//           )
//       )
//     })
//   })
// })
