# 👗 Nura Bahar — Nigerian Women's Fashion Store

A fully functional, modern e-commerce web application for **Nura Bahar Nigeria** (nura_bahar.ng), built with **React.js + Vite + TailwindCSS**. Includes a complete orders management system for admin users. Uses the real brand logo font (Great Vibes + Cormorant Garamond) and all real product images — cleaned and enhanced from the brand's Instagram.

---

## 🛍️ Features

### Customer Pages

- **Home** — Auto-advancing hero, featured products carousel, category grid, brand story, testimonials
- **Products** — Grid with filtering by category (Boubous, Gowns, Ankara, Perfumes), sort, price range, search
- **Product Detail** — Image gallery, size/color selector, quantity, reviews, related products
- **Cart** — Cart management with ₦ pricing, free delivery threshold indicator
- **Checkout** — 2-step (shipping → payment) with Nigeria-localised form, validation, success screen
- **FAQ** — Nigeria-relevant FAQ: Kano delivery, Paystack payments, WhatsApp returns, size guide

### Admin Dashboard

- **Overview** — Store statistics, product metrics, low stock alerts
- **Products Management** — Add, edit, delete products with images, pricing, inventory
- **Orders Management** — Complete order tracking and management system (see below)

### 📦 Orders Management System

A comprehensive orders dashboard with real-time notifications:

#### Features

- ✅ **Real-time Order Notifications** — Toast alerts when new orders arrive
- ✅ **Notification Bell** — Badge showing unread order count with dropdown preview
- ✅ **Orders Dashboard** — Full order management page with:
  - Stats cards (Total, Pending, Processing, Delivered counts)
  - Real-time notification system
  - Search by Order ID, Customer Name, Phone, or Product
  - Filter by Status (Pending, Processing, Delivered, All)
  - Responsive table on desktop, card layout on mobile
- ✅ **Order Details Modal** — View complete order information:
  - Customer details (name, phone, email)
  - Delivery address and order date/time
  - Ordered products with quantities
  - Total amount
  - Order notes
  - Status management (mark as Processing, mark as Delivered)
- ✅ **Status Management** — Color-coded order statuses:
  - 🟠 Pending (amber)
  - 🔵 Processing (blue)
  - 🟢 Delivered (green)
- ✅ **Responsive Design** — Works seamlessly on mobile, tablet, and desktop

### Brand Identity

- 🖋️ **Great Vibes** script font for the NuraBahar logo (matches real brand)
- 📐 **Cormorant Garamond** for display headings (matches brand aesthetic)
- 💬 **DM Sans** for body text
- 🇳🇬 NGN (₦) pricing throughout
- Real product images — Instagram screenshots cleaned and enhanced

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
cd femme-boutique
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Admin Dashboard Access

Navigate to `/admin` and log in with:

- **Email:** `admin@nurabahar.ng`
- **Password:** `NuraBahar2025!`

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
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── ReviewCard.jsx
│   ├── FAQItem.jsx
│   ├── NotificationBell.jsx
│   ├── OrdersTable.jsx
│   └── OrderDetailsModal.jsx
├── context/
│   ├── AdminContext.jsx
│   ├── CartContext.jsx
│   └── OrderContext.jsx
├── data/
│   ├── products.js
│   ├── reviews.js
│   └── faq.js
├── pages/
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── FAQ.jsx
│   ├── AdminDashboard.jsx
│   └── Orders.jsx
├── App.jsx
├── index.css
└── main.jsx
```

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18.2.0
- **Build Tool:** Vite 7.3.1
- **Styling:** TailwindCSS 3.4.1
- **Routing:** React Router DOM 6.22.0
- **Icons:** Lucide React 0.263.1
- **Animations:** Framer Motion 11.0.0
- **State Management:** React Context API

---

## 🎨 Color Scheme

```text
Primary Colors:
- Blush: #E8A8A8 (rose/pink accent)
- Sand: #E8D5C4 (warm neutral background)
- Charcoal: #3D3C3A (dark text/elements)

Semantic Colors:
- Green: #10B981 (success, delivered)
- Blue: #3B82F6 (info, processing)
- Amber: #F59E0B (warning, pending)
```

---

## 📊 Orders Management Data Structure

Each order contains:

```javascript
{
  id: "ORD-00001",
  customerName: "Customer Name",
  phone: "+234...",
  email: "customer@example.com",
  product: "Product Name",
  quantity: 1,
  deliveryAddress: "Full Address",
  orderDate: "2024-03-13T...",
  status: "Pending|Processing|Delivered",
  isRead: false,
  notes: "Special instructions",
  totalAmount: 50000
}
```

---

## 🔐 Admin Features

### Login Credentials

```text
Email: admin@nurabahar.ng
Password: NuraBahar2025!
```

### Dashboard Tabs

1. **Overview Tab** — View store statistics and metrics
2. **Products Tab** — Browse and manage product inventory
3. **Add Product Tab** — Create new products with images and details
4. **Orders Tab** — Manage all customer orders with real-time notifications

---

## 🚀 Features Implemented

### E-Commerce Functionality

- ✅ Product browsing and filtering
- ✅ Advanced search by category, price, and name
- ✅ Product detail pages with image galleries
- ✅ Shopping cart with persistent storage
- ✅ 2-step checkout process
- ✅ Nigeria-localized content and currency
- ✅ Customer reviews and ratings
- ✅ FAQ section with brand-relevant questions

### Admin Functionality

- ✅ Secure admin login system
- ✅ Product inventory management
- ✅ Real-time order notifications
- ✅ Order status tracking
- ✅ Complete order details view
- ✅ Search and filter orders
- ✅ Order status management
- ✅ Store analytics dashboard

---

## 🌐 Real-time Features

The Orders Management System includes:

- **Live Order Notifications** — Toast alerts appear when new orders are placed
- **Auto-refresh Badge** — Unread order count updates in real-time
- **Notification Bell** — Quick preview of recent orders
- **Status Updates** — Change order status with one click

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Optimized for phones (320px+)
- ✅ Tablet layouts (640px+)
- ✅ Desktop views (1024px+)
- ✅ Touch-friendly navigation and buttons

---

## 🧪 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm lint
```

---

## 📄 License

This project is built for **Nura Bahar Nigeria**. All designs, images, and brand assets are proprietary.

---

## 📞 Support

For issues or questions about the project, please contact the development team.

---

Made with ❤️ for Nura Bahar Nigeria

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
