'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, Wifi, WifiOff } from 'lucide-react';

import { formatNumber } from '@/lib/format-number';

interface BitcoinData {
  price: number;
  lastUpdated: string;
}

interface BitcoinPriceProps {
  initialData: BitcoinData | null;
}

export function BitcoinPrice({ initialData }: BitcoinPriceProps) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/bitcoin-price');
        if (!response.ok) throw new Error('Failed to fetch');

        const newData = await response.json();
        if (newData.error) throw new Error(newData.error);

        setData(newData);
        setIsOnline(true);
      } catch (error) {
        console.error('Failed to fetch Bitcoin price:', error);
        setError('업데이트 실패');
        setIsOnline(false);
      } finally {
        setIsLoading(false);
      }
    };

    // 30초마다 업데이트
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  // 수동 새로고침
  const handleRefresh = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/bitcoin-price');
      if (!response.ok) throw new Error('Failed to fetch');

      const newData = await response.json();
      if (newData.error) throw new Error(newData.error);

      setData(newData);
      setIsOnline(true);
    } catch {
      setError('업데이트 실패');
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-4 border-l-4 border-red-400 transition-colors duration-300">
        <div className="text-red-700 dark:text-red-300">
          비트코인 가격을 가져올 수 없습니다.
        </div>
      </div>
    );
  }

  const updateTime = new Date(data.lastUpdated).toLocaleTimeString('ko-KR');
  const timeDiff = Math.floor(
    (Date.now() - new Date(data.lastUpdated).getTime()) / 1000
  );

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border-l-4 border-amber-500 transition-colors duration-300 border dark:border-orange-800">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <TrendingUp
            className="text-orange-600 dark:text-orange-400 transition-colors duration-300"
            size={20}
          />
          <span className="text-orange-700 dark:text-orange-300 font-semibold transition-colors duration-300">
            현재 비트코인 가격
          </span>
        </div>

        {/* 상태 표시 및 새로고침 버튼 */}
        <div className="flex items-center gap-2">
          {/* 연결 상태 */}
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}

          {/* 새로고침 버튼 */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-1 rounded-md hover:bg-orange-100 dark:hover:bg-orange-800/50 transition-colors disabled:opacity-50"
            title="수동 새로고침"
          >
            <RefreshCw
              className={`w-4 h-4 text-orange-600 dark:text-orange-400 transition-transform ${
                isLoading ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* 가격 표시 */}
      <div
        className={`text-xl font-bold text-orange-800 dark:text-orange-200 transition-all duration-300 ${
          isLoading ? 'opacity-60' : ''
        }`}
      >
        ₩ {formatNumber(Math.round(data.price))}
        {isLoading && (
          <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-pulse ml-2"></span>
        )}
      </div>

      {/* 업데이트 시간 및 상태 */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-orange-500 dark:text-orange-400 transition-colors duration-300">
          업데이트: {updateTime}
          {timeDiff > 60 && (
            <span className="text-amber-600 dark:text-amber-400 ml-1">
              ({Math.floor(timeDiff / 60)}분 전)
            </span>
          )}
        </div>

        {/* 에러 상태 */}
        {error && (
          <div className="text-xs text-red-500 dark:text-red-400">{error}</div>
        )}
      </div>

      {/* 로딩 상태 바 */}
      {isLoading && (
        <div className="mt-2 h-1 bg-orange-200 dark:bg-orange-800 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full animate-pulse"></div>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
        Data provided by CoinGecko
      </div>
    </div>
  );
}
