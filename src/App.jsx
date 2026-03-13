import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { OrderProvider } from './context/OrderContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import FAQ from './pages/FAQ';
import AdminDashboard from './pages/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function StoreLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen pt-20">
              <div className="px-6 text-center">
                <h1 className="mb-4 font-light font-display text-8xl text-charcoal-800">404</h1>
                <p className="mb-8 text-lg font-body text-charcoal-700/60">This page doesn't exist.</p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <OrderProvider>
          <CartProvider>
            <Routes>
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/*" element={<StoreLayout />} />
            </Routes>
          </CartProvider>
        </OrderProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}