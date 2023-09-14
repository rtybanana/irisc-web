<template>
  <div 
    class="prism-container pl-1 pr-0 py-1 position-relative" 
    :class="{ crt: settings.crtEffect }"
    tour-item="editor"
    @mouseover="hover"
    @click="click"
    @dblclick="dblclick"
    @keydown.ctrl.191.capture.prevent.stop="lineComment"
    @keydown.esc="!tourActive && $emit('switch')"
    @keydown.ctrl.83.capture.prevent.stop="save"
  >
    <prism-editor 
      ref="prism"
      id="editor" 
      v-model="program"
      :highlight="highlighter" 
      :tab-size="1" 
      :insert-spaces="false" 
      :readonly="tourActive"
      line-numbers
      @input="autoSave"
    ></prism-editor>

    <div class="controls">
      <debug :tooltip.sync="controlTooltip"></debug>

      <i 
        class="button terminal fas fa-terminal ml-1 clickable" 
        @click="!tourActive && $emit('switch')"
        @mouseenter="controlTooltip = 'terminal'"
        @mouseleave="controlTooltip = undefined"
      ></i>

      <div v-show="controlTooltip" class="control-tooltip">{{ controlTooltip }}</div>
    </div>

    <div class="popup-output">
      <div class="p-1" style="border-radius: 0.3rem; background-color: #191d21;">
        <div v-if="hasOutput">
          <!-- <div style="color: #f9e1b3;">output</div> -->
          <div v-for="(line, index) in output" :key="index" style="overflow-wrap: break-word;">
            {{ line }}
          </div>
        </div>

        <div v-if="computedTooltip.title !== ''" :class="hasOutput ? 'mt-2' : ''">
          <div :style="`color: ${computedTooltip.color}`">{{ computedTooltip.title }}</div>
          <div>{{ computedTooltip.message }}</div>
        </div>

        <div v-else-if="errors.length > 0" class="clickable hoverable rounded px-1" @click="run">
          {{ errors.length }} errors
        </div>
      </div>
    </div>

    <div v-show="!tourActive" class="files">
      <files></files>
    </div>

    <b-modal 
      ref="save"
      centered 
      hide-header 
      hide-footer
      body-class="irisc-modal p-1"
    >
      <template #default="{ hide }">
        <div class="mx-2 my-1">
          <h4>save as</h4>

          <files 
            class="file-explorer mt-3" 
            force-show
            prevent-default-file
            :selected-file="selectedFile"
            @open:file="filename = $event.name"
          ></files>
          <div v-show="!currentDirectory.writeable"><small class="token operation">folder is write protected.</small></div>

          <div class="mt-3">filename</div>
          <b-form-input v-model="filename" @keydown="saveAllowChar"></b-form-input>

          <template v-if="selectedFile">
            <div v-if="!selectedFile.writeable"><small class="token operation">file is write protected.</small></div>
            <div v-else><small class="token label">overwriting an existing file.</small></div>
          </template>
          <div v-else><small class="token line-comment">creating a new file.</small></div>
          
          

          <div class="text-center mt-4 mb-2">
            <b-button class="mr-2" @click="hide">
              cancel
            </b-button>

            <b-button @click="saveAs">
              save
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { debounce } from "@/assets/functions";
import { Assembler, IriscError, RuntimeError } from "@/interpreter";
import { SimulatorState } from "@/simulator";
import { highlight, languages } from 'prismjs';
import { SettingsState, TTooltip } from '@/utilities';
import { PrismEditor } from 'vue-prism-editor';
import { BModal } from 'bootstrap-vue';
import scrollIntoView from 'scroll-into-view-if-needed';
import getCaretCoordinates from "textarea-caret";
import debug from './debug.vue';
import files from './files.vue';
import Shepherd from 'shepherd.js';
import Vue from 'vue';

import 'prismjs/themes/prism.css'; // import syntax highlighting styles
import 'vue-prism-editor/dist/prismeditor.min.css';
import { TFile } from "@/files";
import { FileSystemState, helloWorldSample } from "@/files";


type TPoint = {
  x: number;
  y: number;
}

