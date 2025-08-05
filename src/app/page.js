"use client"

import React, { useState, useEffect } from 'react';
import {TrendingUp, TrendingDown, Coins, DollarSign, Clock, ShoppingCart, BarChart3, Activity, Zap, TrendingUpIcon, Target, Star, Bot } from 'lucide-react';

const CryptoTradingGame = () => {
  // Default game states
  const [crypto, setCrypto] = useState(0) 
  const [cad, setCad] = useState(0)
  const [cooldownLevel, setCooldownLevel] = useState(1) 
  const [lastMineTime, setLastMineTime] = useState(0) 
  const [currentTab, setCurrentTab] = useState('mining');
  const [transactionLog, setTransactionLog] = useState([]);

  // Shop upgrades state
  const [shopUpgrades, setShopUpgrades] = useState({
    miningBoost: 0,      // Increases mining amount
    luckyMiner: 0,       // Chance for bonus crypto
    marketInsight: 0,    // Shows next price direction hints
    portfolioInsurance: 0, // Reduces losses on bad trades
    speedTrader: 0,      // Faster transaction processing
    dividendBonus: 0,    // Passive income from held stocks
    autoMiner: 0         // Auto-mining bots
  });

  // base stock data
  const [stocks, setStocks] = useState([
    {id: 1, name: 'Hack the Skies', symbol: 'HTS', price: 100, history: [100], volatility: 0.02, trend: 0.001},
    {id: 2, name: 'Raiyan & Co.', symbol: 'RYI', price: 200, history: [200], volatility: 0.03, trend: -0.002},
    {id: 3, name: 'Doofenshmirtz Evil Incorporated', symbol: 'DEI', price: 75, history: [75], volatility: 0.015, trend: -0.001 },
    {id: 4, name: 'Kababia', symbol: 'KBA', price: 25, history: [25], volatility: 0.025, trend: 0.0005 },
    {id: 5, name: 'ClosedAI.', symbol: 'CAI', price: 75, history: [75], volatility: 0.015, trend: -0.001 },
    {id: 6, name: 'DJLJ Physics Solutions', symbol: 'DCTI', price: 150, history: [150], volatility: 0.04, trend: 0.003 }
  ])

  const [portfolio, setPortfolio] = useState({}); 
  const [tradeAmount, setTradeAmount] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);

  const cryptoRate = 100;
  const baseCooldown = 5000; 
  const baseMineAmount = 1;

  // Shop items configuration
  const shopItems = [
    {
      id: 'autoMiner',
      name: 'Auto Miner Bot',
      description: 'Automatically mines crypto every 10 seconds. Stackable!',
      icon: Bot,
      baseCost: 2500,
      maxLevel: 50,
      costMultiplier: 1.4
    },
    {
      id: 'miningBoost',
      name: 'Mining Boost',
      description: 'Increases crypto mining amount by +0.5 per level',
      icon: Zap,
      baseCost: 500,
      maxLevel: 10,
      costMultiplier: 1.8
    },
    {
      id: 'luckyMiner',
      name: 'Lucky Miner',
      description: '10% chance per level to get bonus crypto when mining',
      icon: Star,
      baseCost: 1000,
      maxLevel: 5,
      costMultiplier: 2.5
    },
    {
      id: 'marketInsight',
      name: 'Market Insight',
      description: 'Shows price direction hints for stocks',
      icon: TrendingUpIcon,
      baseCost: 2000,
      maxLevel: 3,
      costMultiplier: 3.0
    },
    {
      id: 'portfolioInsurance',
      name: 'Portfolio Insurance',
      description: 'Reduces losses by 5% per level when stocks drop',
      icon: Target,
      baseCost: 1500,
      maxLevel: 8,
      costMultiplier: 2.2
    },
    {
      id: 'speedTrader',
      name: 'Speed Trader',
      description: 'Reduces mining cooldown by additional 200ms per level',
      icon: Clock,
      baseCost: 800,
      maxLevel: 15,
      costMultiplier: 1.6
    },
    {
      id: 'dividendBonus',
      name: 'Dividend Master',
      description: 'Earn 0.1% of portfolio value every 30 seconds per level',
      icon: Activity,
      baseCost: 3000,
      maxLevel: 5,
      costMultiplier: 4.0
    }
  ];

  const getCurrentCooldown = () => {
    const speedTraderReduction = shopUpgrades.speedTrader * 200;
    const progressiveReduction = Math.min(cooldownLevel * 100, 2000); // Up to 2s reduction from progression
    return Math.max(100, baseCooldown - progressiveReduction - speedTraderReduction);
  };

  const getCooldownUpgradeCost = () => Math.floor(50 * Math.pow(1.5, cooldownLevel - 1));
  const canMine = () => Date.now() - lastMineTime >= getCurrentCooldown();

  const getShopItemCost = (item) => {
    const currentLevel = shopUpgrades[item.id];
    return Math.floor(item.baseCost * Math.pow(item.costMultiplier, currentLevel));
  };

  const addToTransactionLog = (type, symbol, amount, price, isProfit = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const transaction = {
      id: Date.now() + Math.random(),
      timestamp,
      type, // 'BUY', 'SELL', 'MINE', 'CONVERT', 'UPGRADE'
      symbol,
      amount,
      price,
      total: amount * price,
      isProfit
    };
    
    setTransactionLog(prev => [transaction, ...prev.slice(0, 49)]); // Keep last 50 transactions
  };

  const mineCrypto = () => {
    if (canMine()) {
      let mineAmount = baseMineAmount + (shopUpgrades.miningBoost * 0.5);
      
      // Lucky miner bonus
      if (shopUpgrades.luckyMiner > 0) {
        const luckChance = shopUpgrades.luckyMiner * 0.1;
        if (Math.random() < luckChance) {
          mineAmount *= 2;
          addToTransactionLog('LUCKY_MINE', 'CRYPTO', mineAmount, 1, true);
        } else {
          addToTransactionLog('MINE', 'CRYPTO', mineAmount, 1);
        }
      } else {
        addToTransactionLog('MINE', 'CRYPTO', mineAmount, 1);
      }
      
      setCrypto(prev => prev + mineAmount);
      setLastMineTime(Date.now());
    }
  }

  const convertCrypto = (amount) => {
    if (!amount || amount <= 0) return;
    
    const maxConvertible = Math.floor(crypto);
    const toConvert = Math.min(amount, maxConvertible);
    if (toConvert > 0) {
      setCrypto(prev => prev - toConvert);
      setCad(prev => prev + toConvert * cryptoRate);
      addToTransactionLog('CONVERT', 'CRYPTO', toConvert, cryptoRate);
      setTradeAmount({...tradeAmount, convert: ''});
    }
  }

  const setMaxConvert = () => {
    setTradeAmount({...tradeAmount, convert: Math.floor(crypto)}); 
  }

  const setMaxBuy = (stockID) => {
    const stock = stocks.find(s => s.id === stockID)
    const maxShares = Math.floor(cad / stock.price);
    setTradeAmount({...tradeAmount, [stockID]: maxShares});
  }

  const setMaxSell = (stockID) => {
    const owned = portfolio[stockID] || 0;
    setTradeAmount({...tradeAmount, [stockID]: owned});
  }

  const upgradeCooldown = () => {
    const cost = getCooldownUpgradeCost();
    if (cad >= cost) {
      setCad(prev => prev - cost);
      setCooldownLevel(prev => prev + 1);
      addToTransactionLog('UPGRADE', 'COOLDOWN', 1, cost);
    } 
  }

  const buyShopItem = (itemId) => {
    const item = shopItems.find(i => i.id === itemId);
    const cost = getShopItemCost(item);
    const currentLevel = shopUpgrades[itemId];
    
    if (cad >= cost && currentLevel < item.maxLevel) {
      setCad(prev => prev - cost);
      setShopUpgrades(prev => ({
        ...prev,
        [itemId]: currentLevel + 1
      }));
      addToTransactionLog('UPGRADE', item.name.toUpperCase(), 1, cost);
    }
  };

  // Auto-miner system
  useEffect(() => {
    if (shopUpgrades.autoMiner > 0) {
      const interval = setInterval(() => {
        const autoMineAmount = shopUpgrades.autoMiner * (baseMineAmount + (shopUpgrades.miningBoost * 0.5));
        setCrypto(prev => prev + autoMineAmount);
        addToTransactionLog('AUTO_MINE', 'CRYPTO', autoMineAmount, 1, null);
      }, 10000); // Every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [shopUpgrades.autoMiner, shopUpgrades.miningBoost]);

  // Dividend system
  useEffect(() => {
    if (shopUpgrades.dividendBonus > 0) {
      const interval = setInterval(() => {
        const portfolioValue = getPortfolioValue();
        if (portfolioValue > 0) {
          const dividendRate = shopUpgrades.dividendBonus * 0.001; // 0.1% per level
          const dividend = portfolioValue * dividendRate;
          setCad(prev => prev + dividend);
          addToTransactionLog('DIVIDEND', 'PORTFOLIO', dividend, 1, true);
        }
      }, 30000); // Every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [shopUpgrades.dividendBonus, portfolio, stocks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          const random = (Math.random() - 0.5) * 2; 
          const change = random * stock.volatility + stock.trend;
          const newPrice = Math.max(1, stock.price * (1 + change));
          const newHistory = [...stock.history.slice(-49), newPrice];
          
          return {
            ...stock,
            price: newPrice,
            history: newHistory
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedStock) {
      const updatedStock = stocks.find(s => s.id === selectedStock.id);
      if (updatedStock) {
        setSelectedStock(updatedStock);
      }
    }
  }, [stocks, selectedStock]);

  const buyStock = (stockID, amount) => {
    if (!amount || amount <= 0) return;
    
    const stock = stocks.find(s => s.id === stockID);
    const cost = stock.price * amount; 

    if (cad >= cost) {
      setCad(prev => prev - cost);
      setPortfolio(prev => ({
        ...prev,
        [stockID]: (prev[stockID] || 0) + amount
      }));
      addToTransactionLog('BUY', stock.symbol, amount, stock.price);
      setTradeAmount({...tradeAmount, [stockID]: ''});
    }
  }

  const sellStock = (stockID, amount) => {
    if (!amount || amount <= 0) return;
    
    const stock = stocks.find(s => s.id === stockID);
    const owned = portfolio[stockID] || 0;
    const toSell = Math.min(amount, owned);

   if (toSell > 0) {
      let revenue = stock.price * toSell;
      
      // Apply portfolio insurance if user has losses
      if (shopUpgrades.portfolioInsurance > 0) {
        // This is a simplified loss protection - in a real implementation you'd track buy prices
        const insuranceBonus = revenue * (shopUpgrades.portfolioInsurance * 0.05);
        revenue += insuranceBonus;
      }
      
      setCad(prev => prev + revenue);
      setPortfolio(prev => ({
        ...prev,
        [stockID]: Math.max(0, owned - toSell)
      }));
      addToTransactionLog('SELL', stock.symbol, toSell, stock.price);
      setTradeAmount({...tradeAmount, [stockID]: ''});
    }
  }

  const getPortfolioValue = () => {
    return Object.entries(portfolio).reduce((total, [stockID, shares]) => {
      const stock = stocks.find(s => s.id === parseInt(stockID));
      return total + (stock ? stock.price * shares : 0);
    }, 0)
  }

  const renderMiniChart = (history) => {
    if (history.length < 2) return null; 

    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;

    const points = history.map((price, index) => {
      const x = (index/(history.length - 1)) * 80;
      const y = 30 - ((price - min) / range) * 25;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="80" height="30" className="inline-block" viewBox="0 0 80 30">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    )
  }

  const renderAdvancedChart = (stock) => {
    if (stock.history.length < 2) return null;

    const history = stock.history;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const padding = 40;
    const chartWidth = 600;
    const chartHeight = 300;

    // Calculate moving averages
    const calculateMovingAverage = (data, period) => {
      const result = [];
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          result.push(null);
        } else {
          const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
          result.push(sum / period);
        }
      }
      return result;
    };

    const ma5 = calculateMovingAverage(history, 5);
    const ma10 = calculateMovingAverage(history, 10);

    // Price line points
    const pricePoints = history.map((price, index) => {
      const x = padding + (index / (history.length - 1)) * (chartWidth - 2 * padding);
      const y = padding + (1 - (price - min) / range) * (chartHeight - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    // MA5 line points
    const ma5Points = ma5.map((price, index) => {
      if (price === null) return null;
      const x = padding + (index / (ma5.length - 1)) * (chartWidth - 2 * padding);
      const y = padding + (1 - (price - min) / range) * (chartHeight - 2 * padding);
      return `${x},${y}`;
    }).filter(point => point !== null).join(' ');

    // MA10 line points
    const ma10Points = ma10.map((price, index) => {
      if (price === null) return null;
      const x = padding + (index / (ma10.length - 1)) * (chartWidth - 2 * padding);
      const y = padding + (1 - (price - min) / range) * (chartHeight - 2 * padding);
      return `${x},${y}`;
    }).filter(point => point !== null).join(' ');

    // Support and resistance levels
    const recentHigh = Math.max(...history.slice(-10));
    const recentLow = Math.min(...history.slice(-10));
    const supportY = padding + (1 - (recentLow - min) / range) * (chartHeight - 2 * padding);
    const resistanceY = padding + (1 - (recentHigh - min) / range) * (chartHeight - 2 * padding);

    // Volume bars (simulated based on volatility)
    const volumeBars = history.map((price, index) => {
      if (index === 0) return 0;
      const change = Math.abs(price - history[index - 1]);
      return change * 1000; // Simulated volume
    });

    const maxVolume = Math.max(...volumeBars);

    return (
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold">Advanced Chart - {stock.symbol}</h4>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-purple-400"></div>
              <span>Price</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-blue-400"></div>
              <span>MA5</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-green-400"></div>
              <span>MA10</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-red-400 opacity-50"></div>
              <span>S&R</span>
            </div>
          </div>
        </div>
        
        <svg width="100%" height="400" viewBox={`0 0 ${chartWidth} 400`}>
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map(i => (
            <g key={`grid-${i}`}>
              <line
                x1={padding}
                y1={(i / 6) * chartHeight}
                x2={chartWidth - padding}
                y2={(i / 6) * chartHeight}
                stroke="#ffffff10"
                strokeWidth="0.5"
              />
              <text
                x={padding - 10}
                y={(i / 6) * chartHeight + 5}
                fill="#ffffff60"
                fontSize="10"
                textAnchor="end"
              >
                ${(max - (i / 6) * range).toFixed(1)}
              </text>
            </g>
          ))}

          {/* Support and Resistance lines */}
          <line
            x1={padding}
            y1={supportY}
            x2={chartWidth - padding}
            y2={supportY}
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.6"
          />
          <line
            x1={padding}
            y1={resistanceY}
            x2={chartWidth - padding}
            y2={resistanceY}
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.6"
          />

          {/* Volume bars */}
          {volumeBars.map((volume, index) => {
            if (index === 0) return null;
            const x = padding + (index / (volumeBars.length - 1)) * (chartWidth - 2 * padding);
            const barHeight = (volume / maxVolume) * 60;
            return (
              <rect
                key={`volume-${index}`}
                x={x - 1}
                y={chartHeight + 10}
                width="2"
                height={barHeight}
                fill="#ffffff20"
              />
            );
          })}

          {/* Moving Average lines */}
          {ma10Points && (
            <polyline
              points={ma10Points}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              opacity="0.7"
            />
          )}
          {ma5Points && (
            <polyline
              points={ma5Points}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              opacity="0.8"
            />
          )}

          {/* Main price line */}
          <polyline
            points={pricePoints}
            fill="none"
            stroke="#a855f7"
            strokeWidth="3"
            className="drop-shadow-lg"
          />

          {/* Current price dot */}
          <circle
            cx={chartWidth - padding}
            cy={padding + (1 - (stock.price - min) / range) * (chartHeight - 2 * padding)}
            r="4"
            fill="#a855f7"
            className="animate-pulse"
          />

          {/* Labels */}
          <text x={10} y={supportY - 5} fill="#ef4444" fontSize="10">Support: ${recentLow.toFixed(2)}</text>
          <text x={10} y={resistanceY - 5} fill="#ef4444" fontSize="10">Resistance: ${recentHigh.toFixed(2)}</text>
          <text x={padding} y={chartHeight + 90} fill="#ffffff60" fontSize="10">Volume</text>
        </svg>

        {/* Technical indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-gray-400">RSI (14)</div>
            <div className="font-bold text-purple-400">{(50 + Math.random() * 40).toFixed(1)}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-gray-400">MACD</div>
            <div className={`font-bold ${Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}`}>
              {(Math.random() * 2 - 1).toFixed(3)}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-gray-400">Volatility</div>
            <div className="font-bold text-yellow-400">{(stock.volatility * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-gray-400">Trend</div>
            <div className={`font-bold ${stock.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stock.trend > 0 ? '↗️ Bull' : '↘️ Bear'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getMarketInsight = (stock) => {
    if (shopUpgrades.marketInsight === 0) return null;
    
    // Simple trend prediction based on recent history
    if (stock.history.length < 3) return null;
    
    const recent = stock.history.slice(-3);
    const trend = recent[2] - recent[0];
    
    if (trend > 0) {
      return <span className="text-green-400 text-xs">📈 Bullish</span>;
    } else if (trend < 0) {
      return <span className="text-red-400 text-xs">📉 Bearish</span>;
    } else {
      return <span className="text-yellow-400 text-xs">➡️ Sideways</span>;
    }
  };

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!canMine()) {
        const remaining = getCurrentCooldown() - (Date.now() - lastMineTime);
        setTimeLeft(Math.max(0, Math.ceil(remaining / 1000)));
      } else {
        setTimeLeft(0);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [lastMineTime, cooldownLevel, shopUpgrades.speedTrader]);


  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-purple-600/20"></div>

      <div className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
            <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CRiDO | Day Trading Simulator
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-purple-600/80 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <Coins className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{crypto.toFixed(2)}</div>
              <div className="text-sm opacity-75">Crypto</div>
              </div>
              <div className="bg-purple-500/80 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                <DollarSign className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">${cad.toFixed(2)}</div>
                <div className="text-sm opacity-75">CAD</div>
              </div>
               <div className="bg-purple-700/80 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">${getPortfolioValue().toFixed(2)}</div>
                <div className="text-sm opacity-75">Portfolio</div>
            </div>
          </div>
        </div>

        <div className="flex mb-6 bg-white/10 backdrop-blur-lg rounded-2xl p-1 border border-white/20">
          {[
            {id:'mining', label:'Mining & Shop', icon: Coins},
            {id:'trading', label: 'Trading', icon: TrendingUp}
          ].map(tab => {
            const Icon = tab.icon; 
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 
                  ${currentTab === tab.id ? `bg-purple-600/80 text-white shadow-lg backdrop-blur-sm` : `text-gray-300 hover:text-white hover:bg-white/10`}`}>
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
            )
          })}        
        </div>

        {selectedStock && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-auto border border-white/20">
                              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold">{selectedStock.symbol}</h2>
                  <p className="text-gray-300">{selectedStock.name}</p>
                  {shopUpgrades.marketInsight > 0 && (
                    <div className="mt-2">{getMarketInsight(selectedStock)}</div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowAdvancedCharts(!showAdvancedCharts)}
                    className={`px-4 py-2 rounded-lg transition-all backdrop-blur-sm border ${
                      showAdvancedCharts 
                        ? 'bg-purple-600/80 border-purple-400/50 text-white' 
                        : 'bg-white/10 border-white/20 text-gray-300 hover:text-white'
                    }`}
                  >
                    {showAdvancedCharts ? 'Simple Chart' : 'Advanced Chart'}
                  </button>
                  <button
                    onClick={() => setSelectedStock(null)}
                    className="text-gray-400 hover:text-white text-2xl">×</button>
                </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    {showAdvancedCharts ? (
                      renderAdvancedChart(selectedStock)
                    ) : (
                      <>
                        <div className="bg-white/5 rounded-xl p-4 mb-4">
                         <svg width="100%" height="300" className="w-full" viewBox="0 0 600 300">
                            {selectedStock.history.length > 1 && (() => {
                              const min = Math.min(...selectedStock.history);
                              const max = Math.max(...selectedStock.history);
                              const range = max - min || 1;
                              const padding = 20;
                              
                              const points = selectedStock.history.map((price, index) => {
                                const x = padding + (index / (selectedStock.history.length - 1)) * (600 - 2 * padding);
                                const y = padding + (1 - (price - min) / range) * (300 - 2 * padding);
                                return `${x},${y}`;
                              }).join(' ');
                              
                            
                              const gridLines = [];
                              for (let i = 1; i <= 5; i++) {
                                const y = (i / 6) * 300;
                                gridLines.push(
                                  <line
                                    key={`grid-${i}`}
                                    x1={padding}
                                    y1={y}
                                    x2={600 - padding}
                                    y2={y}
                                    stroke="#ffffff20"
                                    strokeWidth="0.5"
                                  />
                                );
                              }
                              
                              return (
                                <g>
                                  {gridLines}
                                  <polyline
                                    points={points}
                                    fill="none"
                                    stroke="#a855f7"
                                    strokeWidth="3"
                                    className="drop-shadow-lg"
                                  />
                    
                                  {selectedStock.history.length > 0 && (
                                    <circle
                                      cx={600 - padding}
                                      cy={padding + (1 - (selectedStock.price - min) / range) * (300 - 2 * padding)}
                                      r="4"
                                      fill="#a855f7"
                                      className="animate-pulse"
                                    />
                                  )}
                                </g>
                              );
                            })()}
                          </svg>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-2xl font-bold text-purple-400">${selectedStock.price.toFixed(2)}</div>
                            <div className="text-sm text-gray-300">Current Price</div>
                          </div>
                           <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-2xl font-bold text-green-400">${Math.max(...selectedStock.history).toFixed(2)}</div>
                            <div className="text-sm text-gray-300">Day High</div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-2xl font-bold text-red-400">${Math.min(...selectedStock.history).toFixed(2)}</div>
                            <div className="text-sm text-gray-300">Day Low</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-4">
                      <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="font-bold mb-3">Your Position</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Shares Owned:</span>
                          <span className="font-bold">{(portfolio[selectedStock.id] || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Value:</span>
                          <span className="font-bold">${((portfolio[selectedStock.id] || 0) * selectedStock.price).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

 <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="font-bold mb-3">Trade</h3>
                      <div className="space-y-3">
                        <input
                          type="number"
                          placeholder="Number of shares"
                          value={tradeAmount[selectedStock.id] || ''}
                          onChange={(e) => setTradeAmount({
                            ...tradeAmount, 
                            [selectedStock.id]: parseFloat(e.target.value) || ''
                          })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 backdrop-blur-sm"
                        />
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => setMaxBuy(selectedStock.id)}
                            className="flex-1 bg-purple-600/50 hover:bg-purple-600/70 py-2 rounded-lg transition-all backdrop-blur-sm border border-purple-400/30"
                          >
                            Max Buy
                          </button>
                          <button
                            onClick={() => setMaxSell(selectedStock.id)}
                            className="flex-1 bg-purple-600/50 hover:bg-purple-600/70 py-2 rounded-lg transition-all backdrop-blur-sm border border-purple-400/30"
                          >
                            Max Sell
                          </button>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => buyStock(selectedStock.id, tradeAmount[selectedStock.id])}
                            disabled={!tradeAmount[selectedStock.id] || tradeAmount[selectedStock.id] <= 0}
                            className={`flex-1 py-2 rounded-lg transition-all backdrop-blur-sm ${
                              tradeAmount[selectedStock.id] && tradeAmount[selectedStock.id] > 0
                                ? 'bg-green-600/80 hover:bg-green-600 cursor-pointer'
                                : 'bg-gray-600/50 cursor-not-allowed'
                            }`}
                          >
                            Buy
                          </button>
                          <button
                            onClick={() => sellStock(selectedStock.id, tradeAmount[selectedStock.id])}
                            disabled={!tradeAmount[selectedStock.id] || tradeAmount[selectedStock.id] <= 0}
                            className={`flex-1 py-2 rounded-lg transition-all backdrop-blur-sm ${
                              tradeAmount[selectedStock.id] && tradeAmount[selectedStock.id] > 0
                                ? 'bg-red-600/80 hover:bg-red-600 cursor-pointer'
                                : 'bg-gray-600/50 cursor-not-allowed'
                            }`}
                          >
                            Sell
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-300 text-center">
                          Cost: ${((tradeAmount[selectedStock.id] || 0) * selectedStock.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        )}

        {currentTab === 'mining' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mining Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold mb-4">Mine Crypto</h2>
                  
                  <div className="text-center mb-6">
                    <button
                      onClick={mineCrypto}
                      disabled={!canMine()}
                      className={`w-32 h-32 rounded-full text-xl font-bold transition-all duration-300 backdrop-blur-sm border-2 ${
                        canMine() 
                          ? 'bg-purple-600/80 hover:bg-purple-600 cursor-pointer transform hover:scale-105 border-purple-400/50 shadow-2xl shadow-purple-500/25' 
                          : 'bg-gray-600/50 cursor-not-allowed border-gray-400/30'
                      }`}
                    >
                      {canMine() ? 'MINE!' : timeLeft + 's'}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Cooldown Level:</span>
                      <span className="font-bold text-purple-400">{cooldownLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Cooldown:</span>
                      <span className="font-bold text-purple-400">{(getCurrentCooldown() / 1000).toFixed(1)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Level Reduction:</span>
                      <span className="font-bold text-green-400">-0.1s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Manual Mining Rate:</span>
                      <span className="font-bold text-purple-400">{(baseMineAmount + (shopUpgrades.miningBoost * 0.5)).toFixed(1)} crypto</span>
                    </div>
                    {shopUpgrades.autoMiner > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span>Auto Miners:</span>
                          <span className="font-bold text-blue-400">{shopUpgrades.autoMiner} bots</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Auto Mining Rate:</span>
                          <span className="font-bold text-blue-400">{(shopUpgrades.autoMiner * (baseMineAmount + (shopUpgrades.miningBoost * 0.5))).toFixed(1)} crypto/10s</span>
                        </div>
                      </>
                    )}
                    {shopUpgrades.luckyMiner > 0 && (
                      <div className="flex justify-between">
                        <span>Lucky Chance:</span>
                        <span className="font-bold text-yellow-400">{(shopUpgrades.luckyMiner * 10)}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conversion & Upgrades */}
                <div className="space-y-6">
                  {/* Conversion */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold mb-4">Convert Crypto</h3>
                    <div className="mb-4">
                      <div className="text-sm text-gray-300 mb-2">
                        Rate: {cryptoRate} CAD per Crypto
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={tradeAmount.convert || ''}
                          onChange={(e) => setTradeAmount({...tradeAmount, convert: parseFloat(e.target.value) || ''})}
                          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 backdrop-blur-sm"
                        />
                        <button
                          onClick={() => convertCrypto(tradeAmount.convert)}
                          disabled={!tradeAmount.convert || tradeAmount.convert <= 0}
                          className={`px-4 py-2 rounded-lg transition-all backdrop-blur-sm ${
                            tradeAmount.convert && tradeAmount.convert > 0
                              ? 'bg-purple-600/80 hover:bg-purple-600 cursor-pointer'
                              : 'bg-gray-600/50 cursor-not-allowed'
                          }`}
                        >
                          Convert
                        </button>
                        <button
                          onClick={setMaxConvert}
                          className="bg-purple-700/80 hover:bg-purple-700 px-4 py-2 rounded-lg transition-all backdrop-blur-sm"
                        >
                          Max
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Upgrades */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold mb-4">Upgrades</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold">Reduce Cooldown</div>
                          <div className="text-sm text-gray-300">-0.1s cooldown (progressive)</div>
                        </div>
                        <button
                          onClick={upgradeCooldown}
                          disabled={cad < getCooldownUpgradeCost()}
                          className={`px-4 py-2 rounded-lg transition-all backdrop-blur-sm ${
                            cad >= getCooldownUpgradeCost()
                              ? 'bg-yellow-600/80 hover:bg-yellow-600 border border-yellow-400/30'
                              : 'bg-gray-600/50 cursor-not-allowed border border-gray-400/30'
                          }`}
                        >
                          ${getCooldownUpgradeCost()}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Section */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  Shop
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {shopItems.map(item => {
                    const Icon = item.icon;
                    const currentLevel = shopUpgrades[item.id];
                    const cost = getShopItemCost(item);
                    const isMaxed = currentLevel >= item.maxLevel;
                    const canAfford = cad >= cost;
                    
                    return (
                      <div key={item.id} className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${item.id === 'autoMiner' ? 'ring-2 ring-blue-400/50' : ''}`}>
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`rounded-lg p-3 ${item.id === 'autoMiner' ? 'bg-blue-600/30' : 'bg-purple-600/30'}`}>
                            <Icon className={`w-8 h-8 ${item.id === 'autoMiner' ? 'text-blue-400' : 'text-purple-400'}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-2 ${item.id === 'autoMiner' ? 'text-blue-400' : 'text-purple-400'}`}>
                              {item.name}
                              {item.id === 'autoMiner' && currentLevel > 0 && (
                                <span className="ml-2 text-sm bg-blue-600/30 px-2 py-1 rounded-full">
                                  {currentLevel} active
                                </span>
                              )}
                            </h3>
                            <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-sm text-gray-400">
                                Level {currentLevel}/{item.maxLevel}
                              </span>
                              <div className="flex-1 mx-3 bg-white/10 rounded-full h-2">
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${item.id === 'autoMiner' ? 'bg-blue-600' : 'bg-purple-600'}`}
                                  style={{width: `${(currentLevel / item.maxLevel) * 100}%`}}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-400">
                            {isMaxed ? 'MAX LEVEL' : `Next: ${cost.toLocaleString()}`}
                          </div>
                          <button
                            onClick={() => buyShopItem(item.id)}
                            disabled={isMaxed || !canAfford}
                            className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
                              isMaxed 
                                ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                : canAfford
                                  ? `${item.id === 'autoMiner' ? 'bg-blue-600/80 hover:bg-blue-600' : 'bg-purple-600/80 hover:bg-purple-600'} text-white cursor-pointer transform hover:scale-105`
                                  : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {isMaxed ? 'MAXED' : canAfford ? 'BUY' : 'INSUFFICIENT FUNDS'}
                          </button>
                        </div>
                        
                        {/* Show current bonus if owned */}
                        {currentLevel > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className={`text-sm ${item.id === 'autoMiner' ? 'text-blue-400' : 'text-green-400'}`}>
                              {item.id === 'autoMiner' && `${currentLevel} bots mining ${(currentLevel * (baseMineAmount + (shopUpgrades.miningBoost * 0.5))).toFixed(1)} crypto every 10s`}
                              {item.id === 'miningBoost' && `Current bonus: +${(currentLevel * 0.5).toFixed(1)} crypto per mine`}
                              {item.id === 'luckyMiner' && `Current bonus: ${currentLevel * 10}% lucky chance`}
                              {item.id === 'marketInsight' && currentLevel >= 1 && `Market insights active`}
                              {item.id === 'portfolioInsurance' && `Current protection: ${currentLevel * 5}% loss reduction`}
                              {item.id === 'speedTrader' && `Current speedup: -${(currentLevel * 0.2).toFixed(1)}s cooldown`}
                              {item.id === 'dividendBonus' && `Current rate: ${(currentLevel * 0.1).toFixed(1)}% every 30s`}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Trading Tab */}
          {currentTab === 'trading' && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-6">Stock Trading</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {stocks.map(stock => {
                    const owned = portfolio[stock.id] || 0;
                    const change = stock.history.length > 1 
                      ? ((stock.price - stock.history[stock.history.length - 2]) / stock.history[stock.history.length - 2]) * 100
                      : 0;
                    
                    return (
                      <div 
                        key={stock.id} 
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                        onClick={() => setSelectedStock(stock)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-purple-400">{stock.symbol}</h3>
                            <p className="text-sm text-gray-300">{stock.name}</p>
                            {shopUpgrades.marketInsight > 0 && (
                              <div className="mt-1">{getMarketInsight(stock)}</div>
                            )}
                          </div>
                          <div className="text-right">
                            {renderMiniChart(stock.history)}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-2xl font-bold">${stock.price.toFixed(2)}</div>
                          <div className={`flex items-center gap-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {change.toFixed(2)}%
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-300 mb-4">
                          Owned: {owned.toFixed(2)} shares (${(owned * stock.price).toFixed(2)})
                        </div>
                        
                        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Shares"
                              value={tradeAmount[stock.id] || ''}
                              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm backdrop-blur-sm"
                              onChange={(e) => setTradeAmount({
                                ...tradeAmount, 
                                [stock.id]: parseFloat(e.target.value) || ''
                              })}
                            />
                            <button
                              onClick={() => buyStock(stock.id, tradeAmount[stock.id])}
                              disabled={!tradeAmount[stock.id] || tradeAmount[stock.id] <= 0}
                              className={`px-3 py-1 rounded-lg text-sm transition-all backdrop-blur-sm ${
                                tradeAmount[stock.id] && tradeAmount[stock.id] > 0
                                  ? 'bg-green-600/80 hover:bg-green-600 cursor-pointer'
                                  : 'bg-gray-600/50 cursor-not-allowed'
                              }`}
                            >
                              Buy
                            </button>
                            <button
                              onClick={() => setMaxBuy(stock.id)}
                              className="bg-green-700/80 hover:bg-green-700 px-2 py-1 rounded-lg text-sm transition-all backdrop-blur-sm"
                            >
                              Max
                            </button>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => sellStock(stock.id, tradeAmount[stock.id])}
                              disabled={!tradeAmount[stock.id] || tradeAmount[stock.id] <= 0}
                              className={`flex-1 px-3 py-1 rounded-lg text-sm transition-all backdrop-blur-sm ${
                                tradeAmount[stock.id] && tradeAmount[stock.id] > 0
                                  ? 'bg-red-600/80 hover:bg-red-600 cursor-pointer'
                                  : 'bg-gray-600/50 cursor-not-allowed'
                              }`}
                            >
                              Sell
                            </button>
                            <button
                              onClick={() => setMaxSell(stock.id)}
                              className="bg-red-700/80 hover:bg-red-700 px-2 py-1 rounded-lg text-sm transition-all backdrop-blur-sm"
                            >
                              All
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transaction Log */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Transaction Log
                </h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {transactionLog.length === 0 ? (
                    <div className="text-gray-400 text-center py-4">No transactions yet</div>
                  ) : (
                    transactionLog.map(transaction => (
                      <div key={transaction.id} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">{transaction.timestamp}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            transaction.type === 'BUY' ? 'bg-green-600/80 text-white' :
                            transaction.type === 'SELL' ? 'bg-red-600/80 text-white' :
                            transaction.type === 'MINE' || transaction.type === 'LUCKY_MINE' || transaction.type === 'AUTO_MINE' ? 'bg-blue-600/80 text-white' :
                            transaction.type === 'CONVERT' ? 'bg-purple-600/80 text-white' :
                            transaction.type === 'DIVIDEND' ? 'bg-yellow-600/80 text-white' :
                            'bg-gray-600/80 text-white'
                          }`}>
                            {transaction.type}
                          </span>
                          <span className="font-medium">
                            {transaction.type === 'BUY' && `BOUGHT ${transaction.amount.toFixed(2)} ${transaction.symbol}`}
                            {transaction.type === 'SELL' && `SOLD ${transaction.amount.toFixed(2)} ${transaction.symbol}`}
                            {(transaction.type === 'MINE' || transaction.type === 'LUCKY_MINE' || transaction.type === 'AUTO_MINE') && `MINED ${transaction.amount.toFixed(2)} CRYPTO`}
                            {transaction.type === 'CONVERT' && `CONVERTED ${transaction.amount.toFixed(2)} CRYPTO`}
                            {transaction.type === 'DIVIDEND' && `DIVIDEND FROM PORTFOLIO`}
                            {transaction.type === 'UPGRADE' && `UPGRADED ${transaction.symbol}`}
                          </span>
                        </div>
                        <div className={`font-bold ${
                          transaction.type === 'BUY' || transaction.type === 'UPGRADE' ? 'text-red-400' :
                          transaction.isProfit ? 'text-green-400' : 'text-green-400'
                        }`}>
                          {transaction.type === 'BUY' || transaction.type === 'UPGRADE' ? '-' : '+'}
                          ${transaction.total ? transaction.total.toFixed(2) : (transaction.amount * transaction.price).toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Shop Tab */}
          {currentTab === 'shop' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-6">Shop</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {shopItems.map(item => {
                  const Icon = item.icon;
                  const currentLevel = shopUpgrades[item.id];
                  const cost = getShopItemCost(item);
                  const isMaxed = currentLevel >= item.maxLevel;
                  const canAfford = cad >= cost;
                  
                  return (
                    <div key={item.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="bg-purple-600/30 rounded-lg p-3">
                          <Icon className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-purple-400 mb-2">{item.name}</h3>
                          <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-400">
                              Level {currentLevel}/{item.maxLevel}
                            </span>
                            <div className="flex-1 mx-3 bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-full rounded-full transition-all duration-300"
                                style={{width: `${(currentLevel / item.maxLevel) * 100}%`}}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          {isMaxed ? 'MAX LEVEL' : `Next: ${cost}`}
                        </div>
                        <button
                          onClick={() => buyShopItem(item.id)}
                          disabled={isMaxed || !canAfford}
                          className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
                            isMaxed 
                              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                              : canAfford
                                ? 'bg-purple-600/80 hover:bg-purple-600 text-white cursor-pointer transform hover:scale-105'
                                : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isMaxed ? 'MAXED' : canAfford ? 'UPGRADE' : 'INSUFFICIENT FUNDS'}
                        </button>
                      </div>
                      
                      {/* Show current bonus if owned */}
                      {currentLevel > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="text-sm text-green-400">
                            {item.id === 'miningBoost' && `Current bonus: +${(currentLevel * 0.5).toFixed(1)} crypto per mine`}
                            {item.id === 'luckyMiner' && `Current bonus: ${currentLevel * 10}% lucky chance`}
                            {item.id === 'marketInsight' && currentLevel >= 1 && `Market insights active`}
                            {item.id === 'portfolioInsurance' && `Current protection: ${currentLevel * 5}% loss reduction`}
                            {item.id === 'speedTrader' && `Current speedup: -${(currentLevel * 0.2).toFixed(1)}s cooldown`}
                            {item.id === 'dividendBonus' && `Current rate: ${(currentLevel * 0.1).toFixed(1)}% every 30s`}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-gray-400 text-sm">
              <p className="mb-2">Created with NextJS by Qazi (w/ help from VSCode Copilot and Claude AI 🥀🥀)</p>
              <div className="flex justify-center gap-4 mt-3">
                <a href="https://github.com/insomnic123" target="_blank" className="hover:text-purple-400 transition-colors">GitHub</a>
                <a href="https://www.linkedin.com/in/qaziayan/" target="_blank" className="hover:text-purple-400 transition-colors">LinkedIn</a>
                <a href="https://qazi-ayan.vercel.app/" target="_blank" className="hover:text-purple-400 transition-colors">Portfolio</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CryptoTradingGame;