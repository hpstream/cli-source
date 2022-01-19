"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Scope_1 = __importDefault(require("./Scope"));
var walk_1 = __importDefault(require("./walk"));
// import MagicString from "magic-string";
function analyse(ast, magicString, bundle) {
    if (!ast.body)
        return;
    // 1. 创建作用域
    var scope = new Scope_1.default({ name: "全局作用域" });
    ast.body.forEach(function (statement) {
        function addToScope(name) {
            scope.add(name);
            if (!scope.parent) {
                // 标记顶级变量
                statement._defines[name] = true;
            }
        }
        Object.defineProperties(statement, {
            _defines: { value: {} },
            _dependsOn: { value: {} },
            _included: { value: false, writable: true },
            _source: {
                value: magicString.snip(statement.start, statement.end).toString(),
            },
        });
        if (ast.body) {
            (0, walk_1.default)(statement, ast.body, {
                enter: function (node, parent) {
                    var newScope;
                    switch (node.type) {
                        case "FunctionDeclaration":
                            //函数的参数将会成为此函数子作用域内的局部变量
                            var names = node.params.map(function (param) { return param.name; });
                            addToScope(node.id.name); //把node也就是say这个变量添加到当前作用内
                            //如果遇到函数声明，就会产生一个新作用域
                            newScope = new Scope_1.default({
                                name: node.id.name,
                                parent: scope,
                                params: names,
                            });
                            break;
                        case "VariableDeclaration":
                            node.declarations.forEach(function (declaration) {
                                return addToScope(declaration.id.name);
                            });
                            break;
                    }
                    if (newScope) {
                        //如果创建了新的作用域，那么这个作用域将会成为新的当前作用域
                        Object.defineProperty(node, "_scope", { value: newScope });
                    }
                },
                leave: function (node, parent) {
                    if (parent._scope) {
                        scope = parent._scope;
                    }
                },
            });
            //2.作用域链构建完成后，再遍历一次，找出本模块定义了依赖了哪些外部变量
            ast.body.forEach(function (statement) {
                ast.body && (0, walk_1.default)(statement, ast.body, {
                    enter: function (node) {
                        if (node.type === "Identifier") {
                            var currentScope = node._scope || scope;
                            var definingScope = currentScope.findDefiningScope(node.name);
                            if (!definingScope) {
                                // console.log(statement._dependsOn);
                                //找这个statement依赖了哪些外部变量
                                if (statement._dependsOn) {
                                    statement._dependsOn[node.name] = true;
                                }
                            }
                        }
                    },
                });
            });
        }
    });
}
exports.default = analyse;
