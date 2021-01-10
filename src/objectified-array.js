const isClass = v => typeof v === 'function' && v.toString().match(/^\s*class\s+/)

const unifyBy = by => {
  if (typeof by === 'string') return { [by]: i => i[by] }
  if (Array.isArray(by)) {
    return by.reduce((acc, key) => (acc[key] = i => i[key]) && acc, {})
  }

  return by
}

class ObjectifiedArray extends Array {
  constructor(...args) {
    let config = args.pop()
    if (typeof config !== 'object' || Array.isArray(config)) {
      if (config) {
        args.push(config)
      }
      config = {}
    }

    const {
      by = {},
      groups = {},
      items = [],
      as = undefined // optional constructor for new items
    } = config

    // prepend normal array stuff
    if (args.length) {
      if (args.length > 1) {
        items.unshift(...args)
      } else {
        items.unshift(...Array(...args))
      }
    }

    super()

    // public
    this.by = {}
    this.groups = {}
    this.$ = {
      by: unifyBy(by),
      as,
      groups,
    }

    // initialize groups
    for (const key in groups) {
      this.groups[key] = []
    }

    if (items.length) {
      this.add(...items)
    }
  }

  // ADDED FUNCTIONS mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm

  add(...items) {
    for (const i of items) {
      this.push(i)
    }

    return items.length > 1 ? items : items[0]
  }

  remove(...items) {
    if (items.length) {
      for (const item of items) {
        let index
        while ((index = this.indexOf(item)) !== -1) {
          super.splice(index, 1)
          this.unindex(item)
        }
      }
    }

    return items.length > 1 ? items : items[0]
  }


  // EXTENDED FUNCTIONS mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm

  pop() {
    const item = super.pop()

    return this.unindex(item)
  }

  push(...items) {
    if (!items.length) return super.push()

    items = Reflect.apply(this.index, this, items)

    return Reflect.apply(super.push, this, Array.isArray(items) && items.length ? items : [items])
  }

  shift() {
    const item = super.shift()

    return this.unindex(item)
  }

  splice(...args) {
    const items = super.splice(...args)

    return Array.from(this.unindex(items))
  }

  unshift(...items) {
    if (!items.length) return super.push()

    items = Reflect.apply(this.index, this, items)

    return Reflect.apply(super.unshift, this, Array.isArray(items) && items.length ? items : [items])
  }

  // INTERNAL FUNCTIONS mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm

  index(...items) {
    const as = this.$.as
    let item = items[0]

    if (as) {
      item = isClass(as) ? new as(...items) : as(...items)
    } else if (Array.isArray(items) && items.length > 1) {
      return items.map(i => this.index(i))
    }

    // maps
    for (const path in this.$.by) {
      const key = this.$.by[path](item)
      if (!this.by[path]) {
        this.by[path] = {}
      }

      this.by[path][key] = item
    }

    // groups
    for (const [path, fn] of Object.entries(this.$.groups)) {
      if (fn(item)) {
        this.groups[path].push(item)
      }
    }

    return item
  }

  unindex(item) {
    // maps
    for (const path in this.$.by) {
      const key = this.$.by[path](item)
      Reflect.deleteProperty(this.by[path], key)
    }

    // groups
    for (const [path, fn] of Object.entries(this.$.groups)) {
      if (fn(item)) {
        this.groups[path] = this.groups[path].filter(i => i !== item)
      }
    }

    return item
  }
}

module.exports = { ObjectifiedArray }