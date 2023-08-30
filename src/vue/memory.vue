<template>
  <div 
    class="d-flex flex-column container text-center p-3"
    tour-item="memory"
  >
    <div class="dashed mb-3 px-2 py-1">
      <div 
        class="d-flex align-items-end position-relative w-100"
        tour-item="memory-usage"
      >
        <div 
          class="d-flex flex-column sector text"
          :style="`width: ${textWidth}%;`"
        >
          <div class="label">
            <span
              @mouseenter="tip('text')"
              @mouseleave="untip"
              @click="explore('text')"
            >
              text
            </span>
          </div>
          <div 
            class="region"
            @mouseenter="tip('text')"
            @mouseleave="untip"
            @click="explore('text')"
          ></div>
          <div class="placeholder"></div>
        </div>

        <div 
          v-if="dataWidth > 0"
          class="d-flex flex-column sector data"
          :style="`width: ${dataWidth}%`"
        >
          <div class="placeholder"></div>
          <div 
            class="region"
            @mouseenter="tip('data')"
            @mouseleave="untip"
            @click="explore('data')"
          ></div>
          <div class="label">
            <span
              @mouseenter="tip('data')"
              @mouseleave="untip"
              @click="explore('data')"
            >
              data
            </span>
          </div>
        </div>

        <div 
          v-if="heapWidth > 0"
          class="d-flex flex-column sector heap"
          :style="`width: ${heapWidth}%`"
        >
          <div class="label">
            <span
              @mouseenter="tip('heap')"
              @mouseleave="untip"
              @click="explore('heap')"
            >
              heap
            </span>
          </div>
          <div 
            class="region"
            @mouseenter="tip('heap')"
            @mouseleave="untip"
            @click="explore('heap')"
          ></div>
          <div class="placeholder"></div>
        </div>

        <div 
          class="d-flex flex-column sector uninitialised"
          :style="`width: ${uninitWidth}%`"
        >
          <div 
            class="region"
            @mouseenter="tip('uninitialised')"
            @mouseleave="untip"
            @click="explore('uninitialised')"
          ></div>
          <div class="placeholder"></div>
        </div>

        <div 
          class="d-flex flex-column sector stack"
          :style="`width: ${stackWidth}%`"
        >
          <div class="label rtl">
            <span
              @mouseenter="tip('stack')"
              @mouseleave="untip"
              @click="explore('stack')"
            >
              stack
            </span>
          </div>
          <div 
            class="region"
            @mouseenter="tip('stack')"
            @mouseleave="untip"
            @click="explore('stack')"
          ></div>
          <div class="placeholder"></div>
        </div>

        <div 
          v-if="stackPointer >= 0 && stackPointer <= 100"
          class="d-flex flex-column sector stack-pointer"
          style="pointer-events: none"
          :style="`width: ${stackPointer}%`"
        >
          <div class="placeholder"></div>
          <div 
            class="region"
            style="pointer-events: none;"
          ></div>
          <div 
            class="label rtl text-white text-left">
            <span
              @mouseenter="tip('stackPointer')"
              @mouseleave="untip"
            >
              sp
            </span> 
          </div>
        </div>

      </div>
    </div>

    <div class="flex-grow-1 dashed info px-2 py-1" style="overflow: auto;">
      <template v-if="tooltip">
        <div style="width: calc(100% - 40px);" :style="`color: ${tooltip.color};`">
          {{ tooltip.tip }}
        </div>
      </template>

      <template v-else>
        <div>
          Total: {{ memory.size }} bytes
        </div>

        <div>
          Used:  
          <span
            :class="{
              'text-warning': used === memory.size,
              'text-danger': used > memory.size
            }"
          >
            {{ used }} bytes
          </span>
        </div>
      </template>
    </div>

    <explorer ref="explorer"></explorer>
  </div>
</template>

<script lang="ts">
import { TDictionary } from "@/assets";
import { Register, StackTransfer } from '@/constants';
import { SimulatorState } from "@/simulator";
import { default as explorer } from "./explorer.vue";
import { BModal } from "bootstrap-vue";
import Vue from 'vue';

