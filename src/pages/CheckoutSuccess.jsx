import { Link } from 'react-router-dom';

function CheckoutSuccess() {
  return (
    <div className="container py-5 text-center">
      <div className="card">
        <div className="card-body">
          <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
          <h2 className="mt-3 mb-4">Order Placed Successfully!</h2>
          <p className="mb-4">
            Thank you for your purchase. We'll send you an email confirmation with order details shortly.
          </p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess; 