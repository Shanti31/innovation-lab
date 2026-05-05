import { Rewind, Play, Pause, FastForward, Calendar } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimeSnapshot {
  timestamp: string;
  hour: number;
  electricity: number;
  water: number;
  temperature: number;
  devicesActive: number;
}

export function TimeRewind() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentHour, setCurrentHour] = useState(18);
  const [selectedDate, setSelectedDate] = useState('2026-04-28');

  const historicalData: TimeSnapshot[] = [
    { timestamp: '00:00', hour: 0, electricity: 0.8, water: 5, temperature: 19, devicesActive: 12 },
    { timestamp: '04:00', hour: 4, electricity: 0.6, water: 3, temperature: 18, devicesActive: 8 },
    { timestamp: '08:00', hour: 8, electricity: 2.4, water: 45, temperature: 21, devicesActive: 28 },
    { timestamp: '12:00', hour: 12, electricity: 1.8, water: 32, temperature: 22, devicesActive: 24 },
    { timestamp: '16:00', hour: 16, electricity: 2.1, water: 28, temperature: 23, devicesActive: 26 },
    { timestamp: '18:00', hour: 18, electricity: 3.2, water: 52, temperature: 21, devicesActive: 32 },
    { timestamp: '20:00', hour: 20, electricity: 2.8, water: 38, temperature: 20, devicesActive: 29 },
    { timestamp: '23:00', hour: 23, electricity: 1.2, water: 15, temperature: 19, devicesActive: 15 },
  ];

  const currentSnapshot = historicalData.find(d => d.hour === currentHour) || historicalData[0];

  const inefficiencies = [
    { time: '08:30', issue: 'Kitchen lights left on while unoccupied', waste: '180W for 2 hours' },
    { time: '14:15', issue: 'HVAC running with window open in bedroom', waste: '450W for 45 min' },
    { time: '19:00', issue: 'Multiple devices in standby mode', waste: '85W continuous' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Time-Rewind Engine</h3>
          <p className="text-xs text-gray-500 mt-1">Replay past days to identify inefficiencies</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-900">
            {currentSnapshot.timestamp} - {selectedDate}
          </span>
          <span className="text-xs text-gray-600">
            {currentSnapshot.devicesActive} devices active
          </span>
        </div>

        <input
          type="range"
          value={currentHour}
          onChange={(e) => setCurrentHour(parseInt(e.target.value))}
          min={0}
          max={23}
          step={1}
          className="w-full h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg appearance-none cursor-pointer mb-4"
        />

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentHour(Math.max(0, currentHour - 1))}
            className="p-2 bg-white rounded-lg hover:bg-gray-100 border border-gray-300"
          >
            <Rewind className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setCurrentHour(Math.min(23, currentHour + 1))}
            className="p-2 bg-white rounded-lg hover:bg-gray-100 border border-gray-300"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current State Snapshot */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-yellow-50 rounded-lg">
          <p className="text-xs text-gray-600">Power</p>
          <p className="text-lg font-semibold text-gray-900">{currentSnapshot.electricity} kWh</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">Water</p>
          <p className="text-lg font-semibold text-gray-900">{currentSnapshot.water} L</p>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <p className="text-xs text-gray-600">Temp</p>
          <p className="text-lg font-semibold text-gray-900">{currentSnapshot.temperature}°C</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-xs text-gray-600">Devices</p>
          <p className="text-lg font-semibold text-gray-900">{currentSnapshot.devicesActive}</p>
        </div>
      </div>

      {/* Historical Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" key="grid" />
            <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} key="x-axis" />
            <YAxis stroke="#94a3b8" fontSize={10} key="y-axis" />
            <Tooltip key="tooltip" />
            <Line type="monotone" dataKey="electricity" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} key="elec-line" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detected Inefficiencies */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Detected Inefficiencies - {selectedDate}</h4>
        <div className="space-y-2">
          {inefficiencies.map((item, idx) => (
            <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-red-900">{item.time}</p>
                  <p className="text-xs text-red-700">{item.issue}</p>
                </div>
                <span className="text-xs font-semibold text-red-600">{item.waste}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
