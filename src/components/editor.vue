<template>
  <div class="container pl-1 pr-0 py-1">
    <prism-editor id="editor" v-model="program" :highlight="highlighter" :tab-size="1" :insert-spaces="false" line-numbers></prism-editor>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-armv7';
import 'prismjs/themes/prism.css'; // import syntax highlighting styles

// import 'prismjs/plugins/line-highlight/prism-line-highlight.js'
// import 'prismjs/plugins/line-highlight/prism-line-highlight.css'


export default {
  name: 'editor',
  components: {
    PrismEditor
  },
  data() {
    return {
      program: ''
    }
  },
  methods: {
    highlighter(program) {
      // console.log(program);
      return highlight(program, languages.armv7)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  text-align: left;
  height: 500px;
  max-height: 500px;
  overflow-x: hidden;
  width: 100%;
  /* border-style: dashed; */
  border: 2px dashed #8b0c3c;
}
</style>

<!-- css styles which are not limited to this component only -->
<!-- <style>

</style> -->