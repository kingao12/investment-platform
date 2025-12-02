// src/app/lib/supabase.js
'use client';

import { createClient } from '@supabase/supabase-js';

// .env.local 에 설정해 둔 환경변수
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ------------------------------------------------------
// db: Supabase 쿼리를 감싸는 래퍼 (useSupabase 훅에서 사용)
// ------------------------------------------------------
export const db = {
  // 포트폴리오 관련 메서드
  portfolios: {
    async getAll() {
      return supabase
        .from('portfolios')
        .select('id, name, description, user_id, created_at, updated_at');
    },
    async getByUserId(userId) {
      return supabase
        .from('portfolios')
        .select('id, name, description, user_id, created_at, updated_at')
        .eq('user_id', userId);
    },
    async getById(id) {
      return supabase
        .from('portfolios')
        .select('id, name, description, user_id, created_at, updated_at')
        .eq('id', id)
        .single();
    },
    async create(data) {
      return supabase.from('portfolios').insert(data).select().single();
    },
    async update(id, data) {
      return supabase
        .from('portfolios')
        .update(data)
        .eq('id', id)
        .select()
        .single();
    },
    async delete(id) {
      return supabase.from('portfolios').delete().eq('id', id);
    },
  },

  // 투자(Investments) 관련 메서드
  investments: {
    async getAll() {
      return supabase
        .from('investments')
        .select('id, symbol, name, asset_type, portfolio_id, created_at, updated_at, transactions(*)');
    },
    async getByPortfolioId(portfolioId) {
      return supabase
        .from('investments')
        .select('id, symbol, name, asset_type, portfolio_id, created_at, updated_at, transactions(*)')
        .eq('portfolio_id', portfolioId);
    },
    async create(data) {
      return supabase.from('investments').insert(data).select().single();
    },
    async update(id, data) {
      return supabase
        .from('investments')
        .update(data)
        .eq('id', id)
        .select()
        .single();
    },
    async delete(id) {
      return supabase.from('investments').delete().eq('id', id);
    },
  },

  // 거래(Transactions) 관련 메서드
  transactions: {
    async getAll() {
      return supabase
        .from('transactions')
        .select(
          'id, type, quantity, price, total_amount, fee, date, note, investment_id, created_at, updated_at'
        );
    },
    async getByInvestmentId(investmentId) {
      return supabase
        .from('transactions')
        .select(
          'id, type, quantity, price, total_amount, fee, date, note, investment_id, created_at, updated_at'
        )
        .eq('investment_id', investmentId);
    },
    async create(data) {
      return supabase.from('transactions').insert(data).select().single();
    },
    async update(id, data) {
      return supabase
        .from('transactions')
        .update(data)
        .eq('id', id)
        .select()
        .single();
    },
    async delete(id) {
      return supabase.from('transactions').delete().eq('id', id);
    },
  },
};

// ------------------------------------------------------
// calculations: 수익률/자산 배분 등 계산 유틸 (useSupabase 훅에서 import)
// ------------------------------------------------------
export const calculations = {
  // 거래 배열 기준 순투자금 계산
  calculatePortfolioMetrics(transactions = []) {
    let totalInvested = 0;

    transactions.forEach((t) => {
      const amount = Number(t.total_amount ?? 0);
      if (t.type === 'BUY') {
        totalInvested += amount;
      } else if (t.type === 'SELL') {
        totalInvested -= amount;
      }
    });

    return {
      totalInvested,
    };
  },

  // 현재 가치와 총 투자금으로 수익률 계산 (퍼센트)
  calculateROI(currentValue, totalInvested) {
    if (!totalInvested) return 0;
    const roi = ((currentValue - totalInvested) / totalInvested) * 100;
    return Number(roi.toFixed(2));
  },

  // 실현 손익: SELL 거래들의 total_amount 합으로 단순 계산
  calculateRealizedGain(transactions = []) {
    return transactions
      .filter((t) => t.type === 'SELL')
      .reduce((sum, t) => sum + Number(t.total_amount ?? 0), 0);
  },

  // 자산군별 비중 계산
  // investments: 각 investment 가 transactions 를 포함하고 있다고 가정
  calculateAssetAllocation(investments = []) {
    const result = {};

    investments.forEach((inv) => {
      const type = inv.asset_type || 'OTHER';
      if (!result[type]) {
        result[type] = { type, value: 0 };
      }

      const metrics = this.calculatePortfolioMetrics(inv.transactions || []);
      result[type].value += metrics.totalInvested;
    });

    return result;
  },
};
