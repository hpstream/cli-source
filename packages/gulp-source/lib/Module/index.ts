import MagicString from "magic-string";
import acorn, { parse, Node } from "acorn";
import analyse from "../ast/analyse";
import Bundle from "./../Bundle";
import {
  AstNode,
  exportsOption,
  importsOption,
  ModuleOptions,
} from "../options";
import { hasOwnProperty } from "../utils/object";

export default class Module {
  code: MagicString;
  path: string;
  bundle: Bundle;
  ast: AstNode;
  imports: Record<string, importsOption>;
  exports: Record<string, exportsOption>;
  definitions: any;
  constructor({ code, path, bundle }: ModuleOptions) {
    // this.options = options;
    this.code = new MagicString(code, {
      filename: path,
      indentExclusionRanges: [0, code.length],
    });

    this.path = path;
    this.bundle = bundle;
    this.ast = parse(code, {
      ecmaVersion: 7,
      sourceType: "module",
    });
    this.imports = {}; // 存放导入的语句
    this.exports = {}; // 存放导出的语句
    this.definitions = {}; //此变量存放所有的变量定义的语句
    this.analyse();
  }

  analyse() {
    if (!this.ast.body) return;
    this.ast.body.forEach((statement) => {
      //1.找到一个文件模块的导入模块：imports
      if (statement.type === "ImportDeclaration") {
        let source = statement.source.value as string; //./msg
        statement.specifiers.forEach((specifier: any) => {
          let importName = specifier.imported.name; //age
          let localName = specifier.local.name; //age
          //记录一下当前的这个引入的变量是从哪个模块的哪个变量导入进来的
          this.imports[localName] = { localName, source, importName };
        });
        //2. 找到一个文件模块的导出模块：exports
      } else if (statement.type === "ExportNamedDeclaration") {
        let declaration = statement.declaration;
        if (declaration.type === "VariableDeclaration") {
          const declarations = declaration.declarations;
          declarations.forEach((variableDeclarator: any) => {
            let localName = variableDeclarator.id.name;
            //this.exports.age = {localName:'age',exportName:'age',expression:};
            this.exports[localName] = {
              localName,
              exportName: localName,
              expression: declaration,
            };
          });
        }

        if (declaration.type === "FunctionDeclaration") {
          const localName = declaration.id.name;
          this.exports[localName] = {
            localName,
            exportName: localName,
            expression: declaration,
          };
        }
      }
    });
    analyse(this.ast, this.code, this);
    this.ast.body.forEach((statement) => {
      Object.keys(statement._defines).forEach((name) => {
        //当前模块内 定义name这个变量的语句是statement
        //main.js  type   let type = 'dog';
        this.definitions[name] = statement;
      });
    });
  }

  expandAllStatements(flag: boolean) {
    let allStatements: AstNode[] = [];
    if (this.ast.body) {
      this.ast.body.forEach((statement) => {
        // console.log(statement);
        if (statement.type === "ImportDeclaration") return;
        let statements = this.expandStatement(statement);
        allStatements.push(...statements);
      });
    }
    // console.log(allStatements);
    return allStatements;
  }
  expandStatement(statement: AstNode) {
    statement._included = true;
    let result = [];
    const dependencies = Object.keys(statement._dependsOn);
    // console.log(dependencies);
    dependencies.forEach((name) => {
      let definition = this.define(name);
      result.push(...definition);
    });
    result.push(statement);
    return result;
  }

  define(name: string): AstNode[] {
    //说明此变量是外部导入进来的
    // console.log(this.imports, name);
    if (hasOwnProperty(this.imports, name)) {
      //this.imports[localName]={localName,source,importName};
      const { localName, source, importName } = this.imports[name];
      // source .msg
      let importedModule = this.bundle.fetchModule(source, this.path);
      // console.log(importedModule.exports);
      const { localName: exportLocalName } = importedModule.exports[importName];
      //this.exports.name = {localName:'name',exportName:'name',expression:};
      return importedModule.define(exportLocalName);
    } else {
      //说明是在当前模块内声明的
      let statement = this.definitions[name];
      if (statement && !statement._included) {
        return this.expandStatement(statement);
      } else {
        return [];
      }
    }
  }
}
