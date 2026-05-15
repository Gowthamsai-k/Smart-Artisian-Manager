import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  Plus,
  Search,
  Bell,
  Settings,
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Star,
  ChevronRight,
  ShoppingCart,
  Box,
  Truck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import HeaderMenu from '../NavBar/HeaderMenu';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();

  // States for graphs
  const [materialsIntake, setMaterialsIntake] = useState([]);
  const [salesProfit, setSalesProfit] = useState([]);

  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    activeProducts: 0,
    materialsCount: 0
  });

  const fetchData = async () => {
    try {
      const [salesRes, productsRes, materialsRes, saleStatsRes, materialStatsRes] = await Promise.all([
        axios.get('http://localhost:3000/api/sales/all', { withCredentials: true }),
        axios.get('http://localhost:3000/api/sales/products', { withCredentials: true }),
        axios.get('http://localhost:3000/api/material/all', { withCredentials: true }),
        axios.get('http://localhost:3000/api/sales/stats', { withCredentials: true }),
        axios.get('http://localhost:3000/api/material/stats', { withCredentials: true })
      ]);

      if (salesRes.data.success) {
        const total = salesRes.data.sales.reduce((acc, sale) => acc + sale.price, 0);
        setStats(prev => ({ ...prev, totalSales: total, totalProfit: total * 0.4 }));
      }

      if (productsRes.data.success) {
        setStats(prev => ({ ...prev, activeProducts: productsRes.data.products.length }));
      }

      if (materialsRes.data.success) {
        setStats(prev => ({ ...prev, materialsCount: materialsRes.data.materials.length }));
      }

      if (saleStatsRes.data.success && saleStatsRes.data.stats.length > 0) {
        setSalesProfit(saleStatsRes.data.stats);
      }

      if (materialStatsRes.data.success && materialStatsRes.data.stats.length > 0) {
        setMaterialsIntake(materialStatsRes.data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <HeaderMenu variant="dashboard" />

      <div className="header-section">
        <div className="title-info">
          <h2>Artisan Dashboard</h2>
          <p>Monitor your production, inventory, and sales performance</p>
        </div>
        <div className="header-btns">
          <button className="btn-primary" onClick={() => window.print()}>
            <Download size={18} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper" style={{ background: '#eef2ff', color: '#4f46e5' }}>
              <ShoppingCart size={20} />
            </div>
            <div className="trend-indicator trend-up">
              <TrendingUp size={14} />
              <span>Active</span>
            </div>
          </div>
          <span className="stat-label">Total Sales</span>
          <span className="stat-value">₹{stats.totalSales.toLocaleString()}</span>
        </div>


        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper" style={{ background: '#f8fafc', color: '#64748b' }}>
              <Package size={20} />
            </div>
          </div>
          <span className="stat-label">Live Products</span>
          <span className="stat-value">{stats.activeProducts} Items</span>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper" style={{ background: '#fef2f2', color: '#ef4444' }}>
              <Box size={20} />
            </div>
          </div>
          <span className="stat-label">Materials Tracked</span>
          <span className="stat-value">{stats.materialsCount} Types</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <div>
              <h3>Materials Intake</h3>
              <p>Weekly quantity of materials added to inventory</p>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#4f46e5' }}></div>
                <span>Quantity</span>
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={materialsIntake}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <div>
              <h3>Sales Profits</h3>
              <p>Net profit trends over the last 7 months</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={salesProfit}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>


        </div>
      </div>

    </>
  );
};

export default Dashboard;
