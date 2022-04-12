export type TTutorialPage = {
  title: string,
  content: string
};

const intro1: TTutorialPage = {
  title: "Introduction 0: Welcome",
  content: // html
  `\
    Welcome to <span class="irisc">iRISC</span>.

    <span class="irisc">iRISC</span> stands for <i>interactive reduced instruction-set computer</i>.\
    This web app is an interactive introduction to RISC computer architecture and assembly language.\
    Specifically, <span class="irisc">ARMv7</span> assembly language.

    I have tried to write a simple tutorial which goes through some of the basics, not only of\
    writing assembly, but also some aspects of computer architecture. I aimed to keep the required\
    knowledge to a minimum; however, I do assume some understanding of basic programming concepts: \
    number representations, signed and unsigned integers, etc.

    Either way, I hope you find this to be a fun/useful tool!
  `
}

const intro2: TTutorialPage = {
  title: "Introduction 1: The Terminal",
  content: // html
  `\
    In the center region of the page there is a simple <i>read-evaluate-print-loop</i> (REPL) terminal.\
    This terminal supports simple syntax highlighting and error checking for a subset of the\
    <span class="irisc">ARMv7</span> instruction-set.

    <span class="token operation">Operations</span> are highlighted in red.
    <span class="token register">Registers</span> are highlighted in blue.
    <span class="token immediate">Immediates</span> are highlighted in grey.
    Errors printed as command output.
    
    Type the string 'error' into the terminal and press enter to produce an error.
  `
}

const intro3: TTutorialPage = {
  title: "Introduction 2: The Editor",
  content: // html
  `\
    Click the <i class="fas fa-code fa-sm irisc"></i> button in the top right of the terminal to access the\
    code editor. 
    
    This editor supports simple syntax highlighting and error checking for a larger subset\
    of the <span class="irisc">ARMv7</span> instruction-set.

    <span class="token operation">Operations</span> are highlighted in red.
    <span class="token register">Registers</span> are highlighted in blue.
    <span class="token immediate">Immediates</span> are highlighted in grey.
    <span class="token label">Labels</span> are highlighted in yellow.
    <span class="token error">Errors</span> are shown with a wavy underline.
    
    Type the string 'error' into the text editor to produce an error. Hover over the offending token\
    to show more detailed information in the bottom left corner of the editor.
  `
}

const intro4: TTutorialPage = {
  title: "Introduction 3: The Registers 0",
  content: // html
  `\
    The CPU registers are the most accessible form of storage in the modern computer. The trade-off is that\
    read/write speed comes at the cost of capacity. The CPU simulated here has 16 registers, each 32-bits\
    wide, totalling just 1/16 of a kB.

    The first fifteen registers (<span class="token register">r0</span> >> <span class="token register">lr</span>)\
    are considered to be <i>general-purpose</i>, meaning that they are freely accessible to be edited by the executing program.

    The final three registers \
     (<span class="token register">sp</span>, \
      <span class="token register">lr</span>, \
      <span class="token register">pc</span>) \
    have semantic roles which, in general, the conscientious programmer should aim to respect.
  `
}

const intro5: TTutorialPage = {
  title: "Introduction 4: The Registers 1",
  content: // html
  `\
    The <span class="token register">sp</span> is the <span class="token register">stack pointer</span>. This register\
    is a memory address (or <span class="irisc">pointer</span>) to the top of the stack; temporary local storage in RAM.

    The <span class="token register">lr</span> is the <span class="token register">link register</span>. This register\
    stores a <span class="irisc">pointer</span> to the next instruction following a function call so that the program\
    knows where to return to after the function completes.

    The <span class="token register">pc</span> is the <span class="token register">program counter</span>. This register\
    is a <span class="irisc">pointer</span> to the next instruction to be executed in the program; also stored in RAM.\
    
    The <span class="token register">program counter</span> is not considered <i>general-purpose</i> because editing the\
    contents of the <span class="token register">pc</span> during execution has side-effects. Actually, just one very\
    important side-effect in that it alters which instruction is executed next.
  `
}

const intro99: TTutorialPage = {
  title: "Introduction n: Outro",
  content: // html
  `\
    Now that we've gone through the app interface and some computer architecture basics, it's time to get into writing\
    some actual assembly language and seeing what affect it has on the simulator.

    Continue to the next page to start learning some ASM basics!
  `
}

const basics1: TTutorialPage = {
  title: "Basics 0: mov",
  content: // html
  `\
    The <span class="token operation">mov</span> instruction is the most basic instruction in the ARM instruction-set.\
    It simply inserts a single, source value into a destination register. The source value is what is known as a\
    <span class="irisc">flexible operand</span> which means it can either be an <span class="token immediate">immediate</span>\
    (a numeric literal), or the contents of a <span class="token register">register</span>.

    In ARM assembly, source values move from right to left into the destination register. For example:\

    <div class="ml-5">
      <span class="token operation">mov</span>\
      <span class="token register">r0</span>, \
      <span class="token immediate">#1</span>
    </div>\

    Takes the source value <span class="token immediate">#1</span> (the number 1) and <span class="token operation">mov</span>-es\
    it into the destination register <span class="token register">r0</span>.

    Click the <i class="fas fa-terminal fa-sm irisc"></i> button to switch back to the terminal environment and experiment with the\
    <span class="token operation">mov</span> instruction!
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
      You may notice that the result is a very large, positive number. 
      
      This isn't a mistake... But why?\
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



export const pages = [
  intro1, intro2, intro3, intro4, intro5, intro99,

  basics1, basics2, basics3
]