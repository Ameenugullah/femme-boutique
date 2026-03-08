import { useState } from 'react';
import { faqData } from '../data/faq';
import FAQItem from '../components/FAQItem';
import { Search, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = faqData
    .map(cat => ({
      ...cat,
      questions: cat.questions.filter(q =>
        (activeCategory === 'all' || cat.category.toLowerCase().replace(/\s+/g, '-') === activeCategory) &&
        (q.question.toLowerCase().includes(search.toLowerCase()) || q.answer.toLowerCase().includes(search.toLowerCase()))
      )
    }))
    .filter(cat => cat.questions.length > 0);

  const totalResults = filtered.reduce((s, c) => s + c.questions.length, 0);

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Hero */}
      <div className="bg-charcoal-800 py-20 px-6 text-center">
        <span className="tag text-blush-400 block mb-3">Help Centre</span>
        <h1 className="font-display text-4xl md:text-5xl text-cream-50 mb-4">Frequently Asked Questions</h1>
        <p className="font-body text-cream-200/60 mb-8 max-w-lg mx-auto">
          Find quick answers to common questions, or reach out to our team directly.
        </p>

        {/* Search */}
        <div className="max-w-lg mx-auto relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-700/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-11 pr-5 py-4 bg-white font-body text-charcoal-800 placeholder-charcoal-700/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`font-body text-sm px-5 py-2.5 transition-all ${activeCategory === 'all' ? 'bg-charcoal-800 text-cream-50' : 'bg-white border border-sand-200 text-charcoal-700 hover:border-charcoal-700'}`}
          >
            All Topics
          </button>
          {faqData.map(cat => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category.toLowerCase().replace(/\s+/g, '-'))}
              className={`font-body text-sm px-5 py-2.5 transition-all flex items-center gap-2 ${
                activeCategory === cat.category.toLowerCase().replace(/\s+/g, '-')
                  ? 'bg-charcoal-800 text-cream-50'
                  : 'bg-white border border-sand-200 text-charcoal-700 hover:border-charcoal-700'
              }`}
            >
              <span>{cat.icon}</span> {cat.category}
            </button>
          ))}
        </div>

        {/* Results count */}
        {search && (
          <p className="font-body text-sm text-charcoal-700/60 mb-8 text-center">
            {totalResults} result{totalResults !== 1 ? 's' : ''} for "{search}"
          </p>
        )}

        {/* FAQ Sections */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-charcoal-700/40 mb-3">No results found</p>
            <p className="font-body text-charcoal-700/30 mb-6">Try a different search term or browse all topics</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all'); }} className="btn-outline">
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {filtered.map((cat, ci) => (
              <div key={ci} className="animate-fade-up">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{cat.icon}</span>
                  <h2 className="font-display text-2xl text-charcoal-800">{cat.category}</h2>
                </div>
                <div className="space-y-2">
                  {cat.questions.map((q, qi) => (
                    <FAQItem
                      key={q.id}
                      question={q.question}
                      answer={q.answer}
                      defaultOpen={ci === 0 && qi === 0 && !search}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-20 bg-charcoal-800 p-10 text-center">
          <h3 className="font-display text-2xl text-cream-50 mb-3">Still have questions?</h3>
          <p className="font-body text-cream-200/60 mb-8 max-w-md mx-auto">
            Our customer care team is available Monday–Friday, 9AM–6PM EST.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hello@femmeboutique.com"
              className="flex items-center gap-2 bg-blush-500 hover:bg-blush-600 text-white font-body font-medium px-6 py-3 transition-colors duration-200"
            >
              <Mail size={18} /> Email Us
            </a>
            <button className="flex items-center gap-2 border border-cream-200/30 text-cream-200 hover:border-cream-200/60 font-body font-medium px-6 py-3 transition-colors duration-200">
              <MessageCircle size={18} /> Live Chat
            </button>
          </div>
          <p className="font-body text-xs text-cream-200/30 mt-6">Average response time: under 2 hours</p>
        </div>
      </div>
    </div>
  );
}
