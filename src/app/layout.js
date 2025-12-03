'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { useState, useEffect } from 'react';
import { Home, TrendingUp, BarChart3, Users, BookOpen, DollarSign, Newspaper, Calendar, Bell, User, Menu, X, Sun, Moon, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 🔥 다크모드 설정 로드 (localStorage에서)
  useEffect(() => {
    setMounted(true);
    const savedDarkMode = localStorage.getItem('darkMode');
    console.log('🔍 로드된 darkMode:', savedDarkMode);
    if (savedDarkMode !== null) {
      const isDark = savedDarkMode === 'true';
      console.log('✅ 적용할 다크모드:', isDark);
      setDarkMode(isDark);
    } else {
      // localStorage에 없으면 기본값: 라이트 모드
      console.log('💡 기본값 적용: 라이트 모드');
      setDarkMode(false);
      localStorage.setItem('darkMode', 'false');
    }
  }, []);

  // 🔥 다크모드 변경시 HTML 클래스 직접 업데이트
  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        console.log('🌙 다크모드 클래스 추가됨');
      } else {
        document.documentElement.classList.remove('dark');
        console.log('☀️ 다크모드 클래스 제거됨');
      }
    }
  }, [darkMode, mounted]);

  // 🔥 다크모드 변경시 localStorage에 저장
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    console.log('🌓 다크모드 전환:', darkMode ? '다크→라이트' : '라이트→다크');
    console.log('📦 저장될 값:', newDarkMode);
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    console.log('✅ localStorage 저장 완료:', localStorage.getItem('darkMode'));
  };

  const menuItems = [
    { id: 'home', icon: Home, label: '홈', path: '/' },
    { id: 'crypto-chart', icon: TrendingUp, label: '코인 차트', path: '/charts/crypto' },
    { id: 'stock-chart', icon: BarChart3, label: '주식 차트', path: '/charts/stocks' },
    { id: 'community', icon: Users, label: '커뮤니티', path: '/community' },
    { id: 'journal', icon: BookOpen, label: '매매일지', path: '/trading-journal' },
    { id: 'portfolio', icon: DollarSign, label: '수익률 관리', path: '/portfolio' },
    { id: 'news', icon: Newspaper, label: '뉴스', path: '/news' },
    { id: 'calendar', icon: Calendar, label: '경제 캘린더', path: '/calendar' },
    { id: 'sns', icon: Bell, label: 'SNS 피드', path: '/sns' },
    { id: 'profile', icon: User, label: '내정보', path: '/profile' },
  ];

  const isHomePage = pathname === '/';

  // 🔥 SSR 깜빡임 방지 (hydration 완료 전까지 기본 스타일 표시)
  if (!mounted) {
    return (
      <html lang="ko">
        <body className={`${inter.className} bg-gray-50 text-gray-900`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-600">로딩 중...</div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="ko" className={darkMode ? 'dark' : ''}>
      <body className={`${inter.className} ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Header */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-50`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              {!isHomePage && (
                <button
                  onClick={() => router.push('/')}
                  className={`p-2 rounded-lg flex items-center space-x-2 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ArrowLeft size={20} />
                  <span className="hidden md:inline text-sm font-medium">홈으로</span>
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                  투자정보 플랫폼
                </h1>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`hidden md:flex items-center rounded-lg px-4 py-2 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="뉴스, 종목명, 티커 검색..."
                  className={`bg-transparent border-none outline-none ml-2 w-64 ${
                    darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => router.push('/login')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User size={18} />
                <span className="hidden md:inline">로그인</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex min-h-screen">
          {sidebarOpen && (
            <aside className={`w-64 border-r ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link key={item.id} href={item.path}>
                      <div className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : darkMode 
                            ? 'hover:bg-gray-700 text-gray-200' 
                            : 'hover:bg-gray-100 text-gray-900'
                      }`}>
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          )}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}