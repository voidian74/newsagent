import { NextResponse } from 'next/server';
import { load } from 'cheerio';
import scrapers from '@/config/scrapers.json';
import { extractMetadata } from '@/utils/extractor';
import { supabase, hasSupabaseConfig, NewsArticle } from '@/lib/supabase';

async function scrapeUrl(scraper: any): Promise<NewsArticle[]> {
  try {
    const res = await fetch(scraper.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const html = await res.text();
    const $ = load(html);
    const articles: NewsArticle[] = [];
    
    $(scraper.selectors.container).each((i, el) => {
      const titleEl = $(el).find(scraper.selectors.title).first();
      const title = titleEl.text().trim();
      const link = titleEl.attr('href') || '';
      const dateText = $(el).find(scraper.selectors.date).first().text().trim() || new Date().toISOString();
      
      if (title && link) {
        const meta = extractMetadata(title);
        
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
          summary: meta.summary,
          tags: meta.tags
        });
      }
    });
    
    return articles.slice(0, 10);
  } catch (error) {
    console.error(`Error scraping ${scraper.id}:`, error);
    return [];
  }
}

export async function GET() {
  let allArticles: NewsArticle[] = [];
  
  for (const scraper of scrapers.scrapers) {
    const scraped = await scrapeUrl(scraper);
    allArticles = [...allArticles, ...scraped];
  }

  // 글로벌 (해외주식) 샘플 데이터 삽입 (동적 스크래퍼가 아직 구성되지 않은 경우의 예외처리)
  allArticles.push({
    source: "Yahoo Finance",
    category: "global",
    title: "Tesla surges on new AI announcements as Elon Musk reveals Robotaxi",
    link: "https://finance.yahoo.com/",
    date: new Date().toISOString(),
    summary: "Tesla surges on new AI announcements...",
    tags: ["테슬라", "TSLA"]
  });
  
  allArticles.push({
    source: "Bloomberg",
    category: "global",
    title: "Apple introduces new AR headset for developers",
    link: "https://www.bloomberg.com/",
    date: new Date().toISOString(),
    summary: "Apple introduces new AR headset...",
    tags: ["애플", "AAPL"]
  });

  if (hasSupabaseConfig && supabase) {
      // 추후 supabase 연결 시 데이터 삽입 로직
      // await supabase.from('news').upsert(allArticles, { onConflict: 'link' });
  }
  
  return NextResponse.json({ success: true, count: allArticles.length, data: allArticles });
}
