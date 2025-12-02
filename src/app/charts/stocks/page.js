'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, RefreshCw, BarChart3 } from 'lucide-react';

export default function StockChartPage() {
  const [selectedStock, setSelectedStock] = useState('NASDAQ:AAPL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('popular');

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

  // 인기 주식 목록
  const popularStocks = [
    { symbol: 'NASDAQ:AAPL', name: 'Apple', ticker: 'AAPL', price: '271', change: '+1.97%', isPositive: true },
    { symbol: 'NASDAQ:MSFT', name: 'Microsoft', ticker: 'MSFT', price: '472.12', change: '-1.32%', isPositive: false },
    { symbol: 'NASDAQ:GOOGL', name: 'Google', ticker: 'GOOGL', price: '300', change: '+3.53%', isPositive: true },
    { symbol: 'NASDAQ:TSLA', name: 'Tesla', ticker: 'TSLA', price: '391.09', change: '+1.5%', isPositive: true },
    { symbol: 'NASDAQ:NVDA', name: 'NVIDIA', ticker: 'NVDA', price: '178.80', change: '-0.97%', isPositive: false },
    { symbol: 'NASDAQ:META', name: 'Meta', ticker: 'META', price: '594.30', change: '+0.87%', isPositive: true },
  ];

  // 주요 지수
  const indices = [
    { symbol: 'NASDAQ:IXIC', name: '나스닥 종합지수', ticker: 'NASDAQ', price: '22,273.08', change: '+0.88%', isPositive: true },
    { symbol: 'FOREXCOM:SPXUSD', name: 'S&P 500', ticker: 'SPX', price: '6,614.5', change: '+1.25%', isPositive: true },
    { symbol: 'FOREXCOM:DJI', name: '다우존스', ticker: 'DJI', price: '46,303.5', change: '+1.19%', isPositive: true },
  ];

  const currentList = activeTab === 'popular' ? popularStocks : indices;
  const filteredStocks = currentList.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
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
          symbol: selectedStock,
          interval: 'D',
          timezone: 'Asia/Seoul',
          theme: isDark ? 'dark' : 'light',
          style: '1',
          locale: 'kr',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_stock_chart',
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: ['MASimple@tv-basicstudies'],
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [selectedStock, isDark]);

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
            <h1 className={`text-3xl font-bold mb-2 ${textColor}`}>주식 차트</h1>
            <p className={textSecondary}>실시간 주식 시세 및 증시 지수</p>
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
          {/* 주식 목록 사이드바 */}
          <div className={`${cardBg} rounded-xl shadow-lg p-4 border ${borderColor} lg:col-span-1`}>
            {/* 탭 */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setActiveTab('popular')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'popular'
                    ? 'bg-blue-600 text-white'
                    : `${cardBg} ${textColor} hover:bg-gray-100 dark:hover:bg-gray-700`
                }`}
              >
                인기 주식
              </button>
              <button
                onClick={() => setActiveTab('indices')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'indices'
                    ? 'bg-blue-600 text-white'
                    : `${cardBg} ${textColor} hover:bg-gray-100 dark:hover:bg-gray-700`
                }`}
              >
                주요 지수
              </button>
            </div>

            {/* 검색 */}
            <div className="mb-4">
              <div className="relative">
                <Search className={`absolute left-3 top-3 ${textSecondary}`} size={18} />
                <input
                  type="text"
                  placeholder="종목명, 티커 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            {/* 주식 목록 */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock.symbol)}
                  className={`w-full p-3 rounded-lg transition-all ${
                    selectedStock === stock.symbol
                      ? 'bg-blue-600 text-white'
                      : `${cardBg} hover:bg-gray-100 dark:hover:bg-gray-700 border ${borderColor}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-semibold text-sm">{stock.name}</p>
                      <p className="text-xs opacity-70">{stock.ticker}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">${stock.price}</p>
                      <p className={`text-xs flex items-center justify-end ${stock.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {stock.change}
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
                {currentList.find(s => s.symbol === selectedStock)?.name || 'Apple'}
              </h2>
              <p className={textSecondary}>{selectedStock}</p>
            </div>

            {/* TradingView 차트 */}
            <div className="rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <div id="tradingview_stock_chart" style={{ height: '100%' }}></div>
            </div>

            {/* 시장 정보 */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border ${borderColor}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>시가</p>
                <p className={`text-xl font-bold ${textColor}`}>$178.50</p>
              </div>
              <div className={`p-4 rounded-lg border ${borderColor}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>고가</p>
                <p className="text-xl font-bold text-green-500">$180.23</p>
              </div>
              <div className={`p-4 rounded-lg border ${borderColor}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>저가</p>
                <p className="text-xl font-bold text-red-500">$177.12</p>
              </div>
              <div className={`p-4 rounded-lg border ${borderColor}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>거래량</p>
                <p className={`text-xl font-bold ${textColor}`}>54.2M</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}