import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import '../styles/Auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await registerUser({ name, email, password });
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Email may already exist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">🐸</div>
                <h1 className="auth-brand">spendwise</h1>
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Start tracking your finances today</p>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="Hameer Shaik"
                            value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="you@example.com"
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>
                <p className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;