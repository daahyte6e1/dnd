import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useApiStore from './apiStore';

interface User {
  id: string;
  username: string;
}

interface Character {
  id: string;
  name: string;
  characterClass: string;
  level: number;
  hp: number;
  maxHp: number;
}

interface AuthContextType {
  user: User | null;
  characters: Character[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
  refreshCharacters: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Получаем методы из API store
  const { 
    getProfile, 
    getUserCharacters, 
    registerOrLoginByUsername, 
    logout: apiLogout,
    clearToken 
  } = useApiStore();

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Проверяем валидность токена, получая профиль пользователя
          const profile = await getProfile();
          if (profile.user) {
            setUser(profile.user);
            setIsAuthenticated(true);
            
            // Загружаем персонажей пользователя
            const charactersResponse = await getUserCharacters(profile.user.id);
            setCharacters(charactersResponse.characters || []);
          } else {
            // Токен невалиден, очищаем
            clearToken();
          }
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [getProfile, getUserCharacters, clearToken]);

  const login = async (username: string) => {
    try {
      const response = await registerOrLoginByUsername(username);
      const userData = response.user;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Загружаем персонажей пользователя
      const charactersResponse = await getUserCharacters(userData.id);
      setCharacters(charactersResponse.characters || []);
      
      return response;
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setCharacters([]);
    setIsAuthenticated(false);
  };

  const refreshCharacters = async () => {
    if (!user) {
      return;
    }

    try {
      const charactersResponse = await getUserCharacters(user.id);
      setCharacters(charactersResponse.characters || []);
    } catch (error) {
      console.error('Ошибка обновления персонажей:', error);
    }
  };

  const value: AuthContextType = {
    user,
    characters,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshCharacters,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 