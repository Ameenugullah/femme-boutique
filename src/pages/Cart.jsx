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
      <div className="flex items-center justify-center min-h-screen pt-24 bg-cream-50">
        <div className="max-w-md px-6 text-center">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-sand-100">
            <ShoppingBag size={40} className="text-sand-300" />
          </div>
          <h2 className="mb-3 text-3xl font-display text-charcoal-800">Your cart is empty</h2>
          <p className="mb-8 font-body text-charcoal-700/60">Discover our latest collection and find pieces you'll love.</p>
          <Link to="/products" className="inline-flex items-center gap-2 btn-primary">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-cream-50">
      <div className="px-6 py-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <span className="block mb-2 tag">Ready to checkout?</span>
          <h1 className="section-heading">Shopping Cart</h1>
          <p className="mt-1 text-sm font-body text-charcoal-700/50">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div key={item.key} className="flex gap-5 p-5 transition-shadow duration-200 bg-white border border-sand-200 hover:shadow-soft">
                {/* Image */}
                <Link to={`/products/${item.id}`} className="shrink-0">
                  <div className="w-24 h-32 overflow-hidden md:w-28 md:h-36 bg-sand-100">
                    <img src={item.images[0]} alt={item.name} className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs tracking-widest uppercase font-body text-blush-500">{item.category}</span>
                      <h3 className="font-display text-base font-semibold text-charcoal-800 mt-0.5 line-clamp-2">
                        <Link to={`/products/${item.id}`} className="transition-colors hover:text-blush-500">{item.name}</Link>
                      </h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="p-1 transition-colors text-charcoal-700/30 hover:text-blush-500 shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 mb-4">
                    {item.color && (
                      <span className="px-2 py-1 text-xs font-body text-charcoal-700/60 bg-sand-100">{item.color}</span>
                    )}
                    {item.size && item.size !== 'One Size' && (
                      <span className="px-2 py-1 text-xs font-body text-charcoal-700/60 bg-sand-100">Size: {item.size}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-0">
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="flex items-center justify-center w-8 h-8 text-xs transition-colors border border-sand-200 hover:bg-sand-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="flex items-center justify-center w-10 h-8 text-sm font-medium border-y border-sand-200 font-body">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="flex items-center justify-center w-8 h-8 text-xs transition-colors border border-sand-200 hover:bg-sand-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="font-semibold font-body text-charcoal-800">{"₦"}{(item.price * item.quantity).toLocaleString("en-NG")}</span>
                      {item.quantity > 1 && (
                       <p className="text-xs font-body text-charcoal-700/40">{`₦${item.price.toLocaleString("en-NG")} each`}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code */}
            <div className="p-5 bg-white border border-sand-200">
              <div className="flex items-center gap-3">
                <Tag size={18} className="text-blush-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 text-sm bg-transparent font-body focus:outline-none text-charcoal-800 placeholder-sand-300"
                />
                <button className="px-5 py-2 text-sm btn-outline">Apply</button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-28">
            <div className="p-6 bg-white border border-sand-200 shadow-soft">
              <h2 className="mb-6 text-xl font-display text-charcoal-800">Order Summary</h2>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-charcoal-700/70">Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                  <span className="font-medium text-charcoal-800">{"₦"}{subtotal.toLocaleString("en-NG")}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-charcoal-700/70">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-charcoal-800'}`}>
                    {shipping === 0 ? 'Free' : `${"₦"}{shipping.toLocaleString("en-NG")}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="px-3 py-2 text-xs text-green-600 font-body bg-green-50">
                    🎉 You qualify for free shipping!
                  </p>
                )}
                {shipping > 0 && (
                  <p className="px-3 py-2 text-xs font-body text-blush-500 bg-blush-50">
                    Add ₦{(20000 - subtotal).toLocaleString("en-NG")} more for free nationwide delivery
                  </p>
                )}
                <div className="flex justify-between text-sm font-body">
                  <span className="text-charcoal-700/70">Tax (8%)</span>
                  <span className="font-medium text-charcoal-800">{"₦"}{tax.toLocaleString("en-NG")}</span>
                </div>
              </div>

              <div className="pt-4 mb-6 border-t border-sand-200">
                <div className="flex justify-between text-base font-semibold font-body">
                  <span className="text-charcoal-800">Total</span>
                  <span className="text-charcoal-800">{"₦"}{total.toLocaleString("en-NG")}</span>
                </div>
              </div>

              <Link to="/checkout" className="flex items-center justify-center w-full gap-2 py-4 text-base btn-blush">
                Proceed to Checkout <ArrowRight size={18} />
              </Link>

              <Link to="/products" className="block mt-4 text-sm text-center transition-colors font-body text-charcoal-700/60 hover:text-charcoal-800">
                ← Continue Shopping
              </Link>

              {/* Trust signals */}
              <div className="pt-6 mt-6 space-y-2 border-t border-sand-200">
                {['🔒 Secure checkout with SSL', '💳 All major cards accepted', '📦 Ships within 1–2 business days'].map(t => (
                  <p key={t} className="text-xs font-body text-charcoal-700/50">{t}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
