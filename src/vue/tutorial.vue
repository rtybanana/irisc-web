<template>
  <div 
    ref="container" 
    tour-item="tutorial"
    class="container p-2 text-left"
  >
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

    <div class="contents">
      <div 
        class="p-1" 
        style="border-radius: 0.3rem; background-color: #191d21;"
        v-click-outside="() => showContents = false"
      >
        <a v-if="!showContents" class="link clickable" style="color: #f9e1b3;" @click="openContents">contents</a>
        <template v-else>
          <div v-for="contentsLink in contentsSlice" :key="contentsLink.index">
            <a 
              class="link text-white clickable"
              :class="contentsLink.index === page ? 'current-page' : ''"
              @click="navigateTo(contentsLink)"
            >
              {{ contentsLink.title }}
            </a>
          </div>

          <div class="mt-1 text-right">
            <!-- <a class="link clickable" style="color: #f9e1b3;" @click="showContents = false">hide</a> -->

            <span class="">
              <i 
                class="fas fa-chevron-left fa-sm p-1 clickable hoverable rounded-sm"
                @click="contentsPage > 0 && contentsPage--"
              ></i>

              <span class="mx-1 user-select-none">{{ contentsPage }}/{{ nContentsPages - 1 }}</span>

              <i 
                class="fas fa-chevron-right fa-sm p-1 clickable hoverable rounded-sm"
                @click="contentsPage < (nContentsPages - 1) && contentsPage++"
              ></i>
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TTutorialPage, tutorialPages, TContentsLink, contentsPage } from "@/tutorial";
import Vue from 'vue';

export default Vue.extend({
  name: 'tutorial',
  data() {
    return {
      pages: tutorialPages as TTutorialPage[],
      page: 0 as number,

      contents: contentsPage as TContentsLink[],
      contentsPerPage: 10,
      contentsPage: 0,
      showContents: false
    }
  },
  computed: {
    pageData: function () : TTutorialPage {
      return this.pages[this.page];
    },

    nContentsPages: function () : number {
      return Math.ceil(this.contents.length / this.contentsPerPage);
    },

    contentsSlice: function () : TContentsLink[] {
      return this.contents.slice(
        this.contentsPage * this.contentsPerPage, 
        (this.contentsPage + 1) * this.contentsPerPage
      );
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
    },

    openContents: function () {
      this.contentsPage = Math.floor(this.page / 10);
      this.showContents = true;
    },

    navigateTo: function (page: TContentsLink) {
      this.page = page.index;
    }
  },

  created: function () {
    this.page = JSON.parse(localStorage.getItem('tutorial') ?? "0");
  },

  watch: {
    page: function () {
      this.showContents = false;
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

.content >>> .green {
  color: #1d8f46;
}

.content >>> .red {
  color: #d9484c;
}

.content >>> .amber {
  color: #f9e1b3
}

.content >>> .hmm {
  background-color: #1f2024;
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

.content >>> .not-executed {
  background-color: #ff5555;
  color: #101821;
  padding: 0 0.25rem;
  border-radius: 0.15rem;
}

.controls {
  position: absolute;
  bottom: 0;
  padding: 0.25rem 0.5rem 0.6rem 0rem;
}

.contents {
  position: absolute;
  bottom: 0;
  right: 18px;
  padding: 0.25rem 0.5rem 0.6rem 0rem;
}

.contents .current-page {
  color: #e02f72 !important;
}

/* .contents .contents-list {
  max-height: 350px;
  overflow-x: hidden;
  margin-bottom: 30px;
} */

</style>