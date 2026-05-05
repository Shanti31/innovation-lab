import { Shield, AlertTriangle, CheckCircle, Camera, Lock, Bell } from 'lucide-react';
import { useState } from 'react';

interface SecurityEvent {
  id: string;
  type: 'camera' | 'lock' | 'motion' | 'alarm';
  message: string;
  timestamp: string;
  status: 'ok' | 'warning' | 'alert';
}

const securityEvents: SecurityEvent[] = [
  { id: '1', type: 'camera', message: 'Front door camera active', timestamp: '2 min ago', status: 'ok' },
  { id: '2', type: 'lock', message: 'Main door unlocked', timestamp: '15 min ago', status: 'ok' },
  { id: '3', type: 'motion', message: 'Motion detected - Backyard', timestamp: '1 hour ago', status: 'warning' },
  { id: '4', type: 'camera', message: 'Garage camera offline', timestamp: '3 hours ago', status: 'alert' },
];

export function SecurityPanel() {
  const [armed, setArmed] = useState(false);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Security Status</h3>
        <button
          onClick={() => setArmed(!armed)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            armed
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {armed ? 'Armed' : 'Disarmed'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Camera className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-900">4/5</p>
          <p className="text-xs text-gray-600">Cameras Online</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Lock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-900">3/3</p>
          <p className="text-xs text-gray-600">Doors Locked</p>
        </div>
        <div className="text-center p-4 bg-amber-50 rounded-lg">
          <Bell className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-900">1</p>
          <p className="text-xs text-gray-600">Alerts</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Events</h4>
        {securityEvents.map((event) => (
          <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            {event.status === 'ok' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
            {event.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />}
            {event.status === 'alert' && <Shield className="w-5 h-5 text-red-600 mt-0.5" />}
            <div className="flex-1">
              <p className="text-sm text-gray-900">{event.message}</p>
              <p className="text-xs text-gray-500">{event.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
