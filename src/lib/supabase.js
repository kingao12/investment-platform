// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// ===== 환경변수 체크 및 설정 =====
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ✅ 환경변수 검증
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다!');
  console.error('필요한 환경변수:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('\nVercel 대시보드 > Settings > Environment Variables에서 설정해주세요.');
}

// ✅ localStorage 안전하게 사용
const isBrowser = typeof window !== 'undefined';

// ✅ 커스텀 스토리지 어댑터 (localStorage 에러 방지)
const customStorageAdapter = {
  getItem: (key) => {
    try {
      if (!isBrowser) return null;
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage getItem 에러:', error.message);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (!isBrowser) return;
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.warn('localStorage setItem 에러:', error.message);
    }
  },
  removeItem: (key) => {
    try {
      if (!isBrowser) return;
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn('localStorage removeItem 에러:', error.message);
    }
  },
};

// ✅ Supabase 클라이언트 생성
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      storage: customStorageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token',
      flowType: 'pkce',
    },
    global: {
      headers: {
        'x-application-name': 'investment-platform',
      },
    },
  }
);

// ✅ 환경변수 검증 헬퍼 함수
export const isSupabaseConfigured = () => {
  return !!(
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseKey !== 'placeholder-key'
  );
};

// 🔥 간편한 데이터베이스 함수들
export const db = {
  // ===== Users =====
  users: {
    getAll: async () => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase.from('users').select('*');
      return { data, error };
    },
    
    getById: async (id) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },
    
    getByEmail: async (email) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      return { data, error };
    },
    
    create: async (userData) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
      return { data, error };
    },
    
    update: async (id, updates) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
  },

  // ===== Portfolios =====
  portfolios: {
    getAll: async () => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          user:users(*),
          investments(
            *,
            transactions(*)
          )
        `);
      return { data, error };
    },
    
    getById: async (id) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          user:users(*),
          investments(
            *,
            transactions(*)
          )
        `)
        .eq('id', id)
        .single();
      return { data, error };
    },
    
    getByUserId: async (userId) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          investments(
            *,
            transactions(*)
          )
        `)
        .eq('user_id', userId);
      return { data, error };
    },
    
    create: async (portfolioData) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('portfolios')
        .insert([portfolioData])
        .select()
        .single();
      return { data, error };
    },
    
    update: async (id, updates) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    
    delete: async (id) => {
      if (!isSupabaseConfigured()) {
        return { error: new Error('Supabase not configured') };
      }
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);
      return { error };
    },
  },

  // ===== Investments =====
  investments: {
    getAll: async () => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          portfolio:portfolios(*),
          transactions(*)
        `);
      return { data, error };
    },
    
    getByPortfolioId: async (portfolioId) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          transactions(*)
        `)
        .eq('portfolio_id', portfolioId);
      return { data, error };
    },
    
    create: async (investmentData) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('investments')
        .insert([investmentData])
        .select()
        .single();
      return { data, error };
    },
    
    update: async (id, updates) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('investments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    
    delete: async (id) => {
      if (!isSupabaseConfigured()) {
        return { error: new Error('Supabase not configured') };
      }
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);
      return { error };
    },
  },

  // ===== Transactions =====
  transactions: {
    getAll: async () => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          investment:investments(*)
        `)
        .order('date', { ascending: false });
      return { data, error };
    },
    
    getByInvestmentId: async (investmentId) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('investment_id', investmentId)
        .order('date', { ascending: false });
      return { data, error };
    },
    
    create: async (transactionData) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()
        .single();
      return { data, error };
    },
    
    update: async (id, updates) => {
      if (!isSupabaseConfigured()) {
        return { data: null, error: new Error('Supabase not configured') };
      }
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    
    delete: async (id) => {
      if (!isSupabaseConfigured()) {
        return { error: new Error('Supabase not configured') };
      }
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      return { error };
    },
  },
};

// 🧮 계산 헬퍼 함수들
export const calculate = {
  portfolioMetrics: (transactions) => {
    let totalInvested = 0;
    let totalShares = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'BUY') {
        totalInvested += tx.total_amount + (tx.fee || 0);
        totalShares += tx.quantity;
      } else if (tx.type === 'SELL') {
        const avgCost = totalInvested / totalShares;
        totalInvested -= avgCost * tx.quantity;
        totalShares -= tx.quantity;
      }
    });

    return {
      totalInvested,
      totalShares,
      avgCostPerShare: totalShares > 0 ? totalInvested / totalShares : 0,
    };
  },

  portfolioROI: (totalValue, totalInvested) => {
    if (totalInvested === 0) return 0;
    return ((totalValue - totalInvested) / totalInvested) * 100;
  },
  
  averageCost: (transactions) => {
    let totalAmount = 0;
    let totalQuantity = 0;
    
    transactions.forEach(tx => {
      if (tx.type === 'BUY') {
        totalAmount += tx.total_amount + (tx.fee || 0);
        totalQuantity += tx.quantity;
      }
    });
    
    return totalQuantity > 0 ? totalAmount / totalQuantity : 0;
  },
};

// 💰 포맷 함수들
export const format = {
  currency: (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  },
  
  percent: (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  },
  
  date: (date) => {
    return new Date(date).toLocaleDateString('ko-KR');
  },
};

// ✅ 인증 헬퍼 함수
export const authHelpers = {
  getCurrentUser: async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured');
      return null;
    }
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('사용자 조회 에러:', error);
      return null;
    }
  },

  getSession: async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured');
      return null;
    }
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('세션 조회 에러:', error);
      return null;
    }
  },

  signOut: async () => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('로그아웃 에러:', error);
      return { success: false, error: error.message };
    }
  },

  signIn: async (email, password) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase not configured') };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      console.error('로그인 에러:', error);
      return { data: null, error };
    }
  },

  signUp: async (email, password, userData) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase not configured') };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      return { data, error };
    } catch (error) {
      console.error('회원가입 에러:', error);
      return { data: null, error };
    }
  },
};