import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Truck, RotateCcw, Shield, Plus, Minus, Star } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { reviews as reviewsData, defaultReviews } from '../data/reviews';
import { useCart } from '../context/CartContext';
import ReviewCard from '../components/ReviewCard';
import ProductCard from '../components/ProductCard';

function StarRating({ rating, size = 18 }) {
  return (
    <div className="flex">
      {[1,2,3,4,5].map(s => (
        <Star
          key={s}
          size={size}
          fill={s <= Math.round(rating) ? '#fbbf24' : 'none'}
          className={s <= Math.round(rating) ? 'text-amber-400' : 'text-sand-300'}
        />
      ))}
    </div>
  );
}

const colorSwatches = {
  'Ivory': '#f9f6ef', 'Sage': '#87a690', 'Blush': '#f4a8a8', 'Rose': '#f9a8a8',
  'Navy': '#1e3a5f', 'Rust': '#c1440e', 'Champagne': '#f7e7ce', 'Black': '#1e1e1e',
  'Dusty Rose': '#d4929a', 'White': '#f8f8f8', 'Ecru': '#ede8d8', 'Terracotta': '#c96a3f',
  'Cream': '#faf3e0', 'Chocolate': '#5c3d2e', 'Olive': '#7a7a45', 'Camel': '#c69c6d',
  'Cognac': '#9b4700', 'Nude': '#e8c99a', 'Oat': '#d4c5a9', 'Forest': '#3a5f3a',
  'Slate': '#607d8b', 'Gold': '#d4af37', 'Silver': '#c0c0c0', 'Charcoal': '#36454f',
  'Midnight': '#1a1a2e', 'Gold/Pearl': '#d4af37', 'Silver/Pearl': '#c0c0c0',
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProducts } = useAdmin();
  const product = allProducts.find(p => p.id === Number(id));
  const { addToCart } = useCart();

  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="font-display text-3xl text-charcoal-800 mb-4">Product not found</h2>
          <Link to="/products" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const productReviews = reviewsData[product.id] || defaultReviews;
  const avgRating = productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length;
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    let valid = true;
    if (!selectedSize && product.sizes.length > 1) { setSizeError(true); valid = false; }
    if (!selectedColor) { setColorError(true); valid = false; }
    if (!valid) return;
    addToCart(product, qty, selectedSize || product.sizes[0], selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 font-body text-sm text-charcoal-700/50">
          <Link to="/" className="hover:text-blush-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blush-500 transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-blush-500 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-charcoal-800">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-sand-100 group">
              <img
                src={product.images[imgIdx]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 font-body text-xs font-medium px-3 py-1.5 ${
                  product.badge === 'Sale' ? 'bg-blush-500 text-white' :
                  product.badge === 'New' ? 'bg-charcoal-800 text-cream-50' : 'bg-sand-300 text-charcoal-800'
                }`}>
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="absolute top-4 right-4 bg-blush-500 text-white font-body text-xs font-medium px-3 py-1.5">
                  -{discount}%
                </span>
              )}
              <button
                onClick={() => setImgIdx(i => Math.max(0, i - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setImgIdx(i => Math.min(product.images.length - 1, i + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`aspect-[3/4] overflow-hidden border-2 transition-all duration-200 ${i === imgIdx ? 'border-charcoal-800' : 'border-transparent hover:border-sand-300'}`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:pt-4">
            <span className="tag block mb-2">{product.category}</span>
            <h1 className="font-display text-3xl md:text-4xl text-charcoal-800 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <StarRating rating={avgRating} />
              <span className="font-body text-sm text-charcoal-700/60">{avgRating.toFixed(1)} ({productReviews.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-3xl font-semibold text-charcoal-800">{`₦${product.price.toLocaleString("en-NG")}`}</span>
              {product.originalPrice && (
                <>
                  <span className="font-body text-lg text-charcoal-700/40 line-through">{`₦${product.originalPrice.toLocaleString("en-NG")}`}</span>
                  <span className="bg-blush-100 text-blush-600 font-body text-sm font-medium px-2 py-0.5">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="font-body text-sm text-charcoal-700/70 leading-relaxed mb-8">{product.description}</p>

            {/* Color Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-sm font-medium text-charcoal-800">
                  Color {selectedColor && <span className="font-normal text-charcoal-700/60">— {selectedColor}</span>}
                </span>
                {colorError && <span className="font-body text-xs text-blush-500">Please select a color</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); setColorError(false); }}
                    title={color}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${selectedColor === color ? 'border-charcoal-800 scale-110' : 'border-sand-200 hover:border-sand-300'}`}
                    style={{ background: colorSwatches[color] || '#d4c5a9' }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes.length > 1 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-sm font-medium text-charcoal-800">Size</span>
                  <div className="flex items-center gap-2">
                    {sizeError && <span className="font-body text-xs text-blush-500">Please select a size</span>}
                    <Link to="/faq" className="font-body text-xs text-charcoal-700/50 hover:text-blush-500 underline transition-colors">Size guide</Link>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`w-12 h-10 border font-body text-sm transition-all duration-200 ${
                        selectedSize === size
                          ? 'bg-charcoal-800 text-cream-50 border-charcoal-800'
                          : 'bg-white border-sand-200 text-charcoal-800 hover:border-charcoal-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <span className="font-body text-sm font-medium text-charcoal-800 block mb-3">Quantity</span>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-11 h-11 border border-sand-200 flex items-center justify-center hover:bg-sand-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-14 h-11 border-y border-sand-200 flex items-center justify-center font-body font-medium text-charcoal-800">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-11 h-11 border border-sand-200 flex items-center justify-center hover:bg-sand-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-body font-medium transition-all duration-300 ${
                  added ? 'bg-green-600 text-white' : 'bg-charcoal-800 text-cream-50 hover:bg-blush-500'
                }`}
              >
                <ShoppingBag size={18} />
                {added ? '✓ Added to Cart!' : `Add to Cart — ₦${(product.price * qty).toLocaleString("en-NG")}`}
              </button>
              <button className="w-14 flex items-center justify-center border border-sand-200 hover:border-blush-400 hover:text-blush-500 transition-all duration-200">
                <Heart size={20} />
              </button>
            </div>

            <Link to="/cart" className="btn-blush w-full flex items-center justify-center gap-2 mb-8" onClick={() => { if (!added) handleAddToCart(); }}>
              Buy Now
            </Link>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-sand-200">
              {[
                { icon: Truck, label: 'Free shipping', sub: 'Free within Kano, ₦2,500 nationwide' },
                { icon: RotateCcw, label: 'Free returns', sub: 'Within 30 days' },
                { icon: Shield, label: 'Secure payment', sub: 'SSL encrypted' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon size={20} className="text-blush-500" />
                  <span className="font-body text-xs font-medium text-charcoal-800">{label}</span>
                  <span className="font-body text-xs text-charcoal-700/50">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20 pt-16 border-t border-sand-200">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="tag block mb-2">What customers say</span>
              <h2 className="section-heading">Customer Reviews</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-display text-5xl font-semibold text-charcoal-800">{avgRating.toFixed(1)}</p>
                <StarRating rating={avgRating} />
                <p className="font-body text-xs text-charcoal-700/50 mt-1">{productReviews.length} reviews</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productReviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 pt-16 border-t border-sand-200">
            <span className="tag block mb-2">You might also like</span>
            <h2 className="section-heading mb-10">Complete the Look</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
