'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';

export default function CryptoChartPage() {
  const [selectedCrypto, setSelectedCrypto] = useState('BTCUSDT');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(false);

  // 다크모드 감지
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // 인기 코인 목록
  const cryptoList = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: '86,700', change: '+2.5%', isPositive: true },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: '2,800', change: '+1.8%', isPositive: true },
    { symbol: 'BNBUSDT', name: 'BNB', price: '845', change: '-0.5%', isPositive: false },
    { symbol: 'SOLUSDT', name: 'Solana', price: '130', change: '+4.2%', isPositive: true },
    { symbol: 'XRPUSDT', name: 'Ripple', price: '2', change: '+1.1%', isPositive: true },
    { symbol: 'ADAUSDT', name: 'Cardano', price: '0.4140', change: '-2.3%', isPositive: false },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', price: '0.065', change: '+3.0%', isPositive: true },
    { symbol: 'USDCUSDT', name: 'USDC', price: '1', change: '0.0%', isPositive: false },
  ];

  const filteredCryptos = cryptoList.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // TradingView 차트 로드
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${selectedCrypto}`,
          interval: 'D',
          timezone: 'Asia/Seoul',
          theme: isDark ? 'dark' : 'light',
          style: '1',
          locale: 'kr',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_chart',
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [selectedCrypto, isDark]);

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${textColor}`}>코인 차트</h1>
            <p className={textSecondary}>실시간 암호화폐 시세 및 차트</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            <span>새로고침</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 코인 목록 사이드바 */}
          <div className={`${cardBg} rounded-xl shadow-lg p-4 border ${borderColor} lg:col-span-1`}>
            <div className="mb-4">
              <div className="relative">
                <Search className={`absolute left-3 top-3 ${textSecondary}`} size={18} />
                <input
                  type="text"
                  placeholder="코인 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className={`text-sm font-semibold ${textSecondary} mb-3`}>인기 코인</h3>
              {filteredCryptos.map((crypto) => (
                <button
                  key={crypto.symbol}
                  onClick={() => setSelectedCrypto(crypto.symbol)}
                  className={`w-full p-3 rounded-lg transition-all ${
                    selectedCrypto === crypto.symbol
                      ? 'bg-blue-600 text-white'
                      : `${cardBg} hover:bg-gray-100 dark:hover:bg-gray-700 border ${borderColor}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-semibold">{crypto.name}</p>
                      <p className="text-xs opacity-70">{crypto.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${crypto.price}</p>
                      <p className={`text-xs flex items-center ${crypto.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {crypto.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {crypto.change}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 차트 영역 */}
          <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor} lg:col-span-3`}>
            <div className="mb-4">
              <h2 className={`text-2xl font-bold mb-2 ${textColor}`}>
                {cryptoList.find(c => c.symbol === selectedCrypto)?.name || 'Bitcoin'}
              </h2>
              <p className={textSecondary}>BINANCE:{selectedCrypto}</p>
            </div>

            {/* TradingView 차트 */}
            <div className="rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <div id="tradingview_chart" style={{ height: '100%' }}></div>
            </div>

            {/* 도미넌스 정보 */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border ${borderColor}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>BTC 도미넌스</p>
                <p className={`text-xl font-bold ${textColor}`}>59.10%</p>
              </div>
              <div className={`p-4 rounded-lg border ${borderColor}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>ETH 도미넌스</p>
                <p className={`text-xl font-bold ${textColor}`}>11.72%</p>
              </div>
              <div className={`p-4 rounded-lg border ${borderColor}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>24시간 거래량</p>
                <p className={`text-xl font-bold ${textColor}`}>$102B</p>
              </div>
              <div className={`p-4 rounded-lg border ${borderColor}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>시가총액</p>
                <p className={`text-xl font-bold ${textColor}`}>$3.2T</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}