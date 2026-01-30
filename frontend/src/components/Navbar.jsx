import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, ClipboardList, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel" style={{ 
      margin: '1.5rem 1.5rem 0', 
      padding: '1rem 2rem',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgb(var(--primary))', padding: '0.5rem', borderRadius: '12px' }}>
          <LayoutDashboard size={24} color="white" />
        </div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          HRMS <span style={{ color: 'rgb(var(--primary))' }}>Lite</span>
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Link to="/" tabIndex="-1">
           <button className={`btn ${isActive('/') ? 'btn-primary' : 'btn-secondary'}`}>
             <LayoutDashboard size={18} /> <span className="hide-mobile">Dashboard</span>
           </button>
        </Link>
        <Link to="/employees" tabIndex="-1">
           <button className={`btn ${isActive('/employees') ? 'btn-primary' : 'btn-secondary'}`}>
             <Users size={18} /> <span className="hide-mobile">Employees</span>
           </button>
        </Link>
        <Link to="/attendance" tabIndex="-1">
           <button className={`btn ${isActive('/attendance') ? 'btn-primary' : 'btn-secondary'}`}>
             <ClipboardList size={18} /> <span className="hide-mobile">Attendance</span>
           </button>
        </Link>
        
        <button className="btn btn-secondary" onClick={toggleTheme} aria-label="Toggle Theme" style={{ padding: '0.6rem' }}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
