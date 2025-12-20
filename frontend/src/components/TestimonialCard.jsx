import { Star } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <article className="bg-white rounded-xl shadow-md p-6 h-full">
      {renderStars(testimonial.rating)}
      
      <p className="text-slate-700 mb-4 italic">"{testimonial.quote}"</p>
      
      <div className="flex items-center space-x-3 pt-4 border-t border-slate-200">
        {testimonial.avatar && (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
            loading="lazy"
          />
        )}
        <div>
          <div className="font-semibold text-slate-900">{testimonial.name}</div>
          {testimonial.location && (
            <div className="text-sm text-slate-600">{testimonial.location}</div>
          )}
        </div>
      </div>
    </article>
  );
};

export default TestimonialCard;

