export interface Difference {
  id: number;
  x: number; // percentage
  y: number; // percentage
  radius: number; // percentage
}

export interface Player {
  id: string;
  name: string;
  avatarUrl: string;
  score?: number;
}

export interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  status: 'waiting' | 'in-progress' | 'finished';
  difficulty: '简单' | '中等' | '困难' | '专家';
  image1?: string;
  image2?: string;
  differences?: Difference[];
}
