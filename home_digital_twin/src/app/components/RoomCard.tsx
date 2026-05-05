import { Home, Lightbulb, Thermometer, Lock, Camera } from 'lucide-react';
import { useState } from 'react';

interface Device {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'lock' | 'camera';
  status: boolean;
  value?: number;
}

interface RoomCardProps {
  roomName: string;
  devices: Device[];
  temperature?: number;
}

export function RoomCard({ roomName, devices, temperature }: RoomCardProps) {
  const [deviceStates, setDeviceStates] = useState<Record<string, boolean>>(
    devices.reduce((acc, device) => ({ ...acc, [device.id]: device.status }), {})
  );
  const [deviceValues, setDeviceValues] = useState<Record<string, number>>(
    devices.reduce((acc, device) => ({ ...acc, [device.id]: device.value || 0 }), {})
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'light':
        return <Lightbulb className="w-5 h-5" />;
      case 'thermostat':
        return <Thermometer className="w-5 h-5" />;
      case 'lock':
        return <Lock className="w-5 h-5" />;
      case 'camera':
        return <Camera className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{roomName}</h3>
        {temperature && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Thermometer className="w-4 h-4" />
            <span>{temperature}°C</span>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {devices.map((device) => (
          <div key={device.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${deviceStates[device.id] ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                {getIcon(device.type)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{device.name}</p>
                {device.type === 'light' && deviceStates[device.id] && (
                  <p className="text-xs text-gray-500">{deviceValues[device.id]}% brightness</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {device.type === 'light' && deviceStates[device.id] && (
                <input
                  type="range"
                  value={deviceValues[device.id]}
                  onChange={(e) => setDeviceValues({ ...deviceValues, [device.id]: parseInt(e.target.value) })}
                  max={100}
                  step={1}
                  className="w-20"
                />
              )}
              <button
                role="switch"
                aria-checked={deviceStates[device.id]}
                onClick={() => setDeviceStates({ ...deviceStates, [device.id]: !deviceStates[device.id] })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  deviceStates[device.id] ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    deviceStates[device.id] ? 'translate-x-6' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
