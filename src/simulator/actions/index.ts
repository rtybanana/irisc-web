import { init } from "./init";
import { cpu } from "./cpu";
import { interaction } from "./interaction";
import { memory } from "./memory";
import { snapshots } from "./snapshots";
import { io } from "./io";
import { explainer } from './explainer';

export const actions = {
    ...init,
    ...cpu,
    ...memory,
    ...interaction,
    ...io,
    ...snapshots,
    ...explainer
}