import React from 'react';
import { ExternalLink, Clock, Tag } from 'lucide-react';
import { NewsArticle } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  // 간단한 날짜 포맷팅 (방금 전, 10분 전 등)
  let timeAgo = article.date;
  try {
    const parsedDate = new Date(article.date);
    if (!isNaN(parsedDate.getTime())) {
      timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true, locale: ko });
    }
  } catch (e) {
    // Keep original string if date-fns fails
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200">
            {article.source}
          </span>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3 mr-1" />
            {timeAgo}
          </div>
        </div>
        
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="group">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
        </a>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 ext-ellipsis flex-grow">
          {article.summary}
        </p>
        
        <div className="mt-auto">
          {article.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              {article.tags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700" />
          )}
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
         <a href={article.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            원문 보기 <ExternalLink className="w-4 h-4 ml-1" />
         </a>
      </div>
    </div>
  );
}
