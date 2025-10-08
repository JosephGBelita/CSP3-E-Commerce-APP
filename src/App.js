import './App.css';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductView from './pages/ProductView';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Error from './pages/Error';
import AddProduct from './pages/AddProduct';
import CartView from './components/CartView';
import Register from './pages/Register';
import Profile from './pages/Profile'; 
import Contact from './pages/ContactPage'; 
import AdminUserManagement from './components/AdminUserManagement';
import OrderHistory from './components/OrderHistory';
import ResetPassword from './components/ResetPassword';
import Footer from './components/Footer';
import SearchResults from './pages/SearchResults';
import CategoryProducts from './pages/CategoryProducts';
import NewArrivalsPage from './pages/NewArrivalsPage';

import AboutUs from './pages/AboutUs';
import ForgotPassword from './pages/ForgotPassword';
import ShippingInfo from './pages/ShippingInfo';
import ReturnsRefunds from './pages/ReturnsRefunds';
import FAQ from './pages/FAQ';
import Warranty from './pages/Warranty';
import ResetPasswordToken from './pages/ResetPasswordToken.js';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL}/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          const userData = data.user || data;
          if (userData._id) {
            setUser({
              id: userData._id,
              isAdmin: userData.isAdmin,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email
            });
          } else {
            setUser({
              id: null,
              isAdmin: null
            });
          }
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          setUser({
            id: null,
            isAdmin: null
          });
        });
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductView />} />
            <Route path="/cart" element={<CartView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} /> 
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/search" element={<SearchResults />} /> 
            <Route path="/products/category/:category" element={<CategoryProducts />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPasswordToken />} />
            <Route path="/shipping" element={<ShippingInfo />} />
            <Route path="/returns" element={<ReturnsRefunds />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/warranty" element={<Warranty />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
       <Footer />
      </Router>

    </UserProvider>
  );
}

export default App;