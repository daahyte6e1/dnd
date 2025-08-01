import React from 'react';
import {
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { CharacterCreationStepProps } from './types';

const ClassSelectionStep: React.FC<CharacterCreationStepProps> = ({
  characterData,
  setCharacterData,
  creationData,
  validationErrors
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Выбор класса
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Класс определяет основные способности вашего персонажа, включая владения оружием, доспехами и особые способности.
      </Alert>
      <FormControl fullWidth margin="normal" error={!!validationErrors.characterClass}>
        <InputLabel>Класс</InputLabel>
        <Select
          value={characterData.characterClass}
          onChange={(e) => setCharacterData(prev => ({ ...prev, characterClass: e.target.value }))}
          label="Класс"
        >
          {creationData && Object.entries(creationData.classes).map(([key, classData]: [string, any]) => (
            <MenuItem key={key} value={key}>
              {classData.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {characterData.characterClass && creationData && (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Особенности класса</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              <strong>Описание:</strong> {creationData.classes[characterData.characterClass].description}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Кость хитов:</strong> d{creationData.classes[characterData.characterClass].hitDie}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Основная характеристика:</strong> {creationData.classes[characterData.characterClass].primaryAbility}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Владения оружием:</strong> {creationData.classes[characterData.characterClass].weaponProficiencies.join(', ')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Владения доспехами:</strong> {creationData.classes[characterData.characterClass].armorProficiencies.join(', ')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Особенности:</strong> {creationData.classes[characterData.characterClass].classFeatures.join(', ')}
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default ClassSelectionStep; 