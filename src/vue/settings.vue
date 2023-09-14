<template>
  <b-modal 
    ref="modal" 
    centered 
    hide-header 
    hide-footer
    body-class="irisc-modal p-1"
  >

    <div class="px-5 py-1">
      <h4>configuration</h4>
      <div class="mt-3">

        <!-- simulation speed -->
        <div>
          cpu tickrate
          <span class="float-right">{{ (1000 / delay).toFixed(2) }} tps</span>
        </div>
        <b-form-input 
          :value="1000 / delay"
          @change="simulatorState.setDelay(1000 / $event)"
          type="range"
          min="0.5"
          max="50"
          step="0.1"
        ></b-form-input>

        <!-- memory size -->
        <div>
          ram size 
          <span class="float-right">{{ memory.size }} bytes</span>
        </div>
        <b-form-input 
          :value="memory.sizes.findIndex(e => e === memory.size)"
          @change="simulatorState.init(memory.sizes[+$event])"
          type="range"
          min="0"
          :max="memory.sizes.length - 1"
        ></b-form-input>

        <div>
          crt effect (epilepsy warning)
        </div>
        <b-form-checkbox :checked="settings.crtEffect" @change="settingsState.setCrtEffect($event)" name="crt-effect" switch>
          {{ settings.crtEffect ? 'on' : 'off' }} 
        </b-form-checkbox>
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { SimulatorState } from '@/simulator';
import { SettingsState } from '@/utilities';
import { BModal } from 'bootstrap-vue';
import Vue from 'vue';


export default Vue.extend({
  data() {
    return {
      simulatorState: SimulatorState,
      settingsState: SettingsState,
    }
  },
  computed: {
    settings: SettingsState.settings,

    memory: SimulatorState.memory,
    delay: SimulatorState.delay
  },
  methods: {
    show: function () {
      (this.$refs.modal as BModal).show();
    }
  }
})
</script>

<style scoped>

</style>