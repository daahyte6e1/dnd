import React from 'react';
import {
  Box,
  Typography,
  Alert,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider
} from '@mui/material';
import { CharacterCreationStepProps } from './types';

const PersonalityStep: React.FC<CharacterCreationStepProps> = ({
  characterData,
  setCharacterData,
  validationErrors
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Личность и внешность
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Завершите создание персонажа, добавив личные детали и внешность.
      </Alert>
      
      <TextField
        fullWidth
        label="Имя персонажа"
        value={characterData.name}
        onChange={(e) => setCharacterData(prev => ({ ...prev, name: e.target.value }))}
        margin="normal"
        required
        error={!!validationErrors.name}
        helperText={validationErrors.name}
      />
      
      <FormControl fullWidth margin="normal">
        <FormLabel component="legend">Мировоззрение</FormLabel>
        <RadioGroup
          value={characterData.alignment}
          onChange={(e) => setCharacterData(prev => ({ ...prev, alignment: e.target.value }))}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <FormControlLabel value="Lawful Good" control={<Radio />} label="Законно-добрый" />
              <FormControlLabel value="Neutral Good" control={<Radio />} label="Нейтрально-добрый" />
              <FormControlLabel value="Chaotic Good" control={<Radio />} label="Хаотично-добрый" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControlLabel value="Lawful Neutral" control={<Radio />} label="Законно-нейтральный" />
              <FormControlLabel value="Neutral" control={<Radio />} label="Нейтральный" />
              <FormControlLabel value="Chaotic Neutral" control={<Radio />} label="Хаотично-нейтральный" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControlLabel value="Lawful Evil" control={<Radio />} label="Законно-злой" />
              <FormControlLabel value="Neutral Evil" control={<Radio />} label="Нейтрально-злой" />
              <FormControlLabel value="Chaotic Evil" control={<Radio />} label="Хаотично-злой" />
            </Box>
          </Box>
        </RadioGroup>
      </FormControl>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" gutterBottom>Внешность</Typography>
          <TextField
            fullWidth
            label="Возраст"
            type="number"
            value={characterData.appearance.age}
            onChange={(e) => setCharacterData(prev => ({
              ...prev,
              appearance: { ...prev.appearance, age: parseInt(e.target.value) || 20 }
            }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Рост"
            value={characterData.appearance.height}
            onChange={(e) => setCharacterData(prev => ({
              ...prev,
              appearance: { ...prev.appearance, height: e.target.value }
            }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Вес"
            value={characterData.appearance.weight}
            onChange={(e) => setCharacterData(prev => ({
              ...prev,
              appearance: { ...prev.appearance, weight: e.target.value }
            }))}
            margin="normal"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" gutterBottom>Детали внешности</Typography>
          <TextField
            fullWidth
            label="Цвет глаз"
            value={characterData.appearance.eyes}
            onChange={(e) => setCharacterData(prev => ({
              ...prev,
              appearance: { ...prev.appearance, eyes: e.target.value }
            }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Цвет кожи"
            value={characterData.appearance.skin}
            onChange={(e) => setCharacterData(prev => ({
              ...prev,
              appearance: { ...prev.appearance, skin: e.target.value }
            }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Цвет волос"
            value={characterData.appearance.hair}
            onChange={(e) => setCharacterData(prev => ({
              ...prev,
              appearance: { ...prev.appearance, hair: e.target.value }
            }))}
            margin="normal"
          />
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" gutterBottom>История персонажа</Typography>
      <TextField
        fullWidth
        label="История персонажа"
        multiline
        rows={4}
        value={characterData.backstory}
        onChange={(e) => setCharacterData(prev => ({ ...prev, backstory: e.target.value }))}
        margin="normal"
        placeholder="Расскажите о прошлом вашего персонажа..."
      />
    </Box>
  );
};

export default PersonalityStep; 