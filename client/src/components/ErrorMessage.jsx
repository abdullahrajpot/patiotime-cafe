import React from 'react';

const ErrorMessage = ({ 
  message = 'Something went wrong. Please try again.', 
  onRetry, 
  type = 'error' 
}) => {
  const styles = {
    container: {
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '16px'
    },
    error: {
      backgroundColor: '#fee',
      borderColor: '#fcc',
      color: '#c33'
    },
    warning: {
      backgroundColor: '#fffbea',
      borderColor: '#ffd666',
      color: '#996600'
    },
    info: {
      backgroundColor: '#e8f4fd',
      borderColor: '#b3d9f2',
      color: '#0066cc'
    },
    icon: {
      width: '24px',
      height: '24px',
      flexShrink: 0
    },
    content: {
      flex: 1,
      fontSize: '14px',
      lineHeight: '1.5'
    },
    button: {
      marginTop: '8px',
      padding: '6px 12px',
      backgroundColor: 'transparent',
      border: '1px solid currentColor',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 500
    }
  };

  const containerStyle = {
    ...styles.container,
    ...styles[type]
  };

  return (
    <div style={containerStyle}>
      <div style={styles.icon}>
        {type === 'error' && (
          <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '100%', height: '100%' }}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'warning' && (
          <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '100%', height: '100%' }}>
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'info' && (
          <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '100%', height: '100%' }}>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div style={styles.content}>
        <p style={{ margin: 0, fontWeight: 500 }}>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={styles.button}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
