import { Rarity, TAchievement } from "./types";

export const rarityNameMap: Record<Rarity, string> = {
  [Rarity.COMMON]: "Common",
  [Rarity.UNCOMMON]: "Uncommon",
  [Rarity.RARE]: "Rare",
  [Rarity.EPIC]: "Epic"
}

export const rarityClassMap: Record<Rarity, string> = {
  [Rarity.COMMON]: "common",
  [Rarity.UNCOMMON]: "uncommon",
  [Rarity.RARE]: "rare",
  [Rarity.EPIC]: "epic"
}

export const achievementMap: Record<string, TAchievement> = {
  // misc
  "Welcome to iRISC": { name: "Welcome to iRISC", description: "Welcome! Have an achievement on me.", rarity: Rarity.COMMON, allowInTour: true },
  "Edge Case Pro": { name: "Edge Case Pro", description: "Stumble upon a complicated barrel-shifter edge case.", rarity: Rarity.EPIC },
  "Do you know who I am?": { name: "Do you know who I am?", description: "Permission denied.", rarity: Rarity.EPIC },
  "Spring Cleaning": { name: "Spring Cleaning", description: "Foolishly attempt to delete the entire disk.", rarity: Rarity.EPIC },
  "BSoD": { name: "BSoD", description: "Wait, I thought this was a UNIX system?", rarity: Rarity.EPIC },

  // tour
  "Tour de Force!": { name: "Tour de Force!", description: "Complete the tour.", rarity: Rarity.COMMON, allowInTour: true }, 
  "Eh... close enough.": { name: "Eh... close enough.", description: "Have trouble following instructions.", rarity: Rarity.EPIC, allowInTour: true },

  // terminal
  "Flawless Execution": { name: "Flawless Execution", description: "Execute your first successful terminal command.", rarity: Rarity.COMMON },
  "Flawful Execution": { name: "Flawful Execution", description: "Execute your first unsuccessful terminal command.", rarity: Rarity.COMMON },
  "You are here": { name: "You are here", description: "Print the working directory in the terminal.", rarity: Rarity.UNCOMMON }, 
  "Purist": { name: "Purist", description: "Choose vim. You can't improve upon perfection.", rarity: Rarity.EPIC },

  // editor
  "Why are you squiggly?": { name: "Why are you squiggly?", description: "Hover over the error of your ways.", rarity: Rarity.COMMON },  
  "QWOP": { name: "QWOP", description: "Attempt to run your program in an unrunnable state.", rarity: Rarity.UNCOMMON },
  "CPU Upgrade": { name: "CPU Upgrade", description: "Max out the simulator tick-rate configuration.", rarity: Rarity.UNCOMMON },
  "Reverse, reverse!": { name: "Reverse, reverse!", description: "Step backwards using the debugger.", rarity: Rarity.UNCOMMON },

  // snapshots
  "\"Great Scott!\"": { name: "'Great Scott!'", description: "Travel back to the past using the snapshot history.", rarity: Rarity.COMMON },
  "Back to the future!": { name: "Back to the future!", description: "Travel forward in time using the snapshot history.", rarity: Rarity.UNCOMMON },
  "The dawn of time...": { name: "The dawn of time...", description: "Travel way back to the base state using the snapshot history.", rarity: Rarity.RARE },

  // memory
  "Serious RAMifications": { name: "Serious RAMifications", description: "Experience your first segmentation fault. Oops.", rarity: Rarity.UNCOMMON, codeBased: true },
  "RAM Upgrade": { name: "RAM Upgrade", description: "Max out the simulator memory configuration.", rarity: Rarity.UNCOMMON },
  "8'f\"+e'zz/9guuf>#l_hkW{": { name: "8'f\"+e'zz/9guuf>#l_hkW{", description: "Explore the contents of the RAM in ASCII format.", rarity: Rarity.RARE },
  "nop": { name: "nop", description: "Discover a curious instruction at the end of your assembled program that you didn't write.", rarity: Rarity.EPIC },

  // runner
  "Debugger in Training": { name: "Debugger in Training", description: "Add your first breakpoint.", rarity: Rarity.COMMON, allowInTour: true },
  "Certified Debugger": { name: "Certified Debugger", description: "Pause execution on a breakpoint.", rarity: Rarity.UNCOMMON },
  "French Exit": { name: "French Exit", description: "Gracefully exit a program.", rarity: Rarity.UNCOMMON, codeBased: true },
  "Alexandria": { name: "Alexandria", description: "Include and call a C Standard Library function.", rarity: Rarity.RARE, codeBased: true },

  // TODO: find a way to determine that an executed instruction has an explicit 'al' condition suffix
  // "A Mother's Love": { name: "A Mother's Love", description: "Execute an instruction with a totally redundant condition suffix.", rarity: Rarity.EPIC, codeBased: true },

  // TODO: find a way to know if a branch is looping or entering a function (potentially hard)
  // "Loop-de-loop": { name: "Loop-de-loop", description: "Run a program containing at least one loop.", rarity: Rarity.UNCOMMON },

  // tutorial
  "Booooring": { name: "Booooring", description: "Skip 10 or more pages of the tutorial using the contents page.", rarity: Rarity.UNCOMMON }
}
