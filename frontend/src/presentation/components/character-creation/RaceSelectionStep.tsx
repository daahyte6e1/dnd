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
import { CharacterCreationStepProps, ABILITY_NAMES, ABILITY_KEYS } from './types';

const RaceSelectionStep: React.FC<CharacterCreationStepProps> = ({
  characterData,
  setCharacterData,
  creationData,
  validationErrors
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Выбор расы
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Раса определяет основные характеристики вашего персонажа, включая бонусы к характеристикам, скорость и особые способности.
      </Alert>
      <FormControl fullWidth margin="normal" error={!!validationErrors.race}>
        <InputLabel>Раса</InputLabel>
        <Select
          value={characterData.race}
          onChange={(e) => setCharacterData(prev => ({ ...prev, race: e.target.value }))}
          label="Раса"
        >
          {creationData && Object.entries(creationData.races).map(([key, race]: [string, any]) => (
            <MenuItem key={key} value={key}>
              {race.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {characterData.race && creationData && (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Особенности расы</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              <strong>Описание:</strong> {creationData.races[characterData.race].description}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Бонусы к характеристикам:</strong> {Object.entries(creationData.races[characterData.race].abilityScoreIncrease).map(([ability, bonus]) => `${ABILITY_NAMES[ABILITY_KEYS.indexOf(ability)]} +${bonus}`).join(', ')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Скорость:</strong> {creationData.races[characterData.race].speed} футов
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Размер:</strong> {creationData.races[characterData.race].size}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Особенности:</strong> {creationData.races[characterData.race].traits.join(', ')}
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default RaceSelectionStep; 