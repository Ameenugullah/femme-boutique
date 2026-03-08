import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...products];
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
  }, [activeCategory, sortBy, priceRange, searchQuery]);

  return (
    <div className="min-h-screen bg-cream-50 pt-24">
      {/* Page Header */}
      <div className="bg-sand-100 border-b border-sand-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="tag block mb-2">Discover your style</span>
          <h1 className="section-heading">
            {searchQuery ? `Results for "${searchQuery}"` : activeCategory === 'All' ? 'All Products' : activeCategory}
          </h1>
          <p className="font-body text-sm text-charcoal-700/60 mt-2">{filtered.length} pieces</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchParams(cat !== 'All' ? { category: cat } : {});
                }}
                className={`font-body text-sm px-4 py-2 transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-charcoal-800 text-cream-50'
                    : 'bg-white border border-sand-200 text-charcoal-700 hover:border-charcoal-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Filter */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 font-body text-sm border border-sand-200 bg-white px-4 py-2 hover:border-charcoal-700 transition-colors"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="font-body text-sm border border-sand-200 bg-white px-4 py-2 pr-8 hover:border-charcoal-700 transition-colors appearance-none cursor-pointer focus:outline-none"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-700/60" />
            </div>
          </div>
        </div>

        {/* Expanded Filters Panel */}
        {filtersOpen && (
          <div className="bg-white border border-sand-200 p-6 mb-8 animate-fade-in shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-body font-medium text-charcoal-800">Filter Options</h3>
              <button onClick={() => setFiltersOpen(false)} className="text-charcoal-700/50 hover:text-charcoal-800">
                <X size={18} />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-3 block">
                  Price Range: ${priceRange[0]} — ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={10}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-blush-500"
                />
                <div className="flex justify-between font-body text-xs text-charcoal-700/50 mt-1">
                  <span>$0</span><span>$500</span>
                </div>
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-3 block">Quick Filters</label>
                <div className="flex flex-wrap gap-2">
                  {['On Sale', 'New Arrivals', 'Under $100', 'Over $150'].map(tag => (
                    <button key={tag} className="font-body text-xs border border-sand-200 px-3 py-1.5 hover:bg-blush-100 hover:border-blush-300 hover:text-blush-600 transition-all">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {(activeCategory !== 'All' || searchQuery) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeCategory !== 'All' && (
              <span className="flex items-center gap-1.5 bg-blush-100 text-blush-600 font-body text-xs px-3 py-1.5">
                {activeCategory}
                <button onClick={() => { setActiveCategory('All'); setSearchParams({}); }}>
                  <X size={12} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="flex items-center gap-1.5 bg-blush-100 text-blush-600 font-body text-xs px-3 py-1.5">
                "{searchQuery}"
                <button onClick={() => setSearchParams({})}>
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-charcoal-700/40 mb-4">No products found</p>
            <p className="font-body text-sm text-charcoal-700/30 mb-6">Try adjusting your filters or search term</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchParams({}); setPriceRange([0, 500]); }}
              className="btn-outline"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
