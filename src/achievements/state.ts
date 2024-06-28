import { TAchievement, TAchievementState } from "./types";
import { achievementMap, rarityClassMap, rarityNameMap } from "./constants";
import Vue from 'vue';
import { FileSystemState } from "@/files";
import Shepherd from "shepherd.js";

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
    // TODO: think about how to prevent code related achievements for code the user did not write
    // if the user does not own the open file then prevent earning achievements
    

    let achievement = achievementMap[name];
    if (achievement.codeBased && (FileSystemState.currentFile()?.static || !FileSystemState.currentFile()?.writeable)) return;
    if (!achievement.allowInTour && Shepherd.activeTour) return;

    if (achievement && !state.achieved.has(achievement)) {
      state.achieved.add(achievement);
      state.new.add(achievement);
      localStorage.setItem("achievements", JSON.stringify(""))

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