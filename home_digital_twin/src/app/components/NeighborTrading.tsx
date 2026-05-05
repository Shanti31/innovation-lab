import { Users, TrendingUp, TrendingDown, Zap, Droplets, ArrowRightLeft } from 'lucide-react';
import { useState } from 'react';

interface Neighbor {
  id: string;
  name: string;
  address: string;
  distance: string;
  selling: { electricity?: number; water?: number };
  buying: { electricity?: number; water?: number };
  price: { electricity?: number; water?: number };
  status: 'online' | 'offline';
}

interface Trade {
  id: string;
  neighbor: string;
  type: 'electricity' | 'water';
  amount: number;
  price: number;
  timestamp: string;
  direction: 'buy' | 'sell';
}

export function NeighborTrading() {
  const [neighbors] = useState<Neighbor[]>([
    {
      id: '1',
      name: 'Smith Residence',
      address: '142 Oak Street',
      distance: '0.1km',
      selling: { electricity: 2.4 },
      buying: {},
      price: { electricity: 0.15 },
      status: 'online',
    },
    {
      id: '2',
      name: 'Chen Household',
      address: '138 Oak Street',
      distance: '0.15km',
      selling: { water: 150 },
      buying: { electricity: 1.2 },
      price: { water: 0.002, electricity: 0.18 },
      status: 'online',
    },
    {
      id: '3',
      name: 'Rodriguez Family',
      address: '146 Oak Street',
      distance: '0.12km',
      selling: { electricity: 1.8, water: 80 },
      buying: {},
      price: { electricity: 0.14, water: 0.0018 },
      status: 'online',
    },
  ]);

  const [recentTrades] = useState<Trade[]>([
    { id: '1', neighbor: 'Smith Residence', type: 'electricity', amount: 1.5, price: 0.15, timestamp: '2 min ago', direction: 'buy' },
    { id: '2', neighbor: 'Rodriguez Family', type: 'water', amount: 50, price: 0.0018, timestamp: '15 min ago', direction: 'sell' },
    { id: '3', neighbor: 'Chen Household', type: 'electricity', amount: 0.8, price: 0.18, timestamp: '1 hour ago', direction: 'sell' },
  ]);

  const [yourSurplus] = useState({
    electricity: 3.2,
    water: 120,
  });

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Local Intranet - Resource Trading</h3>
          <p className="text-xs text-gray-500 mt-1">Trade surplus energy & water with neighbors</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
          <Users className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-medium text-purple-700">{neighbors.length} Online</span>
        </div>
      </div>

      {/* Your Surplus */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Your Available Surplus</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Zap className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Electricity</p>
              <p className="text-sm font-semibold text-gray-900">{yourSurplus.electricity} kWh</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Water</p>
              <p className="text-sm font-semibold text-gray-900">{yourSurplus.water} L</p>
            </div>
          </div>
        </div>
      </div>

      {/* Neighbors List */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-medium text-gray-700">Active Neighbors</h4>
        {neighbors.map((neighbor) => (
          <div key={neighbor.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900 text-sm">{neighbor.name}</p>
                <p className="text-xs text-gray-500">{neighbor.address} • {neighbor.distance}</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                {neighbor.status}
              </span>
            </div>

            <div className="flex gap-4 mt-3">
              {neighbor.selling.electricity && (
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-gray-600">Selling:</span>
                  <span className="text-xs font-medium">{neighbor.selling.electricity} kWh</span>
                  <span className="text-xs text-gray-500">@ ${neighbor.price.electricity}/kWh</span>
                  <button className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                    Buy
                  </button>
                </div>
              )}
              {neighbor.selling.water && (
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-gray-600">Selling:</span>
                  <span className="text-xs font-medium">{neighbor.selling.water}L water</span>
                  <span className="text-xs text-gray-500">@ ${neighbor.price.water}/L</span>
                  <button className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                    Buy
                  </button>
                </div>
              )}
              {neighbor.buying.electricity && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-gray-600">Buying:</span>
                  <span className="text-xs font-medium">{neighbor.buying.electricity} kWh</span>
                  <span className="text-xs text-gray-500">@ ${neighbor.price.electricity}/kWh</span>
                  <button className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    Sell
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Trades */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Trades</h4>
        <div className="space-y-2">
          {recentTrades.map((trade) => (
            <div key={trade.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className={`w-3 h-3 ${trade.direction === 'buy' ? 'text-blue-600' : 'text-green-600'}`} />
                <span className="text-xs text-gray-600">{trade.neighbor}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium">{trade.amount} {trade.type === 'electricity' ? 'kWh' : 'L'}</span>
                <span className="text-xs text-gray-500">${(trade.amount * trade.price).toFixed(2)}</span>
                <span className="text-xs text-gray-400">{trade.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
