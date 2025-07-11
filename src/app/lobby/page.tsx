import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Users, Eye, Star } from 'lucide-react';
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
import { cn } from '@/lib/utils';

const difficultyMap: { [key: string]: { label: string; color: string; stars: number } } = {
  '简单': { label: '简单', color: 'bg-green-500', stars: 1 },
  '中等': { label: '中等', color: 'bg-yellow-500', stars: 2 },
  '困难': { label: '困难', color: 'bg-orange-500', stars: 3 },
  '专家': { label: '专家', color: 'bg-red-500', stars: 4 },
};

export default function LobbyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
                <h1 className="font-headline text-4xl font-bold tracking-tighter text-foreground">游戏大厅</h1>
                <p className="mt-1 text-muted-foreground">选择一个房间加入，或创建你自己的游戏！</p>
            </div>
            <Button asChild size="lg" className="font-bold shadow-lg transition-transform hover:scale-105">
              <Link href="/lobby/create">
                <PlusCircle className="mr-2 h-5 w-5" />
                创建新游戏
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockGameRooms.map((room, index) => {
              const difficulty = difficultyMap[room.difficulty] || difficultyMap['中等'];
              return (
                 <Card key={room.id} className={cn("flex animate-deal-in flex-col overflow-hidden border-2 border-transparent bg-card transition-all hover:border-primary hover:shadow-2xl hover:-translate-y-1")} style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader className="p-0">
                        <div className="relative h-40 w-full">
                            <Image src={room.image1 || ''} alt={room.name} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" data-ai-hint="gameplay abstract" />
                             <Badge variant={room.status === 'waiting' ? 'default' : 'secondary'} className="absolute right-3 top-3 shadow-lg">
                                {room.status === 'waiting' ? '等待中' : '进行中'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-grow flex-col p-4">
                        <CardTitle className="font-headline text-xl">{room.name}</CardTitle>
                        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Star key={i} className={cn("h-4 w-4", i < difficulty.stars ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground/50')} />
                                ))}
                            </div>
                            <div className="flex items-center">
                                <Users className="mr-1.5 h-4 w-4" />
                                <span>{`${room.players.length} / ${room.maxPlayers}`}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                        <Button asChild className="w-full font-semibold" variant={room.status === 'waiting' ? "default" : "secondary"} disabled={room.status !== 'waiting'}>
                            <Link href={`/room/${room.id}`}>
                                {room.status === 'waiting' ? '加入游戏' : '游戏中'}
                            </Link>
                        </Button>
                    </CardFooter>
                 </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
