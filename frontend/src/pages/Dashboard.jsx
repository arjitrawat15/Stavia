import React, { useState, useEffect } from 'react';
import { 
  Bed, 
  Users, 
  Calendar, 
  UtensilsCrossed,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { roomService } from '../services/roomService';
import { customerService } from '../services/customerService';
import { reservationService } from '../services/reservationService';
import { restaurantService } from '../services/restaurantService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalCustomers: 0,
    totalReservations: 0,
    availableTables: 0,
    occupiedRooms: 0,
    availableRooms: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [rooms, customers, reservations, tables] = await Promise.all([
        roomService.getAllRooms(),
        customerService.getAllCustomers(),
        reservationService.getAllReservations(),
        restaurantService.getAllTables(),
      ]);

      // Calculate stats
      const availableRooms = rooms.filter(room => room.available).length;
      const occupiedRooms = rooms.length - availableRooms;
      const availableTables = tables.filter(table => table.available).length;

      setStats({
        totalRooms: rooms.length,
        totalCustomers: customers.length,
        totalReservations: reservations.length,
        availableTables,
        occupiedRooms,
        availableRooms,
      });

      // Generate mock chart data for weekly occupancy
      const weeklyData = generateWeeklyData(reservations);
      setChartData(weeklyData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyData = (reservations) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      occupancy: Math.floor(Math.random() * 40) + 30, // Mock data
      revenue: Math.floor(Math.random() * 5000) + 2000, // Mock data
    }));
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
    const getColorClasses = (color) => {
      switch (color) {
        case 'blue':
          return { bg: 'bg-blue-100', text: 'text-blue-600' };
        case 'green':
          return { bg: 'bg-green-100', text: 'text-green-600' };
        case 'purple':
          return { bg: 'bg-purple-100', text: 'text-purple-600' };
        case 'orange':
          return { bg: 'bg-orange-100', text: 'text-orange-600' };
        default:
          return { bg: 'bg-blue-100', text: 'text-blue-600' };
      }
    };

    const colorClasses = getColorClasses(color);

    return (
      <div className="card">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
            <Icon className={`h-6 w-6 ${colorClasses.text}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {trendValue}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to ReserveIT Hotel & Restaurant Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={Bed}
          trend="up"
          trendValue="+5%"
          color="blue"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          trend="up"
          trendValue="+12%"
          color="green"
        />
        <StatCard
          title="Active Reservations"
          value={stats.totalReservations}
          icon={Calendar}
          trend="down"
          trendValue="-3%"
          color="purple"
        />
        <StatCard
          title="Available Tables"
          value={stats.availableTables}
          icon={UtensilsCrossed}
          trend="up"
          trendValue="+8%"
          color="orange"
        />
      </div>

      {/* Room Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Available Rooms</span>
              <span className="text-lg font-semibold text-green-600">{stats.availableRooms}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Occupied Rooms</span>
              <span className="text-lg font-semibold text-red-600">{stats.occupiedRooms}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(stats.availableRooms / stats.totalRooms) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Weekly Occupancy Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Occupancy</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="occupancy" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center">
            <Bed className="h-5 w-5 mr-2" />
            Add New Room
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <Users className="h-5 w-5 mr-2" />
            Add Customer
          </button>
          <button className="btn-primary flex items-center justify-center">
            <Calendar className="h-5 w-5 mr-2" />
            New Reservation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
