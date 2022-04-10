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

    <div id="buttons">
      <i class="stop fas fa-stop mx-1 clickable" @click="stop"></i>
      <i class="play fas fa-play mx-1 clickable" @click="$emit('run', program)"></i>
      <i class="step fas fa-step-forward clickable"></i>
    </div>

    <div id="error">
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
import { parse, compile, load } from "@/classes/compiler";
import { debounce } from "@/assets/functions";

import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css';


import { highlight, languages } from 'prismjs';
// import '../assets/prism-armv7';
import 'prismjs/themes/prism.css'; // import syntax highlighting styles
import { IriscError } from '@/classes/error';

export default Vue.extend({
  name: 'editor',
  components: {
    PrismEditor
  },
  data() {
    return {
      program: '' as string,
      tooltip: {
        title: '' as string,
        message: '' as string
      }
    }
  },
  computed: {
    errors: EmulatorState.getters.errors
  },
  methods: {
    stop: function () {
      EmulatorState.stop();
    },

    hover: function (e: any) {
      if (e.target.parentNode.className === "token error") {
        let errorIndex = e.target.parentNode.dataset["errorIdx"] as number;
        let error = this.errors[errorIndex];

        // console.log(this.errors[errorIndex].message);
        this.tooltip = {
          title: error.constructor.name,
          message: error.message
        }
      }
      else this.tooltip = {
        message: '',
        title: ''
      };
    },

    // unhover: function () {
    //   this.error = '';
    // },

    highlighter(program: string) {
      let highlit: string = highlight(program, languages.armv7, 'ARMv7');
      if (highlit.length === 0) return "";
      // console.log(highlit);

      let lines = highlit.split(`<span class="token end">\n</span>`);
      let elements = lines.map(e => e.match(/<span.*?<\/span>\s*/gim) ?? []);

      // TODO: add custom class spans around errors
      this.errors.forEach((error, index) => {
        // console.log(error.message);
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

        console.log(tokenString, error.message);
      })

      console.log(elements);

      // if (elements.length =

      return elements
        .map(e => (e as string[]).join(""))
        .join(`<span class="token end">\n</span>`);
    }
  },
  watch: {
    program: debounce(function(program: string) {
      EmulatorState.memory.clear();

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

#buttons {
  /* pointer-events: all; */
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0.1;
  height: 25px;
  width: 100px;
  text-align: right;
}

#error {
  /* width: 100%; */
  position: absolute;
  bottom: 0;
  padding: 0.25rem 0.5rem 0.5rem 0.25rem;
}

.prism-container:hover > #buttons {
  opacity: 1;
}

.stop {
  color: #d9484c;
  font-size: 17px; 
}
.play {
  color:#1d8f46;
  font-size: 16px; 
  /* margin-bottom: 3px; */
}
.step {
  font-size: 17px; 
}

</style>