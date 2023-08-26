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
      <span class="register-name">{{ regName[index] }}</span>  
      <span class="ml-1 px-1" :class="{ 'changed': changeSet.has(index) }">{{ regstr(value) }}</span>
    </div>

    <!-- cpsr -->
    <div class="d-flex my-3 pr-0">
      <div 
        class="flex-grow-1 cpsr"
        @mouseover="tip(cpsrTitle, cpsrExplain)"
        @mouseleave="untip"
      >
        cpsr
      </div>
      <div
        v-for="(_, index) in cpsr"
        class="flag"
        @mouseover="tip(flagTitle[index], flagExplain[index])"
        @mouseleave="untip"
        :key="index"
      > 
        <span class="flag-name">{{ flagName[index] }}</span>
        <span :class="{ 'changed': flagChangeSet.has(index) }">{{ flagstr(cpsr[index]) }}</span>
      </div>
    </div>
    
    <!-- tooltip -->
    <div class="dashed flex-grow-1">
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
import { zip } from '@/assets/functions';
import { flagExplain, flagName, flagTitle, regExplain, Register, regName, regTitle } from "@/constants";
import { SimulatorState } from "@/simulator";
import Vue from 'vue';

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

      flagName, 
      flagTitle,
      flagExplain,

      cpsrTitle: "CPSR Flags", 
      cpsrExplain: "Four bits in the Current Program Status Register which are used to decide whether a conditional instruction should execute.",

      title: null as string | null,
      description: null as string | null,

      changeSet: new Set<Register>(),
      flagChangeSet: new Set<number>()
    };
  },
  computed: {
    registers: SimulatorState.registers,
    cpsr: SimulatorState.cpsr,

    computedTitle() : string {
      return this.title ?? "Registers";
    },

    computedDescription() : string {
      return this.description ?? "A simplified view of the data currently stored in the CPU. Hover over the different sections to learn more.";
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
      const value = this.registers[reg];
      const hexValue = this.hexstr(value);

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
  },
  watch: {
    registers: function (newVal, oldVal) {
      const changeSet = new Set<Register>();
      zip(newVal, oldVal).forEach(([newReg, oldReg], index) => {
        if (newReg !== oldReg) changeSet.add(index);
      });

      this.changeSet = changeSet;
    },

    cpsr: function (newVal, oldVal) {
      const changeSet = new Set<number>();
      zip(newVal, oldVal).forEach(([newFlag, oldFlag], index) => {
        if (newFlag !== oldFlag) changeSet.add(index);
      });

      this.$set(this, 'flagChangeSet', changeSet);
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
  padding: 0.1rem 0.6rem;
}

.register {
  border: 1px dashed #cccdcd;
  margin-bottom: -1px;
  padding: 0.1rem 0.6rem;
}

.register:hover {
  border-color: #8b0c3c;
  z-index: 10;
  position: relative;
  cursor: help;
  color: #e02f72;
}

.register-name {
  display: inline-block; 
  width: 28px;
}

.cpsr {
  border: 1px dashed #cccdcd;
  margin-bottom: -1px;
  padding: 0.1rem 0.6rem;
}

.flag {
  position: relative;
  width: 32px;
  text-align: center;
  border: 1px dashed #cccdcd;
  margin: 0 0 -1px -1px;
}

.flag:hover {
  border-color: #8b0c3c;
  z-index: 100;
  position: relative;
  cursor: help;
  color: #e02f72;
}


.flag-name {
  position: absolute;
  height: 10px;
  width: 10px;
  font-size: 10px;
  line-height: 10px;
  top: -1px;
  left: 0px;
}

.description {
  font-size: 14px;
  white-space: pre-line;
}

.changed {
  border-radius: 0.15rem;
  background-color: rgba(255, 255, 255, 0.2);
  /* color: #e02f72; */
}
</style>
