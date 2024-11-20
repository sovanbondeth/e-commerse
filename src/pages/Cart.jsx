import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ref, onValue, remove, update } from 'firebase/database';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const cartRef = ref(db, `users/${currentUser.uid}/cart`);
      const unsubscribe = onValue(cartRef, (snapshot) => {
        const items = [];
        snapshot.forEach((childSnapshot) => {
          items.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        setCartItems(items);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const removeFromCart = async (itemId) => {
    try {
      await remove(ref(db, `users/${currentUser.uid}/cart/${itemId}`));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await update(ref(db, `users/${currentUser.uid}/cart/${itemId}`), {
        quantity: newQuantity
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <div className="alert alert-info">Your cart is empty</div>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map(item => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={item.thumbnail} 
                                alt={item.title}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                className="me-2 rounded"
                              />
                              <span>{item.title}</span>
                            </div>
                          </td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>
                            <div className="input-group" style={{ width: '120px' }}>
                              <button 
                                className="btn btn-outline-secondary"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <span className="form-control text-center">{item.quantity}</span>
                              <button 
                                className="btn btn-outline-secondary"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td>${(item.price * item.quantity).toFixed(2)}</td>
                          <td>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Total</strong>
                  <strong>${total.toFixed(2)}</strong>
                </div>
                <Link 
                  to="/checkout" 
                  className="btn btn-primary w-100"
                  state={{ cartItems, subtotal, tax, shipping, total }}
                >
                  Proceed to Checkout
                </Link>
                <Link to="/products" className="btn btn-outline-secondary w-100 mt-2">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart; 