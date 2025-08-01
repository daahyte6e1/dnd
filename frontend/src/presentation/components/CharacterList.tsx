import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Skeleton
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Casino as CasinoIcon,
  Psychology as IntelligenceIcon,
  FitnessCenter as StrengthIcon,
  DirectionsRun as DexterityIcon,
  Favorite as ConstitutionIcon,
  Visibility as WisdomIcon,
  EmojiEmotions as CharismaIcon
} from '@mui/icons-material';
import CharacterCreationWizard from './CharacterCreationWizard';
import CharacterPanel from './CharacterPanel';

import useApiStore from '../../infrastructure/store/apiStore';

interface CharacterListProps {
  userId: string;
  onCharacterSelect?: (character: any) => void;
}

const ABILITY_ICONS = [StrengthIcon, DexterityIcon, ConstitutionIcon, IntelligenceIcon, WisdomIcon, CharismaIcon];

const CharacterList: React.FC<CharacterListProps> = ({ userId, onCharacterSelect }) => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [showCharacterDetails, setShowCharacterDetails] = useState(false);

  // Получаем методы из API store
  const { getUserCharacters, deleteCharacter } = useApiStore();

  useEffect(() => {
    loadCharacters();
  }, [userId, getUserCharacters]);

  const loadCharacters = async () => {
    try {
      console.log('🔄 Загрузка персонажей для пользователя:', userId);
      setLoading(true);
      const response = await getUserCharacters(userId);
      console.log('✅ Персонажи загружены:', response);
      setCharacters(response.characters || []);
    } catch (err: any) {
      console.error('❌ Ошибка загрузки персонажей:', err);
      setError(err.message || 'Ошибка загрузки персонажей');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = async (character: any) => {
    console.log('🎉 Персонаж создан:', character);
    setCharacters(prev => [...prev, character]);
    setShowCreationWizard(false);
    setSelectedCharacter(character);
    setShowCharacterDetails(true);
    if (onCharacterSelect) {
      onCharacterSelect(character);
    }
  };

  const handleDeleteCharacter = async (characterId: string) => {
    try {
      await deleteCharacter(userId, characterId);
      setCharacters(prev => prev.filter(char => char._id !== characterId));
      if (selectedCharacter?._id === characterId) {
        setSelectedCharacter(null);
        setShowCharacterDetails(false);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления персонажа');
    }
  };

  const getModifier = (score: number) => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const getHighestAbility = (character: any) => {
    const stats = character.stats;
    const abilities = Object.entries(stats);
    abilities.sort((a, b) => (b[1] as number) - (a[1] as number));
    return abilities[0];
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Персонажи
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" height={24} />
                  <Skeleton variant="text" width="80%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (showCharacterDetails && selectedCharacter) {
    return (
      <Box>
        <Button
          variant="outlined"
          onClick={() => setShowCharacterDetails(false)}
          sx={{ mb: 2 }}
        >
          ← Назад к списку
        </Button>
        <CharacterPanel character={selectedCharacter} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Персонажи ({characters.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreationWizard(true)}
        >
          Создать персонажа
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {characters.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              У вас пока нет персонажей
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Создайте своего первого персонажа для игры в D&D
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreationWizard(true)}
            >
              Создать персонажа
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {characters.map((character) => {
            const [highestAbility, highestScore] = getHighestAbility(character);
            const abilityIndex = Object.keys(character.stats).indexOf(highestAbility);
            const AbilityIcon = ABILITY_ICONS[abilityIndex];

            return (
              <Grid item xs={12} sm={6} md={4} key={character._id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => {
                    setSelectedCharacter(character);
                    setShowCharacterDetails(true);
                    if (onCharacterSelect) {
                      onCharacterSelect(character);
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" noWrap>
                        {character.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Редактировать">
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCharacter(character._id);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {character.race} {character.characterClass} {character.level}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AbilityIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">
                        {highestAbility.toUpperCase()}: {highestScore} ({getModifier(highestScore)})
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CasinoIcon color="secondary" sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">
                        HP: {character.hp}/{character.maxHp}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      <Chip 
                        label={character.background} 
                        size="small" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={character.alignment} 
                        size="small" 
                        variant="outlined" 
                      />
                    </Box>

                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="textSecondary">
                        Навыки: {Object.values(character.skills).filter(Boolean).length}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog 
        open={showCreationWizard} 
        onClose={() => setShowCreationWizard(false)}
        maxWidth="md"
        fullWidth
      >
        <CharacterCreationWizard
          userId={userId}
          onCharacterCreated={handleCreateCharacter}
          onCancel={() => setShowCreationWizard(false)}
        />
      </Dialog>
    </Box>
  );
};

export default CharacterList; 