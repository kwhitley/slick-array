const { readFileSync, writeFileSync } = require('fs-extra')

const base = readFileSync('./src/objectified-array.js', { encoding: 'utf-8' })
const minifiedBase = base
  // .replace(/\bhandlers\b/g, 'hs') // Handler(S)
  // .replace(/\bhandler\b/g, 'h') // Handler
  // .replace(/([^\.])obj\b/g, '$1t') // Target
  // .replace(/([^\.])options\b/g, '$1o') // Options
  // .replace(/([^\.])receiver\b/g, '$1c') // Options
  // .replace(/([^\.])attr\b/g, '$1a') // Attr
  // .replace(/([^\.])route\b/g, '$1p') // Path
  // .replace(/([^\.])request\b/g, '$1q') // reQuest
  // .replace(/([^\.])response\b/g, '$1s') // reSponse
  // .replace(/([^\.])match\b/g, '$1m') // Match
  // .replace(/([^\.])prop\b/g, '$1k') // Key
  // .replace(/([^\.])url\b/g, '$1u') // Url
writeFileSync('./dist/objectified-array.js', minifiedBase)
console.log('minifying variables --> dist/objectified-array.js')

const test = readFileSync('./src/objectified-array.spec.js', { encoding: 'utf-8' })
const minifiedTest = test.replace('objectified-array.js', 'objectified-array.min.js')
writeFileSync('./dist/objectified-array.spec.js', minifiedTest)
console.log('creating dist tests --> dist/objectified-array.spec.js')