import { useNavigate, Link } from 'react-router-dom';

function Navbar({ user }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-content">
                <Link to="/" className="nav-brand">
                    <span>NGO Portal</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {user ? (
                        <>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                Hello, {user.name.split(' ')[0]}
                            </span>
                            <button onClick={handleLogout} className="btn-outline">Logout</button>
                        </>
                    ) : (
                        <Link to="/login">
                            <button className="btn-outline">Login</button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;