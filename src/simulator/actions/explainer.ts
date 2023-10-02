import { opExplain } from "@/constants";
import { state } from "../state";

export const explainer = {
  initExplanation: function () {
    state.explanation = {
      default: "Currently unable to explain this state change. Coming soon."
    }
  }
}