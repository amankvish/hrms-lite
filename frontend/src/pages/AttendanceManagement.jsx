import React, { useState, useEffect } from 'react';
import api from '../api';
import { CalendarCheck, Filter, User } from 'lucide-react';
import { usePopup } from '../context/PopupContext';

const STATUS_OPTIONS = [
    { value: 'PRESENT', label: 'Present', color: 'rgb(34, 197, 94)' },
    { value: 'ABSENT', label: 'Absent', color: 'rgb(239, 68, 68)' },
    { value: 'HALF_DAY', label: 'Half Day', color: 'rgb(245, 158, 11)' }
];

export default function AttendanceManagement() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { addPopup } = usePopup();
  
  const today = new Date().toISOString().split('T')[0];
  
  const [form, setForm] = useState({
      employee: '', date: today, status: 'PRESENT'
  });
  
  const [filters, setFilters] = useState({
      startDate: today, endDate: today
  });
  const [refreshKey, setRefreshKey] = useState(0);

// Fetches moved to useEffect



  useEffect(() => {
    const loadEmployees = async () => {
        try {
            const res = await api.get('/employees/');
            setEmployees(res.data);
        } catch { console.error('Error fetching employees'); }
    };
    loadEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
        const loadAttendance = async () => {
            try {
                let query = '?';
                if (filters.startDate) query += `date=${filters.startDate}`; 
                
                const res = await api.get(`/attendance/${query}`);
                
                const records = res.data;
                const lookup = new Map();
                records.forEach(r => lookup.set(r.employee, r));
                
                const merged = employees.map(emp => {
                    const record = lookup.get(emp.id);
                    return {
                        id: record ? record.id : `nomark-${emp.id}`,
                        employee_name: emp.full_name,
                        employee_id_str: emp.employee_id,
                        date: filters.startDate,
                        status: record ? record.status : 'NOT_MARKED',
                        original: record
                    };
                });
                
                setAttendance(merged);
            } catch {
                console.log('Error fetching attendance');
            } 
        };
        loadAttendance();
    }
  }, [filters, employees, refreshKey]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (form.date > today) {
          addPopup('Cannot mark attendance for future dates', 'error');
          return;
      }

      try {
          await api.post('/attendance/', form);
          addPopup('Attendance marked successfully', 'success');
          setRefreshKey(k => k + 1);
          // Reset only employee to allow quick marking
          setForm(prev => ({ ...prev, employee: '' }));
      } catch {
         // Error handled by interceptor
      }
  };

  const setToday = () => {
      setForm(prev => ({ ...prev, date: today }));
  };

  return (
      <div className="container animate-fade-in">
          <div className="header">
              <h2>Attendance Management</h2>
          </div>
          
          <div className="grid-layout">
              {/* Form */}
              <div className="glass-panel card">
                  <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CalendarCheck size={20} color="rgb(var(--primary))"/> Mark Attendance
                  </h3>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                          <label>Date</label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="date" 
                                required 
                                max={today}
                                value={form.date} 
                                onChange={e => {
                                    if(e.target.value > today) {
                                        addPopup('Future dates are disabled', 'error');
                                        return;
                                    }
                                    setForm({...form, date: e.target.value});
                                }} 
                            />
                            <button type="button" onClick={setToday} className="btn btn-secondary">Today</button>
                          </div>
                      </div>

                      <div>
                          <label>Employee</label>
                          <div style={{ position: 'relative' }}>
                            <select required value={form.employee} onChange={e => setForm({...form, employee: e.target.value})} style={{ appearance: 'none' }}>
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_id})</option>
                                ))}
                            </select>
                            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgb(var(--text-muted))' }}>
                                <User size={16} />
                            </div>
                          </div>
                      </div>
                      
                      <div>
                          <label>Status</label>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                             {STATUS_OPTIONS.map(opt => (
                                 <div 
                                    key={opt.value}
                                    onClick={() => setForm({...form, status: opt.value})}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: form.status === opt.value ? `2px solid ${opt.color}` : '1px solid var(--border)',
                                        background: form.status === opt.value ? 'rgba(0,0,0,0.05)' : 'transparent',
                                        fontWeight: 600,
                                        color: opt.color,
                                        fontSize: '0.9rem',
                                        flex: 1,
                                        textAlign: 'center'
                                    }}
                                 >
                                     {opt.label}
                                 </div>
                             ))}
                          </div>
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                          Submit Attendance
                      </button>
                  </form>
              </div>

              {/* List */}
              <div className="glass-panel card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Attendance Log</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={16} color="rgb(var(--text-muted))" />
                        <input 
                            type="date" 
                            value={filters.startDate} 
                            onChange={e => setFilters({...filters, startDate: e.target.value})} 
                            style={{ padding: '0.4rem', width: 'auto' }}
                        />
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>ID</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.length === 0 ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No data for this date</td></tr>
                            ) : (
                                attendance.map(record => (
                                    <tr key={record.id}>
                                        <td>{record.employee_name}</td>
                                        <td><span style={{ fontFamily: 'monospace', opacity: 0.7 }}>{record.employee_id_str}</span></td>
                                        <td>
                                            <span style={{ 
                                                padding: '0.3rem 0.8rem', 
                                                borderRadius: '20px', 
                                                fontSize: '0.8rem', 
                                                fontWeight: 600,
                                                background: record.status === 'NOT_MARKED' ? 'rgba(100, 116, 139, 0.2)' : 
                                                            STATUS_OPTIONS.find(s => s.value === record.status)?.color + '20',
                                                color: record.status === 'NOT_MARKED' ? 'rgb(var(--text-muted))' :
                                                       STATUS_OPTIONS.find(s => s.value === record.status)?.color
                                            }}>
                                                {record.status === 'NOT_MARKED' ? 'Not Marked' : STATUS_OPTIONS.find(s => s.value === record.status)?.label}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                  </div>
              </div>
          </div>
      </div>
  );
}
