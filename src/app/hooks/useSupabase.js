// hooks/useSupabase.js
import { useEffect, useState } from 'react';
import { db, calculations } from '../lib/supabase';

// 포트폴리오 훅
export function usePortfolios(userId = null) {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      let query;
      
      if (userId) {
        query = await db.portfolios.getByUserId(userId);
      } else {
        query = await db.portfolios.getAll();
      }

      if (query.error) throw query.error;

      // 메트릭 계산
      const portfoliosWithMetrics = query.data.map((portfolio) => {
        let totalInvested = 0;
        let totalValue = 0;

        portfolio.investments?.forEach((investment) => {
          const metrics = calculations.calculatePortfolioMetrics(
            investment.transactions || []
          );
          totalInvested += metrics.totalInvested;
          totalValue += metrics.totalInvested; // 나중에 실시간 가격으로 대체
        });

        const roi = calculations.calculateROI(totalValue, totalInvested);

        return {
          ...portfolio,
          totalInvested,
          totalValue,
          roi,
        };
      });

      setPortfolios(portfoliosWithMetrics);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [userId]);

  const createPortfolio = async (data) => {
    try {
      const result = await db.portfolios.create(data);
      if (result.error) throw result.error;
      await fetchPortfolios();
      return { success: true, data: result.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updatePortfolio = async (id, data) => {
    try {
      const result = await db.portfolios.update(id, data);
      if (result.error) throw result.error;
      await fetchPortfolios();
      return { success: true, data: result.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deletePortfolio = async (id) => {
    try {
      const result = await db.portfolios.delete(id);
      if (result.error) throw result.error;
      await fetchPortfolios();
      return { success: true };
    } catch (err) {
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

// 단일 포트폴리오 훅
export function usePortfolio(id) {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const result = await db.portfolios.getById(id);
      if (result.error) throw result.error;
      setPortfolio(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  return { portfolio, loading, error, refresh: fetchPortfolio };
}

// 투자 훅
export function useInvestments(portfolioId = null) {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      let query;

      if (portfolioId) {
        query = await db.investments.getByPortfolioId(portfolioId);
      } else {
        query = await db.investments.getAll();
      }

      if (query.error) throw query.error;

      // 메트릭 계산
      const investmentsWithMetrics = query.data.map((investment) => {
        const metrics = calculations.calculatePortfolioMetrics(
          investment.transactions || []
        );
        const realizedGain = calculations.calculateRealizedGain(
          investment.transactions || []
        );

        return {
          ...investment,
          metrics: {
            ...metrics,
            realizedGain,
            currentValue: metrics.totalInvested, // 나중에 실시간 가격으로 대체
          },
        };
      });

      setInvestments(investmentsWithMetrics);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [portfolioId]);

  const createInvestment = async (data) => {
    try {
      const result = await db.investments.create(data);
      if (result.error) throw result.error;
      await fetchInvestments();
      return { success: true, data: result.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateInvestment = async (id, data) => {
    try {
      const result = await db.investments.update(id, data);
      if (result.error) throw result.error;
      await fetchInvestments();
      return { success: true, data: result.data };
    } catch (err) {
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

// 거래 훅
export function useTransactions(investmentId = null) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let query;

      if (investmentId) {
        query = await db.transactions.getByInvestmentId(investmentId);
      } else {
        query = await db.transactions.getAll();
      }

      if (query.error) throw query.error;
      setTransactions(query.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [investmentId]);

  const createTransaction = async (data) => {
    try {
      // 총액 계산
      const totalAmount = data.quantity * data.price;
      const transactionData = {
        ...data,
        total_amount: totalAmount,
      };

      const result = await db.transactions.create(transactionData);
      if (result.error) throw result.error;
      await fetchTransactions();
      return { success: true, data: result.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateTransaction = async (id, data) => {
    try {
      if (data.quantity && data.price) {
        data.total_amount = data.quantity * data.price;
      }
      
      const result = await db.transactions.update(id, data);
      if (result.error) throw result.error;
      await fetchTransactions();
      return { success: true, data: result.data };
    } catch (err) {
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

// 대시보드 통계 훅
export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // 모든 데이터 가져오기
      const [portfoliosResult, investmentsResult, transactionsResult] = 
        await Promise.all([
          db.portfolios.getAll(),
          db.investments.getAll(),
          db.transactions.getAll(),
        ]);

      if (portfoliosResult.error) throw portfoliosResult.error;
      if (investmentsResult.error) throw investmentsResult.error;
      if (transactionsResult.error) throw transactionsResult.error;

      // 통계 계산
      const assetAllocation = calculations.calculateAssetAllocation(
        investmentsResult.data
      );

      let totalValue = 0;
      Object.values(assetAllocation).forEach((asset) => {
        totalValue += asset.value;
      });

      setStats({
        portfolioCount: portfoliosResult.data.length,
        investmentCount: investmentsResult.data.length,
        transactionCount: transactionsResult.data.length,
        totalValue,
        assetAllocation,
        recentTransactions: transactionsResult.data.slice(0, 10),
      });

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refresh: fetchStats };
}