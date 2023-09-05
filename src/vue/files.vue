<template>
  <div 
    v-if="currentDirectory"
    class="files-container p-1" 
    :class="showFiles ? 'min-width' : ''"
    v-click-outside="close"
  >
    <a v-if="!showFiles" class="link clickable" style="color: #f9e1b3;" @click="showFiles = true">files</a>
    <div v-else>
      <div class="mb-1">
        /{{ currentDirectory.name }}
      </div>

      <div v-for="directory in directories" :key="directory.name">
        <a class="link text-grey clickable" @click="openDirectory(directory)"><i>{{ directory.name }}/</i></a>
      </div>

      <div v-for="file in files" :key="file.name">
        <a 
          class="link text-white clickable" 
          :class="currentFile === file ? 'open' : ''"
          @click="openFile(file)"
        >
          {{ file.name }}
        </a>
      </div>

      <div v-if="currentDirectory.parent">
        <a class="link text-grey clickable" @click="openDirectory(currentDirectory.parent)">..</a>
      </div>

      <!-- <template v-if="directory === '/'">
        <div>
          <a class="link text-grey clickable" @click="changeDirectory('/myfiles/')"><i>myfiles/</i></a>
        </div>

        <div v-for="file in sampleFiles" :key="file">
          <a class="link text-white clickable" @click="loadSample(file)">{{ file }}</a>
        </div>
      </template> -->

      <!-- <template v-else-if="directory === '/myfiles/'">
        <div v-if="getLocal().length === 0"><i>empty</i></div>

        <div v-for="file in getLocal()" :key="file">
          <a class="link text-white clickable" @click="loadLocal(file)">{{ file }}</a>
        </div>
      </template> -->


      <!-- <div class="mt-2">
        <a class="link clickable" style="color: #f9e1b3;" @click="close">hide</a>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { FileSystemState } from '@/files';
import { TFile, TDirectory } from '@/files/types';



export default Vue.extend({
  name: "files",
  data() {
    return {
      showFiles: false,
    };
  },
  computed: {
    currentDirectory: FileSystemState.currentDirectory,
    currentFile: FileSystemState.currentFile,
    isRoot: function (): boolean {
      return this.currentDirectory === FileSystemState.filesystem()
    },

    files: function (): TFile[] {
      return this.currentDirectory.files
        .slice()
        .sort();
    },

    directories: function (): TDirectory[] {
      return this.currentDirectory.directories
        .slice()
        .sort();
    }
  },
  methods: {
    openDirectory: FileSystemState.openDirectory,
    openFile: FileSystemState.openFile,

    close: function () {
      this.showFiles = false;
    }
  },
  created: function () {
    FileSystemState.init();
  },
  watch: {
    currentFile: function (value) {
      this.$emit('open', value);
    }
  }
})
</script>

<style scoped>
.files-container {
  border-radius: 0.3rem; 
  background-color: #191d21;
}

.min-width {
  min-width: 120px;
}

.open {
  color: #e02f72 !important;
}
</style>