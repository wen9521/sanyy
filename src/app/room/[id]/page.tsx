'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { GameBoard } from '@/components/game/game-board';
import { mockGameRooms } from '@/lib/mock-data';
import type { GameRoom } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

// In a real app, this would fetch data from a server.
async function getRoomData(roomId: string): Promise<GameRoom | undefined> {
  return mockGameRooms.find(room => room.id === roomId);
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;
  const [room, setRoom] = useState<GameRoom | null | undefined>(undefined);

  useEffect(() => {
    async function loadRoom() {
      if (roomId === 'ai-generated') {
        const newGameDataString = sessionStorage.getItem('newGameData');
        if (newGameDataString) {
          const gameData = JSON.parse(newGameDataString);
          const newRoom: GameRoom = {
            id: 'ai-generated',
            name: gameData.topic || "AI 生成的挑战",
            players: [],
            maxPlayers: 1,
            status: 'waiting',
            difficulty: '中等',
            image1: gameData.image1,
            image2: gameData.image2,
            differences: gameData.differences,
          };
          setRoom(newRoom);
          // Optional: clear it after use
          // sessionStorage.removeItem('newGameData');
        } else {
          // If there's no data, maybe redirect or show an error
          setRoom(null);
        }
      } else {
        const roomData = await getRoomData(roomId);
        setRoom(roomData);
      }
    }

    loadRoom();
  }, [roomId]);


  if (room === undefined) {
    return (
       <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <div className="container mx-auto p-8">
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (room === null) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto">
          <GameBoard room={room} />
        </div>
      </main>
    </div>
  );
}
