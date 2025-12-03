// src/app/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await db.users.getByEmail(formData.email);
      
      if (result.error || !result.data) {
        setError('이메일 또는 비밀번호가 잘못되었습니다.');
        setLoading(false);
        return;
      }

      if (result.data.password !== formData.password) {
        setError('이메일 또는 비밀번호가 잘못되었습니다.');
        setLoading(false);
        return;
      }

      localStorage.setItem('userId', result.data.id);
      localStorage.setItem('userName', result.data.name);
      
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const existingUser = await db.users.getByEmail(formData.email);
      
      if (existingUser.data) {
        setError('이미 사용 중인 이메일입니다.');
        setLoading(false);
        return;
      }

      const result = await db.users.create({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (result.error) {
        setError('회원가입 중 오류가 발생했습니다.');
        setLoading(false);
        return;
      }

      alert('회원가입이 완료되었습니다!');
      setIsLogin(true);
      setFormData({ email: '', password: '', name: '' });
    } catch (err) {
      console.error('Signup error:', err);
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Investment Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? '로그인하여 포트폴리오를 관리하세요' : '새 계정을 만드세요'}
          </p>
        </div>

        {/* 탭 전환 */}
        <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-md transition ${
              isLogin
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 font-semibold shadow'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-md transition ${
              !isLogin
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 font-semibold shadow'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
          {/* 회원가입시 이름 입력 */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                이름
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 
                         text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                         focus:border-transparent
                         transition"
                placeholder="홍길동"
              />
            </div>
          )}

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                       focus:border-transparent
                       transition"
              placeholder="example@email.com"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                       focus:border-transparent
                       transition"
              placeholder="최소 6자 이상"
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold 
                     hover:bg-blue-700 dark:hover:bg-blue-600 
                     transition 
                     disabled:bg-gray-400 dark:disabled:bg-gray-600 
                     disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        {/* 테스트 안내 */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-300">
          <strong>💡 시작하기:</strong>
          <br />
          {isLogin ? (
            <>계정이 없으신가요? 먼저 회원가입을 해주세요!</>
          ) : (
            <>회원가입 후 로그인하여 포트폴리오를 만들어보세요!</>
          )}
        </div>
      </div>
    </div>
  );
}