import { X, Clock, CheckCircle, MapPin, Phone, Mail, Package, DollarSign } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function OrderDetailsModal({ order, onClose }) {
  const { markAsProcessing, markAsDelivered, updateOrderNotes } = useOrder();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      {/* Modal */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-sand-50 to-sand-100 px-6 py-4 border-b border-sand-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-light font-display text-charcoal-800">{order.id}</h2>
            <p className="text-sm text-charcoal-600 font-body">Order Details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-charcoal-600 hover:bg-white rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Bar */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sand-50 to-sand-100 rounded-lg border border-sand-200">
            <div className="flex items-center gap-3">
              {order.status === 'Pending' && <Clock size={24} className="text-amber-500" />}
              {order.status === 'Processing' && <Clock size={24} className="text-blue-500" />}
              {order.status === 'Delivered' && <CheckCircle size={24} className="text-green-500" />}
              <div>
                <p className="text-sm text-charcoal-600 font-body">Current Status</p>
                <p className={`font-semibold font-display text-lg ${
                  order.status === 'Pending'
                    ? 'text-amber-600'
                    : order.status === 'Processing'
                    ? 'text-blue-600'
                    : 'text-green-600'
                }`}>
                  {order.status}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {order.status === 'Pending' && (
                <button
                  onClick={() => markAsProcessing(order.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm font-body"
                >
                  Mark Processing
                </button>
              )}
              {order.status !== 'Delivered' && (
                <button
                  onClick={() => markAsDelivered(order.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-sm font-body"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>

          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="border border-sand-200 rounded-lg p-4">
              <h3 className="font-semibold font-display text-charcoal-800 mb-4">Customer Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-charcoal-600 font-body uppercase tracking-wide mb-1">
                    Full Name
                  </p>
                  <p className="font-semibold font-body text-charcoal-800">{order.customerName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blush-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-charcoal-600 font-body uppercase tracking-wide mb-1">
                      Phone
                    </p>
                    <p className="font-body text-charcoal-800">{order.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail size={16} className="text-blush-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-charcoal-600 font-body uppercase tracking-wide mb-1">
                      Email
                    </p>
                    <p className="font-body text-charcoal-800">{order.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="border border-sand-200 rounded-lg p-4">
              <h3 className="font-semibold font-display text-charcoal-800 mb-4">Delivery Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-blush-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-charcoal-600 font-body uppercase tracking-wide mb-1">
                      Address
                    </p>
                    <p className="font-body text-charcoal-800">{order.deliveryAddress}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-charcoal-600 font-body uppercase tracking-wide mb-1">
                    Order Date
                  </p>
                  <p className="font-body text-charcoal-800">
                    {new Date(order.orderDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-charcoal-600 font-body uppercase tracking-wide mb-1">
                    Time
                  </p>
                  <p className="font-body text-charcoal-800">
                    {new Date(order.orderDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-sand-200 rounded-lg p-4">
            <h3 className="font-semibold font-display text-charcoal-800 mb-4 flex items-center gap-2">
              <Package size={18} className="text-blush-500" />
              Order Items
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-sand-50 rounded-lg">
                <div>
                  <p className="font-semibold font-body text-charcoal-800">{order.product}</p>
                  <p className="text-xs text-charcoal-600 font-body">Product</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold font-body text-charcoal-800">Qty: {order.quantity}</p>
                  <p className="text-xs text-charcoal-600 font-body">Quantity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="border border-sand-200 rounded-lg p-4 bg-gradient-to-r from-blush-50 to-sand-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-blush-500" />
                <div>
                  <p className="text-xs text-charcoal-600 font-body uppercase tracking-wide mb-1">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold font-display text-charcoal-800">
                    ₦{order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div className="border border-sand-200 rounded-lg p-4">
            <h3 className="font-semibold font-display text-charcoal-800 mb-3">Order Notes</h3>
            {order.notes ? (
              <p className="font-body text-charcoal-700 p-3 bg-sand-50 rounded-lg italic">
                "{order.notes}"
              </p>
            ) : (
              <p className="font-body text-charcoal-500 p-3 bg-sand-50 rounded-lg italic">
                No special notes for this order
              </p>
            )}
          </div>

          {/* Additional Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-body text-blue-900">
              <span className="font-semibold">Order ID:</span> {order.id}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-sand-50 px-6 py-4 border-t border-sand-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-sand-300 text-charcoal-700 rounded-lg hover:bg-sand-100 transition-colors font-semibold font-body"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
