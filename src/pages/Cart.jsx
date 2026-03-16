import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 20000 ? 0 : 2500;
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 pt-24 flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="w-24 h-24 bg-sand-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-sand-300" />
          </div>
          <h2 className="font-display text-3xl text-charcoal-800 mb-3">Your cart is empty</h2>
          <p className="font-body text-charcoal-700/60 mb-8">Discover our latest collection and find pieces you'll love.</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-24">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <span className="tag block mb-2">Ready to checkout?</span>
          <h1 className="section-heading">Shopping Cart</h1>
          <p className="font-body text-sm text-charcoal-700/50 mt-1">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.key} className="bg-white border border-sand-200 p-5 flex gap-5 hover:shadow-soft transition-shadow duration-200">
                {/* Image */}
                <Link to={`/products/${item.id}`} className="shrink-0">
                  <div className="w-24 h-32 md:w-28 md:h-36 overflow-hidden bg-sand-100">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-body text-xs text-blush-500 tracking-widest uppercase">{item.category}</span>
                      <h3 className="font-display text-base font-semibold text-charcoal-800 mt-0.5 line-clamp-2">
                        <Link to={`/products/${item.id}`} className="hover:text-blush-500 transition-colors">{item.name}</Link>
                      </h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-charcoal-700/30 hover:text-blush-500 transition-colors p-1 shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 mb-4">
                    {item.color && (
                      <span className="font-body text-xs text-charcoal-700/60 bg-sand-100 px-2 py-1">{item.color}</span>
                    )}
                    {item.size && item.size !== 'One Size' && (
                      <span className="font-body text-xs text-charcoal-700/60 bg-sand-100 px-2 py-1">Size: {item.size}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-0">
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="w-8 h-8 border border-sand-200 flex items-center justify-center hover:bg-sand-100 transition-colors text-xs"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 h-8 border-y border-sand-200 flex items-center justify-center font-body text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="w-8 h-8 border border-sand-200 flex items-center justify-center hover:bg-sand-100 transition-colors text-xs"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="font-body font-semibold text-charcoal-800">{"₦"}{(item.price * item.quantity).toLocaleString("en-NG")}</span>
                      {item.quantity > 1 && (
                        <p className="font-body text-xs text-charcoal-700/40">{`₦${item.price.toLocaleString("en-NG")} each`}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code */}
            <div className="bg-white border border-sand-200 p-5">
              <div className="flex items-center gap-3">
                <Tag size={18} className="text-blush-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 font-body text-sm bg-transparent focus:outline-none text-charcoal-800 placeholder-sand-300"
                />
                <button className="btn-outline py-2 px-5 text-sm">Apply</button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-white border border-sand-200 p-6 shadow-soft">
              <h2 className="font-display text-xl text-charcoal-800 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal-700/70">Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                  <span className="text-charcoal-800 font-medium">{"₦"}{subtotal.toLocaleString("en-NG")}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal-700/70">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-charcoal-800'}`}>
                    {shipping === 0 ? 'Free' : `₦${shipping.toLocaleString('en-NG')}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="font-body text-xs text-green-600 bg-green-50 px-3 py-2">
                    🎉 You qualify for free shipping!
                  </p>
                )}
                {shipping > 0 && (
                  <p className="font-body text-xs text-blush-500 bg-blush-50 px-3 py-2">
                    Add ₦{(20000 - subtotal).toLocaleString("en-NG")} more for free nationwide delivery
                  </p>
                )}
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal-700/70">Tax (8%)</span>
                  <span className="text-charcoal-800 font-medium">{"₦"}{tax.toLocaleString("en-NG")}</span>
                </div>
              </div>

              <div className="border-t border-sand-200 pt-4 mb-6">
                <div className="flex justify-between font-body font-semibold text-base">
                  <span className="text-charcoal-800">Total</span>
                  <span className="text-charcoal-800">{"₦"}{total.toLocaleString("en-NG")}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-blush w-full flex items-center justify-center gap-2 py-4 text-base">
                Proceed to Checkout <ArrowRight size={18} />
              </Link>

              <Link to="/products" className="block text-center font-body text-sm text-charcoal-700/60 hover:text-charcoal-800 mt-4 transition-colors">
                ← Continue Shopping
              </Link>

              {/* Trust signals */}
              <div className="mt-6 pt-6 border-t border-sand-200 space-y-2">
                {['🔒 Secure checkout with SSL', '💳 All major cards accepted', '📦 Ships within 1–2 business days'].map(t => (
                  <p key={t} className="font-body text-xs text-charcoal-700/50">{t}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
