import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Divider
} from '@mui/material';

const CharacterPanel = ({ character, isCurrentPlayer }) => {
  if (!character) {
    return (
      <Paper sx={{ p: 2, height: '300px' }}>
        <Typography variant="h6" gutterBottom>
          Персонаж
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Создайте персонажа для начала игры
        </Typography>
      </Paper>
    );
  }

  const healthPercentage = (character.health / character.maxHealth) * 100;
  const getHealthColor = (percentage) => {
    if (percentage > 70) return 'success';
    if (percentage > 30) return 'warning';
    return 'error';
  };

  return (
    <Paper sx={{ p: 2, height: '300px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {character.name}
        </Typography>
        {isCurrentPlayer && (
          <Chip label="Вы" color="primary" size="small" />
        )}
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Класс
          </Typography>
          <Typography variant="body1">
            {character.class}
          </Typography>
        </Grid>
        
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Уровень
          </Typography>
          <Typography variant="body1">
            {character.level}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Здоровье
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={healthPercentage}
              color={getHealthColor(healthPercentage)}
              sx={{ flex: 1 }}
            />
            <Typography variant="body2">
              {character.health}/{character.maxHealth}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Позиция
          </Typography>
          <Typography variant="body1">
            ({character.position.x}, {character.position.y})
          </Typography>
        </Grid>
        
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Инициатива
          </Typography>
          <Typography variant="body1">
            {character.initiative || 0}
          </Typography>
        </Grid>
      </Grid>
      
      {character.inventory && character.inventory.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Инвентарь
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {character.inventory.map((item, index) => (
              <Chip
                key={index}
                label={item.name}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </>
      )}
      
      {character.abilities && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Характеристики
          </Typography>
          <Grid container spacing={1}>
            {Object.entries(character.abilities).map(([ability, value]) => (
              <Grid item xs={4} key={ability}>
                <Typography variant="body2" color="text.secondary">
                  {ability.toUpperCase()}
                </Typography>
                <Typography variant="body1">
                  {value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default CharacterPanel; 