
interface ScopeOptions {
  parent?: Scope;
  params?:string[]
  name:string
}
class Scope {
  parent?: Scope;
  names: string[];
  name:string;
  constructor(options: ScopeOptions) {
    this.parent = options.parent;
    this.name = options.name;
    this.names = options.params || []; //存放着这个作用域内的所有变量
  }
  add(name: string) {
    this.names.push(name);
  }
  findDefiningScope(name: string): Scope| null {
    if (this.names.includes(name)) {
      return this;
    }
    if (this.parent) {
      return this.parent.findDefiningScope(name);
    }
    return null;
  }
}
export default Scope;