import type { GameRoom, Player, Card, Suit, Rank } from './types';

export const mockPlayers: Player[] = [
  { id: '1', name: '玩家一', avatarUrl: 'https://placehold.co/100x100' },
  { id: '2', name: '玩家二', avatarUrl: 'https://placehold.co/100x100' },
  { id: '3', name: '玩家三', avatarUrl: 'https://placehold.co/100x100' },
  { id: '4', name: '玩家四', avatarUrl: 'https://placehold.co/100x100' },
];

export const mockGameRooms: GameRoom[] = [
  {
    id: 'room-1',
    name: "新手好运",
    players: [mockPlayers[0], mockPlayers[1]],
    maxPlayers: 4,
    status: 'waiting',
  },
  {
    id: 'room-2',
    name: '高额赌注',
    players: [mockPlayers[2], mockPlayers[3], mockPlayers[0]],
    maxPlayers: 4,
    status: 'waiting',
  },
  {
    id: 'room-3',
    name: '休闲牌桌',
    players: [mockPlayers[1]],
    maxPlayers: 4,
    status: 'waiting',
  },
    {
    id: 'room-4',
    name: '职业联赛',
    players: mockPlayers,
    maxPlayers: 4,
    status: 'in-progress',
  },
];

const SUITS: Suit[] = ['SPADES', 'HEARTS', 'DIAMONDS', 'CLUBS'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

const fullDeck: Card[] = SUITS.flatMap(suit => 
  RANKS.map(rank => ({ suit, rank }))
);

export const generateHand = (): Card[] => {
  const shuffled = fullDeck.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 13);
};

export const mockHand: Card[] = generateHand();

// A simple pre-arranged hand for display purposes
export const arrangedHand = {
    front: mockHand.slice(0, 3),
    middle: mockHand.slice(3, 8),
    back: mockHand.slice(8, 13),
}
