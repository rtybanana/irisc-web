import { bitset } from "@/assets/bitset";
import { DataType, dataTypeBufferConstructorMap, dataTypeMap, dataTypeBitSizeMap, dataTypeByteSizeMap } from '@/constants';
import { Token } from "prismjs";
import { SyntaxError } from "../interpreter/error";
import { SyntaxNode } from "./SyntaxNode";
import { tokens } from "@/constants/tokens";

export class AllocationNode extends SyntaxNode {
  protected _identifier: string;
  protected _data: ArrayBuffer;

  protected _type: DataType;
  private _specificType!: string;

  get identifier() : string { return this._identifier; }
  get data() : Uint8Array { return new Uint8Array(this._data); }
  get type() : string { return this._specificType; }

  constructor(statement: Token[], lineNumber: number, currentToken: number = 0) {
    super(statement, lineNumber, currentToken);

    this._identifier = (this.nextToken().content as string).slice(0, -1);
    this._type = dataTypeMap[this.peekToken().content as string];
    this._specificType = this.nextToken().content as string;

    this._data = this.parseData();

    if (this.hasToken()) throw new SyntaxError(`Unexpected token '${this.peekToken().content}' after valid data declaration end.`, statement, lineNumber, currentToken);
  }

  parseData() : ArrayBuffer {
    if (this._specificType === ".asciz") return this.parseString(this.nextToken());
    if (this._specificType === ".byte") return this.parseIntArray(DataType.BYTE);
    if (this._specificType === ".hword") return this.parseIntArray(DataType.HWORD);
    if (this._specificType === ".word") return this.parseIntArray(DataType.WORD);
    if (this._specificType === ".skip") return this.parseSkip(this.nextToken());

    throw new SyntaxError(`Unrecognised data type '${this._specificType}'.`, this.statement, this.lineNumber, this._currentToken - 1)
  }

  parseString(token: Token) : Uint8Array {
    if (token.type !== "string") {
      throw SyntaxError.badToken(tokens.string, token, this._statement, this._lineNumber, this._currentToken);
    }

    const string = (token.content as string).slice(1, -1);    // slice off quotes
    const withEscapes = JSON.parse(`"${string}"`);
    const data = new Uint8Array(new ArrayBuffer(withEscapes.length + 1));

    for (let i = 0; i < string.length; i++) data[i] = withEscapes.charCodeAt(i);

    return data;
  }

  parseIntArray(size: DataType) : ArrayBuffer {
    const ints: number[] = [this.parseSignedInt()];

    while (this.hasToken()) {
      this.parseComma(this.nextToken());
      ints.push(this.parseSignedInt());
    }

    const buffer = new ArrayBuffer(ints.length * dataTypeByteSizeMap[size]);
    const data = new dataTypeBufferConstructorMap[size](buffer);
    ints.forEach((e, i) => data[i] = e);

    return buffer;
  }

  parseSignedInt() : number {
    let isNegative = false;

    let next = this.peekToken();
    if (next.type === tokens.sign && next.alias === "minus") {
      isNegative = true;
      this.nextToken();
    }

    let number = this.parseNum(this.nextToken());
    return isNegative ? -number : number;
  }

  parseSkip(token: Token) : Uint8Array {
    const length = this.parseNum(token);
    
    return new Uint8Array(new ArrayBuffer(length));
  }
}