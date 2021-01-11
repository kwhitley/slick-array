![Logo][logo-image]

[![npm package][npm-image]][npm-url]
[![minified + gzipped size][gzip-image]][gzip-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Open Issues][issues-image]][issues-url]

Native JavaScript Array, but extended with custom indexing and group support... or "treated like an object". #badjoke #forgiveme #terrible #notfunny #brokensenseofhumor

# Why?
Collections often need a fast lookup (e.g. by ID) where an Object would be appropriate, yet we want to iterate over them like a standard Array.  This combines the best of both worlds.

## Installation
```
yarn add objectified-array
```

## Features

- [x] **Nearly fully interchangeable with built-in Array** - (which it extends) with the one exception that in order to preserve indexes/groups, you need to use the functional modifiers of the array structure (e.g. `push()`, `pop()`, `shift()`, `unshift()`, `splice()`), rather than direct setting of elements (e.g. `items[1] = 'something'`)
- [x] **Creates lookups upon entry/exit** - this is HIGHLY performant, with the only *tiny* overhead being done at time of entry, rather than on future lookups/gets.
- [x] **Creates groups upon extry/exit** - take individual record lookups a step further with groups, where groups are created/injected into upon entry/exit as well (not as performant as "by" lookups).
- [x] **Optionally cast items with a class/function** - can automatically cast new items to a defined class/function.
- [x] **Low memory overhead** - all internal structures are by-reference, meaning very little memory overhead beyond your raw data.
- [x] **Incredibly fast** - We use faster-than-native internal methods when possible (e.g. push()), and all lookups are created at write time, so reads simply access existing properties (TLDR; it's very fast).
- [x] **Small, with zero dependencies** - ~820 bytes gzipped.  We'll work to minimize this as much as possible, to justify using in minimalist projects.

# Simple Example
```js
import { ObjectifiedArray } from 'objectified-array'

// create an array
const items = new ObjectifiedArray({ by: ['id', 'name'] })

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
import { ObjectifiedArray } from 'objectified-array'

class Kitten {
  constructor(config = {}) {
    Object.assign(this, config)
  }

  talk() {
    return 'meow!'
  }
}

// create an array
const kittens = new ObjectifiedArray({
  as: Kitten,
  by: {
    id: item => item.id,
    name: item => item.name,
  },
  groups: {
    startsWithF: item => item.name.match(/^f/i),
  },
  items: [
    { id: 12, name: 'Fluffy' },
    { id: 15, name: 'Mittens' },
    { id: 3, name: 'Furious George' },
  ],
})

// test some functionality
kittens.length // 3
kittens.map(i => i.id) // [12,15,3] - still iterates like a typical array
kittens[0].talk() // 'meow!'
kittens.by.id[12] // Kitten { id: 12, name: 'Fluffy' }
kittens.by.name.Mittens // Kitten { id: 15, name: 'Mittens' }
kittens.groups.startsWithF // [ Kitten { id: 12, name: 'Fluffy' }, Kitten { id: 3, name: 'Furious George' } ]

// indexes are modified on the fly, not just at instantiation
kittens.push({ id: 2, name: 'Ringo' })
kittens.length // 4
kittens.by.name.Ringo // Kitten { id: 2, name: 'Ringo' }
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

[twitter-image]:https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fobjectified-array
[logo-image]:https://user-images.githubusercontent.com/865416/79531114-fa0d8200-8036-11ea-824d-70d84164b00a.png
[gzip-image]:https://img.shields.io/bundlephobia/minzip/objectified-array
[gzip-url]:https://bundlephobia.com/result?p=objectified-array
[issues-image]:https://img.shields.io/github/issues/kwhitley/objectified-array
[issues-url]:https://github.com/kwhitley/objectified-array/issues
[npm-image]:https://img.shields.io/npm/v/objectified-array.svg
[npm-url]:http://npmjs.org/package/objectified-array
[travis-image]:https://travis-ci.org/kwhitley/objectified-array.svg?branch=v1.x
[travis-url]:https://travis-ci.org/kwhitley/objectified-array
[david-image]:https://david-dm.org/kwhitley/objectified-array/status.svg
[david-url]:https://david-dm.org/kwhitley/objectified-array
[coveralls-image]:https://coveralls.io/repos/github/kwhitley/objectified-array/badge.svg?branch=v1.x
[coveralls-url]:https://coveralls.io/github/kwhitley/objectified-array?branch=v1.x