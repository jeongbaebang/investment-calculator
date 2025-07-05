import { Suspense } from 'react';

import { Calculator } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { BitcoinPrice } from '@/components/bitcoin-price';
import { InvestmentCalculator } from '@/components/investment-calculator';

// 서버에서 비트코인 가격 가져오기
async function getBitcoinPrice() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=krw&include_last_updated_at=true',
      {
        next: { revalidate: 300 }, // 5분마다 재검증
      }
    );
    const data = await response.json();
    return {
      price: data.bitcoin.krw,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch Bitcoin price:', error);
    return null;
  }
}

export default async function HomePage() {
  const bitcoinData = await getBitcoinPrice();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <div className="absolute right-0">
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* 헤더 */}
          <div className="min-h-64 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-4 transition-colors duration-300 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calculator
                  className="text-blue-600 dark:text-blue-400 transition-colors duration-300"
                  size={32}
                />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                  투자 수익 계산기
                </h1>
              </div>
            </div>
            {/* 비트코인 가격 - 서버 컴포넌트로 SSR */}
            <Suspense
              fallback={
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 mb-4 border-l-4 border-orange-400 transition-colors duration-300">
                  <div className="animate-pulse">
                    <div className="h-4 bg-orange-200 dark:bg-orange-800 rounded w-32 mb-2"></div>
                    <div className="h-6 bg-orange-200 dark:bg-orange-800 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-orange-200 dark:bg-orange-800 rounded w-40"></div>
                  </div>
                </div>
              }
            >
              <BitcoinPrice initialData={bitcoinData} />
            </Suspense>
          </div>
          {/* 투자 계산기 - 클라이언트 컴포넌트 */}
          <InvestmentCalculator />
        </div>
      </div>
    </main>
  );
}
