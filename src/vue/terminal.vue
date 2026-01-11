<template>
  <div 
    class="terminal-container pl-1 py-1"
    :class="{ crt: settings.crtEffect }"
  >
    <div 
      ref="container"
      tour-item="terminal"
      class="prism-container px-2" 
      @keydown.ctrl.67.capture="running && stop()"
      @click.self="focus"
    >
      <!-- prompt output -->
      <pre class="repl output" v-html="output"></pre>

      <!-- input and syntax highlighter -->
      <!-- :style="`margin-left: ${running ? 0 : leadingLine.length}ch`" -->
      <pre
        ref="input"
        class="repl input"
        spellcheck="false"
        :contenteditable="!running || interrupted"
        @keydown.enter.stop="enter"
        @keydown.up.stop.prevent="upHistory"
        @keydown.down.stop.prevent="downHistory"
        @input="onInput"
      ></pre>
      <pre
        class="repl input-highlight"
        v-html="highlitInput"
        @click="focus"
      ></pre>
    </div>

    <!-- environment controls -->
    <div class="controls">
      <div 
        tour-item="editor-switch"
        class="clickable"
        @click.stop="$emit('switch')"
        @mouseenter="controlTooltip = 'editor'"
        @mouseleave="controlTooltip = undefined"
      >
        <i class="button code fas fa-code"></i>
      </div>

      <div v-show="controlTooltip" class="control-tooltip">{{ controlTooltip }}</div>
    </div>

    <div class="popup-output">
      <div class="p-1" style="border-radius: 0.3rem; background-color: #191d21;">
        <div v-if="computedTooltip.title !== ''">
          <div :style="`color: ${computedTooltip.color}`">{{ computedTooltip.title }}</div>
          <div>{{ computedTooltip.message }}</div>
        </div>

        <div v-if="errors.length > 0" class="clickable hoverable rounded px-1" @click="run">
          {{ errors.length }} errors
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { replWelcome, terminalHelpString } from "@/constants";
import { Assembler, InteractiveError, Interpreter, IriscError, RuntimeError } from '@/interpreter';
import { SimulatorState } from "@/simulator";
import { InstructionNode } from '@/syntax';
import { BranchNode } from '@/syntax/flow/BranchNode';
import { BIconTelephoneMinus } from "bootstrap-vue";
import { highlight, languages } from 'prismjs';
import { SettingsState, TTooltip, getCaretPosition, setCaretPosition } from '@/utilities';
import Shepherd from "shepherd.js";
import Vue from 'vue';
import { FileSystemState } from "@/files";

const prompt = "irisc:~$ ";

