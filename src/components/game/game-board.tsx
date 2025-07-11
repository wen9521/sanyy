'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swords, Check, HelpCircle } from 'lucide-react';
import type { GameRoom, Player, Difference } from '@/lib/types';
import { mockPlayers } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useToast } from '@/hooks/use-toast';

interface GameBoardProps {
  room: GameRoom;
}

const OtherPlayer = ({ player }: { player: Player }) => (
    <div className="flex flex-col items-center gap-2">
        <Avatar>
            <AvatarImage src={player.avatarUrl} data-ai-hint="avatar" />
            <AvatarFallback>{player.name.substring(0,2)}</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-sm">{player.name}</span>
        <Progress value={player.score} className="w-20 h-2" />
    </div>
)

export function GameBoard({ room }: GameBoardProps) {
  const { toast } = useToast();
  const [foundDifferences, setFoundDifferences] = useState<Difference[]>([]);

  const totalDifferences = room.differences?.length || 7;
  const progress = (foundDifferences.length / totalDifferences) * 100;

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
        description: "你成功找到了一个不同之处。",
      });
      if(foundDifferences.length + 1 === totalDifferences) {
        toast({
            title: "恭喜！",
            description: "你找到了所有不同之处！",
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
    <div className="flex h-full flex-col gap-8 p-4 md:p-8">
      {/* Players Info */}
      <div className="relative grid grid-cols-3 items-center justify-items-center gap-4 rounded-lg border-2 border-dashed bg-card/30 p-4">
        {mockPlayers.slice(1, 4).map(p => <OtherPlayer key={p.id} player={p} />)}
      </div>

      {/* Game Area */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
             <h2 className="font-headline text-2xl font-semibold">{room.name}</h2>
             <div className="text-right">
                <p className="font-semibold text-lg">{`${foundDifferences.length} / ${totalDifferences}`}</p>
                <p className="text-sm text-muted-foreground">已找到</p>
             </div>
          </div>
         <Progress value={progress} className="mb-6 h-3" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative" onClick={handleImageClick}>
              {[room.image1, room.image2].map((imgSrc, index) => (
                  <div key={index} className="relative aspect-video w-full cursor-crosshair rounded-lg overflow-hidden border">
                      <Image src={imgSrc || ''} alt={`游戏图片 ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="kids drawing" />
                      {/* Show found differences */}
                      {foundDifferences.map(diff => (
                          <div
                              key={diff.id}
                              className="absolute rounded-full border-4 border-accent bg-accent/20"
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

          <div className="mt-6 flex justify-center gap-4">
            <Button size="lg" variant="outline" className="font-bold">
              <HelpCircle className="mr-2 h-5 w-5" />
              请求提示
            </Button>
            <Button size="lg" className="font-bold shadow-lg" disabled={foundDifferences.length < totalDifferences}>
              <Check className="mr-2 h-5 w-5" />
              完成
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
