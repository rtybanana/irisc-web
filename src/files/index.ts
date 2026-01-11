import { actions, getters } from './state';
export type { TFileSystem, TDirectory, TFile } from './types';
export { helloWorldSample } from './constants';

export const FileSystemState = {
  ...actions, 
  ...getters
}
