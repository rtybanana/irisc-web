import { actions } from "./actions"
import { getters } from "./getters"
export type { TSimulatorSnapshot } from './types';

export const SimulatorState = {
  ...actions,
  ...getters
}
