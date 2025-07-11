import type { SVGProps } from 'react';
import { Eye } from 'lucide-react';

const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10" {...props}>
    <Eye className="h-8 w-8 text-primary" />
  </div>
);

export default LogoIcon;
