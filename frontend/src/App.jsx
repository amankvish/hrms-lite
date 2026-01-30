import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EmployeeManagement from './pages/EmployeeManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import { PopupProvider, usePopup } from './context/PopupContext';
import { LoaderProvider, useLoader } from './context/LoaderContext';
import { setupInterceptors } from './api';

const AppContent = () => {
    const { addPopup } = usePopup();
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        setupInterceptors(showLoader, hideLoader, addPopup);
    }, [showLoader, hideLoader, addPopup]); // Run when these change (almost never)

    return (
        <Router>
          <Navbar />
          <div style={{ flex: 1, paddingBottom: '2rem' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeeManagement />} />
              <Route path="/attendance" element={<AttendanceManagement />} />
            </Routes>
          </div>
          <footer style={{ textAlign: 'center', padding: '1rem', color: 'rgb(var(--text-muted))', fontSize: '0.9rem', borderTop: '1px solid var(--border)' }}>
            HRMS Lite &copy; 2026
          </footer>
        </Router>
    );
}

function App() {
  return (
    <ThemeProvider>
      <LoaderProvider>
        <PopupProvider>
            <AppContent />
        </PopupProvider>
      </LoaderProvider>
    </ThemeProvider>
  );
}

export default App;
