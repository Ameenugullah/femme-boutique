import { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function NotificationBell() {
  const { getUnreadCount, getRecentOrders, markAsRead } = useOrder();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const unreadCount = getUnreadCount();
  const recentOrders = getRecentOrders(5);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOrderClick = (orderId) => {
    markAsRead(orderId);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-charcoal-700 transition-colors hover:text-blush-500 hover:bg-white/10 rounded-lg"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 text-xs font-bold text-white bg-blush-500 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 z-50 w-80 mt-2 bg-white border border-sand-200 shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-sand-50 border-b border-sand-200">
            <h3 className="font-semibold font-display text-charcoal-800">Recent Orders</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-charcoal-700/50 hover:text-charcoal-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Orders List */}
          {recentOrders.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleOrderClick(order.id)}
                  className={`px-4 py-3 border-b border-sand-100 cursor-pointer transition-colors last:border-b-0 ${
                    !order.isRead ? 'bg-blush-50 hover:bg-blush-100' : 'hover:bg-sand-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium font-body text-charcoal-800 text-sm">
                      {order.customerName}
                      {!order.isRead && (
                        <span className="inline-block w-2 h-2 bg-blush-500 rounded-full ml-2"></span>
                      )}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        order.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-600 mb-1">{order.product}</p>
                  <p className="text-xs text-charcoal-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-charcoal-500">
              <p className="text-sm font-body">No orders yet</p>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-3 bg-sand-50 border-t border-sand-200">
            <a
              href="/admin/orders"
              className="block text-center text-sm text-blush-500 hover:text-blush-600 font-semibold transition-colors font-body"
            >
              View All Orders
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
