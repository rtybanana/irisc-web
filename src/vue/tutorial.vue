<template>
  <div ref="container" class="container p-2 text-left">
    <div>
      <div class="title px-1">{{ pageData.title }}</div>
      <div class="content mt-2 mb-5 p-1" v-html="pageData.content"></div>
    </div>

    <div class="controls">
      <div class="p-1" style="border-radius: 0.3rem; background-color: #191d21;">
        <i 
          class="fas fa-chevron-left fa-sm p-1 clickable hoverable rounded-sm"
          @click="prevPage"
        ></i>

        <span class="mx-1 user-select-none">{{ page }}/{{ pages.length - 1 }}</span>

        <i 
          class="fas fa-chevron-right fa-sm p-1 clickable hoverable rounded-sm"
          @click="nextPage"
        ></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TTutorialPage, tutorialPages } from "@/tutorial";
import Vue from 'vue';

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
  },
  methods: {
    nextPage: function () {
      if (this.pages.length > this.page + 1) {
        this.page++;
      }
    },

    prevPage: function () {
      if (this.page > 0) {
        this.page--;
      }
    }
  },

  created: function () {
    this.page = JSON.parse(localStorage.getItem('tutorial') ?? "0");
  },

  watch: {
    page: function () {
      localStorage.setItem('tutorial', JSON.stringify(this.page));

      this.$nextTick(() => {
        (this.$refs.container as HTMLElement).scrollTo({
          top: 0,
          behavior: 'auto'
        });
      })
      
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
  overflow-x: hidden;
}

.title {
  position: sticky;
  top: 0;
  font-size: 18px;
  background-color: #191d21;
  border-radius: 0.3rem; 
}

.content {
  white-space: pre-line;
}

.content >>> .irisc {
  color: #e02f72;
}

.content >>> .hmm {
  background-color: #191d21;
  border-radius: 0.3rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.content >>> .code {
  background-color: #191d21;
  border-radius: 0.3rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.controls {
  position: absolute;
  bottom: 0;
  padding: 0.25rem 0.5rem 0.6rem 0rem;
}

</style>