import { CheckCircle } from 'lucide-react';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white border border-sand-200 p-6 shadow-card hover:shadow-medium transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blush-100 flex items-center justify-center text-blush-500 font-display font-semibold text-lg">
            {review.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-body font-medium text-sm text-charcoal-800">{review.name}</span>
              {review.verified && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-body">
                  <CheckCircle size={12} /> Verified
                </span>
              )}
            </div>
            <span className="font-body text-xs text-charcoal-700/50">{review.date}</span>
          </div>
        </div>
        <div className="flex">
          {[1,2,3,4,5].map(s => (
            <span key={s} className={`text-base ${s <= review.rating ? 'text-amber-400' : 'text-sand-300'}`}>★</span>
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="font-body text-sm text-charcoal-700/80 leading-relaxed">{review.comment}</p>
    </div>
  );
}
