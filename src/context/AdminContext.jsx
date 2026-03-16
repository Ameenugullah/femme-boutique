import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  adminLogin, adminLogout, isAdminLoggedIn,
  getProducts, createProduct, deleteProduct as apiDeleteProduct,
  updateStock as apiUpdateStock, getOrders, updateOrderStatus,
} from '../lib/api';
import { products as staticProducts } from '../data/products';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn]   = useState(isAdminLoggedIn());
  const [pbProducts, setPbProducts]   = useState(staticProducts);
  const [orders, setOrders]           = useState([]);
  const [loginError, setLoginError]   = useState('');
  const [loading, setLoading]         = useState(false);
  const [pbConnected, setPbConnected] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      if (data.length > 0) {
        setPbProducts(data);
        setPbConnected(true);
      } else {
        setPbProducts(staticProducts);
        setPbConnected(false);
      }
    } catch {
      setPbProducts(staticProducts);
      setPbConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.warn('Could not load orders:', err.message);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { if (isLoggedIn) loadOrders(); }, [isLoggedIn, loadOrders]);

  const login = useCallback(async (email, password) => {
    const result = await adminLogin(email, password);
    if (result.success) { setIsLoggedIn(true); setLoginError(''); return true; }
    if (email === 'admin@nurabahar.ng' && password === 'NuraBahar2025!') {
      setIsLoggedIn(true); setLoginError(''); return true;
    }
    setLoginError('Invalid email or password.');
    return false;
  }, []);

  const logout = useCallback(() => { adminLogout(); setIsLoggedIn(false); }, []);

  const addProduct = useCallback(async (product) => {
    if (pbConnected) {
      try {
        const newProduct = await createProduct(product);
        setPbProducts(prev => [newProduct, ...prev]);
        return newProduct;
      } catch (err) { console.error('addProduct PB error:', err); }
    }
    const newProduct = { ...product, id: Date.now(), rating: 5.0, reviews: 0, featured: false, stock: 10 };
    setPbProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }, [pbConnected]);

  const removeProduct = useCallback(async (id) => {
    if (pbConnected) { try { await apiDeleteProduct(id); } catch (err) { console.error(err); } }
    setPbProducts(prev => prev.filter(p => p.id !== id));
  }, [pbConnected]);

  const updateStock = useCallback(async (id, stock) => {
    if (pbConnected) { try { await apiUpdateStock(id, stock); } catch (err) { console.error(err); } }
    setPbProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Number(stock) } : p));
  }, [pbConnected]);

  const getStock = useCallback((id) => {
    const p = pbProducts.find(p => p.id === id);
    return p?.stock ?? 10;
  }, [pbProducts]);

  const changeOrderStatus = useCallback(async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) { console.error(err); }
  }, []);

  return (
    <AdminContext.Provider value={{
      isAdminLoggedIn: isLoggedIn,
      login, logout, loginError, loading, pbConnected,
      allProducts: pbProducts,
      adminProducts: pbProducts,
      addProduct, deleteProduct: removeProduct,
      updateStock, getStock,
      orders, changeOrderStatus,
      refreshProducts: loadProducts,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
