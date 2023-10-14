import { TAchievement, TAchievementState } from "./types";
import { achievementMap, rarityClassMap, rarityNameMap } from "./constants";
import Vue from 'vue';

const state = Vue.observable<TAchievementState>({
  achieved: new Set<TAchievement>(),
  new: new Set<TAchievement>()
});

export const getters = {
  achievements: () => achievementMap,
  achieved: () => state.achieved,
  new: () => state.new
}

export const actions = {
  achieve: function (name: string) {
    let achievement = achievementMap[name];
    if (achievement && !state.achieved.has(achievement)) {
      state.achieved.add(achievement);
      state.new.add(achievement);

      state.achieved = new Set([...state.achieved]);
      state.new = new Set([...state.new]);

      const vm = new Vue({});
      const h = vm.$createElement;

      vm.$bvToast.toast(
        [
          h('div', { class: "mt-1"}, [h('span', { class: `achievement-name bg-${rarityClassMap[achievement.rarity]} rounded` }, achievement.name)]),
          h('div', { class: `mt-1 px-1` }, achievement.description)
        ], 
        { 
          title: `Achievement Unlocked!`, 
          toastClass: `irisc-toast`, 
          toaster: "b-toaster-bottom-right", 
          variant: 'dark',
          autoHideDelay: 4000,
          noHoverPause: true,
          appendToast: true
      });
    }
  },

  read: function () {
    state.new = new Set<TAchievement>();
  }
}