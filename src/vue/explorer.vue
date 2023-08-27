<template>
	<b-modal ref="modal" centered hide-header hide-footer body-class="irisc-modal p-1">
		<div class="px-4 py-1">
			<h4>memory explorer</h4>

			<div v-if="memIsInitialised" class="my-3">
				<div class="row">
					<div class="col-1 pl-0 pr-3">
						<div v-for="(_, index) in memSize / 4" class="word-index" :key="index">{{ index * 4 }}</div>
					</div>

					<div class="col pl-0">
						<div class="position-relative ">
							<!-- actual data printout -->
							<div>
								<div v-for="(word, wordIndex) in wordView" class="row word no-gutters" :key="wordIndex">
									<template v-if="size === 'byte'">
										<div v-for="(_, byteIndex) in 4" class="col text-center" :key="`${wordIndex}_${byteIndex}`">
											{{ printByte(byteValue(wordIndex, byteIndex)) }}
										</div>
									</template>

									<template v-else>
										<div class="col text-center">
											{{ printWord(word) }}
										</div>
									</template>
								</div>
							</div>

							<!-- fenced regions and colouring -->
							<div class="regions">
								<div 
									class="region text fenced tippable" 
									@mouseenter="tip('text')" 
									@mouseleave="untip"
								>
									<div 
										v-for="(n, index) in textWordHeight" 
										class="word" 
										@mouseenter="instructionIndex = index;" 
										@mouseleave="instructionIndex = undefined;"
										:key="n"
									></div>
								</div>

								<div
									v-if="dataWordHeight > 0" 
									class="region data fenced tippable" 
									:style="`top: ${textWordHeight * 22}px`"
									@mouseenter="tip('data')" 
									@mouseleave="untip"
								>
									<div v-for="n in dataWordHeight" class="word" :key="n"></div>
								</div>

								<div
									class="region tippable" 
									:style="`top: ${(textWordHeight + dataWordHeight) * 22}px`"
									@mouseenter="tip('uninitialised')" 
									@mouseleave="untip"
								>
									<div v-for="n in uninitWordHeight" class="word" :key="n"></div>
								</div>


								<div 
									class="region stack fenced tippable" 
									@mouseenter="tip('stack')" 
									@mouseleave="untip"
								>
									<div v-for="n in stackWordHeight" class="word" :key="n"></div>
								</div>
							</div>
						</div>
					</div>

					<div class="col-3 px-0">
						<div class="position-fixed fenced px-2" style="width: 117px;">
							<h5 class="mb-2">options</h5>

							<b-form-group label="chunk size" v-slot="{ ariaDescribedby }">
								<b-form-radio-group v-model="size" :aria-describedby="ariaDescribedby" class="radio" buttons stacked>
									<b-form-radio v-for="dsize in sizes" :value="dsize.value" :key="dsize.value">
										{{ dsize.text }}
									</b-form-radio>
								</b-form-radio-group>
							</b-form-group>

							<b-form-group label="datatype" v-slot="{ ariaDescribedby }">
								<b-form-radio-group v-model="datatype" :aria-describedby="ariaDescribedby" class="radio" buttons stacked>
									<b-form-radio v-for="dtype in datatypes" :value="dtype.value" :key="dtype.value">
										{{ dtype.text }}
									</b-form-radio>

									<b-form-radio v-if="size !== 'word'" value="ascii">
										ascii
									</b-form-radio>
								</b-form-radio-group>
							</b-form-group>

							<div v-if="size === 'byte'" class="tippable" @mouseenter="tip('endianness')" @mouseleave="untip">
								<b-form-group label="endianness" v-slot="{ ariaDescribedby }">
									<b-form-radio-group v-model="endianness" :aria-describedby="ariaDescribedby" class="radio" buttons
										stacked>
										<b-form-radio v-for="endian in endiannesses" :value="endian.value" :key="endian.value">
											{{ endian.text }}
										</b-form-radio>
									</b-form-radio-group>
								</b-form-group>
							</div>
						</div>

						<transition name="slide-fade-left">
							<div v-if="shown" class="position-fixed fenced tooltip-box px-1 pb-1">
								<template>
									<div v-html="tooltip.title" class="pb-1"></div>
									<div style="font-size: 14px;">
										<div v-html="tooltip.detail"></div>

										<div v-if="instructionIndex !== undefined && instruction" class="ml-3 mt-3 mb-3">
											<div>address: {{ instructionIndex * 4 }}</div>
											<div v-html="highlight(instruction)"></div>
											<div>0x{{ hexstr(wordView[instructionIndex], 8) }}</div>
											<div>0b{{ binstr(wordView[instructionIndex], 32) }}</div>
										</div>
									</div>
								</template>
							</div>
						</transition>

						<transition name="slide-fade-right">
							<div v-if="shown" class="position-fixed fenced control-box px-1 pb-1">
								<div class="pb-1">debugger</div>
								<debug class="debugger" :tooltip.sync="controlTooltip"></debug>

								<div v-show="controlTooltip" class="control-tooltip fenced px-1">
									{{ controlTooltip }}
								</div>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</div>
	</b-modal>
