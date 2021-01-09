const { ObjectifiedArray } = require('./objectified-array')

const NUMBERS = [1, 2, 6]

const CATS = [
  { id: 2, name: 'Mittens' },
  { id: 4, name: 'Fluffy' },
  { id: 6, name: 'Kitty' },
]

class ExtendedNumber extends Number {}

class AdvancedConstructor {
  constructor(a, b) {
    this.a = a
    this.b = b
  }
}


class Cat {
  constructor(config = {}) {
    Object.assign(this, config)
  }
}

describe('Class: ObjectifiedArray(...args, config:object?)', () => {
  describe('CONSTRUCTOR', () => {
    describe('honors native constructor', () => {
      it('new ObjectifiedArray(1, 2, 6) --> [1,2,6]', () => {
        const items = new ObjectifiedArray(...NUMBERS)
        expect(items[2]).toEqual(6)
      })
      it('new ObjectifiedArray(1, 2, 6, {config}) --> [1,2,6]', () => {
        const items = new ObjectifiedArray(...NUMBERS, { by: { twoX: i => i*2 }})
        expect(items[2]).toEqual(6)
        expect(items.by.twoX[4]).toBe(2)
      })
      it('new ObjectifiedArray(3) --> [undefined, undefined, undefined]', () => {
        const items = new ObjectifiedArray(3)
        expect(items.length).toEqual(3)
      })
      it('new ObjectifiedArray(1, 2, 6, { items: [7] }) --> [1,2,6,7]', () => {
        const items = new ObjectifiedArray(...NUMBERS, { items: [7] })
        expect(items.length).toEqual(4)
        expect(Array.from(items)).toEqual([...NUMBERS, 7])
      })
      it('new ObjectifiedArray(2, { items: [7] }) --> [undefined, undefined, 7]', () => {
        const items = new ObjectifiedArray(2, { items: [7] })
        expect(items.length).toEqual(3)
        expect(Array.from(items)).toEqual([undefined, undefined, 7])
      })
    })
  })
  describe('CONFIG', () => {
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

    describe('as:class|function = undefined', () => {
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
        expect(Number(a[1])).toBe(8)
        expect(a.length).toBe(5)
      })

      it('casts items with constructor function, when passed a function (e.g. { as: v => String(v) })', () => {
        const a = new ObjectifiedArray({
          items: NUMBERS,
          as: v => String(v),
        })
        expect(Array.from(a)).toEqual(['1', '2', '6'])
      })

      it('can use multi-param class constructors, e.g. constructor(a,b)', () => {
        const a = new ObjectifiedArray({ as: AdvancedConstructor })
        a.push('foo', 'bar')
        expect(a[0]).toEqual({ a: 'foo', b: 'bar' })
        expect(a.length).toBe(1)
      })
    })

    it('by:object --> map of index-getters, e.g. by: { id: i => i.id }', () => {
      const a = new ObjectifiedArray({ by: { id: i => i.id } })

      expect(typeof a.$.by.id).toBe('function')
    })

    it('groups:object --> map of group-definitions, e.g. by: { hasId: i => !!i.id }', () => {
      const a = new ObjectifiedArray({ groups: { hasId: i => Boolean(i.id) } })

      expect(typeof a.groups.hasId).toBe('object')
      expect(typeof a.$.groups.hasId).toBe('function')
    })
  })

  describe('MODIFIED BUILT-IN METHODS (Array)', () => {
    describe('.pop()', () => {
      it('removes item from end', () => {
        const a = new ObjectifiedArray({ items: NUMBERS })
        const b = a.pop()

        expect(a.length).toBe(2)
        expect(b).toBe(6)
      })
    })

    describe('.push(item1, item2, ...)', () => {
      it('adds item(s) to end', () => {
        const a = new ObjectifiedArray()
        a.push(6)

        expect(a.length).toBe(1)
      })
    })

    describe('.shift()', () => {
      it('removes item from start', () => {
        const a = new ObjectifiedArray({ items: NUMBERS })
        const b = a.shift()

        expect(a.length).toBe(2)
        expect(b).toBe(1)
      })
    })

    describe('.splice()', () => {
      it('removes item from middle', () => {
        const a = new ObjectifiedArray({
          items: NUMBERS,
          by: {
            triple: i => i * 3,
          },
          groups: {
            under4: i => i < 4,
          }
        })
        expect(a.by.triple[3]).toBe(1)
        const b = a.splice(1, 1) // remove one

        expect(a.length).toBe(2)
        expect(b.length).toEqual(1)
        expect(a.by.triple[6]).toBe(undefined)
      })
    })

    describe('.unshift(item1, item2, ...)', () => {
      it('adds item(s) to start', () => {
        const a = new ObjectifiedArray({ items: NUMBERS })
        a.unshift(9)
        expect(a.length).toBe(4)
        expect(Array.from(a)).toEqual([9, 1, 2, 6])
      })
    })
  })

  describe('EXTENDED METHODS', () => {
    describe('.add(item1, item2, ...', () => {
      it('adds items to end (mirrors push)', () => {
        const a = new ObjectifiedArray({ items: [1, 2] })
        a.add(6)
        a.add(7, 8)

        expect(Array.from(a)).toEqual([1, 2, 6, 7, 8])
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

      it('works with by/groups and with classes (advanced)', () => {
        const cats = new ObjectifiedArray({
          items: CATS,
          as: Cat,
          by: {
            name: c => c.name,
          },
          groups: {
            startsWithF: i => i.name.match(/^f/i)
          }
        })
        const Fluffy = cats.find(c => c.name === 'Fluffy')
        expect(cats.by.name.Fluffy).toBe(Fluffy)
        expect(cats.groups.startsWithF.includes(Fluffy)).toBe(true)

        const removed = cats.remove(Fluffy)
        expect(cats.length).toBe(2)
        expect(cats.by.name.Fluffy).toBe(undefined)
        expect(removed).toBe(Fluffy)
        expect(cats.groups.startsWithF.includes(Fluffy)).toBe(false)
      })
    })
  })

  describe('EXTENDED PROPERTIES', () => {
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

    it('.groups[key] --> returns array of matching items', () => {
      const a = new ObjectifiedArray({
        items: CATS,
        as: Cat,
        by: {
          id: i => i.id,
        },
        groups: {
          startsWithF: i => i.name.match(/^f/i)
        }
      })

      expect(a.length).toEqual(3)
      expect(a.groups.startsWithF.length).toBe(1)
    })
  })
})
