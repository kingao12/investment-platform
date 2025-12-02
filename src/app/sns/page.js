'use client';

import React, { useState, useEffect } from 'react';
import { Twitter, MessageCircle, TrendingUp, Heart, Repeat2, Share2, ExternalLink, Languages, Filter } from 'lucide-react';

export default function SNSPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showTranslation, setShowTranslation] = useState({});
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

  const filters = [
    { id: 'all', label: '전체' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'reddit', label: 'Reddit' },
    { id: 'trending', label: '트렌딩' },
  ];

  const feeds = [
    {
      id: 1,
      platform: 'twitter',
      author: 'Elon Musk',
      username: '@elonmusk',
      avatar: 'https://i.pravatar.cc/150?img=11',
      content: 'Tesla AI Day 2024 will be epic! 🚀 Full Self-Driving v12 is revolutionary. The future is autonomous.',
      contentKr: '테슬라 AI 데이 2024는 대단할 것입니다! 🚀 완전 자율주행 v12는 혁명적입니다. 미래는 자율주행입니다.',
      timestamp: '1시간 전',
      likes: 125000,
      retweets: 34000,
      replies: 8900,
      trending: true,
      tags: ['TSLA', 'AI', '자율주행'],
    },
    {
      id: 2,
      platform: 'twitter',
      author: 'Cathie Wood',
      username: '@CathieDWood',
      avatar: 'https://i.pravatar.cc/150?img=12',
      content: 'Bitcoin breaking $90K is just the beginning. Institutional adoption accelerating faster than expected. 📈',
      contentKr: '비트코인이 9만 달러를 돌파한 것은 시작에 불과합니다. 기관 채택이 예상보다 빠르게 가속화되고 있습니다. 📈',
      timestamp: '3시간 전',
      likes: 89000,
      retweets: 23000,
      replies: 5600,
      trending: true,
      tags: ['BTC', '비트코인', '암호화폐'],
    },
    {
      id: 3,
      platform: 'reddit',
      author: 'WallStreetBets',
      username: 'r/wallstreetbets',
      avatar: 'https://i.pravatar.cc/150?img=13',
      content: 'NVIDIA earnings beat expectations! AI chip demand is insane. To the moon! 🚀🌕',
      contentKr: 'NVIDIA 실적이 예상을 뛰어넘었습니다! AI 칩 수요가 미쳤습니다. 달나라로! 🚀🌕',
      timestamp: '5시간 전',
      likes: 45000,
      retweets: 12000,
      replies: 3400,
      trending: true,
      tags: ['NVDA', 'AI', '반도체'],
    },
  ];

  const filteredFeeds = feeds.filter(feed => {
    if (activeTab === 'all') return true;
    if (activeTab === 'trending') return feed.trending;
    return feed.platform === activeTab;
  });

  const toggleTranslation = (id) => {
    setShowTranslation(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} p-6`}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${textColor}`}>SNS 피드</h1>
          <p className={textSecondary}>투자 관련 실시간 소셜 미디어 피드</p>
        </div>

        <div className={`${cardBg} rounded-xl shadow-lg p-4 border ${borderColor} mb-6`}>
          <div className="flex items-center space-x-2 mb-3">
            <Filter size={20} className={textSecondary} />
            <span className="font-medium">필터:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveTab(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === filter.id
                    ? 'bg-blue-600 text-white'
                    : `${cardBg} hover:bg-gray-100 dark:hover:bg-gray-700 border ${borderColor}`
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`${cardBg} rounded-xl shadow-lg p-4 border ${borderColor} mb-6`}>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp size={20} className="text-orange-500" />
            <span className="font-semibold">트렌딩 토픽</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['#TSLA', '#BTC', '#NVDA', '#AI', '#ETH', '#Fed'].map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                  isDark ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredFeeds.map((feed) => (
            <div
              key={feed.id}
              className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor} hover:shadow-2xl transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img src={feed.avatar} alt={feed.author} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className={`font-semibold ${textColor}`}>{feed.author}</p>
                      {feed.platform === 'twitter' && <Twitter size={16} className="text-blue-400" />}
                      {feed.trending && (
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                          isDark ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-600'
                        }`}>
                          🔥 트렌딩
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${textSecondary}`}>
                      {feed.username} · {feed.timestamp}
                    </p>
                  </div>
                </div>
                <button className={textSecondary}>
                  <ExternalLink size={20} />
                </button>
              </div>

              <div className="mb-4">
                <p className={`text-base leading-relaxed mb-3 ${textColor}`}>
                  {showTranslation[feed.id] ? feed.contentKr : feed.content}
                </p>
                <button
                  onClick={() => toggleTranslation(feed.id)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Languages size={16} />
                  <span>{showTranslation[feed.id] ? '원문 보기' : '한글 번역'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {feed.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className={`flex items-center justify-between pt-4 border-t ${borderColor}`}>
                <button className={`flex items-center space-x-2 ${textSecondary} hover:text-pink-600 transition-colors`}>
                  <Heart size={18} />
                  <span className="text-sm font-medium">{(feed.likes / 1000).toFixed(0)}K</span>
                </button>
                <button className={`flex items-center space-x-2 ${textSecondary} hover:text-green-600 transition-colors`}>
                  <Repeat2 size={18} />
                  <span className="text-sm font-medium">{(feed.retweets / 1000).toFixed(0)}K</span>
                </button>
                <button className={`flex items-center space-x-2 ${textSecondary} hover:text-blue-600 transition-colors`}>
                  <MessageCircle size={18} />
                  <span className="text-sm font-medium">{(feed.replies / 1000).toFixed(1)}K</span>
                </button>
                <button className={`flex items-center space-x-2 ${textSecondary} hover:text-blue-600 transition-colors`}>
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}