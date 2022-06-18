<template>
  <div 
    ref="container"
    class="container px-2" 
    @click="focus"
  >
    <!-- prompt output -->
    <pre class="repl output" v-html="output"></pre>

    <!-- input and syntax highlighter -->
    <pre
      ref="input"
      class="repl input"
      :style="`margin-left: ${prompt.length}ch`"
      contenteditable
      @keydown.enter.stop="enter"
      @keydown.up.stop.prevent="upHistory"
      @keydown.down.stop.prevent="downHistory"
      @input="onInput"
    ></pre>
    <pre
      class="repl input-highlight"
      v-html="highlitInput"
    ></pre>

    <!-- environment controls -->
    <div class="controls">
      <div>
        <i 
          class="button code fas fa-code clickable" 
          @click="$emit('switch')"
        ></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { replWelcome } from "@/constants";
import { Assembler, InteractiveError, Interpreter, IriscError } from '@/interpreter';
import { SimulatorState } from "@/state";
import { InstructionNode } from '@/syntax';
import { BranchNode } from '@/syntax/flow/BranchNode';
import { highlight, languages } from 'prismjs';
import Vue from 'vue';

export default Vue.extend({
  name: 'terminal',
  data() {
    return {
      prompt: "irisc:~$ ",
      input: "" as string,
      output: replWelcome,
      history: [] as string[],
      historyIndex: -1 as number,

      tooltip: {
        // index: null as number | null,
        title: '' as string,
        message: '' as string
      },
    }
  },
  computed: {
    errors: SimulatorState.errors,

    highlitInput: function () : string {
      let line = this.input.replace(/(\r\n|\n|\r)/gm, "");
      return highlight(line, languages.armv7, 'ARMv7');
    }
  },
  methods: {
    focus: function () {
      (this.$refs.input as HTMLElement).focus();
      
      // move cursor to the end
      document.execCommand('selectAll', false, undefined);
      document.getSelection()?.collapseToEnd();
    },

    onInput: function (e: any) {
      this.input = `${this.prompt}${e.target.innerText}`;
    },
    
    enter: function (e: any) {
      let input = this.input
        .substring(this.prompt.length)
        .replace(/(\r\n|\n|\r)/gm, "");

      this.addHistory(input)
      this.historyIndex = -1;

      this.$nextTick(() => {
        this.output += `\n${this.highlitInput}`;

        this.input = this.prompt;
        e.target.innerText = "";

        this.execute(input);

        this.$nextTick(() => {
          let element = this.$refs.container as HTMLElement;
          element.scrollTop = element.scrollHeight;
        });
      });

      e.preventDefault();
    },

    addHistory: function (input: string) {
      if (this.history[0] === input) return;
      if (input === "") return;
      
      this.history.unshift(input);
    },

    upHistory: function (e: any) {
      this.historyIndex = Math.min(this.historyIndex + 1, this.history.length - 1);
      if (this.historyIndex < 0) return;

      let input = this.history[this.historyIndex];
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
      target.innerText = input;
      this.input = `${this.prompt}${input}`;
      
      this.$nextTick(() => {
        target.focus();

        // set caret position to end - if there is any text in this history item
        if (target.firstChild) {
          let range = document.createRange();
          range.setStart(target.firstChild, input.length);
          range.collapse(true);

          let sel = window.getSelection() as Selection;
          sel.removeAllRanges();
          sel.addRange(range);
        }
      });
    },

    execute: function (input: string) {
      try {
        if (input === ":reset" || input === ":r") {
          SimulatorState.reset();
          return;
        }

        if (input === ":clear" || input === ":c") {
          this.output = replWelcome;
          return;
        }

        let line = Assembler.parse(input)[0];
        let node = Assembler.compileOne(line, 0);

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
    this.input = this.prompt;
  },

  watch: {
    history: function (value) {
      localStorage.setItem("history", JSON.stringify(value));
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  position: relative;
  text-align: left;
  height: 100%;
  max-height: 100%;
  width: 100%;
  border: 2px dashed #8b0c3c;
  overflow-x: hidden;
}

.repl.output >>> .welcome {
  color: #bfbfbf;
}

.repl {
  color: white;
  margin-bottom: 0;
}

.repl.output {
  white-space: pre-line;
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
  padding-bottom: 6rem;
}

.controls {
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 0.3rem; 
  background-color: #191d21;
  padding: 0.25rem 0.33rem 0.15rem 0.4rem;
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
  color: crimson;
}

</style>
