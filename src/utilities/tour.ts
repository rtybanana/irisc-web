import Shepherd from 'shepherd.js';
import { offset } from '@floating-ui/dom';
import { SimulatorState } from '@/simulator';
import Vue from 'vue';
import { TInstructionNode } from '@/syntax/types';
import { Register } from '@/constants';
import { highlight, languages } from 'prismjs';
import { AchievementState } from '@/achievements';


export function createTour() {
	const tour = new Shepherd.Tour({
			useModalOverlay: true
	});

	tour.addStep({
		title: "Welcome to iRISC",
		text: "Take a quick tour of the application to learn what everything is!",
		buttons: [
			{ 
				text: "skip it",
				action: function () { this.complete(); } 
			},
			{ 
				text: "start tour",
				action: function () { 
					SimulatorState.reset();
					this.next(); 
				} 
			}
		]
	});

	tour.addStep({
		id: "terminal",
		attachTo: { element: '[tour-item="terminal"]', on: 'bottom' },
		text:	// html 
		`
			<div>
				This is the terminal. Here, you may execute individual instructions and immediately see their effect on the simulator.
			</div>

			<div class="mt-3">
				Type '<span class="token operation">mov</span> <span class="token register">r1</span>, <span class="token immediate">#1</span>'
				into the terminal and use the enter key to continue!
			</div>
		`,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		}
	});

	tour.addStep({
		attachTo: { element: '[tour-item="r1"]', on: 'right' },
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		buttons: [
			{ 
				text: "got it",
				action: function () { this.next(); } 
			}
		],
		when: {
			show: function () {
				const currentStep = Shepherd.activeTour?.getCurrentStep();
				const currentStepElement = currentStep?.getElement();
				const content = currentStepElement?.querySelector('.shepherd-content');
				const button = content?.querySelector('.shepherd-button') as HTMLElement;

				const textEl = document.createElement('div');
				textEl.className = 'shepherd-text';

				
				if (tourVm.currentInstruction?.text === 'mov r1, #1') {
					textEl!.innerHTML = // html 
					`
						<div>Nice!</div> 
						
						<div class="mt-3">
							You <span class="token operation">mov</span>ed the value <span class="token immediate">#1</span> 
							into register <span class="token register">r1</span>!
						</div>
					`;
				}
				else {
					AchievementState.achieve("Eh... close enough.");

					const highlitInstruction = highlight(tourVm.currentInstruction!.text, languages.armv7, 'ARMv7');
					const r1 = SimulatorState.registers()[Register.R1];

					if (r1 === 1) {
						textEl!.innerHTML = // html 
						`
							<div>${highlitInstruction}?</div> 
							
							<div class="mt-3">
								There's a one in here at least, so that's something.
							</div>
						`;
						
						button!.innerHTML = 'your way was boring';
					}
					else {
						textEl!.innerHTML = // html 
						`
							<div>...</div> 
							
							<div class="mt-3">
								Guess we'll just use ${highlitInstruction} as our example instead...
							</div>
						`;
						
						button!.innerText = 'oops';
					}
				}

				content?.insertBefore(textEl, content.querySelector('.shepherd-footer'));
			}
		}
	});

	tour.addStep({
		attachTo: { element: '[tour-item="assembler"]', on: 'top' },
		text:	// html 
		`
			<div>
				This is the <span class="text-irisc">assembler</span>. It gives detailed information about the last instruction.
			</div>

			<div class="mt-3">
				The binary number at the top is the assembled bitcode for the last instruction. You can hover the different sections to learn
				how the computer decodes this bitcode for execution.
			</div>
		`,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		buttons: [
			{ 
				text: "okay",
				action: function () { this.next(); }
			}
		]
	});

	tour.addStep({
		attachTo: { element: '[tour-item="editor-switch"]', on: 'bottom' },
		text:	// html 
		`
			Click this button to switch to the <span class="text-irisc">code editor</span>.
		`,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		advanceOn: {
			selector: '[tour-item="editor-switch"]',
			event: 'click'
		}
	});

	tour.addStep({
		id: "editor",
		attachTo: { element: '[tour-item="editor"]', on: 'bottom' },
		text:	// html 
		`
			<div>
				This is the <span class="text-irisc">code editor</span>. In here you can write simple scripts of assembly instructions or even full ARMv7 programs.
			</div>

			<div class="mt-3">
				You can add breakpoints by clicking the line number of the instruction you want to break on.
			</div>

			<div class="mt-3">
				Add a breakpoint to line #20 to continue.
			</div>
		`,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		when: {
			hide: function () {
				SimulatorState.reset();
			}
		}
	});

	tour.addStep({
		attachTo: { element: '[tour-item="debugger"]', on: 'bottom' },
		text:	// html 
		`
			<div>
				These are the <span class="text-irisc">debug controls</span>.
			</div>

			<div class="mt-3">
				The standard operations are included: run/pause, stop and step forward; 
				but also <u>step back</u> (<i class="fas fa-step-backward fa-xs token label"></i>) 
				and a tick rate slider to control the length of time between CPU 'ticks'.
			</div>
		`,
		floatingUIOptions: {
			middleware: [ offset(35) ]
		},
		canClickTarget: false,
		buttons: [
			{ 
				text: "righto",
				action: function () {
					this.next(); 
				} 
			}
		]
	});

	tour.addStep({
		attachTo: { element: '[tour-item="debug-run"]', on: 'bottom' },
		text:	// html 
		`
			Click the <i class="fas fa-play fa-xs text-green"></i> button to run the program.
		`,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		advanceOn: {
			selector: '[tour-item="debug-run"]',
			event: 'click'
		},
		when: {
			show: function () {
				// SimulatorState.reset();
				SimulatorState.setDelay(500);
			}
		}
	});

	tour.addStep({
		id: "run-program",
		attachTo: { element: '[tour-item="editor"]' },
		arrow: false,
		canClickTarget: false,
		classes: 'd-none'
	});

	tour.addStep({
		attachTo: { element: '[tour-item="history"]', on: 'right' },
		text: // html
		`
			<div>
				Click here to open the <span class="text-irisc">state history</span> modal.
			</div>
		`,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		advanceOn: {
			selector: '[tour-item="history"]',
			event: 'click'
		},
	});

	tour.addStep({
		attachTo: { element: '[tour-item="state-history"]', on: 'right' },
		text: // html
		`
			<div>
				This modal contains the complete <span class="text-irisc">state history</span> for the running program or terminal session.
			</div>

			<div class="mt-3">
				After every instruction execution, a snapshot is taken of the simulator state. This modal allows you to compare the differences
				and replay states right back to the start of execution.
			</div>
		`,
		canClickTarget: false,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		buttons: [
			{ 
				text: "cool",
				action: function () {
					this.next(); 
				} 
			}
		]
	});

	tour.addStep({
		attachTo: { element: '[tour-item="state-history-debug"]', on: 'bottom' },
		text: // html
		`
			<div>
				This popout debugger allows you to control the flow of the program without having to exit 
				the <span class="txet-irisc">state history</span> modal.
			</div>
		`,
		highlightClass: "disabled",
		// canClickTarget: false,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		buttons: [
			{ 
				text: "nifty",
				action: function () {
					this.next(); 
				} 
			}
		]
	});

	tour.addStep({
		id: "state-history-tick",
		attachTo: { element: '[tour-item="state-history-tick-1"]', on: 'right' },
		text: // html
		`
			<div>
				Click on any previous state to restore the simulator back to the corresponding tick.
			</div>
		`,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		}
	});

	tour.addStep({
		attachTo: { element: '[tour-item="state-history-tick-1"]', on: 'right' },
		text: // html
		`
			<div>
				Nice one.
			</div>
		`,
		canClickTarget: false,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		buttons: [
			{ 
				text: "thanks?",
				action: function () {
					tourVm.vueApp!.$root.$emit('bv::hide::modal', 'state-history');
					this.next(); 
				} 
			}
		]
	});

	tour.addStep({
		attachTo: { element: '[tour-item="memory"]', on: 'top' },
		text:	// html 
		`
			<div>
				This area displays the simulator memory. It is arranged like the virtual address space of a program running on your computer.
			</div>

			<div class="mt-3">
				<span class="token register">Text</span>, <span class="token operation">data</span> (instructions and static variables), 
				and the <span class="token label">heap</span> grow upwards from the lower addresses on the left, the <span class="token line-comment">stack</span> 
				grows down from the higher addresses on the right.
			</div>
		`,
		canClickTarget: false,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		buttons: [
			{ 
				text: "alrighty",
				action: function () { this.next(); } 
			}
		]
	});

	tour.addStep({
		attachTo: { element: '[tour-item="memory-usage"] .region', on: 'top' },
		text:	// html 
		`
			<div>
				This section indicates the portion of memory used by the <span class="token register">text</span> (instructions) of the program
				in the <span class="text-irisc">code editor</span>.
			</div>

			<div class="mt-3">
				Click on any section of the memory usage visualiser to open the <span class="text-irisc">memory explorer</span>.
			</div>
		`,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		advanceOn: {
			selector: '[tour-item="memory-usage"] .region',
			event: 'click'
		}
	});

	tour.addStep({
		id: "memory-data",
		attachTo: { element: '[tour-item="memory-data"]', on: 'right' },
		text:	// html 
		`
			<div>
				This is the <span class="text-irisc">memory explorer</span>. It shows the actual data stored in each byte of the 
				simulated RAM.
			</div>

			<div class="mt-3">
				Bytes are displayed line-by-line from left to right in ascending order of address.
			</div>
		`,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		buttons: [
			{ 
				text: "okay, enough already",
				action: function () { 
					tourVm.vueApp!.$root.$emit('bv::hide::modal', 'memory-explorer');
					this.next(); 
				} 
			}
		]
	});

	tour.addStep({
		attachTo: { element: '[tour-item="tutorial"]', on: 'left' },
		text:	// html 
		`
			<div>
				Finally, there's a tutorial over here to help you get started with ARM assembly if you've never written any before.
			</div>
		`,
		floatingUIOptions: {
			middleware: [ offset(15) ]
		},
		buttons: [
			{ 
				text: "whatever",
				action: function () {
					this.next(); 
				} 
			}
		]
	});

	tour.addStep({
		title: "And that's it!",
		text:	// html 
		`
			<div>
				<i>Iff</i> you like this app or are interested in how it was made you can check the source code via the
				<u>src</u> link in the bottom right.
			</div>

			<div class="mt-3">
			 <small>You can even star it if you like!</small>
			</div>
		`,
		buttons: [
			{ 
				text: "finally!",
				action: function () {
					AchievementState.achieve("Tour de Force!");
					this.complete(); 
				} 
			}
		]
	});

	const tourVm = new Vue({
		computed: {
			currentTick: SimulatorState.currentTick,
			currentInstruction: SimulatorState.currentInstruction,
			breakpoints: SimulatorState.breakpoints,
			vueApp: SimulatorState.vue
		},
		methods: {
			isStep: function (stepId: string) {
				return tour.getCurrentStep()?.id === stepId;
			}
		},
		watch: {
			currentInstruction: function (instruction: TInstructionNode) {
				if (this.isStep("terminal")) {
					// 
					if (instruction) {
						tour.next();
					}
				}
			},

			breakpoints: function (breakpoints: TInstructionNode[]) {
				if (this.isStep("editor")) {
					if (breakpoints.find(e => e.lineNumber === 19)) {		// zero-indexed line #20
						// remove all other breakpoints
						SimulatorState.removeBreakpoints();
						SimulatorState.toggleBreakpoint(19);

						tour.next();
					}
				}
			},

			currentTick: function (currentTick: number) {
				if (this.isStep("run-program")) {
					if (currentTick === 3) {
						setTimeout(() => tour.next(), 500);
					}
				}

				else if (this.isStep("state-history-tick")) {
					if (currentTick === 1) {
						tour.next();
					}
				}
			}
		}
	});

	return tour;
}