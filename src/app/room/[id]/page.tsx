import { GameBoard } from '@/components/game/game-board';
import { mockGameRooms } from '@/lib/mock-data';

export async function generateStaticParams() {
  return mockGameRooms.map(room => ({
    id: room.id,
  }));
}

export default function RoomPage({ params }: { params: { id: string } }) {
  const room = mockGameRooms.find(room => room.id === params.id);

  if (!room) {
    return <div>房间未找到</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{room.name}</h1>
      <GameBoard differences={room.differences} imageUrl={room.image1} />
    </div>
  );
}
