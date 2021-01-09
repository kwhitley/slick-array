![Logo][logo-image]

[![npm package][npm-image]][npm-url]
[![minified + gzipped size][gzip-image]][gzip-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Open Issues][issues-image]][issues-url]

Native JavaScript Array, but extended with custom indexing and group support.

Indexes and groups are added per-item at time of insert/delete (via native Array functions), thus are low cost, even for huge arrays, and essentially zero-cost for lookups.  Since they are indexed by reference only, there is very little additional memory overhead.  As this simply extends a native Array, none of the built-in Array functionality is lost.

## Installation

```
yarn add objectified-array
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

// create a router
const kittens = new ObjectifiedArray({
  as: Kitten,
  by: {
    id: item => item.id,
    name: item => item.name,
  },
  that: {
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
kittens.that.startsWithF // [ Kitten { id: 12, name: 'Fluffy' }, Kitten { id: 3, name: 'Furious George' } ]

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