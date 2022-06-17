<template>
  <div class="d-flex flex-column container text-left p-3">
    <div class="mb-3">
      <span 
        v-for="(section, index) in sections" 
        class="section" 
        @mouseenter="tip(section)"
        @mouseleave="untip"
        :key="index"
      >
        <span 
          v-for="(bit, index) in section.bits" 
          class="bit" 
          :key="index"
        >
          {{ bit }}
        </span>
      </span>
    </div>

    <div class="fenced flex-grow-1" style="overflow: auto;">
      <template v-if="computedTooltip.type === TipType.INSTRUCTION">
        <div v-html="computedTooltip.title"></div>
        <div style="font-size: 14px;">
          <div v-show="computedTooltip.subtitle.length > 0" >
            <span :class="computedTooltip.subtitle === 'Executed' ? 'executed' : 'not-executed'">
              {{ computedTooltip.subtitle }}
            </span>
          </div>

          <div>{{ computedTooltip.detail }}</div>
        </div>
      </template>

      <template v-else>
        <div>{{ computedTooltip.title }}</div>
        <div style="font-size: 14px;">
          <div v-show="computedTooltip.subtitle.length > 0">{{ computedTooltip.subtitle }}</div>
          <div>{{ computedTooltip.detail }}</div>
        </div>
      </template>
     
    </div>
  </div>
</template>

<script lang="ts">
import { InstructionNode } from '@/classes/syntax';
import { TAssembled, IExplanation } from '@/classes/syntax/types';
import { EmulatorState } from '@/state';
import Vue from 'vue';
import { highlight, languages } from 'prismjs';

/**
 * Extends IExplanation interface to include a portion of the instruction bitcode,
 * making it into an "ISection".
 */
interface ISection extends IExplanation {
  bits: number[];
}

enum TipType {
  INSTRUCTION = "instruction",
  SECTION = "section",
  DEFAULT = "default"
}

type TTip = {
  title: string;
  subtitle: string;
  detail: string;
  type: TipType;
}

export default Vue.extend({
  name: 'instruction',
  data() {
    return {
      default: {
        bitcode: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        explanation: [{
          title: "No Instruction",
          subtitle: "",
          detail: "Execute an instruction to examine its machine code.",
          range: 32,
        }]
      } as TAssembled,

      tooltip: undefined as TTip | undefined
    }
  },
  computed: {
    currentInstruction: EmulatorState.currentInstruction,
    wasExecuted: EmulatorState.wasExecuted,
    TipType: () => TipType,

    sections: function (): ISection[] {
      const assembled = this.currentInstruction?.assemble() ?? this.default;
      console.log(assembled);

      let startIdx = 0;
      return assembled.explanation.map(explanation => {
        let section = {
          ...explanation,
          bits: assembled.bitcode.slice(startIdx, startIdx + explanation.range)
        };
        
        startIdx += explanation.range;
        return section;
      });
    },

    computedTooltip: function (): TTip {
      if (this.tooltip) return this.tooltip;
      if (!this.currentInstruction) return {
        ...this.default.explanation[0],
        type: TipType.DEFAULT
      }

      return {
        title: highlight(this.currentInstruction.text, languages.armv7, 'ARMv7'),
        subtitle: this.wasExecuted ? "Executed" : "Not Executed",
        detail: "This is the assembled machine code for the last instruction. Hover over the different sections to see what they mean.",
        type: TipType.INSTRUCTION
      }
      
    }
  },
  methods: {
    tip: function (section: ISection) {
      this.tooltip = {
        ...section,
        type: TipType.SECTION
      };
    },

    untip: function () {
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

.fenced {
  padding: 0.25rem 0.5rem;
  border: 1px dashed #cccdcd;
}

.section {
  font-size: 0;
  border: 1px dashed #cccdcd;
  display: inline-block;
  margin-left: -1px;
}

.section:hover {
  border-color: #8b0c3c;
  z-index: 10;
  position: relative;
  cursor: help;
  color: #e02f72;
}

.bit {
  font-size: 16px;
  padding: 0 2px;
  display: inline-block;
}

.executed {
  background-color: #5d9455;
  color: #101821;
  padding: 0 0.25rem;
  border-radius: 0.15rem;
}

.not-executed {
  background-color: #ff5555;
  color: #101821;
  padding: 0 0.25rem;
  border-radius: 0.15rem;
}

</style>