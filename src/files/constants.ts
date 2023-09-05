// sampleFiles: [
//   "helloworld.s",
//   "typewriter.s",
//   "strlen.s",
//   "recursion.s",
//   "stackoverflow!.s",
//   "bubblesort.s",
//   "buggymess.s"
// ]


import { TDirectory, TFile } from "./types";

export const helloWorldSample: TFile = {
  name: "helloworld.s", 
  isStatic: true,
  writeable: false
}

// export const sampleFiles: TFile[] = [
//   helloWorldSample,
//   { name: "typewriter.s", isStatic: true },
//   { name: "strlen.s", isStatic: true },
//   { name: "recursion.s", isStatic: true },
//   { name: "stackoverflow!.s", isStatic: true },
//   { name: "bubblesort.s", isStatic: true },
//   { name: "buggymess.s", isStatic: true }
// ]

// export const 

export const sampleDirectories: TDirectory[] = [
  // user files placeholder
  { 
    name: "userfiles",
    directories: [],
    files: [
      {
        name: 'info.txt',
        isStatic: false,
        content: "// your files go here here :)",
        writeable: false
      }
    ],
    writeable: true
  },

  // samples
  {
    name: "samples",
    directories: [],
    files: [
      helloWorldSample,
      { name: "typewriter.s", isStatic: true, writeable: false },
      { name: "strlen.s", isStatic: true, writeable: false },
      { name: "recursion.s", isStatic: true, writeable: false },
      { name: "stackoverflow!.s", isStatic: true, writeable: false },
      { name: "bubblesort.s", isStatic: true, writeable: false },
      { name: "buggymess.s", isStatic: true, writeable: false }
    ],
    writeable: false
  }
]