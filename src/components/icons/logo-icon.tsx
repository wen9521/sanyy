import type { SVGProps } from 'react';
import HeartIcon from './heart-icon';
import DiamondIcon from './diamond-icon';
import ClubIcon from './club-icon';
import SpadeIcon from './spade-icon';

const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <div className="relative h-12 w-12" {...props}>
    <HeartIcon className="absolute top-0 left-0 h-6 w-6 text-destructive fill-current" />
    <DiamondIcon className="absolute top-0 right-0 h-6 w-6 text-destructive fill-current" />
    <ClubIcon className="absolute bottom-0 left-0 h-6 w-6 text-foreground fill-current" />
    <SpadeIcon className="absolute bottom-0 right-0 h-6 w-6 text-foreground fill-current" />
  </div>
);

export default LogoIcon;
