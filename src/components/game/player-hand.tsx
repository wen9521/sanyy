'use client';

import type { Card } from '@/lib/types';
import { PlayingCard } from './playing-card';

interface PlayerHandProps {
  hand: Card[];
}

export function PlayerHand({ hand }: PlayerHandProps) {
  return (
    <div>
        <h2 className="mb-4 text-center font-headline text-2xl font-semibold">Your Hand</h2>
        <div className="relative flex h-40 w-full justify-center">
        {hand.map((card, index) => (
            <div
            key={`${card.suit}-${card.rank}`}
            className="absolute origin-bottom transition-transform duration-300 ease-in-out hover:z-10 hover:scale-110"
            style={{
                transform: `translateX(${(index - 6) * 35}px) rotate(${(index - 6) * 4}deg)`,
            }}
            >
            <PlayingCard
                suit={card.suit}
                rank={card.rank}
                className="animate-deal-in opacity-0"
                style={{ animationDelay: `${index * 75}ms` }}
            />
            </div>
        ))}
        </div>
    </div>
  );
}
