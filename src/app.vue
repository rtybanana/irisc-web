<template>
  <div id="app">
    <div v-if="systemState === SystemState.BLUESCREEN" class="container-fluid h-100 p-4 text-left" style="background-color: #0000aa;">
      <h1>A fatal error occurred.</h1>
      <div>You did something inadvisable.</div>
      <div class="mt-4">iRISC will now reboot.</div>
    </div>

    <div v-else-if="systemState === SystemState.BIOS" class="container-fluid h-100 text-left bios" style="background-color: black;">
      <div class="bios-logo">
        <pre class="pt-4 text-irisc">
          {{ iriscArt }}
      Polysoft Systems Inc. <span class="text-white">1998 ~ ∞</span>
        </pre>
        <div class="mt-4"></div>
      </div>

      <div class="bios-text flashing-caret mt-2">system booting</div>
    </div>

    <div v-else class="container-fluid h-100">
      <div class="row h-100">
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
              <registers style="height: calc(100% - 22px);"></registers>

              <div class="d-inline-block float-left mt-1">
                New here? <a class="link text-white clickable" @click="startTour">Take the tour!</a>
              </div>
            </div>
            <div class="col-7 col-md-8 col-lg-9 pl-1" style="height: calc(100% - 232px);">
              <div class="row px-0 h-100">

                <div class="col-8 pr-1 h-100">
                  <keep-alive>
                    <component 
                      :is="env" 
                      @switch="switchEnvironment"
                    ></component>
                  </keep-alive>
                </div>

                <div class="col-4 pl-1 h-100">
                  <tutorial></tutorial>
                </div>

              </div>
              

              <div class="row px-0 pt-2" style="height: 210px;">

                <div class="col-6 pr-1" style="max-height: 100%;">
                  <instruction></instruction>
                </div>

                <div class="col-6 pl-1" style="max-height: 100%;">
                  <memory></memory>

                  <div class="achievements clickable" @click="$refs.achievements.show()">
                    <i class="button far fa-star"></i>
                    <b-badge 
                      v-show="newAchievements.size > 0" 
                      class="new-achievements" 
                      variant="light"
                    >
                      {{ newAchievements.size }} <span class="sr-only">new achievements</span>
                    </b-badge>
                  </div>

                  <div class="settings clickable" @click="$refs.settings.show()">
                    <i class="button fas fa-sliders-h"></i>
                  </div>
                </div>

              </div>
              <div class="row px-0" style="height: 24px;">

                <div class="col-6 pr-1 text-left">
                  <h5 class="mb-0">assembler</h5>
                </div>

                <div class="col-6 pl-1 text-left">
                  <h5 class="mb-0 d-inline-block">memory</h5>
                  <div class="d-inline-block float-right mt-1">
                    created by <a href="https://polysoftit.co.uk/" class="text-white">polysoft it</a> // <a href="https://github.com/rtybanana/irisc-web" class="text-white">src</a>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <!-- size="lg" -->
    <settings ref="settings"></settings>
    <achievements ref="achievements"></achievements>

    <b-modal 
      ref="about" 
      centered 
      hide-header 
      hide-footer
      body-class="irisc-modal p-1"
    >

      <div class="px-5 py-1">
        <div class="mt-4">
          created by polysoft it
        </div>
      </div>
    </b-modal>

    <b-modal 
      :visible="isTooSmall"
      centered 
      hide-header 
      hide-footer
      body-class="irisc-modal p-1"
    >
      <h4>oh no!</h4>
      <div class="mt-3">
        It looks like the device you're using is too small to properly interact with iRISC. <br><br>
        I recommend retrying on a larger, desktop or laptop device for the best experience (at least 1280x720).
      </div>

      <div class="text-center mt-3 mb-2">
        <b-button @click="dismissTooSmall = true;">
          try anyway
        </b-button>
      </div>
    </b-modal>
    
    <b-modal
			ref="errors"
      id="errors-modal"
      size="600"
      hide-header 
      hide-footer
      centered
      body-class="irisc-modal p-1"
		>
      <template #default="{ hide }">
        <div class="mx-2 my-1">
          Assembly failed due to following error(s).

          <div class="mt-3 ml-3">
            <div v-for="(summary, index) in errorSummary" class="mb-3" v-html="summary" :key="index">
            </div>
          </div>

          <div class="text-center mt-4 mb-2">
            <b-button @click="hide">
              fix
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { editor, terminal, registers, memory, instruction, tutorial, settings, achievements } from "@/vue";
import { SimulatorState } from "@/simulator";
import { Interpreter, RuntimeError } from '@/interpreter';
import { Register, EnvironmentType, art } from "@/constants"
import { createTour, SettingsState } from '@/utilities';

import './assets/generic.css';
import './assets/syntax.css';
import './assets/shepherd.css';

import { TInstructionNode } from '@/syntax/types';
import Shepherd from 'shepherd.js';
import { FileSystemState } from './files';
import { AchievementState } from './achievements';
import { SystemState } from './simulator/types';

