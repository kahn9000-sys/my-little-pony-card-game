export type CardType = 'Character' | 'Scene' | 'Event & Item' | 'Story';

export interface Card {
  id: string;
  code: string;
  name: string;
  nameZh: string;
  rarity: string;
  rarityName: string;
  rarityNameZh: string;
  rarityId: string;
  sortOrder: number;
  character: string;
  characterZh: string;
  type: CardType;
  typeZh: string;
  image: string;
  backImage: string;
  sourceImage: string;
  sourceBackImage: string;
  dimensions: {
    metadata: { width: number; height: number };
    actual: { width: number; height: number } | null;
    matchesMetadata: boolean;
  };
}

export interface Catalog {
  collection: {
    id: string;
    title: string;
    subtitle: string;
    productName: string;
    cardCount: number;
    source: string;
    visualReference: string;
  };
  rarityOrder: string[];
  characters: string[];
  cards: Card[];
}
