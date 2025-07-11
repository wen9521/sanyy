'use client';

import { Swords, Check, Shuffle } from 'lucide-react';
import type { GameRoom, Player } from '@/lib/types';
import { mockHand, arrangedHand, mockPlayers } from '@/lib/mock-data';
import { PlayerHand } from './player-hand';
import { ArrangementArea } from './arrangement-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface GameBoardProps {
  room: GameRoom;
}

const OtherPlayer = ({ player, position }: { player: Player; position: string }) => (
    <div className={`absolute ${position}`}>
        <div className="flex flex-col items-center gap-2">
            <Avatar>
                <AvatarImage src={player.avatarUrl} />
                <AvatarFallback>{player.name.substring(0,2)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm">{player.name}</span>
            <Badge variant="secondary">Ready</Badge>
        </div>
    </div>
)

export function GameBoard({ room }: GameBoardProps) {
  // In a real app, the current player would be identified via auth state.
  const otherPlayers = mockPlayers.slice(1,4);

  return (
    <div className="flex h-full flex-col gap-8 p-4 md:p-8">
      {/* Other Players */}
      <div className="relative h-24 rounded-lg border-2 border-dashed bg-card/30">
        <OtherPlayer player={otherPlayers[0]} position="left-1/4 top-1/2 -translate-y-1/2" />
        <OtherPlayer player={otherPlayers[1]} position="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <OtherPlayer player={otherPlayers[2]} position="right-1/4 top-1/2 -translate-y-1/2" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Swords className="h-10 w-10 text-muted-foreground/50" />
        </div>
      </div>

      {/* Main Player Area */}
      <Card className="flex-1">
        <CardContent className="p-6">
          <PlayerHand hand={mockHand} />

          <div className="my-10 border-t-2 border-dashed"></div>

          <ArrangementArea arrangedHand={arrangedHand} />

          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" variant="outline" className="font-bold">
              <Shuffle className="mr-2 h-5 w-5" />
              Auto-Arrange
            </Button>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold shadow-lg">
              <Check className="mr-2 h-5 w-5" />
              Confirm Hand
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
