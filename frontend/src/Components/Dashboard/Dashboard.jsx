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
  ChevronRight
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
import { Link } from 'react-router-dom';
import HeaderMenu from '../NavBar/HeaderMenu';
import './Dashboard.css';

const Dashboard = () => {
  // Real-time states
  const [moneyFlow, setMoneyFlow] = useState([
    { name: 'W1', credited: 4000, debited: 2400 },
    { name: 'W2', credited: 5500, debited: 1800 },
    { name: 'W3', credited: 3800, debited: 3500 },
    { name: 'W4', credited: 6200, debited: 2800 },
    { name: 'W5', credited: 5000, debited: 1500 },
  ]);

  const [profitTrend, setProfitTrend] = useState([
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Apr', value: 61 },
    { name: 'May', value: 55 },
    { name: 'Jun', value: 67 },
    { name: 'Jul', value: 85 },
  ]);

  const [stats, setStats] = useState({
    revenue: 842500,
    profit: 214840,
    artisans: 148,
    efficiency: 94.8
  });

  const [artisans, setArtisans] = useState([
    { id: 'JD', name: 'Jameson Douglas', role: 'Senior Weaver', dept: 'Textiles', units: 142, score: 4.9, efficiency: 98 },
    { id: 'SR', name: 'Sarah Rivera', role: 'Master Potter', dept: 'Ceramics', units: 89, score: 4.8, efficiency: 92 },
    { id: 'MK', name: 'Marcus Kim', role: 'Wood Carver', dept: 'Furniture', units: 54, score: 4.7, efficiency: 87 },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate Revenue & Profit
      setStats(prev => ({
        ...prev,
        revenue: prev.revenue + (Math.random() * 200 - 50),
        profit: prev.profit + (Math.random() * 100 - 30),
        efficiency: Math.min(100, Math.max(90, prev.efficiency + (Math.random() * 0.4 - 0.2)))
      }));

      // Fluctuate Money Flow (last week)
      setMoneyFlow(prev => {
        const newData = [...prev];
        const lastIndex = newData.length - 1;
        newData[lastIndex] = {
          ...newData[lastIndex],
          credited: newData[lastIndex].credited + (Math.random() * 100 - 40)
        };
        return newData;
      });

      // Fluctuate Profit Trend (last month)
      setProfitTrend(prev => {
        const newData = [...prev];
        const lastIndex = newData.length - 1;
        newData[lastIndex] = {
          ...newData[lastIndex],
          value: newData[lastIndex].value + (Math.random() * 2 - 0.8)
        };
        return newData;
      });

      // Fluctuate Artisan units slightly
      setArtisans(prev => prev.map(a => ({
        ...a,
        units: a.units + (Math.random() > 0.8 ? 1 : 0)
      })));

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Export Logic
  const handleExport = () => {
    const csvContent = [
      ["Metric", "Value"],
      ["Total Revenue", `$${stats.revenue.toFixed(2)}`],
      ["Net Profit", `$${stats.profit.toFixed(2)}`],
      ["Active Artisans", `${stats.artisans}`],
      ["Avg Efficiency", `${stats.efficiency.toFixed(1)}%`],
      [],
      ["Artisan", "Department", "Weekly Units", "Quality Score", "Efficiency"],
      ...artisans.map(a => [a.name, a.dept, a.units, a.score, `${a.efficiency}%`])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "InventoryFlow_Report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddRecord = () => {
    alert("This would normally open a form to add a new record. Connect your backend to persist this data!");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/" style={{textDecoration: 'none'}}>
          <div className="logo-section">
            <h1>InventoryFlow</h1>
            <p>Enterprise Edition</p>
          </div>
        </Link>
        
        <nav className="nav-links">
          <div className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="nav-item">
            <Package size={20} />
            <span>Production</span>
          </div>
          <div className="nav-item">
            <CreditCard size={20} />
            <span>Payments</span>
          </div>
          <div className="nav-item">
            <Users size={20} />
            <span>Artisans</span>
          </div>
        </nav>

        <button className="add-record-btn" onClick={handleAddRecord}>
          <Plus size={20} />
          <span>Add Record</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <HeaderMenu variant="dashboard" />

        {/* Header */}
        <div className="header-section">
          <div className="title-info">
            <h2>Executive Overview</h2>
            <p>Real-time performance analytics for Q3 Operations</p>
          </div>
          <div className="header-btns">
            <button className="btn-secondary" onClick={() => alert("Filter functionality coming soon!")}>
              <Calendar size={18} />
              <span>Last 30 Days</span>
            </button>
            <button className="btn-primary" onClick={handleExport}>
              <Download size={18} />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon-wrapper" style={{background: '#eef2ff', color: '#4f46e5'}}>
                <CreditCard size={20} />
              </div>
              <div className="trend-indicator trend-up">
                <TrendingUp size={14} />
                <span>12.5%</span>
              </div>
            </div>
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">${stats.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon-wrapper" style={{background: '#f0fdf4', color: '#10b981'}}>
                <TrendingUp size={20} />
              </div>
              <div className="trend-indicator trend-up">
                <TrendingUp size={14} />
                <span>8.2%</span>
              </div>
            </div>
            <span className="stat-label">Net Profit</span>
            <span className="stat-value">${stats.profit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon-wrapper" style={{background: '#f8fafc', color: '#64748b'}}>
                <Users size={20} />
              </div>
              <div className="trend-indicator trend-stable">
                <span>Stable</span>
              </div>
            </div>
            <span className="stat-label">Active Artisans</span>
            <span className="stat-value">{stats.artisans} Units</span>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon-wrapper" style={{background: '#fef2f2', color: '#ef4444'}}>
                <TrendingDown size={20} />
              </div>
              <div className="trend-indicator trend-down">
                <TrendingDown size={14} />
                <span>2.4%</span>
              </div>
            </div>
            <span className="stat-label">Avg Efficiency</span>
            <span className="stat-value">{stats.efficiency.toFixed(1)}%</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <div className="chart-container">
            <div className="chart-header">
              <div>
                <h3>Money Flow</h3>
                <p>Comparison of credits vs debits per week</p>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-dot" style={{background: '#4f46e5'}}></div>
                  <span>Credited</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{background: '#cbd5e1'}}></div>
                  <span>Debited</span>
                </div>
              </div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={moneyFlow}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="credited" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} isAnimationActive={false} />
                  <Bar dataKey="debited" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <div>
                <h3>Profit Trend</h3>
                <p>Net growth month-over-month</p>
              </div>
            </div>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <AreaChart data={profitTrend}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem'}}>
               <div style={{textAlign: 'center'}}>
                 <div style={{fontSize: '0.7rem', color: '#64748b', fontWeight: 600}}>Min</div>
                 <div style={{fontSize: '0.9rem', fontWeight: 700}}>$12.4k</div>
               </div>
               <div style={{textAlign: 'center'}}>
                 <div style={{fontSize: '0.7rem', color: '#64748b', fontWeight: 600}}>Avg</div>
                 <div style={{fontSize: '0.9rem', fontWeight: 700}}>$45.8k</div>
               </div>
               <div style={{textAlign: 'center'}}>
                 <div style={{fontSize: '0.7rem', color: '#64748b', fontWeight: 600}}>Max</div>
                 <div style={{fontSize: '0.9rem', fontWeight: 700}}>$94.2k</div>
               </div>
            </div>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="table-section">
          <div className="table-header">
            <div>
              <h3>Artisan Efficiency Rankings</h3>
              <p>Top performing individuals by output & quality</p>
            </div>
            <a href="#" className="view-all" onClick={() => alert("Navigating to all artisans...")}>View All Artisans</a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Artisan</th>
                <th>Department</th>
                <th>Weekly Units</th>
                <th>Quality Score</th>
                <th>Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {artisans.map((artisan) => (
                <tr key={artisan.id}>
                  <td>
                    <div className="artisan-info" style={{cursor: 'pointer'}} onClick={() => alert(`Viewing profile for ${artisan.name}`)}>
                      <div className="avatar">{artisan.id}</div>
                      <div className="name-role">
                        <h4>{artisan.name}</h4>
                        <p>{artisan.role}</p>
                      </div>
                    </div>
                  </td>
                  <td>{artisan.dept}</td>
                  <td>{artisan.units}</td>
                  <td>
                    <div className="quality-score">
                      <Star size={14} className="star-icon" fill="currentColor" />
                      <span>{artisan.score}</span>
                    </div>
                  </td>
                  <td>
                    <div className="efficiency-bar-wrapper">
                      <div className="efficiency-bar">
                        <div className="efficiency-fill" style={{width: `${artisan.efficiency}%`}}></div>
                      </div>
                      <div className="efficiency-text">{artisan.efficiency}%</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
