// Authentication error messages
export const getAuthErrorMessage = (error: any): string => {
  const message = error?.message?.toLowerCase() || '';
  
  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password';
  }
  if (message.includes('email already registered')) {
    return 'This email is already registered';
  }
  if (message.includes('password')) {
    return 'Password should be at least 6 characters';
  }
  if (message.includes('email')) {
    return 'Please enter a valid email address';
  }
  
  return 'Authentication failed. Please try again.';
};