import { create } from 'zustand';

interface ApiState {
  // Состояние
  baseURL: string;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Действия для управления токеном
  setToken: (token: string) => void;
  clearToken: () => void;
  
  // Действия для управления состоянием
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Базовые HTTP методы
  request: (endpoint: string, options?: RequestInit) => Promise<any>;
  get: (endpoint: string) => Promise<any>;
  post: (endpoint: string, data?: any) => Promise<any>;
  put: (endpoint: string, data?: any) => Promise<any>;
  delete: (endpoint: string) => Promise<any>;
  
  // Аутентификация
  register: (userData: any) => Promise<any>;
  login: (credentials: any) => Promise<any>;
  loginByUsername: (username: string) => Promise<any>;
  registerOrLoginByUsername: (username: string) => Promise<any>;
  getProfile: () => Promise<any>;
  logout: () => void;
  
  // Пользователи
  getUser: (userId: string) => Promise<any>;
  updateUser: (userId: string, userData: any) => Promise<any>;
  
  // Персонажи
  getUserCharacters: (userId: string) => Promise<any>;
  createClassicCharacter: (userId: string, characterData: any) => Promise<any>;
  createCharacter: (userId: string, characterData: any) => Promise<any>;
  createDnDCharacter: (userId: string, characterData: any) => Promise<any>;
  getCharacterCreationData: () => Promise<any>;
  rollAbilityScores: (data?: any) => Promise<any>;
  getCharacter: (characterId: string) => Promise<any>;
  updateCharacter: (characterId: string, characterData: any) => Promise<any>;
  deleteCharacter: (userId: string, characterId: string) => Promise<any>;
  
  // Игры
  getGames: () => Promise<any>;
  getGame: (gameId: string) => Promise<any>;
  createGame: (gameData: any) => Promise<any>;
  joinGame: (gameName: string, playerData: any) => Promise<any>;
  updateGameState: (gameId: string, gameState: any) => Promise<any>;
}

const useApiStore = create<ApiState>((set, get) => ({
  // Начальное состояние
  baseURL: 'http://localhost:3000/api',
  token: localStorage.getItem('authToken'),
  isLoading: false,
  error: null,
  
  // Управление токеном
  setToken: (token: string) => {
    set({ token });
    localStorage.setItem('authToken', token);
  },
  
  clearToken: () => {
    set({ token: null });
    localStorage.removeItem('authToken');
  },
  
  // Управление состоянием
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  
  // Получение заголовков
  getHeaders: () => {
    const { token } = get();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  },
  
  // Базовый метод для HTTP запросов
  request: async (endpoint: string, options: RequestInit = {}) => {
    const { baseURL, setLoading, setError } = get();
    const url = `${baseURL}${endpoint}`;
    const config = {
      headers: get().getHeaders(),
      ...options,
    };
    
    console.log('🌐 API Request:', url, config);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, config);
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    } finally {
      setLoading(false);
    }
  },
  
  // HTTP методы
  get: (endpoint: string) => get().request(endpoint, { method: 'GET' }),
  
  post: (endpoint: string, data?: any) => get().request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint: string, data?: any) => get().request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint: string) => get().request(endpoint, { method: 'DELETE' }),
  
  // Аутентификация
  register: async (userData: any) => {
    const response = await get().post('/auth/register', userData);
    if (response.token) {
      get().setToken(response.token);
    }
    return response;
  },
  
  login: async (credentials: any) => {
    const response = await get().post('/auth/login', credentials);
    if (response.token) {
      get().setToken(response.token);
    }
    return response;
  },
  
  loginByUsername: async (username: string) => {
    return get().post('/auth/login-by-username', { username });
  },
  
  registerOrLoginByUsername: async (username: string) => {
    const response = await get().post('/auth/register-or-login', { username });
    if (response.token) {
      get().setToken(response.token);
    }
    return response;
  },
  
  getProfile: () => get().get('/auth/profile'),
  
  logout: () => {
    get().clearToken();
  },
  
  // Пользователи
  getUser: (userId: string) => get().get(`/auth/user/${userId}`),
  
  updateUser: (userId: string, userData: any) => get().put(`/auth/user/${userId}`, userData),
  
  // Персонажи
  getUserCharacters: (userId: string) => get().get(`/games/user/${userId}/characters`),
  
  createClassicCharacter: (userId: string, characterData: any) => 
    get().post(`/games/user/${userId}/characters`, characterData),
  
  createCharacter: (userId: string, characterData: any) => 
    get().createClassicCharacter(userId, characterData),
  
  createDnDCharacter: (userId: string, characterData: any) => 
    get().post(`/games/user/${userId}/dnd-character`, characterData),
  
  getCharacterCreationData: () => get().get('/games/character-creation/data'),
  
  rollAbilityScores: (data = {}) => get().post('/games/character-creation/roll-abilities', data),
  
  getCharacter: (characterId: string) => get().get(`/games/characters/${characterId}`),
  
  updateCharacter: (characterId: string, characterData: any) => 
    get().put(`/games/characters/${characterId}`, characterData),
  
  deleteCharacter: (userId: string, characterId: string) => 
    get().delete(`/games/user/${userId}/characters/${characterId}`),
  
  // Игры
  getGames: () => get().get('/games'),
  
  getGame: (gameId: string) => get().get(`/games/${gameId}`),
  
  createGame: (gameData: any) => get().post('/games', gameData),
  
  joinGame: (gameName: string, playerData: any) => 
    get().post(`/games/${gameName}/join`, playerData),
  
  updateGameState: (gameId: string, gameState: any) => 
    get().put(`/games/${gameId}/state`, { gameState }),
}));

export default useApiStore; 