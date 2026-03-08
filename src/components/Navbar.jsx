import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Heart } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start group leading-none">
          <span className="font-script text-4xl text-charcoal-900 group-hover:text-blush-500 transition-colors duration-200 leading-none">
            NuraBahar
          </span>
          <span className="font-body text-[9px] tracking-[0.3em] uppercase text-charcoal-700/50 mt-0.5">Nigeria</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-body text-sm font-medium tracking-wide transition-colors duration-200 relative group ${isActive ? 'text-blush-500' : 'text-charcoal-700 hover:text-blush-500'}`
              }
            >
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-blush-400 transition-all duration-300 group-hover:w-full" />
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center animate-fade-in">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="border-b border-charcoal-700 bg-transparent font-body text-sm py-1 px-2 w-40 focus:outline-none focus:border-blush-500 transition-colors"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="ml-2 text-charcoal-700 hover:text-blush-500 transition-colors">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-charcoal-700 hover:text-blush-500 transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          <button className="p-2 text-charcoal-700 hover:text-blush-500 transition-colors duration-200 hidden sm:block" aria-label="Wishlist">
            <Heart size={20} />
          </button>

          <Link to="/cart" className="relative p-2 text-charcoal-700 hover:text-blush-500 transition-colors duration-200" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-blush-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-body font-medium animate-fade-in">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-charcoal-700 hover:text-blush-500 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream-50/98 backdrop-blur-md border-t border-sand-200 animate-fade-in">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `font-body text-base font-medium py-2 border-b border-sand-200 transition-colors ${isActive ? 'text-blush-500' : 'text-charcoal-800'}`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="font-body text-base font-medium py-2 text-charcoal-800 flex items-center gap-2">
              <ShoppingBag size={18} /> Cart {cartCount > 0 && <span className="bg-blush-500 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
