import { SimulatorState } from '@/simulator';
import { AllocationNode, BiOperandNode, BlockTransferNode, BranchNode, DirectiveNode, InstructionNode, LabelNode, ShiftNode, SingleTransferNode, SyntaxNode, TriOperandNode } from '@/syntax';
import { languages, Token, tokenize } from 'prismjs';
import { AssemblyError, IriscError, SyntaxError } from './error';
import { callAddress } from '@/constants';

const state = {
  get memory() { return SimulatorState.memory(); }
}

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
      else if (!["whitespace", "line-comment"].includes(e.type)) {
        // do not convert to lower case if string
        if (e.type === "string") {
          a[a.length - 1].push(e); 
        }

        // convert all other tokens to lower case for compilation
        else {
          a[a.length - 1].push({
            ...e,
            content: (e.content as string).toLowerCase()
          }); 
        }
        
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
      const node: SyntaxNode | null = compileOne(e, i);
      if (node !== null) a.push(node);
    }
    catch (e) {
      if (e instanceof IriscError) {
        SimulatorState.addError(e);
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
    else return new AllocationNode(line, lineNumber, 0);
  }

  if (line[0].type === "directive") {
    return new DirectiveNode(line, lineNumber, 0);
  }

  if (line[0].type === "single-transfer") {
    return new SingleTransferNode(line, lineNumber, 0);
  }
  if (line[0].type === "block-transfer" ||
      line[0].type === "stack-transfer") {
    return new BlockTransferNode(line, lineNumber, 0);
  }
  // if (line[0].type === "stack-transfer") {

  // }

  // special error for labels with missing ":" - a common mistake
  if (line[0].type === "op-label") {
    throw new SyntaxError("Invalid label-like token detected, did you forget a colon?", line, lineNumber, 0);
  }

  throw new SyntaxError("Unrecognised instruction.", line, lineNumber, 0);
}

/**
 * 
 * @param nodes 
 */
function load(nodes: (SyntaxNode | null)[]) {
  enum Mode { Text, Data }

  const instructions: InstructionNode[] = [];
  const heap = new Uint8Array(new ArrayBuffer(state.memory.size)); 
  let heapHeight: number = 0;
  const heapMap: Record<string, number> = {};

  let mode: Mode = Mode.Text;
  nodes.forEach((node, index) => {
    if (node instanceof DirectiveNode) {
      if (node.isText) mode = Mode.Text;
      if (node.isData) mode = Mode.Data;
      if (node.isExtern) {
        SimulatorState.addLabel(node.identifier!, callAddress);
      }
    }

    // TODO: memory allocation validation
    else if (node instanceof AllocationNode) {
      if (mode !== Mode.Data) {
        SimulatorState.addError(new AssemblyError("Cannot declare data allocations outside of the .data section.", node.statement, node.lineNumber, -1));
      }

      heap.set(node.data, heapHeight);
      heapMap[node.identifier] = heapHeight; 
      heapHeight = Math.ceil((heapHeight + node.data.length) / 4) * 4;    // new heap height with word alignment 
    }

    else if (node instanceof LabelNode) {
      if (mode !== Mode.Text) {
        SimulatorState.addError(new AssemblyError("Cannot declare branchable labels outside of the .text section.", node.statement, node.lineNumber, 0));
      }

      if (SimulatorState.hasLabel(node.identifier)) {
        SimulatorState.addError(new AssemblyError(`Cannot declare multiple labels with the same name: '${node.identifier}'.`, node.statement, node.lineNumber, 0));
      }
      else SimulatorState.addLabel(node.identifier, instructions.length * 4);
    }

    else if (node instanceof InstructionNode) {
      if (mode !== Mode.Text) {
        SimulatorState.addError(new AssemblyError("Cannot declare instructions outside of the .text section.", node.statement, node.lineNumber, 0));
      }

      instructions.push(node);
    }
  });

  SimulatorState.setTextHeight(instructions.length * 4);
  SimulatorState.allocateData(heap, heapHeight, heapMap);
  SimulatorState.setInstructions(instructions);
  
  // SimulatorState.validate();
  // SimulatorState.setTextSection(instructions);
}

/**
 * Wrapper function to perform a common set of the assembly functions.
 * @param program 
 */
function build(program: string) : void {
  SimulatorState.stop();
  SimulatorState.initMemory();
  SimulatorState.removeBreakpoints();

  const lines = parse(program);
  const nodes = compile(lines);

  load(nodes);
}

export { parse, compile, compileOne, load, build };
