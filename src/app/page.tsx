import Link from 'next/link';
import { Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
       <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
       <div className="relative z-10 flex flex-col items-center space-y-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 shadow-lg">
                <Eye className="h-14 w-14 text-primary" />
            </div>
            <div className="text-center">
                 <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary sm:text-6xl md:text-7xl">
                    大家来找茬
                </h1>
                <p className="mt-4 max-w-md text-lg text-muted-foreground md:text-xl">
                    挑战你的眼力极限，找出所有不同之处，成为找茬大师！
                </p>
            </div>
            <Button asChild size="lg" className="w-full max-w-xs rounded-full p-6 text-lg font-bold shadow-lg transition-transform hover:scale-105">
                <Link href="/lobby">
                    开始游戏
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
       </div>
    </div>
  );
}
