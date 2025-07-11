
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
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
      const gameData = await createGame({ topic });
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

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
  }

  const suggestions = [
    "森林里的动物派对",
    "海底世界的奇妙冒险",
    "太空站里的宇航员",
    "繁忙的城市街道",
    "魔法师的神秘实验室"
  ];

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto flex h-full items-center justify-center px-4 py-8">
          <Card className="w-full max-w-2xl shadow-xl">
            <CardHeader className="items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Wand2 className="h-9 w-9 text-primary" />
              </div>
              <CardTitle className="font-headline text-4xl">创建 AI 游戏</CardTitle>
              <CardDescription className="max-w-md pt-1">
                输入一个好玩的主题，让 AI 为你生成独一无二的找茬图片！越具体越有趣哦。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <Label htmlFor="topic" className="sr-only">游戏主题</Label>
                <Input
                  id="topic"
                  type="text"
                  className="h-12 text-center text-lg"
                  placeholder="例如：一只戴着宇航员头盔的柯基犬"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={loading}
                />
                <div className="flex flex-wrap justify-center gap-2">
                    {suggestions.map(s => (
                        <Button key={s} variant="outline" size="sm" onClick={() => handleSuggestionClick(s)} disabled={loading}>
                            {s}
                        </Button>
                    ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full rounded-full p-6 text-lg font-bold"
                onClick={handleCreateGame}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-6 w-6" />
                )}
                {loading ? 'AI 正在努力创作中...' : '开始生成'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
