'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { numberToKorean } from '@/lib/number-to-korean';
import { formatNumber } from '@/lib/format-number';

interface CalculationResult {
  totalValue: number;
  totalProfit: number;
  actualProfit: number;
  sellRatio: number;
  remainingPrincipal: number;
  remainingProfit: number;
  remainingTotal: number;
}

export function InvestmentCalculator() {
  const [principal, setPrincipal] = useState<string>('');
  const [returnRate, setReturnRate] = useState<string>('');
  const [sellAmount, setSellAmount] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(16);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateProfit = (): void => {
    const p = parseFloat(principal.replace(/,/g, ''));
    const r = parseFloat(returnRate);
    const s = parseFloat(sellAmount.replace(/,/g, ''));

    if (!p || !r || !s) {
      alert('모든 값을 입력해주세요');
      return;
    }

    if (s > p * (1 + r / 100)) {
      alert('매도금액이 총 자산 가치보다 클 수 없습니다');
      return;
    }

    const totalValue = p * (1 + r / 100);
    const sellRatio = s / totalValue;
    const totalProfit = p * (r / 100);
    const actualProfit = totalProfit * sellRatio;
    const remainingPrincipal = p - (s - actualProfit);
    const remainingProfit = totalProfit - actualProfit;

    setResult({
      totalValue,
      totalProfit,
      actualProfit,
      sellRatio: sellRatio * 100,
      remainingPrincipal,
      remainingProfit,
      remainingTotal: remainingPrincipal + remainingProfit,
    });
  };

  const handleNumberInput = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    const numValue = value.replace(/[^0-9]/g, '');
    const formatted = numValue ? formatNumber(parseInt(numValue)) : '';
    setter(formatted);
  };

  const increaseFontSize = (): void => {
    setFontSize((prev) => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = (): void => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  const reset = (): void => {
    setPrincipal('');
    setReturnRate('');
    setSellAmount('');
    setResult(null);
  };

  return (
    <>
      {/* 폰트 크기 조절 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-4 transition-colors duration-300 border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            글자 크기:
          </span>
          <button
            onClick={decreaseFontSize}
            className="p-2 bg-gray-200 dark:bg-slate-600 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors duration-300 border border-gray-300 dark:border-slate-500"
          >
            <Minus
              size={20}
              className="text-gray-700 dark:text-gray-200 transition-colors duration-300"
            />
          </button>
          <span className="font-medium px-3 text-gray-800 dark:text-gray-200 transition-colors duration-300">
            {fontSize}px
          </span>
          <button
            onClick={increaseFontSize}
            className="p-2 bg-gray-200 dark:bg-slate-600 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors duration-300 border border-gray-300 dark:border-slate-500"
          >
            <Plus
              size={20}
              className="text-gray-700 dark:text-gray-200 transition-colors duration-300"
            />
          </button>
        </div>
      </div>

      {/* 입력 폼 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-4 transition-colors duration-300 border border-gray-100 dark:border-slate-700">
        <div className="space-y-6" style={{ fontSize: `${fontSize}px` }}>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-3 transition-colors duration-300">
              투자원금 (원)
            </label>
            <input
              type="text"
              value={principal}
              onChange={(e) => handleNumberInput(e.target.value, setPrincipal)}
              placeholder="예: 54,000,000"
              className="w-full p-4 border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl text-right font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-300"
              style={{ fontSize: `${fontSize}px` }}
            />
            {principal && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-right transition-colors duration-300">
                {numberToKorean(parseInt(principal.replace(/,/g, '')))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-3 transition-colors duration-300">
              수익률 (%)
            </label>
            <input
              type="number"
              value={returnRate}
              onChange={(e) => setReturnRate(e.target.value)}
              placeholder="예: 2"
              step="0.1"
              className="w-full p-4 border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl text-right font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-300"
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-3 transition-colors duration-300">
              매도금액 (원)
            </label>
            <input
              type="text"
              value={sellAmount}
              onChange={(e) => handleNumberInput(e.target.value, setSellAmount)}
              placeholder="예: 10,000,000"
              className="w-full p-4 border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl text-right font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-300"
              style={{ fontSize: `${fontSize}px` }}
            />
            {sellAmount && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-right transition-colors duration-300">
                {numberToKorean(parseInt(sellAmount.replace(/,/g, '')))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={calculateProfit}
              className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-4 px-6 rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
              style={{ fontSize: `${fontSize}px` }}
            >
              계산하기
            </button>
            <button
              onClick={reset}
              className="bg-gray-400 dark:bg-slate-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-gray-500 dark:hover:bg-slate-500 transition-colors duration-300"
              style={{ fontSize: `${fontSize}px` }}
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 표시 */}
      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 transition-colors duration-300 border border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center transition-colors duration-300">
            계산 결과
          </h2>

          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border-l-4 border-green-500 transition-colors duration-300 border dark:border-green-800">
              <div className="text-green-700 dark:text-green-300 font-semibold mb-1 transition-colors duration-300">
                실제 수익
              </div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200 transition-colors duration-300">
                {formatNumber(Math.round(result.actualProfit))}원
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1 transition-colors duration-300">
                {numberToKorean(Math.round(result.actualProfit))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl transition-colors duration-300 border border-blue-100 dark:border-blue-800">
              <div className="text-blue-700 dark:text-blue-300 font-semibold mb-2 transition-colors duration-300">
                상세 정보
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    수익 후 총 자산:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {formatNumber(Math.round(result.totalValue))}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    매도 비율:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {result.sellRatio.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    전체 수익:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {formatNumber(Math.round(result.totalProfit))}원
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl transition-colors duration-300 border border-gray-100 dark:border-slate-600">
              <div className="text-gray-700 dark:text-gray-300 font-semibold mb-2 transition-colors duration-300">
                매도 후 보유 자산
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    남은 총 자산:
                  </span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {formatNumber(Math.round(result.remainingTotal))}원
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      {numberToKorean(Math.round(result.remainingTotal))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    남은 수익:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {formatNumber(Math.round(result.remainingProfit))}원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
