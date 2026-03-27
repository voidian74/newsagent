import { fetchAllNews } from '@/lib/newsFetcher';
import NewsGrid from '@/components/NewsGrid';

export const revalidate = 1800; // 30 minutes cache revalidation

export default async function Home() {
  const articles = await fetchAllNews();
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 flex items-center">
        실시간 통합 헤드라인
      </h2>
      <NewsGrid articles={articles} />
    </div>
  );
}
