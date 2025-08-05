"use client"

import React, { useState, useEffect } from 'react';
import {TrendingUp, TrendingDown, Coins, DollarSign, Clock, ShoppingCart, BarChart3 } from 'lucide-react';

const CryptoTradingGame = () => {
  // Default game states
  const [crypto, setCrypto] = useState(0) 
  const [cad, setCad] = useState(100)
  const [cooldownLevel, setCooldownLevel] = useState(1) 
  const [lastMineTime, setLastMineTime] = useState(0) 
  const [currentTab, setCurrentTab] = useState('mining');

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

  const cryptoRate = 10; // 1 crypto = 10 CAD
  const baseCooldown = 5000; 
  const baseMineAmount = 1;

  const getCurrentCooldown = () => Math.max(1000, baseCooldown - (cooldownLevel - 1) * 500);
  getCooldownUpgradeCost = () => Math.floor(50 * Math.pow(1.5, cooldownLevel - 1));
  const canMine = () => Date.now() - lastMineTime >= getCurrentCooldown();

  const mineCrypto = () => {
    if (canMine()) {
      setCrypto(prev => prev + baseMineAmount);
      setLastMineTime(Date.now());
    }
  }

  const convertCrypto = (amount) => {
    const maxConvertible = Math.floor(crypto);
    const toConvert = Math.min(amount || maxConvertible, maxConvertible);
    if (toConvert > 0) {
      setCrypto(prev => prev - toConvert);
      setCad(prev => prev + toConvert * cryptoRate);
    }
  }

  const setMaxConvert = () => {
    setTradeAmount({...tradeAmount, convert: Math.floor(crypto)}); 
  }

  const setMaxBuy = (stockID) => {
    const stock = stocks.find(s => s.id === stockID)
    const maxShares = Math.floor(cad / stock.price);
    setTradeAmount({...tradeAmount, [stockID]: owned});
  }

  const setMaxSell = (stockID) => {
    const owned = portfolio[stockID] || 0;
    setTradeAmount({...tradeAmount, [stockID]: owned});
  }

  const upgradeCooldwon = () => {
    const cost = getCooldownUpgradeCost();
    if (cad >= cost) {
      setCad(prev => prev - cost);
      setCooldownLevel(prev => prev + 1);
    } 
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          const random = (Math.random() - 0.5) * 2; // -1 to 1
          const change = random * stock.volatility + stock.trend;
          const newPrice = Math.max(1, stock.price * (1 + change));
          const newHistory = [...stock.history.slice(-49), newPrice]; // Keep last 50 points
          
          return {
            ...stock,
            price: newPrice,
            history: newHistory
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const buyStock = (stockID, amount) => {
    const stock = stocks.find(s => s.id === stockID);
    const cost = stock.price * amount; 

    if (cad >= cost) {
      setCad(prev => prev - cost);
      setPortfolio(prev => ({
        ...prev,
        [stockID]: (prev[stockID] || 0) + amount
      }));
    }
  }

  const sellStock = (stockID, amount) => {
    const stock = stocks.find(s => s.id === stockID);
    const owned = portfolio[stockID] || 0;
    const toSell = Math.min(amount, owned);

   if (toSell > 0) {
      const revenue = stock.price * toSell;
      setCad(prev => prev + revenue);
      setPortfolio(prev => ({
        ...prev,
        [stockId]: Math.max(0, owned - toSell)
      }));
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
    }).join('')

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
  }, [lastMineTime, cooldownLevel]);


}