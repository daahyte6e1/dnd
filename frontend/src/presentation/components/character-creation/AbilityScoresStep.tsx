import React from 'react';
import {
  Box,
  Typography,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Select,
  MenuItem
} from '@mui/material';
import { Casino as CasinoIcon } from '@mui/icons-material';
import useApiStore from '../../../infrastructure/store/apiStore';
import { CharacterCreationStepProps, ABILITY_NAMES } from './types';

const AbilityScoresStep: React.FC<CharacterCreationStepProps> = ({
  characterData,
  setCharacterData,
  validationErrors
}) => {
  const { rollAbilityScores: rollScores } = useApiStore();

  // Функция для получения доступных значений характеристик при фиксированном распределении
  const getAvailableAbilityScores = (currentIndex: number): number[] => {
    if (characterData.abilityMethod !== 'fixed') {
      return [15, 14, 13, 12, 10, 8];
    }

    const usedScores = characterData.abilityScores.filter((score: number, index: number) => 
      index !== currentIndex && score !== 0
    );
    
    return [15, 14, 13, 12, 10, 8].filter(score => !usedScores.includes(score));
  };

  const rollAbilityScores = async () => {
    try {
      const response = await rollScores({ method: characterData.abilityMethod });
      setCharacterData((prev: any) => ({
        ...prev,
        abilityScores: response.scores
      }));
    } catch (err: any) {
      console.error('Ошибка генерации характеристик:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Характеристики
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Распределите фиксированные значения характеристик [15, 14, 13, 12, 10, 8] по шести характеристикам
      </Alert>
      
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Способ определения характеристик</FormLabel>
        <RadioGroup
          value={characterData.abilityMethod || 'fixed'}
          onChange={(e) => {
            const method = e.target.value;
            setCharacterData((prev: any) => ({ 
              ...prev, 
              abilityMethod: method,
              abilityScores: method === 'fixed' ? [0, 0, 0, 0, 0, 0] : prev.abilityScores
            }));
          }}
        >
          <FormControlLabel value="fixed" control={<Radio />} label="Фиксированные значения [15, 14, 13, 12, 10, 8]" />
          <FormControlLabel value="random" control={<Radio />} label="Автоматическая генерация (4d6)" />
        </RadioGroup>
      </FormControl>

      {characterData.abilityMethod === 'random' ? (
        <Box>
          <Button
            variant="outlined"
            startIcon={<CasinoIcon />}
            onClick={rollAbilityScores}
            sx={{ mb: 2 }}
          >
            Бросить характеристики (4d6)
          </Button>
          {validationErrors.abilityScores && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationErrors.abilityScores}
            </Alert>
          )}
        </Box>
      ) : (
        <Alert severity="info" sx={{ mb: 2 }}>
          Выберите уникальное значение для каждой характеристики. Каждое значение [15, 14, 13, 12, 10, 8] можно использовать только один раз.
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {ABILITY_NAMES.map((ability, index) => (
          <Card key={ability}>
            <CardContent>
              <Typography variant="h6">{ability}</Typography>
              {characterData.abilityMethod === 'fixed' ? (
                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                  <Select
                    value={characterData.abilityScores[index]}
                    onChange={(e) => {
                      const newValue = e.target.value as number;
                      const newScores = [...characterData.abilityScores];
                      newScores[index] = newValue;
                      setCharacterData((prev: any) => ({
                        ...prev,
                        abilityScores: newScores
                      }));
                    }}
                  >
                    <MenuItem value={0}>
                      <em>Выберите значение</em>
                    </MenuItem>
                    {getAvailableAbilityScores(index).map(score => (
                      <MenuItem key={score} value={score}>
                        {score}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Typography variant="h4">{characterData.abilityScores[index]}</Typography>
              )}
              <Typography variant="body2" color="textSecondary">
                Модификатор: {characterData.abilityScores[index] > 0 ? Math.floor((characterData.abilityScores[index] - 10) / 2) : '-'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {characterData.abilityMethod === 'fixed' && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Совет по распределению:</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              • Сила: важна для воинов, паладинов, варваров
            </Typography>
            <Typography variant="body2">
              • Ловкость: важна для разбойников, следопытов, монахов
            </Typography>
            <Typography variant="body2">
              • Телосложение: важно для всех персонажей (влияет на HP)
            </Typography>
            <Typography variant="body2">
              • Интеллект: важен для волшебников, изобретателей
            </Typography>
            <Typography variant="body2">
              • Мудрость: важна для жрецов, друидов, следопытов
            </Typography>
            <Typography variant="body2">
              • Харизма: важна для бардов, колдунов, чародеев
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default AbilityScoresStep; 