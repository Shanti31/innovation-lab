import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const energyData = [
  { id: 1, time: '00:00', consumption: 2.4, solar: 0 },
  { id: 2, time: '04:00', consumption: 1.8, solar: 0 },
  { id: 3, time: '08:00', consumption: 3.2, solar: 1.5 },
  { id: 4, time: '12:00', consumption: 2.8, solar: 4.2 },
  { id: 5, time: '16:00', consumption: 3.5, solar: 2.8 },
  { id: 6, time: '20:00', consumption: 4.2, solar: 0.5 },
  { id: 7, time: '23:59', consumption: 2.6, solar: 0 },
];

export function EnergyChart() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Energy Usage (24h)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={energyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" key="grid" />
          <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} key="x-axis" />
          <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} key="y-axis" />
          <Tooltip
            key="tooltip"
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          />
          <Legend key="legend" />
          <Line
            type="monotone"
            dataKey="consumption"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 4 }}
            name="Consumption"
            key="consumption-line"
          />
          <Line
            type="monotone"
            dataKey="solar"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            name="Solar Generation"
            key="solar-line"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500">Total Consumed</p>
          <p className="text-lg font-semibold text-gray-900">68.4 kWh</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Solar Generated</p>
          <p className="text-lg font-semibold text-green-600">24.8 kWh</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Net Usage</p>
          <p className="text-lg font-semibold text-blue-600">43.6 kWh</p>
        </div>
      </div>
    </div>
  );
}
