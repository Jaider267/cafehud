import { useState } from "react";
import { useCoffeeStore } from "../../store/useCoffeeStore";
import { useAuthStore } from "../../store/useAuthStore";

const ReviewModal = ({ cafe, isOpen, onClose }) => {
  const { addReview } = useCoffeeStore();
  const { user } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!user) return;

    addReview(cafe._id || cafe.id, {
      rating,
      comment
    });
    
    setComment("");
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white dark:bg-black rounded-[3rem] shadow-2xl overflow-hidden border border-brand-light/20 animate-scale-in">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tighter">Deja tu reseña</h2>
              <p className="text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest mt-1">
                Compartiendo sobre {cafe.name}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-brand-light/10 rounded-full dark:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Star Rating */}
            <div className="flex flex-col items-center gap-4 bg-brand-bg dark:bg-brand-dark/20 p-6 rounded-3xl border border-brand-light/10">
              <span className="text-[9px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-[0.3em]">Tu calificación</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform active:scale-90"
                  >
                    <svg 
                      className={`w-10 h-10 ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-700'}`} 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
              <span className="text-xl font-black text-brand-dark dark:text-white">{rating}.0</span>
            </div>

            {/* Comment */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest ml-2">Tu experiencia</label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="¿Qué te pareció este café? (Notas de sabor, aroma, cuerpo...)"
                className="input-premium h-40 resize-none !p-6"
              />
            </div>

            <button type="submit" className="w-full btn-premium py-6 group">
              <span className="font-black uppercase tracking-[0.2em]">Publicar Reseña</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
