import { GitBranch, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Scenario {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export function CounterfactualSimulator() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: 'solar', name: 'Solar Panels Installed', description: 'What if you installed 4kW solar panels?', active: false },
    { id: 'trading', name: 'Active Neighbor Trading', description: 'What if you traded surplus energy daily?', active: false },
    { id: 'hvac', name: 'Smart HVAC Schedule', description: 'What if HVAC followed optimal schedule?', active: false },
    { id: 'led', name: 'All LED Lights', description: 'What if all lights were LED?', active: false },
  ]);

  const toggleScenario = (id: string) => {
    setScenarios(scenarios.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const activeCount = scenarios.filter(s => s.active).length;

  // Calculate impacts based on active scenarios
  const baselineCost = 245;
  const baselineEnergy = 68.4;
  const baselineCarbon = 42;

  let costSavings = 0;
  let energySavings = 0;
  let carbonReduction = 0;

  scenarios.forEach(scenario => {
    if (scenario.active) {
      switch (scenario.id) {
        case 'solar':
          costSavings += 85;
          energySavings += 24.8;
          carbonReduction += 18;
          break;
        case 'trading':
          costSavings += 32;
          energySavings += 0;
          carbonReduction += 0;
          break;
        case 'hvac':
          costSavings += 45;
          energySavings += 12.5;
          carbonReduction += 8;
          break;
        case 'led':
          costSavings += 28;
          energySavings += 8.2;
          carbonReduction += 5;
          break;
      }
    }
  });

  const comparisonData = [
    {
      metric: 'Monthly Cost',
      Current: baselineCost,
      Simulated: baselineCost - costSavings,
    },
    {
      metric: 'Energy (kWh)',
      Current: baselineEnergy,
      Simulated: baselineEnergy - energySavings,
    },
    {
      metric: 'CO₂ (kg)',
      Current: baselineCarbon,
      Simulated: baselineCarbon - carbonReduction,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Counterfactual Simulator</h3>
          <p className="text-xs text-gray-500 mt-1">Visualize "what would've happened" scenarios</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
          <GitBranch className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-medium text-indigo-700">{activeCount} Active</span>
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="mb-6 space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Scenarios to Simulate</h4>
        {scenarios.map((scenario) => (
          <label
            key={scenario.id}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              scenario.active
                ? 'bg-indigo-50 border-indigo-300'
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={scenario.active}
              onChange={() => toggleScenario(scenario.id)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{scenario.name}</p>
              <p className="text-xs text-gray-600">{scenario.description}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-700" />
            <p className="text-xs text-gray-600">Cost Savings</p>
          </div>
          <p className="text-2xl font-semibold text-green-700">${costSavings}</p>
          <p className="text-xs text-gray-600 mt-1">per month</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-blue-700" />
            <p className="text-xs text-gray-600">Energy Reduced</p>
          </div>
          <p className="text-2xl font-semibold text-blue-700">{energySavings}</p>
          <p className="text-xs text-gray-600 mt-1">kWh/month</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-purple-700" />
            <p className="text-xs text-gray-600">CO₂ Reduced</p>
          </div>
          <p className="text-2xl font-semibold text-purple-700">{carbonReduction}</p>
          <p className="text-xs text-gray-600 mt-1">kg/month</p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Current vs. Simulated Impact</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" key="grid" />
            <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} key="x-axis" />
            <YAxis stroke="#94a3b8" fontSize={11} key="y-axis" />
            <Tooltip key="tooltip" />
            <Legend key="legend" />
            <Bar dataKey="Current" fill="#94a3b8" radius={[4, 4, 0, 0]} key="current-bar" />
            <Bar dataKey="Simulated" fill="#6366f1" radius={[4, 4, 0, 0]} key="simulated-bar" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Annual Projection */}
      {activeCount > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">12-Month Projection</h4>
          <p className="text-xs text-gray-600">
            With these changes, you could save <span className="font-semibold text-green-700">${costSavings * 12}</span> annually,
            reduce energy consumption by <span className="font-semibold text-blue-700">{(energySavings * 12).toFixed(1)} kWh</span>,
            and cut CO₂ emissions by <span className="font-semibold text-purple-700">{(carbonReduction * 12).toFixed(1)} kg</span>.
          </p>
        </div>
      )}
    </div>
  );
}
