import { load } from 'cheerio';

async function test() {
  const res = await fetch('https://www.blockmedia.co.kr/archives/category/news');
  const html = await res.text();
  const $ = load(html);
  
  const articles = [];
  $('article').slice(0, 5).each((i, el) => {
    const title = $(el).find('h3 a').text().trim() || $(el).find('h2 a').text().trim();
    const link = $(el).find('h3 a').attr('href') || $(el).find('h2 a').attr('href') || '';
    if (title && link) articles.push({title, link});
  });
  
  if (articles.length > 0) {
      console.log('Found blockmedia:', articles);
  } else {
      console.log('h3 tags:', $('h3').slice(0, 3).html());
  }
}

test();
