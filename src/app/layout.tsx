import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import { Newspaper } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'News Agent - 글로벌 주식/코인 투자 뉴스 요약',
  description: '주식 종목과 암호화폐에 관련된 실시간 뉴스를 스크래핑하여 자동 요약 제공',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
                <Newspaper className="text-white w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Market<span className="text-blue-600 dark:text-blue-500">Agent</span></h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">실시간 국내/해외 주식 및 코인 시장 동향 분석기</p>
              </div>
            </div>
          </header>

          <Navigation />

          <main className="mt-8">
            {children}
          </main>

          <footer className="mt-20 border-t border-gray-200 dark:border-gray-800 pt-8 pb-12 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} MarketAgent News Platform. All rights reserved. <br/>
            Data aggregated from Naver, Yahoo Finance, and CoinDesk.
          </footer>

        </div>
      </body>
    </html>
  );
}
