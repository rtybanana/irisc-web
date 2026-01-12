<template>
  <b-modal 
    ref="modal" 
    size="600"
    centered 
    hide-header 
    hide-footer
    body-class="irisc-modal p-1"
    @hidden="achievementState.read"
  >
    <div class="px-4 py-1">
      <h4 class="mb-0">achievements</h4>

      <div style="font-size: 14px;">
        {{ achieved.size }}/{{ achievements.length }} unlocked
      </div>

      <div class="mt-2" style="font-size: 14px;">
        <span class="achievement-name bg-common rounded mr-2">Common</span>
        <span class="achievement-name bg-uncommon rounded mr-2">Uncommon</span>
        <span class="achievement-name bg-rare rounded mr-2">Rare</span>
        <span class="achievement-name bg-epic rounded mr-2">Epic</span>
      </div>

      <div class="row align-items-stretch no-gutters mt-1">
        <div 
          v-for="(achievement, index) in achievements" 
          class="col-6 mb-3"
          :class="index % 2 === 0 ? 'pr-2' : 'pl-2'"
          :key="achievement.name"
        >
          <b-overlay class="h-100" :show="!achieved.has(achievement)" :opacity="0.4" variant="dark" no-center>
            <div class="fenced h-100">
              <span class="achievement-name rounded" :class="achieved.has(achievement) ? `bg-${rarityClassMap[achievement.rarity]}` : 'bg-secondary'">
                {{ achievement.name }}
                <!-- <span v-else>Locked</span> -->
              </span>

              <div style="font-size: 14px;">
                <span v-if="achieved.has(achievement)">{{ achievement.description }}</span>
                <span v-else>
                  Locked
                </span>
              </div>
            </div>

            <template #overlay>
              <i class="position-absolute fas fa-lock text-secondary" style="bottom: 8px; right: 8px;"></i>
            </template>
          </b-overlay>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { AchievementState } from '@/achievements';
import { rarityClassMap } from '@/achievements/constants';
import { BModal } from 'bootstrap-vue';
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      achievementState: AchievementState,
      rarityClassMap
    }
  },

  computed: {
    achievements: () => {
      return Object.values(AchievementState.achievements())
        .sort((a, b) => a.rarity - b.rarity);
    },
    achieved: AchievementState.achieved,
    new: AchievementState.new
  },

  methods: {
    show: function () {
      (this.$refs.modal as BModal).show();
    }
  }
})
</script>

<style scoped>
.fenced {
  border: 1px dashed #cccdcd;
  padding: 0.25rem 0.5rem;
}
</style>