import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalDonations: 0 });
    const [data, setData] = useState({ users: [], donations: [] });
    const [view, setView] = useState('users'); 
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser?.role !== 'admin') return navigate('/login');
        setUser(storedUser);
        
        Promise.all([
            API.get('/admin/stats'),
            API.get('/admin/users'),
            API.get('/admin/donations')
        ]).then(([s, u, d]) => {
            setStats(s.data);
            setData({ users: u.data, donations: d.data });
        }).catch(console.error);
    }, []);

    const handleExport = () => {
        const csv = "Name,Email,Phone,Joined\n" + data.users.map(u => `${u.name},${u.email},${u.phone},${u.createdAt}`).join("\n");
        const link = document.createElement("a");
        link.href = encodeURI("data:text/csv;charset=utf-8," + csv);
        link.download = "users.csv";
        link.click();
    };

    const filteredUsers = data.users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <Navbar user={user} />
            <div className="container">
                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                        <h3 style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Users</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>{stats.totalUsers}</p>
                    </div>
                    <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                        <h3 style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Funds Raised</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>₹ {stats.totalDonations}</p>
                    </div>
                </div>

                <div className="card">

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        flexWrap: 'wrap', 
                        gap: '15px',
                        marginBottom: '25px',
                        borderBottom: '1px solid #f1f5f9',
                        paddingBottom: '20px'
                    }}>

                        <div style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '5px', borderRadius: '10px' }}>
                            <button 
                                onClick={() => setView('users')} 
                                className={view === 'users' ? 'btn-primary' : 'btn-secondary'}
                                style={{ width: 'auto', padding: '8px 20px', fontSize: '0.9rem' }}
                            >
                                Users
                            </button>
                            <button 
                                onClick={() => setView('donations')} 
                                className={view === 'donations' ? 'btn-primary' : 'btn-secondary'}
                                style={{ width: 'auto', padding: '8px 20px', fontSize: '0.9rem' }}
                            >
                                Donations
                            </button>
                        </div>

                        {view === 'users' && (
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input 
                                    placeholder="Search by name..." 
                                    value={search} 
                                    onChange={e => setSearch(e.target.value)} 
                                    style={{ margin: 0, width: '250px', padding: '10px' }} 
                                />
                                <button onClick={handleExport} className="btn-success" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span>⬇</span> Export CSV
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    {view === 'users' ? 
                                        ['Name', 'Email', 'Phone', 'Joined'].map(h => <th key={h}>{h}</th>) : 
                                        ['Donor', 'Amount', 'Status', 'Date', 'Ref ID'].map(h => <th key={h}>{h}</th>)
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {(view === 'users' ? filteredUsers : data.donations).map(row => (
                                    <tr key={row._id}>
                                        {view === 'users' ? (
                                            <>
                                                <td style={{ fontWeight: '600' }}>{row.name}</td>
                                                <td>{row.email}</td>
                                                <td style={{ color: '#64748b' }}>{row.phone || '-'}</td>
                                                <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{row.userId?.name || 'Unknown'}</td>
                                                <td style={{ fontWeight: 'bold' }}>₹ {row.amount}</td>
                                                <td>
                                                    <span className={`badge badge-${row.status}`}>
                                                        {row.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                                                <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{row.paymentId || 'N/A'}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;