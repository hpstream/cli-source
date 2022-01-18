import MagicString from "magic-string";
import acorn, { parse, Node } from "acorn";
import analyse from '../ast/analyse';
import Bundle from "./../Bundle";
import { AstNode, ModuleOptions } from "../options";

export default class Module {
  code: MagicString;
  path: string;
  bundle: Bundle;
  ast: AstNode;
  constructor({ code, path, bundle }: ModuleOptions) {
    // this.options = options;
    // console.log(code);
    this.code = new MagicString(code, {
      filename: path,
      indentExclusionRanges: [0,code.length],
    });
    // console.log(this.code.toString());

    
    this.path = path;
    this.bundle = bundle;
    this.ast = parse(code, {
      ecmaVersion: 7,
      sourceType: "module",
    });
    // console.log(this.ast);
    // this.imports = {}; // 存放导入的语句
    // this.exports = {}; // 存放导出的语句
    // this.definitions = {}; //此变量存放所有的变量定义的语句
    this.analyse();
  }

  analyse() {
    // this.ast.body.forEach((statement) => {
    //   if (statement.type === "ImportDeclaration") {
    //     statements.s;
    //   }
    // });
    analyse(this.ast, this.code, this);
  }

  expandAllStatements(flag: boolean) {
    let allStatements: AstNode[] = [];
    if (this.ast.body) {
      this.ast.body.forEach((statement) => {
        let statements = this.expandStatement(statement);
        allStatements.push(...statements);
      });
    }
     return allStatements;
  }
  expandStatement(statement: AstNode) {
    statement._included = true;
    let result = [];
    result.push(statement);
    return result;
  }
};
