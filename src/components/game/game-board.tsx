"use client";

import { useState } from "react";
import type { Difference } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

interface GameBoardProps {
  differences: Difference[];
  imageUrl: string;
}

export function GameBoard({ differences, imageUrl }: GameBoardProps) {
  const [foundDifferences, setFoundDifferences] = useState<Difference[]>([]);
  const { toast } = useToast();

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedDifference = differences.find(diff => {
      const dx = x - diff.x;
      const dy = y - diff.y;
      return dx * dx + dy * dy < diff.radius * diff.radius;
    });

    if (clickedDifference && !foundDifferences.includes(clickedDifference)) {
      setFoundDifferences(prev => [...prev, clickedDifference]);
      toast({
        title: "找到了！",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-bold">
              您已成功找到一个不同之处！
            </span>
          </div>
        ),
      });
    }
  };

  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt="游戏场景"
        onClick={handleImageClick}
        className="w-full h-auto cursor-pointer"
        style={{ userSelect: "none" }}
      />
      {foundDifferences.map((diff, index) => (
        <div
          key={index}
          className="absolute border-2 border-red-500 rounded-full"
          style={{
            left: diff.x - diff.radius,
            top: diff.y - diff.radius,
            width: diff.radius * 2,
            height: diff.radius * 2,
          }}
        />
      ))}
    </div>
  );
}
