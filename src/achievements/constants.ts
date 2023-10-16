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
  "Welcome to iRISC": { name: "Welcome to iRISC", description: "Welcome! Have an achievement on me.", rarity: Rarity.COMMON },
  "Edge Case Pro": { name: "Edge Case Pro", description: "Stumble upon a complicated barrel-shifter edge case.", rarity: Rarity.EPIC },
  "Spring Cleaning": { name: "Spring Cleaning", description: "Attempt to delete the entire disk.", rarity: Rarity.EPIC },
  "BSoD": { name: "BSoD", description: "Ah the computer's least favourite colour. Royal blue.", rarity: Rarity.EPIC },

  // tour related
  "Tour de Force!": { name: "Tour de Force!", description: "Complete the tour.", rarity: Rarity.COMMON }, 
  "Eh... close enough.": { name: "Eh... close enough.", description: "Have trouble following instructions.", rarity: Rarity.EPIC },

  // terminal
  "Flawless Execution": { name: "Flawless Execution", description: "Execute your first successful terminal command.", rarity: Rarity.COMMON },
  "Flawful Execution": { name: "Flawful Execution", description: "Execute your first unsuccessful terminal command.", rarity: Rarity.COMMON },
  "Where am I?": { name: "Where am I?", description: "Print the working directory in the terminal.", rarity: Rarity.UNCOMMON }, 
  "Purist": { name: "Purist", description: "Choose vim. You can't improve upon perfection.", rarity: Rarity.EPIC },

  // editor
  "Why are you squiggly?": { name: "Why are you squiggly?", description: "Hover over the error of your ways.", rarity: Rarity.COMMON },
  "Certified Debugger": { name: "Certified Debugger", description: "Pause execution on a breakpoint.", rarity: Rarity.COMMON },
  "QWOP": { name: "QWOP", description: "Attempt to run your program in an unrunnable state.", rarity: Rarity.UNCOMMON },
  "French Exit": { name: "French Exit", description: "Gracefully exit a program.", rarity: Rarity.UNCOMMON },
  "CPU Upgrade": { name: "CPU Upgrade", description: "Max out the simulator tick-rate configuration.", rarity: Rarity.UNCOMMON },

  // memory
  "Serious RAMifications": { name: "Serious RAMifications", description: "Experience your first segmentation fault. Oops.", rarity: Rarity.UNCOMMON },
  "RAM Upgrade": { name: "RAM Upgrade", description: "Max out the simulator memory configuration.", rarity: Rarity.UNCOMMON },
  "8'f\"+e'zz/9guuf>#l_hkW{": { name: "8'f\"+e'zz/9guuf>#l_hkW{", description: "Explore the contents of the RAM in ASCII format.", rarity: Rarity.RARE },



  // tutorial
  "Booooring": { name: "Booooring", description: "Skip 10 or more pages of the tutorial using the contents page.", rarity: Rarity.RARE }
}
