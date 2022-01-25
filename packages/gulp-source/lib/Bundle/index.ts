import fs from "fs";
import path from "path";
import Module from "./../Module";
import MagicString, { Bundle as MagicStringBundle } from "magic-string";
import { AstNode } from "../options";
import Scope from "../ast/Scope";

interface BundleOptons {
  entry: string;
}
// 相当于compile;管理器
export default class Bundle {
  entryPath: string;
  module!: Module;
  statements: AstNode[];
  constructor(options: BundleOptons) {
    // 处理兼容
    this.entryPath = path.resolve(options.entry.replace(/\.js/, "") + ".js");
    this.statements = [];
  }
  build(fileName: string) {
    // 处理入口文件
    const entryModule = this.fetchModule(this.entryPath);
    this.statements = entryModule.expandAllStatements(true);
    const { code } = this.generate();
    // console.log(code);
    fs.writeFileSync(fileName, code);
  }
  
  fetchModule(importee: string, importer?: string) {
    // let route = importee;
    let route!: string;
    if (!importer) {
      route = importee;
    } else {
      if (path.isAbsolute(importee)) {
        route = importee;
      } else if (importee[0] == ".") {
        // 处理深度文件，如：在主文件import了其他文件
        route = path.resolve(
          path.dirname(importer),
          importee.replace(/\.js$/, "") + ".js"
        );
      }
    }
    const code = fs.readFileSync(route, "utf8");
    // 每个文件创建一个 module; 模块
    const module = new Module({
      code,
      path: importee,
      bundle: this,
    });
    return module;
  }

  generate() {
    let magicString = new MagicStringBundle();
    this.statements.forEach((statement) => {
      const source = statement._source;
      if (source) {
        // console.log(source, 1);
        magicString.addSource({
          content: new MagicString(source),
          // separator: "\n",
        });
      }
    });
    return {
      code: magicString.toString(),
    };
  }
}

