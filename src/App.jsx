import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import FAQ from './pages/FAQ';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
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
            <div className="min-h-screen flex items-center justify-center pt-20">
              <div className="text-center">
                <h1 className="font-display text-6xl text-charcoal-800 mb-4">404</h1>
                <p className="font-body text-charcoal-700/60 mb-8">Page not found</p>
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
      <CartProvider>
        <Layout />
      </CartProvider>
    </BrowserRouter>
  );
}
