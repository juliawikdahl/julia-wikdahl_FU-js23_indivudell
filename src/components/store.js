import create from 'zustand';

const useStore = create((set) => ({
  cartItems: [],
  addToCart: (item) => {
    set((state) => {
      const existingItemIndex = state.cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        return { cartItems: updatedCartItems };
      } else {
        return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
      }
    });
  },
}));
const useAuthStore = create((set) => ({
  token: null,
  userId: null,
  username: null,
  email: null, 
  setToken: (token) => set({ token }),
  setUserId: (userId) => set({ userId }),
  setUsername: (username) => set({ username }),
  setEmail: (email) => set({ email }), 
}));


export default useStore;
