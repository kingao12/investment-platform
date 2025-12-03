// src/app/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolios } from '@/hooks/useSupabase';
import { format } from '@/lib/supabase';
import { PlusCircle, Briefcase, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [showNewPortfolio, setShowNewPortfolio] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    
    if (!id) {
      router.push('/login');
    } else {
      setUserId(id);
      setUserName(name || '사용자');
    }
  }, [router]);

  const {
    portfolios,
    loading,
    error,
    createPortfolio,
    deletePortfolio,
  } = usePortfolios(userId);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  const handleCreatePortfolio = async () => {
    if (!newPortfolio.name.trim()) {
      alert('포트폴리오 이름을 입력해주세요.');
      return;
    }

    const result = await createPortfolio({
      ...newPortfolio,
      user_id: userId,
    });

    if (result.success) {
      setShowNewPortfolio(false);
      setNewPortfolio({ name: '', description: '' });
      alert('포트폴리오가 생성되었습니다!');
    } else {
      alert('포트폴리오 생성에 실패했습니다: ' + result.error);
    }
  };

  const handleDeletePortfolio = async (id, name) => {
    if (!confirm(`"${name}" 포트폴리오를 삭제하시겠습니까?`)) return;

    const result = await deletePortfolio(id);
    
    if (result.success) {
      alert('포트폴리오가 삭제되었습니다.');
    } else {
      alert('삭제에 실패했습니다: ' + result.error);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dashboard-page">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Investment Tracker
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              안녕하세요, {userName}님!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 
                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <LogOut size={20} />
            로그아웃
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 포트폴리오 추가 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => setShowNewPortfolio(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg 
                     hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            <PlusCircle size={20} />
            새 포트폴리오 생성
          </button>
        </div>

        {/* 새 포트폴리오 폼 */}
        {showNewPortfolio && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              새 포트폴리오
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  포트폴리오 이름
                </label>
                <input
                  type="text"
                  value={newPortfolio.name}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 
                           text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           transition"
                  placeholder="예: 배당주 포트폴리오"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  설명 (선택사항)
                </label>
                <textarea
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 
                           text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           transition"
                  placeholder="포트폴리오에 대한 간단한 설명..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreatePortfolio}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg 
                           hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                >
                  생성하기
                </button>
                <button
                  onClick={() => {
                    setShowNewPortfolio(false);
                    setNewPortfolio({ name: '', description: '' });
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg 
                           hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400">로딩 중...</div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 
                        rounded-lg p-4 text-red-700 dark:text-red-400">
            에러: {error}
          </div>
        )}

        {/* 포트폴리오 목록 */}
        {!loading && !error && portfolios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 
                         hover:shadow-lg dark:hover:shadow-gray-600 transition p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {portfolio.name}
                    </h3>
                    {portfolio.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {portfolio.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">투자 종목</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {portfolio.investments?.length || 0}개
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">생성일</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {format.date(portfolio.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/portfolio/${portfolio.id}`)}
                    className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg 
                             hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                  >
                    상세보기
                  </button>
                  <button
                    onClick={() => handleDeletePortfolio(portfolio.id, portfolio.name)}
                    className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg 
                             hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 포트폴리오 없음 */}
        {!loading && !error && portfolios.length === 0 && !showNewPortfolio && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700">
            <Briefcase size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              포트폴리오가 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              첫 번째 포트폴리오를 생성해보세요
            </p>
            <button
              onClick={() => setShowNewPortfolio(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              <PlusCircle size={20} />
              포트폴리오 생성
            </button>
          </div>
        )}
      </main>
    </div>
  );
}