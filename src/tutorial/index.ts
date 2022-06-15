// import { intro, basics } from "./tutorial";
export { TTutorialPage } from "./types";
import intro from "./intro";
import basics from "./basics";

export const tutorialPages = [
  ...intro,
  ...basics
];