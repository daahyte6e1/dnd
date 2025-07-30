import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // Game State
  gameState: 'idle', // idle, loading, playing, paused, error
  gameName: '',
  currentPlayer: null,
  players: [],
  worldData: null,
  gameLogs: [],
  chatMessages: [],
  lastDiceRoll: null,
  
  // Actions
  setGameState: (state) => set({ gameState: state }),
  
  setGameName: (name) => set({ gameName: name }),
  
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  
  setPlayers: (players) => set({ players }),
  
  addPlayer: (player) => set((state) => ({
    players: [...state.players.filter(p => p.id !== player.id), player]
  })),
  
  removePlayer: (playerId) => set((state) => ({
    players: state.players.filter(p => p.id !== playerId)
  })),
  
  updatePlayer: (playerId, updates) => set((state) => ({
    players: state.players.map(p => 
      p.id === playerId ? { ...p, ...updates } : p
    )
  })),
  
  setWorldData: (worldData) => set({ worldData }),
  
  addGameLog: (log) => set((state) => ({
    gameLogs: [...state.gameLogs, { ...log, timestamp: new Date() }]
  })),
  
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, { ...message, timestamp: new Date() }]
  })),
  
  setLastDiceRoll: (roll) => set({ lastDiceRoll: roll }),
  
  clearGame: () => set({
    gameState: 'idle',
    gameName: '',
    currentPlayer: null,
    players: [],
    worldData: null,
    gameLogs: [],
    chatMessages: [],
    lastDiceRoll: null
  }),
}));

export default useGameStore; 