class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  // Установка токена аутентификации
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Удаление токена
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Получение заголовков для запросов
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Базовый метод для HTTP запросов
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET запрос
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST запрос
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT запрос
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE запрос
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Аутентификация
  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async loginByUsername(username) {
    const response = await this.post('/auth/login-by-username', { username });
    return response;
  }

  async registerOrLoginByUsername(username) {
    const response = await this.post('/auth/register-or-login', { username });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  // Персонажи пользователя
  async getUserCharacters(userId) {
    return this.get(`/games/user/${userId}/characters`);
  }

  async createClassicCharacter(userId, characterData) {
    return this.post(`/games/user/${userId}/characters`, characterData);
  }

  logout() {
    this.clearToken();
  }

  // Игры
  async getGames() {
    return this.get('/games');
  }

  async getGame(gameId) {
    return this.get(`/games/${gameId}`);
  }

  async createGame(gameData) {
    // Убираем автоматическую генерацию dmId - бэкенд сам создаст временного пользователя
    return this.post('/games', gameData);
  }

  async joinGame(gameName, playerData) {
    return this.post(`/games/${gameName}/join`, playerData);
  }

  async updateGameState(gameId, gameState) {
    return this.put(`/games/${gameId}/state`, { gameState });
  }
}

// Создаем экземпляр API клиента
const apiClient = new ApiClient();

export default apiClient; 