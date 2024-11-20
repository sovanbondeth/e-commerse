import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import OrderHistory from './pages/OrderHistory';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import PrivateRoute from './components/PrivateRoute';
import { useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <ToastProvider>
              <div className="app">
                <Navbar />
                <main className="container" style={{ paddingTop: "4.5rem" }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                      path="/cart" 
                      element={
                        <PrivateRoute>
                          <Cart />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/checkout" 
                      element={
                        <PrivateRoute>
                          <Checkout />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/checkout/success" 
                      element={
                        <PrivateRoute>
                          <CheckoutSuccess />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/orders" 
                      element={
                        <PrivateRoute>
                          <OrderHistory />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      } 
                    />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                  </Routes>
                </main>
              </div>
            </ToastProvider>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
