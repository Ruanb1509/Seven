import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isVip: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isVip: false,
  token: null,
  login: () => {},
  logout: () => {},
  checkAuth: () => false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('Token'));
  const [isVip, setIsVip] = useState<boolean>(false);
  
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (token) {
      checkVipStatus();
    }
  }, [token]);

  const checkVipStatus = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsVip(data.isVip);
      }
    } catch (error) {
      console.error('Error checking VIP status:', error);
    }
  };

  const login = (newToken: string) => {
    localStorage.setItem('Token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('Token');
    setToken(null);
    setIsVip(false);
  };

  const checkAuth = () => {
    return Boolean(token);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isVip, token, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;