const Benchmark = require('benchmark')
const { ObjectifiedArray } = require('./src/objectified-array')
const { ObjectifiedArray: DistArray } = require('./dist/objectified-array.min.js')
const suite = new Benchmark.Suite
class NewArray extends Array {}

// add tests
suite
  // .add('[native Array] arr.push(...numbers)', function() {
  //   const arr = new Array()
  //   const fill = (new Array(100)).fill(0).map((v, i) => i)
  //   arr.push(...fill)
  // })
  // .add('[native Array] Reflect.apply(arr.push, arr, numbers)', function() {
  //   const arr = new Array()
  //   const fill = (new Array(100)).fill(0).map((v, i) => i)
  //   Reflect.apply(arr.push, arr, fill)
  // })
  // .add('ObjectifiedArray.push(number)', function() {
  //   const arr = new ObjectifiedArray()
  //   const fill = (new Array(100)).fill(0).map((v, i) => i)
  //   arr.push(...fill)
  // })
  // .add('ObjectifiedArray.push(object)', function() {
  //   const arr = new ObjectifiedArray()
  //   const fill = (new Array(100)).fill(0).map((v, id) => ({ id }))
  //   arr.push(...fill)
  // })
  // .add('indexed ObjectifiedArray({ id }).push(object)', function() {
  //   const arr = new ObjectifiedArray({ by: 'id' })
  //   const fill = (new Array(100)).fill(0).map((v, id) => ({ id }))
  //   arr.push(...fill)
  // })
  .add('indexed ObjectifiedArray({ id, groups }).push(object)', function() {
    const arr = new ObjectifiedArray({ by: 'id', groups: { id: i => i } })
    const fill = (new Array(100)).fill(0).map((v, id) => ({ id }))
    arr.push(...fill)
  })
  // .add('cast ObjectifiedArray({ id, groups }).push(object)', function() {
  //   const arr = new ObjectifiedArray({ as: String })
  //   const fill = (new Array(100)).fill(0).map((v, id) => ({ id }))
  //   arr.push(...fill)
  // })
  // .add('ObjectifiedArray.push(number)', function() {
  //   const arr = new ObjectifiedArray()
  //   const fill = (new Array(100)).fill(0).map((v, i) => i)
  //   arr.add(...fill)
  // })
  // .add('ObjectifiedArray.push(number)', function() {
  //   const arr = new ObjectifiedArray()
  //   const fill = (new Array(100)).fill(0).map((v, i) => i)
  //   arr.index(...fill)
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