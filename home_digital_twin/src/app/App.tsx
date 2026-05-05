import { Home, Wifi, Activity } from 'lucide-react';
import { RoomCard } from './components/RoomCard';
import { EnergyChart } from './components/EnergyChart';
import { SecurityPanel } from './components/SecurityPanel';
import { ClimateControl } from './components/ClimateControl';
import { DeviceOverview } from './components/DeviceOverview';
import { Home3DView } from './components/Home3DView';
import { KillSwitches } from './components/KillSwitches';
import { NeighborTrading } from './components/NeighborTrading';
import { SmartAlerts } from './components/SmartAlerts';
import { TimeRewind } from './components/TimeRewind';
import { CounterfactualSimulator } from './components/CounterfactualSimulator';
import { LifecycleSimulation } from './components/LifecycleSimulation';
import { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const rooms = [
    {
      name: 'Living Room',
      temperature: 21,
      devices: [
        { id: 'lr-light-1', name: 'Ceiling Light', type: 'light' as const, status: true, value: 75 },
        { id: 'lr-light-2', name: 'Floor Lamp', type: 'light' as const, status: false, value: 0 },
        { id: 'lr-temp', name: 'Thermostat', type: 'thermostat' as const, status: true },
      ],
    },
    {
      name: 'Kitchen',
      temperature: 22,
      devices: [
        { id: 'k-light-1', name: 'Main Light', type: 'light' as const, status: true, value: 100 },
        { id: 'k-light-2', name: 'Under Cabinet', type: 'light' as const, status: true, value: 60 },
      ],
    },
    {
      name: 'Bedroom',
      temperature: 20,
      devices: [
        { id: 'br-light-1', name: 'Bedside Lamp', type: 'light' as const, status: false, value: 0 },
        { id: 'br-temp', name: 'AC Unit', type: 'thermostat' as const, status: true },
        { id: 'br-lock', name: 'Door Lock', type: 'lock' as const, status: true },
      ],
    },
    {
      name: 'Garage',
      temperature: 18,
      devices: [
        { id: 'g-light', name: 'Garage Light', type: 'light' as const, status: false, value: 0 },
        { id: 'g-lock', name: 'Garage Door', type: 'lock' as const, status: true },
        { id: 'g-camera', name: 'Security Camera', type: 'camera' as const, status: false },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Smart Home Digital Twin</h1>
                <p className="text-sm text-gray-500">Real-time monitoring & control</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">All Systems Online</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">29/34 Devices Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: '3d', label: '3D Twin' },
              { id: 'controls', label: 'Kill Switches' },
              { id: 'trading', label: 'Neighbor Trading' },
              { id: 'alerts', label: 'Alerts' },
              { id: 'rewind', label: 'Time Rewind' },
              { id: 'simulator', label: 'What-If' },
              { id: 'lifecycle', label: 'Lifecycle' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Rooms & Energy */}
            <div className="lg:col-span-2 space-y-6">
              {/* Room Cards Grid */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Rooms</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.name}
                      roomName={room.name}
                      devices={room.devices}
                      temperature={room.temperature}
                    />
                  ))}
                </div>
              </div>

              {/* Energy Chart */}
              <EnergyChart />
            </div>

            {/* Right Column - Status Panels */}
            <div className="space-y-6">
              <DeviceOverview />
              <ClimateControl />
              <SecurityPanel />
            </div>
          </div>
        )}

        {activeTab === '3d' && (
          <div className="space-y-6">
            <Home3DView />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DeviceOverview />
              <EnergyChart />
            </div>
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KillSwitches />
            <div className="space-y-6">
              <DeviceOverview />
              <SecurityPanel />
            </div>
          </div>
        )}

        {activeTab === 'trading' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <NeighborTrading />
            </div>
            <div className="space-y-6">
              <EnergyChart />
              <SmartAlerts />
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SmartAlerts />
            <div className="space-y-6">
              <DeviceOverview />
              <SecurityPanel />
            </div>
          </div>
        )}

        {activeTab === 'rewind' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TimeRewind />
            </div>
            <div className="space-y-6">
              <EnergyChart />
              <SmartAlerts />
            </div>
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CounterfactualSimulator />
            <div className="space-y-6">
              <EnergyChart />
              <SmartAlerts />
            </div>
          </div>
        )}

        {activeTab === 'lifecycle' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LifecycleSimulation />
            </div>
            <div className="space-y-6">
              <DeviceOverview />
              <SmartAlerts />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}