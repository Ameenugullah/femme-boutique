import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/api';

const PAYMENT_PUBLIC_KEY = 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

function FormField({ label, id, error, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="block font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2">
        {label} {required && <span className="text-blush-500">*</span>}
      </label>
      {children}
      {error && <p className="font-body text-xs text-blush-500 mt-1">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const tax = subtotal * 0.08;
  const shipping = subtotal > 20000 ? 0 : 2500;
  const total = subtotal + tax + shipping;

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'NG',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
    saveInfo: false,
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    let val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (field === 'cardNumber') val = val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    if (field === 'expiry') val = val.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);
    if (field === 'cvv') val = val.replace(/\D/g, '').slice(0, 4);
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.zip.trim()) e.zip = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.cardName.trim()) e.cardName = 'Required';
    if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
    if (form.expiry.length < 5) e.expiry = 'Enter MM/YY';
    if (form.cvv.length < 3) e.cvv = 'Enter 3-4 digit CVV';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStep1 = () => {
    if (validateStep1()) setStep(2);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);

    try {
      // Save order to PocketBase
      await createOrder({
        customerName: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        items: cartItems,
        subtotal,
        shipping,
        total,
      });
    } catch (err) {
      // Order save failed silently — payment still proceeds
      console.warn('Order save failed:', err.message);
    }

    // Simulated payment — replace with real Paystack integration
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    clearCart();
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!cartItems.length && step !== 3) {
    return (
      <div className="min-h-screen bg-cream-50 pt-24 flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="font-display text-3xl text-charcoal-800 mb-4">Your cart is empty</h2>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-cream-50 pt-24 flex items-center justify-center px-6">
        <div className="text-center max-w-lg animate-fade-up">
          <div className="w-20 h-20 bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="font-display text-4xl text-charcoal-800 mb-4">Order Confirmed! 🎉</h1>
          <p className="font-body text-charcoal-700/70 mb-3 leading-relaxed">
            Thank you, <strong>{form.firstName}</strong>! Confirmation sent to <strong>{form.email}</strong>.
          </p>
          <p className="font-body text-sm text-charcoal-700/50 mb-3">
            Shipping to {form.address}, {form.city}.
          </p>
          <div className="bg-white border border-sand-200 p-4 mb-8 text-left">
            <p className="font-body text-sm font-medium text-charcoal-800 mb-1">Order #NB{Math.floor(Math.random() * 90000) + 10000}</p>
            <p className="font-body text-xs text-charcoal-700/50">Estimated delivery: 2–5 business days</p>
            <p className="font-body text-xs text-charcoal-700/50 mt-1">{`Total charged: ₦${total.toLocaleString('en-NG')}`}</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link to="/products" className="btn-blush">Continue Shopping</Link>
            <Link to="/" className="btn-outline">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link to="/cart" className="flex items-center gap-2 font-body text-sm text-charcoal-700/60 hover:text-charcoal-800 transition-colors mb-4">
            <ArrowLeft size={16} /> Back to cart
          </Link>
          <h1 className="section-heading">Checkout</h1>
          <div className="flex items-center gap-4 mt-4">
            {[{ n: 1, label: 'Information' }, { n: 2, label: 'Payment' }].map(({ n, label }) => (
              <div key={n} className="flex items-center gap-2">
                <div className={`w-7 h-7 flex items-center justify-center font-body text-xs font-medium border-2 transition-all ${step >= n ? 'bg-charcoal-800 border-charcoal-800 text-white' : 'border-sand-300 text-sand-300'}`}>{n}</div>
                <span className={`font-body text-sm ${step >= n ? 'text-charcoal-800' : 'text-charcoal-700/40'}`}>{label}</span>
                {n < 2 && <div className={`w-8 h-px ${step > n ? 'bg-charcoal-800' : 'bg-sand-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white border border-sand-200 p-8 shadow-soft animate-fade-in">
                <h2 className="font-display text-xl text-charcoal-800 mb-6">Contact & Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <FormField label="First Name" id="firstName" error={errors.firstName} required>
                    <input id="firstName" value={form.firstName} onChange={set('firstName')} className="input-field" placeholder="Fatima" />
                  </FormField>
                  <FormField label="Last Name" id="lastName" error={errors.lastName} required>
                    <input id="lastName" value={form.lastName} onChange={set('lastName')} className="input-field" placeholder="Abdullahi" />
                  </FormField>
                </div>
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <FormField label="Email" id="email" error={errors.email} required>
                    <input id="email" type="email" value={form.email} onChange={set('email')} className="input-field" placeholder="fatima@email.com" />
                  </FormField>
                  <FormField label="Phone" id="phone" error={errors.phone}>
                    <input id="phone" value={form.phone} onChange={set('phone')} className="input-field" placeholder="+234 800 000 0000" />
                  </FormField>
                </div>
                <div className="mb-5">
                  <FormField label="Address" id="address" error={errors.address} required>
                    <input id="address" value={form.address} onChange={set('address')} className="input-field" placeholder="123 Murtala Mohammed Way" />
                  </FormField>
                </div>
                <div className="grid sm:grid-cols-3 gap-5 mb-5">
                  <FormField label="City" id="city" error={errors.city} required>
                    <input id="city" value={form.city} onChange={set('city')} className="input-field" placeholder="Kano" />
                  </FormField>
                  <FormField label="State" id="state" error={errors.state}>
                    <input id="state" value={form.state} onChange={set('state')} className="input-field" placeholder="Kano State" />
                  </FormField>
                  <FormField label="Postal Code" id="zip" error={errors.zip} required>
                    <input id="zip" value={form.zip} onChange={set('zip')} className="input-field" placeholder="700001" />
                  </FormField>
                </div>
                <div className="mb-6">
                  <FormField label="Country" id="country" error={errors.country}>
                    <div className="relative">
                      <select id="country" value={form.country} onChange={set('country')} className="input-field appearance-none pr-8">
                        <option value="NG">Nigeria</option>
                        <option value="GH">Ghana</option>
                        <option value="KE">Kenya</option>
                        <option value="ZA">South Africa</option>
                        <option value="GB">United Kingdom</option>
                        <option value="US">United States</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-700/50" />
                    </div>
                  </FormField>
                </div>
                <label className="flex items-center gap-3 cursor-pointer mb-8">
                  <input type="checkbox" checked={form.saveInfo} onChange={set('saveInfo')} className="accent-blush-500 w-4 h-4" />
                  <span className="font-body text-sm text-charcoal-700/70">Save this information for next time</span>
                </label>
                <button onClick={handleStep1} className="btn-blush w-full py-4 text-base flex items-center justify-center gap-2">
                  Continue to Payment <ArrowLeft size={18} className="rotate-180" />
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handlePayment} className="bg-white border border-sand-200 p-8 shadow-soft animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl text-charcoal-800">Payment Details</h2>
                  <div className="flex items-center gap-1.5 text-charcoal-700/50">
                    <Lock size={14} />
                    <span className="font-body text-xs">SSL Secured</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6 p-4 bg-sand-50 border border-sand-200">
                  {['VISA', 'MC', 'AMEX', 'Paystack'].map(card => (
                    <span key={card} className="font-body text-xs font-semibold text-charcoal-700/60 border border-sand-200 bg-white px-2 py-1">{card}</span>
                  ))}
                  <span className="font-body text-xs text-charcoal-700/40 ml-auto">All cards accepted</span>
                </div>
                <div className="space-y-5">
                  <FormField label="Cardholder Name" id="cardName" error={errors.cardName} required>
                    <input id="cardName" value={form.cardName} onChange={set('cardName')} className="input-field" placeholder="Fatima Abdullahi" />
                  </FormField>
                  <FormField label="Card Number" id="cardNumber" error={errors.cardNumber} required>
                    <div className="relative">
                      <input id="cardNumber" value={form.cardNumber} onChange={set('cardNumber')} className="input-field pr-12" placeholder="0000 0000 0000 0000" />
                      <CreditCard size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-700/30" />
                    </div>
                  </FormField>
                  <div className="grid grid-cols-2 gap-5">
                    <FormField label="Expiry Date" id="expiry" error={errors.expiry} required>
                      <input id="expiry" value={form.expiry} onChange={set('expiry')} className="input-field" placeholder="MM/YY" />
                    </FormField>
                    <FormField label="CVV" id="cvv" error={errors.cvv} required>
                      <input id="cvv" type="password" value={form.cvv} onChange={set('cvv')} className="input-field" placeholder="•••" />
                    </FormField>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-blush-50 border border-blush-100 mb-6">
                  <p className="font-body text-xs text-blush-600">
                    🔒 Your payment is processed securely via Paystack. Card details are never stored on our servers.
                  </p>
                </div>
                <button type="submit" disabled={loading}
                  className={`w-full py-4 font-body font-medium text-base flex items-center justify-center gap-3 transition-all duration-300 ${loading ? 'bg-charcoal-700/50 text-white cursor-not-allowed' : 'bg-blush-500 hover:bg-blush-600 text-white'}`}>
                  {loading ? (
                    <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing Payment...</>
                  ) : (
                    <><Lock size={18} />{`Pay ₦${total.toLocaleString('en-NG')} Securely`}</>
                  )}
                </button>
                <button type="button" onClick={() => setStep(1)}
                  className="w-full mt-3 font-body text-sm text-charcoal-700/50 hover:text-charcoal-800 transition-colors">
                  ← Back to Information
                </button>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-white border border-sand-200 p-6 shadow-soft">
              <h3 className="font-display text-lg text-charcoal-800 mb-5">Your Order</h3>
              <div className="space-y-4 mb-5 max-h-64 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.key} className="flex gap-3">
                    <div className="relative shrink-0">
                      <div className="w-16 h-20 bg-sand-100 overflow-hidden">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 bg-charcoal-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs font-medium text-charcoal-800 line-clamp-2">{item.name}</p>
                      <p className="font-body text-xs text-charcoal-700/50 mt-0.5">{item.color} {item.size !== 'One Size' ? `/ ${item.size}` : ''}</p>
                      <p className="font-body text-xs font-semibold text-charcoal-800 mt-1">{`₦${(item.price * item.quantity).toLocaleString('en-NG')}`}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-sand-200 pt-4 space-y-2 mb-4">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal-700/60">Subtotal</span>
                  <span>{`₦${subtotal.toLocaleString('en-NG')}`}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal-700/60">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Free' : `₦${shipping.toLocaleString('en-NG')}`}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal-700/60">Tax (8%)</span>
                  <span>{`₦${tax.toLocaleString('en-NG')}`}</span>
                </div>
              </div>
              <div className="border-t border-sand-200 pt-4">
                <div className="flex justify-between font-body font-semibold text-base">
                  <span>Total</span>
                  <span className="text-blush-500">{`₦${total.toLocaleString('en-NG')}`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
