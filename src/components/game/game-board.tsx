
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trophy, Users, CheckCircle, XCircle, Star } from 'lucide-react';
import type { GameRoom, Player, Difference } from '@/lib/types';
import { mockPlayers } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface GameBoardProps {
  room: GameRoom;
}

const PlayerChip = ({ player, isCurrentUser }: { player: Player; isCurrentUser?: boolean }) => (
    <div className={cn("flex items-center gap-3 rounded-full p-2 pr-4 transition-all duration-300", isCurrentUser ? 'bg-primary/10' : 'bg-muted')}>
        <Avatar className={cn('h-10 w-10 border-2', isCurrentUser ? 'border-primary' : 'border-transparent')}>
            <AvatarImage src={player.avatarUrl} data-ai-hint="avatar" />
            <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
            <h3 className="text-sm font-bold text-foreground">{player.name}</h3>
            <p className="text-xs font-semibold text-muted-foreground">{player.score} 分</p>
        </div>
    </div>
)

export function GameBoard({ room }: GameBoardProps) {
  const { toast } = useToast();
  const [foundDifferences, setFoundDifferences] = useState<Difference[]>([]);
  
  const currentPlayer = mockPlayers[0];
  const opponentPlayer = mockPlayers[1];

  const totalDifferences = room.differences?.length || 7;
  const progress = (foundDifferences.length / totalDifferences) * 100;
  const isGameWon = foundDifferences.length === totalDifferences;

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isGameWon) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clickedDifference = room.differences?.find(diff => {
      const distance = Math.sqrt(Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2));
      return distance < diff.radius;
    });

    if (clickedDifference && !foundDifferences.some(fd => fd.id === clickedDifference.id)) {
      setFoundDifferences(prev => [...prev, clickedDifference]);
       toast({
        title: (
            <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-bold">找到了！</span>
            </div>
        ),
        description: `太棒了！你发现了: ${clickedDifference.description || '一个不同之处'}`,
      });

      if(foundDifferences.length + 1 === totalDifferences) {
        toast({
            className: "border-green-500 bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
            title: (
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold">恭喜通关！</span>
                </div>
            ),
            description: "你找到了所有不同之处，太厉害了！",
        });
      }
    } else if (!clickedDifference) {
      toast({
        variant: "destructive",
        title: (
             <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                <span className="font-bold">找错了</span>
            </div>
        ),
        description: "这里好像没有不同哦，再仔细看看吧！",
      });
    }
  };

  return (
    <div className="flex h-full flex-col p-2 sm:p-4 lg:p-6">
        {/* Game Status Header */}
        <div className="mb-4 flex w-full flex-col gap-4 rounded-lg bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center justify-between gap-4 sm:justify-start">
                <PlayerChip player={currentPlayer} isCurrentUser />
                <div className="font-black text-2xl text-muted-foreground">VS</div>
                <PlayerChip player={opponentPlayer} />
            </div>
            <div className="flex w-full flex-1 items-center gap-4">
                <div className="flex items-center gap-2 text-amber-500">
                    <Trophy className="h-6 w-6" />
                    <p className="font-bold text-xl text-foreground">
                        <span className="text-2xl">{foundDifferences.length}</span>
                        <span className="text-muted-foreground">/{totalDifferences}</span>
                    </p>
                </div>
                <Progress value={progress} className="h-3 w-full" />
            </div>
        </div>

        {/* Game Board */}
        <div className="relative flex-1" onClick={handleImageClick}>
            <div className={cn(
                "grid h-full w-full grid-cols-1 gap-2 sm:gap-4 lg:grid-cols-2",
                isGameWon && "pointer-events-none"
                )}>
                {[room.image1, room.image2].map((imgSrc, index) => (
                    <div key={index} className="relative h-full w-full">
                        <Card className="relative h-full w-full overflow-hidden shadow-lg">
                             <Image 
                                src={imgSrc || ''} 
                                alt={`游戏图片 ${index + 1}`} 
                                layout="fill" 
                                objectFit="cover" 
                                className={cn("cursor-crosshair transition-all duration-500", isGameWon && "saturate-50")}
                                data-ai-hint="kids drawing" 
                             />
                        </Card>
                        {foundDifferences.map(diff => (
                            <div
                                key={diff.id}
                                className="absolute rounded-full border-4 border-yellow-400 bg-yellow-400/20 shadow-xl ring-4 ring-background/50 transition-all duration-300 animate-in fade-in zoom-in"
                                style={{
                                    left: `${diff.x}%`,
                                    top: `${diff.y}%`,
                                    width: `${diff.radius * 2}%`,
                                    height: `${diff.radius * 2}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
        
        {isGameWon && (
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="text-center text-white">
                    <Trophy className="mx-auto h-24 w-24 text-yellow-400 drop-shadow-lg" />
                    <h2 className="mt-4 font-headline text-5xl font-bold">挑战成功！</h2>
                    <p className="mt-2 text-lg text-yellow-100">你真是个找茬大师！</p>
                    <div className="mt-8 flex gap-4">
                         <Button size="lg" variant="default" asChild className="rounded-full font-bold">
                            <a href="/lobby/create">再来一局</a>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="rounded-full border-white/50 bg-white/10 font-bold text-white hover:bg-white/20 hover:text-white">
                            <a href="/lobby">返回大厅</a>
                        </Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
