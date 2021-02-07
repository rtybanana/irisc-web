<template>
  <div class="container px-2">
    <prism-editor id="editor" v-model="program" :highlight="highlighter" :tab-size="4" line-numbers></prism-editor>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css';

export default {
  name: 'repl',
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
      console.log(program);
      return program
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
<style>
.prism-editor-wrapper .prism-editor__container {
  min-height: 496px;
  line-height: 1.2em;
}

.prism-editor-wrapper .prism-editor__editor {
  min-height: 496px;
  color: white;
  line-height: 1.2em;
}
</style>
