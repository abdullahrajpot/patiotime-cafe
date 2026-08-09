import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from '../api';
import { HERO_ABOUT } from '../utils/images';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    try {
      const response = await login(data);
      
      // Save token and user data to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('auth-change'));
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="hero hero-page" style={{ backgroundImage: `url('${HERO_ABOUT}')` }}>
        <div className="container hero-inner">
          <h1>LOGIN</h1>
        </div>
        <div className="wave-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="#fff" />
          </svg>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-card">
              <h2>Welcome Back</h2>
              <p className="auth-subtitle">Sign in to your account</p>

              {error && (
                <ErrorMessage message={error} type="error" />
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <div className="form-row">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email.message}</span>
                  )}
                </div>

                <div className="form-row">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    {...register('password')}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <span className="error-text">{errors.password.message}</span>
                  )}
                </div>

                <button type="submit" className="btn btn-solid btn-full" disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" inline />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Don't have an account? <Link to="/register">Register here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
