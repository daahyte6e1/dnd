import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './infrastructure/store/authStore';
import Navigation from './presentation/components/Navigation';
import ProtectedRoute from './presentation/components/ProtectedRoute';
import HomePage from './presentation/pages/HomePage';
import AuthPage from './presentation/pages/AuthPage';
import LobbyPage from './presentation/pages/LobbyPage';
import ProfilePage from './presentation/pages/ProfilePage';
import SettingsPage from './presentation/pages/SettingsPage';
import HelpPage from './presentation/pages/HelpPage';
import GamePage from './presentation/pages/GamePage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/lobby" element={
              <ProtectedRoute>
                <LobbyPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/game/:gameId" element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
