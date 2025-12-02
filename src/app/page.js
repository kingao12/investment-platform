'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, BarChart3, DollarSign, Users, Newspaper } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);

  // 다크모드 감지
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // DOM 변경 감지
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  
  return (
    <div className={`p-6 ${bgColor} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
          <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>홈</h2>
          
          <div className="space-y-6">
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${cardBg} border ${borderColor} p-6 rounded-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${textSecondary}`}>코인 시세</p>
                    <p className={`text-2xl font-bold mt-2 ${textColor}`}>BTC</p>
                    <p className="text-green-500 text-sm mt-1">+2.5%</p>
                  </div>
                  <TrendingUp className="text-blue-500" size={40} />
                </div>
              </div>
              
              <div className={`${cardBg} border ${borderColor} p-6 rounded-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${textSecondary}`}>나스닥</p>
                    <p className={`text-2xl font-bold mt-2 ${textColor}`}>19,456</p>
                    <p className="text-red-500 text-sm mt-1">-0.8%</p>
                  </div>
                  <BarChart3 className="text-purple-500" size={40} />
                </div>
              </div>
              
              <div className={`${cardBg} border ${borderColor} p-6 rounded-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${textSecondary}`}>내 수익률</p>
                    <p className={`text-2xl font-bold mt-2 ${textColor}`}>+15.2%</p>
                    <p className="text-green-500 text-sm mt-1">+$3,420</p>
                  </div>
                  <DollarSign className="text-green-500" size={40} />
                </div>
              </div>
            </div>

            {/* 최신 뉴스 */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>최신 뉴스</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`border ${borderColor} ${cardBg} p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer`}>
                    <h4 className={`font-medium mb-2 ${textColor}`}>테슬라, 새로운 전기차 모델 공개 예정</h4>
                    <p className={`text-sm ${textSecondary}`}>2024년 4분기 출시 목표로 개발 중...</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${textSecondary}`}>2시간 전</span>
                      <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>테크</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 빠른 이동 */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>빠른 이동</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/charts/crypto">
                  <div className={`${cardBg} border ${borderColor} p-4 rounded-lg transition-colors cursor-pointer text-center ${isDark ? 'hover:bg-blue-900' : 'hover:bg-blue-50'}`}>
                    <TrendingUp className="mx-auto mb-2 text-blue-600" size={32} />
                    <p className={`font-medium text-sm ${textColor}`}>코인 차트</p>
                  </div>
                </Link>
                <Link href="/charts/stocks">
                  <div className={`${cardBg} border ${borderColor} p-4 rounded-lg transition-colors cursor-pointer text-center ${isDark ? 'hover:bg-purple-900' : 'hover:bg-purple-50'}`}>
                    <BarChart3 className="mx-auto mb-2 text-purple-600" size={32} />
                    <p className={`font-medium text-sm ${textColor}`}>주식 차트</p>
                  </div>
                </Link>
                <Link href="/news">
                  <div className={`${cardBg} border ${borderColor} p-4 rounded-lg transition-colors cursor-pointer text-center ${isDark ? 'hover:bg-green-900' : 'hover:bg-green-50'}`}>
                    <Newspaper className="mx-auto mb-2 text-green-600" size={32} />
                    <p className={`font-medium text-sm ${textColor}`}>뉴스</p>
                  </div>
                </Link>
                <Link href="/community">
                  <div className={`${cardBg} border ${borderColor} p-4 rounded-lg transition-colors cursor-pointer text-center ${isDark ? 'hover:bg-orange-900' : 'hover:bg-orange-50'}`}>
                    <Users className="mx-auto mb-2 text-orange-600" size={32} />
                    <p className={`font-medium text-sm ${textColor}`}>커뮤니티</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}