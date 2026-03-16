import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, PlusCircle, LogOut, Eye, Trash2,
  TrendingUp, DollarSign, Save, X, AlertCircle,
  Edit3, RefreshCw, ChevronDown, Lock, ShoppingBag, Wifi, WifiOff
} from 'lucide-react';
import { categories } from '../data/products';

const TABS = ['Overview', 'Products', 'Add Product', 'Orders'];

const emptyForm = {
  name: '', category: 'Gowns', price: '', originalPrice: '',
  description: '', colors: '', sizes: '',
  images: ['', '', ''], badge: '', featured: false,
};

export default function AdminDashboard() {
  const {
    isAdminLoggedIn, login, logout, loginError,
    allProducts, addProduct, deleteProduct, updateStock, getStock,
    orders, changeOrderStatus, pbConnected, loading,
  } = useAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stockEdit, setStockEdit] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <span className="font-script text-5xl text-cream-50 block leading-none">NuraBahar</span>
            <span className="font-body text-xs tracking-[0.3em] uppercase text-blush-400 mt-1 block">Admin Portal</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={20} className="text-blush-400" />
              <h2 className="font-display text-xl text-cream-50 font-light">Sign In</h2>
            </div>
            {loginError && (
              <div className="flex items-center gap-2 bg-blush-500/20 border border-blush-500/40 text-blush-300 text-sm px-4 py-3 mb-5 font-body">
                <AlertCircle size={16} /> {loginError}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-white/50 mb-2 block">Email</label>
                <input type="email" value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && login(loginForm.email, loginForm.password)}
                  className="w-full bg-white/10 border border-white/20 text-cream-50 px-4 py-3 font-body text-sm focus:outline-none focus:border-blush-400 placeholder-white/30"
                  placeholder="admin@nurabahar.ng" />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-white/50 mb-2 block">Password</label>
                <input type="password" value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && login(loginForm.email, loginForm.password)}
                  className="w-full bg-white/10 border border-white/20 text-cream-50 px-4 py-3 font-body text-sm focus:outline-none focus:border-blush-400 placeholder-white/30"
                  placeholder="••••••••••" />
              </div>
              <button onClick={() => login(loginForm.email, loginForm.password)}
                className="w-full bg-blush-500 hover:bg-blush-600 text-white py-3 font-body font-medium transition-colors duration-200 mt-2">
                Sign In to Dashboard
              </button>
            </div>
            <p className="font-body text-xs text-white/20 text-center mt-6">Nura Bahar · Admin Access Only</p>
          </div>
        </div>
      </div>
    );
  }

  // ── STATS ──────────────────────────────────────────────────────────────────
  const totalProducts = allProducts.length;
  const totalValue = allProducts.reduce((s, p) => s + p.price, 0);
  const avgRating = allProducts.length
    ? (allProducts.reduce((s, p) => s + p.rating, 0) / allProducts.length).toFixed(1)
    : '—';
  const lowStock = allProducts.filter(p => getStock(p.id) <= 3).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // ── FORM VALIDATION ────────────────────────────────────────────────────────
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

  const handleAddProduct = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      await addProduct({
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
        stock: 10,
      });
      setForm(emptyForm);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setTab('Products');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f5f2] flex">

      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-charcoal-900 text-cream-50 fixed top-0 left-0 h-full z-40">
        <div className="p-6 border-b border-white/10">
          <span className="font-script text-3xl text-cream-50 block leading-none">NuraBahar</span>
          <span className="font-body text-[9px] tracking-[0.25em] uppercase text-blush-400 mt-0.5 block">Admin Dashboard</span>
        </div>

        {/* PocketBase status */}
        <div className={`mx-4 mt-3 px-3 py-2 flex items-center gap-2 text-xs font-body ${pbConnected ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
          {pbConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {pbConnected ? 'PocketBase Connected' : 'Offline Mode'}
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-2">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left font-body text-sm transition-all duration-200 ${tab === t ? 'bg-blush-500/20 text-blush-300 border-l-2 border-blush-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              {t === 'Overview'     && <LayoutDashboard size={16} />}
              {t === 'Products'     && <Package size={16} />}
              {t === 'Add Product'  && <PlusCircle size={16} />}
              {t === 'Orders'       && <ShoppingBag size={16} />}
              {t}
              {t === 'Orders' && pendingOrders > 0 && (
                <span className="ml-auto bg-blush-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{pendingOrders}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-1">
          <button onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 font-body text-sm transition-all">
            <Eye size={16} /> View Store
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 font-body text-sm transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Top bar — mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-charcoal-900 px-4 py-3 flex items-center justify-between z-40">
        <span className="font-script text-2xl text-cream-50">NuraBahar</span>
        <div className="flex gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`font-body text-xs px-2 py-1.5 transition-all rounded relative ${tab === t ? 'bg-blush-500 text-white' : 'text-white/60'}`}>
              {t === 'Overview' ? '📊' : t === 'Products' ? '📦' : t === 'Add Product' ? '➕' : '🛍️'}
              {t === 'Orders' && pendingOrders > 0 && (
                <span className="absolute -top-1 -right-1 bg-blush-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">{pendingOrders}</span>
              )}
            </button>
          ))}
          <button onClick={() => { logout(); navigate('/'); }} className="text-white/50 px-2 ml-1">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-60 pt-16 md:pt-0 p-4 md:p-8">

        {/* ── OVERVIEW TAB ── */}
        {tab === 'Overview' && (
          <div>
            <div className="mb-8 pt-2">
              <h1 className="font-display text-3xl text-charcoal-800 font-light italic">Welcome back 👋</h1>
              <p className="font-body text-sm text-charcoal-700/50 mt-1">Here's what's happening with your store.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Products', value: totalProducts, icon: Package, color: 'text-blush-500', bg: 'bg-blush-50' },
                { label: 'Catalogue Value', value: `₦${totalValue.toLocaleString('en-NG')}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Avg. Rating', value: `${avgRating} ★`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Low Stock', value: lowStock, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white border border-sand-200 p-5">
                  <div className={`w-10 h-10 ${bg} flex items-center justify-center mb-3`}>
                    <Icon size={20} className={color} />
                  </div>
                  <p className="font-body text-xs text-charcoal-700/50 mb-1">{label}</p>
                  <p className="font-display text-2xl text-charcoal-800 font-light">{value}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Products */}
              <div className="bg-white border border-sand-200">
                <div className="flex items-center justify-between p-5 border-b border-sand-100">
                  <h2 className="font-display text-lg text-charcoal-800 font-light">Recent Products</h2>
                  <button onClick={() => setTab('Products')} className="font-body text-xs text-blush-500 hover:text-blush-600">View all →</button>
                </div>
                <div className="divide-y divide-sand-100">
                  {allProducts.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-sand-50 transition-colors">
                      <div className="w-10 h-12 overflow-hidden bg-sand-100 shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover"
                          onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=100&q=60'; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium text-charcoal-800 truncate">{p.name}</p>
                        <p className="font-body text-xs text-charcoal-700/50">{p.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-body text-sm font-semibold text-charcoal-800">{`₦${p.price.toLocaleString('en-NG')}`}</p>
                        <p className={`font-body text-xs ${getStock(p.id) <= 3 ? 'text-orange-500' : 'text-green-600'}`}>
                          Stock: {getStock(p.id)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Recent Orders */}
              <div className="bg-white border border-sand-200">
                <div className="flex items-center justify-between p-5 border-b border-sand-100">
                  <h2 className="font-display text-lg text-charcoal-800 font-light">Recent Orders</h2>
                  <button onClick={() => setTab('Orders')} className="font-body text-xs text-blush-500 hover:text-blush-600">View all →</button>
                </div>
                <div className="divide-y divide-sand-100">
                  {orders.length === 0 ? (
                    <p className="font-body text-sm text-charcoal-700/40 text-center py-8">No orders yet</p>
                  ) : orders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex items-center gap-4 p-4 hover:bg-sand-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium text-charcoal-800 truncate">{o.customerName}</p>
                        <p className="font-body text-xs text-charcoal-700/50">{o.city}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-body text-sm font-semibold text-charcoal-800">{`₦${Number(o.total).toLocaleString('en-NG')}`}</p>
                        <span className={`font-body text-xs px-2 py-0.5 ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === 'Products' && (
          <div>
            <div className="flex items-center justify-between mb-8 pt-2">
              <div>
                <h1 className="font-display text-3xl text-charcoal-800 font-light italic">All Products</h1>
                <p className="font-body text-sm text-charcoal-700/50 mt-1">{allProducts.length} items in catalogue</p>
              </div>
              <button onClick={() => setTab('Add Product')} className="btn-blush flex items-center gap-2 text-sm py-2.5">
                <PlusCircle size={16} /> Add New
              </button>
            </div>
            <div className="bg-white border border-sand-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sand-50 border-b border-sand-200">
                    <tr>
                      {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                        <th key={h} className="text-left font-body text-xs tracking-widest uppercase text-charcoal-700/50 px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {allProducts.map(p => (
                      <tr key={p.id} className="hover:bg-sand-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 overflow-hidden bg-sand-100 shrink-0">
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover"
                                onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=100&q=60'; }} />
                            </div>
                            <div>
                              <p className="font-body text-sm font-medium text-charcoal-800 max-w-[160px] truncate">{p.name}</p>
                              {p.badge && <span className="font-body text-xs bg-blush-100 text-blush-600 px-1.5 py-0.5">{p.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-charcoal-700/70">{p.category}</td>
                        <td className="px-4 py-3">
                          <p className="font-body text-sm font-medium text-charcoal-800">{`₦${p.price.toLocaleString('en-NG')}`}</p>
                          {p.originalPrice && <p className="font-body text-xs text-charcoal-700/40 line-through">{`₦${p.originalPrice.toLocaleString('en-NG')}`}</p>}
                        </td>
                        <td className="px-4 py-3">
                          {stockEdit[p.id] !== undefined ? (
                            <div className="flex items-center gap-1">
                              <input type="number" value={stockEdit[p.id]}
                                onChange={e => setStockEdit(s => ({ ...s, [p.id]: e.target.value }))}
                                className="w-16 border border-sand-300 px-2 py-1 font-body text-sm focus:outline-none focus:border-blush-400" />
                              <button onClick={() => { updateStock(p.id, stockEdit[p.id]); setStockEdit(s => { const n = { ...s }; delete n[p.id]; return n; }); }} className="text-green-600 hover:text-green-700"><Save size={14} /></button>
                              <button onClick={() => setStockEdit(s => { const n = { ...s }; delete n[p.id]; return n; })} className="text-charcoal-700/40 hover:text-charcoal-700"><X size={14} /></button>
                            </div>
                          ) : (
                            <button onClick={() => setStockEdit(s => ({ ...s, [p.id]: getStock(p.id) }))}
                              className={`flex items-center gap-1 font-body text-sm font-medium group ${getStock(p.id) <= 3 ? 'text-orange-500' : 'text-green-600'}`}>
                              {getStock(p.id)}
                              <Edit3 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-amber-500">
                          {'★'.repeat(Math.round(p.rating))} <span className="text-charcoal-700/40 text-xs">{p.rating}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => navigate(`/products/${p.id}`)} className="p-1.5 text-charcoal-700/40 hover:text-blush-500 transition-colors" title="View">
                              <Eye size={15} />
                            </button>
                            {deleteConfirm === p.id ? (
                              <div className="flex items-center gap-1">
                                <span className="font-body text-xs text-orange-500">Delete?</span>
                                <button onClick={() => { deleteProduct(p.id); setDeleteConfirm(null); }} className="font-body text-xs text-red-500 hover:text-red-600 font-medium">Yes</button>
                                <button onClick={() => setDeleteConfirm(null)} className="font-body text-xs text-charcoal-700/40">No</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 text-charcoal-700/40 hover:text-red-500 transition-colors" title="Delete">
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
            <div className="mb-8 pt-2">
              <h1 className="font-display text-3xl text-charcoal-800 font-light italic">Add New Product</h1>
              <p className="font-body text-sm text-charcoal-700/50 mt-1">Fill in the details to add a new item to the store.</p>
            </div>
            {saved && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-6 font-body">
                ✓ Product added successfully!
              </div>
            )}
            <div className="bg-white border border-sand-200 p-6 md:p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Product Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder="e.g. Luna Dress — Sage" />
                  {formErrors.name && <p className="font-body text-xs text-blush-500 mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Category *</label>
                  <div className="relative">
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field appearance-none pr-8">
                      {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-700/40" />
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Price (₦) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-field" placeholder="e.g. 45000" />
                  {formErrors.price && <p className="font-body text-xs text-blush-500 mt-1">{formErrors.price}</p>}
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Original Price (₦) — Optional</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} className="input-field" placeholder="Leave blank if no sale" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Description *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="input-field resize-none" placeholder="Describe the product — fabric, fit, occasions..." />
                {formErrors.description && <p className="font-body text-xs text-blush-500 mt-1">{formErrors.description}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Colors * <span className="normal-case tracking-normal text-charcoal-700/40">(comma-separated)</span></label>
                  <input value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} className="input-field" placeholder="Sage, Blush, Navy" />
                  {formErrors.colors && <p className="font-body text-xs text-blush-500 mt-1">{formErrors.colors}</p>}
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Sizes * <span className="normal-case tracking-normal text-charcoal-700/40">(comma-separated)</span></label>
                  <input value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} className="input-field" placeholder="S, M, L, XL" />
                  {formErrors.sizes && <p className="font-body text-xs text-blush-500 mt-1">{formErrors.sizes}</p>}
                </div>
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Image URLs * <span className="normal-case tracking-normal text-charcoal-700/40">(at least 1)</span></label>
                <div className="space-y-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={img} onChange={e => setForm(f => { const imgs = [...f.images]; imgs[i] = e.target.value; return { ...f, images: imgs }; })} className="input-field flex-1" placeholder={`Image ${i + 1} URL — e.g. /images/my-dress.jpg`} />
                      {img && <img src={img} alt="" className="w-10 h-12 object-cover bg-sand-100 shrink-0" onError={e => { e.target.style.opacity = 0; }} />}
                    </div>
                  ))}
                </div>
                {formErrors.image0 && <p className="font-body text-xs text-blush-500 mt-1">{formErrors.image0}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Badge <span className="normal-case tracking-normal text-charcoal-700/40">(optional)</span></label>
                  <div className="relative">
                    <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} className="input-field appearance-none pr-8">
                      <option value="">None</option>
                      {['New', 'Sale', 'Bestseller', 'Luxury', 'Bridal'].map(b => <option key={b}>{b}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-700/40" />
                  </div>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer pb-3">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-blush-500 w-4 h-4" />
                    <div>
                      <span className="font-body text-sm font-medium text-charcoal-800 block">Feature on Homepage</span>
                      <span className="font-body text-xs text-charcoal-700/50">Show in featured carousel</span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-sand-100">
                <button onClick={handleAddProduct} disabled={saving} className="btn-blush flex items-center gap-2 disabled:opacity-50">
                  {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><PlusCircle size={16} /> Add Product to Store</>}
                </button>
                <button onClick={() => setForm(emptyForm)} className="btn-outline flex items-center gap-2 text-sm py-2.5">
                  <RefreshCw size={14} /> Reset Form
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === 'Orders' && (
          <div>
            <div className="mb-8 pt-2">
              <h1 className="font-display text-3xl text-charcoal-800 font-light italic">Orders</h1>
              <p className="font-body text-sm text-charcoal-700/50 mt-1">{orders.length} total orders · {pendingOrders} pending</p>
            </div>
            <div className="bg-white border border-sand-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sand-50 border-b border-sand-200">
                    <tr>
                      {['Customer', 'Items', 'Total', 'Status', 'Date', 'Update'].map(h => (
                        <th key={h} className="text-left font-body text-xs tracking-widest uppercase text-charcoal-700/50 px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16 font-body text-charcoal-700/40 text-sm">
                          No orders yet — they will appear here when customers checkout
                        </td>
                      </tr>
                    ) : orders.map(order => (
                      <tr key={order.id} className="hover:bg-sand-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-body text-sm font-medium text-charcoal-800">{order.customerName}</p>
                          <p className="font-body text-xs text-charcoal-700/50">{order.email}</p>
                          <p className="font-body text-xs text-charcoal-700/50">{order.city}</p>
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-charcoal-700/70">
                          {Array.isArray(order.items) ? order.items.length : '—'} items
                        </td>
                        <td className="px-4 py-3 font-body text-sm font-medium text-charcoal-800">
                          {`₦${Number(order.total).toLocaleString('en-NG')}`}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-body text-xs px-2 py-1 font-medium ${
                            order.status === 'delivered'  ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped'    ? 'bg-blue-100 text-blue-700' :
                            order.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'cancelled'  ? 'bg-red-100 text-red-600' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-body text-xs text-charcoal-700/50">
                          {new Date(order.created).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <select value={order.status} onChange={e => changeOrderStatus(order.id, e.target.value)}
                            className="font-body text-xs border border-sand-200 px-2 py-1.5 focus:outline-none focus:border-blush-400 bg-white">
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
