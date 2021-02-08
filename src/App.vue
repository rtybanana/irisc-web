<template>
  <div id="app">
    
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-12 my-3">
          <h1>iRISC</h1>
        </div>
        <div id="emulator" class="col-12 my-auto">
          <div class="row px-0 my-auto">
            <div class="col-5 col-md-4 col-lg-3 pr-1 text-left">
              <h5 class="mb-0">registers</h5>
            </div>
            <div class="col-7 col-md-8 col-lg-9 pl-1 text-left">
              <h5 class="mb-0">editor</h5>
            </div>
          </div>
          <div class="row px-0 my-auto" style="max-height: 500px; height: 500px;">
            <div class="col-5 col-md-4 col-lg-3 pr-1">
              <registers></registers>
            </div>
            <div class="col-7 col-md-8 col-lg-9 pl-1">
              <editor></editor>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="col-6">

          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import registers from './components/registers.vue'
import editor from './components/editor.vue'

import './assets/syntax.css'

export default {
  name: 'app',
  components: {
    registers,
    editor
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap');

html, body {
  width: 100vw;
  height: 100vh;
}

#app {
  font-family: 'Ubuntu Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #DCDCDC;
  /* margin-top: 60px; */
  height: 100%;
  width: 100%;
  background-color: #0d1117;
}

#emulator {
  height: calc(100% - 88px);
}
</style>
