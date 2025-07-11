
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createGame } from '@/ai/flows/create-game-flow';

export default function CreateGamePage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateGame = async () => {
    if (!topic.trim()) {
      toast({
        variant: 'destructive',
        title: '主题不能为空',
        description: '请输入一个游戏主题来生成图片。',
      });
      return;
    }
    setLoading(true);
    try {
      // In a real app, we would save the new game to a database
      // and get a real room ID. For this mock, we'll just navigate
      // to a placeholder room page with the generated data.
      const gameData = await createGame({ topic });

      // We can't pass the large image data URIs directly in the URL,
      // so we'll store it in sessionStorage for the next page to pick up.
      sessionStorage.setItem('newGameData', JSON.stringify(gameData));
      
      router.push(`/room/ai-generated`);

    } catch (error) {
      console.error('Failed to create game:', error);
      toast({
        variant: 'destructive',
        title: '游戏创建失败',
        description:
          'AI 图片生成失败，请稍后再试或更换一个主题。',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto flex h-full items-center justify-center px-4 py-8">
          <Card className="w-full max-w-lg shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">创建新游戏</CardTitle>
              <CardDescription>
                输入一个主题，让 AI 为你生成独一无二的找茬图片！
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="topic">游戏主题</Label>
                <Input
                  id="topic"
                  type="text"
                  placeholder="例如：一只猫在太空漫步"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full font-bold"
                onClick={handleCreateGame}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                {loading ? '正在生成图片...' : '开始生成'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
