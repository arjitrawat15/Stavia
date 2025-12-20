import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set axios header when token changes
  useEffect(() => {
    if (token) {
      // Synchronously set axios default header
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // Remove header if no token
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    // Check if user is logged in on mount
    if (token) {
      // Set axios header immediately
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      authApi.getCurrentUser()
        .then(response => {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        })
        .catch(() => {
          // Invalid token
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete apiClient.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Login attempt for:', email);
      const response = await authApi.login({ email, password });
      console.log('AuthContext: Login response:', response);
      
      const { token: newToken, email: userEmail, fullName, userId } = response.data;
      
      if (!newToken) {
        console.error('AuthContext: No token in response');
        return { 
          success: false, 
          error: 'Login succeeded but no token received. Please try again.' 
        };
      }
      
      // CRITICAL: Set axios header SYNCHRONOUSLY before updating state
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Save to localStorage
      localStorage.setItem('token', newToken);
      
      // Update state (this will trigger useEffect to set header again, but that's safe)
      setToken(newToken);
      const userData = { id: userId, email: userEmail, fullName };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('AuthContext: Login successful, token and header set');
      return { success: true, token: newToken, user: userData };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      console.error('AuthContext: Error response:', error.response?.data);
      console.error('AuthContext: Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Login failed. Please check your credentials.';
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const signup = async (fullName, email, password, phoneNumber) => {
    try {
      console.log('AuthContext: Signup attempt for:', email);
      console.log('AuthContext: API base URL:', import.meta.env.VITE_API_BASE_URL || '/api');
      
      const response = await authApi.signup({ fullName, email, password, phoneNumber });
      console.log('AuthContext: Signup response:', response);
      
      const { token: newToken, email: userEmail, fullName: userName, userId } = response.data;
      
      if (!newToken) {
        console.error('AuthContext: No token in response');
        return { 
          success: false, 
          error: 'Signup succeeded but no token received. Please try logging in.' 
        };
      }
      
      // CRITICAL: Set axios header SYNCHRONOUSLY before updating state
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Save to localStorage
      localStorage.setItem('token', newToken);
      
      // Update state
      setToken(newToken);
      const userData = { id: userId, email: userEmail, fullName: userName };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('AuthContext: Signup successful, token and header set');
      return { success: true, token: newToken, user: userData };
    } catch (error) {
      console.error('AuthContext: Signup error:', error);
      console.error('AuthContext: Error type:', error.name);
      console.error('AuthContext: Error message:', error.message);
      console.error('AuthContext: Error code:', error.code);
      console.error('AuthContext: Error response:', error.response?.data);
      console.error('AuthContext: Error status:', error.response?.status);
      console.error('AuthContext: Error request:', error.request);
      
      // Handle network errors specifically
      if (!error.response) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          return { 
            success: false, 
            error: 'Cannot connect to server. Please ensure the backend is running on http://localhost:8080'
          };
        }
        if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
          return { 
            success: false, 
            error: 'Request timed out. The server may be slow or unreachable.'
          };
        }
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Signup failed. Please try again.';
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Remove axios header
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

