import yargs from 'yargs'

const options = yargs
  .usage('Usage: --inputDir <inputPath> --outputDir <outputPath>')
  .option('in', {
    alias: 'inputDir',
    describe: 'input directory path',
    type: 'string',
    demandOption: true,
  })
  .option('out', {
    alias: 'outputDir',
    describe: 'output directory path',
    type: 'string',
    demandOption: true,
  })
  .option('ts', {
    alias: 'typescript',
    describe: 'should export the index files as js or ts, default = .js',
    type: 'boolean',
  })
  .option('templatePath', {
    alias: 'template',
    describe:
      'The path to the template you would like to use. If left empty will use the default template',
    type: 'string',
  }).argv

export default options
