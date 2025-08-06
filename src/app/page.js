"use client"

import React, { useState, useEffect } from 'react';
import {TrendingUp, TrendingDown, Coins, DollarSign, Clock, ShoppingCart, BarChart3, Activity, Zap, Target, Star, Bot, Users, UserPlus, Briefcase, Coffee, Brain } from 'lucide-react';
import Image from "next/image";

const CryptoTradingGame = () => {
  // Default game states
  const [crypto, setCrypto] = useState(0) 
  const [cad, setCad] = useState(1000) 
  const [cooldownLevel, setCooldownLevel] = useState(1) 
  const [lastMineTime, setLastMineTime] = useState(0) 
  const [currentTab, setCurrentTab] = useState('mining');
  const [transactionLog, setTransactionLog] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showAchievementNotification, setShowAchievementNotification] = useState(null);
  const [totalInvested, setTotalInvested] = useState(0)


  // Recruits system
  const [hiredRecruits, setHiredRecruits] = useState([]);
  const [recruitCooldowns, setRecruitCooldowns] = useState({});

  // Shop upgrades state
  const [shopUpgrades, setShopUpgrades] = useState({
    miningBoost: 0,
    luckyMiner: 0,
    marketInsight: 0,
    portfolioInsurance: 0,
    speedTrader: 0,
    dividendBonus: 0,
    autoMiner: 0
  });

  // base stock data
  const [stocks, setStocks] = useState([
    {id: 1, name: 'hacktheskies.com', symbol: 'HTS', price: 100, history: [100], volatility: 0.05, trend: 0.01},
    {id: 2, name: 'LuthorCorp', symbol: 'LTC', price: 200, history: [200], volatility: 0.05, trend: -0.002},
    {id: 3, name: 'Doofenshmirtz Evil Incorporated', symbol: 'DEI', price: 75, history: [75], volatility: 0.015, trend: -0.001 },
    {id: 4, name: 'Kababia', symbol: 'KBA', price: 25, history: [25], volatility: 0.055, trend: 0.005 },
    {id: 5, name: 'DJLJ Physics Solutions', symbol: 'DCTI', price: 150, history: [150], volatility: 0.04, trend: 0.003 },
    {id: 6, name: 'Strayton Wokamont', symbol: 'SHOO', price: 5, history: [5], volatility: 0.07, trend: 0.03 },
  ])

  // basic ai generated achievements
    const achievementDefinitions = [
    {
      id: 'first_mine',
      name: 'First Steps',
      description: 'Mine your first crypto',
      icon: '⛏️',
      category: 'mining',
      rarity: 'common',
      checkCondition: (gameState) => gameState.totalMined >= 1
    },
    {
      id: 'crypto_millionaire',
      name: 'Crypto Millionaire',
      description: 'Accumulate 1,000 crypto',
      icon: '💰',
      category: 'mining',
      rarity: 'rare',
      checkCondition: (gameState) => gameState.crypto >= 1000
    },
    {
      id: 'first_trade',
      name: 'Market Debut',
      description: 'Make your first stock trade',
      icon: '📈',
      category: 'trading',
      rarity: 'common',
      checkCondition: (gameState) => gameState.totalTrades >= 1
    },
    {
      id: 'portfolio_king',
      name: 'Portfolio King',
      description: 'Reach $10,000 portfolio value',
      icon: '👑',
      category: 'trading',
      rarity: 'epic',
      checkCondition: (gameState) => gameState.portfolioValue >= 10000
    },
    {
      id: 'debt_lord',
      name: 'Debt Lord',
      description: 'Go $5,000 into debt',
      icon: '💸',
      category: 'trading',
      rarity: 'uncommon',
      checkCondition: (gameState) => gameState.cad <= -5000
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Reduce mining cooldown to under 1 second',
      icon: '⚡',
      category: 'upgrades',
      rarity: 'rare',
      checkCondition: (gameState) => gameState.currentCooldown < 1000
    },
    {
      id: 'full_team',
      name: 'Dream Team',
      description: 'Hire all 6 recruits',
      icon: '👥',
      category: 'recruits',
      rarity: 'epic',
      checkCondition: (gameState) => gameState.hiredRecruits >= 6
    },
    {
      id: 'lucky_streak',
      name: 'Lucky Streak',
      description: 'Get 5 lucky mines in a row',
      icon: '🍀',
      category: 'mining',
      rarity: 'legendary',
      checkCondition: (gameState) => gameState.consecutiveLuckyMines >= 5
    },
  ]

  const AchievementNotification = ({ achievement }) => {
  if (!achievement) return null;
  
  const rarityColors = {
    common: 'from-gray-600 to-gray-700 border-gray-400',
    uncommon: 'from-green-600 to-green-700 border-green-400',
    rare: 'from-blue-600 to-blue-700 border-blue-400',
    epic: 'from-purple-600 to-purple-700 border-purple-400',
    legendary: 'from-yellow-600 to-yellow-700 border-yellow-400'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div className={`bg-gradient-to-r ${rarityColors[achievement.rarity]} backdrop-blur-lg rounded-xl p-4 border-2 shadow-2xl max-w-sm`}>
        <div className="flex items-center gap-3">
          <div className="text-3xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="font-bold text-white text-lg">Achievement Unlocked!</div>
            <div className="font-bold text-yellow-200">{achievement.name}</div>
            <div className="text-sm text-gray-200">{achievement.description}</div>
            <div className="text-xs text-gray-300 capitalize mt-1">{achievement.rarity} • {achievement.category}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

  const checkAchievements = () => {
  const currentGameState = {
    crypto: crypto,
    cad: cad,
    portfolioValue: getPortfolioValue(),
    totalMined: gameStats.totalMined,
    totalTrades: gameStats.totalTrades,
    consecutiveLuckyMines: gameStats.consecutiveLuckyMines,
    currentCooldown: getCurrentCooldown(),
    hiredRecruits: hiredRecruits.length
  };

  achievementDefinitions.forEach(achievement => {
    const isUnlocked = unlockedAchievements.includes(achievement.id);
    
    if (!isUnlocked && achievement.checkCondition(currentGameState)) {
      setUnlockedAchievements(prev => [...prev, achievement.id]);
      setShowAchievementNotification(achievement);
      
      setTimeout(() => {
        setShowAchievementNotification(null);
      }, 5000);
    }
  });
};


  const [portfolio, setPortfolio] = useState({}); 
  const [tradeAmount, setTradeAmount] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);

  // Available recruits with their investment strategies
  const recruitableCharacters = [
    {
      id: 'sarah_conservative',
      name: 'Dobrik Jackson',
      title: 'Conservative Investor',
      description: 'Makes safe, steady investments. Never loses more than 10% in a single trade.',
      icon: Target,
      hireCost: 2000,
      salary: 50,
      cooldownTime: 30000,
      strategy: 'conservative',
      personality: 'Careful and methodical, Dobrik always reads the fine print.',
      maxDebt: 500,
      specialty: 'Low-risk investments with steady returns'
    },
    {
      id: 'jake_aggressive',
      name: 'Matt "The Bull" Onbacher',
      title: 'Aggressive Trader',
      description: 'High risk, high reward! Can make big gains but also big losses.',
      icon: TrendingUp,
      hireCost: 3500,
      salary: 100,
      cooldownTime: 45000,
      strategy: 'aggressive',
      personality: 'Confident and bold, Jake believes fortune favors the brave.',
      maxDebt: 2000,
      specialty: 'High-volatility stocks and momentum trading'
    },
    {
      id: 'maria_technical',
      name: 'Stokein Vestor',
      title: 'Technical Analyst',
      description: 'Uses charts and patterns to time entries perfectly. Moderate risk.',
      icon: BarChart3,
      hireCost: 4000,
      salary: 75,
      cooldownTime: 60000,
      strategy: 'technical',
      personality: 'Analytical and precise, Maria sees patterns others miss.',
      maxDebt: 1200,
      specialty: 'Chart analysis and trend following'
    },
    {
      id: 'bob_random',
      name: 'Shwarma Mann',
      title: 'Luck-Based Investor',
      description: 'Completely random trades! Could make you rich or bankrupt you.',
      icon: Star,
      hireCost: 1500,
      salary: 25,
      cooldownTime: 20000,
      strategy: 'random',
      personality: 'Believes in lucky streaks and superstitions.',
      maxDebt: 3000,
      specialty: 'Pure gambling disguised as investing'
    },
    {
      id: 'dr_elena',
      name: 'Lex Luthor',
      title: 'Sector Specialist',
      description: 'Focuses on undervalued companies with long-term potential.',
      icon: Brain,
      hireCost: 5000,
      salary: 125,
      cooldownTime: 90000,
      strategy: 'value',
      personality: 'Fueled by hatred to be the best.',
      maxDebt: 800,
      specialty: 'Value investing and sector rotation'
    },
    {
      id: 'coffee_kid',
      name: 'Caf Yin',
      title: 'Day Trading Prodigy',
      description: 'Young, caffeinated, and quick. Makes many small profitable trades.',
      icon: Coffee,
      hireCost: 2800,
      salary: 40,
      cooldownTime: 15000,
      strategy: 'daytrader',
      personality: 'Lives on energy drinks and makes lightning-fast decisions.',
      maxDebt: 1500,
      specialty: 'Scalping and short-term momentum plays'
    }
  ];

  const cryptoRate = 100;
  const baseCooldown = 5000; 
  const baseMineAmount = 1;

  const [gameStats, setGameStats] = useState({
  totalMined: 0,
  totalTrades: 0,
  consecutiveLuckyMines: 0,
  maxPortfolioValue: 0
  });

  const executeRecruitTrade = (recruit) => {
    const availableStocks = stocks;
    const recruitData = recruitableCharacters.find(r => r.id === recruit.id);
    if (!recruitData) return;
    
    let tradeAmount = 0;
    let selectedStock = null;
    let action = 'buy';
    let success = false;

    const maxSpendable = cad + recruitData.maxDebt;
    
    switch (recruitData.strategy) {
      case 'conservative':
        selectedStock = availableStocks[Math.floor(Math.random() * availableStocks.length)];
        tradeAmount = Math.min(200, maxSpendable * 0.1) / selectedStock.price;
        action = Math.random() > 0.3 ? 'buy' : 'sell';
        success = Math.random() > 0.1;
        break;
        
      case 'aggressive':
        const volatileStocks = availableStocks.filter(s => s.volatility > 0.025);
        selectedStock = volatileStocks.length > 0 
          ? volatileStocks[Math.floor(Math.random() * volatileStocks.length)]
          : availableStocks[Math.floor(Math.random() * availableStocks.length)];
        tradeAmount = Math.min(800, maxSpendable * 0.4) / selectedStock.price;
        action = Math.random() > 0.6 ? 'buy' : 'sell';
        success = Math.random() > 0.25;
        break;
        
      case 'technical':
        selectedStock = availableStocks.find(s => {
          if (s.history.length < 3) return false;
          const recent = s.history.slice(-3);
          return recent[2] > recent[1] && recent[1] > recent[0];
        }) || availableStocks[Math.floor(Math.random() * availableStocks.length)];
        tradeAmount = Math.min(500, maxSpendable * 0.25) / selectedStock.price;
        action = selectedStock.trend > 0 ? 'buy' : 'sell';
        success = Math.random() > 0.15;
        break;
        
      default:
        selectedStock = availableStocks[Math.floor(Math.random() * availableStocks.length)];
        tradeAmount = Math.min(300, maxSpendable * 0.15) / selectedStock.price;
        action = Math.random() > 0.5 ? 'buy' : 'sell';
        success = Math.random() > 0.4;
        break;
    }

    tradeAmount = Math.floor(tradeAmount * 100) / 100;
    if (tradeAmount < 0.01) return;

    const cost = tradeAmount * selectedStock.price;
    
    if (action === 'buy') {
      const totalDebt = Math.max(0, -cad);
      if (totalDebt + cost <= recruitData.maxDebt) {
        setCad(prev => prev - cost);
        setPortfolio(prev => ({
          ...prev,
          [selectedStock.id]: (prev[selectedStock.id] || 0) + tradeAmount
        }));
        
        if (!success) {
          setPortfolio(prev => ({
            ...prev,
            [selectedStock.id]: (prev[selectedStock.id] || 0) - (tradeAmount * 0.2)
          }));
        }
        
        addToTransactionLog('RECRUIT_BUY', selectedStock.symbol, tradeAmount, selectedStock.price, success);
      }
    } else {
      const owned = portfolio[selectedStock.id] || 0;
      const toSell = Math.min(tradeAmount, owned);
      
      if (toSell > 0) {
        let revenue = selectedStock.price * toSell;
        
        if (success) {
          revenue *= 1.1;
        } else {
          revenue *= 0.9;
        }
        
        setCad(prev => prev + revenue);
        setPortfolio(prev => ({
          ...prev,
          [selectedStock.id]: Math.max(0, owned - toSell)
        }));
        
        addToTransactionLog('RECRUIT_SELL', selectedStock.symbol, toSell, selectedStock.price, success);
      }
    }
    
    setCad(prev => prev - recruitData.salary);
    addToTransactionLog('SALARY', recruit.name.toUpperCase(), recruitData.salary, 1, false);
    
    setRecruitCooldowns(prev => ({
      ...prev,
      [recruit.id]: Date.now()
    }));
  };

  const hireRecruit = (recruitId) => {
    const recruit = recruitableCharacters.find(r => r.id === recruitId);
    if (!recruit) return;
    
    const totalDebt = Math.max(0, -cad);
    const canAfford = cad >= recruit.hireCost || (totalDebt + recruit.hireCost <= 1000);
    
    if (canAfford && !hiredRecruits.find(r => r.id === recruitId)) {
      setCad(prev => prev - recruit.hireCost);
      setHiredRecruits(prev => [...prev, { id: recruitId, hiredAt: Date.now() }]);
      addToTransactionLog('HIRE', recruit.name.toUpperCase(), 1, recruit.hireCost, null);
    }
  };

  const fireRecruit = (recruitId) => {
    setHiredRecruits(prev => prev.filter(r => r.id !== recruitId));
    setRecruitCooldowns(prev => {
      const newCooldowns = { ...prev };
      delete newCooldowns[recruitId];
      return newCooldowns;
    });
  };

  const canRecruitTrade = (recruitId) => {
    const cooldown = recruitCooldowns[recruitId];
    if (!cooldown) return true;
    
    const recruit = recruitableCharacters.find(r => r.id === recruitId);
    return Date.now() - cooldown >= recruit.cooldownTime;
  };

  const getRemainingCooldown = (recruitId) => {
    const cooldown = recruitCooldowns[recruitId];
    if (!cooldown) return 0;
    
    const recruit = recruitableCharacters.find(r => r.id === recruitId);
    const remaining = recruit.cooldownTime - (Date.now() - cooldown);
    return Math.max(0, Math.ceil(remaining / 1000));
  };

  const shopItems = [
    {
      id: 'autoMiner',
      name: 'Auto Miner Bot',
      description: 'Automatically mines crypto every 10 seconds. Stackable!',
      icon: Bot,
      baseCost: 750,
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
      id: 'speedTrader',
      name: 'Speed Trader',
      description: 'Reduces mining cooldown by additional 200ms per level',
      icon: Clock,
      baseCost: 800,
      maxLevel: 15,
      costMultiplier: 1.6
    }
  ];

  const getCurrentCooldown = () => {
    const speedTraderReduction = shopUpgrades.speedTrader * 200;
    const progressiveReduction = Math.min(cooldownLevel * 100, 2000);
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
      type,
      symbol,
      amount,
      price,
      total: amount * price,
      isProfit
    };
    
    setTransactionLog(prev => [transaction, ...prev.slice(0, 49)]);
  };

  const mineCrypto = () => {
    if (canMine()) {
    let mineAmount = baseMineAmount + (shopUpgrades.miningBoost * 0.5);
    let isLucky = false;
    
    if (shopUpgrades.luckyMiner > 0) {
      const luckChance = shopUpgrades.luckyMiner * 0.1;
      if (Math.random() < luckChance) {
        mineAmount *= 2;
        isLucky = true;
        addToTransactionLog('LUCKY_MINE', 'CRYPTO', mineAmount, 1, true);
      } else {
        addToTransactionLog('MINE', 'CRYPTO', mineAmount, 1);
      }
    } else {
      addToTransactionLog('MINE', 'CRYPTO', mineAmount, 1);
    }
    
    setCrypto(prev => prev + mineAmount);
    setLastMineTime(Date.now());
    
    // Update stats
    setGameStats(prev => ({
      ...prev,
      totalMined: prev.totalMined + mineAmount,
      consecutiveLuckyMines: isLucky ? prev.consecutiveLuckyMines + 1 : 0
    }));
    
    // Check achievements after state update
    setTimeout(checkAchievements, 100);

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
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [shopUpgrades.autoMiner, shopUpgrades.miningBoost]);

  // Auto-execute recruit trades when off cooldown
  useEffect(() => {
    const interval = setInterval(() => {
      hiredRecruits.forEach(hired => {
        if (canRecruitTrade(hired.id)) {
          executeRecruitTrade(hired);
        }
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [hiredRecruits, portfolio, stocks, cad]);

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
      
      setTotalInvested(prev => prev + cost);
      
      addToTransactionLog('BUY', stock.symbol, amount, stock.price);
      setTradeAmount({...tradeAmount, [stockID]: ''});
      
      setGameStats(prev => ({
        ...prev,
        totalTrades: prev.totalTrades + 1
      }));
      
      setTimeout(checkAchievements, 100);
  }
}

  const sellStock = (stockID, amount) => {
  if (!amount || amount <= 0) return;
  
  const stock = stocks.find(s => s.id === stockID);
  const owned = portfolio[stockID] || 0;
  const toSell = Math.min(amount, owned);

  if (toSell > 0) {
    let revenue = stock.price * toSell;
    
    setCad(prev => prev + revenue);
    setPortfolio(prev => ({
      ...prev,
      [stockID]: Math.max(0, owned - toSell)
    }));
    
    setTotalInvested(prev => prev - revenue);
    
    addToTransactionLog('SELL', stock.symbol, toSell, stock.price);
    setTradeAmount({...tradeAmount, [stockID]: ''});
  }
}

  const getNetGainLoss = () => {
    const currentValue = getPortfolioValue();
    return currentValue - totalInvested;
  };

  const getNetGainLossPercentage = () => {
    if (totalInvested === 0) return 0;
    const gainLoss = getNetGainLoss();
    return (gainLoss / totalInvested) * 100;
  };

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

    const AchievementsTab = () => {
    const categories = [...new Set(achievementDefinitions.map(a => a.category))];
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    const filteredAchievements = selectedCategory === 'all' 
      ? achievementDefinitions 
      : achievementDefinitions.filter(a => a.category === selectedCategory);
    
    const rarityColors = {
      common: 'border-gray-400/50 bg-gray-600/20',
      uncommon: 'border-green-400/50 bg-green-600/20',
      rare: 'border-blue-400/50 bg-blue-600/20',
      epic: 'border-purple-400/50 bg-purple-600/20',
      legendary: 'border-yellow-400/50 bg-yellow-600/20'
    };
    
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            🏆 Achievements ({unlockedAchievements.length}/{achievementDefinitions.length})
          </h2>
          
          {/* Category Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCategory === 'all' ? 'bg-purple-600/80 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              All ({achievementDefinitions.length})
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-all capitalize ${
                  selectedCategory === category ? 'bg-purple-600/80 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category} ({achievementDefinitions.filter(a => a.category === category).length})
              </button>
            ))}
          </div>
          
          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map(achievement => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              
              return (
                <div
                  key={achievement.id}
                  className={`rounded-xl p-4 border-2 transition-all ${
                    isUnlocked 
                      ? `${rarityColors[achievement.rarity]} opacity-100 shadow-lg` 
                      : 'border-gray-600/30 bg-gray-800/20 opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                      {isUnlocked ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">
                        {isUnlocked ? achievement.name : '???'}
                      </div>
                      <div className="text-sm text-gray-300 mb-2">
                        {isUnlocked ? achievement.description : 'Achievement locked'}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          isUnlocked ? 'bg-white/20' : 'bg-gray-600/30'
                        }`}>
                          {achievement.rarity}
                        </span>
                        <span className="text-xs text-gray-400 capitalize">
                          {achievement.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Progress Summary */}
          <div className="mt-6 bg-white/5 rounded-xl p-4">
            <h3 className="font-bold mb-3">Progress Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {Object.entries(
                achievementDefinitions.reduce((acc, achievement) => {
                  acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1;
                  return acc;
                }, {})
              ).map(([rarity, total]) => {
                const unlocked = unlockedAchievements.filter(id => {
                  const achievement = achievementDefinitions.find(a => a.id === id);
                  return achievement?.rarity === rarity;
                }).length;
                
                return (
                  <div key={rarity} className="bg-white/10 rounded-lg p-3">
                    <div className="font-bold capitalize text-lg">{rarity}</div>
                    <div className="text-sm text-gray-300">{unlocked}/{total}</div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{width: `${(unlocked/total)*100}%`}}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

    const InteractiveGridBackground = () => {
      const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
      const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

      useEffect(() => {
        // Set initial window size
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });

        const handleMouseMove = (e) => {
          setMousePos({ x: e.clientX, y: e.clientY });
        };

        const handleResize = () => {
          setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', handleResize);
        };
      }, []);

      const gridOffsetX = (mousePos.x / windowSize.width - 0.5) * 20;
      const gridOffsetY = (mousePos.y / windowSize.height - 0.5) * 20;
      const rotateAmount = (mousePos.x / windowSize.width - 0.5) * 2;

      return (
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Base static grid */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}
          />
          
          <div 
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `
                linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
              transform: `translate(${gridOffsetX}px, ${gridOffsetY}px) rotate(${rotateAmount}deg)`,
              transition: 'none'
            }}
          />
          
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(168, 85, 247, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(168, 85, 247, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              transform: `translate(${-gridOffsetX * 0.5}px, ${-gridOffsetY * 0.5}px) scale(${1 + Math.abs(rotateAmount) * 0.1})`,
              transition: 'none'
            }}
          />
        </div>
      );
    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 text-white relative overflow-hidden">
    <InteractiveGridBackground />
    <div className="min-h-screen bg-black-100 text-white">
      <AchievementNotification achievement={showAchievementNotification} />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-100/10 via-transparent to-purple-200/15"></div>
      <div className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-4 border border-white/20 shadow-2xl">
          <div className="flex justify-center mb-3">
              <Image src="/YEAR IN (2).png" width='300' height='300' alt="CRiDO Logo"/>
            </div>
            <p className="text-center">CRiDO is an online clicker-based game where you mine crypto and invest it to grow your portfolio</p>
            <p className="text-center mb-6 opacity-50">Notes: Some recruits functions are buggy, data is <strong>NOT SAVED</strong>.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-purple-600/80 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                <Coins className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{crypto.toFixed(2)}</div>
                <div className="text-sm opacity-75">Crypto</div>
              </div>
              <div className={`backdrop-blur-sm rounded-xl p-4 border ${cad >= 0 ? 'bg-purple-500/80 border-purple-400/30' : 'bg-red-600/80 border-red-400/30'}`}>
                <DollarSign className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">${cad.toFixed(2)}</div>
                <div className="text-sm opacity-75">{cad >= 0 ? 'CAD' : 'DEBT!'}</div>
              </div>
              <div className="bg-purple-700/80 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">${getPortfolioValue().toFixed(2)}</div>
                <div className="flex items-center justify-center gap-2 text-sm">
                    {(() => {
                      const netGainLoss = getNetGainLoss();
                      const percentage = getNetGainLossPercentage();
                      const isPositive = netGainLoss >= 0;
                      
                      return (
                        <>
                          <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                            {isPositive ? '+' : ''}${netGainLoss.toFixed(2)}
                          </span>
                          <span className={`${isPositive ? 'text-green-400' : 'text-red-400'} font-medium`}>
                            ({isPositive ? '+' : ''}{percentage.toFixed(1)}%)
                          </span>
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : netGainLoss < 0 ? (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          ) : null}
                        </>
                      );
                    })()}
                  </div>
                <div className="text-sm opacity-75">Portfolio</div>
              </div>
            </div>
          </div>

          <div className="flex mb-6 bg-white/10 backdrop-blur-lg rounded-2xl p-1 border border-white/20">
            {[
              {id:'mining', label:'Mining & Shop', icon: Coins},
              {id:'trading', label: 'Trading', icon: TrendingUp},
              {id:'recruits', label: 'Recruits', icon: Users},
              {id:'achievements', label: 'Achievements', icon: Star}
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
                      {tab.id === 'recruits' && hiredRecruits.length > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                          {hiredRecruits.length}
                        </span>
                      )}
                    </button>
              )
            })}        
          </div>

          {/* Mining Tab */}
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
                          ? 'bg-green-500/80 hover:bg-green-600 cursor-pointer transform hover:scale-105 border-green-400/60 shadow-2xl shadow-green-400/35' 
                          : 'bg-red-600/50 cursor-not-allowed border-red-400/30'
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
                      <span>Mining Rate:</span>
                      <span className="font-bold text-purple-400">{(baseMineAmount + (shopUpgrades.miningBoost * 0.5)).toFixed(1)} crypto</span>
                    </div>
                    {shopUpgrades.autoMiner > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span>Auto Miners:</span>
                          <span className="font-bold text-blue-400">{shopUpgrades.autoMiner} bots</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Auto Rate:</span>
                          <span className="font-bold text-blue-400">{(shopUpgrades.autoMiner * (baseMineAmount + (shopUpgrades.miningBoost * 0.5))).toFixed(1)} crypto/10s</span>
                        </div>
                      </>
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

                            {/* Transaction Log */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Transaction Log
                </h3>
                <div className="max-h-40 overflow-y-auto space-y-2">
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
                            'bg-gray-600/80 text-white'
                          }`}>
                            {transaction.type}
                          </span>
                          <span className="font-medium">
                            {transaction.type === 'BUY' && `BOUGHT ${transaction.amount.toFixed(2)} ${transaction.symbol}`}
                            {transaction.type === 'SELL' && `SOLD ${transaction.amount.toFixed(2)} ${transaction.symbol}`}
                            {(transaction.type === 'MINE' || transaction.type === 'LUCKY_MINE' || transaction.type === 'AUTO_MINE') && `MINED ${transaction.amount.toFixed(2)} CRYPTO`}
                            {transaction.type === 'CONVERT' && `CONVERTED ${transaction.amount.toFixed(2)} CRYPTO`}
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
                              {item.id === 'speedTrader' && `Current speedup: -${(currentLevel * 0.2).toFixed(1)}s cooldown`}
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
            </div>
          )}

          {/* Achievements Tab */}
          {currentTab === 'achievements' && <AchievementsTab />}

          {/* Recruits Tab */}
          {currentTab === 'recruits' && (
            <div className="space-y-6">
              {/* Hired Recruits Section */}
              {hiredRecruits.length > 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Briefcase className="w-6 h-6" />
                    Your Team ({hiredRecruits.length})
                  </h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {hiredRecruits.map(hired => {
                      const recruit = recruitableCharacters.find(r => r.id === hired.id);
                      if (!recruit) return null;
                      
                      const Icon = recruit.icon;
                      const cooldownRemaining = getRemainingCooldown(hired.id);
                      const canTrade = canRecruitTrade(hired.id);
                      
                      return (
                        <div key={hired.id} className="bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="bg-green-600/30 rounded-lg p-3">
                              <Icon className="w-8 h-8 text-green-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-green-400 mb-1">{recruit.name}</h3>
                              <p className="text-green-300 text-sm mb-2">{recruit.title}</p>
                              <div className="text-xs text-gray-300 mb-3">
                                <div className="mb-1">💰 Salary: ${recruit.salary}/trade</div>
                                <div className="mb-1">🎯 Specialty: {recruit.specialty}</div>
                                <div className="mb-1">💳 Max Debt: ${recruit.maxDebt}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">Trading Status</span>
                              <span className={`text-sm font-bold ${canTrade ? 'text-green-400' : 'text-yellow-400'}`}>
                                {canTrade ? 'Ready' : `Cooldown: ${cooldownRemaining}s`}
                              </span>
                            </div>
                            <div className="bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-full rounded-full transition-all duration-1000"
                                style={{width: canTrade ? '100%' : `${Math.max(0, 100 - (cooldownRemaining / (recruit.cooldownTime / 1000)) * 100)}%`}}
                              />
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-300 mb-4 bg-white/5 rounded-lg p-3">
                            <div className="font-bold text-green-400 mb-1">"{recruit.personality}"</div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => executeRecruitTrade(hired)}
                              disabled={!canTrade}
                              className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all duration-300 ${
                                canTrade
                                  ? 'bg-green-600/80 hover:bg-green-600 text-white cursor-pointer transform hover:scale-105'
                                  : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {canTrade ? 'Force Trade' : 'On Cooldown'}
                            </button>
                            <button
                              onClick={() => fireRecruit(hired.id)}
                              className="bg-red-600/80 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-bold transition-all duration-300"
                            >
                              Fire
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 bg-white/5 rounded-xl p-4">
                    <h4 className="font-bold mb-2 text-yellow-400">⚠️ Debt Management</h4>
                    <p className="text-sm text-gray-300">
                      Your recruits can put you into debt to make investments! Each recruit has a maximum debt limit they can incur.
                      Total current debt: <span className={`font-bold ${cad < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        ${cad < 0 ? Math.abs(cad).toFixed(2) : '0.00'}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Available Recruits Section */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="mt-2 mb-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-4 border border-blue-400/30">
                  <h4 className="font-bold mb-2 text-green-400 flex items-center gap-2">
                    💡 How Recruits Work
                  </h4>
                <div className="text-sm text-gray-300 space-y-2">
                    <p><strong>• Automatic Trading:</strong> Hired recruits will automatically make trades based on their strategy and cooldown timer.</p>
                    <p><strong>• Debt System:</strong> Recruits can spend money you don't have, putting you into debt up to their individual limits.</p>
                    <p><strong>• Salary Costs:</strong> Each trade costs you their salary, paid automatically.</p>
                    <p><strong>• Different Strategies:</strong> Each recruit has unique trading patterns - some are safer, others more aggressive.</p>
                    <p><strong>• Manual Override:</strong> You can force a recruit to trade immediately if they're off cooldown.</p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <UserPlus className="w-6 h-6" />
                  Available Recruits
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {recruitableCharacters.map(recruit => {
                    const Icon = recruit.icon;
                    const isHired = hiredRecruits.find(r => r.id === recruit.id);
                    const totalDebt = Math.max(0, -cad);
                    const canAfford = cad >= recruit.hireCost || (totalDebt + recruit.hireCost <= 1000);
                    
                    return (
                      <div key={recruit.id} className={`backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${
                        isHired 
                          ? 'bg-gray-600/20 border-gray-400/30 opacity-50' 
                          : 'bg-white/10 border-white/20 hover:bg-white/15 hover:shadow-lg hover:shadow-purple-500/10'
                      }`}>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-purple-600/30 rounded-lg p-3">
                            <Icon className="w-8 h-8 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-purple-400 mb-1">{recruit.name}</h3>
                            <p className="text-purple-300 text-sm mb-2">{recruit.title}</p>
                            <p className="text-gray-300 text-xs mb-3">{recruit.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="bg-white/5 rounded-lg p-2">
                              <div className="text-gray-400">Hire Cost</div>
                              <div className="font-bold text-yellow-400">${recruit.hireCost}</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2">
                              <div className="text-gray-400">Salary</div>
                              <div className="font-bold text-red-400">${recruit.salary}/trade</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2">
                              <div className="text-gray-400">Cooldown</div>
                              <div className="font-bold text-blue-400">{recruit.cooldownTime / 1000}s</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2">
                              <div className="text-gray-400">Max Debt</div>
                              <div className="font-bold text-orange-400">${recruit.maxDebt}</div>
                            </div>
                          </div>
                          
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-1">Strategy</div>
                            <div className="text-sm text-gray-300">{recruit.specialty}</div>
                          </div>
                          
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-1">Personality</div>
                            <div className="text-sm text-purple-300 italic">"{recruit.personality}"</div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => hireRecruit(recruit.id)}
                          disabled={isHired || !canAfford}
                          className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                            isHired 
                              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                              : canAfford
                                ? 'bg-purple-600/80 hover:bg-purple-600 text-white cursor-pointer transform hover:scale-105'
                                : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isHired ? 'ALREADY HIRED' : canAfford ? 'HIRE' : 'INSUFFICIENT FUNDS'}
                        </button>
                        
                        {!canAfford && !isHired && totalDebt + recruit.hireCost <= 1000 && (
                          <div className="mt-2 text-xs text-yellow-400 text-center">
                            Can hire with debt (Current debt: ${totalDebt.toFixed(2)})
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

            {/* Selected Stock Modal */}
          {selectedStock && (() => {
            // Get the current stock data instead of using static selectedStock
            const currentStock = stocks.find(s => s.id === selectedStock.id);
            if (!currentStock) return null;
            
            return (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-auto border border-white/20">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-3xl font-bold">{currentStock.symbol}</h2>
                      <p className="text-gray-300">{currentStock.name}</p>
                    </div>
                    <button
                      onClick={() => setSelectedStock(null)}
                      className="text-gray-400 hover:text-white text-2xl">×</button>
                  </div>
                    
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <svg width="100%" height="300" className="w-full" viewBox="0 0 600 300">
                          {currentStock.history.length > 1 && (() => {
                            const min = Math.min(...currentStock.history);
                            const max = Math.max(...currentStock.history);
                            const range = max - min || 1;
                            const padding = 20;
                            
                            const points = currentStock.history.map((price, index) => {
                              const x = padding + (index / (currentStock.history.length - 1)) * (600 - 2 * padding);
                              const y = padding + (1 - (price - min) / range) * (300 - 2 * padding);
                              return `${x},${y}`;
                            }).join(' ');
                            
                            return (
                              <polyline
                                points={points}
                                fill="none"
                                stroke="#a855f7"
                                strokeWidth="3"
                                className="drop-shadow-lg"
                              />
                            );
                          })()}
                        </svg>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="text-2xl font-bold text-purple-400">${currentStock.price.toFixed(2)}</div>
                          <div className="text-sm text-gray-300">Current Price</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="text-2xl font-bold text-green-400">${Math.max(...currentStock.history).toFixed(2)}</div>
                          <div className="text-sm text-gray-300">Day High</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="text-2xl font-bold text-red-400">${Math.min(...currentStock.history).toFixed(2)}</div>
                          <div className="text-sm text-gray-300">Day Low</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4">
                        <h3 className="font-bold mb-3">Your Position</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Shares Owned:</span>
                            <span className="font-bold">{(portfolio[currentStock.id] || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Value:</span>
                            <span className="font-bold">${((portfolio[currentStock.id] || 0) * currentStock.price).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4">
                        <h3 className="font-bold mb-3">Trade</h3>
                        <div className="space-y-3">
                          <input
                            type="number"
                            placeholder="Number of shares"
                            value={tradeAmount[currentStock.id] || ''}
                            onChange={(e) => setTradeAmount({
                              ...tradeAmount, 
                              [currentStock.id]: parseFloat(e.target.value) || ''
                            })}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 backdrop-blur-sm"
                          />
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => setMaxBuy(currentStock.id)}
                              className="flex-1 bg-purple-600/50 hover:bg-purple-600/70 py-2 rounded-lg transition-all backdrop-blur-sm border border-purple-400/30"
                            >
                              Max Buy
                            </button>
                            <button
                              onClick={() => setMaxSell(currentStock.id)}
                              className="flex-1 bg-purple-600/50 hover:bg-purple-600/70 py-2 rounded-lg transition-all backdrop-blur-sm border border-purple-400/30"
                            >
                              Max Sell
                            </button>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => buyStock(currentStock.id, tradeAmount[currentStock.id])}
                              disabled={!tradeAmount[currentStock.id] || tradeAmount[currentStock.id] <= 0}
                              className={`flex-1 py-2 rounded-lg transition-all backdrop-blur-sm ${
                                tradeAmount[currentStock.id] && tradeAmount[currentStock.id] > 0
                                  ? 'bg-green-600/80 hover:bg-green-600 cursor-pointer'
                                  : 'bg-gray-600/50 cursor-not-allowed'
                              }`}
                            >
                              Buy
                            </button>
                            <button
                              onClick={() => sellStock(currentStock.id, tradeAmount[currentStock.id])}
                              disabled={!tradeAmount[currentStock.id] || tradeAmount[currentStock.id] <= 0}
                              className={`flex-1 py-2 rounded-lg transition-all backdrop-blur-sm ${
                                tradeAmount[currentStock.id] && tradeAmount[currentStock.id] > 0
                                  ? 'bg-red-600/80 hover:bg-red-600 cursor-pointer'
                                  : 'bg-gray-600/50 cursor-not-allowed'
                              }`}
                            >
                              Sell
                            </button>
                          </div>
                          
                          <div className="text-sm text-gray-300 text-center">
                            Cost: ${((tradeAmount[currentStock.id] || 0) * currentStock.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Footer */}
          <footer className="mt-12 text-center">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="text-gray-400 text-sm">
                <p className="mb-2">Created with React by Qazi (w/ help from VSCode Copilot and Claude AI 🥀🥀)</p>
                <div className="flex justify-center gap-4 mt-3">
                  <a href="https://github.com/insomnic123" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">GitHub</a>
                  <a href="https://www.linkedin.com/in/qaziayan/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">LinkedIn</a>
                  <a href="https://qazi-ayan.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">Portfolio</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CryptoTradingGame;