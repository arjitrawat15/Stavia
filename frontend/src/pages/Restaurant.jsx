import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, Clock, Calendar } from 'lucide-react';
import { restaurantService } from '../services/restaurantService';

const Restaurant = () => {
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newTable, setNewTable] = useState({
    tableNumber: '',
    capacity: '',
    tableType: '',
  });

  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerPhone: '',
    bookingDate: '',
    bookingTime: '',
    partySize: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tablesData, bookingsData] = await Promise.all([
        restaurantService.getAllTables(),
        restaurantService.getAllBookings(),
      ]);
      setTables(tablesData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    try {
      await restaurantService.createTable(newTable);
      setShowAddModal(false);
      setNewTable({ tableNumber: '', capacity: '', tableType: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding table:', error);
    }
  };

  const handleBookTable = async (e) => {
    e.preventDefault();
    try {
      const booking = {
        tableId: selectedTable.id,
        ...bookingData,
        partySize: parseInt(bookingData.partySize),
      };
      
      await restaurantService.createBooking(booking);
      setShowBookModal(false);
      setBookingData({ customerName: '', customerPhone: '', bookingDate: '', bookingTime: '', partySize: '' });
      setSelectedTable(null);
      fetchData();
    } catch (error) {
      console.error('Error booking table:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await restaurantService.cancelBooking(bookingId);
        fetchData();
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         table.tableType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || table.tableType === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'available' && table.available) ||
                         (filterStatus === 'occupied' && !table.available);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const tableTypes = [...new Set(tables.map(table => table.tableType))];

  const TableCard = ({ table }) => {
    const getStatusColor = (available) => {
      return available 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800';
    };

    const getStatusText = (available) => {
      return available ? 'Available' : 'Occupied';
    };

    return (
      <div className="card hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Table {table.tableNumber}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {table.tableType}
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(table.available)}`}>
            {getStatusText(table.available)}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>Capacity: {table.capacity} people</span>
          </div>
        </div>

        <div className="flex space-x-2">
          {table.available && (
            <button
              onClick={() => {
                setSelectedTable(table);
                setShowBookModal(true);
              }}
              className="flex-1 btn-primary text-sm"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Book Now
            </button>
          )}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Management</h1>
          <p className="text-gray-600">Manage restaurant tables and bookings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Table
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            {tableTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTables.map(table => (
          <TableCard key={table.id} table={table} />
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tables found matching your criteria.</p>
        </div>
      )}

      {/* Recent Bookings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Table
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Party Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Table {booking.tableId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.bookingDate} at {booking.bookingTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.partySize} people
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'CONFIRMED' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Table</h3>
            <form onSubmit={handleAddTable}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table Number
                  </label>
                  <input
                    type="text"
                    value={newTable.tableNumber}
                    onChange={(e) => setNewTable({...newTable, tableNumber: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={newTable.capacity}
                    onChange={(e) => setNewTable({...newTable, capacity: e.target.value})}
                    className="input-field"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table Type
                  </label>
                  <select
                    value={newTable.tableType}
                    onChange={(e) => setNewTable({...newTable, tableType: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Standard">Standard</option>
                    <option value="Family">Family</option>
                    <option value="Romantic">Romantic</option>
                    <option value="Party">Party</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Table Modal */}
      {showBookModal && selectedTable && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Book Table {selectedTable.tableNumber}
            </h3>
            <form onSubmit={handleBookTable}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={bookingData.customerName}
                    onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={bookingData.customerPhone}
                    onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.bookingDate}
                    onChange={(e) => setBookingData({...bookingData, bookingDate: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Time
                  </label>
                  <input
                    type="time"
                    value={bookingData.bookingTime}
                    onChange={(e) => setBookingData({...bookingData, bookingTime: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Party Size
                  </label>
                  <input
                    type="number"
                    value={bookingData.partySize}
                    onChange={(e) => setBookingData({...bookingData, partySize: e.target.value})}
                    className="input-field"
                    min="1"
                    max={selectedTable.capacity}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Book Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurant;
