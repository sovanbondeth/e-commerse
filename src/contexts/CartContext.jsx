import { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const cartRef = ref(db, `users/${currentUser.uid}/cart`);
      const unsubscribe = onValue(cartRef, (snapshot) => {
        let count = 0;
        snapshot.forEach((childSnapshot) => {
          count += childSnapshot.val().quantity || 1;
        });
        setCartCount(count);
      });

      return () => unsubscribe();
    } else {
      setCartCount(0);
    }
  }, [currentUser]);

  return (
    <CartContext.Provider value={{ cartCount }}>
      {children}
    </CartContext.Provider>
  );
} 