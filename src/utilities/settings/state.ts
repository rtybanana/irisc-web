import { TSettings } from './types';
import Vue from 'vue';

const settings = Vue.observable<TSettings>({
  crtEffect: false
});

export const getters = {
  settings: () => settings
};

export const actions = {
  setCrtEffect: function (value: boolean) {
    console.log(value);

    settings.crtEffect = value;
    updateStorage();
  }
}

function updateStorage() {
  localStorage.setItem('settings', JSON.stringify(settings));
}

function _init() {
  const localSettings = localStorage.getItem('settings');
  if (localSettings) {
    const state = JSON.parse(localSettings) as TSettings;
    settings.crtEffect = state.crtEffect;
  }
}

_init();
console.log(settings.crtEffect);

