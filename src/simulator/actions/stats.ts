import { BranchNode } from "@/syntax";
import { AchievementState } from "@/achievements";

type TLoopCount = {
    instruction?: BranchNode;
    count: number;
}

export const stats = {
    loopCount: { instruction: undefined, count: 0 } as TLoopCount,

    countLoops: function (branch: BranchNode) {
        if (branch === this.loopCount.instruction) {
            this.loopCount.count++;

            if (this.loopCount.count == 5) {
                AchievementState.achieve("Loop-de-loop");
            }

            return;
        }

        this.loopCount = { instruction: branch, count: 0 };
    }
}