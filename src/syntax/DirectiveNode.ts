import { SyntaxNode } from "./SyntaxNode";
import { Directive, directiveMap } from "@/constants/directives";
import { Token } from "prismjs";
import { SyntaxError } from "../interpreter/error";

export class DirectiveNode extends SyntaxNode {
  private directive: Directive;

  get isText() : boolean { return this.directive === Directive.TEXT; }
  get isData() : boolean { return this.directive === Directive.DATA; }
  get isGlobal() : boolean { return this.directive === Directive.GLOBAL; }

  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    if (directiveMap[this.peekToken().content as string] !== undefined) {
      this.directive = directiveMap[this.nextToken().content as string];
    }
    else throw new SyntaxError(`Unrecognised directive '${this.peekToken().content}'.`, statement, lineNumber, currentToken);
    
    if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid section declaration end.`, statement, lineNumber, currentToken + 1);
  }
}