import Link from 'next/link';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LogoIcon from '@/components/icons/logo-icon';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <LogoIcon className="h-16 w-16" />
          </div>
          <CardTitle className="font-headline text-4xl font-bold text-primary">Shisanshui Online</CardTitle>
          <CardDescription className="pt-2 text-lg">
            The ultimate online Thirteen Water card game.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-muted-foreground">
              Challenge players worldwide. Log in to start playing.
            </p>
            <Button asChild size="lg" className="w-full font-bold shadow-lg">
              <Link href="/lobby">
                <Github className="mr-2 h-5 w-5" />
                Login with GitHub
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
