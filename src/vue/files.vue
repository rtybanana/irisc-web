<template>
  <div 
    v-if="currentDirectory"
    class="files-container p-1" 
    :class="showFiles ? 'min-width' : ''"
    v-click-outside="close"
  >
    <a v-if="!forceShow && !showFiles" class="link clickable" style="color: #f9e1b3;" @click="showFiles = true">files</a>
    <div v-else>
      <div class="mb-1">
        /{{ currentDirectory.name }}
      </div>

      <div v-for="directory in directories" :key="directory.name">
        <a class="link text-grey clickable" @click="openDirectory(directory)"><i>{{ directory.name }}/</i></a>
      </div>

      <template v-if="!hideFiles">
        <div v-for="file in files" :key="file.name">
          <a 
            class="link text-white clickable" 
            :class="{ open: !selectedFile && currentFile === file, selected: selectedFile === file }"
            @click="openFile(file)"
          >
            {{ file.name }}
          </a>
        </div>
      </template>

      <div v-if="currentDirectory.parent">
        <a class="link text-grey clickable" @click="openDirectory(currentDirectory.parent)">..</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { FileSystemState } from '@/files';
import { TFile, TDirectory } from '@/files/types';

export default Vue.extend({
  name: "files",
  props: {
    forceShow: Boolean,
    hideFiles: Boolean,
    preventDefaultFile: Boolean,
    preventDefaultDirectory: Boolean,
    selectedFile: Object
  },
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
    openDirectory: function (directory: TDirectory) {
      if (this.preventDefaultDirectory) {
        this.$emit('open:directory', directory);
        return;
      }

      FileSystemState.openDirectory(directory);
    },

    openFile: function (file: TFile) {
      if (this.preventDefaultFile) {
        this.$emit('open:file', file);
        return;
      }

      FileSystemState.openFile(file);
    },

    close: function () {
      this.showFiles = false;
    }
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

.open, .selected {
  color: #e02f72 !important;
}
</style>