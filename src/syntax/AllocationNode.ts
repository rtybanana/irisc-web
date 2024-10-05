import { bitset } from "@/assets/bitset";
import { DataType, dataTypeMap } from '@/constants';
import { Token } from "prismjs";
import { SyntaxError } from "../interpreter/error";
import { SyntaxNode } from "./SyntaxNode";
import { tokens } from "@/constants/tokens";

export class AllocationNode extends SyntaxNode {
  protected _identifier: string;
  protected _data: Uint8Array;

  protected _type: DataType;
  private _specificType!: string;

  get identifier() : string { return this._identifier; }
  get data() : Uint8Array { return this._data; }
  get type() : string { return this._specificType; }

  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    this._identifier = (this.nextToken().content as string).slice(0, -1);
    this._type = dataTypeMap[this.nextToken().content as string];
    this._data = this.parseData(this.peekToken());

    this.nextToken();

    if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid data declaration end.`, statement, lineNumber, currentToken);
  }

  parseData(token: Token) : Uint8Array {
    this._specificType = this.previousToken().content as string;

    if (this.previousToken().content === ".asciz") return this.parseString(token);
    if (this.previousToken().content === ".byte") return this.parseByte(token);
    if (this.previousToken().content === ".hword") return this.parseHWord(token);
    if (this.previousToken().content === ".word") return this.parseWord(token);
    if (this.previousToken().content === ".skip") return this.parseSkip(token);

    throw new SyntaxError(`Unrecognised data type '${this.previousToken().content}'.`, this.statement, this.lineNumber, this._currentToken - 1)
  }

  parseString(token: Token) : Uint8Array {
    if (token.type !== "string") {
      throw SyntaxError.badToken(tokens.string, token, this._statement, this._lineNumber, this._currentToken);
    }

    const string = (token.content as string).slice(1, -1);
    const withEscapes = JSON.parse(`"${string}"`);
    const data = new Uint8Array(new ArrayBuffer(withEscapes.length + 1));

    for (let i = 0; i < string.length; i++) data[i] = withEscapes.charCodeAt(i);

    return data;
  }

  parseByte(token: Token) : Uint8Array {
    const data = new Uint8Array(new ArrayBuffer(1));
    const bits = bitset(8, this.parseNum(token));
    data[0] = parseInt(bits.join(''), 2);

    return data;
  }

  parseHWord(token: Token) : Uint8Array {
    const buffer = new ArrayBuffer(2);
    const data = new Uint16Array(buffer);
    const bits = bitset(16, this.parseNum(token));
    data[0] = parseInt(bits.join(''), 2);

    return new Uint8Array(buffer);
  }

  parseWord(token: Token) : Uint8Array {
    const buffer = new ArrayBuffer(4);
    const data = new Uint32Array(buffer);
    const bits = bitset(32, this.parseNum(token));
    data[0] = parseInt(bits.join(''), 2);

    return new Uint8Array(buffer);
  }

  parseSkip(token: Token) : Uint8Array {
    const length = this.parseNum(token);
    
    return new Uint8Array(new ArrayBuffer(length));
  }
}