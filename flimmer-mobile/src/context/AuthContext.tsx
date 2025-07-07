import React, { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. --- Type Definitions ---
type UserRole = 'parent' | 'child';
interface User {
  id: string;
  name: string;
  role: UserRole;
  childIds?: string[];
  parentId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

// 2. --- Context Creation ---
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// 3. --- Auth Provider Component ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load user from storage", e);
      } finally {
        setLoading(false);
      }
    };
    loadUserFromStorage();
  }, []);

  const login = async (user: User) => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (e) {
      console.error("Failed to save user to storage", e);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (e) {
      console.error("Failed to remove user from storage", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. --- Custom Hook ---
export const useAuth = () => useContext(AuthContext); 