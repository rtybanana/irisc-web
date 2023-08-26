import { init } from "./init";
import { cpu } from "./cpu";
import { interaction } from "./interaction";
import { memory } from "./memory";
import { snapshots } from "./snapshots";

export const actions = {
    ...init,
    ...cpu,
    ...interaction,
    ...memory,
    ...snapshots
}