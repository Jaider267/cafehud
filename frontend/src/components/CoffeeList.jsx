import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFilterStore } from "../store/useFilterStore";
import { useCoffeeStore } from "../store/useCoffeeStore";
import { useAuthStore } from "../store/useAuthStore";
import FilterBar from "./filters/FilterBar";
import ReviewModal from "./ui/ReviewModal";
import LoadingSpinner from "./ui/LoadingSpinner";
import ErrorState from "./ui/ErrorState";

const CoffeeCard = ({ cafe }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { voteCoffee, addToCart, toggleFavorite, favorites } = useCoffeeStore();
  const [voted, setVoted] = useState(false);
  const [added, setAdded] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const cafeId = cafe._id || cafe.id;
  const isFavorite = favorites.includes(cafeId);

  const handleVote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      return navigate('/login');
    }
    voteCoffee(cafeId);
    setVoted(true);
    setTimeout(() => setVoted(false), 2000);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      return navigate('/login');
    }
    toggleFavorite(cafeId);
  };

  const handleAddToCart = () => {
    if (!user) {
      return navigate('/login');
    }
    addToCart(cafe);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };


  return (
    <div className="card-premium group flex flex-col h-full hover:shadow-2xl relative">
      {voted && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-yellow-400 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce shadow-xl border border-black">
          ¡Gracias por tu voto!
        </div>
      )}
      <div className="relative h-72 overflow-hidden">
        <img 
          src={cafe.imageUrl} 
          alt={cafe.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Botón Favorito (Corazón) */}
        <button 
          onClick={handleToggleFavorite}
          className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all duration-500 z-20 shadow-xl border ${
            isFavorite 
            ? 'bg-red-500 border-red-400 scale-110' 
            : 'bg-black/20 border-white/20 hover:bg-black/40 hover:scale-110'
          }`}
          title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <svg 
            className={`w-6 h-6 transition-colors duration-500 ${isFavorite ? 'text-white fill-current' : 'text-white'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {!cafe.available && (
          <div className="badge-unavailable">
            No disponible
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark/40 to-transparent"></div>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-black text-brand-dark dark:text-white leading-none mb-2">{cafe.name}</h3>
            <p className="text-xs font-black text-brand-medium dark:text-gray-400 uppercase tracking-[0.2em]">{cafe.brand}</p>
          </div>
          <span className="text-2xl font-black text-brand-dark dark:text-white tracking-tighter">${cafe.price.toFixed(2)}</span>
        </div>
        
        <p className="text-brand-medium dark:text-gray-300 text-sm mb-8 line-clamp-2 italic font-medium leading-relaxed">
          "{cafe.description}"
        </p>
        
        {/* Reviews Section Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => setShowReviews(!showReviews)}
            className="text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest hover:text-brand-dark dark:hover:text-white transition-colors"
          >
            {showReviews ? 'Ocultar reseñas' : `Ver reseñas (${cafe.reviews?.length || 0})`}
          </button>
          <button 
            onClick={() => {
              if (!user) {
                return navigate('/login');
              }
              setIsReviewModalOpen(true);
            }}
            className="text-[10px] font-black text-brand-medium dark:text-white underline uppercase tracking-widest"
          >
            Escribir reseña
          </button>
        </div>

        {showReviews && (
          <div className="mb-8 space-y-4 max-h-40 overflow-y-auto pr-2 scrollbar-premium">
            {cafe.reviews?.length === 0 ? (
              <p className="text-[10px] italic text-gray-400">Aún no hay reseñas. ¡Sé el primero!</p>
            ) : (
              cafe.reviews.map((rev) => (
                <div key={rev.id} className="bg-brand-bg dark:bg-brand-dark/20 p-4 rounded-2xl border border-brand-light/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black dark:text-white">{rev.userName}</span>
                    <span className="text-yellow-400 text-[10px]">{'⭐'.repeat(rev.rating)}</span>
                  </div>
                  <p className="text-xs italic dark:text-gray-300 leading-snug">"{rev.comment}"</p>
                </div>
              ))
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="card-info-box">
            <span className="text-[9px] font-black text-brand-light dark:text-gray-400 uppercase tracking-widest mb-1">Origen</span>
            <span className="text-xs font-bold text-brand-dark dark:text-white">{cafe.origin}</span>
          </div>
          <div className="card-info-box">
            <span className="text-[9px] font-black text-brand-light dark:text-gray-400 uppercase tracking-widest mb-1">Tueste</span>
            <span className="text-xs font-bold text-brand-dark dark:text-white">{cafe.roast}</span>
          </div>
        </div>
        
        <div className="mt-auto flex items-center justify-between border-t border-brand-light/20 pt-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleVote}
              disabled={voted}
              className={`flex items-center px-3 py-1.5 rounded-lg border shadow-sm transition-all ${
                voted 
                ? 'bg-green-500 border-green-600 scale-95' 
                : 'bg-yellow-400 dark:bg-yellow-500 border-yellow-500 hover:scale-105 active:scale-95'
              }`}
              title={voted ? "¡Voto registrado!" : "¡Votar por este café!"}
            >
              <span className="text-sm">{voted ? "✅" : "⭐"}</span>
              <span className={`ml-1.5 text-sm font-black ${voted ? 'text-white' : 'text-brand-dark dark:text-black'}`}>
                {cafe.rating}
              </span>
            </button>
            <span className="text-[10px] font-black text-brand-light dark:text-white uppercase tracking-widest">
              ({cafe.votes} votos)
            </span>
          </div>
          <button 
            onClick={handleAddToCart}
            className={`w-12 h-12 !p-0 !rounded-xl shadow-2xl transition-all duration-300 flex items-center justify-center border border-white/10 ${
              added 
              ? 'bg-green-500 scale-110 rotate-12' 
              : 'bg-brand-medium dark:bg-white hover:bg-brand-dark dark:hover:bg-gray-200 hover:scale-110 active:scale-95'
            }`}
            title="Añadir al carrito"
          >
            {added ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <ReviewModal 
        cafe={cafe} 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
      />
    </div>
  );
};

const CoffeeList = () => {
  const { filters } = useFilterStore();
  const { cafes, fetchCafes, favorites, fetchFavorites, loading, error } = useCoffeeStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCafes();
  }, [fetchCafes]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  const filteredAndSortedCafes = useMemo(() => {
    let result = [...cafes];

    if (filters.availability) {
      result = result.filter((cafe) => cafe.available);
    }

    if (filters.onlyFavorites) {
      result = result.filter((cafe) => favorites.includes(cafe._id || cafe.id));
    }

    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [cafes, filters, favorites]); // Added cafes and favorites to dependencies

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="w-full pb-20">
      <FilterBar />
      
      {filteredAndSortedCafes.length === 0 ? (
        <div className="text-center py-20 bg-brand-beige/20 rounded-[3rem] border-4 border-dashed border-brand-light/30">
          <span className="text-7xl mb-6 block">☕</span>
          <h3 className="text-3xl font-black text-brand-dark tracking-tighter mb-2">No se encontraron cafés</h3>
          <p className="text-brand-medium font-bold uppercase tracking-widest text-xs">Prueba ajustando los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredAndSortedCafes.map((cafe) => (
            <CoffeeCard key={cafe.id} cafe={cafe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoffeeList;
