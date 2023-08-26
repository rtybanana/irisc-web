import { actions } from "./actions"
import { getters } from "./getters"
export { TSimulatorSnapshot } from './types';

export const SimulatorState = {
  ...actions,
  ...getters
}
