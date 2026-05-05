import { Thermometer, Droplets, Wind, Sun } from 'lucide-react';
import { useState } from 'react';

export function ClimateControl() {
  const [targetTemp, setTargetTemp] = useState(22);
  const [currentTemp] = useState(21.5);
  const [humidity] = useState(45);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-6">Climate Control</h3>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Target Temperature</span>
          <span className="text-2xl font-semibold text-gray-900">{targetTemp}°C</span>
        </div>
        <input
          type="range"
          value={targetTemp}
          onChange={(e) => setTargetTemp(parseFloat(e.target.value))}
          min={16}
          max={30}
          step={0.5}
          className="w-full h-2 bg-gradient-to-r from-blue-400 to-red-400 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>16°C</span>
          <span>30°C</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Current Temp</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{currentTemp}°C</p>
        </div>
        <div className="p-4 bg-cyan-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-cyan-600" />
            <span className="text-sm text-gray-600">Humidity</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{humidity}%</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Air Quality</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">Good</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-600">UV Index</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">4</p>
        </div>
      </div>
    </div>
  );
}
