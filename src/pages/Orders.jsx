import { useState, useEffect } from 'react';
import { Eye, CheckCircle, Clock, Truck, AlertCircle } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrdersTable from '../components/OrdersTable';

export default function Orders() {
  const {
    orders,
    selectedOrder,
    setSelectedOrder,
    showOrderDetail,
    setShowOrderDetail,
    newOrderNotification,
    setNewOrderNotification,
  } = useOrder();

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // Real-time notification toast
  useEffect(() => {
    if (newOrderNotification) {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [newOrderNotification]);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter(o => o.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        o =>
          o.id.toLowerCase().includes(term) ||
          o.customerName.toLowerCase().includes(term) ||
          o.phone.includes(term) ||
          o.product.toLowerCase().includes(term)
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    setFilteredOrders(filtered);
  }, [orders, filterStatus, searchTerm]);

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 to-sand-100 p-6">
      {/* Real-time Notification Toast */}
      {showNotification && newOrderNotification && (
        <div className="fixed top-6 right-6 z-50 bg-white border-l-4 border-blush-500 shadow-lg rounded-lg p-4 max-w-md animate-slide-in">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-blush-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-charcoal-800 font-display">New Order Received!</h4>
              <p className="text-sm text-charcoal-600 mt-1">
                {newOrderNotification.customerName} ordered {newOrderNotification.product}
              </p>
              <p className="text-xs text-charcoal-500 mt-1">
                Amount: ₦{newOrderNotification.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-light font-display text-charcoal-800 mb-2">
          Orders Management
        </h1>
        <p className="text-charcoal-600 font-body">Track and manage all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 border border-sand-200 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-body text-charcoal-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold font-display text-charcoal-800">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Truck size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-sand-200 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-body text-charcoal-600 mb-1">Pending</p>
              <p className="text-3xl font-bold font-display text-amber-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Clock size={24} className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-sand-200 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-body text-charcoal-600 mb-1">Processing</p>
              <p className="text-3xl font-bold font-display text-blue-600">{stats.processing}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-sand-200 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-body text-charcoal-600 mb-1">Delivered</p>
              <p className="text-3xl font-bold font-display text-green-600">{stats.delivered}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-sand-200 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold font-body text-charcoal-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by Order ID, Name, Phone, or Product..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:border-blush-400 font-body text-sm"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold font-body text-charcoal-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:border-blush-400 font-body text-sm"
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-charcoal-600 mt-3 font-body">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        onViewDetails={(order) => {
          setSelectedOrder(order);
          setShowOrderDetail(true);
        }}
      />

      {/* Order Details Modal */}
      {showOrderDetail && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowOrderDetail(false)}
        />
      )}
    </div>
  );
}
