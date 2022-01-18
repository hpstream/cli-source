import fs from 'fs';
import path from 'path';
import Module from './../Module';
import MagicString, { Bundle as MagicStringBundle } from "magic-string";
import { AstNode } from '../options';

interface BundleOptons {
  entry: string;
}
export default class Bundle {
  entryPath: string;
  module: any;
  statements:AstNode[];
  constructor(options: BundleOptons) {
    // 处理兼容
    this.entryPath = path.resolve(options.entry.replace(/\.js/, "") + ".js");
    this.module = {};
    this.statements =[]
  }
  build(fileName: string) {
    const entryModule = this.fetchModule(this.entryPath);
    this.statements = entryModule.expandAllStatements(true);
    const { code } = this.generate();
    console.log(code);
    fs.writeFileSync(fileName, code);
  }

  fetchModule(importee: string) {
    let route = importee;
    const code = fs.readFileSync(route, "utf8");
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
        // magicString.addSource({
        //   content: new MagicString(source),
        //   // separator: "\n",
        // });
      }
    });
    return {
      code: magicString.toString(),
    };
  }
};