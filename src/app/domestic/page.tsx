import { fetchAllNews } from '@/lib/newsFetcher';
import NewsGrid from '@/components/NewsGrid';

export const revalidate = 1800;

export default async function DomesticNews() {
  const articles = await fetchAllNews('domestic');
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 flex items-center">
        국내 주식 뉴스
        <span className="ml-2 text-sm font-normal text-gray-500">(네이버 금융 기반)</span>
      </h2>
      <NewsGrid articles={articles} />
    </div>
  );
}
