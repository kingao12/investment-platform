'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Bell, Moon, Sun, Globe, Shield, Bookmark, FileText, LogOut, Trash2, Camera, Save } from 'lucide-react';

export default function ProfilePage() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const [userInfo, setUserInfo] = useState({
    name: '비트 엘카이',
    email: 'investor@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    joinDate: '2024-01-15',
    bio: '장기 가치투자를 추구하는 개인투자자입니다.',
  });

  const [notifications, setNotifications] = useState({
    news: true,
    portfolio: true,
    community: false,
    trading: true,
    email: false,
  });

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('ko');

  const myPosts = [
    { id: 1, title: '테슬라 주가 분석 - 4분기 실적 발표 후 전망', date: '2024-11-20', likes: 156 },
    { id: 2, title: '배당주 포트폴리오 공유합니다', date: '2024-11-15', likes: 98 },
    { id: 3, title: '초보 투자자를 위한 ETF 가이드', date: '2024-11-10', likes: 234 },
  ];

  const bookmarkedPosts = [
    { id: 1, title: 'NVIDIA vs AMD - AI 칩 시장 경쟁 분석', author: 'AI투자전문가', date: '2024-11-18' },
    { id: 2, title: '비트코인 9만 달러 돌파! 다음 목표는?', author: '코인러버', date: '2024-11-19' },
  ];

  const tabs = [
    { id: 'profile', label: '프로필 설정', icon: User },
    { id: 'notifications', label: '알림 설정', icon: Bell },
    { id: 'appearance', label: '화면 설정', icon: Moon },
    { id: 'posts', label: '작성 글 관리', icon: FileText },
    { id: 'bookmarks', label: '북마크', icon: Bookmark },
    { id: 'security', label: '보안 설정', icon: Shield },
  ];

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${textColor}`}>내정보 관리</h1>
          <p className={textSecondary}>계정 설정 및 개인정보 관리</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className={`${cardBg} rounded-xl shadow-lg p-4 border ${borderColor} lg:col-span-1 h-fit`}>
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}

              <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-red-600 mt-4 ${
                isDark ? 'hover:bg-red-900' : 'hover:bg-red-50'
              }`}>
                <LogOut size={20} />
                <span className="font-medium">로그아웃</span>
              </button>
            </div>
          </div>

          <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor} lg:col-span-3`}>
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className={`text-2xl font-bold ${textColor}`}>프로필 설정</h2>

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img src={userInfo.avatar} alt="Profile" className="w-24 h-24 rounded-full" />
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div>
                    <p className={`font-semibold text-lg ${textColor}`}>{userInfo.name}</p>
                    <p className={`text-sm ${textSecondary}`}>가입일: {userInfo.joinDate}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>이름</label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>이메일</label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>소개</label>
                    <textarea
                      value={userInfo.bio}
                      onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                    />
                  </div>

                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    <Save size={20} />
                    <span>저장하기</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className={`text-2xl font-bold ${textColor}`}>알림 설정</h2>

                <div className="space-y-4">
                  {[
                    { key: 'news', label: '뉴스 알림', desc: '중요 경제 뉴스 알림 받기' },
                    { key: 'portfolio', label: '포트폴리오 알림', desc: '포트폴리오 변동 알림' },
                    { key: 'community', label: '커뮤니티 알림', desc: '댓글 및 좋아요 알림' },
                    { key: 'trading', label: '거래 알림', desc: '매매일지 관련 알림' },
                    { key: 'email', label: '이메일 알림', desc: '이메일로 알림 받기' },
                  ].map((item) => (
                    <div key={item.key} className={`flex items-center justify-between p-4 rounded-lg border ${borderColor}`}>
                      <div>
                        <p className={`font-semibold ${textColor}`}>{item.label}</p>
                        <p className={`text-sm ${textSecondary}`}>{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className={`text-2xl font-bold ${textColor}`}>화면 설정</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className={`font-semibold mb-3 ${textColor}`}>테마</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'light', label: '라이트', icon: Sun },
                        { id: 'dark', label: '다크', icon: Moon },
                        { id: 'auto', label: '자동', icon: Globe },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setTheme(item.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              theme === item.id
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                                : `border-gray-200 dark:border-gray-700 hover:border-blue-400`
                            }`}
                          >
                            <Icon className="mx-auto mb-2" size={32} />
                            <p className={`font-medium ${textColor}`}>{item.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-semibold mb-3 ${textColor}`}>언어</h3>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="ko">한국어</option>
                      <option value="en">English</option>
                      <option value="ja">日本語</option>
                      <option value="zh">中文</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="it">Italiano</option>
                      <option value="ru">Русский</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-6">
                <h2 className={`text-2xl font-bold ${textColor}`}>작성 글 관리</h2>

                <div className="space-y-3">
                  {myPosts.map((post) => (
                    <div key={post.id} className={`p-4 rounded-lg border ${borderColor} hover:shadow-md transition-shadow`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${textColor}`}>{post.title}</h4>
                          <p className={`text-sm ${textSecondary}`}>
                            {post.date} · 좋아요 {post.likes}
                          </p>
                        </div>
                        <button className={`p-2 rounded-lg transition-colors text-red-600 ${isDark ? 'hover:bg-red-900' : 'hover:bg-red-100'}`}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-6">
                <h2 className={`text-2xl font-bold ${textColor}`}>북마크</h2>

                <div className="space-y-3">
                  {bookmarkedPosts.map((post) => (
                    <div key={post.id} className={`p-4 rounded-lg border ${borderColor} hover:shadow-md transition-shadow`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${textColor}`}>{post.title}</h4>
                          <p className={`text-sm ${textSecondary}`}>
                            {post.author} · {post.date}
                          </p>
                        </div>
                        <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                          <Bookmark size={18} className="fill-current text-blue-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className={`text-2xl font-bold ${textColor}`}>보안 설정</h2>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>현재 비밀번호</label>
                    <input
                      type="password"
                      placeholder="현재 비밀번호"
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>새 비밀번호</label>
                    <input
                      type="password"
                      placeholder="새 비밀번호"
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>새 비밀번호 확인</label>
                    <input
                      type="password"
                      placeholder="새 비밀번호 확인"
                      className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    <Lock size={20} />
                    <span>비밀번호 변경</span>
                  </button>
                </div>

                <div className={`mt-8 p-4 rounded-lg border-2 ${isDark ? 'border-red-700 bg-red-900' : 'border-red-300 bg-red-50'}`}>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-red-300' : 'text-red-600'}`}>위험 구역</h3>
                  <p className={`text-sm mb-3 ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                    회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    <Trash2 size={18} />
                    <span>회원 탈퇴</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} rounded-xl shadow-2xl p-6 w-full max-w-md`}>
              <h2 className={`text-2xl font-bold mb-4 text-red-600`}>회원 탈퇴</h2>
              <p className={`${textSecondary} mb-6`}>
                정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`flex-1 px-6 py-3 border rounded-lg transition-colors ${borderColor} ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    alert('회원 탈퇴가 완료되었습니다. (임시)');
                    setShowDeleteModal(false);
                  }}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}