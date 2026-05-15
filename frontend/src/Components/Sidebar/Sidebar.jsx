import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  CreditCard, 
  Plus, 
  ShoppingCart,
  Truck,
  User,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Dashboard/Dashboard.css'; // Reusing dashboard styles for consistency

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Production', icon: <Package size={20} />, path: '/Product' },
    { name: 'Materials', icon: <Truck size={20} />, path: '/materials' },
    { name: 'Sales', icon: <ShoppingCart size={20} />, path: '/sales' },
    { name: 'Payments', icon: <CreditCard size={20} />, path: '/Payments' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
  ];

  // Don't show sidebar on login/signup/homepage
  const hideSidebarRoutes = ['/', '/login', '/signup'];
  if (hideSidebarRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <aside className="sidebar">
      <Link to="/" style={{textDecoration: 'none'}}>
        <div className="logo-section">
          <h1>ArtisanFlow</h1>
          <p>Artisan Manager Pro</p>
        </div>
      </Link>
      
      <nav className="nav-links">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link to="/Product" className="add-record-btn" style={{ textDecoration: 'none' }}>
          <Plus size={20} />
          <span>New Product</span>
        </Link>

        <button 
          onClick={handleLogout}
          className="nav-item" 
          style={{ 
            width: '100%', 
            border: 'none', 
            background: 'none', 
            color: '#ef4444', 
            marginTop: '0.5rem' 
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
