import { languages, Token, tokenize } from 'prismjs';
import { BiOperandNode, BranchNode, DirectiveNode, InstructionNode, LabelNode, ShiftNode, SyntaxNode, TriOperandNode } from './syntax';
import { AssemblyError, IriscError, SyntaxError } from './error';
import { EmulatorState } from '@/state';
import { Register } from '@/constants';

/**
 * 
 * @param program 
 * @returns 
 */
function parse(program: string) : Token[][] {
  return tokenize(program, languages.armv7).reduce((a, e) => {

    // capture important tokens
    if (e instanceof Token) {
      // create new line if end token (\n)
      if (e.type === "end") a.push([]);

      // push valid token into current line
      else if (e.type !== "whitespace") {
        a[a.length - 1].push(e); 
      }
    }

    // reduce
    return a;
  }, [[]] as Token [][]);
}

/**
 * 
 * @param lines 
 * @returns 
 */
function compile(lines: Token[][]): SyntaxNode[] {
  return lines.reduce((a: SyntaxNode[], e: Token[], i: number) => {
    try {
      let node: SyntaxNode | null = compileOne(e, i);
      if (node !== null) a.push(node);
    }
    catch (e) {
      if (e instanceof IriscError) {
        EmulatorState.addError(e);
      }
    }
    
    return a;
  }, [] as SyntaxNode[]);
}

/**
 * 
 * @param line 
 * @param lineNumber 
 * @returns 
 */
function compileOne(line: Token[], lineNumber: number) : SyntaxNode | null {
  if (line.length === 0) return null;

  if (line[0].type === "bi-operand") {
    return new BiOperandNode(line, lineNumber, 0);
  }
  if (line[0].type === "tri-operand") {
    return new TriOperandNode(line, lineNumber, 0);
  }
  if (line[0].type === "shift") {
    return new ShiftNode(line, lineNumber, 0);
  }
  if (line[0].type === "branch") {
    return new BranchNode(line, lineNumber, 0);
  }
  if (line[0].type === "label") {
    if (line.length === 1) return new LabelNode(line, lineNumber, 0);
    // else return new syntax::AllocationNode(statement);
  }

  if (line[0].type === "op-label") {
    throw new SyntaxError("Invalid label-like token detected, did you forget a colon?", line, lineNumber, 0);
  }

  return null;
}

/**
 * 
 * @param nodes 
 */
function load(nodes: (SyntaxNode | null)[]) {
  enum Mode { Text, Data }

  let mode: Mode = Mode.Text;
  nodes.forEach((node, index) => {
    if (node instanceof DirectiveNode) {
      if (node.isText) mode = Mode.Text;
      if (node.isData) mode = Mode.Data;
    }

    else if (node instanceof LabelNode) {
      if (mode !== Mode.Text) throw new AssemblyError("Cannot declare branchable labels outside of the text section.", node.statement, node.lineNumber, -1);

      if (EmulatorState.hasLabel(node.identifier)) {
        throw new AssemblyError(`Cannot declare multiple labels with the same name: '${node.identifier}'.`, node.statement, node.lineNumber, 0);
      }
      else EmulatorState.addLabel(node.identifier, EmulatorState.memory().textSize * 32);
    }

    // TODO: memory allocation validation
    // if (node instanceof AllocationNode) {
    //  if (mode !== Mode.Data) throw new AssemblyError("Cannot declare data allocations outside of the .data section.", node.statement, node.lineNumber, -1)
    // }

    else if (node instanceof InstructionNode) {
      if (mode !== Mode.Text) throw new AssemblyError("Cannot declare instructions outside of the .text section.", node.statement, node.lineNumber, -1);

      EmulatorState.addInstruction(node);
    }
  });
}

export { parse, compile, compileOne, load }