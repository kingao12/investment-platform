'use client';

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, BookmarkPlus, Share2, ExternalLink, Filter } from 'lucide-react';

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
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

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'popular', label: '인기뉴스' },
    { id: 'tech', label: '테크' },
    { id: 'finance', label: '금융' },
    { id: 'crypto', label: '암호화폐' },
    { id: 'market', label: '시장분석' },
  ];

  const newsData = [
    {
      id: 1,
      title: '한국-미국 정상회담 개최… 인공지능·반도체 협력 강화 합의',
      summary: '양국 정상은 AI 안전성, 반도체 공급망, 군사 협력 확대에 합의했습니다.',
      category: 'politics',
      source: 'Yonhap News',
      time: '10분 전',
      image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400',
      ticker: null,
      views: '920',
      isPopular: true,
    },
    {
      id: 2,
      title: '삼성전자, 차세대 AI 반도체 공개… 글로벌 시장 선점 노린다',
      summary: '삼성전자는 3nm 기반 AI 가속 칩을 발표하며 경쟁사 대비 우위를 강조했습니다.',
      category: 'tech',
      source: 'Bloomberg',
      time: '20분 전',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
      ticker: '005930.KS',
      views: '1.4K',
      isPopular: true,
    },
    {
      id: 3,
      title: 'NVIDIA, AI 서버 수요 폭증으로 또 최고가 경신',
      summary: 'AI 데이터센터 투자 확대가 실적을 강하게 견인했습니다.',
      category: 'tech',
      source: 'Reuters',
      time: '28분 전',
      image: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400',
      ticker: 'NVDA',
      views: '2.2K',
      isPopular: true,
    },
    {
      id: 4,
      title: '비트코인 9만 3천 달러 돌파… ETF 자금 유입 지속',
      summary: '미국 기관의 매수세가 계속되며 BTC가 다시 최고가를 돌파했습니다.',
      category: 'crypto',
      source: 'CoinDesk',
      time: '30분 전',
      image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400',
      ticker: 'BTC',
      views: '3.1K',
      isPopular: true,
    },
    {
      id: 5,
      title: '중국, 한국에 반도체 공급 규제 완화 시사',
      summary: '양국 간 산업 협력 회복의 시그널로 해석되고 있습니다.',
      category: 'politics',
      source: 'Nikkei Asia',
      time: '35분 전',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
      ticker: null,
      views: '1.1K',
      isPopular: false,
    },
    {
      id: 6,
      title: 'OpenAI, GPT-6 연구 방향 공개… 멀티모달 AI 강화',
      summary: '자율 추론 기능과 강화된 안전성이 핵심이라고 발표했습니다.',
      category: 'tech',
      source: 'The Verge',
      time: '40분 전',
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400',
      ticker: null,
      views: '2.8K',
      isPopular: true,
    },
    {
      id: 7,
      title: '엔비디아·TSMC·삼성, 글로벌 AI 공급망 구축 협의',
      summary: 'AI 칩 패키징 수요가 폭증하며 3사가 전략적 논의를 시작했습니다.',
      category: 'industry',
      source: 'Financial Times',
      time: '50분 전',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
      ticker: null,
      views: '780',
      isPopular: false,
    },
    {
      id: 8,
      title: '이더리움 거래량 급증… 스테이킹 비중 사상 최고치',
      summary: '스테이킹 비율이 새 이정표를 달성하며 가격 변동성이 완화되는 양상입니다.',
      category: 'crypto',
      source: 'CryptoNews',
      time: '1시간 전',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
      ticker: 'ETH',
      views: '1.7K',
      isPopular: false,
    },
    {
      id: 9,
      title: '일본, AI 규제 완화 발표… 글로벌 기업 유치 계획',
      summary: 'AI 스타트업 투자 확대와 외국 기업 규제 완화를 중심으로 개편이 이루어졌습니다.',
      category: 'politics',
      source: 'NHK',
      time: '1시간 10분 전',
      image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=400',
      ticker: null,
      views: '540',
      isPopular: false,
    },
   {
      id: 10,
      title: '한국 증시, AI·반도체 주도 상승… 외국인 순매수 확대',
      summary: 'AI 업종 중심으로 외국인 자금 유입이 이어지고 있습니다.',
      category: 'finance',
      source: 'Korea Economic Daily',
      time: '1시간 25분 전',
      image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400',
      ticker: 'KOSPI',
      views: '860',
      isPopular: false,
    },
    {
      id: 11,
      title: '구글, 차세대 AI 모델 출시 임박… Gemini 후속 모델 개발 중',
      summary: '멀티모달 기능이 대폭 강화된 차세대 모델을 시험 중이라고 전했습니다.',
      category: 'tech',
      source: 'TechCrunch',
      time: '1시간 40분 전',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
      ticker: 'GOOGL',
      views: '1.2K',
      isPopular: true,
    },
    {
      id: 12,
      title: '한국-유럽연합, 수소 산업 협력 체계 구축',
      summary: '수소 생산·저장·운송 기술 협력을 포함한 MOU가 체결됐습니다.',
      category: 'industry',
      source: 'EU News',
      time: '2시간 전',
      image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=400',
      ticker: null,
      views: '690',
      isPopular: false,
    },
    {
      id: 13,
      title: '테슬라, 4분기 실적 발표… 시장 전망 상회',
      summary: '전기차 판매량 증가와 에너지 저장 부문 성장이 실적을 견인했습니다.',
      category: 'tech',
      source: 'Reuters',
      time: '2시간 15분 전',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
      ticker: 'TSLA',
      views: '1.2K',
      isPopular: true,
    },
    {
      id: 14,
      title: '한국, 차세대 군사 AI 시스템 연구에 예산 확대',
      summary: '국방부는 자율 드론, 인공지능 감시 체계 개발을 목표로 예산을 증액했습니다.',
      category: 'politics',
      source: 'Defense Times',
      time: '2시간 30분 전',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
      ticker: null,
      views: '750',
      isPopular: false,
    },
    {
      id: 15,
      title: '유럽 중앙은행, 금리 동결… 경기 둔화 우려',
      summary: '유럽 경기 회복 속도가 예상보다 느린 것으로 평가되었습니다.',
      category: 'finance',
      source: 'Financial Times',
      time: '2시간 40분 전',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      ticker: 'EURO',
      views: '980',
      isPopular: false,
    },
    {
      id: 16,
      title: '아마존, 드론 배송 서비스 도시 확장',
      summary: '신규 도시는 기존 대비 3배 규모로 확대된 환경 규제를 충족했다고 발표했습니다.',
      category: 'tech',
      source: 'CNBC',
      time: '3시간 전',
      image: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=400',
      ticker: 'AMZN',
      views: '1.3K',
      isPopular: false,
    },
    {
      id: 17,
      title: '비트코인 ETF, 사상 최대 일일 유입 기록',
      summary: '기관 투자자의 대규모 유입이 기록적 수치를 달성했습니다.',
      category: 'crypto',
      source: 'CoinTelegraph',
      time: '3시간 20분 전',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      ticker: 'BTC',
      views: '2.9K',
      isPopular: true,
    },
    {
      id: 18,
      title: '한국 정부, 로봇 산업 5년 육성 계획 발표',
      summary: '산업용·의료·서비스 로봇 분야에 대한 대대적 투자가 포함됩니다.',
      category: 'industry',
      source: 'Korean Gov Release',
      time: '3시간 50분 전',
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400',
      ticker: null,
      views: '610',
      isPopular: false,
    },
    {
      id: 19,
      title: '애플, Vision Pro 2 개발 진행… 2025년 출시 기대',
      summary: '무게 개선과 배터리 지속시간 강화를 목표로 하고 있습니다.',
      category: 'tech',
      source: 'TechCrunch',
      time: '4시간 전',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      ticker: 'AAPL',
      views: '890',
      isPopular: false,
    },
    {
      id: 20,
      title: '이더리움 스테이킹 보상률 상승… 투자자 관심 증가',
      summary: '연 4.5% 수준까지 상승하며 장기 보유자가 늘고 있습니다.',
      category: 'crypto',
      source: 'CryptoNews',
      time: '4시간 10분 전',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
      ticker: 'ETH',
      views: '1.5K',
      isPopular: false,
    },
    {
      id: 21,
      title: '한국-호주 외교장관 회담… 방산·AI 협력 논의',
      summary: '두 나라는 광물 공급망과 AI 안전성 협력을 강화하기로 했습니다.',
      category: 'politics',
      source: 'Yonhap',
      time: '4시간 30분 전',
      image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400',
      ticker: null,
      views: '760',
      isPopular: false,
    },
    {
      id: 22,
      title: '전기차 배터리 가격 하락세 지속… 산업 구조 변화',
      summary: '리튬 가격 안정과 공급 증가로 주요 업체 경쟁 구도가 변하고 있습니다.',
      category: 'industry',
      source: 'Bloomberg',
      time: '5시간 전',
      image: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400',
      ticker: null,
      views: '940',
      isPopular: false,
    },
    {
      id: 23,
      title: '미국 상원, AI 규제 초안 발표… 빅테크 영향 주목',
      summary: '규제 강도에 따라 글로벌 산업 판도 변화가 예상됩니다.',
      category: 'politics',
      source: 'Reuters',
      time: '5시간 22분 전',
      image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400',
      ticker: null,
      views: '1.1K',
      isPopular: true,
    },
    {
      id: 24,
      title: '중국 증시 반등… AI·반도체 테마 급등세',
      summary: '정부의 산업 지원 발표가 시장 심리에 긍정적으로 작용했습니다.',
      category: 'finance',
      source: 'SCMP',
      time: '6시간 전',
      image: 'https://images.unsplash.com/photo-1506702315536-dd8b83e2dcf9?w=400',
      ticker: 'SSE',
      views: '680',
      isPopular: false,
    },
    {
      id: 25,
      title: '전 세계 AI 데이터센터 전력 수요 급증',
      summary: '전력 부족 문제와 친환경 에너지 전환 속도가 주요 이슈로 떠오르고 있습니다.',
      category: 'industry',
      source: 'Bloomberg',
      time: '6시간 30분 전',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
      ticker: null,
      views: '1.6K',
      isPopular: true,
    },
    {
      id: 26,
      title: '러시아-유럽 관계 긴장 고조… 에너지 공급 불확실성 확대',
      summary: '천연가스 공급 문제가 다시 부각되며 리스크가 커지고 있습니다.',
      category: 'politics',
      source: 'BBC',
      time: '7시간 전',
      image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=400',
      ticker: null,
      views: '1.3K',
      isPopular: false,
    },
    {
    id: 27,
      title: '메타, AI 아바타 기술 공개… 실시간 생성 가능',
      summary: '차세대 소셜 플랫폼 경쟁이 본격화될 것으로 보입니다.',
      category: 'tech',
      source: 'The Verge',
      time: '7시간 40분 전',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
      ticker: 'META',
      views: '990',
      isPopular: false,
    },
    {
      id: 28,
      title: '유가 소폭 하락… 글로벌 경기 둔화 우려 영향',
      summary: '수요 둔화와 공급 증가가 가격 하락 요인으로 분석됩니다.',
      category: 'finance',
      source: 'WSJ',
      time: '8시간 전',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
      ticker: 'WTI',
      views: '700',
      isPopular: false,
    },
    {
      id: 29,
      title: '한국 스타트업, AI 기반 신약 개발 플랫폼 투자 유치',
      summary: '글로벌 VC가 참여하며 성장 가능성이 높게 평가되었습니다.',
      category: 'tech',
      source: 'StartupDaily',
      time: '8시간 20분 전',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
      ticker: null,
      views: '540',
      isPopular: false,
    },
    {
      id: 30,
      title: '유럽, 친환경 배터리 정책 강화 발표',
      summary: '재활용 비율 확대와 탄소 배출 규제가 핵심입니다.',
      category: 'industry',
      source: 'EU Commission',
      time: '9시간 전',
      image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=400',
      ticker: null,
      views: '480',
      isPopular: false,
    },
  ];


  const filteredNews = newsData.filter(news => {
    const matchesCategory = activeCategory === 'all' || 
                           (activeCategory === 'popular' && news.isPopular) ||
                           news.category === activeCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.ticker.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${textColor}`}>실시간 뉴스</h1>
          <p className={textSecondary}>최신 경제 및 투자 뉴스</p>
        </div>

        <div className={`${cardBg} rounded-xl shadow-lg p-4 border ${borderColor} mb-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-3 ${textSecondary}`} size={20} />
              <input
                type="text"
                placeholder="뉴스, 기업명, 티커 검색 (예: NVDA, 엔비디아)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              <Search size={20} />
              <span>검색</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : `${cardBg} hover:bg-gray-100 dark:hover:bg-gray-700 border ${borderColor}`
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className={`${cardBg} rounded-xl shadow-lg overflow-hidden border ${borderColor} hover:shadow-2xl transition-shadow cursor-pointer`}
            >
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {news.isPopular && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <TrendingUp size={14} className="mr-1" />
                    인기
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {news.ticker}
                </div>
              </div>

              <div className="p-4">
                <div className={`flex items-center justify-between mb-2 text-xs ${textSecondary}`}>
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {news.time}
                  </span>
                  <span>{news.views} 조회</span>
                </div>

                <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${textColor}`}>{news.title}</h3>
                <p className={`text-sm ${textSecondary} mb-3 line-clamp-2`}>
                  {news.summary}
                </p>

                <div className={`flex items-center justify-between pt-3 border-t ${borderColor}`}>
                  <span className={`text-xs ${textSecondary}`}>{news.source}</span>
                  <div className="flex items-center space-x-2">
                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <BookmarkPlus size={16} />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <Share2 size={16} />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className={`${cardBg} rounded-xl shadow-lg p-12 border ${borderColor} text-center`}>
            <p className={`${textSecondary} text-lg`}>검색 결과가 없습니다.</p>
            <p className={`${textSecondary} text-sm mt-2`}>다른 검색어를 입력해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}