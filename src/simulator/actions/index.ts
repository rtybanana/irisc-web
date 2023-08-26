import { init } from "./init";
import { cpu } from "./cpu";
import { interaction } from "./interaction";
import { runtime } from "./runtime";
import { snapshots } from "./snapshots";

export const actions = {
    ...init,
    ...cpu,
    ...interaction,
    ...runtime,
    ...snapshots
}