import acorn, { parse, Node } from "acorn";
type Compute<A extends any> = A extends Function ? A : { [K in keyof A]: A[K] };
type Merge<O1 extends object, O2 extends object> = Compute<
  O1 & Omit<O2, keyof O1>
>;
// interface AstOption
export type AstNode = Merge<
  {
    body?: AstNode[];
    _included?: boolean;
    _source?:string
  },
  Node
>;

export interface ModuleOptions {
  code: string;
  path: string;
  bundle: Bundle;
}
