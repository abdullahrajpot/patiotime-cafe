import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = '', inline = false }) => {
  const sizeClasses = {
    small: '16px',
    medium: '40px',
    large: '60px',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.medium;

  const spinnerStyle = {
    width: spinnerSize,
    height: spinnerSize,
    border: size === 'small' ? '2px solid rgba(197, 160, 89, 0.2)' : '3px solid rgba(197, 160, 89, 0.2)',
    borderTop: size === 'small' ? '2px solid var(--gold)' : '3px solid var(--gold)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const Spinner = () => <div className="loading-spinner" style={spinnerStyle} />;

  if (inline) {
    return (
      <>
        <Spinner />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      gap: '12px'
    }}>
      <Spinner />
      {message && (
        <p style={{ 
          color: 'var(--muted)', 
          fontSize: '14px',
          margin: 0 
        }}>
          {message}
        </p>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
