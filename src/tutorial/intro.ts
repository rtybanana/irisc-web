import { TTutorialPage } from "./types"

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
  // TODO: maybe add
  // Crucially, <span class="irisc">iRISC</span> is <u>not</u> a perfect simulator for an ARMv7 processor.\
  // It is a specifically simplified demonstration simulator which remains faithful to the real processor\
  // in just enough ways so that it can serve as a teaching aid for architectures and programming basics.
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

    <div class="hmm">\
      <div class="token label mb-1">Hint</div>\
      You can use ':clear' (or ':c' shorthand) to clear the terminal and ':reset' (':r') to reset\
      the simulator.\
    </div>
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
    
    Type the string 'error' into the text editor to produce an error. Hover over the underlined token\
    to show more detailed information about the error in the bottom left corner of the editor.

    You can use the <i class="fas fa-terminal fa-sm irisc"></i> button to return to the terminal at any time.
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
    have semantic roles which, in general, a defensive programmer should aim to respect.

    The registers can be found in the far left fenced section of the application. The current value is displayed as\
    an <span class="irisc">unsigned integer</span> in both hexadecimal and decimal representations. 
    
    Beneath the registers are the CPSR flags - more on these later.
  `
}

const intro5: TTutorialPage = {
  title: "Introduction 4: The Registers 1",
  content: // html
  `\
    On the previous page, I mentioned the semantic roles of the final three registers.

    The <span class="token register">sp</span> is the <span class="token register">stack pointer</span>. This register\
    is a memory address (or <span class="irisc">pointer</span>) to the top of the stack; temporary local storage in RAM.

    The <span class="token register">lr</span> is the <span class="token register">link register</span>. This register\
    stores a <span class="irisc">pointer</span> to the next instruction following a function call so that the program\
    knows where to return to after the function completes.

    The <span class="token register">pc</span> is the <span class="token register">program counter</span>. This register\
    is a <span class="irisc">pointer</span> to the next instruction to be executed in the program; also stored in RAM.
    
    The <span class="token register">program counter</span> is not considered <i>general-purpose</i> because editing the\
    contents of the <span class="token register">pc</span> during execution has side-effects. Actually, just one very\
    important side-effect in that it alters which instruction is executed next. You may edit the\
    <span class="token register">pc</span> during execution, but only with the express intent of controlling the flow\
    of the program.
  `
}

const intro6: TTutorialPage = {
  title: "Introduction 5: The Memory",
  content: // html
  `\
    The simulation RAM is displayed in the lower right fenced section of the application window.\
    The <span class="token register">text</span> (instructions) and <span class="token operation">data</span>\
    sections grow from the left, and the <span class="token line-comment">stack</span> grows from the right - mirroring\
    how memory is structured in a typical computer.

    By default, <span class="irisc">iRISC</span> simulates a system with an unrealisticaly limited amount of RAM.\
    This is by design. Principally, <span class="irisc">iRISC</span> is a teaching aid - not a web-based ARM emulator.\
    Limiting the memory in this way enables it to demonstrate some slightly unclear aspects of how the software and\
    hardware interact under the hood. 
    
    If you wish to increase the amount of RAM available, you can do so using the\
    <i class="fas fa-sliders-h fa-sm"></i> button in the bottom right corner.
  `
}

const intro7: TTutorialPage = {
  title: "Introduction 6: The Assembler 0",
  content: // html
  `\
    The <span class="irisc">assembler</span> is located in the lower central fenced section of the application window.\
    The most recently interpreted instruction is assembled into machine code and displayed in the upper fenced section\
    of the assembler component. Extra information about the instruction is displayed in the fenced section below it.

    In a modern computer, code that you write is compiled into assembly language and then further assembled into machine\
    code. This machine code is then decoded and processed by the CPU where it is used to decide which action needs to be\
    taken. In the case of the ARMv7 family of processors, all assembled instructions fit into 32 bits of space.
    
    Machine code is the lowest level programming language. The language spoken by actual hardware. You will most certainly\
    never have to write it, but it can be beneficial (and interesting!) to understand how it works.
  `
}

const intro8: TTutorialPage = {
  title: "Introduction 7: The Assembler 1",
  content: // html
  `\
    Switch back to the terminal view using the <i class="fas fa-terminal fa-sm irisc"></i> button and enter the following\
    command.\

    <div class="ml-5">
      <span class="token operation">mov</span>\
      <span class="token register">r0</span>, \
      <span class="token immediate">#1</span>
    </div>\

    Press enter and you should see that the assembler section has been populated! Both the bitcode and text versions of the\
    instruction are displayed, along with the execution status. 
    
    You will notice that the machine code for the instruction has been divided into many different sections. Each of these\
    sections has a particular meaning which the the CPU uses to understand which action it needs to take. You can hover\
    over any one of these areas to learn more about how the computer is able to decode your instruction.
  `
}

const intro99: TTutorialPage = {
  title: "Introduction 8: Outro",
  content: // html
  `\
    Now that we've gone through the app interface and some computer architecture basics, it's time to get into writing\
    some actual assembly language and seeing what affect it has on the simulator.

    Continue to the next page to start learning some <span class="irisc">ASM</span> basics!
  `
}

export default [
  intro1, intro2, intro3, intro4, intro5, intro6, intro7, intro8, intro99
]
