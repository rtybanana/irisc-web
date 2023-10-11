import { SyntaxNode } from "@/syntax";
import { Assembler } from "@/interpreter"
import '@/assets/prism-armv7';

const node = new SyntaxNode([], 0, 0);
export const assemble = (imm: string, bits: number = 8) => {
  const token = Assembler.parse(imm);
  return node.parseShiftedImm(token[0][0], bits);
}