</template>
  
<script lang="ts">
import { BModal } from 'bootstrap-vue';
import { SimulatorState } from '@/simulator';
import { TDictionary, asciiTable } from "@/assets";
import Vue from 'vue';
import { highlight, languages } from 'prismjs';
import { TInstructionNode } from '@/syntax/types';
import debug from './debug.vue';

type TTip = {
	title: string;
	detail: string;
}

export default Vue.extend({
	name: 'explorer',
	components: {
		debug
	},
	data() {
		return {
			section: undefined as string | undefined,

			size: 'byte',
			sizes: [
				{ text: 'byte', value: 'byte' },
				{ text: 'word', value: 'word' }
			],

			datatype: 'hex',
			datatypes: [
				{ text: 'hex', value: 'hex' },
				{ text: 'dec', value: 'dec' },
				{ text: 'bin', value: 'bin' }
			],

			endianness: 'little',
			endiannesses: [
				{ text: 'little', value: 'little' },
				{ text: 'big', value: 'big' }
			],

			instructionIndex: undefined as number | undefined,

			tooltip: {} as TTip,
			tips: {
				default: {
					title: "memory explorer",
					detail: // html
						`\
						This explorer displays the current contents of the simulated memory arranged vertically into words and horizontally\
						into the 4 bytes which make up each word.

						Initialised regions are divided into <span class="label-text">text</span>, <span class="label-data">data</span> and\
						<span class="label-stack">stack</span>. The unfenced region between the <span class="label-data">data</span> and\
						<span class="label-stack">stack</span> is unintialised memory.
					`
				},
				text: {
					title: `<span class="label-text">text</span>`,
					detail: // html
						`\
						This region, situated in the lowest addresses of the program's virtual address space, contains the machine code\
						for each instruction in the program.
						
						In an ARMv7 CPU, every instruction fits into one word, so each row of the explorer within the text section is\
						a single instruction from the loaded program, in the order that they were assembled.
					`
				},
				data: {
					title: `<span class="label-data">data</span>`,
					detail: // html
						`\
						This region, which immediately follows the <span class="label-text">text</span> region, contains all static data\
						defined in the .data region of the loaded program. It is used for storing information which cannot be represented\
						in assembly language immediate values - such as strings and arrays. 

						If you have defined an <span class="token directive">.asciz</span> string in the <span class="token directive">.data</span>\
						region of your program, you can switch to the ascii datatype and read the string as it appears: byte by byte in memory.

						This area of the virtual address space may be freely modified by the associated program; however, it cannot be extended\
						i.e. the data can be changed, but not added to.
					`
				},
				uninitialised: {
					title: "uninitialised memory",
					detail: // html
						`\
						This region contains uninitialised memory, separating the heap (an area of dynamic memory allocation which immediately\
						follows the data section) from the stack in the virtual address space allocated to the loaded program.

						The bytes in this section cannot be assumed to be clean, they may contain junk data from whatever process owned this\
						physical address space before it was allocated to your program. Be aware of this when allocating dynamic data to\
						the heap.
					`
				},
				stack: {
					title: `<span class="label-stack">stack</span>`,
					detail: // html
						`\
						The stack is located in the highest addressess of the owning program's virtual address space. As items are pushed onto\
						the stack, it grows downwards through the addresses until it meets the top of the heap, at which point a segmentation fault\
						is thrown.

						According to the Procedure Call Standard for the ARM Architecture (AAPCS), the stack should be 8-byte aligned, this means\
						that the stack must always contain an even number of words. There's nothing forcing you to do this but it is considered\
						good practice because it improves memory access speeds on some systems. 
					`
				},
				endianness: {
					title: "endianness",
					detail: // html
						`\
						'Endianness' describes the byte order within collections of bytes in memory. Since ARMv7 is a 32 bit processor,\
						the most common 'collection' of bytes are 32-bit (4-byte) integers. In almost all modern computers, numbers are\
						stored '<span class="irisc">little-endian</span>', meaning that the 'logical' byte order as a human might expect\
						is reversed (!!).

						To take a common example, the hexadecimal number <span class="token immediate">0x12345678</span> is split into its\
						respective bytes:\

						<div class="ml-3">
							<span class="label-stack">0x12</span>\
							<span class="label-text">0x34</span>\
							<span class="label-data">0x56</span>\
							<span class="token immediate">0x78</span>
						</div>\

						In '<span class="irisc">big-endian</span>', these bytes are stored in the order shown; however, in\
						'<span class="irisc">little-endian</span>', the order of the bytes is reversed:\
						
						<div class="ml-3">
							<span class="token immediate">0x78</span>\
							<span class="label-data">0x56</span>\
							<span class="label-text">0x34</span>\
							<span class="label-stack">0x12</span>
						</div>\

						This reversed order is what is actually contained within the memory. I have provided a way to switch the endianness\
						of each word so that they make a bit more sense when read as a whole.
					`
				},
			} as TDictionary<TTip>,

			controlTooltip: undefined as string | undefined,

			ascii: asciiTable.ascii,
			shown: false
		};
	},

	computed: {
		byteView: SimulatorState.byteView,
		wordView: SimulatorState.wordView,
		memSize: () => SimulatorState.memory().size,

		memIsInitialised: () => SimulatorState.memory().buffer !== undefined,

		textHeight: () => SimulatorState.memory().textHeight,
		dataHeight: () => SimulatorState.memory().dataHeight,
		stackHeight: () => SimulatorState.memory().stackHeight,

		textWordHeight: function (): number { return this.textHeight / 4 },
		dataWordHeight: function (): number { return this.dataHeight / 4 },
		stackWordHeight: function (): number { return this.stackHeight / 4 },
		uninitWordHeight: function (): number { return Math.max((this.memSize / 4) - this.textWordHeight - this.dataWordHeight - this.stackWordHeight, 0) },

		textOffset: function (): number { return 0; },
		dataOffset: function (): number { return this.textOffset + this.textWordHeight; },
		uninitOffset: function (): number { return this.dataOffset + this.dataWordHeight; },
		stackOffset: function (): number { return this.uninitOffset + this.uninitWordHeight; },

		instructions: () => SimulatorState.memory().text,
		instruction: function (): TInstructionNode | undefined {
			if (this.instructionIndex !== undefined) return this.instructions[this.instructionIndex];
			return undefined;
		}
	},

	methods: {
		show: function (section: string) {
			this.shown = false;
			(this.$refs.modal as BModal).show();

			const v = this;
			setTimeout(() => {
				v.shown = true;
			}, 350);
		},

		byteValue: function (wordIndex: number, byteIndex: number): number {
			const index = (wordIndex * 4) + this.endianify(byteIndex);
			return this.byteView[index];
		},

		wordValue: function (wordIndex: number): number {
			return this.wordView[wordIndex];
		},

		endianify(byteIndex: number): number {
			if (this.endianness === 'big') return [3, 2, 1, 0][byteIndex];
			return byteIndex;
		},

		printByte: function (value: number): string {
			if (this.datatype === 'dec') return value.toString(10);
			if (this.datatype === 'bin') return this.binstr(value);
			if (this.datatype === 'ascii') return this.ascii[value][3];
			else return this.hexstr(value);
		},

		printWord: function (value: number): string {
			if (this.datatype === 'dec') return value.toString(10);
			if (this.datatype === 'bin') return this.binstr(value, 32);
			else return this.hexstr(value, 8);
		},

		hexstr: function (value: number, pad: number = 2): string {
			return `${value?.toString(16).padStart(pad, '0')}`
		},

		binstr: function (value: number, pad: number = 8): string {
			return `${value?.toString(2).padStart(pad, '0')}`
		},

		highlight: function (instruction: TInstructionNode): string {
			return highlight(instruction.text, languages.armv7, 'ARMv7');
		},

		tip: function (name: string) {
			this.tooltip = this.tips[name];
		},

		untip: function () {
			this.tooltip = this.tips['default'];
		}
	},

	created: function () {
		this.untip();
	},

	watch: {
		size: {
			handler: function (value) {
				if (value === 'word') {
					if (this.datatype === 'ascii') this.datatype = 'hex';
				}
			}
		}
	}
});
</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fenced {
	border: 1px dashed #cccdcd;
	margin-bottom: -2px;
}

