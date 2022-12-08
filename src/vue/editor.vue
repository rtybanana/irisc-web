<template>
  <!-- @click="click" -->
  <div 
    class="prism-container pl-1 pr-0 py-1 position-relative" 
    @mouseover="hover"
    @click="click"
    @dblclick="dblclick"
    @keydown.ctrl.191.capture.prevent.stop="lineComment"
  >
    <prism-editor 
      ref="prism"
      id="editor" 
      v-model="program"
      :highlight="highlighter" 
      :tab-size="1" 
      :insert-spaces="false" 
      line-numbers
      @input="save"
    ></prism-editor>

    <div class="controls">
      <div class="d-inline-block">
        <i 
          class="button red fas fa-stop mr-1 clickable" 
          @click="stop"
        ></i>

        <!-- run / pause / resume -->
        <template>
          <i 
            v-show="!running"
            class="button green fas fa-play mx-1 clickable" 
            @click="$emit('run')"
          ></i>
          <i 
            v-show="running && !paused"
            class="button fas fa-pause mx-1 clickable" 
            @click="pause"
          ></i>
          <i 
            v-show="running && paused"
            class="button green fas fa-play mx-1 clickable" 
            @click="resume"
          ></i>
        </template>

        <i 
          class="button amber step fas fa-step-forward mx-1 clickable"
          @click="$emit('step')"
        ></i>

        <div class="d-inline-block mx-1" style="width: 60px;">
          <b-form-input 
            style="margin-bottom: -5px;" 
            type="range" 
            inline
            :value="1000 / delay"
            min="0.5"
            max="50"
            step="0.1"
            @input="setDelay"
          ></b-form-input>
        </div>

        <i 
          class="button terminal fas fa-terminal ml-1 clickable" 
          @click="$emit('switch')"
        ></i>
      </div>
    </div>

    <div class="output">
      <div class="p-1" style="border-radius: 0.3rem; background-color: #191d21;">
        <div v-if="hasOutput">
          <div v-for="(line, index) in output" :key="index">
            {{ line }}
          </div>
        </div>

        <template v-if="computedTooltip.title !== ''">
          <div :style="`color: ${computedTooltip.color}`">{{ computedTooltip.title }}</div>
          <div>{{ computedTooltip.message }}</div>
        </template>

        <div v-else-if="errors.length > 0">
          {{ errors.length }} errors
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { debounce } from "@/assets/functions";
import { Assembler, RuntimeError } from "@/interpreter";
import { SimulatorState } from "@/state";
import { highlight, languages } from 'prismjs';
import 'prismjs/themes/prism.css'; // import syntax highlighting styles
import getCaretCoordinates from "textarea-caret";
import Vue from 'vue';
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';



type TPoint = {
  x: number;
  y: number;
}

type TTooltip = {
  title: string;
  color: string;
  message: string;
}

