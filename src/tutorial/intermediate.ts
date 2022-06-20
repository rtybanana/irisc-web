import { TTutorialPage } from "./types"

const intermediate1: TTutorialPage = {
  title: "Intermediate 0: The Editor (Revisited)",
  content: // html
  `\
    Now that we've gone through the basics of writing individual instructions in the terminal. It's\
    time to switch to the editor and write some multi-line programs. Click the\
    <i class="fas fa-code fa-sm irisc"></i> button to switch to the editor.

    The editor allows you to write both scripts and complete programs in ARMv7 assembly language.\
    A script does not require an entry point and will run from top to bottom. A complete program\
    uses the <span class="token label">main:</span> label as its entry point.

    Both types of program will run until either a final <span class="token operation">bx</span>\
    <span class="token register">lr</span> instruction (more on this later) or until the program\
    counter runs off the end of the program.
  `
}

const intermediate2: TTutorialPage = {
  title: "Intermediate 1: Labels",
  content: // html
  `\
    <span class="token label">Labels</span> allow you, the programmer, to map names to locations\
    in the program which can then be <span class="token operation">branch</span>ed to in order to\
    control the flow of the program. Labels are a vital aspect of writing assembly, necessary to\
    implement loops, functions and even conditions in some cases.

    Let's start with the entry point. Add the <span class="token label">main:</span> label and add\
    some of the instructions you learnt in the previous chapter to execute in order. Leave off the\
    <span class="token operation">bx</span> <span class="token register">lr</span> for now.\

    <div class="ml-5">
      <span class="token label">main:</span>\
      
      <div class="ml-5">\
        <span class="token operation">mov</span>\
        <span class="token register">r0</span>, \
        <span class="token immediate">#1</span>\

        <span class="token operation">mov</span>\
        <span class="token register">r1</span>, \
        <span class="token immediate">#2</span>\

        ...
      </div>\
    </div>\

    Execute the program using the <span class="green fas fa-play"></span> button in the top right\
    of the editor. You can control the tickrate of the program using the range slider, or step\
    through each instruction manually using the <span class="amber fas fa-step-forward"></span>\
    button.

    <div class="hmm">\
      <div class="token label mb-1">Hmm...</div>\
      What happened when the program reached the end of your instructions? Add a final\
      <span class="token operation">bx</span> <span class="token register">lr</span> instruction\
      and try again. What's different?
    </div>
  `
}

const intermediate3: TTutorialPage = {
  title: "Intermediate 2: Branches (b)",
  content: // html
  `\
    Now that we've added <span class="token label">labels</span> to our assembly language arsenal,\
    we can begin to control the flow of our program. We do this using\
    <span class="token operation">branches</span>. There are a few different kinds of branches\
    available for different purposes. In this step we will be using the\
    <span class="token operation">b</span> instruction.

    The <span class="token operation">b</span> instruction is as simple as branches get. You provide\
    a single operand, the label that you would like to branch to, and the assembler handles the rest.

    Under the hood during the assembly process, the text label is translated into an\
    <span class="irisc">offset</span> from the branch instruction to the provided label.\
    If the label is three instructions before the branch, then the offset would be -3.

    Add a <span class="token operation">b</span> <span class="token label">main</span> instruction to\
    the end of your program (before the <span class="token operation">bx</span>\
    <span class="token register">lr</span> if you have one!) and try running again.

    <div class="hmm">\
      <div class="token label mb-1">Hmm...</div>\
      What have we created? How would you write this same construct in a higher level language?
    </div>
  `
}

const intermediate4: TTutorialPage = {
  title: "Intermediate 3: Comparisons (cmp)",
  content: // html
  `\
    If you answered <span class="irisc">an infinite loop</span> to the question at the end of the last\
    step then you'd be right. 
    
    Infinite loops are cool, but, on their own, not particularly useful in the context of a full program.\
    At the very least we need some way of breaking out of this loop if some condition is met so that our\
    program can end. Enter the <span class="token operation">cmp</span> instruction. 
    
    You'd better strap in if this is new to you because there's gonna be a lot of new concepts introduced\
    in the next few steps.

    The <span class="token operation">cmp</span> instruction performs an arithmetic subtraction and uses\
    the result to set the <span class="irisc">cpsr</span> flags. Crucially, the\
    <span class="token operation">cmp</span> instruction does not alter the contents of any register during\
    this process, the result of the operation is discarded after the flags are set.

    Continue to the next page to learn more about the <span class="irisc">cpsr</span> and its flags.
  `
}

const subroutine1: TTutorialPage = {
  title: "Subroutine 2: The CPSR",
  content: // html
  `\
    The <span class="irisc">cpsr</span> stands for the 'current program status register' and is one of the\
    <i>non</i> general-purpose registers in the ARMv7 CPU. Four bits of this register are dedicated to the\
    condition code flags: boolean values most often used to evaluate the result of comparisons in the context\
    of <span class="irisc">conditional operations</span>.

    &lt;more coming soon&gt;
  `
}

const intermediate5: TTutorialPage = {
  title: "Intermediate 4: Conditions",
  content: // html
  `\
    &lt;coming soon&gt;
  `
  // Remove your code from before the <span class="token operation">b</span> <span class="token label">main</span>\
  // instruction and add an instruction to set <span class="token register">r0</span> equal to\
  // <span class="token immediate">0</span>.
}


export default [
  intermediate1, intermediate2, intermediate3, intermediate4, subroutine1, intermediate5
];