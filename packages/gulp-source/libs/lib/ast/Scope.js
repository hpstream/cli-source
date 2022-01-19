"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scope = /** @class */ (function () {
    function Scope(options) {
        this.parent = options.parent;
        this.name = options.name;
        this.names = options.params || []; //存放着这个作用域内的所有变量
    }
    Scope.prototype.add = function (name) {
        this.names.push(name);
    };
    Scope.prototype.findDefiningScope = function (name) {
        if (this.names.includes(name)) {
            return this;
        }
        if (this.parent) {
            return this.parent.findDefiningScope(name);
        }
        return null;
    };
    return Scope;
}());
exports.default = Scope;
