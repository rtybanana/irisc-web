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
                  <h5 class="mb-0">{{ env }}</h5>
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
                <div class="col-8 pr-1 h-100">
                  <!-- <editor @run="start($event)"></editor> -->
                  <!-- @step="doStep" -->
                  <keep-alive>
                    <component 
                      :is="env" 
                      @switch="switchEnvironment"
                      @run="start"
                      @step="doStep"
                    ></component>
                  </keep-alive>
                </div>
                <div class="col-4 pl-1 h-100">
                  <!-- <h5 class="mb-0">memory</h5> -->
                  <tutorial></tutorial>
                </div>
              </div>
              

              <div class="row px-0 pt-2" style="height: 210px;">
                <div class="col-6 pr-1" style="max-height: 100%;">
                  <instruction></instruction>
                </div>
                <div class="col-6 pl-1" style="max-height: 100%;">
                  <memory></memory>

                  <div class="settings">
                    <i class="button fas fa-sliders-h clickable" @click="$refs.settings.show()"></i>
                  </div>
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

    <!-- size="lg" -->
    <b-modal 
      ref="settings" 
      centered hide-header 
      hide-footer hide-backdrop
      body-class="settings-modal p-1"
    >

      <div class="px-5 py-1">
        <h4>configuration</h4>
        <div class="mt-3">
          <!-- simulation speed -->
          <div>
            cpu tickrate
            <span class="float-right">{{ (1000 / delay).toFixed(2) }} tps</span>
          </div>
          <b-form-input 
            :value="1000 / delay"
            @change="emulator.setDelay(1000 / $event)"
            type="range"
            min="0.5"
            max="50"
            step="0.1"
          ></b-form-input>

          <!-- memory size -->
          <div>
            ram size 
            <span class="float-right">{{ memory.size }} bytes</span>
          </div>
          <b-form-input 
            :value="memory.sizes.findIndex(e => e === memory.size)"
            @change="emulator.init(memory.sizes[+$event])"
            type="range"
            min="0"
            :max="memory.sizes.length - 1"
          ></b-form-input>
        </div>
      </div>
    </b-modal>

    <b-modal 
      centered hide-header 
      hide-footer
      :visible="isTooSmall"
      body-class="settings-modal p-1"
    >
      <h4>oh no!</h4>
      <div class="mt-3">
        It looks like the device you're using is too small to properly interact with iRISC. <br><br>
        I recommend retrying on a larger, desktop or laptop device for the best experience.
      </div>
    </b-modal>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { editor, terminal, registers, memory, instruction, tutorial } from "@/vue";
import { SimulatorState } from "@/state";
import { Interpreter, RuntimeError } from '@/interpreter';
import { Register, EnvironmentType } from "@/constants"

import './assets/generic.css';
import './assets/syntax.css';
import { TInstructionNode } from '@/syntax/types';

export default Vue.extend({
  name: 'emulator',
  components: {
    editor,
    terminal,
    registers,
    memory,
    instruction,
    tutorial
  },
  data() {
    return {
      env: EnvironmentType.TERMINAL,
      emulator: SimulatorState,

      windowSize: 0
    }
  },
  computed: {
    registers: SimulatorState.registers,
    memory: SimulatorState.memory,
    errors: SimulatorState.errors,
    
    running: SimulatorState.running,
    paused: SimulatorState.paused,
    delay: SimulatorState.delay,
    step: SimulatorState.step,

    isTooSmall: function (): boolean {
      return this.windowSize < 1000;
    }
  },
  methods: {
    /**
     * 
     */
    switchEnvironment: function () {
      if (this.env === EnvironmentType.TERMINAL) this.env = EnvironmentType.EDITOR;
      else this.env = EnvironmentType.TERMINAL;

      localStorage.setItem('environment', this.env);
    },

    /**
     * 
     */
    start: function () {
      if (this.running) {
        if (!this.step) SimulatorState.resume();
        return;
      }
      
      // reset emulator state
      SimulatorState.reset();

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
      SimulatorState.setEntryPoint();
      SimulatorState.setStackHeight(0);
      SimulatorState.start();

      // await this.sleep();
      try {
        while(this.running) {
          SimulatorState.setStep(false);
          let node: TInstructionNode = SimulatorState.instruction(this.registers[Register.PC]);

          // if runtime instruction runoff
          if (node === undefined) {
            let last: TInstructionNode = SimulatorState.currentInstruction()!;
            throw new RuntimeError("SIGSEG: Segmentation fault.", last.statement, last.lineNumber);
          }

          Interpreter.execute(node);
          await this.sleep();

          // check for bx lr to static exit point
          if (this.registers[Register.PC] === this.memory.exitPoint) {
            SimulatorState.setExitStatus(0);
          }
        }
      }
      catch (e) {
        if (e instanceof RuntimeError) {
          SimulatorState.setExitStatus(e);
        }
      }
    },

    /**
     * Checks every 50ms to see if tick speed (delay) value has changed. If the delay has elapsed
     * then move return so that the simulator may continue to the next instruction.
     */
    sleep: async function () {
      let sleptfor: number = 0;
      while ((sleptfor < this.delay || this.paused) && this.running && !this.step) {
        await new Promise(r => setTimeout(r, 10));
        sleptfor += 10;
      }

      return;
    },

    /**
     * 
     */
    doStep: function () {
      if (this.running && this.paused) {
        SimulatorState.setStep(true);
        return
      }
      
      SimulatorState.pause();
      if (!this.running) {
        SimulatorState.reset();
        this.run();
      }
    },

    windowSizeListener: function () {
      this.windowSize = window.innerWidth;
    }
  },

  created: function () {
    this.env = (localStorage.getItem('environment') as EnvironmentType) ?? EnvironmentType.TERMINAL;

    window.addEventListener("resize", this.windowSizeListener);
    this.windowSizeListener();
  },

  destroyed: function () {
    window.removeEventListener("resize", this.windowSizeListener);
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

.settings {
  position: absolute;
  bottom: 31px;
  right: 42px;
  border-radius: 0.3rem;
  background-color: #191d21;
  padding: 0.25rem 0.33rem 0.15rem 0.4rem;
}

.settings-modal {
  font-family: 'Ubuntu Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f7f7f7;
  border: 1px dashed #0d1117;
  color: #171c24;
}
</style>
