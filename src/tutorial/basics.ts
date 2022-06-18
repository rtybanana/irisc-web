import { TTutorialPage } from "./types"

const basics1: TTutorialPage = {
  title: "Basics 0: mov",
  content: // html
  `\
    The <span class="token operation">mov</span> instruction is the most basic instruction in the ARM instruction-set.\
    It simply inserts a single, source value into a destination register. The source value is what is known as a\
    <span class="irisc">flexible operand</span> which means it can either be an <span class="token immediate">immediate</span>\
    (a numeric literal), or the contents of a <span class="token register">register</span>.

    For most instructions in ARM assembly, source values move from right to left into the destination register. For example:\

    <div class="ml-5">
      <span class="token operation">mov</span>\
      <span class="token register">r0</span>, \
      <span class="token immediate">#1</span>
    </div>\

    Takes the source value <span class="token immediate">#1</span> (the number 1) and <span class="token operation">mov</span>-es\
    it into the destination register <span class="token register">r0</span>.

    Click the <i class="fas fa-terminal fa-sm irisc"></i> button to switch back to the terminal environment and experiment with the\
    <span class="token operation">mov</span> instruction!

    <div class="hmm">\
      <div class="token label mb-1">Hmm...</div>\
      Try using a <span class="token register">register</span> as a source value. How does this change the assembled machine code?\
    </div>
  `
}

const subroutine1: TTutorialPage = {
  title: "Subroutine 0: The Flex Operand",
  content: // html
  `\
    On the previous page, I mentioned a concept called the <span class="irisc">flexible operand</span>. The flexible operand is just\
    that, <span class="irisc">flexible</span>. It can be a <span class="token register">register</span>; a\
    <span class="token register">register</span> with an additional, optional shift; or an <span class="token immediate">immediate</span>\
    value. 
    
    After assembling the rest of the required information for the <span class="token operation">mov</span> instruction into machine code,\
    we have just 12 bits left over.

    In the case of a <span class="token register">register</span>, the final 12 bits of the instruction are arranged [8, 4]. The first eight\
    are used to describe the shift and the final four identify the <span class="token register">register</span>.

    In the case of an <span class="token immediate">immediate</span> value, the 12 bits are arranged [4, 8]. The last eight bits describe\
    an 8-bit number (0 - 255). The first four are where things get clever. These four bits are the <span class="irisc">barrel shifter</span>.

    Continue to the next page to learn more.
  `
}

const subroutine2: TTutorialPage = {
  title: "Subroutine 1: The Barrel Shifter",
  content: // html
  `\
    Explanation incoming I promise - stay tuned!
  `
}

const basics2: TTutorialPage = {
  title: "Basics 1: mvn",
  content: // html
  `\
    <span class="token operation">mvn</span> is the negative counterpart of the <span class="token operation">mov</span>\
    instruction. It has the same syntax and effect, except that the negated value of the source register is places into\
    the destination register.

    Try an <span class="token operation">mvn</span> instruction now!

    
    <div class="hmm">\
      <div class="token label mb-1">Hmm...</div>\
      You may notice that the result is a very large, positive number. This isn't a mistake... But why?\
    </div>
  `
}

const basics3: TTutorialPage = {
  title: "Basics 2: add",
  content: // html
  `\
    The <span class="token operation">add</span> instruction performs integer addition.\
    Like the <span class="token operation">mov</span> instruction, the operation is evaluated from right to left.\
    For example:\

    <div class="ml-5">
      <span class="token operation">add</span>\
      <span class="token register">r0</span>, \
      <span class="token register">r1</span>, \
      <span class="token immediate">#1</span>
    </div>\

    Takes the second source value <span class="token immediate">#1</span> (the number 1), adds it to the first source value\
    <span class="token register">r1</span>, and places the result into the destination register <span class="token register">r0</span>.

    Try out some <span class="token operation">add</span> operations now!


    <div class="hmm">\
      <div class="token label mb-1">Hmm...</div>\
      What happens when the result of an addition is too large to store in a single register?\
    </div>
  `
}

