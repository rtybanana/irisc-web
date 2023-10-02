import { SimulatorState } from '@/simulator';
import { TSettings } from './types';
import Vue from 'vue';

const settings = Vue.observable<TSettings>({
  crtEffect: false
});

export const getters = {
  settings: () => ({
    ...settings,
    memSize: SimulatorState.memory().size,
    delay: SimulatorState.delay()
  })
};

export const actions = {
  init: function () {
    const localSettings = localStorage.getItem('settings');
    if (localSettings) {
      const state = JSON.parse(localSettings);

      SimulatorState.setDelay(state.delay ?? 500);
      SimulatorState.init(state.memSize ?? 256);

      settings.crtEffect = state.crtEffect ?? false;
    }
  },

  setCrtEffect: function (value: boolean) {
    settings.crtEffect = value;
  },

  updateStorage: function () {
    const toStore = {
      ...settings,
      delay: SimulatorState.delay(),
      memSize: SimulatorState.memory().size
    };
  
    localStorage.setItem('settings', JSON.stringify(toStore));
  }
}
