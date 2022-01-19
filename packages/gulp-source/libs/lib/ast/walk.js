"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function walk(node, parent, _a) {
    var enter = _a.enter, leave = _a.leave;
    visit(node, parent, enter, leave);
}
function visit(node, parent, enter, leave) {
    if (enter) {
        //如果有enter方法就执行
        enter(node, parent);
    }
    //深度递归访问子节点
    var keys = Object.keys(node).filter(function (key) { return typeof node[key] === "object"; });
    keys.forEach(function (key) {
        var children = node[key];
        if (Array.isArray(children)) {
            children.forEach(function (child) {
                visit(child, node, enter, leave);
            });
        }
        else if (children && children.type) {
            visit(children, node, enter, leave);
        }
    });
    if (leave) {
        //如果有leave方法就执行
        leave(node, parent);
    }
}
exports.default = walk;
