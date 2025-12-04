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
      // ✅ null/undefined 체크 추가
      if (!symbol || typeof symbol !== 'string') {
        console.warn('Invalid symbol provided:', symbol);
        return null;
      }

      const coinId = coinGeckoAPI.symbolToId[symbol.toUpperCase()];
      
      if (!coinId) {
        console.warn(`Unknown crypto symbol: ${symbol}`);
        return null;
      }

      // ✅ 타임아웃 추가
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

      const response = await fetch(
        `${coinGeckoAPI.baseURL}/simple/price?ids=${coinId}&vs_currencies=krw,usd&include_24hr_change=true`,
        { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        // ✅ 상세한 에러 메시지
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        
        // Rate limit 체크
        if (response.status === 429) {
          console.warn('Rate limit exceeded. Please wait before trying again.');
        }
        
        return null;
      }

      const data = await response.json();
      
      // ✅ 데이터 검증 강화
      if (!data || !data[coinId]) {
        console.warn(`No price data returned for ${symbol}`);
        return null;
      }
      
      return {
        symbol: symbol.toUpperCase(),
        coinId,
        priceKRW: data[coinId]?.krw || 0,
        priceUSD: data[coinId]?.usd || 0,
        change24h: data[coinId]?.krw_24h_change || 0,
      };
    } catch (error) {
      // ✅ 에러 타입별 처리
      if (error.name === 'AbortError') {
        console.error('Request timeout:', symbol);
      } else if (error.message.includes('Failed to fetch')) {
        console.error('Network error - check CORS or internet connection:', error);
      } else {
        console.error('CoinGecko API Error:', error);
      }
      return null;
    }
  },

  // 여러 코인 가격 조회
  getPrices: async (symbols) => {
    try {
      // ✅ 입력 검증
      if (!Array.isArray(symbols) || symbols.length === 0) {
        console.warn('Invalid symbols array:', symbols);
        return {};
      }

      // ✅ null/undefined 필터링
      const validSymbols = symbols.filter(s => s && typeof s === 'string');
      
      const coinIds = validSymbols
        .map(symbol => coinGeckoAPI.symbolToId[symbol.toUpperCase()])
        .filter(Boolean);

      if (coinIds.length === 0) {
        return {};
      }

      // ✅ 타임아웃 추가
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `${coinGeckoAPI.baseURL}/simple/price?ids=${coinIds.join(',')}&vs_currencies=krw,usd&include_24hr_change=true`,
        { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        
        if (response.status === 429) {
          console.warn('Rate limit exceeded. Please wait before trying again.');
        }
        
        return {};
      }

      const data = await response.json();
      
      // 결과를 심볼 기준으로 변환
      const prices = {};
      validSymbols.forEach(symbol => {
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
      if (error.name === 'AbortError') {
        console.error('Request timeout');
      } else if (error.message.includes('Failed to fetch')) {
        console.error('Network error - check CORS or internet connection:', error);
      } else {
        console.error('CoinGecko API Error:', error);
      }
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
      // ✅ null/undefined 체크 추가
      if (!symbol || typeof symbol !== 'string') {
        console.warn('Invalid symbol provided:', symbol);
        return null;
      }

      if (!stockAPI.apiKey) {
        console.warn('Alpha Vantage API key not set');
        return null;
      }

      // ✅ 타임아웃 추가
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `${stockAPI.baseURL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${stockAPI.apiKey}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Stock API Error (${response.status})`);
        return null;
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
      if (error.name === 'AbortError') {
        console.error('Request timeout:', symbol);
      } else {
        console.error('Stock API Error:', error);
      }
      return null;
    }
  },
};

// 🔄 통합 가격 조회 함수
export const getPriceForAsset = async (symbol, assetType) => {
  try {
    // ✅ null/undefined 체크
    if (!symbol || !assetType) {
      console.warn('Invalid parameters:', { symbol, assetType });
      return null;
    }

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
  try {
    // ✅ 입력 검증
    if (!Array.isArray(investments)) {
      console.warn('Invalid investments array');
      return [];
    }

    // ✅ 병렬 처리 with 에러 핸들링
    const updatedInvestments = await Promise.allSettled(
      investments.map(async (investment) => {
        // ✅ investment 검증
        if (!investment || !investment.symbol || !investment.asset_type) {
          console.warn('Invalid investment object:', investment);
          return investment;
        }

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

    // ✅ 성공한 것만 반환
    return updatedInvestments
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
      
  } catch (error) {
    console.error('Update portfolio prices error:', error);
    return investments; // 원본 반환
  }
};

// 💰 현재 가치 계산
export const calculateCurrentValue = (investment, transactions) => {
  try {
    // ✅ 입력 검증
    if (!investment || !Array.isArray(transactions)) {
      console.warn('Invalid parameters for calculateCurrentValue');
      return 0;
    }

    let totalShares = 0;

    transactions.forEach((tx) => {
      // ✅ 트랜잭션 검증
      if (!tx || typeof tx.quantity !== 'number') {
        console.warn('Invalid transaction:', tx);
        return;
      }

      if (tx.type === 'BUY') {
        totalShares += tx.quantity;
      } else if (tx.type === 'SELL') {
        totalShares -= tx.quantity;
      }
    });

    const currentPrice = investment.currentPrice || 0;
    return totalShares * currentPrice;
    
  } catch (error) {
    console.error('Calculate current value error:', error);
    return 0;
  }
};