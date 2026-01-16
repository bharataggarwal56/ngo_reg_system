import { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', role: 'user'
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
        <div className="container" style={{ marginTop: '50px', maxWidth: '400px' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" placeholder="Name" required 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
                <input 
                    type="email" placeholder="Email" required 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                <input 
                    type="password" placeholder="Password" required 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <input 
                    type="text" placeholder="Phone" 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
                
                <div style={{ margin: '10px 0' }}>
                    <label>Role: </label>
                    <select 
                        value={formData.role} 
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        style={{ padding: '5px' }}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button type="submit" style={{ width: '100%' }}>Register</button>
            </form>
            <p style={{ marginTop: '10px' }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default Register;