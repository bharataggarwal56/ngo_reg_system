import { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', role: 'user', adminKey: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', formData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2 style={{ fontSize: '2rem', color: '#1e40af', marginBottom: '5px' }}>Join NSS</h2>
                <p style={{ color: '#64748b', marginBottom: '25px' }}>Create your volunteer account</p>
                
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Full Name" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input type="email" placeholder="Email Address" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <input type="text" placeholder="Phone (Optional)" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    
                    <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                        <option value="user">Donor / Student</option>
                        <option value="admin">Administrator</option>
                    </select>

                    {formData.role === 'admin' && (
                        <input type="password" placeholder="Admin Secret Key" required
                               style={{ borderColor: '#ef4444', background: '#fef2f2' }}
                               onChange={(e) => setFormData({...formData, adminKey: e.target.value})} />
                    )}

                    <button type="submit" className="btn-primary">Create Account</button>
                </form>
                
                <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>
                    Already registered? <Link to="/login" style={{ color: '#2563eb', fontWeight: 'bold' }}>Login</Link>
                </p>
            </div>
        </div>
    );
}
export default Register;