export default Vue.extend({
  name: 'editor',
  components: {
    PrismEditor,
    debug,
    files
  },
  data() {
    return {
      program: '' as string,
      tooltip: { title: '', color: '', message: '' } as TTooltip,
      
      // showFiles: false,
      // directory: '/',
      // sampleFiles: [
      //   "helloworld.s",
      //   "typewriter.s",
      //   "strlen.s",
      //   "recursion.s",
      //   "stackoverflow!.s",
      //   "bubblesort.s",
      //   "buggymess.s"
      // ],

      filename: "",

      tourActive: false,
      controlTooltip: undefined as string | undefined
    }
  },
  computed: {
    settings: SettingsState.settings,
    memory: SimulatorState.memory,
    running: SimulatorState.running,
    paused: SimulatorState.paused,
    delay: SimulatorState.delay,
    currentInstruction: SimulatorState.currentInstruction,
    currentTick: SimulatorState.currentTick,
    interrupted: SimulatorState.interrupted,
    currentFile: FileSystemState.currentFile,
    currentDirectory: FileSystemState.currentDirectory,

    fileNames: function () : string[] {
      return this.currentDirectory.files.map(e => e.name);
    },
    selectedFile: function () : TFile | undefined {
      return this.currentDirectory.files.find(e => e.name === this.filename);
    },

    activeTour: () => !!Shepherd.activeTour,

    output: SimulatorState.output,
    hasOutput: function () : boolean {
      if (this.output.length === 1 && !this.output[0]) {
        return false;
      }

      return true;
    },

    errors: SimulatorState.errors,
    breakpoints: SimulatorState.breakpoints,
    exitStatus: SimulatorState.exitStatus,

    computedTooltip: function () : TTooltip {
      if (this.interrupted) return {
        title: 'Interrupted',
        color: '#7dad7d',
        message: 'Switch to the terminal to provide input.'
      }

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
    run: SimulatorState.start,
    stop: SimulatorState.stop,
    pause: SimulatorState.pause,
    resume: SimulatorState.resume,
    stepBack: SimulatorState.stepBack,
    stepForward: SimulatorState.stepForward,
    reset: SimulatorState.reset,

    setDelay: function (delay: number) {
      SimulatorState.setDelay(1000 / delay)
    },

    /**
     * 
     */
    hover: function (e: any) {
      if (e.target.parentNode?.className.includes("error")) {
        if (!e.target.parentNode.dataset["errorIdx"]) return;
        
        let errorIndex = parseInt(e.target.parentNode.dataset["errorIdx"]) as number;
        if (errorIndex === -1) return;

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
      if (e.target.parentNode?.className.includes("error")) {
        e.preventDefault();
        e.stopPropagation();

        let prismEditor = this.$refs.prism as any;    // casting to any :(
        let newTarget = prismEditor.$refs.textarea as HTMLInputElement;

        let errorIndex = parseInt(e.target.parentNode.dataset["errorIdx"]) as number;
        
        let error: IriscError;
        if (errorIndex === -1) error = this.exitStatus as RuntimeError;
        else error = this.errors[errorIndex];

        newTarget.dispatchEvent(
          new CustomEvent('errorClick', {
            detail: {
              coords: { x: e.layerX, y: e.layerY } as TPoint,
              lineNumber: error.lineNumber
            }
          }
        ));
      }
      else if (e.target.className.includes("line-number")){
        SimulatorState.toggleBreakpoint(e.target.innerText - 1);
      }
    },

    /**
     * 
     */
    dblclick: function (e: any) {
      if (e.target.parentNode?.className.includes("error")) {
        e.preventDefault();
        e.stopPropagation();

        let prismEditor = this.$refs.prism as any;    // casting to any :(
        let newTarget = prismEditor.$refs.textarea as HTMLInputElement;

        let errorIndex = parseInt(e.target.parentNode.dataset["errorIdx"]) as number;
        
        let error: IriscError;
        if (errorIndex === -1) error = this.exitStatus as RuntimeError;
        else error = this.errors[errorIndex];

        newTarget.dispatchEvent(
          new CustomEvent('errorDblClick', {
            detail: {
              coords: { x: e.layerX, y: e.layerY } as TPoint,
              lineNumber: error.lineNumber
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
      let tokens = lines.map(e => e.match(/<span.*?<\/span>\s*/gim) ?? []) as RegExpMatchArray[];

      // squiggly underline token errors
      this.highlightTokenErrors(tokens);

      // reconstruct highlit tokens to lines
      lines = tokens.map(e => (e as string[]).join(""));
      this.highlightLineErrors(lines);
      this.highlightBreakpoints(lines);
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
            lines[error.lineNumber] = `<span class="line error" style="text-decoration-color: ${error.color}" data-error-idx="${index}">${line}</span>`;
          }
        });

      // exit status runtime error
      if (this.exitStatus instanceof RuntimeError) {
        let line = lines[this.exitStatus.lineNumber];
        if (line !== undefined) {
          lines[this.exitStatus.lineNumber] = `<span class="line error" style="text-decoration-color: ${this.exitStatus.color}" data-error-idx="${-1}">${line}</span>`;
        }
      }
    },

    /**
     * 
     */
    highlightBreakpoints: function (lines: string[]) {
      // user breakpoints
      this.breakpoints
        .forEach((instruction) => {
          let line = lines[instruction.lineNumber];
          if (line !== undefined) {
            lines[instruction.lineNumber] = `<span class="line breakpoint">${line}</span>`;
          }
        });
    },

    /**
     * 
     */
    highlightExecuting: function (lines: string[]) {
      if (this.running && this.currentInstruction) {
        let executing = lines[this.currentInstruction!.lineNumber];

        if (executing !== undefined) {
          lines[this.currentInstruction!.lineNumber] = `<span class="line executing">${executing}</span>`;
        }
        
        this.$nextTick(() => {
          const node = document.querySelector('.line.executing');

          if (node) {
            scrollIntoView(node, {
              scrollMode: 'if-needed',
              block: 'nearest',
              inline: 'nearest',
            });
          }
        })
      }
    },

    /**
     * 
     */
    moveCaretToCursor: function (e: any) {
      let mouseCoords: TPoint = e.detail.coords;
      let textarea = e.target as HTMLTextAreaElement;
      let caretPosition = this.getCaretPositionAtCursor(textarea, mouseCoords, e.detail.lineNumber);

      textarea.setSelectionRange(caretPosition, caretPosition);
      textarea.focus();
    },

    /**
     * 
     */
    highlightWordAtCursor: function (e: any) {
      let mouseCoords: TPoint = e.detail.coords;
      let textarea = e.target as HTMLTextAreaElement;
      let caretPosition = this.getCaretPositionAtCursor(textarea, mouseCoords, e.detail.lineNumber);
      let [wordStart, wordEnd] = [caretPosition, caretPosition];

      while (/\w/.test(textarea.value[wordStart - 1]) && wordStart > 0) wordStart--;
      while (/\w/.test(textarea.value[wordEnd]) && wordEnd < textarea.value.length) wordEnd++;

      textarea.setSelectionRange(wordStart, wordEnd);
      textarea.focus();
    },

    /**
     * 
     */
    getCaretPositionAtCursor: function (element: HTMLTextAreaElement, mouseCoords: TPoint, lineNumber: number) : number {
      // skip to start of offending line
      const lines = element.value.split("\n");
      let startIndex = 0;
      for (let i = 0; i < lineNumber; i++) {
        startIndex += lines[i].length + 1   // +1 here because of newline character which was removed during the split
      }

      let endIndex = startIndex + lines[lineNumber].length;
      let smallestDistance = Number.MAX_VALUE;
      let caretPosition = 0;
      for (let i = startIndex; i < endIndex; i++) {
        let textPos = getCaretCoordinates(element, i);
        let charCoords: TPoint = { 
          x: textPos.left, 
          y: textPos.top + (textPos.height / 2)
        };

        let distance = getRoughDistance(mouseCoords, charCoords);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          caretPosition = i;
        }
      }

      return caretPosition;

      function getRoughDistance(p1: TPoint, p2: TPoint) : number {
        let y = p2.x - p1.x;
        let x = p2.y - p1.y;
        
        return x * x + y * y;
      }
    },

    focus: function () {
      const prismEditor = this.$refs.prism as any;    // casting to any :(
      const textarea = prismEditor.$refs.textarea as HTMLTextAreaElement;

      textarea.focus();
    },

    // quicksave: function () {
    //   if (this.currentFile?.writeable) {
    //     FileSystemState.save(this.currentFile)
    //   }
    // },

    save: function () {
      if (Shepherd.activeTour) return;

      this.filename = this.currentFile?.name ?? "";
      (this.$refs.save as BModal).show();

      // // save to filesystem
      // if (this.currentFile?.writeable) {
      //   FileSystemState.save(this.currentFile, this.program);
      // }
      // else {
        
      // }
    },

    saveAllowChar: function (e: KeyboardEvent) {
      if (/^[^\d\w._]$/.test(e.key)) {
        e.preventDefault();
      }
    },

    saveAs: function () {
      if (!this.currentDirectory.writeable || (this.selectedFile && !this.selectedFile.writeable)) {
        return;
      }

      let file = this.selectedFile;
      if (!file) {
        file = FileSystemState.newFile(this.filename, "");
        FileSystemState.addFile(file, this.currentDirectory);
        
      }

      FileSystemState.save(file, this.program);
      FileSystemState.openFile(file);

      (this.$refs.save as BModal).hide();
    },

    /**
     * Save editor content to local storage so that it persists on this device
     */
    autoSave: debounce(function (program: string) {
      if (Shepherd.activeTour) return;

      console.log("autosaving");

      // // save to filesystem
      // const currentFile = FileSystemState.currentFile();
      // if (currentFile?.writeable) {
      //   FileSystemState.save(currentFile, program);
      // }

      // save to program cache
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

  updated: function () {
    if (Shepherd.activeTour && !this.tourActive) {
      this.tourActive = true;
      FileSystemState.openFile(helloWorldSample);

      Shepherd.activeTour.once(
        'inactive', 
        () => {
          this.tourActive = false;
          this.load();
        }
      );
    }
  },

  activated: function () {
    this.focus();
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
    },

    currentFile: function (file) {
      this.program = file.content ?? "";
      this.reset();
    },

    filename: function (name: string) {
      this.filename = name.replace(/[^\d\w._]/g, "");
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
}

.controls {
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 0.3rem; 
  background-color: #191d21;
  padding: 0.25rem 0.33rem 0.15rem 0.4rem;
  opacity: 0.2;
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

.prism-container:hover .controls {
  opacity: 1;
}

.popup-output {
  /* width: 100%; */
  max-width: 600px;
  position: absolute;
  bottom: 0;
  padding: 0.25rem 0.5rem 0.5rem 0.25rem;
}

.files {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.25rem 0.5rem 0.5rem 0.25rem;
}

.button.red {
  color: #d9484c;
}

.button.green {
  color: #1d8f46;
}

.button.amber {
  color: #f9e1b3
}

.button.terminal {
  color: #8b0c3c;
}
</style>