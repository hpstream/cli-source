import { AstNode } from "../options";
import MagicString from "magic-string";
// import Bundle from "../Bundle";
import Module from "../Module";
import Scope from "./Scope";
import walk from "./walk";
import { hasOwnProperty } from "../utils/object";
// import MagicString from "magic-string";
function analyse(ast: AstNode, magicString: MagicString, bundle: Module) {
  if (!ast.body) return;
  // 1. 创建作用域
  let scope = new Scope({ name: "全局作用域" });
  ast.body.forEach((statement) => {
    function addToScope(name: string) {
      scope.add(name);
      if (!scope.parent) {
        // 标记顶级变量
        statement._defines[name] = true;
      }
    }
    Object.defineProperties(statement, {
      _defines: { value: {} }, //当前statement语法树节点声明了哪些变量
      _dependsOn: { value: {} }, //当前statement语句外部依赖的变量
      _included: { value: false, writable: true }, //当前的语句是否放置在结果中，是否会出现在打包结果中
      _source: {
        value: magicString.snip(statement.start, statement.end).toString(),
      },
    });
    if (ast.body) {
      walk(statement, ast.body, {
        enter(node, parent) {
          let newScope;
          switch (node.type) {
            case "FunctionDeclaration":
              //函数的参数将会成为此函数子作用域内的局部变量
              const names = node.params.map((param: any) => param.name);
              addToScope(node.id.name); //把node也就是say这个变量添加到当前作用内
              //如果遇到函数声明，就会产生一个新作用域
              newScope = new Scope({
                name: node.id.name,
                parent: scope,
                params: names,
              });
              break;
            case "VariableDeclaration":
              node.declarations.forEach((declaration: any) =>
                addToScope(declaration.id.name)
              );
              break;
          }
          if (newScope) {
            //如果创建了新的作用域，那么这个作用域将会成为新的当前作用域
            Object.defineProperty(node, "_scope", { value: newScope });
          }
        },
        leave(node, parent) {
          if (parent._scope) {
            scope = parent._scope;
          }
        },
      });

      //2.作用域链构建完成后，再遍历一次，找出本模块定义了依赖了哪些外部变量
      ast.body.forEach((statement) => {
        ast.body && walk(statement, ast.body, {
          enter(node) {
            if (node.type === "Identifier") {
              let currentScope = node._scope || scope;
              let definingScope = currentScope.findDefiningScope(node.name);
              if (!definingScope) {
                // console.log(statement._dependsOn);
                //找这个statement依赖了哪些外部变量
                if (statement._dependsOn){
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
export default analyse;
