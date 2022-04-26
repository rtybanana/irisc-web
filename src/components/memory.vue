<template>
  <div class="d-flex flex-column container text-center p-3">
    <div class="dashed mb-3 px-2 py-1">
      <div class="d-flex align-items-end position-relative">
        <div 
          class="d-flex flex-column sector text"
          :style="`width: ${textWidth}%;`"
        >
          <div class="label">text</div>
          <div class="region"></div>
          <div class="placeholder"></div>
        </div>

        <div 
          v-if="dataWidth > 0"
          class="d-flex flex-column sector data"
          :style="`width: ${dataWidth}%`"
        >
          <div class="placeholder"></div>
          <div class="region"></div>
          <div class="label">data</div>
        </div>

        <div class="flex-grow-1">
          
        </div>

        <div 
          class="d-flex flex-column sector stack"
          :style="`width: ${stackWidth}%`"
        >
          <div class="label rtl">stack</div>
          <div class="region"></div>
          <div class="placeholder"></div>
        </div>

        <div 
          v-if="stackPointer >= 0 && stackPointer <= 100"
          class="d-flex flex-column sector stack-pointer"
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

    <div class="flex-grow-1 dashed info px-2 py-1">
      <div>
        Total: {{ memory.size }} bytes
      </div>

      <div>
        Used:  {{ used }} bytes
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { EmulatorState } from "@/state";
import { Register } from '@/constants';

export default Vue.extend({
  name: 'memory',
  computed: {
    memory: EmulatorState.memory,
    registers: EmulatorState.registers,

    textWidth: function () : number {
      return this.memory.textHeight / this.memory.size * 100;
    },

    dataWidth: function () {
      return this.memory.heapHeight / this.memory.size * 100;
    },

    stackWidth: function () {
      return this.memory.stackHeight / this.memory.size * 100;
    },

    stackPointer: function () : number {
      console.log(this.memory.size, this.registers[Register.SP]);
      let reversePtr = this.memory.size - this.registers[Register.SP];

      console.log(reversePtr / this.memory.size);

      return (reversePtr / this.memory.size) * 100;
    },

    used: function () : number {
      return this.memory.textHeight + this.memory.heapHeight + this.memory.stackHeight;
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
}

.placeholder {
  height: 24px;
}

.label {
  text-align: left;
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

.sector.data .label { color: #ff5555; }
.sector.data .region { border: 1px dashed #ff5555; }

.sector.stack .label { color: #5d9455; }
.sector.stack .region { border: 1px dashed #5d9455; }

.sector.stack-pointer {
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