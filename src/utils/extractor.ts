export const extractMetadata = (text: string) => {
  // 간단한 종목별 키워드 매칭 사전
  const stockDictionary: Record<string, string> = {
    "삼성전자": "005930",
    "SK하이닉스": "000660",
    "카카오": "035720",
    "네이버": "035420",
    "애플": "AAPL",
    "테슬라": "TSLA",
    "엔비디아": "NVDA",
    "마이크로소프트": "MSFT",
    "아마존": "AMZN",
    "구글": "GOOGL",
    "알파벳": "GOOGL",
    "현대차": "005380",
    "기아": "000270"
  };

  const coinDictionary: Record<string, string> = {
    "비트코인": "BTC",
    "이더리움": "ETH",
    "솔라나": "SOL",
    "리플": "XRP",
    "도지코인": "DOGE",
    "에이다": "ADA",
    "바이낸스": "BNB"
  };

  const extractedTags: string[] = [];
  const uppercaseText = text.toUpperCase();

  // 키워드 검사 (주식)
  Object.keys(stockDictionary).forEach(keyword => {
    if (uppercaseText.includes(keyword) || text.includes(keyword)) {
      extractedTags.push(keyword);
    }
  });

  // 키워드 검사 (코인)
  Object.keys(coinDictionary).forEach(keyword => {
    if (uppercaseText.includes(keyword) || text.includes(keyword)) {
      extractedTags.push(keyword);
    }
  });

  // 기본 요약 (첫 150자 자르기)
  const summary = text.length > 150 ? text.substring(0, 150) + '...' : text;

  // 중복 제거
  const uniqueTags = [...new Set(extractedTags)];

  return {
    tags: uniqueTags,
    summary
  };
};
