<template>
  <div id="app">
    
    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- <div class="col-12 mt-3 mb-0">
          <h1>iRISC</h1>
        </div> -->
        <div id="emulator" class="col-12 h-100">
          <div class="row px-0" style="height: 24px;">
            <div class="col-5 col-md-4 col-lg-3 pr-1 text-left">
              <h5 class="mb-0">registers</h5>
            </div>
            <div class="col-7 col-md-8 col-lg-9 pl-1 text-left">
              <h5 class="mb-0">editor</h5>
            </div>
          </div>
          <div class="row px-0" style="height: calc(100% - 260px);">
            <div class="col-5 col-md-4 col-lg-3 pr-1">
              <registers></registers>
            </div>
            <div class="col-7 col-md-8 col-lg-9 pl-1">
              <editor v-on:run="run($event)"></editor>
            </div>
          </div>
          <div class="row px-0 pt-2" style="height: 208px;">
            <div class="col-7 pr-1">
              <tutorial></tutorial>
            </div>
            <div class="col-5 pl-1">
              <instruction></instruction>
            </div>
          </div>
          <div class="row px-0" style="height: 24px;">
            <div class="col-7 pr-1 text-left">
              <h5 class="mb-0">tutorial</h5>
            </div>
            <div class="col-5 pl-1 text-left">
              <h5 class="mb-0">instruction</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { editor, registers, instruction, tutorial } from "./components";
import { EmulatorState } from "@/state";
// import editor from './components/editor.vue';
// import registers from './components/registers.vue';
// import instruction from './components/instruction.vue';
// import tutorial from './components/tutorial.vue';

import { tokenize, languages, Token } from 'prismjs';
import { BiOperandNode, SyntaxNode } from './classes/syntax';

import './assets/generic.css';
import './assets/syntax.css';

export default Vue.extend({
  name: 'emulator',
  components: {
    editor,
    registers,
    instruction,
    tutorial
  },
  data: function () {
    return {
      lines: [] as Token[][]
    }
  },
  computed: {
    ...EmulatorState.getters,

    nodes: function (): SyntaxNode[] {
      return this.lines.reduce((a: SyntaxNode[], e: Token[], i: number) => {
        let node: SyntaxNode | null = this.parse(e, i);
        if (node !== null) {
          a.push(node);
        }
        return a;
      }, [] as SyntaxNode[]);
    }
  },
  methods: {
    /**
     * 
     */
    parse: function (line: Token[], lineNumber: number): SyntaxNode | null {
      if (line.length === 0) return null;

      if (line[0].type === "bi-operand") {
        return new BiOperandNode(line, lineNumber, 0);
      }

      return null;
    },

    /**
     * 
     */
    interpret: function (program: string) {
      this.lines = tokenize(program, languages.armv7).reduce((a, e) => {
        if (e instanceof Token) {
          if (e.type !== "end") a[a.length - 1].push(e);
          else a.push([]);
        }
        return a;
      }, [[]] as Token [][]);
    },

    /**
     * 
     */
    run: function (program: string) {
      this.interpret(program);

      console.log(this.nodes);
    }
  },
  created() {

    let number: number = 15;

    this.registers[0] = 4294967295;
    this.registers[1] = number;
    this.registers[2] = this.registers[0] + this.registers[1];

    console.log(this.registers[0], this.registers[1], this.registers[2]);
    console.log(this.registers[0].toString(16), this.registers[1].toString(16), this.registers[2].toString(16));
  }
})
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
