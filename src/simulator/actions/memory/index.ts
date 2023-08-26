import { common } from "./common"
import { text } from "./text";
import { data } from "./data";
import { heap } from "./heap";
import { stack } from "./stack";

export const memory = {
    ...common,
    ...text,
    ...data,
    ...heap,
    ...stack
}