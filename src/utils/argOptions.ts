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
  }).argv

export default options
