import { AstNode } from "../options";
import MagicString from "magic-string";
// import Bundle from "../Bundle";
import Module from "../Module";
// import MagicString from "magic-string";
function analyse(ast: AstNode, magicString: MagicString,bundle: Module) {
  if (!ast.body) return;
  ast.body.forEach((statement) => {
    
    Object.defineProperties(statement, {
      _source: {
        value: magicString.snip(statement.start, statement.end).toString(),
      },
    });
    console.log(statement._source);
  });
}
export default analyse;