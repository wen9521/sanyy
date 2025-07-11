import type { GameRoom, Player } from './types';

export const mockPlayers: Player[] = [
  { id: '1', name: '玩家一', avatarUrl: 'https://placehold.co/100x100', score: 30 },
  { id: '2', name: '玩家二', avatarUrl: 'https://placehold.co/100x100', score: 50 },
  { id: '3', name: '玩家三', avatarUrl: 'https://placehold.co/100x100', score: 80 },
  { id: '4', name: '玩家四', avatarUrl: 'https://placehold.co/100x100', score: 10 },
];

const generateDifferences = (count = 7) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 80 + 10, // Avoid edges
        y: Math.random() * 80 + 10,
        radius: Math.random() * 3 + 4, // 4-7% radius
    }));
}


export const mockGameRooms: GameRoom[] = [
  {
    id: 'room-1',
    name: "卡通乐园",
    players: [mockPlayers[0], mockPlayers[1]],
    maxPlayers: 4,
    status: 'waiting',
    difficulty: '简单',
    image1: 'https://placehold.co/600x400',
    image2: 'https://placehold.co/600x400',
    differences: generateDifferences(5),
  },
  {
    id: 'room-2',
    name: '奇幻森林',
    players: [mockPlayers[2], mockPlayers[3], mockPlayers[0]],
    maxPlayers: 4,
    status: 'waiting',
    difficulty: '中等',
    image1: 'https://placehold.co/600x400',
    image2: 'https://placehold.co/600x400',
    differences: generateDifferences(7),
  },
  {
    id: 'room-3',
    name: '未来都市',
    players: [mockPlayers[1]],
    maxPlayers: 4,
    status: 'waiting',
    difficulty: '困难',
    image1: 'https://placehold.co/600x400',
    image2: 'https://placehold.co/600x400',
    differences: generateDifferences(10),
  },
  {
    id: 'room-4',
    name: '世界名画',
    players: mockPlayers,
    maxPlayers: 4,
    status: 'in-progress',
    difficulty: '专家',
    image1: 'https://placehold.co/600x400',
    image2: 'https://placehold.co/600x400',
    differences: generateDifferences(12),
  },
];