export default Vue.extend({
  name: 'editor',
  components: {
    PrismEditor
  },
  data() {
    return {
      program: '' as string,
      tooltip: { title: '', color: '', message: '' } as TTooltip,
    }
  },
  computed: {
    memory: SimulatorState.memory,
    running: SimulatorState.running,
    paused: SimulatorState.paused,
    delay: SimulatorState.delay,
    currentInstruction: SimulatorState.currentInstruction,

    output: SimulatorState.output,
    hasOutput: function () : boolean {
      if (this.output.length === 1 && !this.output[0]) {
        return false;
      }

      return true;
    },

    errors: SimulatorState.errors,
    exitStatus: SimulatorState.exitStatus,

    computedTooltip: function () : TTooltip {
      if (this.tooltip.title !== "") return this.tooltip;
      if (this.exitStatus instanceof RuntimeError) {
        return {
          title: this.exitStatus.type,
          color: this.exitStatus.color,
          message: this.exitStatus.message
        }
      }
      if (this.exitStatus === 0) {
        return {
          title: "Exit Success",
          color: "#5d9455",
          message: "Program executed without error."
        }
      }

      return { title: '', color: '', message: '' };
    }
  },
  methods: {
    stop: function () {
      SimulatorState.stop();
    },

    pause: function () {
      SimulatorState.pause();
    },

    resume: function () {
      SimulatorState.resume();
    },

    setDelay: function (delay: number) {
      SimulatorState.setDelay(1000 / delay)
    },

    /**
     * 
     */
    hover: function (e: any) {
      if (e.target.parentNode.className.includes("error")) {
        if (!e.target.parentNode.dataset["errorIdx"]) return;
        
        let errorIndex = e.target.parentNode.dataset["errorIdx"] as number;
        let error = this.errors[errorIndex];

        this.tooltip = {
          title: error.type,
          color: error.color,
          message: error.message
        }
      }
      else {
        this.tooltip = {
          message: '',
          color: '',
          title: ''
        };
      }
    },

    click: function (e: any) {
      if (e.target.parentNode.className.includes("error")) {
        e.preventDefault();
        e.stopPropagation();

        let prismEditor = this.$refs.prism as any;    // casting to any :(
        let newTarget = prismEditor.$refs.textarea as HTMLInputElement;

        newTarget.dispatchEvent(
          new CustomEvent('errorClick', {
            detail: {
              coords: { x: e.layerX, y: e.layerY } as TPoint
            }
          }
        ));
      }
    },

    /**
     * 
     */
    dblclick: function (e: any) {
      if (e.target.parentNode.className.includes("error")) {
        e.preventDefault();
        e.stopPropagation();

        let prismEditor = this.$refs.prism as any;    // casting to any :(
        let newTarget = prismEditor.$refs.textarea as HTMLInputElement;

        newTarget.dispatchEvent(
          new CustomEvent('errorDblClick', {
            detail: {
              coords: { x: e.layerX, y: e.layerY } as TPoint
            }
          }
        ));
      }
    },

    lineComment: function (e: any) {
      let prismEditor = this.$refs.prism as any;    // casting to any :(
      let textarea = prismEditor.$refs.textarea as HTMLTextAreaElement;

      // save current selection and reinstate after comments are added
      let selectionStart = textarea.selectionStart;
      let selectionEnd = textarea.selectionEnd;
      
      // split into lines
      let lines = textarea.value.split(/\r?\n|\r/);

      // get selected line indexes
      let lineIdxs = getSelectedLineIndexes(textarea);
      let commentCount = lineIdxs.reduce((count, lineIdx) => {
        let line = lines[lineIdx];
        if (line.substring(0, 3) !== "// " && line !== "") count++;

        return count;
      }, 0);

      let addComment = true;
      if (commentCount < lineIdxs.length / 2) addComment = false;

      // add or remove "// " to create a solid block of commented or uncommented code within the selection.
      lineIdxs.forEach(e => {
        if (addComment && lines[e].substring(0, 3) !== "// " && lines[e] !== "") {
          lines[e] = `// ${lines[e]}`
          selectionEnd += 3;      // increment persisted selection end
        }
        else if (!addComment && lines[e].substring(0, 3) === "// ") {
          lines[e] = lines[e].substring(3);
          selectionEnd -= 3;      // decrement persisted selection end
        }
      });

      // join commented lines and reinstate selection
      this.program = lines.join("\n");
      this.$nextTick(() => textarea.setSelectionRange(selectionStart, selectionEnd));

      function getSelectedLineIndexes(textarea: HTMLTextAreaElement) {
        let start = textarea.value.substr(0, textarea.selectionStart).split(/\r?\n|\r/).length - 1;
        let end = textarea.value.substr(0, textarea.selectionEnd).split(/\r?\n|\r/).length - 1;

        // create array of all line indexes i.e.
        // [3, 4, 5] if lines 4, 5, and 6 are selected
        return Array.from({length: (end - start) + 1}, (_, i) => i + start);
      }
    },

    /**
     * 
     */
    highlighter: function (program: string) {
      // initial ARMv7 syntax highlighting from file
      let highlit: string = highlight(program, languages.armv7, 'ARMv7');
      if (highlit.length === 0) return "";

      // deconstruct program to lines
      let lines = highlit.split(`<span class="token end">\n</span>`);

      // deconstruct lines to tokens
      let tokens = lines.map(e => e.match(/<span.*?<\/span>\s*/gim) ?? []);

      // squiggly underline token errors
      this.highlightTokenErrors(tokens);

      // reconstruct highlit tokens to lines
      lines = tokens.map(e => (e as string[]).join(""));
      this.highlightLineErrors(lines);
      this.highlightExecuting(lines);
      
      // reconstruct highlit lines to program
      return lines.join(`<span class="token end">\n</span>`);
    },

    /**
     * 
     */
    highlightTokenErrors: function (elements: RegExpMatchArray[]) {
      this.errors
        .forEach((error, index) => {
          if (error.tokenIndex === -1) return;

          let line = elements[error.lineNumber];

          let filteredIndex: number = -1;
          let tokenIndex = line?.findIndex((e, i) => {
            if (!e.includes("whitespace")) filteredIndex++;
            if (filteredIndex === error.tokenIndex) return true;
          })
          let tokenString = line?.[tokenIndex];

          if (tokenString !== undefined) {
            line[tokenIndex] = `<span class="token error" style="text-decoration-color: ${error.color}" data-error-idx="${index}">${tokenString}</span>`;
          }
        });
    },

    /**
     * 
     */
    highlightLineErrors: function (lines: string []) {
      // compile-time errors
      this.errors
        .forEach((error, index) => {
          if (error.tokenIndex !== -1) return;

          let line = lines[error.lineNumber];

          if (line !== undefined) {
            console.log(line);
            lines[error.lineNumber] = `<span class="line error" style="text-decoration-color: ${error.color}" data-error-idx="${index}">${line}</span>`;

          }
        });

      // exit status runtime error
      if (this.exitStatus instanceof RuntimeError) {
        let line = lines[this.exitStatus.lineNumber];

        if (line !== undefined) {
          lines[this.exitStatus.lineNumber] = `<span class="line error" style="text-decoration-color: ${this.exitStatus.color}">${line}</span>`;
        }
      }
    },

    /**
     * 
     */
    highlightExecuting: function (lines: string[]) {
      if (this.running) {
        let executing = lines[this.currentInstruction!.lineNumber];

        if (executing !== undefined) {
          lines[this.currentInstruction!.lineNumber] = `<span class="line executing">${executing}</span>`;
        }
      }
    },

    /**
     * 
     */
    moveCaretToCursor: function (e: any) {
      let mouseCoords: TPoint = e.detail.coords;
      let textarea = e.target as HTMLTextAreaElement;
      let caretPosition = this.getCaretPositionAtCursor(textarea, mouseCoords);

      textarea.setSelectionRange(caretPosition, caretPosition);
      textarea.focus();
    },

    /**
     * 
     */
    highlightWordAtCursor: function (e: any) {
      let mouseCoords: TPoint = e.detail.coords;
      let textarea = e.target as HTMLTextAreaElement;
      let caretPosition = this.getCaretPositionAtCursor(textarea, mouseCoords);
      let [wordStart, wordEnd] = [caretPosition, caretPosition];

      while (/\w/.test(textarea.value[wordStart - 1]) && wordStart > 0) wordStart--;
      while (/\w/.test(textarea.value[wordEnd]) && wordEnd < textarea.value.length) wordEnd++;

      textarea.setSelectionRange(wordStart, wordEnd);
      textarea.focus();
    },

    /**
     * 
     */
    getCaretPositionAtCursor: function (element: HTMLTextAreaElement, mouseCoords: TPoint) : number {
      let smallestDistance = Number.MAX_VALUE;
      let caretPosition = 0;
      for (let i = 0; i < element.value.length + 1; i++) {
        let textPos = getCaretCoordinates(element, i);
        let charCoords: TPoint = { 
          x: textPos.left, 
          y: textPos.top + (textPos.height / 2)
        };

        let distance = getDistance(mouseCoords, charCoords);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          caretPosition = i;
        }
      }

      return caretPosition;

      function getDistance(p1: TPoint, p2: TPoint) : number {
        let y = p2.x - p1.x;
        let x = p2.y - p1.y;
        
        return Math.sqrt(x * x + y * y);
      }
    },

    /**
     * Save editor content to local storage so that it persists on this device
     */
    save: debounce((program: string) => {
      localStorage.setItem('program', program);
    }),

    /**
     * Load editor content from local storage so that it persists on this device
     */
    load: function () {
      this.program = localStorage.getItem('program') ?? "";
    }
  },

  /**
   * 
   */
  created: function () {
    this.load();
  },

  /**
   * 
   */
  mounted: function () {
    let prismEditor = this.$refs.prism as any;    // casting to any :(
    let textarea = prismEditor.$refs.textarea as HTMLTextAreaElement;

    textarea.addEventListener('errorClick', this.moveCaretToCursor);
    textarea.addEventListener('errorDblClick', this.highlightWordAtCursor);
  },

  /**
   * 
   */
  beforeDestroy: function () {
    let prismEditor = this.$refs.prism as any;    // casting to any :(
    let textarea = prismEditor.$refs.textarea as HTMLTextAreaElement;

    textarea.removeEventListener('errorClick', this.moveCaretToCursor);
    textarea.removeEventListener('errorDblClick', this.highlightWordAtCursor);
  },

  watch: {
    /**
     * 
     */
    program: debounce(Assembler.build, 500),

    /**
     * 
     */
    memory: function (val, old) {
      if (val.size !== old.size) Assembler.build(this.program);
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.prism-container {
  text-align: left;
  height: 100%;
  max-height: 100%;
  width: 100%;
  border: 2px dashed #8b0c3c;
}

#editor {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-x: hidden;
  padding-bottom: 30%;
}

.controls {
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 0.3rem; 
  background-color: #191d21;
  padding: 0.25rem 0.33rem 0.15rem 0.4rem;
}

.output {
  /* width: 100%; */
  max-width: 600px;
  position: absolute;
  bottom: 0;
  padding: 0.25rem 0.5rem 0.5rem 0.25rem;
}

.button.red {
  color: #d9484c;
}

.button.green {
  color:#1d8f46;
}

.button.amber {
  color: #f9e1b3
}

.button.terminal {
  color: #8b0c3c;
}
</style>