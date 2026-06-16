import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { cafeApi, favoriteApi } from '../api/api';
import { useAuthStore } from './useAuthStore';

const getCafeId = (cafe) => String(cafe?._id || cafe?.id);
const syncCartWithCafes = (cart, cafes) => {
  const cafeMap = new Map(cafes.map((cafe) => [getCafeId(cafe), cafe]));

  return cart.map((item) => {
    const updatedCafe = cafeMap.get(getCafeId(item));

    if (!updatedCafe) {
      return item;
    }

    return {
      ...item,
      ...updatedCafe,
      id: getCafeId(updatedCafe),
      quantity: item.quantity,
    };
  });
};

export const useCoffeeStore = create(
  persist(
    (set, get) => ({
      cafes: [],
      cart: [],
      favorites: [],
      loading: false,
      error: null,

      fetchCafes: async () => {
        set({ loading: true, error: null });
        try {
          const fetchedCafes = await cafeApi.getCafes();
          const cafes = Array.isArray(fetchedCafes) ? fetchedCafes : [];
          set((state) => ({
            cafes,
            cart: syncCartWithCafes(state.cart, cafes),
            loading: false,
          }));
        } catch (err) {
          set({ error: 'Error al cargar el catalogo', loading: false });
        }
      },

      fetchFavorites: async () => {
        try {
          const favorites = await favoriteApi.getFavorites();
          set({ favorites: Array.isArray(favorites) ? favorites.map(String) : [] });
        } catch (err) {
          set({ favorites: [] });
          console.error('Error al cargar favoritos', err);
        }
      },

      toggleFavorite: async (id) => {
        try {
          const updatedFavorites = await favoriteApi.toggle(id);
          set({ favorites: Array.isArray(updatedFavorites) ? updatedFavorites.map(String) : [] });
        } catch (err) {
          console.error('Error al actualizar favorito', err);
          throw err;
        }
      },

      voteCoffee: async (id) => {
        try {
          const updatedCafe = await cafeApi.vote(id);
          set((state) => ({
            cafes: state.cafes.map((cafe) => getCafeId(cafe) === String(id) ? updatedCafe : cafe)
          }));
        } catch (err) {
          console.error('Error al votar', err);
          throw err;
        }
      },

      addReview: async (id, reviewData) => {
        try {
          const response = await cafeApi.addReview(id, reviewData);
          const updatedCafe = response?.cafe ?? response;
          const updatedUser = response?.user;

          if (updatedUser) {
            useAuthStore.getState().setUser(updatedUser);
          }

          set((state) => ({
            cafes: state.cafes.map((cafe) => getCafeId(cafe) === String(id) ? updatedCafe : cafe)
          }));

          return response;
        } catch (err) {
          console.error('Error al anadir resena', err);
          throw err;
        }
      },

      addToCart: (cafe) => set((state) => {
        const cafeId = getCafeId(cafe);
        const currentCafe = get().cafes.find((item) => getCafeId(item) === cafeId) ?? cafe;

        if (!currentCafe?.available) {
          return state;
        }

        const exists = state.cart.find((item) => getCafeId(item) === cafeId);

        if (exists) {
          return {
            cart: state.cart.map((item) =>
              getCafeId(item) === cafeId
                ? { ...item, ...currentCafe, id: cafeId, quantity: item.quantity + 1 }
                : item
            )
          };
        }

        return { cart: [...state.cart, { ...currentCafe, id: cafeId, quantity: 1 }] };
      }),

      removeFromCart: (id) => set((state) => {
        const itemId = String(id);
        const existingItem = state.cart.find((item) => getCafeId(item) === itemId);

        if (existingItem && existingItem.quantity > 1) {
          return {
            cart: state.cart.map((item) =>
              getCafeId(item) === itemId ? { ...item, quantity: item.quantity - 1 } : item
            )
          };
        }

        return {
          cart: state.cart.filter((item) => getCafeId(item) !== itemId)
        };
      }),

      clearItemFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => getCafeId(item) !== String(id))
      })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cafehub-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
