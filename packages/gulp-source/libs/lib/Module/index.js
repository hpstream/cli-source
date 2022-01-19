"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var magic_string_1 = __importDefault(require("magic-string"));
var acorn_1 = require("acorn");
var analyse_1 = __importDefault(require("../ast/analyse"));
var object_1 = require("../utils/object");
var Module = /** @class */ (function () {
    function Module(_a) {
        var code = _a.code, path = _a.path, bundle = _a.bundle;
        // this.options = options;
        this.code = new magic_string_1.default(code, {
            filename: path,
            indentExclusionRanges: [0, code.length],
        });
        this.path = path;
        this.bundle = bundle;
        this.ast = (0, acorn_1.parse)(code, {
            ecmaVersion: 7,
            sourceType: "module",
        });
        this.imports = {}; // 存放导入的语句
        this.exports = {}; // 存放导出的语句
        this.definitions = {}; //此变量存放所有的变量定义的语句
        this.analyse();
    }
    Module.prototype.analyse = function () {
        var _this = this;
        if (!this.ast.body)
            return;
        this.ast.body.forEach(function (statement) {
            //1.找到一个文件模块的导入模块：imports
            if (statement.type === "ImportDeclaration") {
                var source_1 = statement.source.value; //./msg
                statement.specifiers.forEach(function (specifier) {
                    var importName = specifier.imported.name; //age
                    var localName = specifier.local.name; //age
                    //记录一下当前的这个引入的变量是从哪个模块的哪个变量导入进来的
                    _this.imports[localName] = { localName: localName, source: source_1, importName: importName };
                });
                //2. 找到一个文件模块的导出模块：exports
            }
            else if (statement.type === "ExportNamedDeclaration") {
                var declaration_1 = statement.declaration;
                if (declaration_1.type === "VariableDeclaration") {
                    var declarations = declaration_1.declarations;
                    declarations.forEach(function (variableDeclarator) {
                        var localName = variableDeclarator.id.name;
                        //this.exports.age = {localName:'age',exportName:'age',expression:};
                        _this.exports[localName] = {
                            localName: localName,
                            exportName: localName,
                            expression: declaration_1,
                        };
                    });
                }
                if (declaration_1.type === "FunctionDeclaration") {
                    var localName = declaration_1.id.name;
                    _this.exports[localName] = {
                        localName: localName,
                        exportName: localName,
                        expression: declaration_1,
                    };
                }
            }
        });
        (0, analyse_1.default)(this.ast, this.code, this);
        this.ast.body.forEach(function (statement) {
            Object.keys(statement._defines).forEach(function (name) {
                //当前模块内 定义name这个变量的语句是statement
                //main.js  type   let type = 'dog';
                _this.definitions[name] = statement;
            });
        });
    };
    Module.prototype.expandAllStatements = function (flag) {
        var _this = this;
        var allStatements = [];
        if (this.ast.body) {
            this.ast.body.forEach(function (statement) {
                // console.log(statement);
                if (statement.type === "ImportDeclaration")
                    return;
                var statements = _this.expandStatement(statement);
                allStatements.push.apply(allStatements, statements);
            });
        }
        // console.log(allStatements);
        return allStatements;
    };
    Module.prototype.expandStatement = function (statement) {
        var _this = this;
        statement._included = true;
        var result = [];
        var dependencies = Object.keys(statement._dependsOn);
        // console.log(dependencies);
        dependencies.forEach(function (name) {
            var definition = _this.define(name);
            result.push.apply(result, definition);
        });
        result.push(statement);
        return result;
    };
    Module.prototype.define = function (name) {
        //说明此变量是外部导入进来的
        // console.log(this.imports, name);
        if ((0, object_1.hasOwnProperty)(this.imports, name)) {
            //this.imports[localName]={localName,source,importName};
            var _a = this.imports[name], localName = _a.localName, source = _a.source, importName = _a.importName;
            // source .msg
            var importedModule = this.bundle.fetchModule(source, this.path);
            // console.log(importedModule.exports);
            var exportLocalName = importedModule.exports[importName].localName;
            //this.exports.name = {localName:'name',exportName:'name',expression:};
            return importedModule.define(exportLocalName);
        }
        else {
            //说明是在当前模块内声明的
            var statement = this.definitions[name];
            if (statement && !statement._included) {
                return this.expandStatement(statement);
            }
            else {
                return [];
            }
        }
    };
    return Module;
}());
exports.default = Module;
