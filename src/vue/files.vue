<template>
  <div 
    class="files-container p-1" 
    v-click-outside="close"
  >
    <a v-if="!showFiles" class="link clickable" style="color: #f9e1b3;" @click="showFiles = true">files</a>
    <div v-else>
      <div class="mb-1">
        {{ directory }}
      </div>

      <template v-if="directory === '/'">
        <div>
          <a class="link text-grey clickable" @click="changeDirectory('/myfiles/')"><i>myfiles/</i></a>
        </div>

        <div v-for="file in sampleFiles" :key="file">
          <a class="link text-white clickable" @click="loadSample(file)">{{ file }}</a>
        </div>
      </template>

      <template v-else-if="directory === '/myfiles/'">
        <div v-if="getLocal().length === 0"><i>empty</i></div>

        <div v-for="file in getLocal()" :key="file">
          <a class="link text-white clickable" @click="loadLocal(file)">{{ file }}</a>
        </div>
      </template>


      <div class="mt-2">
        <a class="link clickable" style="color: #f9e1b3;" @click="close">hide</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

type TFile = {
  name: string;
  content: string;
}

export default Vue.extend({
  name: "files",
  data() {
    return {
      showFiles: false,
      directory: '/',

      sampleFiles: [
        "helloworld.s",
        "typewriter.s",
        "strlen.s",
        "recursion.s",
        "stackoverflow!.s",
        "bubblesort.s",
        "buggymess.s"
      ]
    }
  },
  methods: {
    changeDirectory: function (path: string) {
      console.log(path);
      this.directory = path;
    },
    
    getLocal: function (): string[] {
      return Object.keys(localStorage)
        .filter(e => e.startsWith('/myfiles/'))
        .map(e => `${e.slice(8)}.s`);
    },

    loadLocal: function (path: string) {

    },

    loadSample: function (path: string) {
      fetch(`samples/${path}`)
      .then(res => res.text())
      .then(code => {
        this.openCode(code);
      });
    },

    openCode: function (code: string) {
      this.$emit('open', code);
      this.showFiles = false;
    },

    close: function () {
      this.showFiles = false;
      this.directory = '/';
    }
  }
})
</script>

<style scoped>
.files-container {
  border-radius: 0.3rem; 
  background-color: #191d21;
}
</style>