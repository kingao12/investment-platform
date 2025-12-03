// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// 환경변수에서 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseKey);

// 🔥 간편한 데이터베이스 함수들
export const db = {
  // ===== Users =====
  users: {
    // 모든 사용자 가져오기
    getAll: async () => {
      const { data, error } = await supabase.from('users').select('*');
      return { data, error };
    },
    
    // ID로 사용자 찾기
    getById: async (id) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },
    
    // 이메일로 사용자 찾기
    getByEmail: async (email) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      return { data, error };
    },
    
    // 사용자 생성
    create: async (userData) => {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
      return { data, error };
    },
    
    // 사용자 업데이트
    update: async (id, updates) => {
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
    // 모든 포트폴리오 가져오기 (투자 내역 포함)
    getAll: async () => {
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
    
    // ID로 포트폴리오 가져오기
    getById: async (id) => {
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
    
    // 사용자별 포트폴리오
    getByUserId: async (userId) => {
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
    
    // 포트폴리오 생성
    create: async (portfolioData) => {
      const { data, error } = await supabase
        .from('portfolios')
        .insert([portfolioData])
        .select()
        .single();
      return { data, error };
    },
    
    // 포트폴리오 업데이트
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    
    // 포트폴리오 삭제
    delete: async (id) => {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);
      return { error };
    },
  },

  // ===== Investments =====
  investments: {
    // 모든 투자 가져오기
    getAll: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          portfolio:portfolios(*),
          transactions(*)
        `);
      return { data, error };
    },
    
    // 포트폴리오별 투자
    getByPortfolioId: async (portfolioId) => {
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          transactions(*)
        `)
        .eq('portfolio_id', portfolioId);
      return { data, error };
    },
    
    // 투자 생성
    create: async (investmentData) => {
      const { data, error } = await supabase
        .from('investments')
        .insert([investmentData])
        .select()
        .single();
      return { data, error };
    },
    
    // 투자 업데이트
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('investments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    
    // 투자 삭제
    delete: async (id) => {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);
      return { error };
    },
  },

  // ===== Transactions =====
  transactions: {
    // 모든 거래 가져오기
    getAll: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          investment:investments(*)
        `)
        .order('date', { ascending: false });
      return { data, error };
    },
    
    // 투자별 거래 내역
    getByInvestmentId: async (investmentId) => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('investment_id', investmentId)
        .order('date', { ascending: false });
      return { data, error };
    },
    
    // 거래 생성
    create: async (transactionData) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()
        .single();
      return { data, error };
    },
    
    // 거래 업데이트
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    
    // 거래 삭제
    delete: async (id) => {
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
  // 포트폴리오 메트릭 계산
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

  // 포트폴리오 수익률 계산
  portfolioROI: (totalValue, totalInvested) => {
    if (totalInvested === 0) return 0;
    return ((totalValue - totalInvested) / totalInvested) * 100;
  },
  
  // 평균 매입가 계산
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
  // 통화 포맷
  currency: (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  },
  
  // 퍼센트 포맷
  percent: (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  },
  
  // 날짜 포맷
  date: (date) => {
    return new Date(date).toLocaleDateString('ko-KR');
  },
};