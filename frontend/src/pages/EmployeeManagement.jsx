import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Search } from 'lucide-react';
import { usePopup } from '../context/PopupContext';
import api from '../api';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
      full_name: '', email: '', department: ''
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const { addPopup } = usePopup();

  useEffect(() => {
    const loadEmployees = async () => {
        try {
            const res = await api.get('/employees/');
            setEmployees(res.data);
        } catch {
            // Interceptor handles error popup
        }
    };
    loadEmployees();
  }, [refreshKey]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await api.post('/employees/', form);
          setForm({ full_name: '', email: '', department: '' });
          addPopup('Employee added successfully', 'success');
          setRefreshKey(k => k + 1);
      } catch {
          // Interceptor handles error popup
      }
  };

  const handleDelete = async (id) => {
      if(!window.confirm('Are you sure you want to delete this employee?')) return;
      try {
          await api.delete(`/employees/${id}/`);
          addPopup('Employee deleted successfully', 'success');
          setRefreshKey(k => k + 1);
      } catch {
           // Interceptor handles error popup
      }
  };

  return (
      <div className="container animate-fade-in">
          <div className="header">
              <h2>Employee Management</h2>
          </div>
          
          <div className="grid-layout">
              {/* Form */}
              <div className="glass-panel card">
                  <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserPlus size={20} color="rgb(var(--primary))"/> Add New Employee
                  </h3>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Employee ID is auto-generated */}
                      <div>
                          <label>Full Name</label>
                          <input required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="John Doe" />
                      </div>
                      <div>
                          <label>Email</label>
                          <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" />
                      </div>
                      <div>
                          <label>Department</label>
                          <input required value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="Engineering" />
                      </div>
                      
                      <button type="submit" className="btn btn-primary">
                          Add Employee
                      </button>
                  </form>
              </div>

              {/* Table */}
              <div className="glass-panel card" style={{ overflowX: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>All Employees</h3>
                    <div style={{ padding: '0.5rem', background: 'var(--bg-input)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Search size={16} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{employees.length} Records</span>
                    </div>
                  </div>
                  
                  {employees.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'rgb(var(--text-muted))' }}>No employees found.</div>
                  ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Joined</th>
                                <th>Dept</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td><span style={{ background: 'rgba(var(--primary), 0.1)', color: 'rgb(var(--primary))', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontFamily: 'monospace' }}>{emp.employee_id}</span></td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{emp.full_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                                    </td>
                                    <td>{emp.joining_date}</td>
                                    <td>{emp.department}</td>
                                    <td>
                                        <button onClick={() => handleDelete(emp.id)} className="btn-danger" style={{ padding: '0.4rem', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  )}
              </div>
          </div>
      </div>
  );
}
