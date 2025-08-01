import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { CharacterCreationStepProps, ABILITY_NAMES } from './types';

const CharacterSummaryStep: React.FC<CharacterCreationStepProps> = ({
  characterData,
  creationData
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Завершение создания персонажа
      </Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5">{characterData.name}</Typography>
          <Typography variant="body1" color="textSecondary">
            {creationData?.races[characterData.race]?.name} {creationData?.classes[characterData.characterClass]?.name}
          </Typography>
          <Typography variant="body2">
            Уровень 1 • {characterData.alignment}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Box>
              <Typography variant="body2">
                <strong>Характеристики:</strong>
              </Typography>
              {ABILITY_NAMES.map((ability, index) => (
                <Typography key={ability} variant="body2">
                  {ability}: {characterData.abilityScores[index]} ({Math.floor((characterData.abilityScores[index] - 10) / 2)})
                </Typography>
              ))}
            </Box>
            <Box>
              <Typography variant="body2">
                <strong>Навыки:</strong>
              </Typography>
              {characterData.skillChoices.map((skill: string) => (
                <Chip key={skill} label={creationData?.skills[skill]?.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Typography variant="body2" color="textSecondary">
        Проверьте все данные персонажа. Если все верно, нажмите "Создать персонажа".
      </Typography>
    </Box>
  );
};

export default CharacterSummaryStep; 