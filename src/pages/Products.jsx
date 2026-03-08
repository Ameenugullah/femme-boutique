import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useAdmin } from '../context/AdminContext';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const MAX_PRICE = 200000;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchQuery = searchParams.get('search') || '';
  const { allProducts } = useAdmin();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    let list = [...allProducts];
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory);
    if (searchQuery) list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return list;
  }, [activeCategory, sortBy, priceRange, searchQuery, allProducts]);

  return (
    <div className="min-h-screen pt-24 bg-cream-50">
      <div className="px-6 py-12 border-b bg-sand-100 border-sand-200">
        <div className="mx-auto max-w-7xl">
          <span className="block mb-2 tag">Discover your style</span>
          <h1 className="italic font-light section-heading">
            {searchQuery ? `Results for "${searchQuery}"` : activeCategory === 'All' ? 'All Products' : activeCategory}
          </h1>
          <p className="mt-2 text-sm font-body text-charcoal-700/60">{filtered.length} pieces</p>
        </div>
      </div>

      <div className="px-6 py-10 mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat}
                onClick={() => { setActiveCategory(cat); setSearchParams(cat !== 'All' ? { category: cat } : {}); }}
                className={`font-body text-sm px-4 py-2 transition-all duration-200 ${activeCategory === cat ? 'bg-charcoal-800 text-cream-50' : 'bg-white border border-sand-200 text-charcoal-700 hover:border-charcoal-700'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center self-end gap-3 sm:self-auto">
            <button onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm transition-colors bg-white border font-body border-sand-200 hover:border-charcoal-700">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="px-4 py-2 pr-8 text-sm bg-white border appearance-none cursor-pointer font-body border-sand-200 hover:border-charcoal-700 focus:outline-none">
                {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute -translate-y-1/2 pointer-events-none right-2 top-1/2 text-charcoal-700/60" />
            </div>
          </div>
        </div>

        {filtersOpen && (
          <div className="p-6 mb-8 bg-white border border-sand-200 shadow-soft animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium font-body text-charcoal-800">Price Range</h3>
              <button onClick={() => setFiltersOpen(false)}><X size={18} className="text-charcoal-700/50" /></button>
            </div>
            <label className="block mb-3 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
              {`₦${priceRange[0].toLocaleString('en-NG')} — ₦${priceRange[1].toLocaleString('en-NG')}`}
            </label>
            <input type="range" min={0} max={MAX_PRICE} step={1000} value={priceRange[1]}
              onChange={e => setPriceRange([0, Number(e.target.value)])}
              className="w-full accent-blush-500" />
            <div className="flex justify-between mt-1 text-xs font-body text-charcoal-700/50">
              <span>₦0</span><span>{`₦${MAX_PRICE.toLocaleString('en-NG')}`}</span>
            </div>
          </div>
        )}

        {(activeCategory !== 'All' || searchQuery) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeCategory !== 'All' && (
              <span className="flex items-center gap-1.5 bg-blush-100 text-blush-600 font-body text-xs px-3 py-1.5">
                {activeCategory}
                <button onClick={() => { setActiveCategory('All'); setSearchParams({}); }}><X size={12} /></button>
              </span>
            )}
            {searchQuery && (
              <span className="flex items-center gap-1.5 bg-blush-100 text-blush-600 font-body text-xs px-3 py-1.5">
                "{searchQuery}"
                <button onClick={() => setSearchParams({})}><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="mb-4 text-2xl font-display text-charcoal-700/40">No products found</p>
            <p className="mb-6 text-sm font-body text-charcoal-700/30">Try adjusting your filters or search term</p>
            <button onClick={() => { setActiveCategory('All'); setSearchParams({}); setPriceRange([0, MAX_PRICE]); }}
              className="btn-outline">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}