type TTip = {
  name: string;
  tip: string;
  color: string;
}

export default Vue.extend({
  name: 'memory',
  components: {
    explorer
  },
  data() {
    return {
      tooltip: undefined as TTip | undefined,

      tips: {
        text: {
          name: "text",
          tip: "The text section contains the instructions defined in the .text section of the program.",
          color: "#0077aa"
        },
        data: {
          name: "data",
          tip: "The data section contains all the static data defined in the .data section of the program.",
          color: "#ff5555"
        },
        uninitialised: {
          name: "uninitialised memory",
          tip: "This section contains uninitialised memory waiting to be used by your program.",
          color: "#dcdcdc"
        },
        stack: {
          name: "stack",
          tip: "The stack contains data temporarily saved from CPU registers to prevent overwriting.",
          color: "#5d9455"
        },
        stackPointer: {
          name: "stack pointer",
          tip: "The stack pointer is a reference to the memory location which represents the current top of the stack.",
          color: "white"
        } 
      } as TDictionary<TTip>
    }
  },
  computed: {
    memory: SimulatorState.memory,
    registers: SimulatorState.registers,

    textWidth: function (): number {
      return this.memory.textHeight / this.memory.size * 100;
    },

    dataWidth: function (): number {
      return this.memory.dataHeight / this.memory.size * 100;
    },

    heapWidth: function (): number {
      return this.memory.heapHeight / this.memory.size * 100;
    },

    uninitWidth: function (): number {
      return 100 - this.textWidth - this.dataWidth - this.heapWidth - this.stackWidth;
    },

    stackWidth: function (): number {
      return this.memory.stackHeight / this.memory.size * 100;
    },

    hoveredSection: function (): string | undefined {
      return this.tooltip?.name;
    },

    stackPointer: function (): number {
      const reversePtr = this.memory.size - this.registers[Register.SP];
      return (reversePtr / this.memory.size) * 100;
    },

    used: function (): number {
      return this.memory.textHeight + this.memory.dataHeight + this.memory.heapHeight + this.memory.stackHeight;
    }
  },
  methods: {
    tip: function (section: string) : void {
      this.tooltip = this.tips[section];
    },

    untip: function () : void {
      this.tooltip = undefined;
    },

    explore: function (section: string) {
      (this.$refs.explorer as any).show(section);
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  height: 100%;
  width: 100%;
  border: 2px dashed #8b0c3c;
}

.dashed {
  border: 1px dashed #cccdcd;
}

.region {
  height: 38px;
  cursor: help;
  pointer-events: all;
}

/* .region:hover {
  border-style: solid !important;
  background-color
} */

.placeholder {
  height: 24px;
  pointer-events: none;
}

.label {
  text-align: left;
  cursor: help;
  pointer-events: all;
}

.label.rtl {
  text-align: right;
  direction: rtl;
}

.sector {
  min-width: 1px;
  pointer-events: none;
}

.sector.text .label { color: #0077aa; }
.sector.text .region { border: 1px dashed #0077aa; }
.sector.text .region:hover { background-color: rgba(0, 119, 170, 0.1); }

.sector.data .label { color: #ff5555; }
.sector.data .region { border: 1px dashed #ff5555; }
.sector.data .region:hover { background-color: rgba(255, 85, 85, 0.1); }

.sector.heap .label { color: #f9e1b3; }
.sector.heap .region { border: 1px dashed #f9e1b3; }
.sector.heap .region:hover { background-color: rgba(249, 225, 179, 0.1); }

.sector.uninitialised .region:hover { background-color: rgba(100, 100, 100, 0.1);}

.sector.stack .label { color: #5d9455; }
.sector.stack .region { border: 1px dashed #5d9455; }
.sector.stack .region:hover { background-color: rgba(93, 148, 85, 0.1); }

.sector.stack-pointer,
.sector.stack {
  position: absolute;
  right: 0;
}

.sector.stack-pointer .region { border-left: 1px dashed white; }
.sector.stack-pointer .label {
  text-align: left;
  direction: rtl;
  margin-left: -16px;
}

.info {
  font-size: 14px;
  text-align: left;
}

</style>