import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalDonations: 0 });
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [view, setView] = useState('users'); 
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const statsRes = await API.get('/admin/stats');
            setStats(statsRes.data);

            const usersRes = await API.get('/admin/users');
            setUsers(usersRes.data);

            const donationsRes = await API.get('/admin/donations');
            setDonations(donationsRes.data);
        } catch (err) {
            console.error("Admin fetch error", err);
        }
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Name,Email,Phone,Joined\n"
            + users.map(u => `${u.name},${u.email},${u.phone},${u.createdAt}`).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users_data.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="container" style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Admin Dashboard</h2>
                <button onClick={() => {
                    localStorage.clear();
                    navigate('/login');
                }} style={{ background: '#dc3545' }}>Logout</button>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '8px', flex: 1 }}>
                    <h3>Total Users</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalUsers}</p>
                </div>
                <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px', flex: 1 }}>
                    <h3>Total Donations</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>₹ {stats.totalDonations}</p>
                </div>
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <button onClick={() => setView('users')} style={{ marginRight: '10px', background: view === 'users' ? '#0056b3' : '#007bff' }}>Users</button>
                    <button onClick={() => setView('donations')} style={{ background: view === 'donations' ? '#0056b3' : '#007bff' }}>Donations</button>
                </div>
                
                {view === 'users' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            placeholder="Search by Name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '200px', margin: 0 }}
                        />
                        <button onClick={handleExport} style={{ background: '#28a745' }}>Export CSV</button>
                    </div>
                )}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                <thead>
                    <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                        {view === 'users' ? (
                            <>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Name</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Email</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Phone</th>
                            </>
                        ) : (
                            <>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Donor</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Amount</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Status</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Date</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {view === 'users' ? users
                        .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(u => (
                        <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{u.name}</td>
                            <td style={{ padding: '10px' }}>{u.email}</td>
                            <td style={{ padding: '10px' }}>{u.phone}</td>
                        </tr>
                    )) : donations.map(d => (
                        <tr key={d._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{d.userId?.name || 'Unknown'}</td>
                            <td style={{ padding: '10px' }}>₹ {d.amount}</td>
                            <td style={{ padding: '10px', color: d.status === 'success' ? 'green' : 'red' }}>
                                {d.status.toUpperCase()}
                            </td>
                            <td style={{ padding: '10px' }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;