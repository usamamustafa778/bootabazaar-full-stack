import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaSearch } from 'react-icons/fa';
import { format } from 'date-fns';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/order/list', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        const ordersList = data.orders || [];
        setOrders(ordersList);
        setFilteredOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    filterOrders(query, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterOrders(search, status);
  };

  const filterOrders = (searchQuery, status) => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order._id?.toLowerCase().includes(searchQuery) ||
          order.address?.firstName?.toLowerCase().includes(searchQuery) ||
          order.address?.lastName?.toLowerCase().includes(searchQuery) ||
          order.address?.email?.toLowerCase().includes(searchQuery)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter((order) => order.status.toLowerCase() === status);
    }

    setFilteredOrders(filtered);
  };

  return (
    <div className="p-8 w-full h-screen overflow-y-scroll">
      {/* Heading */}
      <div className="mb-8 flex flex-col gap-5 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaShoppingBag className="text-primary text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
              <p className="text-gray-500 text-sm">Manage customer orders</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by order number or customer..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                ${statusFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                ${statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusFilter('shipped')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                ${statusFilter === 'shipped'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => handleStatusFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                ${statusFilter === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => handleStatusFilter('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                ${statusFilter === 'cancelled'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] gap-4 items-center p-4 bg-gray-50 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-600">ORDER #</span>
          <span className="text-sm font-semibold text-gray-600">CUSTOMER</span>
          <span className="text-sm font-semibold text-gray-600">DATE</span>
          <span className="text-sm font-semibold text-gray-600">TOTAL</span>
          <span className="text-sm font-semibold text-gray-600">STATUS</span>
          <span className="text-sm font-semibold text-gray-600">ITEMS</span>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FaShoppingBag className="text-5xl mx-auto" />
            </div>
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] gap-4 items-center p-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="font-medium text-gray-800">
                  #{order._id.slice(-6)}
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-gray-800">
                    {`${order.address?.firstName} ${order.address?.lastName}`}
                  </div>
                  <div className="text-sm text-gray-500">{order.address?.email}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {order.date ? format(new Date(order.date), 'MMM d, yyyy') : 'N/A'}
                </div>
                <div className="font-medium text-gray-800">
                  Rs. {order.amount?.toFixed(2)}
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${order.status.toLowerCase() === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : order.status.toLowerCase() === 'processing'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status.toLowerCase() === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status.toLowerCase() === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {order.items?.length || 0} items
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
