import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Truck, RotateCcw, Lock } from 'lucide-react';
import { featuredProducts, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

const categoryData = [
  { name: 'Boubous', image: '/images/teal-satin-boubou-1.jpg', count: 5 },
  { name: 'Gowns',   image: '/images/luna-dress-1.jpg',        count: 4 },
  { name: 'Ankara',  image: '/images/ankara-dress-1.jpg',      count: 2 },
  { name: 'Perfumes',image: '/images/perfume-oils.jpg',        count: 1 },
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
  { icon: Truck,   label: 'Nationwide Delivery', sub: 'Lagos, Kano, Abuja & more' },
  { icon: RotateCcw, label: 'Easy Returns',      sub: 'Within 7 days' },
  { icon: Lock,    label: 'Secure Payment',      sub: 'Bank transfer & cards' },
  { icon: Star,    label: '4.9 / 5 Rating',      sub: 'Trusted by 3,000+ customers' },
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

const fmt = (n) => `₦${n.toLocaleString('en-NG')}`;

export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd]     = useState(false);
  const revealRef   = useScrollReveal();
  const scrollRef   = useRef(null);
  const slide = heroSlides[heroIdx];

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  // Track scroll position to enable/disable arrows
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollCarousel = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll by one card width (the first child's offsetWidth + gap)
    const card = el.firstElementChild;
    const gap = 24; // gap-6 = 24px
    const amount = (card?.offsetWidth ?? 300) + gap;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <div ref={revealRef}>

      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={slide.image} alt="Hero" className="object-cover w-full h-full transition-opacity duration-1000" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 flex items-center h-full">
          <div className="px-6 pt-20 mx-auto max-w-7xl">
            <span className="block mb-5 tag animate-fade-in">{slide.tag}</span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-charcoal-800 leading-[1.05] whitespace-pre-line mb-6 animate-fade-up font-light italic">
              {slide.heading}
            </h1>
            <p className="max-w-sm mb-10 text-lg font-body text-charcoal-700/70 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              {slide.sub}
            </p>
            <div className="flex items-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/products" className="flex items-center gap-2 btn-primary">{slide.cta} <ArrowRight size={16} /></Link>
              <Link to="/faq" className="btn-outline">Size Guide</Link>
            </div>
          </div>
        </div>
        <div className="absolute z-10 flex gap-2 -translate-x-1/2 bottom-8 left-1/2">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)}
              className={`transition-all duration-300 ${i === heroIdx ? 'w-8 h-2 bg-blush-500' : 'w-2 h-2 bg-charcoal-700/30 hover:bg-charcoal-700/60'}`}
            />
          ))}
        </div>
      </section>

      {/* ── Perks Bar ── */}
      <section className="py-6 bg-sand-100 border-y border-sand-200">
        <div className="grid grid-cols-2 gap-6 px-6 mx-auto max-w-7xl lg:grid-cols-4">
          {perks.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 animate-on-scroll">
              <div className="flex items-center justify-center w-10 h-10 bg-white shadow-soft shrink-0">
                <Icon size={18} className="text-blush-500" />
              </div>
              <div>
                <p className="text-sm font-medium font-body text-charcoal-800">{label}</p>
                <p className="text-xs font-body text-charcoal-700/50">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-12">
          <div className="animate-on-scroll">
            <span className="block mb-2 tag">Browse by</span>
            <h2 className="italic font-light section-heading">Shop by Category</h2>
          </div>
          <Link to="/products" className="items-center hidden gap-2 text-sm transition-colors sm:flex font-body text-charcoal-700 hover:text-blush-500 animate-on-scroll">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categoryData.map((cat, i) => (
            <Link key={cat.name} to={`/products?category=${cat.name}`}
              className="group relative overflow-hidden aspect-[3/4] bg-sand-100 animate-on-scroll"
              style={{ transitionDelay: `${i * 80}ms` }}>
              <img src={cat.image} alt={cat.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 transition-colors duration-300 bg-charcoal-900/20 group-hover:bg-charcoal-900/40" />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-charcoal-900/80 to-transparent">
                <h3 className="text-xl italic font-light text-white font-display">{cat.name}</h3>
                <p className="text-sm font-body text-white/70">{cat.count} styles</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products Carousel ── */}
      <section className="py-16 bg-sand-100/50">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div className="animate-on-scroll">
              <span className="block mb-2 tag">Handpicked</span>
              <h2 className="italic font-light section-heading">Featured Pieces</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollCarousel(-1)}
                disabled={atStart}
                className="flex items-center justify-center w-10 h-10 transition-all duration-200 border border-charcoal-800 disabled:opacity-30 hover:bg-charcoal-800 hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollCarousel(1)}
                disabled={atEnd}
                className="flex items-center justify-center w-10 h-10 transition-all duration-200 border border-charcoal-800 disabled:opacity-30 hover:bg-charcoal-800 hover:text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Responsive scrollable carousel */}
          <div
            ref={scrollRef}
            className="flex gap-6 pb-2 overflow-x-auto scroll-smooth"
            style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.map(product => (
              <div
                key={product.id}
                className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/products" className="inline-flex items-center gap-2 btn-outline">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Editorial Banner ── */}
      <section className="px-6 py-24">
        <div className="grid items-center gap-8 mx-auto max-w-7xl md:grid-cols-2">
          <div className="relative animate-on-scroll">
            <div className="absolute w-full h-full border -top-4 -left-4 border-blush-200 -z-10" />
            <img src="/images/luna-dress-2.jpg" alt="Editorial" className="w-full aspect-[4/5] object-cover" />
          </div>
          <div className="animate-on-scroll md:pl-8">
            <span className="block mb-4 tag">Our Story</span>
            <h2 className="mb-6 font-light leading-tight section-heading">
              <em>Fashion Rooted in</em><br />Nigerian Heritage
            </h2>
            <p className="mb-6 leading-relaxed font-body text-charcoal-700/70">
              Born in Kano, Nigeria, Nura Bahar is a celebration of feminine elegance and cultural pride. Every piece — from our flowing boubous to our hand-printed Ankara gowns — is crafted with care and worn with joy.
            </p>
            <p className="mb-10 leading-relaxed font-body text-charcoal-700/70">
              We believe fashion is a love language. Our designs are made for the woman who carries her heritage beautifully and steps boldly into every room she enters.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 btn-blush">
              Shop the Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-charcoal-800 text-cream-50">
        <div className="max-w-4xl px-6 mx-auto text-center">
          <span className="block mb-4 tag text-blush-400">What our customers say</span>
          <h2 className="mb-12 text-3xl italic font-light font-display md:text-4xl text-cream-50">Loved Across Nigeria</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { quote: 'The teal satin boubou is absolutely stunning. I wore it to a wedding and everyone kept asking where I got it. Nura Bahar is in a league of its own!', name: 'Aisha M.', location: 'Kano' },
              { quote: "My Luna Dress arrived beautifully packaged and fits like a dream. The quality is beyond what I expected at this price. I'll never shop anywhere else.", name: 'Fatima A.', location: 'Lagos' },
              { quote: 'The Ankara bell-sleeve dress is a masterpiece. It shows off our culture in the most beautiful way. Fast delivery to Abuja too!', name: 'Zainab K.', location: 'Abuja' },
            ].map(t => (
              <div key={t.name} className="p-6 glass animate-on-scroll">
                <div className="flex mb-3">{[1,2,3,4,5].map(s => <span key={s} className="text-sm text-amber-400">★</span>)}</div>
                <p className="mb-4 text-sm italic leading-relaxed font-body text-cream-50/80">"{t.quote}"</p>
                <p className="text-xs font-medium font-body text-blush-400">{t.name} · {t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}