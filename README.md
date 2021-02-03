# SlickArray

[![npm package][npm-image]][npm-url]
[![minified + gzipped size][gzip-image]][gzip-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Open Issues][issues-image]][issues-url]

Native JavaScript Array, but extended with custom indexing and group support for super-fast lookups.

## Installation
```
yarn add slick-array
```

## Features

- **Creates indexes and groups upon extry/exit**
- **Cast items with a class/function**
- **Low memory overhead**
- **Small, with zero dependencies** ~830 bytes gzipped
- **Interchangeable with built-in Array***

 * *CAVEAT: in order to preserve indexes/groups, use `push`/`pop`/`shift`/`unshift`/`splice` to add/remove/replace items, rather than direct setting of elements (e.g. don't do this: `items[1] = 'something new'`)*

 ** *PERFORMANCE: For situations where utmost performance is required and lookups are infrequent, use a native Array.  It's much faster!*

# Simple Example
```js
import { SlickArray } from 'slick-array'

// create an array
const items = new SlickArray({ by: ['id', 'name'] })

items.push(
  { id: 1, name: 'foo' },
  { id: 2, name: 'bar' },
  { id: 6, name: 'baz' },
)

// normal array functionality
items.map(i => i.name)              // ['foo', 'bar', 'baz']

// fancy new features
items.by.id[2] // { id: 2, name: 'bar' }
items.by.name.foo // { id: 1, name: 'foo' }
```

# new SlickArray(...args, options = {})
### Options (all optional)

| Name | Type(s) | Description | Examples |
| --- | --- | --- | --- |
| `as` | `class`, `function` | casts items as class\|function on entry | `as: Kitten`<br />`as: i => ({ ...i })` |
| `by` | `String`, `Array`, `Object` | create indexes | `by: 'id'`<br />`by: ['id', 'name']`<br />`by: { id: i => i.id }` |
| `groups` | `String`, `Array`, `Object` | create groups and/or subgroups | `groups: 'isValid'`<br />`groups: ['isValid']`<br />`groups: { valid: i => !!i.isValid }`<br />`groups: { valid: i => i.isValid ? 'yes' : 'no' }` |
| `items` | `Array` | preload items upon construction | `items: [14, 15, 16]`<br />`items: [{ id: 14 }, { id: 15 }]` |


# Advanced Example
```js
import { SlickArray } from 'slick-array'

class Kitten {
  constructor(config = {}) {
    Object.assign(this, config)
  }

  talk() {
    return 'meow!'
  }
}

// create an array
const kittens = new SlickArray({
  as: Kitten, // cast items using this function/class
  by: {
    id: item => item.id,
    name: item => item.name,
  },
  groups: {
    // boolean "true" response into a shallow object
    thatStartWithF: item => Boolean(item.name.match(/^f/i)),
    // otherwise return is used as subgroup key (including undefined)
    startingWith: item => item.name[0],
  },
  items: [
    { id: 12, name: 'Fluffy' },
    { id: 15, name: 'Mittens' },
    { id: 3, name: 'Furious George' },
  ],
})

// yep, it's still an Array...
kittens.length // 3
kittens.map(i => i.id) // [12,15,3] - still iterates like a typical array

// access individual items via "by"
kittens.by.id[12] // Kitten { id: 12, name: 'Fluffy' }
kittens.by.name.Mittens // Kitten { id: 15, name: 'Mittens' }

// or access groups via "that"
kittens.thatStartWithF // [ Kitten { id: 12, name: 'Fluffy' }, Kitten { id: 3, name: 'Furious George' } ]
kittens.startingWith.F // [ Kitten { id: 12, name: 'Fluffy' }, Kitten { id: 3, name: 'Furious George' } ]
kittens.startingWith.M // [ Kitten { id: 15, name: 'Mittens' } ]

// you can keep adding items, and indexes will be added automatically
kittens.push({ id: 2, name: 'Ringo' })
kittens.length // 4
kittens.by.name.Ringo.talk() // 'meow!' - it's a Kitten after all
kittens.startingWith.R // [ Kitten { id: 2, name: 'Ringo' } ]
```

## Testing & Contributing
1. fork repo
2. add code
3. run tests (add your own if needed) `yarn dev`
4. verify tests run once minified `yarn verify`
5. commit files (do not manually modify version numbers)
6. submit PR
7. we'll add you to the credits :)

# Contributors
The real heroes (those that help me maintain this) will be attributed below!

[twitter-image]:https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fslick-array
[gzip-image]:https://img.shields.io/bundlephobia/minzip/slick-array
[gzip-url]:https://bundlephobia.com/result?p=slick-array
[issues-image]:https://img.shields.io/github/issues/kwhitley/slick-array
[issues-url]:https://github.com/kwhitley/slick-array/issues
[npm-image]:https://img.shields.io/npm/v/slick-array.svg
[npm-url]:http://npmjs.org/package/slick-array
[travis-image]:https://travis-ci.org/kwhitley/slick-array.svg?branch=master
[travis-url]:https://travis-ci.org/kwhitley/slick-array
[david-image]:https://david-dm.org/kwhitley/slick-array/status.svg
[david-url]:https://david-dm.org/kwhitley/slick-array
[coveralls-image]:https://coveralls.io/repos/github/kwhitley/slick-array/badge.svg?branch=master
[coveralls-url]:https://coveralls.io/github/kwhitley/slick-array?branch=master
