/**
 * Data Masking Utilities
 * Mask sensitive information in public-facing APIs
 */

/**
 * Mask phone number
 * Example: "555-123-4567" → "***-***-4567"
 * Example: "5551234567" → "*******4567"
 */
function maskPhone(phone) {
  if (!phone) return null;
  
  const cleaned = phone.replace(/\D/g, ''); // Remove non-digits
  
  if (cleaned.length >= 4) {
    const lastFour = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4) + lastFour;
    
    // Try to preserve original formatting
    if (phone.includes('-')) {
      // Format as XXX-XXX-XXXX
      if (cleaned.length === 10) {
        return `***-***-${lastFour}`;
      }
    }
    
    return masked;
  }
  
  // If phone is too short, mask everything
  return '*'.repeat(phone.length);
}

/**
 * Mask email address
 * Example: "user@example.com" → "u***@example.com"
 */
function maskEmail(email) {
  if (!email) return null;
  
  const [local, domain] = email.split('@');
  
  if (!domain) return email; // Invalid email
  
  const maskedLocal = local.length > 2
    ? local[0] + '*'.repeat(local.length - 1)
    : '*'.repeat(local.length);
  
  return `${maskedLocal}@${domain}`;
}

/**
 * Mask address - show only city/state, hide street
 * Example: "123 Main St, Los Angeles, CA 90001" → "Los Angeles, CA"
 */
function maskAddress(address) {
  if (!address) return null;
  
  // Try to extract city and state from common address formats
  const parts = address.split(',').map(p => p.trim());
  
  if (parts.length >= 2) {
    // Assume last two parts are city and state/zip
    const city = parts[parts.length - 2];
    const stateZip = parts[parts.length - 1];
    
    // Remove ZIP code if present
    const state = stateZip.replace(/\d{5}(-\d{4})?/, '').trim();
    
    return `${city}, ${state}`;
  }
  
  // If we can't parse it, just show "***"
  return '*** (Hidden for privacy)';
}

/**
 * Mask customer name
 * Example: "John Doe" → "J*** D***"
 */
function maskName(name) {
  if (!name) return null;
  
  const parts = name.split(' ');
  
  return parts.map(part => {
    if (part.length === 0) return part;
    return part[0] + '*'.repeat(Math.max(part.length - 1, 3));
  }).join(' ');
}

/**
 * Mask order data for public tracking
 */
function maskOrderData(order) {
  return {
    ...order,
    customer_name: maskName(order.customer_name || order.customerName),
    customer_phone: maskPhone(order.customer_phone || order.customerPhone),
    customer_email: order.customer_email || order.customerEmail 
      ? maskEmail(order.customer_email || order.customerEmail) 
      : null,
    address: order.address ? maskAddress(order.address) : null,
  };
}

/**
 * Check if user should see full data (not masked)
 * Admin users or order owners see full data
 */
function shouldShowFullData(order, user) {
  if (!user) return false;
  
  // Admin users see everything
  if (user.role === 'admin') return true;
  
  // Order owner sees their own data
  if (order.user && user.userId) {
    return order.user.toString() === user.userId.toString();
  }
  
  return false;
}

module.exports = {
  maskPhone,
  maskEmail,
  maskAddress,
  maskName,
  maskOrderData,
  shouldShowFullData
};
