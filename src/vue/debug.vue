<template>
	<div class="d-inline-block">
		<i class="button red fas fa-stop mr-1 clickable" @click="stop" @mouseenter="tip('stop  (ctrl + ↑)')"
			@mouseleave="tip(undefined)"></i>

		<!-- run / pause / resume -->
		<template>
			<i v-show="!running" class="button green fas fa-play mx-1 clickable" @click="run" @mouseenter="tip('run (ctrl + ↓)')"
				@mouseleave="tip(undefined)"></i>
			<i v-show="running && !paused" class="button fas fa-pause mx-1 clickable" @click="pause" @mouseenter="tip('pause (ctrl + ↓)')"
				@mouseleave="tip(undefined)"></i>
			<i v-show="running && paused" class="button green fas fa-play mx-1 clickable" @click="resume"
				@mouseenter="tip('continue (ctrl + ↓)')" @mouseleave="tip(undefined)"></i>
		</template>

		<i class="button amber step fas fa-step-backward mx-1 clickable" @click="stepBack"
			@mouseenter="tip('step back (ctrl + ←)')" @mouseleave="tip(undefined)"></i>

		<i class="button amber step fas fa-step-forward mx-1 clickable" @click="stepForward"
			@mouseenter="tip('step (ctrl + →)')" @mouseleave="tip(undefined)"></i>

		<div class="tick-rate d-inline-block mx-1" style="width: 60px;">
			<b-form-input style="margin-bottom: -5px;" type="range" inline :value="1000 / delay" min="0.5" max="100" step="0.1"
				@input="setDelay" @mouseenter="tip('tick rate')" @mouseleave="tip(undefined)"></b-form-input>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { SimulatorState } from '@/simulator';

export default Vue.extend({
	props: {
		tooltip: String
	},
	computed: {
		currentTick: SimulatorState.currentTick,
		running: SimulatorState.running,
		paused: SimulatorState.paused,
		delay: SimulatorState.delay,
		errors: SimulatorState.errors
	},
	methods: {
		run: () => SimulatorState.start(),
		stop: () => SimulatorState.stop(),

		pause: () => SimulatorState.pause(),
		resume: () => SimulatorState.resume(),

		stepBack: () => SimulatorState.stepBack(),
		stepForward: () => SimulatorState.stepForward(),

		reset: () => SimulatorState.reset(),
		setDelay: function (delay: number) {
			SimulatorState.setDelay(1000 / delay)
		},

		tip(text?: string) {
			this.$emit('update:tooltip', text);
		}
	}
});
</script>

<style scoped>
.button.red {
	color: #d9484c;
}

.button.green {
	color: #1d8f46;
}

.button.amber {
	color: #f9e1b3
}

.button.terminal {
	color: #8b0c3c;
}

.tick-rate>>>.custom-range {
	height: auto;
	-webkit-padding-after: 2px;
}
</style>