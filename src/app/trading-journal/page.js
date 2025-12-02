'use client';

import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Calendar, DollarSign, Filter, Edit, Trash2, Tag } from 'lucide-react';

export default function TradingJournalPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterTag, setFilterTag] = useState('all');
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

  const tags = ['all', '단타', '스윙', '장기투자', '손절', '익절'];

  const trades = [
    {
      id: 1,
      date: '2024-11-20',
      symbol: 'AAPL',
      name: 'Apple',
      type: 'buy',
      quantity: 10,
      buyPrice: 178.50,
      sellPrice: 182.30,
      profit: 38.00,
      profitRate: 2.13,
      tag: '스윙',
      memo: '실적 발표 전 매수, 목표가 도달로 익절',
      status: 'closed',
    },
    {
      id: 2,
      date: '2024-11-19',
      symbol: 'TSLA',
      name: 'Tesla',
      type: 'buy',
      quantity: 5,
      buyPrice: 242.00,
      sellPrice: null,
      profit: 0,
      profitRate: 0,
      tag: '장기투자',
      memo: '전기차 시장 성장 기대',
      status: 'open',
    },
    {
      id: 3,
      date: '2024-11-18',
      symbol: 'NVDA',
      name: 'NVIDIA',
      type: 'buy',
      quantity: 8,
      buyPrice: 495.00,
      sellPrice: 510.20,
      profit: 121.60,
      profitRate: 3.07,
      tag: '단타',
      memo: 'AI 칩 수요 급증 뉴스 후 매수',
      status: 'closed',
    },
    {
      id: 4,
      date: '2024-11-17',
      symbol: 'MSFT',
      name: 'Microsoft',
      type: 'buy',
      quantity: 6,
      buyPrice: 378.00,
      sellPrice: 374.50,
      profit: -21.00,
      profitRate: -0.93,
      tag: '손절',
      memo: '예상과 다른 실적, 손절 진행',
      status: 'closed',
    },
  ];

  const filteredTrades = trades.filter(trade => 
    filterTag === 'all' || trade.tag === filterTag
  );

  const totalProfit = trades
    .filter(t => t.status === 'closed')
    .reduce((sum, t) => sum + t.profit, 0);
  
  const totalInvested = trades.reduce((sum, t) => sum + (t.buyPrice * t.quantity), 0);
  const totalProfitRate = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(2) : 0;

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${textColor}`}>매매일지</h1>
            <p className={textSecondary}>거래 내역을 기록하고 분석하세요</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg"
          >
            <Plus size={20} />
            <span>거래 추가</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>총 거래</p>
                <p className={`text-2xl font-bold mt-2 ${textColor}`}>{trades.length}</p>
              </div>
              <Calendar className="text-blue-500" size={40} />
            </div>
          </div>

          <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>진행 중</p>
                <p className={`text-2xl font-bold mt-2 ${textColor}`}>
                  {trades.filter(t => t.status === 'open').length}
                </p>
              </div>
              <TrendingUp className="text-green-500" size={40} />
            </div>
          </div>

          <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>총 수익</p>
                <p className={`text-2xl font-bold mt-2 ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${totalProfit.toFixed(2)}
                </p>
              </div>
              <DollarSign className={totalProfit >= 0 ? 'text-green-500' : 'text-red-500'} size={40} />
            </div>
          </div>

          <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${textSecondary}`}>수익률</p>
                <p className={`text-2xl font-bold mt-2 ${totalProfitRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalProfitRate}%
                </p>
              </div>
              {totalProfitRate >= 0 ? (
                <TrendingUp className="text-green-500" size={40} />
              ) : (
                <TrendingDown className="text-red-500" size={40} />
              )}
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-xl shadow-lg p-4 border ${borderColor} mb-6`}>
          <div className="flex items-center space-x-2 mb-2">
            <Filter size={20} className={textSecondary} />
            <span className="font-medium">태그 필터:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterTag === tag
                    ? 'bg-blue-600 text-white'
                    : `${cardBg} hover:bg-gray-100 dark:hover:bg-gray-700 border ${borderColor}`
                }`}
              >
                {tag === 'all' ? '전체' : tag}
              </button>
            ))}
          </div>
        </div>

        <div className={`${cardBg} rounded-xl shadow-lg border ${borderColor} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} border-b ${borderColor}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>날짜</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>종목</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>수량</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>매수가</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>매도가</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>수익</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>수익률</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>태그</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>상태</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade) => (
                  <tr key={trade.id} className={`border-b ${borderColor} ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 text-sm ${textColor}`}>{trade.date}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className={`font-semibold ${textColor}`}>{trade.symbol}</p>
                        <p className={`text-xs ${textSecondary}`}>{trade.name}</p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${textColor}`}>{trade.quantity}</td>
                    <td className={`px-6 py-4 text-sm ${textColor}`}>${trade.buyPrice}</td>
                    <td className={`px-6 py-4 text-sm ${textColor}`}>
                      {trade.sellPrice ? `$${trade.sellPrice}` : '-'}
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold ${
                      trade.profit > 0 ? 'text-green-500' : trade.profit < 0 ? 'text-red-500' : textColor
                    }`}>
                      {trade.profit !== 0 ? `$${trade.profit.toFixed(2)}` : '-'}
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold ${
                      trade.profitRate > 0 ? 'text-green-500' : trade.profitRate < 0 ? 'text-red-500' : textColor
                    }`}>
                      {trade.profitRate !== 0 ? `${trade.profitRate}%` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {trade.tag}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        trade.status === 'open' 
                          ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'
                          : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {trade.status === 'open' ? '진행중' : '완료'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
                          <Edit size={16} />
                        </button>
                        <button className={`p-2 rounded-lg transition-colors text-red-600 ${isDark ? 'hover:bg-red-900' : 'hover:bg-red-100'}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
              <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>거래 추가</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>종목 코드</label>
                    <input
                      type="text"
                      placeholder="예: AAPL"
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>종목명</label>
                    <input
                      type="text"
                      placeholder="예: Apple"
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>거래 날짜</label>
                    <input
                      type="date"
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>수량</label>
                    <input
                      type="number"
                      placeholder="10"
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>매수가</label>
                    <input
                      type="number"
                      placeholder="178.50"
                      step="0.01"
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>매도가 (선택)</label>
                    <input
                      type="number"
                      placeholder="182.30"
                      step="0.01"
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>태그</label>
                  <select className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                    <option value="">선택하세요</option>
                    <option value="단타">단타</option>
                    <option value="스윙">스윙</option>
                    <option value="장기투자">장기투자</option>
                    <option value="손절">손절</option>
                    <option value="익절">익절</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>메모</label>
                  <textarea
                    placeholder="거래 이유, 전략 등을 기록하세요"
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className={`flex-1 px-6 py-3 border rounded-lg transition-colors ${borderColor} ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('거래가 추가되었습니다! (임시)');
                      setShowAddModal(false);
                    }}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    추가하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}