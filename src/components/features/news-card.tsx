'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';


export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  aiHint: string;
  publishedAt: Date;
  origin: string;
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

  const publishedAt = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

  return (
    <Card className="flex flex-col overflow-hidden h-full hover:border-primary/40 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={600}
          height={400}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={article.aiHint}
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-center">
            <Badge variant="secondary" className="w-fit">{article.category}</Badge>
            <p className="text-xs text-muted-foreground">{publishedAt}</p>
        </div>
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
