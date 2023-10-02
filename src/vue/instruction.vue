<template>
  <div 
    tour-item="assembler"
    class="d-flex flex-column container text-left p-3"
  >
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

      <div 
        tour-item="history" 
        class="history clickable" 
        @click="showHistory"
      >
        <i class="button fas fa-history"></i>
      </div>
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

    <b-modal
      ref="history"
      id="state-history"
      hide-header 
      hide-footer
      body-class="irisc-modal p-1"
    >
      <div class="px-4 py-1" tour-item="state-history">
        <h4>state history</h4>
        
        <div class="position-relative mt-3">
          <div 
            v-for="snapshot in snapshots" 
            :ref="`tick_${snapshot.tick}`"
            :tour-item="`state-history-tick-${snapshot.tick}`"
            class="snapshot fenced clickable mb-4" 
            :class="currentTick === snapshot.tick ? 'current' : 'not-current'"
            @click="reinstate(snapshot.tick)"
            :key="snapshot.key"
          >
            <!-- tick number -->
            <span class="d-inline-block tick rounded py-1">{{ snapshot.tick }}</span>

            <!-- instruction text -->
            <div style="color: #DCDCDC;">
              <span 
                v-html="snapshot.instruction"
                class="p-1"
              ></span>
              <span class="reinstate px-1 float-right">
                <i class="fas fa-share fa-rotate-180 fa-xs"></i>
              </span>
            </div>
            
            <!-- register change summary -->
            <div class="ml-3">
              <div v-for="[register, oldValue] in snapshot.difference.registersHit" :key="register">
                {{ regName[register] }}: {{ oldValue }} >> {{ snapshot.difference.registers[register] }}
              </div>
            </div>
            
            <!-- memory write summary -->
            <div v-if="snapshot.difference.memWrite" class="ml-3">
              <span v-if="snapshot.difference.memWrite.base === snapshot.difference.memWrite.limit">
                byte <u>written</u> at address: {{ snapshot.difference.memWrite.base }}
              </span>

              <span v-else>
                bytes <u>written</u> in address range: {{ snapshot.difference.memWrite.base }} - {{ snapshot.difference.memWrite.limit }}
              </span>
            </div>

            <!-- memory read summary -->
            <div v-if="snapshot.difference.memRead" class="ml-3">
              <span v-if="snapshot.difference.memRead.base === snapshot.difference.memRead.limit">
                byte <u>read</u> at address: {{ snapshot.difference.memRead.base }}
              </span>

              <span v-else>
                bytes <u>read</u> in address range: {{ snapshot.difference.memRead.base }} - {{ snapshot.difference.memRead.limit }}
              </span>
            </div>

            <div v-if="!snapshot.wasExecuted && !(snapshot.tick === 0)" class="ml-3">
              <span class="not-executed">Not Executed</span>
            </div>
          </div>

          <div class="position-absolute" style="top: 0;">
            <transition name="slide-fade-left">
							<div v-if="historyShown && currentSnapshot" class="position-fixed tooltip-container">
                <div class="position-relative tooltip-box fenced mb-2">
                  <div v-html="currentSnapshot.instruction"></div>
                  <!-- <div 
                    class="position-absolute clickable px-1" 
                    style="top: 5px; right: 5px" 
                    tabindex="0"
                    @click="showSnapshotDescription = !showSnapshotDescription;"
                    @keypress.enter="showSnapshotDescription = !showSnapshotDescription;"
                  >
                    <i v-show="!showSnapshotDescription" class="far fa-question-circle"></i>
                    <i v-show="showSnapshotDescription" class="far fa-eye-slash"></i>
                  </div> -->

                  <template v-if="explanation">
                    <div class="pt-1" style="font-size: 14px;">
                      <!-- default explanation -->
                      <div v-html="explanation.default"></div>

                      <!-- supplementary information -->
                      <div 
                        v-show="explanation.supplement" 
                        class="mt-2" 
                        v-html="explanation.supplement"
                      ></div>
                    </div>
                  </template>
                </div>
                
                <div v-if="explanation" style="font-size: 14px;">
                  <div v-if="explanation.conditional" class="tooltip-box fenced mb-2">
                    <div v-html="explanation.conditional"></div>
                  </div>

                  <template v-if="currentSnapshot.wasExecuted">
                    <div v-if="explanation.expression" class="tooltip-box fenced mb-2">
                      <div v-show="explanation.expression.flex" v-html="explanation.expression.flex" class="mb-2"></div>
                      <div v-html="explanation.expression.result"></div>
                    </div>
                  </template>
                </div>
							</div>
						</transition>

            <transition name="slide-fade-right">
              <div 
                v-if="historyShown" 
                tour-item="state-history-debug"
                class="position-fixed fenced control-box px-1 pb-1 pt-0"
              >
                <div class="pb-1">debugger</div>

                <debug 
                  class="debugger" 
                  :tooltip.sync="debuggerTooltip"
                ></debug>

                <div v-show="debuggerTooltip" class="control-tooltip fenced px-1">
                  {{ debuggerTooltip }}
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { SimulatorState, TSimulatorSnapshot } from '@/simulator';
import { zip } from '@/assets/functions';
import { TransferNode } from '@/syntax';
import { IExplanation, TAssembled } from '@/syntax/types';
import { flagDescribe, flagName, flagTitle, regDescribe, Register, regName, regTitle, Flag } from "@/constants";
import { explain, TSnapshotDescription, TSnapshotExplanation } from "@/explainer";
import { highlight, languages } from 'prismjs';
import Vue from 'vue';
import { BModal } from 'bootstrap-vue';
import debug from "./debug.vue";

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
  components: {
    debug
  },
  data() {
    return {
      regName,
      regTitle,
      regDescribe,

      flagName, 
      flagTitle,
      flagDescribe,

      default: {
        bitcode: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        explanation: [{
          title: "No Instruction",
          subtitle: "",
          detail: "Execute an instruction to examine its machine code.",
          range: 32,
        }]
      } as TAssembled,

      tooltip: undefined as TTip | undefined,

      historyShown: false,
      debuggerTooltip: undefined as string | undefined
      // showSnapshotDescription: false
    }
  },
  computed: {
    paused: SimulatorState.paused,
    delay: SimulatorState.delay,
    currentInstruction: SimulatorState.currentInstruction,
    wasExecuted: SimulatorState.wasExecuted,
    currentTick: SimulatorState.currentTick,
    memSize: () => SimulatorState.memory().size,

    // hack so we can access the enum in dom
    TipType: () => TipType,

    sections: function (): ISection[] {
      const assembled = this.currentInstruction?.assemble() ?? this.default;

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
    },

    snapshots: function (): TSnapshotDescription[] {
      return SimulatorState.snapshots()
        .data()
        .slice()
        .reduce((a, snapshot, index, snapshots) => {
          const prevSnapshot: TSimulatorSnapshot | undefined = snapshots[index - 1];

          a.push(explain(snapshot, prevSnapshot));
          return a;
        }, [] as TSnapshotDescription[])
        .reverse()
    },
    
    currentSnapshot: function (): TSnapshotDescription | undefined {
      return this.snapshots.find(e => e.tick === this.currentTick);
    },

    explanation: function (): TSnapshotExplanation | undefined {
      return this.currentSnapshot?.explanation;
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
    },

    showHistory: function () {
      this.historyShown = false;
			(this.$refs.history as BModal).show();
      
			const v = this;
			setTimeout(() => {
				v.historyShown = true;
        this.scrollToTick(this.currentTick);
			}, 350);
    },

    scrollToTick(tick: number, behavior: string = "smooth") {
      this.$nextTick(() => {
        const snapshot = (this.$refs[`tick_${tick}`] as any[])?.[0];
        if (snapshot) {
          snapshot.scrollIntoView({ behavior, block: "start", inline: "nearest" });
        }
      });
    },

    reinstate: function (tick: number) {
      SimulatorState.reinstateSnapshot(tick);
    }
  },

  watch: {
    currentTick: {
      handler: function (tick: number) {
        this.$nextTick(() => {
          const scrollBehaviour = this.paused || this.delay > 100 ? "smooth" : "instant";
          this.scrollToTick(tick, scrollBehaviour);
        });
      }
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
  border: 1px dashed #cccdcd;
  padding: 0.25rem 0.5rem;
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

.tooltip-container >>> .executed,
.executed {
  background-color: #5d9455;
  color: #101821;
  padding: 0 0.25rem;
  border-radius: 0.15rem;
}

.tooltip-container >>> .not-executed,
.not-executed {
  background-color: #ff5555;
  color: #101821;
  padding: 0 0.25rem;
  border-radius: 0.15rem;
}

.history {
  position: absolute;
  top: 18px;
  right: 22px;
  border-radius: 0.3rem;
  background-color: #191d21;
  padding: 0.20rem 0.35rem 0.08rem 0.35rem;
}

.reinstate {
  display: none;
}

.snapshot {
  position: relative;
  scroll-margin: 83px;
}

.snapshot:hover .reinstate {
  display: inline;
}

.snapshot.fenced {
  padding: 0.35rem 0.35rem;
  border-color: #cccdcd;
}

.snapshot.current {
  border-color: #8b0c3c;
}

.snapshot.not-current {
  background-color: #1f2024;
}

.tick {
  position: absolute;
  top: 0;
  left: -23px;
  text-align: right;
  direction: rtl;
  font-size: 13px;
  writing-mode: sideways-lr;
  text-orientation: mixed;
  padding: 0.15rem 0;
}

.snapshot.current .tick {
  background-color: #8b0c3c;
  color: white;
}

.tooltip-container {
  right: calc(50vw + (498px / 2) + 15px);
	width: 320px;
}

.tooltip-box {
	background-color: #0d1117;
	white-space: pre-line;
}

.control-box {
	background-color: #0d1117;
	left: calc(50vw + (498px / 2) + 15px);
}

.control-tooltip {
	position: absolute;
	left: -1px;
	bottom: -27px;
	background-color: #0d1117;
  padding: 0 0.25rem;
  font-size: 14px;
}

.debugger {
	padding: 0 0.25rem;
}
</style>

<style>
.history-modal {
  border-color: #cccdcd;
  background-color: #0d1117;
  color: #DCDCDC;
}
</style>