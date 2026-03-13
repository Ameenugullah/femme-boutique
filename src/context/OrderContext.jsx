import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const OrderContext = createContext(null);

// Generate mock orders for demo
const generateMockOrders = () => {
  const statuses = ['Pending', 'Processing', 'Delivered'];
  const products = [
    'Teal Satin Boubou',
    'Coral Cape Dress',
    'Ankara Dress',
    'Luna Evening Gown',
    'Royal Blue Kaftan',
    'Gold Embellished Gown'
  ];

  const orders = [];
  for (let i = 1; i <= 12; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - daysAgo);

    orders.push({
      id: `ORD-${String(i).padStart(5, '0')}`,
      customerName: `Customer ${i}`,
      phone: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `customer${i}@example.com`,
      product: products[Math.floor(Math.random() * products.length)],
      quantity: Math.floor(Math.random() * 3) + 1,
      deliveryAddress: `${i} Lekki Phase ${Math.floor(Math.random() * 3) + 1}, Lagos, Nigeria`,
      orderDate: orderDate.toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      isRead: Math.random() > 0.4,
      notes: i % 3 === 0 ? 'Rush delivery requested' : '',
      totalAmount: Math.floor(Math.random() * 100000) + 25000,
    });
  }
  return orders;
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(generateMockOrders());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [newOrderNotification, setNewOrderNotification] = useState(null);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance of new order every 10 seconds in demo
      if (Math.random() < 0.3) {
        const newOrder = {
          id: `ORD-${String(Date.now()).slice(-5)}`,
          customerName: `New Customer ${Math.floor(Math.random() * 1000)}`,
          phone: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          email: `customer@example.com`,
          product: ['Boubou', 'Gown', 'Cape Dress'][Math.floor(Math.random() * 3)],
          quantity: Math.floor(Math.random() * 3) + 1,
          deliveryAddress: `Lagos, Nigeria`,
          orderDate: new Date().toISOString(),
          status: 'Pending',
          isRead: false,
          notes: '',
          totalAmount: Math.floor(Math.random() * 100000) + 25000,
        };
        
        setOrders(prev => [newOrder, ...prev]);
        setNewOrderNotification(newOrder);
        
        // Auto-dismiss notification after 5 seconds
        setTimeout(() => setNewOrderNotification(null), 5000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getUnreadCount = useCallback(() => {
    return orders.filter(o => !o.isRead).length;
  }, [orders]);

  const getRecentOrders = useCallback((limit = 5) => {
    return orders
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, limit);
  }, [orders]);

  const markAsRead = useCallback((orderId) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, isRead: true } : order
      )
    );
  }, []);

  const markAsProcessing = useCallback((orderId) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: 'Processing', isRead: true } : order
      )
    );
  }, []);

  const markAsDelivered = useCallback((orderId) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: 'Delivered', isRead: true } : order
      )
    );
  }, []);

  const getOrderById = useCallback((orderId) => {
    return orders.find(o => o.id === orderId);
  }, [orders]);

  const updateOrderNotes = useCallback((orderId, notes) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, notes } : order
      )
    );
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        selectedOrder,
        setSelectedOrder,
        showOrderDetail,
        setShowOrderDetail,
        getUnreadCount,
        getRecentOrders,
        markAsRead,
        markAsProcessing,
        markAsDelivered,
        getOrderById,
        updateOrderNotes,
        newOrderNotification,
        setNewOrderNotification,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
}
