import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  CreditCard, 
  Plus, 
  ShoppingCart,
  Truck,
  User,
  LogOut,
  Home
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser, getIsLoggedIn } from '../../redux/slices/User';
import { IconAnalyze, IconLogin, IconUserPlus } from '@tabler/icons-react';
import '../Dashboard/Dashboard.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(removeUser());
    navigate("/login");
  };

  const navItems = [
    { name: 'Home', icon: <Home size={18} />, path: '/', public: true },
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard', public: false },
    { name: 'Production', icon: <Package size={18} />, path: '/Product', public: false },
    { name: 'Materials', icon: <Truck size={18} />, path: '/materials', public: false },
    { name: 'Sales', icon: <ShoppingCart size={18} />, path: '/sales', public: false },
    { name: 'Payments', icon: <CreditCard size={18} />, path: '/Payments', public: false },
    { name: 'Profile', icon: <User size={18} />, path: '/profile', public: false },
  ];

  // Filter items based on auth state
  const visibleNavItems = navItems.filter(item => item.public || isLoggedIn);

  return (
    <nav className="top-navbar">
      <div className="navbar-container">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="logo-section-horizontal">
            <IconAnalyze color="#556B2F" size={24} stroke={2.5} />
            <h1>ArtisanFlow</h1>
          </div>
        </Link>
        
        <div className="nav-links-horizontal">
          {visibleNavItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-item-horizontal ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {isLoggedIn ? (
            <>
              <Link to="/Product" className="add-btn-horizontal">
                <Plus size={18} />
                <span>New</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn-horizontal">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="login-link-nav">
                <IconLogin size={18} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="signup-btn-nav">
                <IconUserPlus size={18} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
