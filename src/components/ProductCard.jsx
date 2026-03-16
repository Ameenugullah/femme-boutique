import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const [isWished, setIsWished] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1, product.sizes[1] || product.sizes[0], product.colors[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-card group relative bg-white shadow-card hover:shadow-medium transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-sand-100">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-card-image w-full h-full object-cover"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`font-body text-xs font-medium px-2.5 py-1 tracking-wide ${
              product.badge === 'Sale' ? 'bg-blush-500 text-white' :
              product.badge === 'New' ? 'bg-charcoal-800 text-cream-50' :
              'bg-sand-300 text-charcoal-800'
            }`}>
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="bg-blush-500 text-white font-body text-xs font-medium px-2.5 py-1">
              -{discount}%
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsWished(!isWished)}
            className={`w-9 h-9 flex items-center justify-center bg-white shadow-soft transition-colors duration-200 ${isWished ? 'text-blush-500' : 'text-charcoal-700 hover:text-blush-500'}`}
            aria-label="Add to wishlist"
          >
            <Heart size={16} fill={isWished ? 'currentColor' : 'none'} />
          </button>
          <Link
            to={`/products/${product.id}`}
            className="w-9 h-9 flex items-center justify-center bg-white shadow-soft text-charcoal-700 hover:text-blush-500 transition-colors duration-200"
            aria-label="Quick view"
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Quick Add — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 font-body text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-colors duration-200 ${
              added ? 'bg-green-600 text-white' : 'bg-charcoal-800 text-cream-50 hover:bg-blush-500'
            }`}
          >
            <ShoppingBag size={16} />
            {added ? 'Added!' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <p className="font-body text-xs text-blush-500 tracking-widest uppercase mb-1">{product.category}</p>
          <h3 className="font-display text-base font-semibold text-charcoal-800 hover:text-blush-500 transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5 mb-2">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <span key={s} className={`text-xs ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-sand-300'}`}>★</span>
            ))}
          </div>
          <span className="font-body text-xs text-charcoal-700/50">({product.reviews})</span>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 mb-3">
          {product.colors.slice(0, 4).map(color => (
            <div
              key={color}
              title={color}
              className="w-3.5 h-3.5 rounded-full border border-sand-200"
              style={{ background: getColorSwatch(color) }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="font-body text-xs text-charcoal-700/50">+{product.colors.length - 4}</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-body font-semibold text-charcoal-800">₦{product.price.toLocaleString('en-NG')}</span>
          {product.originalPrice && (
            <span className="font-body text-sm text-charcoal-700/40 line-through">₦{product.originalPrice.toLocaleString('en-NG')}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function getColorSwatch(color) {
  const swatches = {
    'Ivory': '#f9f6ef', 'Sage': '#87a690', 'Blush': '#f4a8a8', 'Rose': '#f9a8a8',
    'Navy': '#1e3a5f', 'Rust': '#c1440e', 'Champagne': '#f7e7ce', 'Black': '#1e1e1e',
    'Dusty Rose': '#d4929a', 'White': '#f8f8f8', 'Ecru': '#ede8d8', 'Terracotta': '#c96a3f',
    'Cream': '#faf3e0', 'Chocolate': '#5c3d2e', 'Olive': '#7a7a45', 'Camel': '#c69c6d',
    'Cognac': '#9b4700', 'Nude': '#e8c99a', 'Oat': '#d4c5a9', 'Forest': '#3a5f3a',
    'Slate': '#607d8b', 'Gold': '#d4af37', 'Silver': '#c0c0c0', 'Charcoal': '#36454f',
    'Midnight': '#1a1a2e', 'Gold/Pearl': '#d4af37', 'Silver/Pearl': '#c0c0c0',
  };
  return swatches[color] || '#d4c5a9';
}
