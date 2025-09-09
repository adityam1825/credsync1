import NewsCard, { type NewsArticle } from './news-card';

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
];


export default function NewsFeed() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {mockNews.map((item) => (
        <NewsCard key={item.id} article={item} />
      ))}
    </div>
  );
}
