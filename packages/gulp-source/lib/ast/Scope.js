class Scope {
  constructor(options = {}) {
    this.parent = options.parent;
    this.names = options.params || []; //存放着这个作用域内的所有变量
  }
  add(name) {
    this.names.push(name);
  }
  findDefiningScope(name) {
    if (this.names.includes(name)) {
      return this
    }
    if (this.parent) {
      return this.parent.findDefiningScope(name)
    }
    return null;
  }
}
module.exports = Scope;