.regions {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}

.region {
	position: absolute;
	width: 100%;
}

.region.text {
	background-color: rgba(0, 119, 170, 0.1);
	border-color: #0077aa;
	top: 0;
}

.region.data {
	background-color: rgba(255, 85, 85, 0.1);
	border-color: #ff5555;
}

.region.stack {
	background-color: rgba(93, 148, 85, 0.1);
	border-color: #5d9455;
	bottom: 0;
}

.word {
	height: 22px;
}

.word-index {
	height: 22px;
	font-size: 13px;
	line-height: 24px;
	text-align: right;
	color: #667585;
}

.tippable {
	cursor: help;
}

.tooltip-box {
	background-color: #0d1117;
	right: calc(50vw + (498px / 2) + 15px);
	width: 280px;
	white-space: pre-line;
}

.control-box {
	background-color: #0d1117;
	left: calc(50vw + (498px / 2) + 15px);
}

.debugger {
	padding: 0 0.25rem;
}

.control-tooltip {
	position: absolute;
	left: -1px;
	bottom: -27px;
	background-color: #0d1117;
  /* padding: 0 0.25rem 0.05rem 0.25rem; */
  font-size: 14px;
}

.tooltip-box>>>.label-text {
	color: #0077aa;
}

.tooltip-box>>>.label-data {
	color: #ff5555;
}

.tooltip-box>>>.label-stack {
	color: #5d9455;
}

.tooltip-box>>>.irisc {
	color: #e02f72;
}
</style>