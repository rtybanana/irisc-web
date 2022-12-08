import { Directive, directiveMap, Call, callMap } from "@/constants";
import { Token } from "prismjs";
import { SyntaxError } from "../interpreter/error";
import { SyntaxNode } from "./SyntaxNode";

export class DirectiveNode extends SyntaxNode {
  private _directive: Directive;
  private _identifier?: string;
  private _call?: Call;

  get isText() : boolean { return this._directive === Directive.TEXT; }
  get isData() : boolean { return this._directive === Directive.DATA; }
  // get isGlobal() : boolean { return this.directive === Directive.GLOBAL; }
  get isExtern() : boolean { return this._directive === Directive.EXTERN; }

  get identifier() : string { return this._identifier!; }
  get call() : Call { return this._call!; }

  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    if (directiveMap[this.peekToken().content as string] === undefined) {
      throw new SyntaxError(`Unrecognised directive '${this.peekToken().content}'.`, statement, lineNumber, currentToken);
    }

    this._directive = directiveMap[this.nextToken().content as string];

    if (this._directive === Directive.EXTERN) {
      if (callMap[this.peekToken().content as string] === undefined) {
        this.nextToken();
        throw new SyntaxError(`
          Expected a recognised external C function call identifier - received '${this.peekToken().type}' ${this.peekToken().content}' instead. 
          Not all C calls are supported. 
          Skip ahead in the tutorial to find the ones which are.`, 
          statement, 
          lineNumber, 
          currentToken
        );
      }

      this._identifier = this.nextToken().content as string;
      this._call = callMap[this._identifier];
    }
    
    
    if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid section declaration end.`, statement, lineNumber, currentToken + 1);
  }
}