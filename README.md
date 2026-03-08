# 👗 Nura Bahar — Nigerian Women's Fashion Store

A fully functional, modern e-commerce web application for **Nura Bahar Nigeria** (nura_bahar.ng), built with **React.js + Vite + TailwindCSS**. Uses the real brand logo font (Great Vibes + Cormorant Garamond) and all real product images — cleaned and enhanced from the brand's Instagram.

---

## 🛍️ Features

### Pages
- **Home** — Auto-advancing hero, featured products carousel, category grid, brand story, testimonials
- **Products** — Grid with filtering by category (Boubous, Gowns, Ankara, Perfumes), sort, price range, search
- **Product Detail** — Image gallery, size/color selector, quantity, reviews, related products
- **Cart** — Cart management with ₦ pricing, free delivery threshold indicator
- **Checkout** — 2-step (shipping → payment) with Nigeria-localised form, validation, success screen
- **FAQ** — Nigeria-relevant FAQ: Kano delivery, Paystack payments, WhatsApp returns, size guide

### Brand Identity
- 🖋️ **Great Vibes** script font for the NuraBahar logo (matches real brand)
- 📐 **Cormorant Garamond** for display headings (matches brand aesthetic)
- 💬 **DM Sans** for body text
- 🇳🇬 NGN (₦) pricing throughout
- Real product images — Instagram screenshots cleaned and enhanced

---

## 🚀 Getting Started

```bash
cd femme-boutique
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

## 💳 Payment Integration

The checkout is pre-wired for **Paystack** integration (Nigeria's leading payment gateway):

1. Sign up at [paystack.com](https://paystack.com)
2. Replace `pk_test_XXXXXXXXXXXXXXXX` in `src/pages/Checkout.jsx` with your Paystack public key
3. Install: `npm install @paystack/inline-js`
4. Initialise Paystack with `amount * 100` (kobo), email, and your public key

---

## 📁 Project Structure

```
src/
├── main.jsx
├── App.jsx
├── index.css
├── context/CartContext.jsx
├── data/
│   ├── products.js     ← 12 real Nura Bahar products
│   ├── reviews.js      ← Customer reviews
│   └── faq.js          ← Nigeria-localised FAQ
├── components/
│   ├── Navbar.jsx      ← Great Vibes script logo
│   ├── Footer.jsx
│   ├── ProductCard.jsx ← ₦ pricing
│   ├── ReviewCard.jsx
│   └── FAQItem.jsx
└── pages/
    ├── Home.jsx
    ├── Products.jsx
    ├── ProductDetail.jsx
    ├── Cart.jsx
    ├── Checkout.jsx
    └── FAQ.jsx

public/
├── images/             ← 22 cleaned & enhanced product images
│   ├── luna-dress-*.jpg
│   ├── aya-dress-*.jpg
│   ├── coral-cape-dress-*.jpg
│   └── ...
└── logo.jpg            ← NuraBahar logo
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Logo font | Great Vibes (script — matches brand) |
| Display font | Cormorant Garamond |
| Body font | DM Sans |
| Accent colour | Blush rose `#e04a4a` |
| Background | Cream `#fdfaf6` |
| Text | Charcoal `#1e1e1e` |

---

Built with ❤️ for Nura Bahar Nigeria
