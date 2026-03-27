import { fetchAllNews } from '@/lib/newsFetcher';
import NewsGrid from '@/components/NewsGrid';

export const revalidate = 1800;

export default async function CryptoNews() {
  const articles = await fetchAllNews('crypto');
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 flex items-center">
        암호화폐 뉴스
        <span className="ml-2 text-sm font-normal text-gray-500">(코인데스크 기반)</span>
      </h2>
      <NewsGrid articles={articles} />
    </div>
  );
}
