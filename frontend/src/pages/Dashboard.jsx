import { useAuthStore } from "../store/useAuthStore";
import { useCoffeeStore } from "../store/useCoffeeStore";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Dashboard = () => {
  const { user, loading } = useAuthStore();
  const favorites = useCoffeeStore((state) => state.favorites);

  const recentActivity = [
    { id: 1, type: 'review', item: 'Colombian Supremo', date: 'Hace 2 horas', icon: '✍️' },
    { id: 2, type: 'favorite', item: 'Ethiopian Yirgacheffe', date: 'Hace 5 horas', icon: '❤️' },
    { id: 3, type: 'purchase', item: 'Brazilian Santos', date: 'Ayer', icon: '🛒' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto w-full pt-8 px-4">
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-[#3E2723] text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#3E2723] tracking-tight">
              ¡Hola, {user?.name || 'Barista'}! 👋
            </h1>
            <p className="text-[#6D4C41] text-lg font-medium">Bienvenido de nuevo a tu rincón cafetero.</p>
          </div>
        </div>
      </header>

      {/* Estadísticas del usuario */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
        <div className="card-premium p-8 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">☕</span>
            <span className="text-[10px] font-black text-brand-medium uppercase tracking-[0.2em] bg-brand-beige px-3 py-1 rounded-full">Favoritos</span>
          </div>
          <h3 className="text-4xl font-black text-brand-dark">{favorites?.length || 0}</h3>
          <p className="text-brand-medium mt-2 font-bold">Cafés guardados</p>
        </div>
        
        <div className="card-premium p-8 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📝</span>
            <span className="text-[10px] font-black text-brand-medium uppercase tracking-[0.2em] bg-brand-beige px-3 py-1 rounded-full">Reseñas</span>
          </div>
          <h3 className="text-4xl font-black text-brand-dark">{user?.points ? Math.max(0, Math.floor(user.points / 10)) : 0}</h3>
          <p className="text-brand-medium mt-2 font-bold">Reseñas estimadas</p>
        </div>

        <div className="card-premium p-8 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🌟</span>
            <span className="text-[10px] font-black text-brand-medium uppercase tracking-[0.2em] bg-brand-beige px-3 py-1 rounded-full">Puntos</span>
          </div>
          <h3 className="text-4xl font-black text-brand-dark">{user?.points || 0}</h3>
          <p className="text-brand-medium mt-2 font-bold">Coffee Points</p>
        </div>
      </div>

      {/* Actividad Reciente */}
      <section className="card-premium p-8 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-wider">
            Actividad Reciente
          </h2>
          <button className="text-brand-medium font-black hover:underline text-xs uppercase tracking-[0.2em]">Ver todo</button>
        </div>
        
        <div className="space-y-6">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-6 bg-brand-beige/20 rounded-2xl border border-brand-beige hover:bg-brand-beige/40 transition-colors group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl border border-brand-light/30 group-hover:scale-110 transition-transform">
                  {activity.icon}
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark text-lg leading-tight">
                    {activity.type === 'review' && 'Has reseñado '}
                    {activity.type === 'favorite' && 'Añadido a favoritos '}
                    {activity.type === 'purchase' && 'Has comprado '}
                    <span className="text-brand-medium">{activity.item}</span>
                  </h4>
                  <p className="text-xs text-brand-medium/70 font-black uppercase tracking-widest mt-1">{activity.date}</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <svg className="w-6 h-6 text-brand-light group-hover:text-brand-medium transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;