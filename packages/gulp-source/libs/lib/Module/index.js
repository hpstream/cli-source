"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var magic_string_1 = __importDefault(require("magic-string"));
var acorn_1 = require("acorn");
var analyse_1 = __importDefault(require("../ast/analyse"));
var Module = /** @class */ (function () {
    function Module(_a) {
        var code = _a.code, path = _a.path, bundle = _a.bundle;
        // this.options = options;
        // console.log(code);
        this.code = new magic_string_1.default(code, {
            filename: path,
            indentExclusionRanges: [0, code.length],
        });
        // console.log(this.code.toString());
        this.path = path;
        this.bundle = bundle;
        this.ast = (0, acorn_1.parse)(code, {
            ecmaVersion: 7,
            sourceType: "module",
        });
        // console.log(this.ast);
        // this.imports = {}; // 存放导入的语句
        // this.exports = {}; // 存放导出的语句
        // this.definitions = {}; //此变量存放所有的变量定义的语句
        this.analyse();
    }
    Module.prototype.analyse = function () {
        // this.ast.body.forEach((statement) => {
        //   if (statement.type === "ImportDeclaration") {
        //     statements.s;
        //   }
        // });
        (0, analyse_1.default)(this.ast, this.code, this);
    };
    Module.prototype.expandAllStatements = function (flag) {
        var _this = this;
        var allStatements = [];
        if (this.ast.body) {
            this.ast.body.forEach(function (statement) {
                var statements = _this.expandStatement(statement);
                allStatements.push.apply(allStatements, statements);
            });
        }
        return allStatements;
    };
    Module.prototype.expandStatement = function (statement) {
        statement._included = true;
        var result = [];
        result.push(statement);
        return result;
    };
    return Module;
}());
exports.default = Module;
;
