import { Condition, operations } from '@/constants';
import { Token } from 'prismjs';
import { SyntaxNode } from "./SyntaxNode";
import { TAssembled, TOperation } from './types';

/** Ancestor class for all instruction-type syntax nodes (Bi/TriOperandNode etc.) */
export abstract class InstructionNode extends SyntaxNode {
  protected abstract _op: TOperation;
  protected abstract _cond: Condition;
  protected abstract _setFlags: boolean;

  // getters
  get op(): TOperation { return this._op; }
  get cond(): Condition { return this._cond; }
  get setFlags(): boolean { return this._setFlags; }
  get text(): string { 
    return this.statement
      .map(e => e.content)
      .join(" ")
      .replaceAll(/( (,|!|}|\]))|(({|\[|-) )/g, (match) => match.trim()); 
    }

  /**
   * 
   * @param token 
   * @returns 
   */
  protected splitOpCode(token: Token): [string, string, string] {
    let operation: string = "";
    let modifier: string = "";
    let condition: string = "";

    let forceFlags: string[] = [ "cmp", "cmn", "tst", "teq" ];

    operation = operations.find(e => (token.content as string).slice(0, e.length) === e) ?? "";

    let suffix: string = (token.content as string).substring(operation.length);
    if (suffix.length === 1 || suffix.length === 3) {
      modifier = suffix[0];
      suffix = suffix.substring(1);
    }
    condition = suffix;

    if (forceFlags.includes(operation)) modifier = "s";

    return [operation, modifier, condition];
  }

  assemble(): TAssembled {
    return {
      bitcode: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      explanation: [{
        title: "Unsupported Instruction",
        subtitle: "Cannot assemble this instruction",
        detail: "The assembler is currently work-in-progress. Support for this instruction type is coming soon.",
        range: 32
      }]
    }
  }
}