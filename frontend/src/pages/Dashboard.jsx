import React, { useState, useEffect } from 'react';
import api from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calendar, AlertCircle } from 'lucide-react';
import { usePopup } from '../context/PopupContext';

const COLORS = {
    PRESENT: 'rgb(34, 197, 94)',
    ABSENT: 'rgb(239, 68, 68)',
    HALF_DAY: 'rgb(245, 158, 11)'
};

export default function Dashboard() {
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(today);
    const [stats, setStats] = useState([]);
    const { addPopup } = usePopup();

    useEffect(() => {
        const fetchStats = async () => {
             // setLoading(true); // Loader handled by interceptor
            try {
                const res = await api.get(`/attendance/?date=${date}`);
                const data = res.data;
                
                if (data.length === 0) {
                    addPopup('No attendance data available for the selected date', 'info');
                    setStats([]);
                } else {
                    const summary = data.reduce((acc, curr) => {
                        acc[curr.status] = (acc[curr.status] || 0) + 1;
                        return acc;
                    }, {});
                    
                    const chartData = Object.keys(summary).map(key => ({
                        name: key.replace('_', ' '),
                        value: summary[key]
                    }));
                    setStats(chartData);
                }
            } catch {
                console.error('Error fetching stats');
            } finally {
                // setLoading(false);
            }
        };

        fetchStats();
    }, [date, addPopup]);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        if (selectedDate > today) {
            addPopup("Cannot select future dates", 'error');
            return;
        }
        setDate(selectedDate);
    }

    return (
        <div className="container animate-fade-in">
             <div className="header">
                  <div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Dashboard</h2>
                    <p style={{ margin: 0, color: 'rgb(var(--text-muted))' }}>Overview for {date === today ? 'Today' : date}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input 
                        type="date" 
                        value={date} 
                        max={today}
                        onChange={handleDateChange} 
                        style={{ maxWidth: '200px' }}
                      />
                  </div>
             </div>

             <div className="glass-panel card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {stats.length > 0 ? (
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={stats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name.replace(' ', '_')] || '#8884d8'} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgb(var(--bg-card))', borderRadius: '8px', border: '1px solid var(--border)' }} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', color: 'rgb(var(--text-muted))' }}>
                        <Calendar size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                        <p>No attendance records found for this date.</p>
                    </div>
                )}
             </div>
        </div>
    );
}
