import { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Welcome back!');
            navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2 style={{ fontSize: '2rem', color: '#1e40af', marginBottom: '5px' }}>Member Login</h2>
                <p style={{ color: '#64748b', marginBottom: '25px' }}>Access the NSS Volunteer Portal</p>
                
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />

                    <div style={{ position: 'relative', width: '100%' }}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            required 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            style={{ paddingRight: '40px' }} 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '35%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: '#64748b'
                            }}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "Hide" : "Unhide"}
                        </button>
                    </div>

                    <button type="submit" className="btn-primary">Sign In</button>
                </form>

                <div style={{ 
                    marginTop: '20px', 
                    padding: '10px', 
                    background: '#f1f5f9', 
                    borderRadius: '8px', 
                    fontSize: '0.85rem', 
                    color: '#475569',
                    border: '1px dashed #cbd5e1'
                }}>
                    <strong>For Admin Demo Access:</strong><br/>
                    Email: <code>admin1@iitr.ac.in</code><br/>
                    Password: <code>admin1</code>
                </div>

                <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: 'bold' }}>Register</Link>
                    </p>
                    <p style={{ marginTop: '10px' }}>
                        <Link to="/" style={{ color: '#64748b', fontSize: '0.9rem', textDecoration: 'none' }}>← Back to Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;