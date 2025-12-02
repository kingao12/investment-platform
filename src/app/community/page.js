'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, ThumbsUp, MessageCircle, Bookmark, Share2, TrendingUp, Clock, Eye, User } from 'lucide-react';

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showWriteModal, setShowWriteModal] = useState(false);
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
    { id: 'popular', label: '인기글' },
    { id: 'stock', label: '주식' },
    { id: 'crypto', label: '암호화폐' },
    { id: 'strategy', label: '투자전략' },
    { id: 'question', label: '질문' },
  ];

  const posts = [
    {
      id: 1,
      author: '투자고수123',
      avatar: 'https://i.pravatar.cc/150?img=1',
      title: '테슬라 주가 분석 - 4분기 실적 발표 후 전망',
      content: '테슬라의 4분기 실적이 예상보다 좋게 나왔습니다. 전기차 판매량이 증가하면서 주가가 상승할 것으로 보입니다...',
      category: 'stock',
      tags: ['TSLA', '주식분석', '실적'],
      likes: 156,
      comments: 42,
      views: 1234,
      time: '2시간 전',
      isPopular: true,
    },
    {
      id: 2,
      author: '코인러버',
      avatar: 'https://i.pravatar.cc/150?img=2',
      title: '비트코인 9만 달러 돌파! 다음 목표는?',
      content: '비트코인이 드디어 9만 달러를 돌파했습니다. 기관 투자자들의 매수세가 이어지고 있는데, 여러분 생각은 어떠신가요?',
      category: 'crypto',
      tags: ['BTC', '비트코인', '목표가'],
      likes: 243,
      comments: 67,
      views: 2145,
      time: '5시간 전',
      isPopular: true,
    },
    {
      id: 3,
      author: '초보투자자',
      avatar: 'https://i.pravatar.cc/150?img=3',
      title: '첫 투자 시작하려는데 조언 부탁드립니다',
      content: '안녕하세요. 투자를 처음 시작하려고 합니다. ETF부터 시작하는 게 좋을까요? 조언 부탁드립니다.',
      category: 'question',
      tags: ['초보', 'ETF', '질문'],
      likes: 34,
      comments: 28,
      views: 456,
      time: '8시간 전',
      isPopular: false,
    },
    {
      id: 4,
      author: 'AI투자전문가',
      avatar: 'https://i.pravatar.cc/150?img=4',
      title: 'NVIDIA vs AMD - AI 칩 시장 경쟁 분석',
      content: 'AI 칩 시장에서 NVIDIA와 AMD의 경쟁이 치열합니다. 각 회사의 강점과 투자 포인트를 분석해봤습니다.',
      category: 'stock',
      tags: ['NVDA', 'AMD', 'AI', '반도체'],
      likes: 189,
      comments: 53,
      views: 1876,
      time: '12시간 전',
      isPopular: true,
    },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'popular' && post.isPopular) ||
                         post.category === activeFilter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

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
            <h1 className={`text-3xl font-bold mb-2 ${textColor}`}>커뮤니티</h1>
            <p className={textSecondary}>투자자들과 정보를 공유하고 소통하세요</p>
          </div>
          <button
            onClick={() => setShowWriteModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg"
          >
            <Plus size={20} />
            <span>글쓰기</span>
          </button>
        </div>

        <div className={`${cardBg} rounded-xl shadow-lg p-4 border ${borderColor} mb-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-3 ${textSecondary}`} size={20} />
              <input
                type="text"
                placeholder="게시글, 태그 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : `${cardBg} hover:bg-gray-100 dark:hover:bg-gray-700 border ${borderColor}`
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor} hover:shadow-2xl transition-all cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className={`font-semibold ${textColor}`}>{post.author}</p>
                    <div className={`flex items-center space-x-2 text-xs ${textSecondary}`}>
                      <Clock size={14} />
                      <span>{post.time}</span>
                      <span>·</span>
                      <Eye size={14} />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
                {post.isPopular && (
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                    isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600'
                  }`}>
                    <TrendingUp size={14} />
                    <span>인기</span>
                  </div>
                )}
              </div>

              <h3 className={`text-xl font-bold mb-2 hover:text-blue-600 transition-colors ${textColor}`}>
                {post.title}
              </h3>
              <p className={`${textSecondary} mb-4 line-clamp-2`}>
                {post.content}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className={`flex items-center justify-between pt-4 border-t ${borderColor}`}>
                <div className="flex items-center space-x-4">
                  <button className={`flex items-center space-x-1 ${textSecondary} hover:text-blue-600 transition-colors`}>
                    <ThumbsUp size={18} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className={`flex items-center space-x-1 ${textSecondary} hover:text-blue-600 transition-colors`}>
                    <MessageCircle size={18} />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <Bookmark size={18} />
                  </button>
                  <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className={`${cardBg} rounded-xl shadow-lg p-12 border ${borderColor} text-center`}>
            <p className={`${textSecondary} text-lg`}>게시글이 없습니다.</p>
            <p className={`${textSecondary} text-sm mt-2`}>첫 번째 게시글을 작성해보세요!</p>
          </div>
        )}
      </div>

      {showWriteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-xl shadow-2xl p-6 w-full max-w-2xl`}>
            <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>새 게시글 작성</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="제목을 입력하세요"
                className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <textarea
                placeholder="내용을 입력하세요"
                rows={10}
                className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
              />
              <select className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                <option value="">카테고리 선택</option>
                <option value="stock">주식</option>
                <option value="crypto">암호화폐</option>
                <option value="strategy">투자전략</option>
                <option value="question">질문</option>
              </select>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWriteModal(false)}
                  className={`flex-1 px-6 py-3 rounded-lg transition-colors border ${borderColor} ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    alert('게시글이 작성되었습니다! (임시)');
                    setShowWriteModal(false);
                  }}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  작성하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}