<template>
  <div class="d-flex flex-column container text-left py-3">
    <!-- registers -->
    <div 
      v-for="(value, index) in registers" 
      class="register text-truncate"
      @mouseover="registerTip(index)"
      @mouseleave="untip"
      :key="index"
    >
      <span class="register-name">{{ regName[index] }}</span> {{ regstr(value)  }}
    </div>

    <!-- cpsr -->
    <div class="register d-flex cpsr my-3 pr-0">
      <div 
        class="flex-grow-1"
        @mouseover="tip(cpsrTitle, cpsrExplain)"
        @mouseleave="untip"
      >
        cpsr
      </div>
      <div
        v-for="(flag, index) in flagNames"
        class="flag"
        @mouseover="tip(flagTitle[index], flagExplain[index])"
        @mouseleave="untip"
        :key="index"
      >
        <span class="flag-name">{{ flagNames[index] }}</span>
        {{ flagstr(cpsr[0]) }}
      </div>
    </div>
    
    <!-- tooltip -->
    <div class="register flex-grow-1">
      <div>
        {{ computedTitle }}
      </div>

      <div class="description">
        {{ computedDescription }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { EmulatorState } from "@/state";
import { Register, regName, regTitle, regExplain } from "@/constants"

export default Vue.extend({
  name: 'registers',
  props: {
    msg: String
  },
  data() {
    return {
      regName,
      regTitle,
      regExplain,

      cpsrTitle: "CPSR Flags", 
      cpsrExplain: "Four bits in the Current Program Status Register which are used to decide whether a conditional instruction should execute.",

      flagNames: ["N", "Z", "C", "V"],
      flagTitle: ["Negative Flag (N)", "Zero Flag (Z)", "Carry Flag (C)", "Overflow Flag (V)"],
      flagExplain: [
        "This bit is set when the signed result of the operation is negative.", 
        "This bit is set when the result of the operation is equal to zero.", 
        "This bit is set when the operation results in an unsigned overflow.", 
        "This bit is set when the operation results in a signed overflow."
      ],

      title: null as string | null,
      description: null as string | null
    };
  },
  computed: {
    registers: EmulatorState.getters.registers,
    cpsr: EmulatorState.getters.cpsr,

    computedTitle() : string {
      return this.title ?? "Registers";
    },

    computedDescription() : string {
      return this.description ?? "A simplified view of the data currently stored in the CPU. Hover over the different sections to learn what they are.";
    }
  },
  methods: {
    regstr(value: number) : string {
      return `0x${value.toString(16).padStart(8, '0')} (${value})`;
    },

    hexstr(value: number) : string {
      return `0x${value.toString(16)}`
    },

    flagstr(value: boolean) : string {
      return value ? '1' : '0';
    },

    registerTip(reg: Register) {
      let value = this.registers[reg];
      let hexValue = this.hexstr(value);

      this.tip(
        this.regTitle[reg],
        `${this.regExplain[reg]}\n\nDec: ${value}\nHex: ${hexValue}`
      )
    },

    tip(title: string, description: string) {
      this.title = title;
      this.description = description
    },

    untip() {
      this.title = null;
      this.description = null;
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

.register {
  border: 1px dashed #cccdcd;
  margin-bottom: -1px;
  padding: 0.1rem 0.6rem;
}

.register-name {
  display: inline-block; 
  width: 28px;
}

.flag {
  position: relative;
  width: 32px;
  text-align: center;
  border-left: 1px dashed #cccdcd;
}

.flag-name {
  position: absolute;
  height: 10px;
  width: 10px;
  font-size: 10px;
  line-height: 10px;
  top: -2px;
  left: 0px;
}

.description {
  font-size: 14px;
  white-space: pre-line;
}
</style>
