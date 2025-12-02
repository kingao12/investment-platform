// src/app/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // true = 로그인, false = 회원가입
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 입력 변경 핸들러
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // 에러 초기화
  };

  // 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 이메일로 사용자 찾기
      const result = await db.users.getByEmail(formData.email);
      
      if (result.error || !result.data) {
        setError('이메일 또는 비밀번호가 잘못되었습니다.');
        setLoading(false);
        return;
      }

      // 비밀번호 확인 (실제로는 해시된 비밀번호와 비교해야 함)
      if (result.data.password !== formData.password) {
        setError('이메일 또는 비밀번호가 잘못되었습니다.');
        setLoading(false);
        return;
      }

      // 로그인 성공
      // 실제로는 JWT 토큰을 저장하거나 세션 관리를 해야 함
      localStorage.setItem('userId', result.data.id);
      localStorage.setItem('userName', result.data.name);
      
      // 대시보드로 이동
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 회원가입
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 이메일 중복 확인
      const existingUser = await db.users.getByEmail(formData.email);
      
      if (existingUser.data) {
        setError('이미 사용 중인 이메일입니다.');
        setLoading(false);
        return;
      }

      // 사용자 생성
      const result = await db.users.create({
        email: formData.email,
        password: formData.password, // 실제로는 해시해야 함
        name: formData.name,
      });

      if (result.error) {
        setError('회원가입 중 오류가 발생했습니다.');
        setLoading(false);
        return;
      }

      // 회원가입 성공
      alert('회원가입이 완료되었습니다!');
      setIsLogin(true); // 로그인 화면으로 전환
      setFormData({ email: '', password: '', name: '' });
    } catch (err) {
      console.error('Signup error:', err);
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Investment Tracker
          </h1>
          <p className="text-gray-600">
            {isLogin ? '로그인하여 포트폴리오를 관리하세요' : '새 계정을 만드세요'}
          </p>
        </div>

        {/* 탭 전환 */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md transition ${
              isLogin
                ? 'bg-white text-blue-600 font-semibold shadow'
                : 'text-gray-600'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md transition ${
              !isLogin
                ? 'bg-white text-blue-600 font-semibold shadow'
                : 'text-gray-600'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
          {/* 회원가입시 이름 입력 */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="홍길동"
              />
            </div>
          )}

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="최소 6자 이상"
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        {/* 테스트 안내 */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <strong>테스트 계정:</strong>
          <br />
          먼저 회원가입을 해주세요!
        </div>
      </div>
    </div>
  );
}