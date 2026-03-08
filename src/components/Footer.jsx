import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, ArrowRight, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-charcoal-900 text-cream-100">
      {/* Newsletter Strip */}
      <div className="bg-blush-500 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl text-white mb-1">Join the Femme Circle</h3>
            <p className="font-body text-white/80 text-sm">Get 15% off your first order + exclusive access to new arrivals</p>
          </div>
          {subscribed ? (
            <div className="bg-white/20 border border-white/30 px-8 py-3 text-white font-body font-medium animate-fade-in">
              ✓ Welcome to the circle!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-5 py-3 bg-white/10 border border-white/30 text-white placeholder-white/50 font-body text-sm focus:outline-none focus:bg-white/20 min-w-0"
              />
              <button type="submit" className="bg-charcoal-800 hover:bg-charcoal-900 text-white px-5 py-3 transition-colors duration-200 flex items-center gap-2 font-body text-sm font-medium whitespace-nowrap">
                Subscribe <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <h2 className="leading-none mb-4">
            <span className="font-script text-4xl text-cream-50 block leading-none">NuraBahar</span>
            <span className="font-body text-[9px] tracking-[0.3em] uppercase text-blush-400 mt-0.5 block">Nigeria</span>
          </h2>
          <p className="font-body text-cream-200/60 text-sm leading-relaxed mb-6">
            Handcrafted women's fashion from Kano, Nigeria. Boubous, gowns, Ankara, and artisan perfume oils — made with love and purpose.
          </p>
          <div className="flex items-center gap-4">
            {[
              { icon: Instagram, href: '#', label: 'Instagram' },
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Facebook, href: '#', label: 'Facebook' },
              { icon: Youtube, href: '#', label: 'YouTube' },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label}
                className="w-9 h-9 flex items-center justify-center border border-white/20 text-cream-200/60 hover:border-blush-400 hover:text-blush-400 transition-all duration-200">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-body text-xs tracking-widest uppercase text-blush-400 mb-5">Shop</h4>
          <ul className="space-y-3">
            {['New Arrivals', 'Dresses', 'Tops', 'Bottoms', 'Accessories', 'Outerwear', 'Sale'].map(item => (
              <li key={item}>
                <Link to="/products" className="font-body text-sm text-cream-200/60 hover:text-cream-100 transition-colors duration-200">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-body text-xs tracking-widest uppercase text-blush-400 mb-5">Help</h4>
          <ul className="space-y-3">
            {[
              { label: 'Size Guide', to: '/faq' },
              { label: 'Shipping Info', to: '/faq' },
              { label: 'Returns & Exchanges', to: '/faq' },
              { label: 'FAQ', to: '/faq' },
              { label: 'Contact Us', to: '/faq' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="font-body text-sm text-cream-200/60 hover:text-cream-100 transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-body text-xs tracking-widest uppercase text-blush-400 mb-5">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-cream-200/60">
              <MapPin size={16} className="mt-0.5 shrink-0 text-blush-400" />
              <span className="font-body text-sm leading-relaxed">Kano, Kano State, Nigeria</span>
            </li>
            <li className="flex items-center gap-3 text-cream-200/60">
              <Mail size={16} className="shrink-0 text-blush-400" />
              <a href="mailto:hello@nurabahar.ng" className="font-body text-sm hover:text-cream-100 transition-colors">
                hello@nurabahar.ng
              </a>
            </li>
            <li className="flex items-center gap-3 text-cream-200/60">
              <Phone size={16} className="shrink-0 text-blush-400" />
              <span className="font-body text-sm">+234 802 000 0000</span>
            </li>
          </ul>
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="font-body text-xs text-cream-200/40">Mon–Fri: 9AM–6PM EST</p>
            <p className="font-body text-xs text-cream-200/40">Sat: 10AM–4PM EST</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-cream-200/40">
            © {new Date().getFullYear()} Femme Boutique. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="font-body text-xs text-cream-200/40 hover:text-cream-200/70 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
