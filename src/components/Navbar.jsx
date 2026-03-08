import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Heart, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-soft py-3' : 'bg-transparent py-5'}`}>
      <div className="flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6">

        {/* Logo */}
        <Link to="/" className="flex flex-col items-start leading-none group">
          <span className="text-4xl leading-none transition-colors duration-200 font-script text-charcoal-900 group-hover:text-blush-500">
            NuraBahar
          </span>
          <span className="font-body text-[9px] tracking-[0.3em] uppercase text-charcoal-700/50 mt-0.5">Nigeria</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="items-center hidden gap-8 md:flex">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `font-body text-sm font-medium tracking-wide transition-colors duration-200 relative group ${isActive ? 'text-blush-500' : 'text-charcoal-700 hover:text-blush-500'}`
              }
            >
              {label}
              <span className="absolute left-0 w-0 h-px transition-all duration-300 -bottom-1 bg-blush-400 group-hover:w-full" />
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center animate-fade-in">
                <input autoFocus type="text" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="px-2 py-1 text-sm transition-colors bg-transparent border-b border-charcoal-700 font-body w-36 sm:w-44 focus:outline-none focus:border-blush-500"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="ml-2 text-charcoal-700 hover:text-blush-500">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)}
                className="p-2 transition-colors duration-200 text-charcoal-700 hover:text-blush-500" aria-label="Search">
                <Search size={20} />
              </button>
            )}
          </div>

          <button className="hidden p-2 transition-colors duration-200 text-charcoal-700 hover:text-blush-500 sm:block" aria-label="Wishlist">
            <Heart size={20} />
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 transition-colors duration-200 text-charcoal-700 hover:text-blush-500" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-blush-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-body font-medium">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Admin Icon */}
          <Link to="/admin" className="p-2 transition-colors duration-200 text-charcoal-700/40 hover:text-blush-500" aria-label="Admin Dashboard" title="Admin Dashboard">
            <Settings size={18} />
          </Link>

          {/* Mobile menu toggle */}
          <button className="p-2 transition-colors md:hidden text-charcoal-700 hover:text-blush-500"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t md:hidden bg-cream-50/98 backdrop-blur-md border-sand-200 animate-fade-in">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `font-body text-base font-medium py-3 border-b border-sand-100 transition-colors ${isActive ? 'text-blush-500' : 'text-charcoal-800'}`
                }>
                {label}
              </NavLink>
            ))}
            <Link to="/cart" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-3 text-base font-medium border-b font-body border-sand-100 text-charcoal-800">
              <ShoppingBag size={18} /> Cart
              {cartCount > 0 && <span className="bg-blush-500 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
            </Link>
            <Link to="/admin" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-3 text-base font-medium font-body text-charcoal-700/50">
              <Settings size={18} /> Admin Dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}