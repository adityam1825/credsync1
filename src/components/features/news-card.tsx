'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Flag } from 'lucide-react';

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  aiHint: string;
}

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const { toast } = useToast();

  const handleReport = () => {
    toast({
      title: "Article Reported",
      description: "Thank you for your feedback. Our team will review this content.",
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-48">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover"
          data-ai-hint={article.aiHint}
        />
      </div>
      <CardHeader>
        <Badge variant="secondary" className="w-fit mb-2">{article.category}</Badge>
        <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{article.summary}</CardDescription>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={handleReport}>
          <Flag className="mr-2 h-4 w-4" />
          Report
        </Button>
      </CardFooter>
    </Card>
  );
}
