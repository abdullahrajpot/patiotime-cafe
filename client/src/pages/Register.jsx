import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register as registerUser } from '../api';
import { HERO_ABOUT } from '../utils/images';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = data;
      const response = await registerUser(dataToSend);
      
      // Save token and user data to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('auth-change'));
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="hero hero-page" style={{ backgroundImage: `url('${HERO_ABOUT}')` }}>
        <div className="container hero-inner">
          <h1>REGISTER</h1>
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
              <h2>Create Account</h2>
              <p className="auth-subtitle">Join PatioTime Cafe</p>

              {error && (
                <ErrorMessage message={error} type="error" />
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <div className="form-row">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <span className="error-text">{errors.name.message}</span>
                  )}
                </div>

                <div className="form-row">
                  <label htmlFor="email">Email Address *</label>
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
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="form-input"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    {...register('address')}
                    className="form-input"
                    placeholder="Your address"
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    {...register('password')}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Minimum 6 characters"
                  />
                  {errors.password && (
                    <span className="error-text">{errors.password.message}</span>
                  )}
                </div>

                <div className="form-row">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Re-enter your password"
                  />
                  {errors.confirmPassword && (
                    <span className="error-text">{errors.confirmPassword.message}</span>
                  )}
                </div>

                <button type="submit" className="btn btn-solid btn-full" disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" inline />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
