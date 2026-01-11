import { FileSystemError, NotImplementedError } from "@/interpreter";
import { TFileSystem, TFile, TDirectory } from "./types";
import Vue from 'vue';
import { sampleDirectories } from "./constants";

export const filesystem = Vue.observable<TFileSystem>({
  name: "",
  directories: [],
  files: [],
  writeable: true,

  parentDirectory: undefined,
  openDirectory: undefined,
  openFile: undefined
});

export const getters = {
  filesystem: () => filesystem,
  currentDirectory: () => filesystem.openDirectory ?? filesystem,
  currentFile: () => filesystem.openFile,

  pwd: function () {
    let directory = this.currentDirectory();
    let path = [directory.name];

    while (directory.parent) {
      path = [directory.parent.name, ...path];
      directory = directory.parent;
    }

    let pwd = path.join('/');
    if (pwd === "") pwd = '/';

    return pwd;
  }
}

export const actions = {
  init: function () {
    filesystem.openDirectory = filesystem;

    // set sample directories and connect to parent
    filesystem.directories = sampleDirectories;
    filesystem.directories.forEach(e => e.parent = filesystem);
    filesystem.directories.forEach(d => d.files.forEach(f => f.parent = d));

    this.loadLocal();
    this.reopen();
  },

  loadLocal: function () {
    const keys = Object.keys(localStorage)
      .filter(e => e.startsWith('/'))
      .sort();

    // split paths and create directories
    keys.forEach(key => {
      const tokens = key.split('/').slice(1);

      let currentDir = filesystem;
      tokens.forEach((token, i) => {
        let isDir = true;
        if (i === tokens.length - 1) isDir = false;

        if (isDir) {
          // add new directory if none exists
          let nextDir = currentDir.directories.find(e => e.name === token);
          if (!nextDir) {
            nextDir = {
              name: token,
              parent: currentDir,
              files: [],
              directories: [],
              writeable: true
            };

            currentDir.directories.push(nextDir);
          }
          
          currentDir = nextDir;
        }
        else {
          currentDir.files.push({
            name: token,
            parent: currentDir,
            static: false,
            content: localStorage.getItem(key) ?? undefined,
            writeable: true
          });
        }
      });
    });
  },

  reopen: function () {
    try {
      const openPath = localStorage.getItem('openFile') ?? "";
      const target = this.resolvePath(openPath);

      if (isDirectory(target)) throw new FileSystemError("");

      this.openDirectory(target.parent!);
      this.openFile(target);
    }
    catch (e) {
      console.trace();
      console.error("Could not reopen file from local storage.");
    }
  },

  openFile: async function (file: TFile) {
    if (!file.content && file.static) {
      file.content = await fetch(`samples/${file.name}`)
        .then(res => res.text())
        .then(code => {
          return code;
        });
    }
    
    const path = fullPath(file);
    if (path === null) throw new FileSystemError("Could not find file in local directory tree.");

    localStorage.setItem('openFile', path);
    filesystem.openFile = file;
  },

  openDirectory: function (directory: TDirectory) {
    filesystem.parentDirectory = filesystem.openDirectory;
    filesystem.openDirectory = directory;
  },

  cd: function (param: string) {
    const target = this.resolvePath(param);

    if (!isDirectory(target)) throw new FileSystemError("Argument is not a valid directory.");
    this.openDirectory(target!);
  },

  textEdit: function (param: string) {
    const target = this.resolvePath(param);

    if (isDirectory(target)) throw new FileSystemError("Cannot text-edit a directory.");
    this.openFile(target);
  },

  resolvePath(path: string): TDirectory | TFile {
    let current: TDirectory | TFile = filesystem.openDirectory!;
    if (path.startsWith('/')) {
      current = filesystem;
    }

    const tokens = path.split('/').filter(e => e !== '');
    tokens.forEach((token, i) => {
      let next: TDirectory | TFile | undefined;

      if (token === '..') next = (current as TDirectory).parent;
      else if (token === '.') next = current;
      else {
        next = (current as TDirectory).directories.find(e => e.name === token);
        if (!next && i === tokens.length - 1) {
          next = (current as TDirectory).files.find(e => e.name === token);
        }
      }

      if (!next) throw new FileSystemError("Could not resolve path.");
      current = next;
    });

    return current;
  },

  addDirectory: function (directory: TDirectory, parent: TDirectory) {
    if (parent.directories.includes(directory)) return;   // already exists

    directory.parent = parent;
    parent.directories.push(directory);
  },

  newFile: function (name: string, content: string): TFile {
    return {
      name, 
      content, 
      writeable: true,
      static: false
    };
  },

  addFile: function (file: TFile, parent: TDirectory) {
    if (parent.files.some(e => e.name === file.name)) return;   // already exists

    file.parent = parent;
    parent.files.push(file);
  },

  save: function (file: TFile, content: string) {
    if (!file.writeable) throw new FileSystemError("Permission denied.");

    const path = fullPath(file);
    if (path === null) throw new FileSystemError("Could not find file in local directory tree.");
    
    file.content = content;
    localStorage.setItem(path, file.content ?? "");
  }
}

function fullPath(file: TFile): string | null {
  const pathArr = [file.parent?.name, file.name];

  let parent = file.parent
  while (parent?.parent) {
    pathArr.unshift(parent.parent.name);
    parent = parent.parent;
  }

  return pathArr.join('/');
}

// function depthFirstSearch(directory: TDirectory, file: TFile): TDirectory[] {
//   if (!directory) {
//     return [];
//   }
  
//   if (directory.files.includes(file)) {
//     return [directory];
//   }

//   for (let dir of directory.directories) {
//     const foundPath = depthFirstSearch(dir, file);
//     if (foundPath.length > 0) return [directory, ...foundPath];
//   }

//   return [];
// }


const isDirectory = (x: TFile | TDirectory | undefined): x is TDirectory => (x as TDirectory)?.files !== undefined;