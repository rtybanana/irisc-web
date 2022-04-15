import { SyntaxNode } from "./SyntaxNode";
import { SyntaxError } from "../error";
import { Token } from "prismjs";
import { DataType, dataTypeMap } from '@/constants';
import { bitset } from "@/assets/bitset";

export class AllocationNode extends SyntaxNode {
  protected _identifier: string;
  protected _type: DataType;
  protected _data: Uint8Array;

  get identifier() : string { return this._identifier; }
  get data() : Uint8Array { return this._data; }

  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    this._identifier = (this.nextToken().content as string).slice(0, -1);
    this._type = dataTypeMap[this.nextToken().content as string];
    this._data = this.parseData(this.peekToken());

    this.nextToken();

    if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid data declaration end.`, statement, lineNumber, currentToken);
  }

  parseData(token: Token) : Uint8Array {
    console.log(token);

    if (this.previousToken().content === ".asciz") return this.parseString(token);
    if (this.previousToken().content === ".byte") return this.parseByte(token);
    if (this.previousToken().content === ".hword") return this.parseHWord(token);
    if (this.previousToken().content === ".word") return this.parseWord(token);
    if (this.previousToken().content === ".skip") return this.parseSkip(token);

    throw new SyntaxError(`Unrecognised data type '${this.previousToken().content}'.`, this.statement, this.lineNumber, this._currentToken)
  }

  parseString(token: Token) : Uint8Array {
    if (token.type !== "string") {
      throw new SyntaxError(`Expected STRING - received ${token.type.toUpperCase()} '${token.content}' instead.`, this.statement, this.lineNumber, this._currentToken);
    }

    let data = new Uint8Array(new ArrayBuffer(token.length));
    let string = (token.content as string).slice(1, -1);

    for (let i = 0; i < string.length; i++) data[i] = string.charCodeAt(i);

    return data;
  }

  parseByte(token: Token) : Uint8Array {
    let data = new Uint8Array(new ArrayBuffer(1));
    let bits = bitset(8, this.parseImm(token));
    data[0] = parseInt(bits.join(''), 2);

    return data;
  }

  parseHWord(token: Token) : Uint8Array {
    let buffer = new ArrayBuffer(2);
    let data = new Uint16Array(buffer);
    let bits = bitset(16, this.parseImm(token));
    data[0] = parseInt(bits.join(''), 2);

    return new Uint8Array(buffer);
  }

  parseWord(token: Token) : Uint8Array {
    let buffer = new ArrayBuffer(4);
    let data = new Uint32Array(buffer);
    let bits = bitset(32, this.parseImm(token));
    data[0] = parseInt(bits.join(''), 2);

    return new Uint8Array(buffer);
  }

  parseSkip(token: Token) : Uint8Array {
    let length = this.parseImm(token);
    console.log(length);
    return new Uint8Array(new ArrayBuffer(length));
  }
}