import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { authAPI, setAuthToken } from '../services/api';

const AuthContext = createContext();

/**
 * Auth Context Provider
 * Manages authentication state and user session
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken'));

  useEffect(() => {
    // Set JWT token in axios headers if exists
    if (jwtToken) {
      setAuthToken(jwtToken);
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get Firebase ID token
          const firebaseToken = await firebaseUser.getIdToken();

          // Register/login with backend
          const response = await authAPI.registerOrLogin(firebaseToken);

          if (response.success) {
            // Store JWT token
            const token = response.data.token;
            localStorage.setItem('jwtToken', token);
            setAuthToken(token);
            setJwtToken(token);

            // Set user data
            setUser({
              ...response.data.user,
              firebaseUser,
            });
          }
        } catch (error) {
          console.error('Auth error:', error);
          // Clear invalid tokens
          localStorage.removeItem('jwtToken');
          setAuthToken(null);
          setJwtToken(null);
          setUser(null);
        }
      } else {
        // User signed out
        localStorage.removeItem('jwtToken');
        setAuthToken(null);
        setJwtToken(null);
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Sign out user
   */
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('jwtToken');
      setAuthToken(null);
      setJwtToken(null);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
