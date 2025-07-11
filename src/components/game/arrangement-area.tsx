import type { Card } from '@/lib/types';
import { PlayingCard } from './playing-card';
import { Badge } from '../ui/badge';

interface ArrangementAreaProps {
  arrangedHand: {
    front: Card[];
    middle: Card[];
    back: Card[];
  };
}

const HandRow = ({ title, cards, pointValue }: { title: string, cards: Card[], pointValue: string }) => (
  <div className="rounded-lg border bg-card/50 p-4">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-headline text-xl font-semibold">{title}</h3>
      <Badge variant="outline" className="text-lg">{pointValue}</Badge>
    </div>
    <div className="flex flex-wrap gap-2">
      {cards.map((card, index) => (
        <PlayingCard key={index} suit={card.suit} rank={card.rank} className="w-20" />
      ))}
    </div>
  </div>
);

export function ArrangementArea({ arrangedHand }: ArrangementAreaProps) {
  return (
    <div className="mt-8 space-y-6">
      <HandRow title="头道" cards={arrangedHand.front} pointValue="3 张牌" />
      <HandRow title="中道" cards={arrangedHand.middle} pointValue="5 张牌" />
      <HandRow title="尾道" cards={arrangedHand.back} pointValue="5 张牌" />
    </div>
  );
}
