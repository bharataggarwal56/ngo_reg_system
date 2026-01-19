import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';
import Navbar from '../Navbar';

function UserDashboard() {
    const [user, setUser] = useState(null);
    const [amount, setAmount] = useState('');
    const [myDonations, setMyDonations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) navigate('/login');
        else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchHistory(parsedUser.id);
        }
    }, []);

    const fetchHistory = async (userId) => {
        try {
            const { data } = await API.get(`/payment/my-donations/${userId}`);
            setMyDonations(data);
        } catch (err) { console.error("Failed to fetch history"); }
    };

    const handleDonation = async () => {
        if (!amount || amount <= 0) return toast.error("Enter a valid amount");
        try {
            const { data } = await API.post('/payment/checkout', { amount, userId: user.id });
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: "NSS Donation",
                description: "Social Welfare Fund",
                order_id: data.order.id,
                retry: { enabled: false },
                handler: async function (response) {
                    try {
                        const verifyRes = await API.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            donationId: data.donationId
                        });
                        if (verifyRes.data.status === 'success') {
                            toast.success("Donation Successful!");
                            setAmount('');
                            fetchHistory(user.id);
                        }
                    } catch (err) { toast.error("Verification failed"); }
                },
                theme: { color: "#2563eb" }
            };
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', async function (response) {
                await API.post('/payment/verify', { donationId: data.donationId, status: 'failed' });
                toast.error("Payment Failed");
                fetchHistory(user.id);
            });
            rzp.open();
        } catch (err) { toast.error("Donation initiation failed"); }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <>
            <Navbar user={user} />
            <div className="container">
                <div className="card">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#1e40af' }}>My Profile</h2>
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                        <div><small style={{color:'#64748b'}}>NAME</small><div style={{fontWeight:'bold'}}>{user.name}</div></div>
                        <div><small style={{color:'#64748b'}}>EMAIL</small><div style={{fontWeight:'bold'}}>{user.email}</div></div>
                        <div><small style={{color:'#64748b'}}>PHONE</small><div style={{fontWeight:'bold'}}>{user.phone || 'N/A'}</div></div>
                    </div>
                </div>

                <div className="card">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#1e40af' }}>Make a Contribution</h2>
                    <p style={{ color: '#64748b', marginBottom: '20px' }}>Your support helps us organize more camps and activities.</p>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', maxWidth: '500px' }}>
                        <input type="number" placeholder="Enter Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ margin: 0 }} />
                        <button onClick={handleDonation} className="btn-primary" style={{ width: 'auto' }}>Donate</button>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '20px' }}>Donation History</h3>
                    <table>
                        <thead><tr><th>Date</th><th>Amount</th><th>Status</th><th>Reference ID</th></tr></thead>
                        <tbody>
                            {myDonations.length > 0 ? myDonations.map(d => (
                                <tr key={d._id}>
                                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                                    <td style={{ fontWeight: 'bold' }}>₹ {d.amount}</td>
                                    <td><span className={`badge badge-${d.status}`}>{d.status.toUpperCase()}</span></td>
                                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{d.paymentId || '---'}</td>
                                </tr>
                            )) : <tr><td colSpan="4" style={{ textAlign: 'center', color: '#64748b' }}>No donations yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
export default UserDashboard;