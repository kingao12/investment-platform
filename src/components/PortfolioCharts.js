'use client';

import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 📊 자산 배분 파이 차트
export function AssetAllocationChart({ investments }) {
  if (!investments || investments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        데이터가 없습니다
      </div>
    );
  }

  // 자산 유형별 분류
  const assetTypeMap = {
    'STOCK': '주식',
    'CRYPTO': '암호화폐',
    'ETF': 'ETF',
    'BOND': '채권',
    'REAL_ESTATE': '부동산',
    'COMMODITY': '원자재',
    'CASH': '현금',
    'OTHER': '기타',
  };

  const allocation = {};
  let total = 0;

  investments.forEach(investment => {
    if (investment.transactions && investment.transactions.length > 0) {
      let invested = 0;
      let shares = 0;

      investment.transactions.forEach(tx => {
        if (tx.type === 'BUY') {
          invested += tx.total_amount + (tx.fee || 0);
          shares += tx.quantity;
        } else if (tx.type === 'SELL') {
          const avgCost = invested / shares;
          invested -= avgCost * tx.quantity;
          shares -= tx.quantity;
        }
      });

      const assetType = assetTypeMap[investment.asset_type] || investment.asset_type;
      allocation[assetType] = (allocation[assetType] || 0) + invested;
      total += invested;
    }
  });

  const data = Object.keys(allocation).map(type => ({
    name: type,
    value: allocation[type],
    percent: ((allocation[type] / total) * 100).toFixed(2),
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        자산 배분
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${percent}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)}
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* 범례 */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {item.name}: {item.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 📈 수익률 변화 라인 차트
export function PerformanceChart({ investments }) {
  if (!investments || investments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        데이터가 없습니다
      </div>
    );
  }

  // 모든 거래를 날짜순으로 정렬
  const allTransactions = [];
  investments.forEach(investment => {
    if (investment.transactions) {
      investment.transactions.forEach(tx => {
        allTransactions.push({
          ...tx,
          symbol: investment.symbol,
        });
      });
    }
  });

  allTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

  // 누적 투자금액과 평가금액 계산
  let cumulativeInvested = 0;
  let cumulativeValue = 0;
  const holdings = {}; // 종목별 보유량

  const chartData = allTransactions.map(tx => {
    if (tx.type === 'BUY') {
      cumulativeInvested += tx.total_amount + (tx.fee || 0);
      holdings[tx.symbol] = (holdings[tx.symbol] || 0) + tx.quantity;
    } else if (tx.type === 'SELL') {
      // 매도시 투자금액 감소
      holdings[tx.symbol] = (holdings[tx.symbol] || 0) - tx.quantity;
    }

    // 평가금액 = 현재 보유량 * 평균단가 (실제로는 현재가를 사용해야 함)
    cumulativeValue = cumulativeInvested; // 단순화: 투자금액과 동일하게 설정

    const roi = cumulativeInvested > 0 
      ? ((cumulativeValue - cumulativeInvested) / cumulativeInvested * 100) 
      : 0;

    return {
      date: new Date(tx.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      invested: cumulativeInvested,
      value: cumulativeValue,
      roi: roi.toFixed(2),
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        포트폴리오 성과
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip 
            formatter={(value) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)}
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="invested" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="투자금액"
            dot={{ fill: '#3b82f6', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#10b981" 
            strokeWidth={2}
            name="평가금액"
            dot={{ fill: '#10b981', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 📊 종목별 수익률 바 차트
export function InvestmentPerformanceChart({ investments }) {
  if (!investments || investments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        데이터가 없습니다
      </div>
    );
  }

  const data = investments
    .filter(inv => inv.transactions && inv.transactions.length > 0)
    .map(investment => {
      let invested = 0;
      let shares = 0;

      investment.transactions.forEach(tx => {
        if (tx.type === 'BUY') {
          invested += tx.total_amount + (tx.fee || 0);
          shares += tx.quantity;
        } else if (tx.type === 'SELL') {
          const avgCost = invested / shares;
          invested -= avgCost * tx.quantity;
          shares -= tx.quantity;
        }
      });

      const currentValue = investment.currentPrice 
        ? shares * investment.currentPrice 
        : invested;
      
      const gain = currentValue - invested;
      const roi = invested > 0 ? (gain / invested * 100) : 0;

      return {
        symbol: investment.symbol,
        roi: parseFloat(roi.toFixed(2)),
        gain,
      };
    })
    .sort((a, b) => b.roi - a.roi);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        종목별 수익률
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-16 text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.symbol}
            </div>
            <div className="flex-1">
              <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full flex items-center justify-end pr-2 text-xs font-semibold text-white ${
                    item.roi >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(item.roi) * 2, 100)}%`,
                  }}
                >
                  {item.roi >= 0 ? '+' : ''}{item.roi}%
                </div>
              </div>
            </div>
            <div className={`w-24 text-right text-sm font-semibold ${
              item.gain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {item.gain >= 0 ? '+' : ''}
              {new Intl.NumberFormat('ko-KR', { 
                style: 'currency', 
                currency: 'KRW',
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(item.gain)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}