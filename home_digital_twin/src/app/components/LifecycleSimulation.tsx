import { Clock, AlertTriangle, TrendingDown, Wrench } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DeviceDegradation {
  device: string;
  category: string;
  currentEfficiency: number;
  year1: number;
  year5: number;
  maintenanceCost: number;
  replacementYear?: number;
}

export function LifecycleSimulation() {
  const [timelineYears, setTimelineYears] = useState(1);

  const devices: DeviceDegradation[] = [
    { device: 'HVAC System', category: 'Climate', currentEfficiency: 100, year1: 92, year5: 68, maintenanceCost: 350, replacementYear: 8 },
    { device: 'Solar Panels', category: 'Energy', currentEfficiency: 100, year1: 98, year5: 88, maintenanceCost: 150 },
    { device: 'Water Heater', category: 'Water', currentEfficiency: 100, year1: 90, year5: 72, maintenanceCost: 200, replacementYear: 6 },
    { device: 'LED Lighting', category: 'Lighting', currentEfficiency: 100, year1: 97, year5: 85, maintenanceCost: 50 },
    { device: 'Smart Thermostat', category: 'IoT', currentEfficiency: 100, year1: 98, year5: 90, maintenanceCost: 0, replacementYear: 10 },
  ];

  const getEfficiencyAtYear = (device: DeviceDegradation, year: number) => {
    if (year === 0) return device.currentEfficiency;
    if (year <= 1) return device.year1;
    if (year >= 5) return device.year5;

    const slope = (device.year5 - device.year1) / 4;
    return device.year1 + slope * (year - 1);
  };

  const degradationChart = devices.map(device => ({
    name: device.device,
    '1 Year': device.year1,
    '5 Years': device.year5,
  }));

  const systemEfficiencyOverTime = [
    { year: 0, efficiency: 100, cost: 0 },
    { year: 1, efficiency: 95, cost: 250 },
    { year: 2, efficiency: 88, cost: 520 },
    { year: 3, efficiency: 82, cost: 840 },
    { year: 4, efficiency: 76, cost: 1180 },
    { year: 5, efficiency: 70, cost: 1550 },
  ];

  const currentData = systemEfficiencyOverTime.find(d => d.year === timelineYears) || systemEfficiencyOverTime[0];
  const energyWaste = ((100 - currentData.efficiency) / 100) * 68.4;
  const costIncrease = currentData.cost;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Lifecycle Simulation & Degradation</h3>
          <p className="text-xs text-gray-500 mt-1">Predict how your home and devices degrade over time</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-lg">
          <Clock className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-medium text-orange-700">Year {timelineYears}</span>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-900">Time Travel: View Your Home In...</span>
          <span className="text-2xl font-bold text-orange-600">{timelineYears} {timelineYears === 1 ? 'Year' : 'Years'}</span>
        </div>

        <input
          type="range"
          value={timelineYears}
          onChange={(e) => setTimelineYears(parseInt(e.target.value))}
          min={0}
          max={5}
          step={1}
          className="w-full h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg appearance-none cursor-pointer mb-4"
        />

        <div className="flex justify-between text-xs text-gray-600">
          <span>Now</span>
          <span>1 Year</span>
          <span>2 Years</span>
          <span>3 Years</span>
          <span>4 Years</span>
          <span>5 Years</span>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <p className="text-xs text-gray-600">System Efficiency</p>
          </div>
          <p className="text-2xl font-semibold text-red-700">{currentData.efficiency}%</p>
          <p className="text-xs text-red-600 mt-1">↓ {100 - currentData.efficiency}% decline</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-xs text-gray-600">Energy Waste</p>
          </div>
          <p className="text-2xl font-semibold text-amber-700">{energyWaste.toFixed(1)}</p>
          <p className="text-xs text-amber-600 mt-1">kWh/month</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-orange-600" />
            <p className="text-xs text-gray-600">Maintenance Cost</p>
          </div>
          <p className="text-2xl font-semibold text-orange-700">${costIncrease}</p>
          <p className="text-xs text-orange-600 mt-1">cumulative</p>
        </div>
      </div>

      {/* System Efficiency Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Overall System Efficiency Over Time</h4>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={systemEfficiencyOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" key="grid" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} label={{ value: 'Years', position: 'insideBottom', offset: -5 }} key="x-axis" />
            <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} key="y-axis" />
            <Tooltip key="tooltip" />
            <Legend key="legend" />
            <Line type="monotone" dataKey="efficiency" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Efficiency %" key="eff-line" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Device-by-Device Degradation */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Device Degradation Forecast</h4>
        <div className="space-y-2">
          {devices.map((device) => {
            const currentEff = getEfficiencyAtYear(device, timelineYears);
            const needsReplacement = device.replacementYear && timelineYears >= device.replacementYear;

            return (
              <div
                key={device.device}
                className={`p-3 rounded-lg ${
                  needsReplacement ? 'bg-red-100 border border-red-300' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{device.device}</p>
                    <p className="text-xs text-gray-600">{device.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{currentEff.toFixed(0)}%</p>
                    {needsReplacement && (
                      <span className="text-xs font-medium text-red-700">Replacement Due</span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      currentEff > 80 ? 'bg-green-500' : currentEff > 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${currentEff}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Maintenance Recommendations */}
      {timelineYears >= 1 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            Recommended Actions
          </h4>
          <ul className="space-y-1 text-xs text-gray-700">
            {timelineYears >= 1 && <li>• Schedule HVAC maintenance to prevent 8% efficiency loss</li>}
            {timelineYears >= 2 && <li>• Clean solar panels to maintain output</li>}
            {timelineYears >= 3 && <li>• Inspect water heater - efficiency dropping below 80%</li>}
            {timelineYears >= 5 && <li>• Plan for major replacements - multiple systems near end-of-life</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
