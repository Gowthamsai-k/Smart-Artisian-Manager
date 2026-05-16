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
  Truck,
  Home
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
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();

  // States for graphs
  const [materialsIntake, setMaterialsIntake] = useState([]);
  const [salesProfit, setSalesProfit] = useState([]);

  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    dailyEarnings: 0,
    activeProducts: 0,
    materialsCount: 0
  });

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // Helper for independent fetching
    const safeFetch = async (url) => {
      try {
        return await axios.get(url, { headers, withCredentials: true });
      } catch (err) {
        console.error(`Fetch failed for ${url}:`, err);
        return { data: { success: false } };
      }
    };

    const [salesRes, productsRes, materialsRes, saleStatsRes, materialStatsRes] = await Promise.all([
      safeFetch('http://localhost:3000/api/sales/all'),
      safeFetch('http://localhost:3000/api/sales/products'),
      safeFetch('http://localhost:3000/api/material/all'),
      safeFetch('http://localhost:3000/api/sales/stats'),
      safeFetch('http://localhost:3000/api/material/stats')
    ]);

    if (salesRes.data.success) {
      const salesData = salesRes.data.sales || [];
      const total = salesData.reduce((acc, sale) => acc + (sale.price || 0), 0);
      
      // Calculate daily earnings
      const today = new Date().setHours(0,0,0,0);
      const daily = salesData
        .filter(sale => new Date(sale.date).setHours(0,0,0,0) === today)
        .reduce((acc, sale) => acc + (sale.price || 0), 0);

      setStats(prev => ({ 
        ...prev, 
        totalSales: total, 
        totalProfit: total * 0.4,
        dailyEarnings: daily
      }));
    }

    if (productsRes.data.success) {
      const productData = productsRes.data.products || [];
      setStats(prev => ({ ...prev, activeProducts: productData.length }));
    }

    if (materialsRes.data.success) {
      const materialData = materialsRes.data.materials || [];
      setStats(prev => ({ ...prev, materialsCount: materialData.length }));
    }

    if (saleStatsRes.data.success && saleStatsRes.data.stats) {
      setSalesProfit(saleStatsRes.data.stats);
    } else {
      setSalesProfit([]);
    }

    if (materialStatsRes.data.success && materialStatsRes.data.stats) {
      setMaterialsIntake(materialStatsRes.data.stats);
    } else {
      setMaterialsIntake([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = async (period) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/sales/export?period=${period}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analysis_${period}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="dashboard-wrapper">

      <div className="header-section">
        <div className="title-info">
          <h2>Artisan Dashboard</h2>
          <p>Monitor your production, inventory, and sales performance</p>
        </div>
        <div className="header-btns" style={{ display: 'flex', gap: '10px' }}>
          <div className="export-group" style={{ display: 'flex', background: '#f8fafc', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <button className="export-btn" onClick={() => handleExport('monthly')} title="Monthly Report">Month</button>
            <button className="export-btn" onClick={() => handleExport('quarterly')} title="Quarterly Report">Quarter</button>
            <button className="export-btn" onClick={() => handleExport('yearly')} title="Yearly Report">Year</button>
          </div>
          <button className="btn-primary" onClick={() => window.print()}>
            <Download size={18} />
            <span>Print Dashboard</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper" style={{ background: '#f0f4e8', color: '#556B2F' }}>
              <ShoppingCart size={20} />
            </div>
            <div className="trend-indicator trend-up">
              <TrendingUp size={14} />
              <span>Active</span>
            </div>
          </div>
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">₹{stats.totalSales.toLocaleString()}</span>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper" style={{ background: '#fffbeb', color: '#d97706' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <span className="stat-label">Daily Earning</span>
          <span className="stat-value">₹{stats.dailyEarnings.toLocaleString()}</span>
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
                <div className="legend-dot" style={{ background: '#556B2F' }}></div>
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
                <Bar dataKey="amount" fill="#556B2F" radius={[4, 4, 0, 0]} barSize={30} />
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
                    <stop offset="5%" stopColor="#556B2F" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#556B2F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#556B2F"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>


        </div>
      </div>

    </div>
  );
};

export default Dashboard;
