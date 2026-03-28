import { fetchAllNews } from './src/lib/newsFetcher.ts';

async function test() {
  const news = await fetchAllNews();
  console.log('Total news:', news.length);
  news.slice(0, 5).forEach((n, i) => {
    console.log(`[${i}] Title: ${n.title}`);
    console.log(`    Date: ${n.date} -> Local: ${new Date(n.date).toString()}`);
    console.log(`    Summary: ${n.summary}`);
  });
}
test();
