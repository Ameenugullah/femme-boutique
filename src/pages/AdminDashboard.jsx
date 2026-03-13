import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useOrder } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, PlusCircle, LogOut, Eye, Trash2,
  TrendingUp, DollarSign, Save, X, AlertCircle,
  Edit3, RefreshCw, ChevronDown, Lock, ShoppingCart
} from 'lucide-react';
import { categories } from '../data/products';
import NotificationBell from '../components/NotificationBell';
import Orders from './Orders';

const TABS = ['Overview', 'Products', 'Add Product', 'Orders'];

const emptyForm = {
  name: '', category: 'Gowns', price: '', originalPrice: '',
  description: '', colors: '', sizes: '',
  images: ['', '', ''], badge: '', featured: false,
};

export default function AdminDashboard() {
  const { isAdminLoggedIn, login, logout, loginError, allProducts, addProduct, deleteProduct, updateStock, getStock } = useAdmin();
  const { getUnreadCount } = useOrder();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [stockEdit, setStockEdit] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── LOGIN ──────────────────────────────────────────────────────────────
  if (!isAdminLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-charcoal-900">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <span className="block text-5xl leading-none font-script text-cream-50">NuraBahar</span>
            <span className="font-body text-xs tracking-[0.3em] uppercase text-blush-400 mt-1 block">Admin Portal</span>
          </div>
          <div className="p-8 border bg-white/5 border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={20} className="text-blush-400" />
              <h2 className="text-xl font-light font-display text-cream-50">Sign In</h2>
            </div>
            {loginError && (
              <div className="flex items-center gap-2 px-4 py-3 mb-5 text-sm border bg-blush-500/20 border-blush-500/40 text-blush-300 font-body">
                <AlertCircle size={16} /> {loginError}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-xs tracking-widest uppercase font-body text-white/50">Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && login(loginForm.email, loginForm.password)}
                  className="w-full px-4 py-3 text-sm border bg-white/10 border-white/20 text-cream-50 font-body focus:outline-none focus:border-blush-400 placeholder-white/30"
                  placeholder="admin@nurabahar.ng"
                />
              </div>
              <div>
                <label className="block mb-2 text-xs tracking-widest uppercase font-body text-white/50">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && login(loginForm.email, loginForm.password)}
                  className="w-full px-4 py-3 text-sm border bg-white/10 border-white/20 text-cream-50 font-body focus:outline-none focus:border-blush-400 placeholder-white/30"
                  placeholder="••••••••••"
                />
              </div>
              <button
                onClick={() => login(loginForm.email, loginForm.password)}
                className="w-full py-3 mt-2 font-medium text-white transition-colors duration-200 bg-blush-500 hover:bg-blush-600 font-body"
              >
                Sign In to Dashboard
              </button>
            </div>
            <p className="mt-6 text-xs text-center font-body text-white/20">
              Nura Bahar · Admin Access Only
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── STATS ──────────────────────────────────────────────────────────────
  const totalProducts = allProducts.length;
  const totalValue = allProducts.reduce((s, p) => s + p.price, 0);
  const avgRating = allProducts.length
    ? (allProducts.reduce((s, p) => s + p.rating, 0) / allProducts.length).toFixed(1)
    : '—';
  const lowStock = allProducts.filter(p => getStock(p.id) <= 3).length;

  // ── FORM VALIDATION ─────────────────────────────────────────────────────
  const validateForm = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.colors.trim()) e.colors = 'At least one color required';
    if (!form.sizes.trim()) e.sizes = 'At least one size required';
    if (!form.images[0].trim()) e.image0 = 'At least one image URL required';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddProduct = () => {
    if (!validateForm()) return;
    addProduct({
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      description: form.description.trim(),
      colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      images: form.images.filter(Boolean),
      badge: form.badge || null,
      featured: form.featured,
    });
    setForm(emptyForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setTab('Products');
  };

  // ── DASHBOARD ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f5f2] flex">

      {/* Sidebar — desktop */}
      <aside className="fixed top-0 left-0 z-40 flex-col hidden h-full md:flex w-60 bg-charcoal-900 text-cream-50">
        <div className="p-6 border-b border-white/10">
          <span className="block text-3xl leading-none font-script text-cream-50">NuraBahar</span>
          <span className="font-body text-[9px] tracking-[0.25em] uppercase text-blush-400 mt-0.5 block">Admin Dashboard</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left font-body text-sm transition-all duration-200 relative ${tab === t ? 'bg-blush-500/20 text-blush-300 border-l-2 border-blush-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              {t === 'Overview' && <LayoutDashboard size={16} />}
              {t === 'Products' && <Package size={16} />}
              {t === 'Add Product' && <PlusCircle size={16} />}
              {t === 'Orders' && <ShoppingCart size={16} />}
              {t}
              {t === 'Orders' && getUnreadCount() > 0 && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-xs font-bold bg-blush-500 rounded-full flex items-center justify-center text-white">
                  {getUnreadCount() > 9 ? '9+' : getUnreadCount()}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 space-y-1 border-t border-white/10">
          <div className="flex items-center justify-between px-4 py-3 text-sm text-white/50">
            <span className="font-body">Notifications</span>
            <NotificationBell />
          </div>
          <button onClick={() => navigate('/')}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm transition-all text-white/50 hover:text-white hover:bg-white/5 font-body">
            <Eye size={16} /> View Store
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm transition-all text-white/50 hover:text-white hover:bg-white/5 font-body">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Top bar — mobile */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 md:hidden bg-charcoal-900">
        <span className="text-2xl font-script text-cream-50">NuraBahar</span>
        <div className="flex gap-1 items-center">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`font-body text-xs px-3 py-1.5 transition-all rounded relative ${tab === t ? 'bg-blush-500 text-white' : 'text-white/60'}`}>
              {t === 'Overview' ? '📊' : t === 'Products' ? '📦' : t === 'Add Product' ? '➕' : '📋'}
              {t === 'Orders' && getUnreadCount() > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 text-xs bg-blush-500 rounded-full flex items-center justify-center">•</span>
              )}
            </button>
          ))}
          <button onClick={() => { logout(); navigate('/'); }} className="px-2 ml-1 text-white/50">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 pt-16 md:ml-60 md:pt-0 md:p-8">

        {/* ── OVERVIEW TAB ── */}
        {tab === 'Orders' && (
          <Orders />
        )}

        {tab === 'Overview' && (
          <div>
            <div className="pt-2 mb-8">
              <h1 className="text-3xl italic font-light font-display text-charcoal-800">Welcome back 👋</h1>
              <p className="mt-1 text-sm font-body text-charcoal-700/50">Here's what's happening with your store.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
              {[
                { label: 'Total Products', value: totalProducts, icon: Package, color: 'text-blush-500', bg: 'bg-blush-50' },
                { label: 'Catalogue Value', value: `₦${totalValue.toLocaleString('en-NG')}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Avg. Rating', value: `${avgRating} ★`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Low Stock', value: lowStock, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="p-5 bg-white border border-sand-200">
                  <div className={`w-10 h-10 ${bg} flex items-center justify-center mb-3`}>
                    <Icon size={20} className={color} />
                  </div>
                  <p className="mb-1 text-xs font-body text-charcoal-700/50">{label}</p>
                  <p className="text-2xl font-light font-display text-charcoal-800">{value}</p>
                </div>
              ))}
            </div>

            {/* Recent Products */}
            <div className="bg-white border border-sand-200">
              <div className="flex items-center justify-between p-5 border-b border-sand-100">
                <h2 className="text-lg font-light font-display text-charcoal-800">Recent Products</h2>
                <button onClick={() => setTab('Products')} className="text-xs font-body text-blush-500 hover:text-blush-600">
                  View all →
                </button>
              </div>
              <div className="divide-y divide-sand-100">
                {allProducts.slice(0, 6).map(p => (
                  <div key={p.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-sand-50">
                    <div className="w-10 h-12 overflow-hidden bg-sand-100 shrink-0">
                      <img src={p.images[0]} alt={p.name} className="object-cover w-full h-full"
                        onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=100&q=60'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate font-body text-charcoal-800">{p.name}</p>
                      <p className="text-xs font-body text-charcoal-700/50">{p.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold font-body text-charcoal-800">{`₦${p.price.toLocaleString('en-NG')}`}</p>
                      <p className={`font-body text-xs ${getStock(p.id) <= 3 ? 'text-orange-500' : 'text-green-600'}`}>
                        Stock: {getStock(p.id)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === 'Products' && (
          <div>
            <div className="flex items-center justify-between pt-2 mb-8">
              <div>
                <h1 className="text-3xl italic font-light font-display text-charcoal-800">All Products</h1>
                <p className="mt-1 text-sm font-body text-charcoal-700/50">{allProducts.length} items in catalogue</p>
              </div>
              <button onClick={() => setTab('Add Product')} className="btn-blush flex items-center gap-2 text-sm py-2.5">
                <PlusCircle size={16} /> Add New
              </button>
            </div>

            <div className="overflow-hidden bg-white border border-sand-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-sand-50 border-sand-200">
                    <tr>
                      {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-xs tracking-widest text-left uppercase font-body text-charcoal-700/50">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {allProducts.map(p => (
                      <tr key={p.id} className="transition-colors hover:bg-sand-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 overflow-hidden bg-sand-100 shrink-0">
                              <img src={p.images[0]} alt={p.name} className="object-cover w-full h-full"
                                onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=100&q=60'; }} />
                            </div>
                            <div>
                              <p className="font-body text-sm font-medium text-charcoal-800 max-w-[160px] truncate">{p.name}</p>
                              {p.badge && <span className="font-body text-xs bg-blush-100 text-blush-600 px-1.5 py-0.5">{p.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-body text-charcoal-700/70">{p.category}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium font-body text-charcoal-800">{`₦${p.price.toLocaleString('en-NG')}`}</p>
                          {p.originalPrice && <p className="text-xs line-through font-body text-charcoal-700/40">{`₦${p.originalPrice.toLocaleString('en-NG')}`}</p>}
                        </td>
                        <td className="px-4 py-3">
                          {stockEdit[p.id] !== undefined ? (
                            <div className="flex items-center gap-1">
                              <input type="number" value={stockEdit[p.id]}
                                onChange={e => setStockEdit(s => ({ ...s, [p.id]: e.target.value }))}
                                className="w-16 px-2 py-1 text-sm border border-sand-300 font-body focus:outline-none focus:border-blush-400"
                              />
                              <button onClick={() => { updateStock(p.id, stockEdit[p.id]); setStockEdit(s => { const n = { ...s }; delete n[p.id]; return n; }); }}
                                className="text-green-600 hover:text-green-700"><Save size={14} /></button>
                              <button onClick={() => setStockEdit(s => { const n = { ...s }; delete n[p.id]; return n; })}
                                className="text-charcoal-700/40 hover:text-charcoal-700"><X size={14} /></button>
                            </div>
                          ) : (
                            <button onClick={() => setStockEdit(s => ({ ...s, [p.id]: getStock(p.id) }))}
                              className={`flex items-center gap-1 font-body text-sm font-medium group ${getStock(p.id) <= 3 ? 'text-orange-500' : 'text-green-600'}`}>
                              {getStock(p.id)}
                              <Edit3 size={12} className="transition-opacity opacity-0 group-hover:opacity-100" />
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-body text-amber-500">
                          {'★'.repeat(Math.round(p.rating))} <span className="text-xs text-charcoal-700/40">{p.rating}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => navigate(`/products/${p.id}`)}
                              className="p-1.5 text-charcoal-700/40 hover:text-blush-500 transition-colors" title="View">
                              <Eye size={15} />
                            </button>
                            {deleteConfirm === p.id ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-orange-500 font-body">Delete?</span>
                                <button onClick={() => { deleteProduct(p.id); setDeleteConfirm(null); }}
                                  className="text-xs font-medium text-red-500 font-body hover:text-red-600">Yes</button>
                                <button onClick={() => setDeleteConfirm(null)}
                                  className="text-xs font-body text-charcoal-700/40">No</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(p.id)}
                                className="p-1.5 text-charcoal-700/40 hover:text-red-500 transition-colors" title="Delete">
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ADD PRODUCT TAB ── */}
        {tab === 'Add Product' && (
          <div className="max-w-3xl">
            <div className="pt-2 mb-8">
              <h1 className="text-3xl italic font-light font-display text-charcoal-800">Add New Product</h1>
              <p className="mt-1 text-sm font-body text-charcoal-700/50">Fill in the details to add a new item to the store.</p>
            </div>

            {saved && (
              <div className="flex items-center gap-2 px-4 py-3 mb-6 text-sm text-green-700 border border-green-200 bg-green-50 font-body">
                ✓ Product added successfully!
              </div>
            )}

            <div className="p-6 space-y-6 bg-white border border-sand-200 md:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Product Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field" placeholder="e.g. Luna Dress — Sage" />
                  {formErrors.name && <p className="mt-1 text-xs font-body text-blush-500">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Category *</label>
                  <div className="relative">
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="pr-8 appearance-none input-field">
                      {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-charcoal-700/40" />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Price (₦) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="input-field" placeholder="e.g. 45000" />
                  {formErrors.price && <p className="mt-1 text-xs font-body text-blush-500">{formErrors.price}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Original Price (₦) — Optional</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))}
                    className="input-field" placeholder="Leave blank if no sale" />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Description *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4} className="resize-none input-field" placeholder="Describe the product — fabric, fit, occasions..." />
                {formErrors.description && <p className="mt-1 text-xs font-body text-blush-500">{formErrors.description}</p>}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
                    Colors * <span className="tracking-normal normal-case text-charcoal-700/40">(comma-separated)</span>
                  </label>
                  <input value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))}
                    className="input-field" placeholder="Sage, Blush, Navy" />
                  {formErrors.colors && <p className="mt-1 text-xs font-body text-blush-500">{formErrors.colors}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
                    Sizes * <span className="tracking-normal normal-case text-charcoal-700/40">(comma-separated)</span>
                  </label>
                  <input value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))}
                    className="input-field" placeholder="S, M, L, XL" />
                  {formErrors.sizes && <p className="mt-1 text-xs font-body text-blush-500">{formErrors.sizes}</p>}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
                  Image URLs * <span className="tracking-normal normal-case text-charcoal-700/40">(at least 1)</span>
                </label>
                <div className="space-y-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={img}
                        onChange={e => setForm(f => { const imgs = [...f.images]; imgs[i] = e.target.value; return { ...f, images: imgs }; })}
                        className="flex-1 input-field" placeholder={`Image ${i + 1} URL — e.g. /images/my-dress.jpg`} />
                      {img && (
                        <img src={img} alt="" className="object-cover w-10 h-12 bg-sand-100 shrink-0"
                          onError={e => { e.target.style.opacity = 0; }} />
                      )}
                    </div>
                  ))}
                </div>
                {formErrors.image0 && <p className="mt-1 text-xs font-body text-blush-500">{formErrors.image0}</p>}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
                    Badge <span className="tracking-normal normal-case text-charcoal-700/40">(optional)</span>
                  </label>
                  <div className="relative">
                    <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                      className="pr-8 appearance-none input-field">
                      <option value="">None</option>
                      {['New', 'Sale', 'Bestseller', 'Luxury', 'Bridal'].map(b => <option key={b}>{b}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-charcoal-700/40" />
                  </div>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 pb-3 cursor-pointer">
                    <input type="checkbox" checked={form.featured}
                      onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                      className="w-4 h-4 accent-blush-500" />
                    <div>
                      <span className="block text-sm font-medium font-body text-charcoal-800">Feature on Homepage</span>
                      <span className="text-xs font-body text-charcoal-700/50">Show in featured carousel</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-sand-100">
                <button onClick={handleAddProduct} className="flex items-center gap-2 btn-blush">
                  <PlusCircle size={16} /> Add Product to Store
                </button>
                <button onClick={() => setForm(emptyForm)} className="btn-outline flex items-center gap-2 text-sm py-2.5">
                  <RefreshCw size={14} /> Reset Form
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}