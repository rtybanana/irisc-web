export enum Rarity {
  COMMON,
  UNCOMMON,
  RARE,
  EPIC
}

export type TAchievement = {
  name: string;
  description: string;
  rarity: Rarity;

  codeBased?: boolean;
  allowInTour?: boolean;
}

export type TAchievementState = {
  achieved: Set<TAchievement>;
  new: Set<TAchievement>;
}
