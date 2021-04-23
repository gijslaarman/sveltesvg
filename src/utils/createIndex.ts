'use strict'
const createIndex = (files: string[]) => `
${files
  .map((file) => `export { default as ${file} } from './${file}.svelte'`)
  .join('\n')}
`

export default createIndex
