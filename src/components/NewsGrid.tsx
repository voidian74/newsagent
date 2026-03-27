import NewsCard from './NewsCard';
import { NewsArticle } from '@/lib/supabase';

interface NewsGridProps {
  articles: NewsArticle[];
  emptyMessage?: string;
}

export default function NewsGrid({ articles, emptyMessage = "뉴스 기사를 불러올 수 없습니다." }: NewsGridProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, idx) => (
        <NewsCard key={idx} article={article} />
      ))}
    </div>
  );
}
