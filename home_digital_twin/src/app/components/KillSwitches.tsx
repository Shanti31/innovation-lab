import { Power, Lightbulb, Droplets, Wind, Wifi, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface Sector {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: boolean;
  devices: number;
  powerDraw: string;
}

export function KillSwitches() {
  const [sectors, setSectors] = useState<Sector[]>([
    { id: 'lighting', name: 'Lighting', icon: <Lightbulb className="w-5 h-5" />, status: true, devices: 15, powerDraw: '180W' },
    { id: 'hvac', name: 'HVAC', icon: <Wind className="w-5 h-5" />, status: true, devices: 4, powerDraw: '850W' },
    { id: 'water', name: 'Water Systems', icon: <Droplets className="w-5 h-5" />, status: true, devices: 6, powerDraw: '120W' },
    { id: 'network', name: 'Network & IoT', icon: <Wifi className="w-5 h-5" />, status: true, devices: 34, powerDraw: '95W' },
  ]);

  const [pendingToggle, setPendingToggle] = useState<string | null>(null);

  const toggleSector = (id: string) => {
    setSectors(sectors.map(sector =>
      sector.id === id ? { ...sector, status: !sector.status } : sector
    ));
    setPendingToggle(null);
  };

  const getSectorById = (id: string) => sectors.find(s => s.id === id);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Sector Kill Switches</h3>
          <p className="text-xs text-gray-500 mt-1">Emergency shutdown controls for entire house sectors</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="text-xs font-medium text-red-700">Emergency Control</span>
        </div>
      </div>

      <div className="space-y-3">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              sector.status
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  sector.status ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {sector.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{sector.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-600">{sector.devices} devices</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">{sector.powerDraw}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className={`text-xs font-medium ${
                      sector.status ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {sector.status ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPendingToggle(sector.id)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  sector.status
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Power className="w-4 h-4" />
                  {sector.status ? 'KILL' : 'RESTORE'}
                </div>
              </button>

              {pendingToggle === sector.id && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in-0">
                  <div className="max-w-md w-full bg-white rounded-lg p-6 shadow-xl m-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      {sector.status ? 'Shutdown Sector' : 'Restore Sector'}
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      {sector.status
                        ? `Are you sure you want to shut down the ${sector.name} sector? This will affect ${sector.devices} devices.`
                        : `Restore power to the ${sector.name} sector and reconnect ${sector.devices} devices?`
                      }
                    </p>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setPendingToggle(null)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => toggleSector(sector.id)}
                        className={`px-4 py-2 rounded-lg font-medium text-white ${
                          sector.status
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {sector.status ? 'Shutdown' : 'Restore'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
