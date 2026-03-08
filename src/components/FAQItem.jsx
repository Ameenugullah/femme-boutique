import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border border-sand-200 transition-all duration-200 ${open ? 'bg-white shadow-soft' : 'bg-cream-50 hover:bg-white'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-body font-medium text-charcoal-800 pr-8 text-sm md:text-base">{question}</span>
        <span className={`shrink-0 text-blush-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </span>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <p className="font-body text-sm text-charcoal-700/70 leading-relaxed px-6 pb-5">
          {answer}
        </p>
      </div>
    </div>
  );
}
