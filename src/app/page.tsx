import Link from 'next/link';
import { Github, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LogoIcon from '@/components/icons/logo-icon';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Eye className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-4xl font-bold text-primary">大家来找茬</CardTitle>
          <CardDescription className="pt-2 text-lg">
            挑战你的眼力，找出所有不同之处！
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-muted-foreground">
              登录以开始游戏，挑战全球玩家。
            </p>
            <Button asChild size="lg" className="w-full font-bold shadow-lg">
              <Link href="/lobby">
                <Github className="mr-2 h-5 w-5" />
                使用 GitHub 登录
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
