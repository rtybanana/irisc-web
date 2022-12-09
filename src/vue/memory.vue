<template>
  <div class="d-flex flex-column container text-center p-3">
    <div class="dashed mb-3 px-2 py-1">
      <div class="d-flex align-items-end position-relative w-100">
        <div 
          class="d-flex flex-column sector text"
          :style="`width: ${textWidth}%;`"
        >
          <div class="label">
            <span
              @mouseenter="tip('text')"
              @mouseleave="untip"
            >
              text
            </span>
          </div>
          <div 
            class="region"
            @mouseenter="tip('text')"
            @mouseleave="untip"
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
          ></div>
          <div class="label">
            <span
              @mouseenter="tip('data')"
              @mouseleave="untip"
            >
              data
            </span>
          </div>
        </div>

        <div class="flex-grow-1">
          
        </div>

        <div 
          class="d-flex flex-column sector stack"
          :style="`width: ${stackWidth}%`"
        >
          <div class="label rtl">
            <span
              @mouseenter="tip('stack')"
              @mouseleave="untip"
            >
              stack
            </span>
          </div>
          <div 
            class="region"
            @mouseenter="tip('stack')"
            @mouseleave="untip"
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
          <div class="region"></div>
          <div 
            class="label rtl text-white text-left">
            <span>sp</span> 
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
  </div>
</template>

<script lang="ts">
import { Register } from '@/constants';
import { SimulatorState } from "@/state";
import Vue from 'vue';

type TTip = {
  name: string;
  tip: string;
  color: string;
}

export default Vue.extend({
  name: 'memory',
  data() {
    return {
      tooltip: undefined as TTip | undefined
    }
  },
  computed: {
    memory: SimulatorState.memory,
    registers: SimulatorState.registers,

    textWidth: function () : number {
      return this.memory.textHeight / this.memory.size * 100;
    },

    dataWidth: function () : number {
      return this.memory.heapHeight / this.memory.size * 100;
    },

    stackWidth: function () : number {
      return this.memory.stackHeight / this.memory.size * 100;
    },

    hoveredSection: function () : string | undefined {
      return this.tooltip?.name;
    },

    stackPointer: function () : number {
      let reversePtr = this.memory.size - this.registers[Register.SP];
      return (reversePtr / this.memory.size) * 100;
    },

    used: function () : number {
      return this.memory.textHeight + this.memory.heapHeight + this.memory.stackHeight;
    }
  },
  methods: {
    tip: function (section: string) : void {
      if (section === "text") {
        this.tooltip = {
          name: "text",
          tip: "The text section contains the instructions defined in the .text section of the program.",
          color: "#0077aa"
        }
      }
      else if (section === "data") {
        this.tooltip = {
          name: "data",
          tip: "The data section contains all the static data defined in the .data section of the program.",
          color: "#ff5555"
        }
      }
      else if (section === "stack") {
        this.tooltip = {
          name: "stack",
          tip: "The stack contains data temporarily saved from CPU registers to prevent overwriting.",
          color: "#5d9455"
        }
      }
    },

    untip: function () : void {
      this.tooltip = undefined;
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
}

/* .region:hover {
  border-style: solid !important;
  background-color
} */

.placeholder {
  height: 24px;
}

.label {
  text-align: left;
  cursor: help;
}

.label.rtl {
  text-align: right;
  direction: rtl;
}

.sector {
  min-width: 1px;
}

.sector.text .label { color: #0077aa; }
.sector.text .region { border: 1px dashed #0077aa; }
.sector.text .region:hover { background-color: rgba(0, 119, 170, 0.1); }

.sector.data .label { color: #ff5555; }
.sector.data .region { border: 1px dashed #ff5555; }
.sector.data .region:hover { background-color: rgba(255, 85, 85, 0.1); }

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