const basics4: TTutorialPage = {
  title: "Basics 3: sub",
  content: // html
  `\
    The <span class="token operation">sub</span> instruction performs integer subtraction.\
    Like the <span class="token operation">mov</span> and <span class="token operation">add</span> instructions, the\
    operation is evaluated from right to left. For example:\

    <div class="ml-5">
      <span class="token operation">sub</span>\
      <span class="token register">r0</span>, \
      <span class="token register">r1</span>, \
      <span class="token immediate">#1</span>
    </div>\

    Takes the second source value <span class="token immediate">#1</span> (the number 1), subtracts it from the first source value\
    <span class="token register">r1</span>, and places the result into the destination register <span class="token register">r0</span>.

    Experiment with <span class="token operation">sub</span>tracting now.


    <div class="hmm">\
      <div class="token label mb-1">Hmm...</div>\
      What happens if you subtract a larger number from a smaller number?
    </div>
  `
}

const basics5: TTutorialPage = {
  title: "Basics 4: rsb",
  content: // html
  `\
    The <span class="token operation">rsb</span> instruction works similarly to the regular <span class="token operation">sub</span>\
    instruction, except the first source register is subtracted from the second source register and then the result is placed in the\
    destination register. For example:\

    <div class="ml-5">
      <span class="token operation">rsb</span>\
      <span class="token register">r0</span>, \
      <span class="token register">r1</span>, \
      <span class="token immediate">#1</span>
    </div>\

    Takes the first source value <span class="token register">r1</span>, subtracts it from the second source value\
    <span class="token immediate">#1</span> (the number 1), and places the result into the destination register\
    <span class="token register">r0</span>.

    Try out the <span class="token operation">rsb</span> instruction now.


    <div class="hmm">\
      <div class="token label mb-1">Hmm...</div>\
      Why have both the <span class="token operation">rsb</span> and <span class="token operation">sub</span> instructions? Maybe\
      it'll become clear later...
    </div>
  `
}

const basics6: TTutorialPage = {
  title: "Basics 5: Bitwise Operations",
  content: // html
  `\
    The <span class="token operation">and</span>, <span class="token operation">orr</span>, <span class="token operation">eor</span>,\
    and <span class="token operation">bic</span> instructions are all what are called bitwise operations. Much like the\
    <span class="token operation">add</span> and <span class="token operation">sub</span> instructions, they are evaluated from right\
    to left.

    <span class="token operation">and</span> performs a bitwise <i>and</i> operation.\
    <div class="ml-5 mt-1">\
      <span class="token register">1</span>01<span class="token register">1</span>1 
      <span class="token register">1</span>10<span class="token register">1</span>0 >>> <span class="token register">10010</span>
    </div>\

    <span class="token operation">orr</span> performs a bitwise <i>or</i> operation.\
    <div class="ml-5 mt-1">\
      10<span class="token register">1</span>1<span class="token register">1</span>
      <span class="token register">1</span><span class="token register">1</span>0<span class="token register">1</span>0 >>> <span class="token register">11111</span>
    </div>\

    <span class="token operation">eor</span> performs an <i>exclusive or</i> operation.\
    <div class="ml-5 mt-1">\
      10<span class="token register">1</span>1<span class="token register">1</span> 
      1<span class="token register">1</span>010 >>> <span class="token register">01101</span>
    </div>\

    <span class="token operation">bic</span> performs a <i>bit clear</i> operation, which is an <span class="token operation">and</span>\
    operation between the first operand and the complement of the second.\
    <div class="ml-5 mt-1">\
      10<span class="token register">1</span>1<span class="token register">1</span> 
      11<span class="token register">0</span>1<span class="token register">0</span> >>> <span class="token register">00101</span>
    </div>\

    Play around with the bitwise operations now to see their effects.
  `
}

export default [
  basics1, subroutine1, subroutine2, basics2, basics3, basics4, basics5, basics6
];