'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Users, Award, Plus, Share2 } from 'lucide-react';

export default function PortfolioPage() {
  const [isDark, setIsDark] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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

  const portfolioData = {
    totalValue: 125430.50,
    totalInvested: 100000,
    totalProfit: 25430.50,
    profitRate: 25.43,
    dayChange: 1234.50,
    dayChangeRate: 0.99,
  };

  const monthlyData = [
    { month: '1월', profit: 2000, rate: 2.0 },
    { month: '2월', profit: 3500, rate: 3.5 },
    { month: '3월', profit: -1200, rate: -1.2 },
    { month: '4월', profit: 4800, rate: 4.8 },
    { month: '5월', profit: 2200, rate: 2.2 },
    { month: '6월', profit: 5600, rate: 5.6 },
  ];

  const holdings = [
    { symbol: 'AAPL', name: 'Apple', quantity: 50, avgPrice: 170.00, currentPrice: 178.50, value: 8925, profit: 425, profitRate: 5.0 },
    { symbol: 'TSLA', name: 'Tesla', quantity: 30, avgPrice: 240.00, currentPrice: 248.50, value: 7455, profit: 255, profitRate: 3.54 },
    { symbol: 'NVDA', name: 'NVIDIA', quantity: 20, avgPrice: 480.00, currentPrice: 510.00, value: 10200, profit: 600, profitRate: 6.25 },
    { symbol: 'MSFT', name: 'Microsoft', quantity: 25, avgPrice: 370.00, currentPrice: 378.00, value: 9450, profit: 200, profitRate: 2.16 },
    { symbol: 'BTC', name: 'Bitcoin', quantity: 0.5, avgPrice: 85000, currentPrice: 92000, value: 46000, profit: 3500, profitRate: 8.24 },
  ];

  const assetAllocation = [
    { name: '주식', value: 36030, percent: 44 },
    { name: '암호화폐', value: 46000, percent: 56 },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  const rankings = [
    { rank: 1, name: '투자고수123', profit: 45230, profitRate: 45.23, avatar: 'https://i.pravatar.cc/150?img=1' },
    { rank: 2, name: '코인러버', profit: 38450, profitRate: 38.45, avatar: 'https://i.pravatar.cc/150?img=2' },
    { rank: 3, name: '나', profit: 25430, profitRate: 25.43, avatar: 'https://i.pravatar.cc/150?img=3', isMe: true },
    { rank: 4, name: 'AI투자전문가', profit: 22100, profitRate: 22.10, avatar: 'https://i.pravatar.cc/150?img=4' },
    { rank: 5, name: '장기투자러', profit: 18900, profitRate: 18.90, avatar: 'https://i.pravatar.cc/150?img=5' },
  ];

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
            <h1 className={`text-3xl font-bold mb-2 ${textColor}`}>수익률 관리</h1>
            <p className={textSecondary}>포트폴리오 현황 및 수익률 분석</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg"
            >
              <Plus size={20} />
              <span>종목 추가</span>
            </button>
            <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-lg">
              <Share2 size={20} />
              <span>공유하기</span>
            </button>
          </div>
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : `${cardBg} hover:bg-gray-100 dark:hover:bg-gray-700 border ${borderColor}`
            }`}
          >
            포트폴리오
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'ranking'
                ? 'bg-blue-600 text-white'
                : `${cardBg} hover:bg-gray-100 dark:hover:bg-gray-700 border ${borderColor}`
            }`}
          >
            순위 배틀
          </button>
        </div>

        {activeTab === 'overview' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm ${textSecondary}`}>총 자산</p>
                  <DollarSign className="text-blue-500" size={24} />
                </div>
                <p className={`text-2xl font-bold ${textColor}`}>${portfolioData.totalValue.toLocaleString()}</p>
                <p className={`text-xs ${textSecondary} mt-1`}>
                  투자금: ${portfolioData.totalInvested.toLocaleString()}
                </p>
              </div>

              <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm ${textSecondary}`}>총 수익</p>
                  <TrendingUp className="text-green-500" size={24} />
                </div>
                <p className="text-2xl font-bold text-green-500">
                  ${portfolioData.totalProfit.toLocaleString()}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  +{portfolioData.profitRate}%
                </p>
              </div>

              <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm ${textSecondary}`}>오늘 수익</p>
                  {portfolioData.dayChange >= 0 ? (
                    <TrendingUp className="text-green-500" size={24} />
                  ) : (
                    <TrendingDown className="text-red-500" size={24} />
                  )}
                </div>
                <p className={`text-2xl font-bold ${portfolioData.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${portfolioData.dayChange.toLocaleString()}
                </p>
                <p className={`text-xs mt-1 ${portfolioData.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolioData.dayChange >= 0 ? '+' : ''}{portfolioData.dayChangeRate}%
                </p>
              </div>

              <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm ${textSecondary}`}>보유 종목</p>
                  <Percent className="text-purple-500" size={24} />
                </div>
                <p className={`text-2xl font-bold ${textColor}`}>{holdings.length}</p>
                <p className={`text-xs ${textSecondary} mt-1`}>다양한 자산 보유</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
                <h3 className={`text-lg font-bold mb-4 ${textColor}`}>월별 수익률</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                    <XAxis dataKey="month" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                    <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                        color: isDark ? '#FFFFFF' : '#000000'
                      }}
                    />
                    <Bar dataKey="profit" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
                <h3 className={`text-lg font-bold mb-4 ${textColor}`}>자산 배분</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${cardBg} rounded-xl shadow-lg border ${borderColor} overflow-hidden`}>
              <div className={`p-6 border-b ${borderColor}`}>
                <h3 className={`text-lg font-bold ${textColor}`}>보유 종목</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>종목</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>수량</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>평균단가</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>현재가</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>평가금액</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>수익/손실</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>수익률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding) => (
                      <tr key={holding.symbol} className={`border-b ${borderColor} ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4">
                          <div>
                            <p className={`font-semibold ${textColor}`}>{holding.symbol}</p>
                            <p className={`text-xs ${textSecondary}`}>{holding.name}</p>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm ${textColor}`}>{holding.quantity}</td>
                        <td className={`px-6 py-4 text-sm ${textColor}`}>${holding.avgPrice.toFixed(2)}</td>
                        <td className={`px-6 py-4 text-sm ${textColor}`}>${holding.currentPrice.toFixed(2)}</td>
                        <td className={`px-6 py-4 text-sm font-semibold ${textColor}`}>${holding.value.toLocaleString()}</td>
                        <td className={`px-6 py-4 text-sm font-semibold ${holding.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${holding.profit.toFixed(2)}
                        </td>
                        <td className={`px-6 py-4 text-sm font-semibold ${holding.profitRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {holding.profit >= 0 ? '+' : ''}{holding.profitRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold flex items-center ${textColor}`}>
                  <Award className="mr-2 text-yellow-500" size={24} />
                  수익률 순위
                </h3>
                <p className={`text-sm ${textSecondary}`}>이번 달 기준</p>
              </div>

              <div className="space-y-4">
                {rankings.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      user.isMe 
                        ? isDark ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-300'
                        : borderColor
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                        user.rank === 1 ? 'bg-yellow-500 text-white' :
                        user.rank === 2 ? 'bg-gray-400 text-white' :
                        user.rank === 3 ? 'bg-orange-600 text-white' :
                        isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                      }`}>
                        {user.rank}
                      </div>

                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />

                      <div>
                        <p className={`font-semibold flex items-center ${textColor}`}>
                          {user.name}
                          {user.isMe && (
                            <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">나</span>
                          )}
                        </p>
                        <p className={`text-sm ${textSecondary}`}>수익: ${user.profit.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-500">+{user.profitRate}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} rounded-xl shadow-2xl p-6 w-full max-w-md`}>
              <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>종목 추가</h2>
              <form className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>종목 코드</label>
                  <input
                    type="text"
                    placeholder="예: AAPL"
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
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>평균 매수가</label>
                  <input
                    type="number"
                    placeholder="170.00"
                    step="0.01"
                    className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                      alert('종목이 추가되었습니다! (임시)');
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