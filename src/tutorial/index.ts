// import { intro, basics } from "./tutorial";
export { TTutorialPage } from "./types";
import intro from "./intro";
import basics from "./basics";
import intermediate from "./intermediate";

export const tutorialPages = [
  ...intro,
  ...basics,
  ...intermediate
];