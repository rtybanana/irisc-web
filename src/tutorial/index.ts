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
    let chapter = chapters.findIndex(e => e.includes(page));
    let pageNum = /(?:(?<=\s))(.+)(?=:)/.exec(page.title)!;
    let pageName = /(?:(?<=: ))(.*)/.exec(page.title)!;

    let contentsLink: TContentsLink = {
      title: `${chapter}-${pageNum[0]} ${pageName[0]}`,
      index: index
    };

    return contentsLink;
  });