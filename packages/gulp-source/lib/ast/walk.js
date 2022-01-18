function walk(node, parent, {
  enter,
  leave
}) {
  visit(node, parent, enter, leave);
}

function visit(node, parent, enter, leave) {
  if (enter) { //如果有enter方法就执行
    enter(node, parent);
  }
  //深度递归访问子节点
  let keys = Object.keys(node).filter(key => typeof node[key] === 'object');
  keys.forEach(key => {
    let children = node[key];
    if (Array.isArray(children)) {
      children.forEach(child => {
        visit(child, node, enter, leave);
      });
    } else if (children && children.type) {
      visit(children, node, enter, leave);
    }
  });
  if (leave) { //如果有leave方法就执行
    leave(node, parent);
  }
}
module.exports = walk;
4.7