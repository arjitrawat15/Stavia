import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import { roomService } from '../services/roomService';
import { reservationService } from '../services/reservationService';
import { customerService } from '../services/customerService';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    roomType: '',
    pricePerNight: '',
  });

  const [bookingData, setBookingData] = useState({
    customerId: '',
    checkInDate: '',
    checkOutDate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsData, customersData] = await Promise.all([
        roomService.getAllRooms(),
        customerService.getAllCustomers(),
      ]);
      setRooms(roomsData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await roomService.createRoom(newRoom);
      setShowAddModal(false);
      setNewRoom({ roomNumber: '', roomType: '', pricePerNight: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleBookRoom = async (e) => {
    e.preventDefault();
    try {
      const reservationData = {
        room: { roomId: selectedRoom.roomId },
        customer: { customerId: bookingData.customerId },
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
      };
      
      await reservationService.createReservation(reservationData);
      setShowBookModal(false);
      setBookingData({ customerId: '', checkInDate: '', checkOutDate: '' });
      setSelectedRoom(null);
      fetchData();
    } catch (error) {
      console.error('Error booking room:', error);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowEditModal(true);
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      await roomService.updateRoom(editingRoom.roomId, editingRoom);
      setShowEditModal(false);
      setEditingRoom(null);
      fetchData();
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleDeleteRoom = async (room) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomService.deleteRoom(room.roomId);
        fetchData();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.roomType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.roomType === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'available' && room.available) ||
                         (filterStatus === 'occupied' && !room.available);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const roomTypes = [...new Set(rooms.map(room => room.roomType))];

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
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600">Manage hotel rooms and bookings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Room
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms..."
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
            {roomTypes.map(type => (
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

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <RoomCard
            key={room.roomId}
            room={room}
            onBook={(room) => {
              setSelectedRoom(room);
              setShowBookModal(true);
            }}
            onEdit={handleEditRoom}
            onDelete={handleDeleteRoom}
          />
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No rooms found matching your criteria.</p>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Room</h3>
            <form onSubmit={handleAddRoom}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type
                  </label>
                  <select
                    value={newRoom.roomType}
                    onChange={(e) => setNewRoom({...newRoom, roomType: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Night ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newRoom.pricePerNight}
                    onChange={(e) => setNewRoom({...newRoom, pricePerNight: e.target.value})}
                    className="input-field"
                    required
                  />
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
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Room Modal */}
      {showBookModal && selectedRoom && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Book Room {selectedRoom.roomNumber}
            </h3>
            <form onSubmit={handleBookRoom}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <select
                    value={bookingData.customerId}
                    onChange={(e) => setBookingData({...bookingData, customerId: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.customerId} value={customer.customerId}>
                        {customer.fullName} - {customer.email}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.checkInDate}
                    onChange={(e) => setBookingData({...bookingData, checkInDate: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.checkOutDate}
                    onChange={(e) => setBookingData({...bookingData, checkOutDate: e.target.value})}
                    className="input-field"
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
                  Book Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && editingRoom && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Room</h3>
            <form onSubmit={handleUpdateRoom}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={editingRoom.roomNumber}
                    onChange={(e) => setEditingRoom({...editingRoom, roomNumber: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type
                  </label>
                  <select
                    value={editingRoom.roomType}
                    onChange={(e) => setEditingRoom({...editingRoom, roomType: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Night ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRoom.pricePerNight}
                    onChange={(e) => setEditingRoom({...editingRoom, pricePerNight: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
