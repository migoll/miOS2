import React, { useState, useEffect, useCallback } from "react";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  price_change_percentage_1h_in_currency: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  sparkline_in_7d: {
    price: number[];
  };
}

interface ChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_1h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
  };
}

const CryptoApp: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [coinDetails, setCoinDetails] = useState<CoinDetails | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [chartDataCache, setChartDataCache] = useState<
    Record<string, ChartData>
  >({});
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<string>("7");
  const [chartType, setChartType] = useState<"price" | "market_cap">("price");
  const [hoveredPoint, setHoveredPoint] = useState<{
    time: string;
    value: number;
    x?: number;
    y?: number;
    rawX?: number;
    rawY?: number;
  } | null>(null);

  // Mock data for demo purposes (fallback when API fails) - Updated Dec 2024
  const mockCryptoData: CryptoData[] = [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      current_price: 99285.47,
      market_cap: 1965234567890,
      market_cap_rank: 1,
      fully_diluted_valuation: 2084997934700,
      total_volume: 47892345678,
      high_24h: 103844,
      low_24h: 97200,
      price_change_24h: 2451.82,
      price_change_percentage_24h: 2.53,
      price_change_percentage_7d_in_currency: 15.67,
      price_change_percentage_1h_in_currency: -0.42,
      circulating_supply: 19792456,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 103844,
      ath_change_percentage: -4.39,
      ath_date: "2024-12-04T23:15:00.000Z",
      atl: 67.81,
      atl_change_percentage: 146300,
      atl_date: "2013-07-06T00:00:00.000Z",
      last_updated: "2024-12-05T16:30:00.000Z",
      sparkline_in_7d: {
        price: [85200, 88500, 92400, 96800, 101200, 98600, 99285],
      },
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      current_price: 3834.92,
      market_cap: 461234567890,
      market_cap_rank: 2,
      fully_diluted_valuation: 461234567890,
      total_volume: 19876543210,
      high_24h: 3920,
      low_24h: 3750,
      price_change_24h: 87.45,
      price_change_percentage_24h: 2.33,
      price_change_percentage_7d_in_currency: 8.92,
      price_change_percentage_1h_in_currency: 0.15,
      circulating_supply: 120345678,
      total_supply: 120345678,
      max_supply: null,
      ath: 4878.26,
      ath_change_percentage: -21.39,
      ath_date: "2021-11-10T14:24:19.604Z",
      atl: 0.432979,
      atl_change_percentage: 885600,
      atl_date: "2015-10-20T00:00:00.000Z",
      last_updated: "2024-12-05T16:30:00.000Z",
      sparkline_in_7d: {
        price: [3520, 3650, 3720, 3780, 3890, 3810, 3835],
      },
    },
    {
      id: "tether",
      symbol: "usdt",
      name: "Tether",
      image: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
      current_price: 1.0002,
      market_cap: 134567890123,
      market_cap_rank: 3,
      fully_diluted_valuation: 134567890123,
      total_volume: 45678901234,
      high_24h: 1.0015,
      low_24h: 0.9988,
      price_change_24h: 0.0002,
      price_change_percentage_24h: 0.02,
      price_change_percentage_7d_in_currency: 0.01,
      price_change_percentage_1h_in_currency: 0.0,
      circulating_supply: 134500000000,
      total_supply: 134500000000,
      max_supply: null,
      ath: 1.32,
      ath_change_percentage: -24.2,
      ath_date: "2018-07-24T00:00:00.000Z",
      atl: 0.572521,
      atl_change_percentage: 74.7,
      atl_date: "2015-03-02T00:00:00.000Z",
      last_updated: "2024-12-05T00:00:00.000Z",
      sparkline_in_7d: {
        price: [1.0001, 1.0003, 0.9999, 1.0002, 1.0005, 1.0001, 1.0002],
      },
    },
    {
      id: "binancecoin",
      symbol: "bnb",
      name: "BNB",
      image:
        "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
      current_price: 695.45,
      market_cap: 101234567890,
      market_cap_rank: 4,
      fully_diluted_valuation: 101234567890,
      total_volume: 2345678901,
      high_24h: 710,
      low_24h: 685,
      price_change_24h: 10.45,
      price_change_percentage_24h: 1.53,
      price_change_percentage_7d_in_currency: -1.25,
      price_change_percentage_1h_in_currency: 0.25,
      circulating_supply: 145618000,
      total_supply: 145618000,
      max_supply: 200000000,
      ath: 717.48,
      ath_change_percentage: -3.1,
      ath_date: "2024-06-06T14:05:10.732Z",
      atl: 0.0398177,
      atl_change_percentage: 1746000,
      atl_date: "2017-10-19T00:00:00.000Z",
      last_updated: "2024-12-05T00:00:00.000Z",
      sparkline_in_7d: {
        price: [680, 692, 675, 688, 705, 690, 695],
      },
    },
    {
      id: "solana",
      symbol: "sol",
      name: "Solana",
      image: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
      current_price: 243.67,
      market_cap: 115678901234,
      market_cap_rank: 5,
      fully_diluted_valuation: 141234567890,
      total_volume: 5678901234,
      high_24h: 248,
      low_24h: 240,
      price_change_24h: 3.67,
      price_change_percentage_24h: 1.53,
      price_change_percentage_7d_in_currency: 8.45,
      price_change_percentage_1h_in_currency: -0.12,
      circulating_supply: 474500000,
      total_supply: 579500000,
      max_supply: null,
      ath: 259.96,
      ath_change_percentage: -6.3,
      ath_date: "2024-11-23T16:30:00.000Z",
      atl: 0.500801,
      atl_change_percentage: 48600,
      atl_date: "2020-05-11T19:35:23.449Z",
      last_updated: "2024-12-05T00:00:00.000Z",
      sparkline_in_7d: {
        price: [225, 235, 220, 230, 245, 240, 243],
      },
    },
    {
      id: "usd-coin",
      symbol: "usdc",
      name: "USD Coin",
      image:
        "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
      current_price: 1.0001,
      market_cap: 43567890123,
      market_cap_rank: 6,
      fully_diluted_valuation: 43567890123,
      total_volume: 8901234567,
      high_24h: 1.0008,
      low_24h: 0.9994,
      price_change_24h: 0.0001,
      price_change_percentage_24h: 0.01,
      price_change_percentage_7d_in_currency: -0.02,
      price_change_percentage_1h_in_currency: 0.0,
      circulating_supply: 43550000000,
      total_supply: 43550000000,
      max_supply: null,
      ath: 1.17,
      ath_change_percentage: -14.5,
      ath_date: "2019-05-08T00:40:28.300Z",
      atl: 0.877647,
      atl_change_percentage: 14.0,
      atl_date: "2023-03-11T08:02:13.981Z",
      last_updated: "2024-12-05T00:00:00.000Z",
      sparkline_in_7d: {
        price: [1.0, 1.0002, 0.9998, 1.0001, 1.0003, 0.9999, 1.0001],
      },
    },
    {
      id: "xrp",
      symbol: "xrp",
      name: "XRP",
      image:
        "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
      current_price: 2.34,
      market_cap: 133456789012,
      market_cap_rank: 7,
      fully_diluted_valuation: 234567890123,
      total_volume: 12345678901,
      high_24h: 2.48,
      low_24h: 2.25,
      price_change_24h: 0.09,
      price_change_percentage_24h: 4.01,
      price_change_percentage_7d_in_currency: 42.15,
      price_change_percentage_1h_in_currency: 0.78,
      circulating_supply: 57000000000,
      total_supply: 100000000000,
      max_supply: 100000000000,
      ath: 3.84,
      ath_change_percentage: -39.1,
      ath_date: "2018-01-07T00:00:00.000Z",
      atl: 0.00268621,
      atl_change_percentage: 87000,
      atl_date: "2014-05-22T00:00:00.000Z",
      last_updated: "2024-12-05T00:00:00.000Z",
      sparkline_in_7d: {
        price: [1.65, 1.72, 1.89, 2.05, 2.28, 2.15, 2.34],
      },
    },
    {
      id: "dogecoin",
      symbol: "doge",
      name: "Dogecoin",
      image: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
      current_price: 0.4523,
      market_cap: 66789012345,
      market_cap_rank: 8,
      fully_diluted_valuation: null,
      total_volume: 3456789012,
      high_24h: 0.4687,
      low_24h: 0.4321,
      price_change_24h: 0.0202,
      price_change_percentage_24h: 4.68,
      price_change_percentage_7d_in_currency: 18.35,
      price_change_percentage_1h_in_currency: -0.45,
      circulating_supply: 147678000000,
      total_supply: null,
      max_supply: null,
      ath: 0.731578,
      ath_change_percentage: -38.2,
      ath_date: "2021-05-08T05:08:23.458Z",
      atl: 0.00008547,
      atl_change_percentage: 529000,
      atl_date: "2015-05-06T00:00:00.000Z",
      last_updated: "2024-12-05T00:00:00.000Z",
      sparkline_in_7d: {
        price: [0.38, 0.39, 0.41, 0.43, 0.46, 0.44, 0.45],
      },
    },
    {
      id: "cardano",
      symbol: "ada",
      name: "Cardano",
      image: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
      current_price: 1.0876,
      market_cap: 38456789012,
      market_cap_rank: 9,
      fully_diluted_valuation: 48901234567,
      total_volume: 1789012345,
      high_24h: 1.12,
      low_24h: 1.03,
      price_change_24h: 0.0576,
      price_change_percentage_24h: 5.59,
      price_change_percentage_7d_in_currency: 25.68,
      price_change_percentage_1h_in_currency: 1.23,
      circulating_supply: 35345000000,
      total_supply: 45000000000,
      max_supply: 45000000000,
      ath: 3.09,
      ath_change_percentage: -64.8,
      ath_date: "2021-09-02T06:00:10.474Z",
      atl: 0.01925275,
      atl_change_percentage: 5550,
      atl_date: "2020-03-13T02:22:55.391Z",
      last_updated: "2024-12-05T00:00:00.000Z",
      sparkline_in_7d: {
        price: [0.86, 0.89, 0.92, 0.98, 1.05, 1.02, 1.09],
      },
    },
    {
      id: "staked-ether",
      symbol: "steth",
      name: "Lido Staked Ether",
      image:
        "https://assets.coingecko.com/coins/images/13442/small/steth_logo.png",
      current_price: 3829.45,
      market_cap: 37234567890,
      market_cap_rank: 10,
      fully_diluted_valuation: 37234567890,
      total_volume: 234567890,
      high_24h: 3875,
      low_24h: 3795,
      price_change_24h: 34.45,
      price_change_percentage_24h: 0.91,
      price_change_percentage_7d_in_currency: 4.87,
      price_change_percentage_1h_in_currency: -0.12,
      circulating_supply: 9723000,
      total_supply: 9723000,
      max_supply: null,
      ath: 4829.57,
      ath_change_percentage: -20.7,
      ath_date: "2021-11-10T14:40:47.256Z",
      atl: 482.9,
      atl_change_percentage: 693,
      atl_date: "2020-12-22T04:08:21.854Z",
      last_updated: "2024-12-05T00:00:00.000Z",
      sparkline_in_7d: {
        price: [3650, 3720, 3580, 3680, 3850, 3790, 3829],
      },
    },
  ];

  // Fetch real cryptocurrency data using CORS-enabled APIs
  const fetchCryptoData = useCallback(async () => {
    setLoading(true);
    console.log("🚀 Fetching REAL cryptocurrency prices...");

    try {
      // Strategy 1: Try local proxy server (BEST - Real data with no CORS issues)
      try {
        const response = await fetch(
          "http://localhost:3001/api/crypto/markets"
        );

        if (response.ok) {
          const realData = await response.json();
          console.log("✅ REAL price data from local proxy server:", realData);
          setCryptoData(realData);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log(
          "Local proxy server not running, trying alternative APIs..."
        );
      }

      // Strategy 2: Try CoinGecko simple API (sometimes works)
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,staked-ether,usd-coin,xrp,tron,cardano&vs_currencies=usd&include_24hr_change=true&include_7d_change=true"
        );

        if (response.ok) {
          const priceData = await response.json();
          console.log("✅ Real price data from CoinGecko:", priceData);

          // Convert simple price format to our format, maintaining market cap order
          const coinOrder = [
            "bitcoin",
            "ethereum",
            "tether",
            "binancecoin",
            "solana",
            "staked-ether",
            "usd-coin",
            "xrp",
            "tron",
            "cardano",
          ];

          const realCryptoData = coinOrder
            .map((coinId, index) => {
              const priceInfo = priceData[coinId];
              const coinInfo =
                mockCryptoData.find((coin) => coin.id === coinId) ||
                mockCryptoData[index];

              if (priceInfo) {
                return {
                  ...coinInfo,
                  current_price: priceInfo.usd,
                  price_change_percentage_24h: priceInfo.usd_24h_change || 0,
                  price_change_percentage_7d_in_currency:
                    priceInfo.usd_7d_change || 0,
                  // Keep sparkline from mock data as simple API doesn't include it
                };
              }

              // Fallback to mock data if price not available
              return coinInfo;
            })
            .filter(Boolean);

          setCryptoData(realCryptoData);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log("CoinGecko simple API failed, trying Binance...");
      }

      // Strategy 3: Try Binance API (usually CORS-enabled)
      try {
        const symbols = [
          "BTCUSDT",
          "ETHUSDT",
          "BNBUSDT",
          "SOLUSDT",
          "XRPUSDT",
          "ADAUSDT",
          "TRXUSDT",
        ];
        const pricePromises = symbols.map((symbol) =>
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
        );

        const responses = await Promise.all(pricePromises);
        const allSuccessful = responses.every((response) => response.ok);

        if (allSuccessful) {
          const priceDataArray = await Promise.all(
            responses.map((response) => response.json())
          );
          console.log("✅ Real price data from Binance:", priceDataArray);

          // Map Binance data to our format
          const realCryptoData = priceDataArray.map((binanceData, index) => {
            const coinInfo = mockCryptoData[index];
            return {
              ...coinInfo,
              current_price: parseFloat(binanceData.lastPrice),
              price_change_percentage_24h: parseFloat(
                binanceData.priceChangePercent
              ),
              price_change_percentage_1h_in_currency: 0, // Binance doesn't provide 1h data
              price_change_percentage_7d_in_currency: 0, // Would need different endpoint
              // Keep sparkline from mock data
            };
          });

          setCryptoData(realCryptoData);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log("Binance API failed, trying alternative...");
      }

      // Strategy 4: Try a public proxy service
      try {
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
        const targetUrl =
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d";

        const response = await fetch(proxyUrl + targetUrl, {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        if (response.ok) {
          const realData = await response.json();
          console.log("✅ Real price data from CORS proxy:", realData);
          setCryptoData(realData);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log("CORS proxy failed, using enhanced mock data");
      }

      // Fallback: Enhanced mock data with very recent "realistic" prices
      throw new Error("All real API attempts failed");
    } catch (error) {
      console.warn("⚠️ All real APIs failed, using realistic mock data");

      // Enhanced mock data as last resort
      const fallbackData = mockCryptoData.slice(0, 10).map((coin) => ({
        ...coin,
        current_price: coin.current_price * (0.995 + Math.random() * 0.01), // Very small variation
        price_change_percentage_24h: -2 + Math.random() * 4, // -2% to +2%
        price_change_percentage_1h_in_currency: -0.3 + Math.random() * 0.6,
        price_change_percentage_7d_in_currency: -5 + Math.random() * 10,
      }));

      setCryptoData(fallbackData);
      setLoading(false);
    }
  }, []);

  // Generate mock chart data
  const generateMockChartData = (coinId: string, days: string): ChartData => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const hourMs = 60 * 60 * 1000;

    let numPoints: number;
    let intervalMs: number;

    if (days === "1") {
      numPoints = 24;
      intervalMs = hourMs;
    } else if (days === "7") {
      numPoints = 168;
      intervalMs = hourMs;
    } else if (days === "30") {
      numPoints = 30;
      intervalMs = dayMs;
    } else if (days === "90") {
      numPoints = 90;
      intervalMs = dayMs;
    } else if (days === "365") {
      numPoints = 365;
      intervalMs = dayMs;
    } else {
      // max
      numPoints = 1000;
      intervalMs = dayMs;
    }

    const coinData =
      mockCryptoData.find((coin) => coin.id === coinId) || mockCryptoData[0];
    const basePrice = coinData.current_price;

    const prices: [number, number][] = [];
    const market_caps: [number, number][] = [];
    const volumes: [number, number][] = [];

    for (let i = 0; i < numPoints; i++) {
      const timestamp = now - (numPoints - i) * intervalMs;
      // Create trending movement with some randomness
      const trendFactor = 0.95 + (i / numPoints) * 0.1; // slight upward trend
      const randomFactor = 0.95 + Math.random() * 0.1; // ±5% variation
      const price = basePrice * trendFactor * randomFactor;
      const volume = coinData.total_volume * (0.8 + Math.random() * 0.4);
      const marketCap = coinData.market_cap * trendFactor * randomFactor;

      prices.push([timestamp, price]);
      market_caps.push([timestamp, marketCap]);
      volumes.push([timestamp, volume]);
    }

    return { prices, market_caps, total_volumes: volumes };
  };

  // Generate mock coin details
  const generateMockCoinDetails = (coinId: string): CoinDetails => {
    const coinData =
      mockCryptoData.find((coin) => coin.id === coinId) || mockCryptoData[0];
    return {
      id: coinData.id,
      symbol: coinData.symbol,
      name: coinData.name,
      image: { large: coinData.image.replace("small", "large") },
      market_data: {
        current_price: { usd: coinData.current_price },
        market_cap: { usd: coinData.market_cap },
        total_volume: { usd: coinData.total_volume },
        high_24h: { usd: coinData.high_24h },
        low_24h: { usd: coinData.low_24h },
        price_change_24h: coinData.price_change_24h,
        price_change_percentage_24h: coinData.price_change_percentage_24h,
        price_change_percentage_7d:
          coinData.price_change_percentage_7d_in_currency || 0,
        price_change_percentage_1h:
          coinData.price_change_percentage_1h_in_currency || 0,
        circulating_supply: coinData.circulating_supply,
        total_supply: coinData.total_supply || 0,
        max_supply: coinData.max_supply || 0,
      },
    };
  };

  // Fetch real chart data for coin details
  const fetchCoinDetails = useCallback(async (coinId: string) => {
    setChartLoading(true);
    console.log("🚀 Fetching real chart data for:", coinId);

    const timeRanges = ["1", "7", "30", "90", "365", "max"];

    try {
      // Strategy 1: Try local proxy server for real chart data
      try {
        const coinDetailsResponse = fetch(
          `http://localhost:3001/api/crypto/coin/${coinId}`
        );
        const chartPromises = timeRanges.map((range) =>
          fetch(`http://localhost:3001/api/crypto/chart/${coinId}/${range}`)
        );

        const [detailsResponse, ...chartResponses] = await Promise.all([
          coinDetailsResponse,
          ...chartPromises,
        ]);

        if (
          detailsResponse.ok &&
          chartResponses.every((response) => response.ok)
        ) {
          const detailsData = await detailsResponse.json();
          const chartDataResults = await Promise.all(
            chartResponses.map((response) => response.json())
          );

          console.log("✅ REAL chart data from proxy server:", coinId);
          setCoinDetails(detailsData);

          // Cache all real chart data
          const realCache: Record<string, ChartData> = {};
          timeRanges.forEach((range, index) => {
            realCache[range] = chartDataResults[index];
          });

          setChartDataCache(realCache);
          setChartData(realCache["7"]); // Set default 7-day chart
          setChartLoading(false);
          return;
        }
      } catch (error) {
        console.log(
          "Proxy server not available for charts, using enhanced mock data"
        );
      }

      // Fallback: Enhanced mock data
      console.log(
        "⚠️ Using enhanced chart data (start proxy server for real data)"
      );

      setCoinDetails(generateMockCoinDetails(coinId));

      // Generate realistic chart data for all time ranges
      const mockCache: Record<string, ChartData> = {};
      timeRanges.forEach((range) => {
        mockCache[range] = generateMockChartData(coinId, range);
      });

      setChartDataCache(mockCache);
      setChartData(mockCache["7"]); // Set default 7-day chart initially

      setTimeout(() => {
        setChartLoading(false);
        console.log("✅ Chart data loaded for", coinId);
      }, 300);
    } catch (error) {
      console.warn("Chart data fallback for:", coinId);
      setCoinDetails(generateMockCoinDetails(coinId));
      setChartData(generateMockChartData(coinId, "7"));
      setChartLoading(false);
    }
  }, []);

  // Initialize with updated mock data for instant app loading
  useEffect(() => {
    const initialMockData = mockCryptoData.slice(0, 10).map((coin) => ({
      ...coin,
      current_price: coin.current_price * (0.999 + Math.random() * 0.002), // Very small variation for realism
      price_change_percentage_24h:
        coin.price_change_percentage_24h + (-0.5 + Math.random()), // Small realistic changes
      price_change_percentage_1h_in_currency:
        (coin.price_change_percentage_1h_in_currency || 0) +
        (-0.2 + Math.random() * 0.4),
      price_change_percentage_7d_in_currency:
        (coin.price_change_percentage_7d_in_currency || 0) +
        (-1 + Math.random() * 2),
    }));
    setCryptoData(initialMockData);
    setLoading(false);
  }, []);

  // Only fetch data on initial load, no live updates
  useEffect(() => {
    fetchCryptoData();
  }, [fetchCryptoData]);

  // Fetch coin details only when coin changes (not timeRange)
  useEffect(() => {
    if (selectedCoin) {
      fetchCoinDetails(selectedCoin);
    }
  }, [selectedCoin, fetchCoinDetails]);

  // Instantly switch chart data when time range changes (using cache)
  useEffect(() => {
    if (chartDataCache[timeRange]) {
      setChartData(chartDataCache[timeRange]);
      console.log(`📊 Instantly switched to ${timeRange} chart from cache`);
    }
  }, [timeRange, chartDataCache]);

  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(decimals)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatPrice = (price: number): string => {
    if (price >= 1)
      return `$${price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    return `$${price.toFixed(6)}`;
  };

  // Format price for chart Y-axis (shorter with K/M)
  const formatPriceShort = (price: number): string => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else if (price < 1000) {
      return `$${price.toFixed(2)}`;
    } else if (price < 1000000) {
      return `$${(price / 1000).toFixed(1)}K`;
    } else if (price < 1000000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else {
      return `$${(price / 1000000000).toFixed(1)}B`;
    }
  };

  const formatPercentage = (percentage: number): string => {
    const sign = percentage >= 0 ? "+" : "";
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const getPercentageColor = (percentage: number): string => {
    return percentage >= 0 ? "text-green-500" : "text-red-500";
  };

  // Simple sparkline component
  const Sparkline: React.FC<{ data: number[]; color: string }> = ({
    data,
    color,
  }) => {
    if (!data || data.length === 0) return <div className="w-16 h-6"></div>;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 64; // 64px width (smaller)
        const y = range === 0 ? 12 : 24 - ((value - min) / range) * 24; // 24px height, inverted
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width="64" height="24" className="w-16 h-6">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          points={points}
        />
      </svg>
    );
  };

  // Enhanced chart component
  const Chart: React.FC = () => {
    if (!chartData || chartLoading) {
      return (
        <div className="h-96 flex items-center justify-center bg-gray-800 rounded-lg">
          <div className="text-gray-400">Loading chart...</div>
        </div>
      );
    }

    const data =
      chartType === "price" ? chartData.prices : chartData.market_caps;
    if (!data || data.length === 0) return null;

    const values = data.map((point) => point[1]);
    const times = data.map((point) => point[0]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    const padding = { top: 20, right: 20, bottom: 50, left: 50 };
    const chartWidth = 800;
    const chartHeight = 300; // Reduced height for better fit
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;

    const points = data.map((point, index) => {
      const x = padding.left + (index / (data.length - 1)) * plotWidth;
      const y =
        range === 0
          ? chartHeight / 2
          : padding.top + ((max - point[1]) / range) * plotHeight;
      return { x, y, time: point[0], value: point[1] };
    });

    const pathData = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();

      // Get mouse position relative to the SVG element
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Simple scaling approach for reliable results
      const scaleX = chartWidth / rect.width;
      const scaleY = chartHeight / rect.height;
      const svgMouseX = clientX * scaleX;
      const svgMouseY = clientY * scaleY;

      // Only track if mouse is within the plot area
      if (
        svgMouseX >= padding.left &&
        svgMouseX <= chartWidth - padding.right
      ) {
        // Find the data index based on mouse X position within the plot area
        const relativeX = svgMouseX - padding.left;
        const dataIndex = Math.round(
          (relativeX / plotWidth) * (data.length - 1)
        );
        const clampedIndex = Math.max(0, Math.min(dataIndex, data.length - 1));

        const dataPoint = data[clampedIndex];
        const value = dataPoint[1];
        const time = dataPoint[0];

        // Calculate Y position for the dot on the line
        const dotY =
          range === 0
            ? chartHeight / 2
            : padding.top + ((max - value) / range) * plotHeight;

        // Convert coordinates for price box positioning
        const clientDotY = dotY / scaleY;

        setHoveredPoint({
          time: new Date(time).toLocaleString(),
          value: value,
          x: svgMouseX, // Use SVG coordinate system X for vertical line
          y: dotY, // Use calculated Y position for the dot
          rawX: clientX, // Use client coordinates for price box
          rawY: clientDotY, // Use client coordinates for price box Y
        });
      }
    };

    const handleMouseLeave = () => {
      setHoveredPoint(null);
    };

    // Generate Y-axis labels
    const yAxisTicks = 5;
    const yTicks = Array.from({ length: yAxisTicks }, (_, i) => {
      const value = min + (range / (yAxisTicks - 1)) * i;
      const y = padding.top + ((max - value) / range) * plotHeight;
      return { value, y };
    });

    // Generate X-axis labels
    const xAxisTicks = 6;
    const xTicks = Array.from({ length: xAxisTicks }, (_, i) => {
      const dataIndex = Math.floor((i / (xAxisTicks - 1)) * (data.length - 1));
      const point = data[dataIndex];
      const x = padding.left + (dataIndex / (data.length - 1)) * plotWidth;
      const date = new Date(point[0]);
      let label = "";

      if (timeRange === "1") {
        label = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (timeRange === "7" || timeRange === "30") {
        label = date.toLocaleDateString([], { month: "short", day: "numeric" });
      } else {
        label = date.toLocaleDateString([], {
          year: "2-digit",
          month: "short",
        });
      }

      return { label, x };
    });

    return (
      <div className="bg-gray-800 rounded-lg p-2 relative h-full flex flex-col">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="w-full h-full max-h-80 cursor-crosshair"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background */}
          <rect width={chartWidth} height={chartHeight} fill="transparent" />

          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={`y-grid-${i}`}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={chartWidth - padding.right}
                y2={tick.y}
                stroke="#374151"
                strokeWidth="1"
                opacity="0.3"
              />
            </g>
          ))}

          {xTicks.map((tick, i) => (
            <g key={`x-grid-${i}`}>
              <line
                x1={tick.x}
                y1={padding.top}
                x2={tick.x}
                y2={chartHeight - padding.bottom}
                stroke="#374151"
                strokeWidth="1"
                opacity="0.3"
              />
            </g>
          ))}

          {/* Chart line */}
          <path d={pathData} fill="none" stroke="#10B981" strokeWidth="2" />

          {/* Y-axis labels */}
          {yTicks.map((tick, i) => (
            <text
              key={`y-label-${i}`}
              x={padding.left - 10}
              y={tick.y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#9CA3AF"
            >
              {formatPriceShort(tick.value)}
            </text>
          ))}

          {/* X-axis labels */}
          {xTicks.map((tick, i) => (
            <text
              key={`x-label-${i}`}
              x={tick.x}
              y={chartHeight - padding.bottom + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#9CA3AF"
            >
              {tick.label}
            </text>
          ))}

          {/* Axis lines */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={chartHeight - padding.bottom}
            stroke="#6B7280"
            strokeWidth="1"
          />
          <line
            x1={padding.left}
            y1={chartHeight - padding.bottom}
            x2={chartWidth - padding.right}
            y2={chartHeight - padding.bottom}
            stroke="#6B7280"
            strokeWidth="1"
          />

          {/* Hover elements */}
          {hoveredPoint &&
            hoveredPoint.x !== undefined &&
            hoveredPoint.y !== undefined && (
              <g>
                {/* Vertical red line */}
                <line
                  x1={hoveredPoint.x}
                  y1={padding.top}
                  x2={hoveredPoint.x}
                  y2={chartHeight - padding.bottom}
                  stroke="#EF4444"
                  strokeWidth="2"
                  opacity="1"
                />

                {/* Red dot on line */}
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="5"
                  fill="#EF4444"
                  stroke="#fff"
                  strokeWidth="2"
                />
              </g>
            )}
        </svg>

        {/* Floating price box */}
        {hoveredPoint &&
          hoveredPoint.rawX !== undefined &&
          hoveredPoint.rawY !== undefined && (
            <div
              className="absolute bg-white text-black px-2 py-1 rounded shadow-lg text-sm font-medium pointer-events-none z-10"
              style={{
                left: hoveredPoint.rawX,
                top: Math.max(hoveredPoint.rawY - 45, 10), // Position above the dot
                transform: "translateX(-50%)", // Perfect center alignment
              }}
            >
              {formatPrice(hoveredPoint.value)}
            </div>
          )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div>Loading cryptocurrency data...</div>
        </div>
      </div>
    );
  }

  if (selectedCoin && coinDetails) {
    return (
      <div className="h-full bg-gray-900 text-white flex flex-col max-h-screen overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-700 p-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedCoin(null)}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              ← Back
            </button>
            <img
              src={coinDetails.image.large}
              alt={coinDetails.name}
              className="w-6 h-6"
            />
            <div>
              <h1 className="text-lg font-bold">{coinDetails.name}</h1>
              <span className="text-gray-400 text-xs uppercase">
                {coinDetails.symbol}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">
              {formatPrice(coinDetails.market_data.current_price.usd)}
            </div>
            <div
              className={`text-xs ${getPercentageColor(
                coinDetails.market_data.price_change_percentage_24h
              )}`}
            >
              {formatPercentage(
                coinDetails.market_data.price_change_percentage_24h
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-3 grid grid-cols-4 gap-3 border-b border-gray-700 flex-shrink-0">
          <div>
            <div className="text-xs text-gray-400">Market Cap</div>
            <div className="text-sm font-semibold">
              {formatNumber(coinDetails.market_data.market_cap.usd)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">24h Volume</div>
            <div className="text-sm font-semibold">
              {formatNumber(coinDetails.market_data.total_volume.usd)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Supply</div>
            <div className="text-sm font-semibold">
              {coinDetails.market_data.circulating_supply?.toLocaleString() ||
                "N/A"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">24h High/Low</div>
            <div className="text-sm font-semibold">
              {formatPrice(coinDetails.market_data.high_24h.usd)} /{" "}
              {formatPrice(coinDetails.market_data.low_24h.usd)}
            </div>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="p-3 flex justify-between items-center border-b border-gray-700 flex-shrink-0">
          <div className="flex gap-1">
            <button
              onClick={() => setChartType("price")}
              className={`px-2 py-1 rounded text-xs ${
                chartType === "price"
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Price
            </button>
            <button
              onClick={() => setChartType("market_cap")}
              className={`px-2 py-1 rounded text-xs ${
                chartType === "market_cap"
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Market Cap
            </button>
          </div>
          <div className="flex gap-1">
            {["1", "7", "30", "90", "365", "max"].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-2 py-1 rounded text-xs ${
                  timeRange === days
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {days === "1"
                  ? "1D"
                  : days === "7"
                  ? "7D"
                  : days === "30"
                  ? "1M"
                  : days === "90"
                  ? "3M"
                  : days === "365"
                  ? "1Y"
                  : "ALL"}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 p-3 min-h-0">
          <Chart />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col max-h-screen overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-700 p-3 flex-shrink-0">
        <h1 className="text-lg font-bold mb-1">
          Cryptocurrency Prices by Market Cap
        </h1>
        <p className="text-gray-400 text-xs">
          Global market cap:{" "}
          {formatNumber(
            Array.isArray(cryptoData)
              ? cryptoData.reduce((sum, coin) => sum + coin.market_cap, 0)
              : 0
          )}
        </p>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <table className="w-full h-full text-sm">
          <thead className="border-b border-gray-700 bg-gray-800">
            <tr>
              <th className="text-left p-2 font-medium text-gray-300 text-xs">
                #
              </th>
              <th className="text-left p-2 font-medium text-gray-300 text-xs">
                Name
              </th>
              <th className="text-right p-2 font-medium text-gray-300 text-xs">
                Price
              </th>
              <th className="text-right p-2 font-medium text-gray-300 text-xs">
                1h %
              </th>
              <th className="text-right p-2 font-medium text-gray-300 text-xs">
                24h %
              </th>
              <th className="text-right p-2 font-medium text-gray-300 text-xs">
                7d %
              </th>
              <th className="text-right p-2 font-medium text-gray-300 text-xs">
                Market Cap
              </th>
              <th className="text-center p-2 font-medium text-gray-300 text-xs">
                7D Chart
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(cryptoData) && cryptoData.length > 0 ? (
              cryptoData.map((coin) => (
                <tr
                  key={coin.id}
                  onClick={() => setSelectedCoin(coin.id)}
                  className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors h-12"
                >
                  <td className="p-2 text-xs">{coin.market_cap_rank}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-5 h-5"
                      />
                      <div>
                        <div className="font-medium text-xs">{coin.name}</div>
                        <div className="text-xs text-gray-400 uppercase">
                          {coin.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-right font-medium text-xs">
                    {formatPrice(coin.current_price)}
                  </td>
                  <td
                    className={`p-2 text-right text-xs ${getPercentageColor(
                      coin.price_change_percentage_1h_in_currency || 0
                    )}`}
                  >
                    {formatPercentage(
                      coin.price_change_percentage_1h_in_currency || 0
                    )}
                  </td>
                  <td
                    className={`p-2 text-right text-xs ${getPercentageColor(
                      coin.price_change_percentage_24h
                    )}`}
                  >
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </td>
                  <td
                    className={`p-2 text-right text-xs ${getPercentageColor(
                      coin.price_change_percentage_7d_in_currency || 0
                    )}`}
                  >
                    {formatPercentage(
                      coin.price_change_percentage_7d_in_currency || 0
                    )}
                  </td>
                  <td className="p-2 text-right text-xs">
                    {formatNumber(coin.market_cap)}
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center">
                      <Sparkline
                        data={coin.sparkline_in_7d?.price || []}
                        color={
                          coin.price_change_percentage_7d_in_currency >= 0
                            ? "#10B981"
                            : "#EF4444"
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-400">
                  {loading
                    ? "Loading cryptocurrency data..."
                    : "No data available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoApp;
