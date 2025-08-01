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

const BackgroundSelectionStep: React.FC<CharacterCreationStepProps> = ({
  characterData,
  setCharacterData,
  creationData,
  validationErrors
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Предыстория
      </Typography>
      <FormControl fullWidth margin="normal" error={!!validationErrors.background}>
        <InputLabel>Предыстория</InputLabel>
        <Select
          value={characterData.background}
          onChange={(e) => setCharacterData(prev => ({ ...prev, background: e.target.value }))}
          label="Предыстория"
        >
          {creationData && Object.entries(creationData.backgrounds).map(([key, background]: [string, any]) => (
            <MenuItem key={key} value={key}>
              {background.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {characterData.background && creationData && (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Навыки предыстории</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              <strong>Навыки:</strong> {creationData.backgrounds[characterData.background].skillProficiencies.join(', ')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Дополнительные языки:</strong> {creationData.backgrounds[characterData.background].languages}
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default BackgroundSelectionStep; 