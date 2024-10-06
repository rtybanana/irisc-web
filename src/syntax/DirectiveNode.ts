import { Directive, directiveMap, Call, callMap } from "@/constants";
import { Token } from "prismjs";
import { SyntaxError } from "../interpreter/error";
import { SyntaxNode } from "./SyntaxNode";

export class DirectiveNode extends SyntaxNode {
  private _directive: Directive;
  private _identifier?: string;
  private _call?: Call;
  private _value?: number;

  get directive() : Directive { return this._directive; }
  get isText() : boolean { return this._directive === Directive.TEXT; }
  get isData() : boolean { return this._directive === Directive.DATA; }
  // get isGlobal() : boolean { return this.directive === Directive.GLOBAL; }
  get isExtern() : boolean { return this._directive === Directive.EXTERN; }
  

  get identifier() : string { return this._identifier!; }
  get call() : Call { return this._call!; }
  get value() : number { return this._value!; }

  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    if (directiveMap[this.peekToken().content as string] === undefined) {
      throw new SyntaxError(`Unrecognised directive '${this.peekToken().content}'.`, statement, lineNumber, currentToken);
    }

    this._directive = directiveMap[this.nextToken().content as string];

    // .text and .data directives omitted since they have no additional params
    switch (this._directive) {
      case Directive.EXTERN:
        this.parseExtern();
        break;
      case Directive.BALIGN:
        this.parseBalign();
        break;
    }

    // if (this._directive === Directive.EXTERN) {
    //   this.parseExtern()
    // }
    
    
    if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid section declaration end.`, statement, lineNumber, currentToken + 1);
  }

  private parseExtern() {
    if (callMap[this.peekToken().content as string] === undefined) {
      throw new SyntaxError(`
        Expected a recognised external C function call identifier - received '${this.peekToken().type}' ${this.peekToken().content}' instead. 
        As of now, only [${Object.keys(callMap).join(', ')}] are supported.`, 
        this.statement, 
        this.lineNumber, 
        this.currentToken
      );
    }

    this._identifier = this.nextToken().content as string;
    this._call = callMap[this._identifier];
  }

  private parseBalign() {
    const size = this.parseImm(this.nextToken());
    this._value = size;
  }
}