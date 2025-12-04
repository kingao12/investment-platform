'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/supabase';
import { User, Mail, Calendar, Shield, LogOut, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) {
      router.push('/login');
    } else {
      setUserId(id);
      fetchUserData(id);
    }
  }, [router]);

  const fetchUserData = async (id) => {
    try {
      setLoading(true);
      
      // 사용자 정보 가져오기
      const userResult = await db.users.getById(id);
      if (userResult.error) throw userResult.error;
      
      setUser(userResult.data);
      setEditData({
        name: userResult.data.name || '',
        email: userResult.data.email || '',
      });

      const portfoliosResult = await db.portfolios.getByUserId(id);
      if (!portfoliosResult.error) {
        setPortfolioCount(portfoliosResult.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const result = await db.users.update(userId, editData);
      
      if (result.error) {
        alert('업데이트 실패: ' + result.error);
        return;
      }

      // localStorage 업데이트
      localStorage.setItem('userName', editData.name);
      
      alert('정보가 업데이트되었습니다!');
      setIsEditing(false);
      setUser(result.data);
    } catch (error) {
      alert('업데이트 중 오류가 발생했습니다.');
    }
  };
  
  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      router.push('/login');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('정말로 계정을 삭제하시겠습니까? 모든 포트폴리오와 데이터가 삭제됩니다.')) {
      return;
    }

    if (!confirm('이 작업은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      const result = await db.users.delete(userId);
      
      if (result.error) {
        alert('삭제 실패: ' + result.error);
        return;
      }

      alert('계정이 삭제되었습니다.');
      localStorage.clear();
      router.push('/login');
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-600">사용자 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            내 정보
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            계정 정보를 관리하세요
          </p>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name || '사용자'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">가입일</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(user.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={20} className="text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">포트폴리오</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {portfolioCount}개
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={20} className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">계정 상태</span>
              </div>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                활성
              </p>
            </div>
          </div>

          {/* 정보 수정 폼 */}
          {isEditing ? (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      name: user.name || '',
                      email: user.email || '',
                    });
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              정보 수정
            </button>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            <Shield size={20} />
            내 포트폴리오 보기
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition"
          >
            <LogOut size={20} />
            로그아웃
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <Trash2 size={20} />
            계정 삭제
          </button>
        </div>
      </div>
    </div>
  );
}