'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';

// 🔥 포트폴리오 훅
export function usePortfolios(userId = null) {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 가져오기
  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      let result;
      
      if (userId) {
        result = await db.portfolios.getByUserId(userId);
      } else {
        result = await db.portfolios.getAll();
      }

      if (result.error) throw result.error;
      
      setPortfolios(result.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [userId]);

  // 포트폴리오 생성
  const createPortfolio = async (portfolioData) => {
    try {
      const result = await db.portfolios.create(portfolioData);
      if (result.error) throw result.error;
      
      await fetchPortfolios(); // 새로고침
      return { success: true, data: result.data };
    } catch (err) {
      console.error('Error creating portfolio:', err);
      return { success: false, error: err.message };
    }
  };

  // 포트폴리오 업데이트
  const updatePortfolio = async (id, updates) => {
    try {
      const result = await db.portfolios.update(id, updates);
      if (result.error) throw result.error;
      
      await fetchPortfolios();
      return { success: true, data: result.data };
    } catch (err) {
      console.error('Error updating portfolio:', err);
      return { success: false, error: err.message };
    }
  };

  // 포트폴리오 삭제
  const deletePortfolio = async (id) => {
    try {
      const result = await db.portfolios.delete(id);
      if (result.error) throw result.error;
      
      await fetchPortfolios();
      return { success: true };
    } catch (err) {
      console.error('Error deleting portfolio:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    portfolios,
    loading,
    error,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    refresh: fetchPortfolios,
  };
}

// 🔥 투자 훅
export function useInvestments(portfolioId = null) {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      let result;

      if (portfolioId) {
        result = await db.investments.getByPortfolioId(portfolioId);
      } else {
        result = await db.investments.getAll();
      }

      if (result.error) throw result.error;
      
      setInvestments(result.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching investments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [portfolioId]);

  const createInvestment = async (investmentData) => {
    try {
      const result = await db.investments.create(investmentData);
      if (result.error) throw result.error;
      
      await fetchInvestments();
      return { success: true, data: result.data };
    } catch (err) {
      console.error('Error creating investment:', err);
      return { success: false, error: err.message };
    }
  };

  const updateInvestment = async (id, updates) => {
    try {
      const result = await db.investments.update(id, updates);
      if (result.error) throw result.error;
      
      await fetchInvestments();
      return { success: true, data: result.data };
    } catch (err) {
      console.error('Error updating investment:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteInvestment = async (id) => {
    try {
      const result = await db.investments.delete(id);
      if (result.error) throw result.error;
      
      await fetchInvestments();
      return { success: true };
    } catch (err) {
      console.error('Error deleting investment:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    investments,
    loading,
    error,
    createInvestment,
    updateInvestment,
    deleteInvestment,
    refresh: fetchInvestments,
  };
}

// 🔥 거래 훅
export function useTransactions(investmentId = null) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let result;

      if (investmentId) {
        result = await db.transactions.getByInvestmentId(investmentId);
      } else {
        result = await db.transactions.getAll();
      }

      if (result.error) throw result.error;
      
      setTransactions(result.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [investmentId]);

  const createTransaction = async (transactionData) => {
    try {
      // 총액 자동 계산
      const dataWithTotal = {
        ...transactionData,
        total_amount: transactionData.quantity * transactionData.price,
      };
      
      const result = await db.transactions.create(dataWithTotal);
      if (result.error) throw result.error;
      
      await fetchTransactions();
      return { success: true, data: result.data };
    } catch (err) {
      console.error('Error creating transaction:', err);
      return { success: false, error: err.message };
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      // 수량이나 가격이 변경되면 총액도 다시 계산
      if (updates.quantity || updates.price) {
        const current = transactions.find(t => t.id === id);
        const quantity = updates.quantity || current.quantity;
        const price = updates.price || current.price;
        updates.total_amount = quantity * price;
      }
      
      const result = await db.transactions.update(id, updates);
      if (result.error) throw result.error;
      
      await fetchTransactions();
      return { success: true, data: result.data };
    } catch (err) {
      console.error('Error updating transaction:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const result = await db.transactions.delete(id);
      if (result.error) throw result.error;
      
      await fetchTransactions();
      return { success: true };
    } catch (err) {
      console.error('Error deleting transaction:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refresh: fetchTransactions,
  };
}

// 🔥 사용자 훅
export function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const result = await db.users.getById(userId);
        
        if (result.error) throw result.error;
        
        setUser(result.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}