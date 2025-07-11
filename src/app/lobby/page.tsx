import Link from 'next/link';
import { PlusCircle, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { mockGameRooms } from '@/lib/mock-data';

const statusMap: { [key: string]: string } = {
  waiting: '等待中',
  'in-progress': '进行中',
  finished: '已结束',
};

export default function LobbyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-headline text-4xl font-bold">游戏大厅</h1>
            <Button size="lg" className="font-bold shadow-md">
              <PlusCircle className="mr-2 h-5 w-5" />
              创建新游戏
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockGameRooms.map((room) => (
              <Card key={room.id} className="flex flex-col transition-all hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{room.name}</CardTitle>
                  <CardDescription>游戏ID: {room.id}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span>{`${room.players.length} / ${room.maxPlayers} 玩家`}</span>
                    </div>
                     <div className="flex items-center">
                       <Eye className="mr-2 h-4 w-4" />
                       <span>{room.difficulty}</span>
                     </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full font-semibold" variant="default" disabled={room.status !== 'waiting'}>
                    <Link href={`/room/${room.id}`}>加入游戏</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
