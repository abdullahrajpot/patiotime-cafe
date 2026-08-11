import { Navigate } from 'react-router-dom';

/**
 * GuestRoute - Protects auth pages (login/register) from logged-in users
 * If user is logged in, redirect to home page
 * If user is not logged in, show the auth page
 */
export default function GuestRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // If user is logged in, redirect to home
  if (token && user) {
    return <Navigate to="/" replace />;
  }
  
  // If not logged in, show the auth page (login/register)
  return children;
}
