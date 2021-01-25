# SlickArray

[![npm package][npm-image]][npm-url]
[![minified + gzipped size][gzip-image]][gzip-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Open Issues][issues-image]][issues-url]

Native JavaScript Array, but extended with custom indexing and group support for super-fast lookups.

# Why?
Collections often need a fast lookup (e.g. by ID) where an Object would be appropriate, yet we want to iterate over them like a standard Array.  This combines the best of both worlds.

# Disclaimer
**Over the next few days, I'll be finalizing the API (especially around groups) and output structure.  This may change substantially before finalizing as a 1.x release.  During this period, all feedback/suggestions are welcome via [issues](https://github.com/kwhitley/slick-array/issues)! **

## Installation
```
yarn add slick-array
```

## Features

- [x] **Nearly fully interchangeable with built-in Array** - (which it extends) with the one exception that in order to preserve indexes/groups, you need to use the functional modifiers of the array structure (e.g. `push()`, `pop()`, `shift()`, `unshift()`, `splice()`), rather than direct setting of elements (e.g. `items[1] = 'something'`)
- [x] **Creates lookups upon entry/exit** - this is *much* faster than scanning for an item when needed.  All work is done up front upon entry/exit, leaving zero-cost index behind.  **CAVEAT: This is several times slower for large push operations than a native Array, so if you need performance and no lookups, please use Array instead!**
- [x] **Creates groups upon extry/exit** - take individual record lookups a step further with groups (and subgroups), where groups are created/injected into upon entry/exit as well (at an additional cost).
- [x] **Optionally cast items with a class/function** - SlickArray can automatically cast new items to a defined class/function.
- [x] **Low memory overhead** - all internal structures are by-reference, meaning very little memory overhead beyond your raw data.
- [x] **Small, with zero dependencies** - ~820 bytes gzipped.  We'll work to minimize this as much as possible, to justify using in minimalist projects.

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
    thatStartWithF: item => item.name.match(/^f/i), // any non-string, truthy response groups in shallow group
    startingWith: item => item.name[0], // if return is a String, use as key for subgroup
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
