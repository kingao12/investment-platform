// 🪙 CoinGecko API (암호화폐 가격)
export const coinGeckoAPI = {
  baseURL: 'https://api.coingecko.com/api/v3',

  // 심볼을 CoinGecko ID로 변환
  symbolToId: {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'BNB': 'binancecoin',
    'USDT': 'tether',
    'USDC': 'usd-coin',
    'XRP': 'ripple',
    'TRX': 'tron',
    'ETC': 'ethereum-classic',
    'BCH': 'bitcoin-cash',
    'XLM': 'stellar',
    'FIL': 'filecoin',
    'ADA': 'cardano',
    'DOGE': 'dogecoin',
    'SOL': 'solana',
    'DOT': 'polkadot',
    'MATIC': 'matic-network',
    'AVAX': 'avalanche-2',
    'SHIB': 'shiba-inu',
    'UNI': 'uniswap',
    'LINK': 'chainlink',
    'ATOM': 'cosmos',
    'LTC': 'litecoin',
  },

  // 단일 코인 가격 조회
  getPrice: async (symbol) => {
    try {
      const coinId = coinGeckoAPI.symbolToId[symbol.toUpperCase()];
      
      if (!coinId) {
        console.warn(`Unknown crypto symbol: ${symbol}`);
        return null;
      }

      const response = await fetch(
        `${coinGeckoAPI.baseURL}/simple/price?ids=${coinId}&vs_currencies=krw,usd&include_24hr_change=true`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch price');
      }

      const data = await response.json();
      
      return {
        symbol: symbol.toUpperCase(),
        coinId,
        priceKRW: data[coinId]?.krw || 0,
        priceUSD: data[coinId]?.usd || 0,
        change24h: data[coinId]?.krw_24h_change || 0,
      };
    } catch (error) {
      console.error('CoinGecko API Error:', error);
      return null;
    }
  },

  // 여러 코인 가격 조회
  getPrices: async (symbols) => {
    try {
      const coinIds = symbols
        .map(symbol => coinGeckoAPI.symbolToId[symbol.toUpperCase()])
        .filter(Boolean);

      if (coinIds.length === 0) {
        return {};
      }

      const response = await fetch(
        `${coinGeckoAPI.baseURL}/simple/price?ids=${coinIds.join(',')}&vs_currencies=krw,usd&include_24hr_change=true`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }

      const data = await response.json();
      
      // 결과를 심볼 기준으로 변환
      const prices = {};
      symbols.forEach(symbol => {
        const coinId = coinGeckoAPI.symbolToId[symbol.toUpperCase()];
        if (coinId && data[coinId]) {
          prices[symbol.toUpperCase()] = {
            symbol: symbol.toUpperCase(),
            coinId,
            priceKRW: data[coinId].krw || 0,
            priceUSD: data[coinId].usd || 0,
            change24h: data[coinId].krw_24h_change || 0,
          };
        }
      });

      return prices;
    } catch (error) {
      console.error('CoinGecko API Error:', error);
      return {};
    }
  },
};

// 📈 주식 가격 API (Alpha Vantage - API 키 필요)
export const stockAPI = {
  baseURL: 'https://www.alphavantage.co/query',
  apiKey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || '',

  // 주식 가격 조회
  getPrice: async (symbol) => {
    try {
      if (!stockAPI.apiKey) {
        console.warn('Alpha Vantage API key not set');
        return null;
      }

      const response = await fetch(
        `${stockAPI.baseURL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${stockAPI.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch stock price');
      }

      const data = await response.json();
      const quote = data['Global Quote'];

      if (!quote || !quote['05. price']) {
        console.warn(`No data for symbol: ${symbol}`);
        return null;
      }

      return {
        symbol: symbol.toUpperCase(),
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        lastUpdate: quote['07. latest trading day'],
      };
    } catch (error) {
      console.error('Stock API Error:', error);
      return null;
    }
  },
};

// 🔄 통합 가격 조회 함수
export const getPriceForAsset = async (symbol, assetType) => {
  try {
    if (assetType === 'CRYPTO') {
      return await coinGeckoAPI.getPrice(symbol);
    } else if (assetType === 'STOCK' || assetType === 'ETF') {
      return await stockAPI.getPrice(symbol);
    } else {
      // 다른 자산 유형은 가격 조회 안 함
      return null;
    }
  } catch (error) {
    console.error('Price fetch error:', error);
    return null;
  }
};

// 📊 포트폴리오 전체 가격 업데이트
export const updatePortfolioPrices = async (investments) => {
  const updatedInvestments = await Promise.all(
    investments.map(async (investment) => {
      const priceData = await getPriceForAsset(
        investment.symbol,
        investment.asset_type
      );

      if (priceData) {
        return {
          ...investment,
          currentPrice: priceData.priceKRW || priceData.price || 0,
          priceChange24h: priceData.change24h || priceData.changePercent || 0,
        };
      }

      return investment;
    })
  );

  return updatedInvestments;
};

// 💰 현재 가치 계산
export const calculateCurrentValue = (investment, transactions) => {
  let totalShares = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'BUY') {
      totalShares += tx.quantity;
    } else if (tx.type === 'SELL') {
      totalShares -= tx.quantity;
    }
  });

  const currentPrice = investment.currentPrice || 0;
  return totalShares * currentPrice;
};