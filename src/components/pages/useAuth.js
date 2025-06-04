import { useState, useEffect } from 'react';
import { getUserFromToken } from '../../utils/tokenUtils';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = getUserFromToken();
        if (userData) {
          // Create user object compatible with Firebase chat
          setUser({
            uid: userData.user_id || userData.id, // Use your token's user ID field
            email: userData.email,
            role: userData.role,
            displayName: userData.name || userData.username,
            isAuthenticated: true
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return { user, loading, logout };
};