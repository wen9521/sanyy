export type Suit = 'SPADES' | 'HEARTS' | 'DIAMONDS' | 'CLUBS';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface Player {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  status: 'waiting' | 'in-progress' | 'finished';
}
