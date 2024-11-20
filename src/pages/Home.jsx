import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <div className="px-4 py-5 my-5 text-center">
        <h1 className="display-4 fw-bold">Welcome to BondithShop</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Discover our amazing collection of products at great prices.
            Shop with confidence and enjoy a seamless shopping experience.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Link to="/products" className="btn btn-primary btn-lg px-4 gap-3">
              Browse Products
            </Link>
            <Link to="/register" className="btn btn-outline-secondary btn-lg px-4">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 