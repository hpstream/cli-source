"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var Module_1 = __importDefault(require("./../Module"));
var magic_string_1 = __importStar(require("magic-string"));
// 相当于compile;管理器
var Bundle = /** @class */ (function () {
    function Bundle(options) {
        // 处理兼容
        this.entryPath = path_1.default.resolve(options.entry.replace(/\.js/, "") + ".js");
        this.statements = [];
    }
    Bundle.prototype.build = function (fileName) {
        // 处理入口文件
        var entryModule = this.fetchModule(this.entryPath);
        this.statements = entryModule.expandAllStatements(true);
        var code = this.generate().code;
        // console.log(code);
        fs_1.default.writeFileSync(fileName, code);
    };
    Bundle.prototype.fetchModule = function (importee, importer) {
        // let route = importee;
        var route;
        if (!importer) {
            route = importee;
        }
        else {
            if (path_1.default.isAbsolute(importee)) {
                route = importee;
            }
            else if (importee[0] == ".") {
                // 处理深度文件，如：在主文件import了其他文件
                route = path_1.default.resolve(path_1.default.dirname(importer), importee.replace(/\.js$/, "") + ".js");
            }
        }
        var code = fs_1.default.readFileSync(route, "utf8");
        // 每个文件创建一个 module; 模块
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
                magicString.addSource({
                    content: new magic_string_1.default(source),
                    // separator: "\n",
                });
            }
        });
        return {
            code: magicString.toString(),
        };
    };
    return Bundle;
}());
exports.default = Bundle;
