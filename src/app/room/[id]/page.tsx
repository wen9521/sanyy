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
          try {
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
          } catch(e) {
             console.error("Failed to parse game data from sessionStorage", e);
             setRoom(null); // Parsing error
          }
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
       <div className="flex h-screen flex-col">
        <Header />
        <main className="flex-1 p-4">
            <div className="flex h-full flex-col gap-4">
                <Skeleton className="h-20 w-full" />
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Skeleton className="h-full w-full" />
                    <Skeleton className="h-full w-full" />
                </div>
            </div>
        </main>
      </div>
    );
  }

  if (room === null) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1 overflow-hidden">
         <GameBoard room={room} />
      </main>
    </div>
  );
}
