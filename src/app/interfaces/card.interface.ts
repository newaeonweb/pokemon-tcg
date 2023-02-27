export interface Ability {
  name: string;
  text: string;
  type: string;
}

export interface Attack {
  name: string;
  cost: string[];
  convertedEnergyCost: number;
  damage: string;
  text: string;
}

export interface Weakness {
  type: string;
  value: string;
}

export interface Legalities {
  unlimited: string;
}

export interface Images {
  symbol: string;
  logo: string;
}

export interface Set {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: Legalities;
  ptcgoCode: string;
  releaseDate: string;
  updatedAt: string;
  images: Images;
}

export interface Legalities2 {
  unlimited: string;
}

export interface Images2 {
  small: string;
  large: string;
}

export interface Normal {
  low: number;
  mid: number;
  high: number;
  market: number;
  directLow: number;
}

export interface ReverseHolofoil {
  low: number;
  mid: number;
  high: number;
  market: number;
  directLow: number;
}

export interface Prices {
  normal: Normal;
  reverseHolofoil: ReverseHolofoil;
}

export interface Tcgplayer {
  url: string;
  updatedAt: string;
  prices: Prices;
}

export interface Prices2 {
  averageSellPrice: number;
  lowPrice: number;
  trendPrice: number;
  reverseHoloSell: number;
  reverseHoloLow: number;
  reverseHoloTrend: number;
  lowPriceExPlus: number;
  avg1: number;
  avg7: number;
  avg30: number;
  reverseHoloAvg1: number;
  reverseHoloAvg7: number;
  reverseHoloAvg30: number;
}

export interface Cardmarket {
  url: string;
  updatedAt: string;
  prices: Prices2;
}

export interface Card {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  level: string;
  hp: string;
  types: string[];
  evolvesFrom: string;
  abilities: Ability[];
  attacks: Attack[];
  weaknesses: Weakness[];
  retreatCost: string[];
  convertedRetreatCost: number;
  set: Set;
  number: string;
  artist: string;
  rarity: string;
  nationalPokedexNumbers: number[];
  legalities: Legalities2;
  images: Images2;
  tcgplayer: Tcgplayer;
  cardmarket: Cardmarket;
}
