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

    this.loadLocal();
  },

  loadLocal: function () {
    let keys = Object.keys(localStorage)
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
            isStatic: false,
            content: localStorage.getItem(key) ?? undefined,
            writeable: true
          });
        }
      });
    });
  },

  openFile: async function (file: TFile) {
    if (!file.content && file.isStatic) {
      file.content = await fetch(`samples/${file.name}`)
        .then(res => res.text())
        .then(code => {
          return code;
        });
    }
    
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
    console.log(tokens);

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
    directory.parent = parent;
    parent.directories.push(directory);
  },

  addFile: function (file: TFile, parent: TDirectory) {
    parent.files.push(file);
  },

  save: function (file: TFile, parent: TDirectory) {
    if (!file.writeable) throw new FileSystemError("Permission denied.");

    this.addFile(file, parent);

    const fullPath = this.fullPath(file);
    if (fullPath === null) throw new FileSystemError("Could not find file in local directory tree.");
    
    localStorage.setItem(fullPath, file.content ?? "");
  },

  fullPath: function (file: TFile): string | null {
    const dirPath = depthFirstSearch(filesystem, file);
    if (dirPath.length === 0) return null;

    return dirPath
      .map(e => e.name)
      .concat([file.name])
      .join('/');
  },

  
}

function depthFirstSearch(directory: TDirectory, file: TFile): TDirectory[] {
  if (!directory) {
    return [];
  }
  
  if (directory.files.includes(file)) {
    return [directory];
  }

  for (let dir of directory.directories) {
    const foundPath = depthFirstSearch(dir, file);
    if (foundPath.length > 0) return [directory, ...foundPath];
  }

  return [];
}


const isDirectory = (x: TFile | TDirectory | undefined): x is TDirectory => (x as TDirectory)?.files !== undefined;