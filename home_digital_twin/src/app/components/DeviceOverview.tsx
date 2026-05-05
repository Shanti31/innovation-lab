import { Wifi, WifiOff, Activity, Zap } from 'lucide-react';

interface DeviceStatus {
  category: string;
  online: number;
  total: number;
  power: string;
}

const deviceStatuses: DeviceStatus[] = [
  { category: 'Lighting', online: 12, total: 15, power: '120W' },
  { category: 'Climate', online: 4, total: 4, power: '850W' },
  { category: 'Security', online: 8, total: 9, power: '45W' },
  { category: 'Entertainment', online: 5, total: 6, power: '230W' },
];

export function DeviceOverview() {
  const totalOnline = deviceStatuses.reduce((acc, status) => acc + status.online, 0);
  const totalDevices = deviceStatuses.reduce((acc, status) => acc + status.total, 0);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-6">Device Overview</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="w-5 h-5" />
            <span className="text-sm opacity-90">Online Devices</span>
          </div>
          <p className="text-3xl font-semibold">{totalOnline}/{totalDevices}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm opacity-90">Power Usage</span>
          </div>
          <p className="text-3xl font-semibold">1.2 kW</p>
        </div>
      </div>

      <div className="space-y-3">
        {deviceStatuses.map((status) => {
          const percentage = (status.online / status.total) * 100;
          const isFullyOnline = status.online === status.total;

          return (
            <div key={status.category} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isFullyOnline ? (
                    <Activity className="w-4 h-4 text-green-600" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-amber-600" />
                  )}
                  <span className="text-sm font-medium text-gray-900">{status.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{status.power}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {status.online}/{status.total}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isFullyOnline ? 'bg-green-600' : 'bg-amber-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
