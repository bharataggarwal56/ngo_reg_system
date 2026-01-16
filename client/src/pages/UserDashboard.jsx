import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

function UserDashboard() {
    const [user, setUser] = useState(null);
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) navigate('/login');
        setUser(JSON.parse(storedUser));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleDonation = async () => {
        if (!amount || amount <= 0) return toast.error("Enter a valid amount");

        try {
            const { data } = await API.post('/payment/checkout', { 
                amount: amount, 
                userId: user.id 
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: "NSS IIT Roorkee",
                description: "Donation to Nation",
                order_id: data.order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await API.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            donationId: data.donationId
                        });

                        if (verifyRes.data.status === 'success') {
                            toast.success("Donation Successful! Thank you.");
                            setAmount('');
                        } else {
                            toast.error("Verification failed");
                        }
                    } catch (err) {
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: { color: "#3399cc" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            toast.error("Donation initiation failed");
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Welcome, {user.name}</h2>
                <button onClick={handleLogout} style={{ background: '#dc3545' }}>Logout</button>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>Make a Donation</h3>
                <p>Support the cause explicitly managed by NSS.</p>
                
                <input 
                    type="number" 
                    placeholder="Enter Amount (INR)" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ maxWidth: '300px', display: 'block' }}
                />
                
                <button onClick={handleDonation} style={{ marginTop: '10px' }}>
                    Donate Now
                </button>
            </div>
        </div>
    );
}

export default UserDashboard;