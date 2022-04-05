<template>
  <div class="prism-container pl-1 pr-0 py-1 position-relative">
    <prism-editor id="editor" 
                  v-model="program" 
                  :highlight="highlighter" 
                  :tab-size="1" 
                  :insert-spaces="false" 
                  line-numbers>
    </prism-editor>
    <div id="buttons">
      <i class="stop fas fa-stop mx-1 clickable" ></i>
      <i class="play fas fa-play mx-1 clickable" @click="$emit('run', program)"></i>
      <i class="step fas fa-step-forward clickable"></i>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css';

import { highlight, languages } from 'prismjs';
// import '../assets/prism-armv7';
import 'prismjs/themes/prism.css'; // import syntax highlighting styles

export default Vue.extend({
  name: 'editor',
  components: {
    PrismEditor
  },
  data() {
    return {
      program: '' as string
    }
  },
  methods: {
    highlighter(program: string) {
      return highlight(program, languages.armv7, 'ARMv7')
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

#buttons {
  /* pointer-events: all; */
  position: absolute;
  top: 5px;
  right: 20px;
  opacity: 0.1;
  height: 25px;
  width: 100px;
  text-align: right;
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