import { Link } from 'react-router-dom';
import Navbar from '../Navbar';

function Home() {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <>
            <Navbar user={user} />
            <div className="hero-container">
                <div className="hero-card">
                    <h1 className="hero-title">NGO Registration <br></br> And <br></br>Donation Management System</h1>
                    <p className="hero-subtitle">
                        Join the NGO movement.<br></br>
                        Your contribution empowers communities and builds a better tomorrow.
                    </p>
                    
                    {user ? (
                        <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                            <button className="btn-hero">Go to Dashboard</button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <button className="btn-hero">Donate Now</button>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}

export default Home;