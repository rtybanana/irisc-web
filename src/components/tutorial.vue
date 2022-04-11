<template>
  <div class="container p-2 text-left">
    <div>
      <div class="title px-1">{{ pageData.title }}</div>
      <div class="content mt-2 p-1" v-html="pageData.content"></div>
    </div>

    <div class="controls">
      <div class="p-1" style="border-radius: 0.3rem; background-color: #191d21;">
        <i class="fas fa-chevron-left fa-sm p-1 clickable hoverable rounded-sm"></i>
        <span class="mx-1">{{ page + 1 }}/{{ pages.length }}</span>

        <i class="fas fa-chevron-right fa-sm p-1 clickable hoverable rounded-sm"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { tutorialPages, TTutorialPage } from "@/constants";

export default Vue.extend({
  name: 'tutorial',
  data() {
    return {
      pages: tutorialPages as TTutorialPage[],
      page: 0 as number
    }
  },
  computed: {
    pageData: function () : TTutorialPage {
      return this.pages[this.page];
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

.title {
  font-size: 18px;
  background-color: #191d21;
  border-radius: 0.3rem; 
}

.content {
  white-space: pre-line;
}

.content >>> .irisc {
  color: #8b0c3c;
}

.controls {
  position: absolute;
  bottom: 0;
  padding: 0.25rem 0.5rem 0.6rem 0rem;
}

</style>