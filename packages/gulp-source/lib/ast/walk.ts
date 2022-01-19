import { AstNode } from './../options.d';

interface AstNodeFn{
  (node:AstNode,parent:AstNode):void
}



function walk(
  node: AstNode,
  parent: AstNode,
  { enter, leave }: { enter?: AstNodeFn; leave?: AstNodeFn }
) {
  visit(node, parent, enter, leave);
}


function visit(
  node: AstNode,
  parent: AstNode,
  enter?: AstNodeFn,
  leave?: AstNodeFn
) {
  if (enter) {
    //如果有enter方法就执行
    enter(node, parent);
  }
  //深度递归访问子节点
  let keys = Object.keys(node).filter((key) => typeof node[key] === "object");
  keys.forEach((key) => {
    let children = node[key];
    if (Array.isArray(children)) {
      children.forEach((child) => {
        visit(child, node, enter, leave);
      });
    } else if (children && children.type) {
      visit(children, node, enter, leave);
    }
  });
  if (leave) {
    //如果有leave方法就执行
    leave(node, parent);
  }
}
export default walk;
