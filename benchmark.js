const Benchmark = require('benchmark')
const { SlickArray } = require('./src/slick-array')
const { SlickArray: DistArray } = require('./dist/slick-array.min.js')
const suite = new Benchmark.Suite
class NewArray extends Array {}

const objectFill = (new Array(100)).fill(0).map((v, id) => ({ id }))
const numberFill = (new Array(100)).fill(0).map((v, id) => id)
const arrayFill = (new Array(100)).fill(0).map((v, id) => [id, v])
const empty = []

// add tests
suite
  // .add('iterating over array (for var a in)', function() {
  //   for (var i in numberFill) {
  //   }
  // })
  // .add('iterating over array (for var a in) + assign value', function() {
  //   for (var i in numberFill) {
  //     let v = numberFill[i]
  //   }
  // })
  // .add('iterating over array (for var a of)', function() {
  //   for (var v of numberFill) {
  //   }
  // })
  // .add('iterating over array (for var [a,b] of arrays of array)', function() {
  //   for (var [a, b] of arrayFill) {
  //   }
  // })
  // .add('iterating over array (for var [a,b] of entries)', function() {
  //   for (var [a, b] of numberFill.entries()) {
  //   }
  // })
  // .add('if statement', () => {
  //   if (numberFill.length === 0) {}
  // })
  // .add('for (var of empty)', () => {
  //   for (var i of empty) {}
  // })
  // .add('for (var i=0; i<items.length; i++)', () => {
  //   for (var i=0; i<numberFill.length; i++) {}
  // })
  // .add('for (var i=0; i<fixedLength; i++)', () => {
  //   const len = numberFill.length
  //   for (var i=0; i<len; i++) {}
  // })
  // .add('for (var i=len-1; i>=0; i--)', () => {
  //   const len = numberFill.length
  //   for (var i=len-1; i>=0; i--) {}
  // })
  // .add('[native Array] Array.push(...numbers)', function() {
  //   const arr = new Array()
  //   const fill = (new Array(100)).fill(0).map((v, i) => i)
  //   arr.push(...numberFill)
  // })
  // .add('[native Array] Array.push(...objects)', function() {
  //   const arr = new Array()
  //   const fill = (new Array(100)).fill(0).map((v, i) => i)
  //   arr.push(...objectFill)
  // })
  // .add('SlickArray.push(number)', function() {
  //   const arr = new SlickArray()
  //   arr.push(...numberFill)
  // })
  // .add('SlickArray.push(object)', function() {
  //   const arr = new SlickArray()
  //   arr.push(...objectFill)
  // })
  .add('indexed SlickArray({ id }).push(object)', function() {
    const arr = new SlickArray({ by: 'id' })
    arr.push(...objectFill)
  })
  // .add('just instantiation SlickArray({ id, groups })', function() {
  //   const arr = new SlickArray({ by: 'id', groups: { id: i => i.id } })
  // })
  // .add('indexed SlickArray({ id, groups }).push(object)', function() {
  //   const arr = new SlickArray({ by: 'id', groups: { id: i => i.id } })
  //   arr.push(...objectFill)
  // })
  // .add('cast SlickArray({ id, groups }).push(object)', function() {
  //   const arr = new SlickArray({ as: String })
  //   arr.push(...objectFill)
  // })
  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  // run async
  .run({ 'async': true })