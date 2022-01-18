"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var Module_1 = __importDefault(require("./../Module"));
var magic_string_1 = require("magic-string");
var Bundle = /** @class */ (function () {
    function Bundle(options) {
        // 处理兼容
        this.entryPath = path_1.default.resolve(options.entry.replace(/\.js/, "") + ".js");
        this.module = {};
        this.statements = [];
    }
    Bundle.prototype.build = function (fileName) {
        var entryModule = this.fetchModule(this.entryPath);
        this.statements = entryModule.expandAllStatements(true);
        var code = this.generate().code;
        console.log(code);
        fs_1.default.writeFileSync(fileName, code);
    };
    Bundle.prototype.fetchModule = function (importee) {
        var route = importee;
        var code = fs_1.default.readFileSync(route, "utf8");
        var module = new Module_1.default({
            code: code,
            path: importee,
            bundle: this,
        });
        return module;
    };
    Bundle.prototype.generate = function () {
        var magicString = new magic_string_1.Bundle();
        this.statements.forEach(function (statement) {
            var source = statement._source;
            if (source) {
                // console.log(source, 1);
                // magicString.addSource({
                //   content: new MagicString(source),
                //   // separator: "\n",
                // });
            }
        });
        return {
            code: magicString.toString(),
        };
    };
    return Bundle;
}());
exports.default = Bundle;
;
