import { SyntaxNode } from "../SyntaxNode";
import { SyntaxError } from "@/interpreter";
import { Token } from "prismjs";

export class LabelNode extends SyntaxNode {
  protected _identifier: string;

  get identifier() : string { return this._identifier; }

  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    this._identifier = (this.nextToken().content as string).slice(0, -1);

    if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid data declaration end.`, statement, lineNumber, currentToken);
  }
}