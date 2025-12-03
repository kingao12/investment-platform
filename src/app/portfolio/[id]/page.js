'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePortfolio, useInvestments, useTransactions } from '@/hooks/useSupabase';
import { format, calculate } from '@/lib/supabase';
import { updatePortfolioPrices, calculateCurrentValue } from '@/lib/apiServices';
import { AssetAllocationChart, PerformanceChart, InvestmentPerformanceChart } from '@/components/PortfolioCharts';
import { 
  ArrowLeft, 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Trash2,
  Edit,
  X,
  RefreshCw
} from 'lucide-react';

export default function PortfolioDetailPage() {
  const router = useRouter();
  const params = useParams();
  const portfolioId = params.id;

  const { portfolio, loading: portfolioLoading } = usePortfolio(portfolioId);
  const { 
    investments, 
    loading: investmentsLoading,
    createInvestment,
    deleteInvestment 
  } = useInvestments(portfolioId);

  const [showNewInvestment, setShowNewInvestment] = useState(false);
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [investmentsWithPrices, setInvestmentsWithPrices] = useState([]);
  const [priceLoading, setPriceLoading] = useState(false);
  
  const { 
    createTransaction 
  } = useTransactions(selectedInvestment?.id);
  
  const [newInvestment, setNewInvestment] = useState({
    symbol: '',
    name: '',
    asset_type: 'STOCK',
  });

  const [newTransaction, setNewTransaction] = useState({
    type: 'BUY',
    quantity: '',
    price: '',
    fee: '0',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  // 실시간 가격 업데이트
  const fetchPrices = async () => {
    if (!investments || investments.length === 0) return;

    setPriceLoading(true);
    try {
      const updated = await updatePortfolioPrices(investments);
      setInvestmentsWithPrices(updated);
    } catch (error) {
      console.error('가격 업데이트 실패:', error);
    } finally {
      setPriceLoading(false);
    }
  };

  // 투자 목록이 로드되면 가격 업데이트
  useEffect(() => {
    if (investments && investments.length > 0) {
      fetchPrices();
    } else {
      setInvestmentsWithPrices([]);
    }
  }, [investments]);

  // 포트폴리오 총 통계 계산 (실시간 가격 반영)
  const calculatePortfolioStats = () => {
    const investmentsToUse = investmentsWithPrices.length > 0 ? investmentsWithPrices : investments;

    if (!investmentsToUse || investmentsToUse.length === 0) {
      return {
        totalInvested: 0,
        totalValue: 0,
        totalGain: 0,
        roi: 0,
      };
    }

    let totalInvested = 0;
    let totalValue = 0;

    investmentsToUse.forEach(investment => {
      if (investment.transactions && investment.transactions.length > 0) {
        const metrics = calculate.portfolioMetrics(investment.transactions);
        totalInvested += metrics.totalInvested;
        
        // 실시간 가격이 있으면 사용, 없으면 투자금액 사용
        if (investment.currentPrice) {
          totalValue += calculateCurrentValue(investment, investment.transactions);
        } else {
          totalValue += metrics.totalInvested;
        }
      }
    });

    return {
      totalInvested,
      totalValue,
      totalGain: totalValue - totalInvested,
      roi: calculate.portfolioROI(totalValue, totalInvested),
    };
  };

  const stats = calculatePortfolioStats();

  // 투자 종목 추가
  const handleCreateInvestment = async () => {
    if (!newInvestment.symbol || !newInvestment.name) {
      alert('심볼과 이름을 입력해주세요.');
      return;
    }

    const result = await createInvestment({
      ...newInvestment,
      portfolio_id: portfolioId,
    });

    if (result.success) {
      setShowNewInvestment(false);
      setNewInvestment({ symbol: '', name: '', asset_type: 'STOCK' });
      alert('투자 종목이 추가되었습니다!');
    } else {
      alert('추가 실패: ' + result.error);
    }
  };

  // 투자 종목 삭제
  const handleDeleteInvestment = async (id, name) => {
    if (!confirm(`"${name}" 종목을 삭제하시겠습니까?`)) return;

    const result = await deleteInvestment(id);
    if (result.success) {
      alert('종목이 삭제되었습니다.');
    } else {
      alert('삭제 실패: ' + result.error);
    }
  };

  // 거래 추가 모달 열기
  const handleOpenTransactionModal = (investment) => {
    setSelectedInvestment(investment);
    setNewTransaction({
      type: 'BUY',
      quantity: '',
      price: '',
      fee: '0',
      date: new Date().toISOString().split('T')[0],
      note: '',
    });
    setShowNewTransaction(true);
  };

  // 거래 추가
  const handleCreateTransaction = async () => {
    if (!newTransaction.quantity || !newTransaction.price) {
      alert('수량과 가격을 입력해주세요.');
      return;
    }

    const result = await createTransaction({
      ...newTransaction,
      quantity: parseFloat(newTransaction.quantity),
      price: parseFloat(newTransaction.price),
      fee: parseFloat(newTransaction.fee) || 0,
      investment_id: selectedInvestment.id,
    });

    if (result.success) {
      setShowNewTransaction(false);
      setSelectedInvestment(null);
      alert('거래가 추가되었습니다!');
      // 페이지 새로고침
      window.location.reload();
    } else {
      alert('추가 실패: ' + result.error);
    }
  };

  if (portfolioLoading || investmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">포트폴리오를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft size={20} />
            대시보드로 돌아가기
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {portfolio.name}
              </h1>
              {portfolio.description && (
                <p className="text-gray-600 dark:text-gray-400">
                  {portfolio.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchPrices}
                disabled={priceLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                <RefreshCw size={20} className={priceLoading ? 'animate-spin' : ''} />
                가격 새로고침
              </button>
              <button
                onClick={() => setShowNewInvestment(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
              >
                <PlusCircle size={20} />
                투자 종목 추가
              </button>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">총 투자금</span>
              <DollarSign className="text-blue-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {format.currency(stats.totalInvested)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">평가금액</span>
              <DollarSign className="text-green-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {format.currency(stats.totalValue)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">평가손익</span>
              {stats.totalGain >= 0 ? (
                <TrendingUp className="text-green-500" size={24} />
              ) : (
                <TrendingDown className="text-red-500" size={24} />
              )}
            </div>
            <p className={`text-2xl font-bold ${stats.totalGain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {format.currency(stats.totalGain)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">수익률</span>
              {stats.roi >= 0 ? (
                <TrendingUp className="text-green-500" size={24} />
              ) : (
                <TrendingDown className="text-red-500" size={24} />
              )}
            </div>
            <p className={`text-2xl font-bold ${stats.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {format.percent(stats.roi)}
            </p>
          </div>
        </div>

        {/* 새 투자 종목 폼 */}
        {showNewInvestment && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                새 투자 종목 추가
              </h3>
              <button
                onClick={() => setShowNewInvestment(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  심볼/티커
                </label>
                <input
                  type="text"
                  value={newInvestment.symbol}
                  onChange={(e) => setNewInvestment({ ...newInvestment, symbol: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="AAPL, BTC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  value={newInvestment.name}
                  onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Apple Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  자산 유형
                </label>
                <select
                  value={newInvestment.asset_type}
                  onChange={(e) => setNewInvestment({ ...newInvestment, asset_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="STOCK">주식</option>
                  <option value="CRYPTO">암호화폐</option>
                  <option value="ETF">ETF</option>
                  <option value="BOND">채권</option>
                  <option value="REAL_ESTATE">부동산</option>
                  <option value="COMMODITY">원자재</option>
                  <option value="CASH">현금</option>
                  <option value="OTHER">기타</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleCreateInvestment}
              className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              추가하기
            </button>
          </div>
        )}

        {/* 거래 추가 모달 */}
        {showNewTransaction && selectedInvestment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-700 p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  거래 추가 - {selectedInvestment.symbol}
                </h3>
                <button
                  onClick={() => {
                    setShowNewTransaction(false);
                    setSelectedInvestment(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* 거래 유형 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    거래 유형
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setNewTransaction({ ...newTransaction, type: 'BUY' })}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        newTransaction.type === 'BUY'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      매수
                    </button>
                    <button
                      onClick={() => setNewTransaction({ ...newTransaction, type: 'SELL' })}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        newTransaction.type === 'SELL'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      매도
                    </button>
                  </div>
                </div>

                {/* 수량 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    수량
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newTransaction.quantity}
                    onChange={(e) => setNewTransaction({ ...newTransaction, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="10"
                  />
                </div>

                {/* 가격 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    가격 (단가)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.price}
                    onChange={(e) => setNewTransaction({ ...newTransaction, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="150000"
                  />
                </div>

                {/* 수수료 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    수수료 (선택)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.fee}
                    onChange={(e) => setNewTransaction({ ...newTransaction, fee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>

                {/* 거래 날짜 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    거래 날짜
                  </label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* 메모 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    메모 (선택)
                  </label>
                  <textarea
                    value={newTransaction.note}
                    onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="거래 메모..."
                  />
                </div>

                {/* 총액 표시 */}
                {newTransaction.quantity && newTransaction.price && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 dark:text-gray-300">총 거래금액:</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {format.currency(
                          parseFloat(newTransaction.quantity) * parseFloat(newTransaction.price) +
                          (parseFloat(newTransaction.fee) || 0)
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* 버튼 */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCreateTransaction}
                    className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                  >
                    거래 추가
                  </button>
                  <button
                    onClick={() => {
                      setShowNewTransaction(false);
                      setSelectedInvestment(null);
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 투자 종목 목록 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            투자 종목 ({investments.length})
          </h3>

          {investments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                아직 투자 종목이 없습니다
              </p>
              <button
                onClick={() => setShowNewInvestment(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
              >
                <PlusCircle size={20} />
                첫 종목 추가하기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {(investmentsWithPrices.length > 0 ? investmentsWithPrices : investments).map((investment) => {
                const metrics = investment.transactions?.length > 0
                  ? calculate.portfolioMetrics(investment.transactions)
                  : { totalInvested: 0, totalShares: 0, avgCostPerShare: 0 };

                const currentValue = investment.currentPrice 
                  ? calculateCurrentValue(investment, investment.transactions || [])
                  : metrics.totalInvested;
                
                const gain = currentValue - metrics.totalInvested;
                const gainPercent = metrics.totalInvested > 0 
                  ? (gain / metrics.totalInvested * 100) 
                  : 0;

                return (
                  <div
                    key={investment.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {investment.symbol}
                          </h4>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
                            {investment.asset_type}
                          </span>
                          {investment.currentPrice && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              현재가: {format.currency(investment.currentPrice)}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {investment.name}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">보유 수량</span>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {metrics.totalShares.toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">평균 단가</span>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {format.currency(metrics.avgCostPerShare)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">투자금액</span>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {format.currency(metrics.totalInvested)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">평가금액</span>
                            <p className={`font-semibold ${gainPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {format.currency(currentValue)}
                              <span className="text-xs ml-1">
                                ({gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%)
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenTransactionModal(investment)}
                          className="px-3 py-1 text-sm bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-900/50 transition"
                        >
                          거래 추가
                        </button>
                        <button
                          onClick={() => handleDeleteInvestment(investment.id, investment.name)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 차트 섹션 */}
        {investments.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AssetAllocationChart investments={investmentsWithPrices.length > 0 ? investmentsWithPrices : investments} />
            <InvestmentPerformanceChart investments={investmentsWithPrices.length > 0 ? investmentsWithPrices : investments} />
            <div className="lg:col-span-2">
              <PerformanceChart investments={investments} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}