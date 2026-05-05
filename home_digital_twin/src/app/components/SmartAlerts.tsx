import { Bell, AlertTriangle, Info, CheckCircle, X, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  action?: { label: string; onClick: () => void };
  dismissed: boolean;
}

export function SmartAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'High Power Consumption Detected',
      message: 'Kitchen appliances drawing 820W - 40% above normal baseline',
      timestamp: '2 min ago',
      action: { label: 'View Details', onClick: () => console.log('View details') },
      dismissed: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Water Usage Anomaly',
      message: 'Bathroom water usage increased by 25% in last hour',
      timestamp: '15 min ago',
      dismissed: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Neighbor Trading Opportunity',
      message: 'Smith Residence selling electricity at $0.15/kWh (12% below market)',
      timestamp: '30 min ago',
      action: { label: 'Trade Now', onClick: () => console.log('Trade') },
      dismissed: false,
    },
    {
      id: '4',
      type: 'success',
      title: 'Solar Generation Peak',
      message: 'Solar panels generating 4.2 kWh - surplus available for trading',
      timestamp: '1 hour ago',
      dismissed: false,
    },
    {
      id: '5',
      type: 'warning',
      title: 'Device Degradation Forecast',
      message: 'Living room AC unit efficiency predicted to drop 15% in next 6 months',
      timestamp: '2 hours ago',
      action: { label: 'Schedule Maintenance', onClick: () => console.log('Maintenance') },
      dismissed: false,
    },
  ]);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, dismissed: true } : alert
    ));
  };

  const activeAlerts = alerts.filter(a => !a.dismissed);
  const criticalCount = activeAlerts.filter(a => a.type === 'critical').length;
  const warningCount = activeAlerts.filter(a => a.type === 'warning').length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Smart Alerts & Diagnostics</h3>
          <p className="text-xs text-gray-500 mt-1">AI-powered insights and notifications</p>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <div className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
              {criticalCount} Critical
            </div>
          )}
          {warningCount > 0 && (
            <div className="px-2 py-1 bg-amber-600 text-white text-xs font-medium rounded">
              {warningCount} Warning
            </div>
          )}
          <Bell className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Critical</p>
          <p className="text-2xl font-semibold text-red-700">{criticalCount}</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Warnings</p>
          <p className="text-2xl font-semibold text-amber-700">{warningCount}</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Insights</p>
          <p className="text-2xl font-semibold text-blue-700">{activeAlerts.length - criticalCount - warningCount}</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border transition-all ${getAlertStyle(alert.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(alert.type)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-2">{alert.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{alert.timestamp}</span>
                  {alert.action && (
                    <button
                      onClick={alert.action.onClick}
                      className="px-3 py-1 bg-gray-900 text-white text-xs rounded hover:bg-gray-800"
                    >
                      {alert.action.label}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Predictive Insights */}
      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          <h4 className="text-sm font-medium text-gray-900">AI Prediction</h4>
        </div>
        <p className="text-xs text-gray-600">
          Based on current usage patterns, you could save $45/month by trading surplus solar energy
          during peak hours (12-4 PM) with neighbors.
        </p>
      </div>
    </div>
  );
}