export default Vue.extend({
  name: 'emulator',
  components: {
    editor,
    terminal,
    registers,
    memory,
    instruction,
    tutorial, 
    achievements,
    settings
  },
  data() {
    return {
      env: EnvironmentType.TERMINAL,
      iriscArt: art,

      dismissTooSmall: false,
      windowSize: 0
    }
  },
  computed: {
    systemState: SimulatorState.systemState,
    currentTick: SimulatorState.currentTick,

    // registers: SimulatorState.registers,
    // breakpoints: SimulatorState.breakpoints,
    errors: SimulatorState.errors,
    errorSummary: function (): string[] {
      return this.errors.map(e => `${e.constructHelperHTML()}`)
    },
    
    running: SimulatorState.running,
    paused: SimulatorState.paused,
    // step: SimulatorState.step,

    newAchievements: AchievementState.new,

    isTooSmall: function (): boolean {
      return !this.dismissTooSmall && this.windowSize < 1250;
    },

    // hack so we can access the enum in dom
    EnvironmentType: () => EnvironmentType,
    SystemState: () => SystemState
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

    startTour: function () {
      this.env = EnvironmentType.TERMINAL;
      createTour().start();

      Shepherd.activeTour?.once(
        'complete', 
        () => { 
          localStorage.setItem('doneTour', 'true');
          SimulatorState.reset(); 
        });
    },

    windowSizeListener: function () {
      this.windowSize = window.innerWidth;
    },

    keyListener: function (e: KeyboardEvent) {
      if (this.env !== EnvironmentType.EDITOR) return;

      if (e.code === "ArrowDown" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        
        if (!this.running) {
          SimulatorState.start();
        }
        else {
          if (this.paused) SimulatorState.resume();
          else SimulatorState.pause();
        }
      }

      else if (e.code === "ArrowUp" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        SimulatorState.stop();
      }

      else if (e.code === "ArrowRight" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        SimulatorState.stepForward();
      }

      else if (e.code === "ArrowLeft" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        SimulatorState.stepBack();
      }
    }
  },

  created: function () {
    SettingsState.init();
    SimulatorState.init();
    FileSystemState.init();
    SimulatorState.setVueInstance(this)

    window.addEventListener("resize", this.windowSizeListener);
    this.windowSizeListener();
  },

  mounted: function () {
    document.addEventListener('keydown', this.keyListener.bind(this));

    
    AchievementState.achieve("Welcome to iRISC");

    const doneTour = localStorage.getItem('doneTour') ?? false;
    if (!doneTour) this.startTour();
    else {
      this.env = (localStorage.getItem('environment') as EnvironmentType) ?? EnvironmentType.TERMINAL;

      // hack to prompt editor to load any code from localStorage on refresh
      this.switchEnvironment();
      this.$nextTick(() => this.switchEnvironment());
    }
  },

  beforeDestroy: function () {
    window.removeEventListener("resize", this.windowSizeListener);
    document.removeEventListener('keydown', this.keyListener);
  },

  watch: {
    crtEffect: function (on: boolean) {
      const element: Element = document.getElementsByTagName('html')[0];
      if (on) element.classList.add("crt");
      else element.classList.remove("crt");
    }
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

.achievements {
  position: absolute;
  bottom: 31px;
  right: 77px;
  border-radius: 0.3rem;
  background-color: #191d21;
  padding: 0.25rem 0.33rem 0.15rem 0.4rem;
}

.achievements .new-achievements {
  position: absolute;
  right: -3px;
  top: -3px;
  padding: 1px 3px;
}

.settings {
  position: absolute;
  bottom: 31px;
  right: 42px;
  border-radius: 0.3rem;
  background-color: #191d21;
  padding: 0.25rem 0.33rem 0.15rem 0.4rem;
}

.irisc-modal {
  font-family: 'Ubuntu Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #0d1117;
  border: 1px dashed #b19898;
  color: #DCDCDC;
  text-align: left;
}

.flashing-caret {
  display: flex;
  align-items: center;
  gap: 8px;
}


.flashing-caret::after {
  content: "";
  margin-top: 10px;
  width: 8px;
  height: 3px;
  background: white;
  display: inline-block;
  animation: cursor-blink 0.3s steps(2) infinite;
} 

@keyframes cursor-blink {
  0% {
    opacity: 0;
  }
}

.bios-logo {
  visibility: hidden;
  animation: popInOut 3s;
  animation-delay: 1s;
  animation-fill-mode: forwards;
}

.bios-text {
  visibility: hidden;
  animation: popInOut 2.5s;
  animation-delay: 1.5s;
  animation-fill-mode: forwards;
}

@keyframes popInOut {
  0% {
    visibility: hidden;
  }
  1% {
    visibility: visible;
  }
  99% {
    visibility: visible;
  }
  100% {
    visibility: hidden;
  }
}

.bios {
  background-color: black;
  animation: fadeBoot 1s ease 5.5s forwards;
}

@keyframes fadeBoot {
  0% {
    background-color: black;
  }
  100% {
    background-color: #0d1117;
  }
}

</style>
