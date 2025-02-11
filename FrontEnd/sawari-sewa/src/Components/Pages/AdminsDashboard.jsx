import React, { useState } from 'react';
import { 
  Users, 
  Car, 
  MapPin, 
  CreditCard, 
  AlertTriangle, 
  Calendar,
  DollarSign,
  Dock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../constants/paths';

const AdminDashboard = () => {
  // Sample state data - In real app, this would come from your backend
  const [stats] = useState({
    activeBookings: 145,
    totalVehicles: 89,
    activeDrivers: 67,
    totalRevenue: 158900,
    pendingApprovals: 12
  });

  const [realtimeAlerts] = useState([
    { id: 1, type: 'warning', message: 'Vehicle NH-1234 reporting GPS issues' },
    { id: 2, type: 'info', message: 'New driver verification pending' },
    { id: 3, type: 'success', message: 'Successful shared ride completed' }
  ]);

  const [vehicleTypes] = useState([
    { type: 'Bus', available: 25, inUse: 15 },
    { type: 'Jeep', available: 18, inUse: 12 },
    { type: 'Van', available: 20, inUse: 8 },
    { type: 'Bike', available: 30, inUse: 22 }
  ]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sawari Sewa Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time vehicle booking management system</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:text-blue-200 hover:bg-gray-100 transition-colors"
            onClick={() => navigate(PATHS.DRIVERAPPLICATIONS)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Driver Applications</h3>
              <Dock className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active Bookings</h3>
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Today's Revenue</h3>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">NPR {stats.totalRevenue}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active Drivers</h3>
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeDrivers}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Status */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Vehicle Status Overview</h3>
            <div className="space-y-6">
              {vehicleTypes.map((vehicle) => (
                <div key={vehicle.type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-medium">{vehicle.type}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600">{vehicle.available} Available</span>
                    <span className="text-blue-600">{vehicle.inUse} In Use</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Alerts */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Real-time Alerts</h3>
            <div className="space-y-4">
              {realtimeAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg flex items-start space-x-2 ${alert.type === 'warning' 
                    ? 'bg-red-50 text-red-700' 
                    : alert.type === 'info' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'bg-green-50 text-green-700'}`}
                >
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Manage Users</span>
              </button>
              <button className="p-4 bg-green-50 rounded-lg flex flex-col items-center justify-center hover:bg-green-100 transition-colors">
                <Car className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium">Add Vehicle</span>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg flex flex-col items-center justify-center hover:bg-purple-100 transition-colors">
                <MapPin className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Track Routes</span>
              </button>
              <button className="p-4 bg-orange-50 rounded-lg flex flex-col items-center justify-center hover:bg-orange-100 transition-colors">
                <CreditCard className="h-6 w-6 text-orange-600 mb-2" />
                <span className="text-sm font-medium">Payment Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
