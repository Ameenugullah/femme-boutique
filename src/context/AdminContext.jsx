import { createContext, useContext, useState, useCallback } from 'react';
import { products as staticProducts } from '../data/products';

const AdminContext = createContext(null);

const ADMIN_EMAIL = 'admin@nurabahar.ng';
const ADMIN_PASSWORD = 'NuraBahar2025!';

export function AdminProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminProducts, setAdminProducts] = useState([]);
  const [stockOverrides, setStockOverrides] = useState({});
  const [loginError, setLoginError] = useState('');

  const login = useCallback((email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setLoginError('');
      return true;
    }
    setLoginError('Invalid email or password.');
    return false;
  }, []);

  const logout = useCallback(() => setIsAdminLoggedIn(false), []);

  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      rating: 5.0,
      reviews: 0,
      featured: false,
    };
    setAdminProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const deleteProduct = useCallback((id) => {
    setAdminProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateStock = useCallback((id, stock) => {
    setStockOverrides(prev => ({ ...prev, [id]: Number(stock) }));
  }, []);

  const getStock = useCallback((id) => {
    return stockOverrides[id] ?? 10;
  }, [stockOverrides]);

  const allProducts = [...staticProducts, ...adminProducts];

  return (
    <AdminContext.Provider value={{
      isAdminLoggedIn, login, logout, loginError,
      adminProducts, addProduct, deleteProduct,
      stockOverrides, updateStock, getStock,
      allProducts,
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