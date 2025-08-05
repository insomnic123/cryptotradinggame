"use client"

import React, { useState, useEffect } from 'react';
import {TrendingUp, TrendingDown, Coins, DollarSign, Clock, ShoppingCart, BarChart3 } from 'lucide-react';

const CryptoTradingGame = () => {
  // Default game states
  const [crypto, setCrypto] = useState(0) 
  const [cad, setCad] = useState(0)
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

  const cryptoRate = 100;
  const baseCooldown = 5000; 
  const baseMineAmount = 1;

  const getCurrentCooldown = () => Math.max(10, baseCooldown - (cooldownLevel - 1) * 500);
  const getCooldownUpgradeCost = () => Math.floor(50 * Math.pow(1.5, cooldownLevel - 1));
  const canMine = () => Date.now() - lastMineTime >= getCurrentCooldown();

  const mineCrypto = () => {
    if (canMine()) {
      setCrypto(prev => prev + baseMineAmount);
      setLastMineTime(Date.now());
    }
  }

  const convertCrypto = (amount) => {
    // Only convert if amount is provided and greater than 0
    if (!amount || amount <= 0) return;
    
    const maxConvertible = Math.floor(crypto);
    const toConvert = Math.min(amount, maxConvertible);
    if (toConvert > 0) {
      setCrypto(prev => prev - toConvert);
      setCad(prev => prev + toConvert * cryptoRate);
      // Clear the input after successful conversion
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
    } 
  }

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
      setTradeAmount({...tradeAmount, [stockID]: ''});
    }
  }

  const sellStock = (stockID, amount) => {
    if (!amount || amount <= 0) return;
    
    const stock = stocks.find(s => s.id === stockID);
    const owned = portfolio[stockID] || 0;
    const toSell = Math.min(amount, owned);

   if (toSell > 0) {
      const revenue = stock.price * toSell;
      setCad(prev => prev + revenue);
      setPortfolio(prev => ({
        ...prev,
        [stockID]: Math.max(0, owned - toSell)
      }));
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
            {id:'mining', label:'Mining', icon: Coins},
            {id:'trading', label: 'Trading', icon: TrendingUp},
            {id:'shop', label: 'Shop', icon: ShoppingCart}
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
                </div>
                <button
                  onClick={() => setSelectedStock(null)}
                  className="text-gray-400 hover:text-white text-2xl">×</button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
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
                    <span>Mining Rate:</span>
                    <span className="font-bold text-purple-400">{baseMineAmount} crypto</span>
                  </div>
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
                        <div className="text-sm text-gray-300">-0.5s cooldown</div>
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
          )}

          {/* Trading Tab */}
          {currentTab === 'trading' && (
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
          )}

          {/* Shop Tab */}
          {currentTab === 'shop' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-6">Shop</h2>
              <div className="text-center text-gray-400 py-12">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Shop items coming soon!</p>
                <p className="text-sm">Spend your CAD on upgrades and bonuses.</p>
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