import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    startDate: string;
    endDate: string | null;
    status: 'active' | 'expired' | 'cancelled' | 'pending';
  };
  wallet: {
    credits: number;
    totalPurchased: number;
    totalUsed: number;
    lastRefill: string;
  };
  usage: {
    resumeAnalysis: number;
    interviewAnalysis: number;
    coverLetters: number;
    jobAnalysis: number;
    emailsWritten: number;
    linkedinOptimizations: number;
    chatMessages: number;
    salaryCoaching: number;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  updateCredits: (newCredits: number) => void;
}

const API_URL = 'http://localhost:5001';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              setUser(data.user);
            } else {
              // Token invalid, clear it
              localStorage.removeItem('token');
              setToken(null);
            }
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth init error:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, [token]);

  const updateCredits = useCallback((newCredits: number) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        wallet: {
          ...prev.wallet,
          credits: newCredits
        }
      };
    });
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    updateCredits
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper hook for protected API calls
export const useAuthFetch = () => {
  const { token, logout } = useAuth();

  const authFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // If unauthorized, logout
    if (response.status === 401) {
      logout();
    }

    return response;
  }, [token, logout]);

  return authFetch;
};

export default AuthContext;
