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
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    origin: 'India',
  },
  {
    id: 2,
    title: 'Breakthrough in Renewable Energy Storage Announced',
    summary: 'A new battery technology promises to store solar and wind energy for months, potentially solving intermittency issues.',
    category: 'Science',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    aiHint: 'wind turbines',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    origin: 'USA',
  },
  {
    id: 3,
    title: 'Indian Space Research Organisation (ISRO) Launches New Satellite',
    summary: 'ISRO successfully launched its latest communication satellite, which will enhance connectivity across the subcontinent.',
    category: 'Space',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    aiHint: 'rocket launch',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    origin: 'India',
  },
  {
    id: 4,
    title: 'Healthcare Reform Bill Passes with Bipartisan Support',
    summary: 'A comprehensive healthcare bill aimed at reducing costs and expanding coverage has been passed by a wide margin.',
    category: 'Politics',
    imageUrl: 'https://picsum.photos/600/400?random=4',
    aiHint: 'government building',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    origin: 'UK',
  },
    {
    id: 5,
    title: 'Ancient Underwater City Discovered in the Mediterranean',
    summary: 'Marine archaeologists have uncovered the ruins of a sprawling city that dates back over 2,000 years, complete with intact structures.',
    category: 'History',
    imageUrl: 'https://picsum.photos/600/400?random=5',
    aiHint: 'underwater ruins',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    origin: 'Greece',
  },
  {
    id: 6,
    title: 'Mumbai Announces Major Urban Green Spaces Initiative',
    summary: 'Living near parks and green areas is linked to significant improvements in mental health and cognitive function, a decade-long study finds.',
    category: 'Health',
    imageUrl: 'https://picsum.photos/600/400?random=6',
    aiHint: 'city park',
    publishedAt: new Date(Date.now() - 40 * 60 * 60 * 1000), // 40 hours ago
    origin: 'India',
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
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    
    let filtered = articles.filter(article => 
        article.origin === 'India' && article.publishedAt > fortyEightHoursAgo
    );

    if (searchQuery) {
        filtered = filtered.filter(
            (article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    return filtered;
  }, [searchQuery, articles]);
  
  const handleRefresh = () => {
    // Shuffling the original list to simulate a refresh
    setArticles(shuffleArray(mockNews));
  };

  return (
    <div className="space-y-6">
        <div className="flex gap-2">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search recent news from India..."
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
                <p>No recent articles from India found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
                <p className="text-sm">Try a different search term or check back later.</p>
            </div>
        )}
    </div>
  );
}
