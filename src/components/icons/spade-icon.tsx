import type { SVGProps } from 'react';

const SpadeIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M12 2L7 9.2C4.1 10.7 2 13.9 2 17.5 2 21.09 4.91 24 8.5 24c2.26 0 4.29-1.18 5.5-3 1.21 1.82 3.24 3 5.5 3 3.59 0 6.5-2.91 6.5-6.5C22 13.9 19.9 10.7 17 9.2L12 2z" />
  </svg>
);

export default SpadeIcon;
