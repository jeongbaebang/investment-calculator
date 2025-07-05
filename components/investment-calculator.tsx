'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, History, Trash2, Calculator } from 'lucide-react';
import { numberToKorean } from '@/lib/number-to-korean';

interface CalculationResult {
  totalValue: number;
  totalProfit: number;
  actualProfit: number;
  actualProfitAfterFees: number;
  sellRatio: number;
  remainingPrincipal: number;
  remainingProfit: number;
  remainingTotal: number;
  buyFee: number;
  sellFee: number;
  withdrawalFee: number;
  totalFees: number;
}

interface CalculationHistory {
  id: string;
  timestamp: number;
  principal: string;
  returnRate: string;
  sellAmount: string;
  market: string;
  includeWithdrawal: boolean;
  result: CalculationResult;
}

// 숫자를 천 단위로 콤마 추가
const formatNumber = (num: number): string => {
  return num.toLocaleString('ko-KR');
};

export function InvestmentCalculator() {
  const [principal, setPrincipal] = useState<string>('');
  const [returnRate, setReturnRate] = useState<string>('');
  const [sellAmount, setSellAmount] = useState<string>('');
  const [market, setMarket] = useState<string>('KRW');
  const [includeWithdrawal, setIncludeWithdrawal] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(16);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // 업비트 수수료율 (2025년 기준)
  const upbitFees = {
    KRW: 0.05, // 0.05% (할인 중)
    BTC: 0.25, // 0.25%
    USDT: 0.25, // 0.25%
    withdrawal: 1000, // 원화 출금 시 1,000원
  };

  // localStorage에서 데이터 불러오기
  useEffect(() => {
    try {
      const savedPrincipal = localStorage.getItem('investment-principal');
      const savedReturnRate = localStorage.getItem('investment-return-rate');
      const savedSellAmount = localStorage.getItem('investment-sell-amount');
      const savedMarket = localStorage.getItem('investment-market');
      const savedIncludeWithdrawal = localStorage.getItem(
        'investment-include-withdrawal'
      );
      const savedFontSize = localStorage.getItem('investment-font-size');
      const savedResult = localStorage.getItem('investment-result');
      const savedHistory = localStorage.getItem('investment-history');

      if (savedPrincipal) setPrincipal(savedPrincipal);
      if (savedReturnRate) setReturnRate(savedReturnRate);
      if (savedSellAmount) setSellAmount(savedSellAmount);
      if (savedMarket) setMarket(savedMarket);
      if (savedIncludeWithdrawal)
        setIncludeWithdrawal(JSON.parse(savedIncludeWithdrawal));
      if (savedFontSize) setFontSize(parseInt(savedFontSize));
      if (savedResult) {
        setResult(JSON.parse(savedResult));
      }
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
  }, []);

  // 입력값 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('investment-principal', principal);
  }, [principal]);

  useEffect(() => {
    localStorage.setItem('investment-return-rate', returnRate);
  }, [returnRate]);

  useEffect(() => {
    localStorage.setItem('investment-sell-amount', sellAmount);
  }, [sellAmount]);

  useEffect(() => {
    localStorage.setItem('investment-market', market);
  }, [market]);

  useEffect(() => {
    localStorage.setItem(
      'investment-include-withdrawal',
      JSON.stringify(includeWithdrawal)
    );
  }, [includeWithdrawal]);

  useEffect(() => {
    localStorage.setItem('investment-font-size', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    if (result) {
      localStorage.setItem('investment-result', JSON.stringify(result));
    }
  }, [result]);

  useEffect(() => {
    localStorage.setItem('investment-history', JSON.stringify(history));
  }, [history]);

  const calculateProfit = (): void => {
    const p = parseFloat(principal.replace(/,/g, ''));
    const r = parseFloat(returnRate);
    const s = parseFloat(sellAmount.replace(/,/g, ''));

    if (!p || !r || !s) {
      alert('모든 값을 입력해주세요');
      return;
    }

    // 매수 수수료 계산
    const feeRate =
      (upbitFees[market as keyof typeof upbitFees] as number) / 100;
    const buyFee = p * feeRate;
    const actualPrincipal = p - buyFee; // 수수료를 제외한 실제 투자금

    const totalValue = actualPrincipal * (1 + r / 100);

    if (s > totalValue) {
      alert('매도금액이 총 자산 가치보다 클 수 없습니다');
      return;
    }

    const sellRatio = s / totalValue;
    const sellFee = s * feeRate; // 매도 수수료
    const totalProfit = totalValue - actualPrincipal;
    const actualProfit = totalProfit * sellRatio;

    // 출금 수수료
    const withdrawalFee = includeWithdrawal ? upbitFees.withdrawal : 0;

    // 실제 수익에서 매도 수수료와 출금 수수료 차감
    const sellPrincipalRatio = (actualPrincipal * sellRatio) / s; // 매도 금액 중 원금 비율
    const sellProfitRatio = 1 - sellPrincipalRatio; // 매도 금액 중 수익 비율

    const actualProfitAfterFees = s * sellProfitRatio - sellFee - withdrawalFee;

    const remainingPrincipal = actualPrincipal * (1 - sellRatio);
    const remainingProfit = totalProfit - actualProfit;
    const totalFees = buyFee + sellFee + withdrawalFee;

    const calculationResult: CalculationResult = {
      totalValue,
      totalProfit,
      actualProfit,
      actualProfitAfterFees,
      sellRatio: sellRatio * 100,
      remainingPrincipal,
      remainingProfit,
      remainingTotal: remainingPrincipal + remainingProfit,
      buyFee,
      sellFee,
      withdrawalFee,
      totalFees,
    };

    setResult(calculationResult);

    // 계산 히스토리에 추가
    const historyItem: CalculationHistory = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      principal,
      returnRate,
      sellAmount,
      market,
      includeWithdrawal,
      result: calculationResult,
    };

    setHistory((prev) => [historyItem, ...prev.slice(0, 9)]); // 최대 10개까지 저장
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
    setMarket('KRW');
    setIncludeWithdrawal(false);
    setResult(null);
    localStorage.removeItem('investment-result');
  };

  const loadHistoryItem = (item: CalculationHistory): void => {
    setPrincipal(item.principal);
    setReturnRate(item.returnRate);
    setSellAmount(item.sellAmount);
    setMarket(item.market);
    setIncludeWithdrawal(item.includeWithdrawal);
    setResult(item.result);
    setShowHistory(false);
  };

  const deleteHistoryItem = (id: string): void => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllHistory = (): void => {
    setHistory([]);
    localStorage.removeItem('investment-history');
  };

  return (
    <div
      className="max-w-4xl mx-auto space-y-4"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* 폰트 크기 조절 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-4 transition-colors duration-300 border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            글자 크기:
          </span>
          <button
            onClick={decreaseFontSize}
            className="p-2 bg-gray-200 dark:bg-slate-600 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors duration-300 border border-gray-300 dark:border-slate-500"
          >
            <Minus
              size={fontSize * 1.25}
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
              size={fontSize * 1.25}
              className="text-gray-700 dark:text-gray-200 transition-colors duration-300"
            />
          </button>

          {/* 히스토리 버튼 */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg transition-colors duration-300 border ${
                showHistory
                  ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-600'
                  : 'bg-gray-200 dark:bg-slate-600 border-gray-300 dark:border-slate-500 hover:bg-gray-300 dark:hover:bg-slate-500'
              }`}
            >
              <History
                size={fontSize * 1.25}
                className={`transition-colors duration-300 ${
                  showHistory
                    ? 'text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              />
            </button>
            {history.length > 0 && (
              <span
                className="text-gray-500 dark:text-gray-400"
                style={{ fontSize: `${fontSize * 0.875}px` }}
              >
                {history.length}개
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 사용 시나리오 설명 */}
      {/* <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl shadow-lg p-6 mb-4 transition-colors duration-300 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb
            size={fontSize * 1.25}
            className="text-yellow-600 dark:text-yellow-400"
          />
          <h3
            className="font-bold text-yellow-800 dark:text-yellow-200 transition-colors duration-300"
            style={{ fontSize: `${fontSize * 1.125}px` }}
          >
            💡 계산 시나리오
          </h3>
        </div>
        <div
          className="text-yellow-700 dark:text-yellow-300 space-y-1 transition-colors duration-300"
          style={{ fontSize: `${fontSize * 0.875}px` }}
        >
          <p>
            1️⃣ 처음에 큰 금액으로 코인을 매수 (전체 투자금에 대해 매수 수수료
            발생)
          </p>
          <p>2️⃣ 시간이 지나 코인 가격이 상승하여 수익이 발생</p>
          <p>
            3️⃣ 보유 중인 코인의 일부만 매도 (매도 금액에 대해서만 매도 수수료
            발생)
          </p>
        </div>
      </div> */}

      {/* 계산 예시 */}
      {/* <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl shadow-lg p-6 mb-4 transition-colors duration-300 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen
            size={fontSize * 1.25}
            className="text-green-600 dark:text-green-400"
          />
          <h3
            className="font-bold text-green-800 dark:text-green-200 transition-colors duration-300"
            style={{ fontSize: `${fontSize * 1.125}px` }}
          >
            📋 계산 예시
          </h3>
        </div>
        <div
          className="text-green-700 dark:text-green-300 space-y-1 transition-colors duration-300"
          style={{ fontSize: `${fontSize * 0.875}px` }}
        >
          <p>
            • <strong>최초 매수:</strong> 5,000만원으로 비트코인 구매 → 매수
            수수료: 25,000원
          </p>
          <p>
            • <strong>현재 상황:</strong> 10% 상승하여 총 자산 가치 5,500만원
          </p>
          <p>
            • <strong>일부 매도:</strong> 1,000만원어치만 매도 → 매도 수수료:
            5,000원
          </p>
          <p>
            • <strong>실제 수익:</strong> 약 90만원 (수수료 차감 후)
          </p>
        </div>
      </div> */}

      {/* 업비트 수수료 정보 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl shadow-lg p-6 mb-4 transition-colors duration-300 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-3">
          <Calculator
            size={fontSize * 1.25}
            className="text-blue-600 dark:text-blue-400"
          />
          <h3
            className="font-bold text-blue-800 dark:text-blue-200 transition-colors duration-300"
            style={{ fontSize: `${fontSize * 1.125}px` }}
          >
            업비트 수수료 정보 (2025년 기준)
          </h3>
        </div>
        <div
          className="grid grid-cols-1 gap-4"
          style={{ fontSize: `${fontSize * 0.875}px` }}
        >
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg transition-colors duration-300">
            <div className="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
              KRW 마켓
            </div>
            <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              0.05% (할인 중) - 매수/매도 동일
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg transition-colors duration-300">
            <div className="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
              BTC/USDT 마켓
            </div>
            <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              0.25% - 매수/매도 동일
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg transition-colors duration-300">
            <div className="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
              원화 출금
            </div>
            <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              1,000원 고정
            </div>
          </div>
        </div>
      </div>

      {/* 계산 히스토리 */}
      {showHistory && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-4 transition-colors duration-300 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-bold text-gray-800 dark:text-white transition-colors duration-300"
              style={{ fontSize: `${fontSize * 1.125}px` }}
            >
              계산 기록
            </h3>
            {history.length > 0 && (
              <button
                onClick={clearAllHistory}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
                style={{ fontSize: `${fontSize * 0.875}px` }}
              >
                전체 삭제
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4 transition-colors duration-300">
              저장된 계산 기록이 없습니다.
            </p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-gray-500 dark:text-gray-400 transition-colors duration-300"
                      style={{ fontSize: `${fontSize * 0.875}px` }}
                    >
                      {new Date(item.timestamp).toLocaleString('ko-KR')}
                    </span>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className="p-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
                    >
                      <Trash2 size={fontSize} />
                    </button>
                  </div>
                  <div
                    className="space-y-1"
                    style={{ fontSize: `${fontSize * 0.875}px` }}
                  >
                    <div className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      원금: {item.principal}원 | 수익률: {item.returnRate}% |
                      매도: {item.sellAmount}원 | 마켓: {item.market}
                      {item.includeWithdrawal && ' | 출금수수료 포함'}
                    </div>
                    <div className="font-medium text-green-600 dark:text-green-400 transition-colors duration-300">
                      수수료 후 수익:{' '}
                      {formatNumber(
                        Math.round(item.result.actualProfitAfterFees)
                      )}
                      원
                    </div>
                  </div>
                  <button
                    onClick={() => loadHistoryItem(item)}
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-300"
                    style={{ fontSize: `${fontSize * 0.75}px` }}
                  >
                    불러오기
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 입력 폼 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-4 transition-colors duration-300 border border-gray-100 dark:border-slate-700">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2 transition-colors duration-300">
              최초 매수금액 (원)
            </label>
            <p
              className="text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-300"
              style={{ fontSize: `${fontSize * 0.75}px` }}
            >
              처음 코인을 구매할 때 사용한 전체 금액 (매수 수수료 계산 기준)
            </p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={principal}
              onChange={(e) => handleNumberInput(e.target.value, setPrincipal)}
              placeholder="예: 54,000,000"
              className="w-full p-4 border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl text-right font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-300"
            />
            {principal && (
              <div
                className="text-gray-500 dark:text-gray-400 mt-2 text-right transition-colors duration-300"
                style={{ fontSize: `${fontSize * 0.875}px` }}
              >
                {numberToKorean(parseInt(principal.replace(/,/g, '')))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2 transition-colors duration-300">
              현재 수익률 (%)
            </label>
            <p
              className="text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-300"
              style={{ fontSize: `${fontSize * 0.75}px` }}
            >
              코인 가격이 얼마나 상승했는지 (예: 10% 상승했다면 10 입력)
            </p>
            <input
              type="number"
              inputMode="decimal"
              value={returnRate}
              onChange={(e) => setReturnRate(e.target.value)}
              placeholder="예: 2"
              step="0.1"
              className="w-full p-4 border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl text-right font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2 transition-colors duration-300">
              매도하려는 금액 (원)
            </label>
            <p
              className="text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-300"
              style={{ fontSize: `${fontSize * 0.75}px` }}
            >
              현재 코인 가격 기준으로 팔고 싶은 금액 (매도 수수료 계산 기준)
            </p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={sellAmount}
              onChange={(e) => handleNumberInput(e.target.value, setSellAmount)}
              placeholder="예: 10,000,000"
              className="w-full p-4 border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl text-right font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-300"
            />
            {sellAmount && (
              <div
                className="text-gray-500 dark:text-gray-400 mt-2 text-right transition-colors duration-300"
                style={{ fontSize: `${fontSize * 0.875}px` }}
              >
                {numberToKorean(parseInt(sellAmount.replace(/,/g, '')))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-3 transition-colors duration-300">
              거래 마켓
            </label>
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-300"
            >
              <option value="KRW">KRW 마켓 (0.05%)</option>
              <option value="BTC">BTC 마켓 (0.25%)</option>
              <option value="USDT">USDT 마켓 (0.25%)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeWithdrawal"
              checked={includeWithdrawal}
              onChange={(e) => setIncludeWithdrawal(e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 transition-colors duration-300"
            />
            <label
              htmlFor="includeWithdrawal"
              className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300"
            >
              원화 출금 수수료 포함 (1,000원)
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={calculateProfit}
              className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-4 px-6 rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
            >
              계산하기
            </button>
            <button
              onClick={reset}
              className="bg-gray-400 dark:bg-slate-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-gray-500 dark:hover:bg-slate-500 transition-colors duration-300"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 표시 */}
      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 transition-colors duration-300 border border-gray-100 dark:border-slate-700">
          <h2
            className="font-bold text-gray-800 dark:text-white mb-4 text-center transition-colors duration-300"
            style={{ fontSize: `${fontSize * 1.25}px` }}
          >
            업비트 수수료 반영 계산 결과
          </h2>

          <div className="space-y-4">
            {/* 수수료 정보 */}
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border-l-4 border-red-500 transition-colors duration-300 border dark:border-red-800">
              <div className="text-red-700 dark:text-red-300 font-semibold mb-2 transition-colors duration-300">
                수수료 내역
              </div>
              <div
                className="space-y-1"
                style={{ fontSize: `${fontSize * 0.875}px` }}
              >
                <div className="flex justify-between">
                  <span className="text-red-600 dark:text-red-400 transition-colors duration-300">
                    매도 수수료 (매도금액 기준):
                  </span>
                  <span className="font-medium text-red-800 dark:text-red-200 transition-colors duration-300">
                    {formatNumber(Math.round(result.sellFee))}원
                  </span>
                </div>
                {includeWithdrawal && (
                  <div className="flex justify-between">
                    <span className="text-red-600 dark:text-red-400 transition-colors duration-300">
                      출금 수수료:
                    </span>
                    <span className="font-medium text-red-800 dark:text-red-200 transition-colors duration-300">
                      {formatNumber(result.withdrawalFee)}원
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border-l-4 border-green-500 transition-colors duration-300 border dark:border-green-800">
              <div className="text-green-700 dark:text-green-300 font-semibold mb-1 transition-colors duration-300">
                수수료 차감 후 실제 수익
              </div>
              <div
                className="font-bold text-green-800 dark:text-green-200 transition-colors duration-300"
                style={{ fontSize: `${fontSize * 1.5}px` }}
              >
                {formatNumber(Math.round(result.actualProfitAfterFees))}원
              </div>
              <div
                className="text-green-600 dark:text-green-400 mt-1 transition-colors duration-300"
                style={{ fontSize: `${fontSize * 0.875}px` }}
              >
                {numberToKorean(Math.round(result.actualProfitAfterFees))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl transition-colors duration-300 border border-blue-100 dark:border-blue-800">
              <div className="text-blue-700 dark:text-blue-300 font-semibold mb-2 transition-colors duration-300">
                상세 정보
              </div>
              <div
                className="space-y-2"
                style={{ fontSize: `${fontSize * 0.875}px` }}
              >
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
                    수수료 제외 전체 수익:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {formatNumber(Math.round(result.totalProfit))}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    수수료 제외 전 매도 수익:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {formatNumber(Math.round(result.actualProfit))}원
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl transition-colors duration-300 border border-gray-100 dark:border-slate-600">
              <div className="text-gray-700 dark:text-gray-300 font-semibold mb-2 transition-colors duration-300">
                매도 후 보유 자산
              </div>
              <div
                className="space-y-2"
                style={{ fontSize: `${fontSize * 0.875}px` }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    남은 총 자산:
                  </span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {formatNumber(Math.round(result.remainingTotal))}원
                    </div>
                    <div
                      className="text-gray-500 dark:text-gray-400 transition-colors duration-300"
                      style={{ fontSize: `${fontSize * 0.75}px` }}
                    >
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
    </div>
  );
}
