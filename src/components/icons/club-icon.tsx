import type { SVGProps } from 'react';

const ClubIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="14.5" r="3.5" />
    <circle cx="16.5" cy="10" r="3.5" />
    <circle cx="7.5" cy="10" r="3.5" />
    <path d="M12 14.5v-10" />
  </svg>
);

export default ClubIcon;
