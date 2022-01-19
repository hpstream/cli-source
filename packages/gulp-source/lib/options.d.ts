import acorn, { parse, Node } from "acorn";
import Scope from "./ast/Scope";
type Compute<A extends any> = A extends Function ? A : { [K in keyof A]: A[K] };
type Merge<O1 extends object, O2 extends object> = Compute<
  O1 & Omit<O2, keyof O1>
>;
// interface AstOption

type AstNodeParmary = Merge<
  {
    body?: AstNode[];
    _included?: boolean;
    _source?: string;
    _scope?: Scope;
    [index: string]: any;
  },
  Node
>;

export type AstNode = AstNodeParmary;

export interface importsOption {
  localName: string;
  source: string;
  importName: string;
}
export interface exportsOption {
  localName: string;
  exportName: string;
  expression: string;
}
export interface ModuleOptions {
  code: string;
  path: string;
  bundle: Bundle;
}
