<template>
  <div 
    class="prism-container pl-1 pr-0 py-1 position-relative" 
    @mouseover="hover"
  >
    <prism-editor 
      id="editor" 
      v-model="program"
      :highlight="highlighter" 
      :tab-size="1" 
      :insert-spaces="false" 
      line-numbers
    ></prism-editor>

    <div class="controls">
      <div>
        <i class="button red fas fa-stop mr-1 clickable" @click="stop"></i>
        <i class="button green fas fa-play mx-1 clickable" @click="$emit('run', program)"></i>
        <i class="button step fas fa-step-forward mx-1 clickable"></i>
        <i 
          class="button terminal fas fa-terminal ml-1 clickable" 
          @click="$emit('switch')"
        ></i>
      </div>
    </div>

    <div class="errors">
      <div class="p-1" style="border-radius: 0.3rem; background-color: #191d21;">
        <template v-if="tooltip.title !== ''">
          <div style="color: crimson">{{ tooltip.title }}</div>
          <div>{{ tooltip.message }}</div>
        </template>

        <div v-else-if="errors.length > 0">
          {{ errors.length }} errors
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { EmulatorState } from "@/state";
import { parse, compile, load } from "@/classes/assembler";
import { debounce } from "@/assets/functions";

import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css';


import { highlight, languages } from 'prismjs';
// import '../assets/prism-armv7';
import 'prismjs/themes/prism.css'; // import syntax highlighting styles
import { IriscError } from '@/classes/error';
import { TInstructionNode } from '@/classes/syntax/types';
import { Register } from '@/constants';

export default Vue.extend({
  name: 'editor',
  components: {
    PrismEditor
  },
  data() {
    return {
      program: '' as string,
      tooltip: {
        // index: null as number | null,
        title: '' as string,
        message: '' as string
      },
    }
  },
  computed: {
    errors: EmulatorState.errors,
    running: EmulatorState.running,
    currentInstruction: EmulatorState.currentInstruction
  },
  methods: {
    stop: function () {
      EmulatorState.stop();
    },

    /**
     * 
     */
    hover: function (e: any) {
      if (e.target.parentNode.className === "token error") {
        let errorIndex = e.target.parentNode.dataset["errorIdx"] as number;
        let error = this.errors[errorIndex];

        this.tooltip = {
          title: error.type,
          message: error.message
        }
      }
      else {
        this.tooltip = {
          message: '',
          title: ''
        };
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
      this.highlightErrors(tokens);

      // reconstruct highlit tokens to lines
      lines = tokens.map(e => (e as string[]).join(""));
      this.highlightExecuting(lines);
      
      // reconstruct highlit lines to program
      return lines.join(`<span class="token end">\n</span>`);
    },

    /**
     * 
     */
    highlightErrors: function (elements: RegExpMatchArray[]) {
      this.errors.forEach((error, index) => {
        let line = elements[error.lineNumber];

        let filteredIndex: number = -1;
        let tokenIndex = line?.findIndex((e, i) => {
          if (!e.includes("whitespace")) filteredIndex++;
          if (filteredIndex === error.tokenIndex) return true;
        })
        let tokenString = line?.[tokenIndex];

        if (tokenString !== undefined) {
          line[tokenIndex] = `<span class="token error" data-error-idx="${index}">${tokenString}</span>`;
        }
      });
    },

    /**
     * 
     */
    highlightExecuting: function (lines: string[]) {
    
      if (this.running) {
        let executing = lines[this.currentInstruction?.lineNumber];

        if (executing !== undefined) {
          lines[this.currentInstruction.lineNumber] = `<span class="line executing">${executing}</span>`;
        }
      }
    }
  },
  watch: {
    program: debounce(function(program: string) {
      EmulatorState.initMemory();

      let lines = parse(program);
      let nodes = compile(lines);

      load(nodes);
    }, 500)
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
}

.errors {
  /* width: 100%; */
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

.button.terminal {
  color: #8b0c3c;
}
</style>