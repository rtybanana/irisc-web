export type TFile = {
  name: string;
  isStatic: boolean;
  content?: string;
  writeable: boolean;
}

export type TDirectory = {
  name: string;
  parent?: TDirectory;
  directories: TDirectory[];
  files: TFile[];
  writeable: boolean;
}

export type TFileSystem = TDirectory & {
  parentDirectory?: TDirectory,
  openDirectory?: TDirectory,
  openFile?: TFile
}