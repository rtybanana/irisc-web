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
    const chapter = chapters.findIndex(e => e.includes(page));
    const pageNum = /(?:(?<=\s))(.+)(?=:)/.exec(page.title)!;
    const pageName = /(?:(?<=: ))(.*)/.exec(page.title)!;

    const contentsLink: TContentsLink = {
      title: `${chapter}-${pageNum[0]} ${pageName[0]}`,
      index: index
    };

    return contentsLink;
  });