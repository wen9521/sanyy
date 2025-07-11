import { Header } from '@/components/layout/header';
import { GameBoard } from '@/components/game/game-board';
import { mockGameRooms } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import type { GameRoom } from '@/lib/types';

interface RoomPageProps {
  params: {
    id: string;
  };
}

// In a real app, this would fetch data from a server.
async function getRoomData(roomId: string): Promise<GameRoom | undefined> {
  return mockGameRooms.find(room => room.id === roomId);
}

export default async function RoomPage({ params }: RoomPageProps) {
  const room = await getRoomData(params.id);

  if (!room) {
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
