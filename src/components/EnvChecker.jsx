'use client';

import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function EnvChecker({ children }) {
  const [isConfigured, setIsConfigured] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);
    
    if (!configured) {
      console.error('❌ Supabase 환경변수가 설정되지 않았습니다!');
    } else {
      console.log('✅ Supabase 정상 설정됨');
    }
  }, []);

  // 서버 사이드 렌더링 중에는 체크 안 함
  if (!mounted) {
    return children;
  }

  // 환경변수가 설정되지 않았을 때
  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center">
            {/* 경고 아이콘 */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
              <svg
                className="h-8 w-8 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* 제목 */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ⚙️ 환경변수 설정 필요
            </h3>

            {/* 설명 */}
            <div className="text-left space-y-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Supabase 환경변수가 설정되지 않아 인증 및 데이터베이스 기능을 사용할 수 없습니다.
              </p>

              {/* 필요한 환경변수 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">
                  📋 필요한 환경변수:
                </p>
                <div className="space-y-2">
                  <div className="font-mono text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-blue-600 dark:text-blue-400">NEXT_PUBLIC_SUPABASE_URL</span>
                    <span className="text-gray-500 dark:text-gray-500">=</span>
                    <span className="text-green-600 dark:text-green-400">https://your-project.supabase.co</span>
                  </div>
                  <div className="font-mono text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-blue-600 dark:text-blue-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                    <span className="text-gray-500 dark:text-gray-500">=</span>
                    <span className="text-green-600 dark:text-green-400">your_anon_key</span>
                  </div>
                </div>
              </div>

              {/* 설정 방법 */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-sm text-blue-900 dark:text-blue-300 mb-2">
                  🔧 Vercel 설정 방법:
                </p>
                <ol className="text-xs text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside">
                  <li>Vercel 대시보드 → 프로젝트 선택</li>
                  <li>Settings → Environment Variables</li>
                  <li>위 환경변수 2개 추가</li>
                  <li>Production, Preview, Development 모두 체크</li>
                  <li>Save 후 재배포 (Redeploy)</li>
                </ol>
              </div>

              {/* Supabase 정보 확인 */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <p className="font-semibold text-sm text-purple-900 dark:text-purple-300 mb-2">
                  🔑 Supabase 정보 확인:
                </p>
                <ol className="text-xs text-purple-800 dark:text-purple-400 space-y-1 list-decimal list-inside">
                  <li>https://supabase.com 로그인</li>
                  <li>프로젝트 선택 → Settings → API</li>
                  <li>Project URL 복사</li>
                  <li>anon public 키 복사</li>
                </ol>
              </div>
            </div>

            {/* 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L24 24H0L12 0z" />
                </svg>
                Vercel 대시보드
              </a>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
                Supabase 대시보드
              </a>
            </div>

            {/* 로컬 개발 안내 */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 로컬 개발 시: 프로젝트 루트에 <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">.env.local</code> 파일 생성
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}