
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, HelpCircle, Trophy, Users, Award } from 'lucide-react';
import type { GameRoom, Player, Difference } from '@/lib/types';
import { mockPlayers } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useToast } from '@/hooks/use-toast';

interface GameBoardProps {
  room: GameRoom;
}

const PlayerInfo = ({ player, isCurrentUser }: { player: Player; isCurrentUser?: boolean }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-card p-4 shadow-lg w-full max-w-xs transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
    <Avatar className={`h-24 w-24 border-4 ${isCurrentUser ? 'border-primary' : 'border-muted'}`}>
      <AvatarImage src={player.avatarUrl} data-ai-hint="avatar" />
      <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
    <div className="text-center">
        <h3 className="text-xl font-bold text-foreground">{player.name}</h3>
        <div className="flex items-center gap-2 mt-2">
            <Award className={`h-6 w-6 ${isCurrentUser ? 'text-primary' : 'text-muted-foreground'}`}/>
            <p className="text-2xl font-black text-foreground">{player.score}<span className="text-sm font-medium text-muted-foreground ml-1">分</span></p>
        </div>
    </div>
  </div>
);

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
        title: "找到了！",
        description: `太棒了！你又发现了一个不同之处：${clickedDifference.description || ''}`,
      });
      if(foundDifferences.length + 1 === totalDifferences) {
        toast({
            variant: "default",
            className: "bg-green-500 text-white border-green-600",
            title: "恭喜通关！",
            description: "你找到了所有不同之处，真厉害！",
        });
      }
    } else if (!clickedDifference) {
      toast({
        variant: "destructive",
        title: "找错了",
        description: "这里好像没有不同哦，再仔细看看吧！",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
        <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold tracking-tighter text-primary sm:text-5xl font-headline">
            {room.name}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            在两张图片中找出所有不同之处，挑战你的观察力极限！
            </p>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-6 items-center">
            <div className="flex justify-center">
                <PlayerInfo player={currentPlayer} isCurrentUser />
            </div>

            <div className="flex flex-col gap-4">
                <Card className="w-full shadow-2xl overflow-hidden bg-card/80 backdrop-blur-sm border-2">
                    <CardHeader className="p-4 border-b">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Trophy className="h-6 w-6 text-amber-400" />
                                <p className="font-bold text-2xl text-foreground">{`${foundDifferences.length} / ${totalDifferences}`}</p>
                            </div>
                            <div className="flex-1 max-w-sm">
                                <Progress value={progress} className="h-3" />
                            </div>
                             <div className="flex items-center gap-3">
                                <Users className="h-6 w-6 text-muted-foreground" />
                                <p className="font-semibold text-lg text-muted-foreground">2 玩家</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 relative" onClick={handleImageClick}>
                            {[room.image1, room.image2].map((imgSrc, index) => (
                                <div key={index} className={`relative aspect-video w-full rounded-lg overflow-hidden border-4 ${isGameWon ? 'border-green-500' : 'border-transparent'} shadow-lg transition-all duration-500`}>
                                    <Image src={imgSrc || ''} alt={`游戏图片 ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="kids drawing" className="cursor-crosshair" />
                                    {foundDifferences.map(diff => (
                                        <div
                                            key={diff.id}
                                            className="absolute rounded-full border-4 border-yellow-400 bg-yellow-300/20 backdrop-blur-sm transition-all duration-300 animate-in fade-in zoom-in"
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
                    </CardContent>
                </Card>
                <div className="flex justify-center gap-4 w-full">
                    <Button size="lg" variant="outline" className="font-bold text-lg py-6 px-8" disabled={isGameWon}>
                        <HelpCircle className="mr-3 h-6 w-6" />
                        请求提示
                    </Button>
                     <Button size="lg" className="font-bold text-lg py-6 px-8 shadow-lg bg-primary hover:bg-primary/90" disabled={!isGameWon}>
                        <Check className="mr-3 h-6 w-6" />
                        {isGameWon ? '挑战成功!' : '完成'}
                    </Button>
                </div>
            </div>

            <div className="flex justify-center">
                <PlayerInfo player={opponentPlayer} />
            </div>
        </div>
    </div>
  );
}
