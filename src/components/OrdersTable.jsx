import { Eye, CheckCircle, Clock } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function OrdersTable({ orders, onViewDetails }) {
  const { markAsProcessing, markAsDelivered } = useOrder();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Processing':
        return 'bg-blue-100 text-blue-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock size={16} className="inline mr-1" />;
      case 'Processing':
        return <Clock size={16} className="inline mr-1" />;
      case 'Delivered':
        return <CheckCircle size={16} className="inline mr-1" />;
      default:
        return null;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 border border-sand-200 shadow-soft text-center">
        <p className="text-charcoal-600 font-body text-lg mb-2">No orders found</p>
        <p className="text-charcoal-500 font-body text-sm">
          Adjust your filters or search terms to find orders
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-sand-200 shadow-soft overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-sand-50 border-b border-sand-200">
              <th className="px-6 py-4 text-left font-semibold font-body text-charcoal-700 text-sm">
                Order ID
              </th>
              <th className="px-6 py-4 text-left font-semibold font-body text-charcoal-700 text-sm">
                Customer
              </th>
              <th className="px-6 py-4 text-left font-semibold font-body text-charcoal-700 text-sm">
                Contact
              </th>
              <th className="px-6 py-4 text-left font-semibold font-body text-charcoal-700 text-sm">
                Product
              </th>
              <th className="px-6 py-4 text-center font-semibold font-body text-charcoal-700 text-sm">
                Qty
              </th>
              <th className="px-6 py-4 text-left font-semibold font-body text-charcoal-700 text-sm">
                Amount
              </th>
              <th className="px-6 py-4 text-left font-semibold font-body text-charcoal-700 text-sm">
                Status
              </th>
              <th className="px-6 py-4 text-center font-semibold font-body text-charcoal-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-sand-100 hover:bg-sand-50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold font-body text-charcoal-800">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-sm font-body text-charcoal-700">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 text-sm font-body text-charcoal-600">
                  {order.phone}
                </td>
                <td className="px-6 py-4 text-sm font-body text-charcoal-700">
                  {order.product}
                </td>
                <td className="px-6 py-4 text-sm font-body text-charcoal-700 text-center">
                  {order.quantity}
                </td>
                <td className="px-6 py-4 text-sm font-semibold font-body text-charcoal-800">
                  ₦{order.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-xs ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="p-2 text-blush-500 hover:bg-blush-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    {order.status !== 'Delivered' && (
                      <div className="relative group">
                        <button
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Update Status"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <div className="absolute right-0 mt-0 invisible group-hover:visible bg-white border border-sand-200 rounded-lg shadow-lg z-10 whitespace-nowrap">
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => markAsProcessing(order.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-sand-50 font-body"
                            >
                              Mark Processing
                            </button>
                          )}
                          {order.status !== 'Delivered' && (
                            <button
                              onClick={() => markAsDelivered(order.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-sand-50 font-body border-t border-sand-100"
                            >
                              Mark Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-sand-200">
        {orders.map((order) => (
          <div key={order.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold font-display text-charcoal-800">{order.id}</p>
                <p className="text-sm font-body text-charcoal-600">{order.customerName}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <p className="font-body text-charcoal-500 text-xs mb-1">Contact</p>
                <p className="font-body text-charcoal-700">{order.phone}</p>
              </div>
              <div>
                <p className="font-body text-charcoal-500 text-xs mb-1">Product</p>
                <p className="font-body text-charcoal-700">{order.product}</p>
              </div>
              <div>
                <p className="font-body text-charcoal-500 text-xs mb-1">Qty</p>
                <p className="font-body text-charcoal-700">{order.quantity}</p>
              </div>
              <div>
                <p className="font-body text-charcoal-500 text-xs mb-1">Amount</p>
                <p className="font-semibold font-body text-charcoal-800">₦{order.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-sand-100">
              <button
                onClick={() => onViewDetails(order)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blush-50 text-blush-600 hover:bg-blush-100 rounded-lg transition-colors font-body text-sm font-semibold"
              >
                <Eye size={14} /> View
              </button>
              {order.status !== 'Delivered' && (
                <button
                  onClick={() => markAsDelivered(order.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors font-body text-sm font-semibold"
                >
                  <CheckCircle size={14} /> Mark Done
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
