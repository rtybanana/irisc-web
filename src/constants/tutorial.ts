export type TTutorialPage = {
  title: string,
  content: string
}

const basics1: TTutorialPage = {
  title: "Basics : 0",
  content: // html
  `\
    Welcome to <span class="irisc">iRISC</span>.

    Test content.
  `
}

export const pages = [
  basics1
]