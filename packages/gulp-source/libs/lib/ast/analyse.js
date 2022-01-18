"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import MagicString from "magic-string";
function analyse(ast, magicString, bundle) {
    if (!ast.body)
        return;
    ast.body.forEach(function (statement) {
        Object.defineProperties(statement, {
            _source: {
                value: magicString.snip(statement.start, statement.end).toString(),
            },
        });
        console.log(statement._source);
    });
}
exports.default = analyse;
