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
              <div class="row px-0">
                <div class="col-8 pr-1">
                  <h5 class="mb-0">editor</h5>
                </div>
                <div class="col-4 pl-1">
                  <h5 class="mb-0">tutorial</h5>
                </div>
              </div>
            </div>
          </div>
          <div class="row px-0" style="height: calc(100% - 36px);">
            <div class="col-5 col-md-4 col-lg-3 pr-1">
              <registers></registers>
            </div>
            <div class="col-7 col-md-8 col-lg-9 pl-1" style="height: calc(100% - 232px);">
              <div class="row px-0 h-100">
                <div class="col-8 pr-1">
                  <editor v-on:run="start($event)"></editor>
                </div>
                <div class="col-4 pl-1">
                  <!-- <h5 class="mb-0">memory</h5> -->
                  <tutorial></tutorial>
                </div>
              </div>
              

              <div class="row px-0 pt-2" style="height: 210px;">
                <div class="col-6 pr-1">
                  <instruction></instruction>
                </div>
                <div class="col-6 pl-1">
                  <memory></memory>
                </div>
              </div>
              <div class="row px-0" style="height: 24px;">
                <div class="col-6 pr-1 text-left">
                  <h5 class="mb-0">assembler</h5>
                </div>
                <div class="col-6 pl-1 text-left">
                  <h5 class="mb-0">memory</h5>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { editor, registers, memory, instruction, tutorial } from "./components";
import { parse, compile, load } from "@/classes/compiler";
import { EmulatorState } from "@/state";
import { RuntimeError } from '@/classes/error';
import { Register } from "@/constants"

import './assets/generic.css';
import './assets/syntax.css';
import { TInstructionNode } from './classes/syntax/types';

export default Vue.extend({
  name: 'emulator',
  components: {
    editor,
    registers,
    memory,
    instruction,
    tutorial
  },
  computed: {
    ...EmulatorState.getters,
  },
  methods: {
    /**
     * 
     */
    start: function () {
      if (this.running) return;
      
      // reset emulator state
      EmulatorState.reset();

      // report errors (alert is temporary)
      if (this.errors.length > 0) {
        alert(`This code has errors!\n\n\t${this.errors.map(e => `${e.constructHelper()}`).join("\n\t")}`);
        return;
      } 
      
      // run the program
      this.run();
    },

    /**
     * 
     */
    run: async function () {
      EmulatorState.start();

      try {
        while(this.running) {
          let node: TInstructionNode = EmulatorState.instruction(this.registers[Register.PC]);

          // if runtime instruction runoff
          if (node === undefined) {
            let last: TInstructionNode = this.memory.text[this.memory.textSize - 1];

            throw new RuntimeError("Segmentation fault (core dumped)", last.statement, last.lineNumber, -1);
          }

          EmulatorState.cpu.setRegister(Register.PC, this.registers[Register.PC] + 32);           // increment to the next instruction
          EmulatorState.execute(node);
          
          // int sleepfor = 50;
          let sleptfor: number = 0;
          while ((sleptfor < this.delay || this.paused) && this.running && !this.step) {          // check every 50ms to see if speed value has changed
            await new Promise(r => setTimeout(r, 50));
            sleptfor += 50;
          }
        }
      }
      catch (e) {
        if (e instanceof RuntimeError) {
          alert(e.message); 
          EmulatorState.stop();
        }
      }
    },

    
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
