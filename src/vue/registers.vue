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
    <div class="d-flex register cpsr my-3 pr-0">
      <div 
        class="flex-grow-1"
        @mouseover="tip(cpsrTitle, cpsrExplain)"
        @mouseleave="untip"
      >
        cpsr
      </div>
      <div
        v-for="(flag, index) in cpsr"
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
import { zip } from '@/assets/functions';
import { flagExplain, flagName, flagTitle, regExplain, Register, regName, regTitle } from "@/constants";
import { SimulatorState } from "@/state";
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
  },
  watch: {
    registers: function (newVal, oldVal) {
      let changeSet = new Set<Register>();
      zip(newVal, oldVal).forEach(([newReg, oldReg], index) => {
        if (newReg !== oldReg) changeSet.add(index);
      });

      this.changeSet = changeSet;
    },

    cpsr: function (newVal, oldVal) {
      console.log(newVal, oldVal);

      let changeSet = new Set<number>();
      zip(newVal, oldVal).forEach(([newFlag, oldFlag], index) => {
        if (newFlag !== oldFlag) changeSet.add(index);
      });

      this.$set(this, 'flagChangeSet', changeSet);
      // this.flagChangeSet = changeSet;
      // console.log(this.flagChangeSet);
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

.changed {
  border-radius: 0.15rem;
  background-color: rgba(255, 255, 255, 0.2);
  /* color: #e02f72; */
}
</style>
