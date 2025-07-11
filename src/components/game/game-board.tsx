
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swords, Check, HelpCircle, Trophy, Users } from 'lucide-react';
import type { GameRoom, Player, Difference } from '@/lib/types';
import { mockPlayers } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

interface GameBoardProps {
  room: GameRoom;
}

const PlayerInfo = ({ player, isCurrentUser }: { player: Player; isCurrentUser?: boolean }) => (
  <div className="flex flex-col items-center gap-2">
    <Avatar className={`h-16 w-16 border-4 ${isCurrentUser ? 'border-primary' : 'border-muted'}`}>
      <AvatarImage src={player.avatarUrl} data-ai-hint="avatar" />
      <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
    </Avatar>
    <span className="font-bold text-lg text-foreground">{player.name}</span>
    <Badge variant={isCurrentUser ? "default" : "secondary"}>{player.score} 分</Badge>
  </div>
);

export function GameBoard({ room }: GameBoardProps) {
  const { toast } = useToast();
  const [foundDifferences, setFoundDifferences] = useState<Difference[]>([]);
  
  // Use a mock current player for demonstration
  const currentPlayer = mockPlayers[0];

  const totalDifferences = room.differences?.length || 7;
  const progress = (foundDifferences.length / totalDifferences) * 100;
  const isGameWon = foundDifferences.length === totalDifferences;

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isGameWon) return; // Disable clicking if game is already won

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
    <div className="flex h-full flex-col items-center gap-6 p-4 md:p-6 bg-secondary/40 rounded-xl border">
      <div className="w-full text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">{room.name}</h1>
        <p className="text-muted-foreground mt-1">找到所有不同之处来赢得比赛！</p>
      </div>

      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-start gap-4 md:gap-8">
        {/* Left Player (Current) */}
        <div className="flex justify-center">
            <PlayerInfo player={currentPlayer} isCurrentUser />
        </div>
        
        {/* Center VS */}
        <div className="flex items-center h-full">
            <Swords className="h-10 w-10 text-muted-foreground" />
        </div>
        
        {/* Right Player (Opponent) */}
        <div className="flex justify-center">
            <PlayerInfo player={mockPlayers[1]} />
        </div>
      </div>
      
      {/* Game Area */}
      <Card className="w-full shadow-2xl overflow-hidden">
        <CardHeader className="bg-card-foreground/5 border-b p-4">
             <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-amber-400" />
                    <p className="font-bold text-2xl text-foreground">{`${foundDifferences.length} / ${totalDifferences}`}</p>
                </div>
                 <div className="w-full max-w-xs">
                    <Progress value={progress} className="h-4" />
                 </div>
                <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-muted-foreground" />
                    <p className="font-semibold text-lg text-muted-foreground">2 玩家</p>
                </div>
             </div>
        </CardHeader>
        <CardContent className="p-2 md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 relative" onClick={handleImageClick}>
              {[room.image1, room.image2].map((imgSrc, index) => (
                  <div key={index} className={`relative aspect-video w-full rounded-lg overflow-hidden border-4 ${isGameWon ? 'border-green-500' : 'border-transparent'} shadow-lg transition-all`}>
                      <Image src={imgSrc || ''} alt={`游戏图片 ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="kids drawing" className="cursor-crosshair" />
                      {/* Show found differences */}
                      {foundDifferences.map(diff => (
                          <div
                              key={diff.id}
                              className="absolute rounded-full border-4 border-yellow-400 bg-yellow-300/30 backdrop-blur-sm"
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
      
      {/* Actions */}
       <div className="flex justify-center gap-4 w-full">
            <Button size="lg" variant="outline" className="font-bold text-lg py-6 px-8" disabled={isGameWon}>
              <HelpCircle className="mr-3 h-6 w-6" />
              请求提示
            </Button>
            <Button size="lg" className="font-bold text-lg py-6 px-8 shadow-lg bg-green-600 hover:bg-green-700" disabled={!isGameWon}>
              <Check className="mr-3 h-6 w-6" />
              {isGameWon ? '挑战成功!' : '完成'}
            </Button>
        </div>
    </div>
  );
}

    