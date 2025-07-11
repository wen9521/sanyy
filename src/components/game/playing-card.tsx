import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import type { Card } from '@/lib/types';
import ClubIcon from '../icons/club-icon';
import DiamondIcon from '../icons/diamond-icon';
import HeartIcon from '../icons/heart-icon';
import SpadeIcon from '../icons/spade-icon';

const suitIcons = {
  SPADES: SpadeIcon,
  HEARTS: HeartIcon,
  DIAMONDS: DiamondIcon,
  CLUBS: ClubIcon,
};

interface PlayingCardProps extends Card, Omit<ComponentProps<'div'>, 'children'> {
  isFaceDown?: boolean;
}

export function PlayingCard({ suit, rank, isFaceDown = false, className, ...props }: PlayingCardProps) {
  const SuitIcon = suitIcons[suit];
  const isRed = suit === 'HEARTS' || suit === 'DIAMONDS';

  if (isFaceDown) {
    return (
        <div
            className={cn(
            'aspect-[2.5/3.5] w-24 rounded-lg bg-primary p-1 shadow-lg',
            className
            )}
            {...props}
        >
            <div className="h-full w-full rounded-md border-2 border-primary-foreground/50 bg-primary-foreground/10"></div>
        </div>
    )
  }

  return (
    <div
      className={cn(
        'relative aspect-[2.5/3.5] w-24 rounded-lg bg-card p-2 font-bold shadow-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl',
        isRed ? 'text-destructive' : 'text-foreground',
        className
      )}
      {...props}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="text-left">
          <p className="text-2xl leading-none">{rank}</p>
          <SuitIcon className="h-5 w-5 fill-current" />
        </div>
        <div className="flex justify-center">
            <SuitIcon className="h-8 w-8 fill-current" />
        </div>
        <div className="text-right_">
          {/* Empty div for spacing, can be used for bottom-right rank if needed */}
        </div>
      </div>
    </div>
  );
}
