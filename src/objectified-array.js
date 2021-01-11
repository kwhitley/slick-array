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
      by,
      groups,
      items = [],
      as, // optional constructor for new items
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
    this.$ = {}

    if (by) {
      this.$.by = unifyBy(by)
      this.by = {}
    }

    if (as) {
      this.$.as = isClass(as) ? i => new as(i) : as
    }

    if (groups) {
      this.$.groups = groups
    }

    for (const group in groups) {
      this[group] = []
    }

    if (items.length) {
      this.add(...items)
    }
  }

  // ADDED FUNCTIONS mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm

  add(...items) {
    Reflect.apply(this.push, this, items)

    return items.length > 1 ? items : items[0]
  }

  remove(...items) {
    let index
    for (const item of items) {
      while ((index = this.indexOf(item)) !== -1) {
        super.splice(index, 1)
        this.unindex(item)
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
    items = Reflect.apply(this.index, this, items)

    return super.push(...items)
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
    items = Reflect.apply(this.index, this, items)

    return super.unshift(...items)
  }

  // INTERNAL FUNCTIONS mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm

  index(...items) {
    const as = this.$.as

    if (!this.$.by && !this.$.groups && !this.$.as) return items

    return items.map(item => {
      item = this.$.as ? this.$.as(item) : item

      // maps
      if (this.$.by) {
        for (const path in this.$.by) {
          const key = this.$.by[path](item)
          if (!this.by[path]) {
            this.by[path] = {}
          }

          this.by[path][key] = item
        }
      }

       // groups
      if (this.$.groups) {
        for (const path in this.$.groups) {
          const key = this.$.groups[path](item)

          if (key) {
            if (key === true || key === false) { // dump into group
              this[path].push(item)
            } else {
              (this[path][key] = this[path][key] || []).push(item)
            }
          }
        }
      }

      return item
    })
  }

  unindex(item) {
    // maps
    for (const path in this.$.by) {
      const key = this.$.by[path](item)
      Reflect.deleteProperty(this.by[path], key)
    }

    // groups
    for (const [path, fn] of Object.entries(this.$.groups || {})) {
      const key = fn(item)

      if (key) {
        if (Boolean(key) === key) { // dump into group
          const index = this[path].indexOf(item)
          this[path].splice(index, 1)
        } else {
          const index = this[path][key].indexOf(item)
          this[path][key].splice(index, 1)
        }
      }
    }

    return item
  }
}

module.exports = { ObjectifiedArray }
