// import { intro, basics } from "./tutorial";
export { TTutorialPage, TContentsLink } from "./types";
import intro from "./intro";
import basics from "./basics";
import intermediate from "./intermediate";
import { TTutorialPage, TContentsLink } from "./types";

const chapters: TTutorialPage[][] = [
  intro,
  basics,
  intermediate
]

export const tutorialPages = chapters
  .reduce((pages, chapter) => {
    return [...pages, ...chapter];
  }, []);

export const contentsPage = tutorialPages
  .map((page, index) => {
    let matches = [...page.title.matchAll(/([\d-]+)(?::\s)(.*)/g)][0];
    let chapter = chapters.findIndex(e => e.includes(page));

    let contentsLink: TContentsLink = {
      title: `${chapter}-${matches[1]} ${matches[2]}`,
      index: index
    };

    return contentsLink;
  });