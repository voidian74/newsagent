import { load } from 'cheerio';
import scrapers from '@/config/scrapers.json';
import { extractMetadata } from '@/utils/extractor';
import { supabase, hasSupabaseConfig, NewsArticle } from '@/lib/supabase';

export async function scrapeUrl(scraper: any): Promise<NewsArticle[]> {
  try {
    const res = await fetch(scraper.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
      next: { revalidate: 1800 } // 캐시 유지 시간
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const buffer = await res.arrayBuffer();
    
    // 네이버 금융 등 EUC-KR 인코딩 처리가 필요한 경우
    let html = '';
    if (scraper.id === 'naver_finance') {
      const decoder = new TextDecoder('euc-kr');
      html = decoder.decode(buffer);
    } else {
      const decoder = new TextDecoder('utf-8');
      html = decoder.decode(buffer);
    }
    
    const isRss = scraper.isRss === true;
    const $ = load(html, isRss ? { xmlMode: true } : undefined);
    const articles: NewsArticle[] = [];
    
    $(scraper.selectors.container).each((i, el) => {
      const titleEl = $(el).find(scraper.selectors.title).first();
      const title = titleEl.text().trim();
      let link = '';
      if (isRss) {
          link = $(el).find(scraper.selectors.link).first().text().trim();
      } else {
          link = titleEl.attr('href') || $(el).find(scraper.selectors.link).first().attr('href') || '';
      }
      
      let dateText = $(el).find(scraper.selectors.date).first().text().trim() || new Date().toISOString();
      
      // 한국 뉴스 사이트의 날짜 형식이 시간대(TZ)를 포함하지 않는 경우 KST(+09:00)로 명시적 지정
      if (dateText.match(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(:\d{2})?$/)) {
        dateText = dateText.replace(' ', 'T') + '+09:00';
      } else if (dateText.match(/^\d{4}\.\d{2}\.\d{2}\s\d{2}:\d{2}(:\d{2})?$/)) {
        dateText = dateText.replace(/\./g, '-').replace(' ', 'T') + '+09:00';
      }

      let summaryText = '';
      if (scraper.selectors.summary) {
        if (isRss) {
          summaryText = $(el).find(scraper.selectors.summary).first().text().replace(/<[^>]+>/g, '').trim();
        } else {
          // HTML인 경우 날짜나 언론사 등 불필요한 태그 제거
          const sumEl = $(el).find(scraper.selectors.summary).first().clone();
          if (scraper.selectors.date) {
            sumEl.find(scraper.selectors.date).remove();
          }
          sumEl.find('.press, .wdate').remove();
          summaryText = sumEl.text().trim();
        }
        
        // CDATA 등 정리
        summaryText = summaryText.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
        // 150자 제한 (extractMetadata와 동일)
        summaryText = summaryText.length > 150 ? summaryText.substring(0, 150) + '...' : summaryText;
      }
      
      if (title && link) {
        const meta = extractMetadata(title);
        const finalSummary = summaryText || meta.summary;
        
        let fullLink = link;
        if (link.startsWith('/')) {
            const urlObj = new URL(scraper.url);
            fullLink = `${urlObj.protocol}//${urlObj.host}${link}`;
        }
        
        articles.push({
          source: scraper.name,
          category: scraper.category,
          title: title,
          link: fullLink,
          date: dateText,
          summary: finalSummary,
          tags: meta.tags
        });
      }
    });
    
    return articles.slice(0, 15);
  } catch (error) {
    console.error(`Error scraping ${scraper.id}:`, error);
    return [];
  }
}

export async function fetchAllNews(categoryFilter?: string): Promise<NewsArticle[]> {
  let allArticles: NewsArticle[] = [];
  
  for (const scraper of scrapers.scrapers) {
    if (!categoryFilter || scraper.category === categoryFilter) {
      const scraped = await scrapeUrl(scraper);
      allArticles = [...allArticles, ...scraped];
    }
  }

  // 글로벌 해외 주식 Mock 데이터 동적 생성
  if (!categoryFilter || categoryFilter === 'global') {
      allArticles.push({
        source: "Yahoo Finance",
        category: "global",
        title: "Tesla surges on new AI announcements as Elon Musk reveals Robotaxi details",
        link: "https://finance.yahoo.com/",
        date: new Date().toISOString(),
        summary: "Tesla stock (TSLA) rallied after CEO Elon Musk provided fresh details on the company's autonomous driving push and Robotaxi timeline during the Q3 earnings...",
        tags: ["테슬라", "TSLA"]
      });
      
      allArticles.push({
        source: "Bloomberg",
        category: "global",
        title: "Apple introduces new mixed-reality headset tools for developers",
        link: "https://www.bloomberg.com/",
        date: new Date().toISOString(),
        summary: "Apple is rolling out a major software update to provide developers with deeper access to hardware features in the Vision Pro mixed-reality environment...",
        tags: ["애플", "AAPL"]
      });

      allArticles.push({
        source: "CNBC",
        category: "global",
        title: "Nvidia hits all-time high amid insatiable demand for AI chips",
        link: "https://www.cnbc.com/",
        date: new Date().toISOString(),
        summary: "Nvidia shares hit another record high on Tuesday as tech giants continue pouring billions into data center infrastructure to train artificial intelligence models.",
        tags: ["엔비디아", "NVDA"]
      });
  }

  if (hasSupabaseConfig && supabase) {
      // Supabase 저장 방식
  }
  
  // 최신 순 정렬
  return allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
