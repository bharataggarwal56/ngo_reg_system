import { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', formData);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            toast.success('Login Successful');

            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container" style={{ marginTop: '50px', maxWidth: '400px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" placeholder="Email" required 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                <input 
                    type="password" placeholder="Password" required 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button type="submit" style={{ width: '100%' }}>Login</button>
            </form>
            <p style={{ marginTop: '10px' }}>
                New here? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login;