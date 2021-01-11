const { ObjectifiedArray } = require('./objectified-array')

const NUMBERS = [1, 2, 6]

const CATS = [
  { id: 2, name: 'Mittens' },
  { id: 4, name: 'Fluffy' },
  { id: 6, name: 'Kitty' },
]

class ExtendedNumber extends Number {}

class Cat {
  constructor(config = {}) {
    Object.assign(this, config)
  }
}

describe('Class: ObjectifiedArray(...args, config?:object)', () => {
  describe('constructor()', () => {
    describe('honors native Array constructor', () => {
      it('new ObjectifiedArray(1, 2, 6) --> [1, 2, 6]', () => {
        const items = new ObjectifiedArray(...NUMBERS)
        expect(items[2]).toEqual(6)
      })
      it('new ObjectifiedArray(1, 2, 6, {config}) --> [1, 2, 6]', () => {
        const items = new ObjectifiedArray(...NUMBERS, { by: { twoX: i => i*2 } })
        expect(items[2]).toEqual(6)
        expect(items.by.twoX[4]).toBe(2)
      })
      it('new ObjectifiedArray(3) --> [undefined, undefined, undefined]', () => {
        const items = new ObjectifiedArray(3)
        expect(items.length).toEqual(3)
      })
      it('new ObjectifiedArray(1, 2, 6, { items: [7] }) --> [1, 2, 6, 7]', () => {
        const items = new ObjectifiedArray(...NUMBERS, { items: [7] })
        expect(items.length).toEqual(4)
        expect(Array.from(items)).toEqual([...NUMBERS, 7])
      })
      it('new ObjectifiedArray(2, { items: [7] }) --> [undefined, undefined, 7]', () => {
        const items = new ObjectifiedArray(2, { items: [7] })
        expect(items.length).toEqual(3)
        expect(Array.from(items)).toEqual([undefined, undefined, 7])
      })
      it('new ObjectifiedArray(\'abc\', \'def\') --> [\'abc\', \'def\']', () => {
        const items = new ObjectifiedArray('abc', 'def')
        expect(items.length).toEqual(2)
        expect(Array.from(items)).toEqual(['abc', 'def'])
      })
    })
  })
  describe('config options (all are optional)', () => {
    describe('items:Array = []', () => {
      it('populates self with items', () => {
        const a = new ObjectifiedArray({ items: NUMBERS })
        expect(a.length).toBe(3)
      })

      it('works with strings', () => {
        const a = new ObjectifiedArray({
          items: ['foo', 'bar', 'baz'],
          by: { special: v => `${v}6` },
        })
        expect(a.length).toBe(3)
        expect(a.by.special.foo6).toBe('foo')
      })
    })

    describe('as:class|function', () => {
      it('casts items as new class instantiations, when passed a class (e.g. { as: Person })', () => {
        const a = new ObjectifiedArray({
          items: NUMBERS,
          as: ExtendedNumber,
        })
        expect(JSON.stringify(a)).toBe(JSON.stringify(NUMBERS))
        expect(a[0].constructor.name).toBe('ExtendedNumber')

        a.unshift(8)
        expect(Number(a[0])).toBe(8)
        expect(a.length).toBe(4)

        a.unshift(9, 10) // 10 is ignored, as it's passed with 9 to a single constructor
        expect(Number(a[0])).toBe(9)
        expect(Number(a[1])).toBe(10)
        expect(a.length).toBe(6)
      })

      it('casts items with function, when passed a function (e.g. { as: v => `${v}` })', () => {
        const a = new ObjectifiedArray({
          items: NUMBERS,
          as: v => `${v}`,
        })
        expect(Array.from(a)).toEqual(['1', '2', '6'])
      })

      it('casts items with constructor function, when passed a constructor function (e.g. { as: String })', () => {
        const a = new ObjectifiedArray({
          items: NUMBERS,
          as: String,
        })
        expect(Array.from(a)).toEqual(['1', '2', '6'])
      })
    })

    describe('by:string|array[string]|object --> automatically indexes by these key(s)', () => {
      it('by:string --> { by: \'name\' }', () => {
        const a = new ObjectifiedArray({ by: 'name' })

        expect(typeof a.$.by.name).toBe('function')
      })
      it('by:array[string] --> { by: [\'id\', \'name\'] }', () => {
        const a = new ObjectifiedArray({ by: ['id', 'name'] })

        expect(typeof a.$.by.id).toBe('function')
        expect(typeof a.$.by.name).toBe('function')
      })
      it('by:object --> { by: { id: i => i.id, name => i.name } }', () => {
        const a = new ObjectifiedArray({ by: { id: i => i.id } })

        expect(typeof a.$.by.id).toBe('function')
      })
    })

    describe('that:object --> automatically creates that based on filter functions', () => {
      it('that:object --> map of group-definitions, e.g. { that: { hasId: i => !!i.id } }', () => {
        const a = new ObjectifiedArray({ that: { hasId: i => Boolean(i.id) } })

        expect(typeof a.that.hasId).toBe('object')
        expect(typeof a.$.that.hasId).toBe('function')
      })
    })
  })

  describe('BEHAVIOR', () => {
    describe('Modified native Array methods', () => {
      describe('.pop()', () => {
        it('removes item from end', () => {
          const a = new ObjectifiedArray({ items: NUMBERS })
          const b = a.pop()

          expect(a.length).toBe(2)
          expect(b).toBe(6)
        })

        it('same return signature', () => {
          const a = new ObjectifiedArray({ items: NUMBERS })
          const b = Array(...NUMBERS)

          expect(a.pop()).toBe(b.pop())
          expect(a.pop(5)).toBe(b.pop(5))
        })
      })

      describe('.push(item1, item2, ...)', () => {
        it('adds item(s) to end', () => {
          const a = new ObjectifiedArray({ as: ExtendedNumber })
          a.push(6)
          expect(a.length).toBe(1)

          a.push(1, 2)
          expect(a.length).toBe(3)
        })

        it('same return signature', () => {
          const a = new ObjectifiedArray({ items: NUMBERS })
          const b = Array(...NUMBERS)

          expect(a.push()).toBe(b.push())
          expect(a.push(5)).toBe(b.push(5))
        })
      })

      describe('.shift()', () => {
        it('removes item from start', () => {
          const a = new ObjectifiedArray({ items: NUMBERS })
          const b = a.shift()

          expect(a.length).toBe(2)
          expect(b).toBe(1)
        })

        it('same return signature', () => {
          const a = new ObjectifiedArray({ items: NUMBERS })
          const b = Array(...NUMBERS)

          expect(a.shift()).toBe(b.shift())
          expect(a.shift(5)).toBe(b.shift(5))
        })
      })

      describe('.splice()', () => {
        it('removes item from middle', () => {
          const a = new ObjectifiedArray({
            items: NUMBERS,
            by: {
              triple: i => i * 3,
            },
            that: {
              under4: i => i < 4,
            }
          })
          expect(a.by.triple[3]).toBe(1)
          const b = a.splice(1, 1) // remove one

          expect(a.length).toBe(2)
          expect(b.length).toEqual(1)
          expect(a.by.triple[6]).toBe(undefined)
        })

        it('same return signature', () => {
          const a = new ObjectifiedArray({ items: NUMBERS })
          const b = Array(...NUMBERS)

          expect(a.splice()).toEqual(b.splice())
          expect(a.splice(1, 2)).toEqual(b.splice(1, 2))
        })
      })

      describe('.unshift(item1, item2, ...)', () => {
        it('adds item(s) to start', () => {
          const a = new ObjectifiedArray({ items: NUMBERS })
          a.unshift(9)
          expect(a.length).toBe(4)
          expect(Array.from(a)).toEqual([9, 1, 2, 6])
        })

        it('same return signature', () => {
          const a = new ObjectifiedArray({ items: NUMBERS })
          const b = Array(...NUMBERS)

          expect(a.unshift()).toBe(b.unshift())
          expect(a.unshift(1, 2)).toEqual(b.unshift(1, 2))
        })
      })
    })

    describe('new methods', () => {
      describe('.add(item1, item2, ...', () => {
        it('adds items to end (mirrors push)', () => {
          const a = new ObjectifiedArray({ items: [1, 2] })
          a.add(6)
          a.add(7, 8)

          expect(Array.from(a)).toEqual([1, 2, 6, 7, 8])
        })

        it('returns added item (single)', () => {
          const a = new ObjectifiedArray()

          expect(a.add(4)).toEqual(4)
        })

        it('returns array of added items (multiple)', () => {
          const a = new ObjectifiedArray()

          expect(a.add(4, 6)).toEqual([4, 6])
        })
      })

      describe('.remove(item1, item2, ...)', () => {
        it('removes item(s)', () => {
          const a = new ObjectifiedArray({ items: NUMBERS })
          a.remove(2)
          expect(Array.from(a)).toEqual([1, 6])

          const removed = a.remove(1, 6)
          expect(a.length).toBe(0)
          expect(removed).toEqual([1, 6])
        })

        it('removes multiple item(s)', () => {
          const a = new ObjectifiedArray({ items: [1, 1, 1, 5, 6] })
          a.remove(1)
          expect(Array.from(a)).toEqual([5, 6])
        })

        it('works with by/that and with classes (advanced)', () => {
          const cats = new ObjectifiedArray({
            items: CATS,
            as: Cat,
            by: {
              name: c => c.name,
            },
            that: {
              startsWithF: i => Boolean(i.name.match(/^f/i))
            }
          })
          const Fluffy = cats.find(c => c.name === 'Fluffy')
          expect(cats.by.name.Fluffy).toBe(Fluffy)
          expect(cats.that.startsWithF.includes(Fluffy)).toBe(true)

          const removed = cats.remove(Fluffy)
          expect(cats.length).toBe(2)
          expect(cats.by.name.Fluffy).toBe(undefined)
          expect(removed).toBe(Fluffy)
          expect(cats.that.startsWithF.includes(Fluffy)).toBe(false)
        })

        it('returns removed item (single)', () => {
          const a = new ObjectifiedArray({ items: NUMBERS })

          expect(a.remove(2)).toEqual(2)
        })

        it('returns array of removed items (multiple)', () => {
          const a = new ObjectifiedArray({ items: NUMBERS })

          expect(a.remove(1, 6)).toEqual([1, 6])
        })
      })
    })

    describe('Added properties', () => {
      it('.by[key] --> accessible when mapped with "by" option', () => {
        const a = new ObjectifiedArray({
          items: CATS,
          as: Cat,
          by: {
            id: i => i.id,
          }
        })

        expect(a.length).toEqual(3)
        expect(a.by.id[6].name).toEqual('Kitty')
      })

      it('.that[key] --> returns array of matching items (when group definition returns Boolean', () => {
        const a = new ObjectifiedArray({
          items: CATS,
          as: Cat,
          by: {
            id: i => i.id,
          },
          that: {
            startsWithF: i => Boolean(i.name.match(/^f/i)),
          }
        })

        expect(a.length).toEqual(3)
        expect(a.that.startsWithF.length).toBe(1)
      })

      it('[key] --> returns object of that at key when group definition returns a non-boolean', () => {
        const a = new ObjectifiedArray({
          items: CATS,
          as: Cat,
          by: {
            id: i => i.id,
          },
          that: {
            startsWith: i => i.name[0],
          }
        })

        expect(a.length).toEqual(3)
        expect(a.that.startsWith.F.length).toBe(1)
      })

      it('[key] --> returns object of that at key when group definition returns a non-boolean', () => {
        const a = new ObjectifiedArray({
          items: [
            { id: 1, name: 'foo' },
            { id: 2, name: 'bar' },
            { id: 3 },
          ],
          that: {
            has: i => i.name && 'name',
          },
        })

        expect(a.length).toBe(3)
        expect(a.that.has.name.length).toBe(2)

        a.remove(a[0])
        expect(a.length).toBe(2)

        a.remove(a[0])
        expect(a.length).toBe(1)
        expect(a.that.has.name.length).toBe(0)
      })
    })
  })
})
