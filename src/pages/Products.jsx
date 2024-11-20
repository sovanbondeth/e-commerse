import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';
import { useToast } from '../components/Toast';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        // Extract unique categories
        const uniqueCategories = [...new Set(data.products.map(p => p.category))];
        setCategories(uniqueCategories);
        setFilteredProducts(data.products);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply price range filter
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, priceRange, searchQuery, products]);

  const addToCart = async (product) => {
    if (!currentUser) {
      showToast('Please login to add items to cart', 'warning');
      return;
    }

    try {
      const cartRef = ref(db, `users/${currentUser.uid}/cart`);
      await push(cartRef, {
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        thumbnail: product.thumbnail
      });
      showToast('Product added to cart!', 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Failed to add product to cart', 'danger');
    }
  };

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
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Filters</h5>
              
              {/* Search */}
              <div className="mb-3">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-3">
                <label className="form-label">Price Range</label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  />
                </div>
              </div>

              {/* Reset Filters */}
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange({ min: 0, max: 2000 });
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="col">
                <div className="card h-100">
                  <img
                    src={product.thumbnail}
                    className="card-img-top"
                    alt={product.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">
                      <small className="text-body-secondary">
                        Price: ${product.price}
                      </small>
                    </p>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products; 