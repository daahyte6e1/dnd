import React from 'react';
import {
  Box,
  Typography,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { CharacterCreationStepProps } from './types';

const EquipmentStep: React.FC<CharacterCreationStepProps> = ({
  characterData,
  creationData
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Снаряжение
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Ваш персонаж получает базовое снаряжение от класса и предыстории.
      </Alert>
      
      {characterData.characterClass && creationData && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Снаряжение класса: {creationData.classes[characterData.characterClass].name}
            </Typography>
            <Typography variant="body2">
              {creationData.classes[characterData.characterClass].startingEquipment.join(', ')}
            </Typography>
          </CardContent>
        </Card>
      )}
      
      {characterData.background && creationData && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Снаряжение предыстории: {creationData.backgrounds[characterData.background].name}
            </Typography>
            <Typography variant="body2">
              {creationData.backgrounds[characterData.background].equipment.join(', ')}
            </Typography>
          </CardContent>
        </Card>
      )}
      
      <Alert severity="success">
        <Typography variant="body2">
          Все снаряжение будет автоматически добавлено к вашему персонажу при создании.
        </Typography>
      </Alert>
    </Box>
  );
};

export default EquipmentStep; 