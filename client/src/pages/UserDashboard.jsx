import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

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
        } catch (err) {
            console.error("Failed to fetch history");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
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
                theme: { color: "#3399cc" }
            };

            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', async function (response) {
                await API.post('/payment/verify', {
                    donationId: data.donationId,
                    status: 'failed'
                });
                toast.error("Payment Failed");
                fetchHistory(user.id); 
            });

            rzp.open();
        } catch (err) { toast.error("Donation initiation failed"); }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Hello, {user.name}</h2>
                <button onClick={handleLogout} style={{ background: '#dc3545' }}>Logout</button>
            </div>

            <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>Make a Donation</h3>
                <input type="number" placeholder="Amount (INR)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ maxWidth: '300px' }} />
                <button onClick={handleDonation}>Donate</button>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h3>Your Donation History</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ background: '#eee', textAlign: 'left' }}>
                            <th style={{ padding: '8px' }}>Amount</th>
                            <th style={{ padding: '8px' }}>Status</th>
                            <th style={{ padding: '8px' }}>Date</th>
                            <th style={{ padding: '8px' }}>Payment ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myDonations.map(d => (
                            <tr key={d._id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>₹{d.amount}</td>
                                <td style={{ padding: '8px', color: d.status === 'success' ? 'green' : 'red' }}>
                                    {d.status.toUpperCase()}
                                </td>
                                <td style={{ padding: '8px' }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '8px', fontSize: '12px', color: '#666' }}>{d.paymentId || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserDashboard;