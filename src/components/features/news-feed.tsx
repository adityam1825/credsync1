'use client';

import { useState, useMemo } from 'react';
import NewsCard, { type NewsArticle } from './news-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search } from 'lucide-react';

const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: 'Global Tech Summit Concludes With Groundbreaking AI Accord',
    summary: 'Leaders from 50 nations signed a landmark agreement to ensure ethical AI development, focusing on transparency and public safety.',
    category: 'Technology',
    imageUrl: 'https://picsum.photos/600/400?random=1',
    aiHint: 'tech summit',
  },
  {
    id: 2,
    title: 'Breakthrough in Renewable Energy Storage Announced',
    summary: 'A new battery technology promises to store solar and wind energy for months, potentially solving intermittency issues.',
    category: 'Science',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    aiHint: 'wind turbines',
  },
  {
    id: 3,
    title: 'International Space Station to Host First Tourist Spacewalk',
    summary: 'In a historic first, a civilian will join astronauts for a spacewalk outside the ISS, opening a new era for space tourism.',
    category: 'Space',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    aiHint: 'astronaut space',
  },
  {
    id: 4,
    title: 'Healthcare Reform Bill Passes with Bipartisan Support',
    summary: 'A comprehensive healthcare bill aimed at reducing costs and expanding coverage has been passed by a wide margin.',
    category: 'Politics',
    imageUrl: 'https://picsum.photos/600/400?random=4',
    aiHint: 'government building',
  },
    {
    id: 5,
    title: 'Ancient Underwater City Discovered in the Mediterranean',
    summary: 'Marine archaeologists have uncovered the ruins of a sprawling city that dates back over 2,000 years, complete with intact structures.',
    category: 'History',
    imageUrl: 'https://picsum.photos/600/400?random=5',
    aiHint: 'underwater ruins',
  },
  {
    id: 6,
    title: 'New Study Reveals Surprising Benefits of Urban Green Spaces',
    summary: 'Living near parks and green areas is linked to significant improvements in mental health and cognitive function, a decade-long study finds.',
    category: 'Health',
    imageUrl: 'https://picsum.photos/600/400?random=6',
    aiHint: 'city park',
  },
];

// Function to shuffle an array
const shuffleArray = (array: NewsArticle[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


export default function NewsFeed() {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState(mockNews);

  const filteredNews = useMemo(() => {
    if (!searchQuery) {
      return articles;
    }
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, articles]);
  
  const handleRefresh = () => {
    setArticles(shuffleArray(mockNews));
  };

  return (
    <div className="space-y-6">
        <div className="flex gap-2">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search news..."
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
            </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNews.map((item) => (
                <NewsCard key={item.id} article={item} />
            ))}
        </div>
        {filteredNews.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
                <p>No articles found for "{searchQuery}".</p>
                <p className="text-sm">Try a different search term.</p>
            </div>
        )}
    </div>
  );
}
