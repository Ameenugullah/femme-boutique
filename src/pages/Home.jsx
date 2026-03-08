import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Truck, RotateCcw, Lock } from 'lucide-react';
import { featuredProducts, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

const categoryData = [
  { name: 'Boubous', image: '/images/teal-satin-boubou-1.jpg', count: 5 },
  { name: 'Gowns', image: '/images/luna-dress-1.jpg', count: 4 },
  { name: 'Ankara', image: '/images/ankara-dress-1.jpg', count: 2 },
  { name: 'Perfumes', image: '/images/perfume-oils.jpg', count: 1 },
];

const heroSlides = [
  {
    image: '/images/teal-satin-boubou-2.jpg',
    tag: 'New Collection — 2025',
    heading: 'Dressed in\nGrace &\nTradition',
    sub: 'Handcrafted Nigerian fashion for the modern woman.',
    cta: 'Shop the Collection',
  },
  {
    image: '/images/coral-cape-dress-1.jpg',
    tag: 'Nura Bahar Nigeria',
    heading: 'Wear Your\nHeritage,\nFeel Beautiful',
    sub: 'From Kano to the world — with love.',
    cta: 'Explore Now',
  },
];

const perks = [
  { icon: Truck, label: 'Nationwide Delivery', sub: 'Lagos, Kano, Abuja & more' },
  { icon: RotateCcw, label: 'Easy Returns', sub: 'Within 7 days' },
  { icon: Lock, label: 'Secure Payment', sub: 'Bank transfer & cards' },
  { icon: Star, label: '4.9 / 5 Rating', sub: 'Trusted by 3,000+ customers' },
];

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) el.querySelectorAll('.animate-on-scroll').forEach(child => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

// Format price in NGN
const fmt = (n) => `₦${n.toLocaleString('en-NG')}`;

export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const revealRef = useScrollReveal();
  const slide = heroSlides[heroIdx];
  const itemsPerPage = 3;
  const maxCarouselIdx = Math.max(0, featuredProducts.length - itemsPerPage);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div ref={revealRef}>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={slide.image} alt="Hero" className="w-full h-full object-cover transition-opacity duration-1000" />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 pt-20">
            <span className="tag block mb-5 animate-fade-in">{slide.tag}</span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-charcoal-800 leading-[1.05] whitespace-pre-line mb-6 animate-fade-up font-light italic">
              {slide.heading}
            </h1>
            <p className="font-body text-lg text-charcoal-700/70 mb-10 max-w-sm animate-fade-up" style={{ animationDelay: '0.15s' }}>
              {slide.sub}
            </p>
            <div className="flex items-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/products" className="btn-primary flex items-center gap-2">{slide.cta} <ArrowRight size={16} /></Link>
              <Link to="/faq" className="btn-outline">Size Guide</Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)}
              className={`transition-all duration-300 ${i === heroIdx ? 'w-8 h-2 bg-blush-500' : 'w-2 h-2 bg-charcoal-700/30 hover:bg-charcoal-700/60'}`}
            />
          ))}
        </div>
      </section>

      {/* Perks Bar */}
      <section className="bg-sand-100 border-y border-sand-200 py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 animate-on-scroll">
              <div className="w-10 h-10 flex items-center justify-center bg-white shadow-soft shrink-0">
                <Icon size={18} className="text-blush-500" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-charcoal-800">{label}</p>
                <p className="font-body text-xs text-charcoal-700/50">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div className="animate-on-scroll">
            <span className="tag block mb-2">Browse by</span>
            <h2 className="section-heading font-light italic">Shop by Category</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 font-body text-sm text-charcoal-700 hover:text-blush-500 transition-colors animate-on-scroll">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryData.map((cat, i) => (
            <Link key={cat.name} to={`/products?category=${cat.name}`}
              className="group relative overflow-hidden aspect-[3/4] bg-sand-100 animate-on-scroll"
              style={{ transitionDelay: `${i * 80}ms` }}>
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-charcoal-900/20 group-hover:bg-charcoal-900/40 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-charcoal-900/80 to-transparent">
                <h3 className="font-display text-xl text-white font-light italic">{cat.name}</h3>
                <p className="font-body text-sm text-white/70">{cat.count} styles</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-16 bg-sand-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div className="animate-on-scroll">
              <span className="tag block mb-2">Handpicked</span>
              <h2 className="section-heading font-light italic">Featured Pieces</h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setCarouselIdx(i => Math.max(0, i - 1))} disabled={carouselIdx === 0}
                className="w-10 h-10 border border-charcoal-800 flex items-center justify-center disabled:opacity-30 hover:bg-charcoal-800 hover:text-white transition-all duration-200">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setCarouselIdx(i => Math.min(maxCarouselIdx, i + 1))} disabled={carouselIdx >= maxCarouselIdx}
                className="w-10 h-10 border border-charcoal-800 flex items-center justify-center disabled:opacity-30 hover:bg-charcoal-800 hover:text-white transition-all duration-200">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(calc(-${carouselIdx} * (33.33% + 8px)))` }}>
              {featuredProducts.map(product => (
                <div key={product.id} className="min-w-[calc(33.33%-16px)] flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <Link to="/products" className="btn-outline inline-flex items-center gap-2">View All Products <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="relative animate-on-scroll">
            <div className="absolute -top-4 -left-4 w-full h-full border border-blush-200 -z-10" />
            <img src="/images/luna-dress-2.jpg" alt="Editorial" className="w-full aspect-[4/5] object-cover" />
          </div>
          <div className="animate-on-scroll md:pl-8">
            <span className="tag block mb-4">Our Story</span>
            <h2 className="section-heading mb-6 leading-tight font-light">
              <em>Fashion Rooted in</em><br />Nigerian Heritage
            </h2>
            <p className="font-body text-charcoal-700/70 leading-relaxed mb-6">
              Born in Kano, Nigeria, Nura Bahar is a celebration of feminine elegance and cultural pride. Every piece — from our flowing boubous to our hand-printed Ankara gowns — is crafted with care and worn with joy.
            </p>
            <p className="font-body text-charcoal-700/70 leading-relaxed mb-10">
              We believe fashion is a love language. Our designs are made for the woman who carries her heritage beautifully and steps boldly into every room she enters.
            </p>
            <Link to="/products" className="btn-blush inline-flex items-center gap-2">Shop the Collection <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-charcoal-800 text-cream-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="tag text-blush-400 block mb-4">What our customers say</span>
          <h2 className="font-display text-3xl md:text-4xl text-cream-50 mb-12 font-light italic">Loved Across Nigeria</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { quote: 'The teal satin boubou is absolutely stunning. I wore it to a wedding and everyone kept asking where I got it. Nura Bahar is in a league of its own!', name: 'Aisha M.', location: 'Kano' },
              { quote: 'My Luna Dress arrived beautifully packaged and fits like a dream. The quality is beyond what I expected at this price. I\'ll never shop anywhere else.', name: 'Fatima A.', location: 'Lagos' },
              { quote: 'The Ankara bell-sleeve dress is a masterpiece. It shows off our culture in the most beautiful way. Fast delivery to Abuja too!', name: 'Zainab K.', location: 'Abuja' },
            ].map(t => (
              <div key={t.name} className="glass p-6 animate-on-scroll">
                <div className="flex mb-3">{[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-sm">★</span>)}</div>
                <p className="font-body text-sm text-cream-50/80 leading-relaxed mb-4 italic">"{t.quote}"</p>
                <p className="font-body text-xs text-blush-400 font-medium">{t.name} · {t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
