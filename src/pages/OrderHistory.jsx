import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const ordersRef = ref(db, `users/${currentUser.uid}/orders`);
      const unsubscribe = onValue(ordersRef, (snapshot) => {
        const ordersList = [];
        snapshot.forEach((childSnapshot) => {
          ordersList.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        // Sort orders by date (newest first)
        ordersList.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(ordersList);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

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
    <div className="container py-4">
      <h2 className="mb-4">Order History</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">No orders found</div>
      ) : (
        <div className="row">
          {orders.map(order => (
            <div key={order.id} className="col-12 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>Order #{order.id.slice(-6)}</span>
                  <span className="badge bg-primary">
                    {new Date(order.orderDate).toLocaleString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h6 className="mb-3">Items</h6>
                      {order.items.map(item => (
                        <div key={item.id} className="d-flex align-items-center mb-2">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="me-2 rounded"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                          <div className="flex-grow-1">
                            <div>{item.title}</div>
                            <small className="text-muted">
                              ${item.price} × {item.quantity}
                            </small>
                          </div>
                          <div className="ms-auto">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="col-md-4">
                      <h6 className="mb-3">Order Summary</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax</span>
                        <span>${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Shipping</span>
                        <span>
                          {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Total</strong>
                        <strong>${order.total.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="mt-3">
                    <h6>Shipping Address</h6>
                    <p className="mb-0">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory; 