export default Vue.extend({
  name: 'terminal',
  data() {
    return {
      leadingLine: prompt,
      input: "" as string,
      output: replWelcome,
      history: [] as string[],
      historyIndex: -1 as number,

      tooltip: {
        // index: null as number | null,
        title: '' as string,
        message: '' as string
      },

      restoreDelay: false,
      savedDelay: 0,
      outputLength: 0,

      controlTooltip: undefined as string | undefined,

      isActive: false
    }
  },
  computed: {
    settings: SettingsState.settings,
    errors: SimulatorState.errors,
    currentInstruction: SimulatorState.currentInstruction,
    running: SimulatorState.running,
    simulatorOutput: SimulatorState.output,
    interrupted: SimulatorState.interrupted,
    exitStatus: SimulatorState.exitStatus,

    breakpoints: SimulatorState.breakpoints,
    paused: SimulatorState.paused,

    highlitInput: function (): string {
      const line = this.input.replace(/(\r\n|\n|\r)/gm, "");
      if (this.interrupted || this.running) return line;

      return highlight(line, languages.armv7, 'ARMv7');
    },

    computedTooltip: function (): TTooltip {
      if (this.interrupted) {
        return {
          title: 'Interrupted',
          color: '#7dad7d',
          message: 'Input required.'
        };
      }

      if (this.paused && this.breakpoints.includes(this.currentInstruction!)) {
        return {
          title: 'Breakpoint hit',
          color: '#bf5c5f',
          message: 'Switch to editor to continue.'
        }
      }

      return {} as TTooltip;
    },

    currentFile: FileSystemState.currentFile,
    currentDirectory: FileSystemState.currentDirectory
  },
  methods: {
    stop: SimulatorState.stop,
    run: SimulatorState.start,

    focus: function () {
      (this.$refs.input as HTMLElement).focus();
      
      if (this.isActive) {
        // move cursor to the end
        const sel = window.getSelection();
        sel?.selectAllChildren((this.$refs.input as HTMLElement));
        sel?.collapseToEnd();
      }
    },

    onInput: function (e: InputEvent) {
      const el = e.target as HTMLInputElement;

      let actualInput = el.innerText.substring(this.leadingLine.length);
      let caretOffset = getCaretPosition(el) - this.leadingLine.length;
      if (caretOffset < 0) {
        caretOffset = 0;
        if (e.data) {
          actualInput = e.data + actualInput.substring(1);
          caretOffset = 1;
        }
      }

      this.input = `${this.leadingLine}${actualInput}`;
      el.innerText = `${" ".repeat(this.leadingLine.length)}${actualInput}`;
      
      setCaretPosition(el, this.leadingLine.length + caretOffset);
    },
    
    enter: function (e: any) {
      e.preventDefault();

      const input = this.input
        .substring(this.leadingLine.length)
        .trim()
        .replace(/(\r\n|\n|\r)/gm, "");

      if (this.interrupted) {
        this.stdin(input);
        return;
      }

      this.addHistory(input)
      this.historyIndex = -1;

      this.$nextTick(() => {
        this.output += `\n${this.highlitInput}`;

        // only bother executing if there is any text
        if (input.length > 0) this.execute(input);
        
        this.setLeadingLine(prompt);
        // // if (!this.running) 
        // this.input = this.leadingLine;
        // // else this.input = "";

        e.target.innerText = " ".repeat(this.leadingLine.length);
        this.focus();

        this.$nextTick(() => {
          const element = this.$refs.container as HTMLElement;
          element.scrollTop = element.scrollHeight;
        });
      });
    },

    stdin: function (stdin: string) {
      this.$nextTick(() => {
        this.setLeadingLine("");

        this.$nextTick(() => {
          const element = this.$refs.container as HTMLElement;
          element.scrollTop = element.scrollHeight;
        });

        SimulatorState.setStdin(stdin + "\n");
      });
    },

    addHistory: function (input: string) {
      if (this.history[0] === input) return;
      if (input === "") return;
      
      this.history.unshift(input);
    },

    upHistory: function (e: any) {
      this.historyIndex = Math.min(this.historyIndex + 1, this.history.length - 1);
      if (this.historyIndex < 0) return;

      const input = this.history[this.historyIndex];
      this.insertInput(e.target, input);
    },

    downHistory: function (e: any) {
      this.historyIndex = Math.max(this.historyIndex - 1, -1);
      let input = "";
      if (this.historyIndex > -1) {
        input = this.history[this.historyIndex];
      } 

      this.insertInput(e.target, input);
    },

    insertInput: function (target: any, input: string) {
      target.innerText = `${" ".repeat(this.leadingLine.length)}${input}`;
      this.input = `${this.leadingLine}${input}`;
      
      this.$nextTick(() => {
        this.focus();
      });
    },

    setLeadingLine: function (leadingLine: string) {
      this.input = leadingLine;
      this.leadingLine = leadingLine;
      (this.$refs.input as HTMLElement).innerText = " ".repeat(this.leadingLine.length);
    },

    execute: function (input: string) {
      try {
        if (this.specialInput(input)) return;

        const line = Assembler.parse(input)[0];
        const node = Assembler.compileOne(line, 0);

        if (node instanceof InstructionNode) {
          if (node instanceof BranchNode) {
            throw new InteractiveError("Branch instructions cannot be executed on the command-line.", [], -1, -1);
          }

          Interpreter.execute(node, false);
        }
        else throw new InteractiveError("This operation is not supported on the command-line.", [], -1, -1);
      }
      catch (e){
        if (e instanceof IriscError) {
          this.printError(e);
        }
        else throw e;
      }
    },

    specialInput(input: string) {
      if ([':reset', ':r'].includes(input)) {
        SimulatorState.reset();
        return true;
      }

      if ([':clear', ':c'].includes(input)) {
        this.output = replWelcome;
        return true;
      }

      if ([':help', ':h'].includes(input)) {
        this.output += terminalHelpString;
        return true;
      }

      const textEditRegex = /^(vi|vim|nvim|nano|ne|emacs -nw|micro|tilde)($|\s)/g;
      const textEditParam = input.replace(textEditRegex, "");
      if (textEditParam !== input) {
        if (Shepherd.activeTour) {
          throw new InteractiveError("Can't switch to the editor yet. Do the tour! You'll get there.", [], -1, -1);
        }

        if (textEditParam !== '') FileSystemState.textEdit(textEditParam);
        this.$emit('switch');

        return true;
      }

      if (input.startsWith("echo ")) {
        this.output += `\n<span style="white-space: normal">${input.slice(5)}</span>`
        return true;
      }

      if (input === 'pwd') {
        this.output += `\n${FileSystemState.pwd()}`;
        return true;
      }

      if (input === 'ls') {
        const directories = this.currentDirectory.directories.map(e => `<span class="col-3 directory">${e.name}</span>`);
        const files = this.currentDirectory.files.map(e => `<span class="col-3 file">${e.name}</span>`);
        const ls = [
          '<span class="col-3 directory">.</span>', 
          ...[this.currentDirectory.parent && '<span class="col-3 directory">..</span>'],
          ...directories.sort(), 
          ...files.sort()
        ]

        this.output += `\n<div class="row">${ls.join("\t")}</div>`;
        return true;
      }

      if (input.startsWith('cd')) {
        const param = input.substring(3).trim();
        FileSystemState.cd(param);

        return true;
      }

      // TODO: secret crash easter egg
      // if (input === 'sudo rm -rf /*') {
      //   SimulatorState.interrupt();

      //   // remove prompt
      //   this.setLeadingLine("");
      //   this.$emit('crash');

      //   return true;
      // }

      if (input === './src') {
        if (Shepherd.activeTour) {
          throw new InteractiveError("Not allowed right now. Continue with the tour!", [], -1, -1);
        }

        if (SimulatorState.memory().text.length < 1) {
          throw new InteractiveError("Editor contains no runnable code.", [], -1, -1);
        }

        // this.executing = true;
        this.restoreDelay = true;
        this.savedDelay = SimulatorState.delay();

        SimulatorState.setDelay(2);
        SimulatorState.start();

        return true;
      }

      return false;
    },

    printError: function (e: IriscError) {
      this.output += // html
      `
        <span class="error-type">${e.type}</span>: ${e.message}\
      `
      //<span class="ml-5">${e.statement}</span>\
    },

    loadHistory: function () {
      this.history = JSON.parse(localStorage.getItem("history") ?? "[]");
    }
  },

  created: function () {
    this.loadHistory();
  },

  mounted: function () {
    this.setLeadingLine(prompt);
  },

  activated: function () {
    this.isActive = true;
    this.focus();
  },

  deactivated: function () {
    this.isActive = false;
  },

  watch: {
    history: function (value) {
      localStorage.setItem("history", JSON.stringify(value));
    },

    running: function (started: boolean) {
      // when code is run: running changed false -> true
      if (started) {
        if (!this.output.endsWith('<span class="token op-label">src</span>')) {
          const highlitPrompt = highlight(prompt, languages.armv7, 'ARMv7');
          this.output += `\n${highlitPrompt}./<span class="token op-label">src</span>`;

          this.restoreDelay = false;
        }

        // save current output length
        this.outputLength =  this.output.length;

        // remove prompt
        this.setLeadingLine("");
      }

      // when code stops: running changed true -> false
      else {
        // restore previous delay
        if (this.restoreDelay) SimulatorState.setDelay(this.savedDelay);

        if (this.exitStatus instanceof RuntimeError) {
          this.output += "\n";
          this.printError(this.exitStatus);

          this.setLeadingLine(prompt);
        }
        else {          
          // restore leading terminal prompt + existing leading
          this.setLeadingLine(`${this.leadingLine}${prompt}`);
        }

        // focus to the end of the terminal
        this.$nextTick(() => {
          this.focus();
        });
      }
    },


    interrupted: function (isInterrupted: boolean) {
      if (isInterrupted) {
        this.$nextTick(() => {
          this.focus();
        });
      }
    },

    simulatorOutput: function (value: string[]) {
      if (this.running) {
        const localValue = value.slice();
        const lastLine = localValue.pop() ?? "";

        // add all lines apart from the last to the output
        if (localValue.length > 0) {
          this.output = this.output.slice(0, this.outputLength) + '\n' + localValue.join('\n');
        }

        // set last line to leading output to respect lack of line feed
        this.setLeadingLine(lastLine);

        this.$nextTick(() => {
          const element = this.$refs.container as HTMLElement;
          element.scrollTop = element.scrollHeight;
        });
      }
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.terminal-container {
  position: relative;
  text-align: left;
  height: 100%;
  max-height: 100%;
  width: 100%;
  border: 2px dashed #8b0c3c;
}

.prism-container {
  height: 100%;
  max-height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.repl.output >>> .internal {
  color: #bfbfbf;
}

.repl {
  color: white;
  margin-bottom: 0;
}

.repl.output {
  white-space: pre-line;
  overflow: hidden;
}

.repl.input {
  -webkit-text-fill-color: transparent;
}

.repl.input:focus-visible {
  outline: none;
  border: none;
}

.repl.input-highlight {
  margin-top: -21px;
  padding-bottom: 10rem;
}

.controls {
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 0.3rem; 
  background-color: #191d21;
  padding: 0.25rem 0.33rem 0.15rem 0.4rem;
}

.controls .control-tooltip {
  position: absolute;
  right: 0;
  bottom: -25px;
  border-radius: 0.3rem; 
  background-color: #191d21;
  padding: 0 0.25rem 0.05rem 0.25rem;
  font-size: 14px;
}

.popup-output {
  /* width: 100%; */
  max-width: 600px;
  position: absolute;
  bottom: 0;
  padding: 0.25rem 0.5rem 0.5rem 0.25rem;
}

.button.code {
  color: #8b0c3c;
}

.errors {
  position: absolute;
  bottom: 0;
  padding: 0.25rem 0.5rem 0.5rem 0.25rem;
}

.repl.output >>> .error-type {
  color: #de3759;
}

.repl.output >>> .directory {
  color: #07a;
}

.repl.output >>> .file {
  color: #dcdcdc;
}

</style>
