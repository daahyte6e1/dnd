import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Divider
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';

const DicePanel = ({ onRollDice, lastRoll }) => {
  const commonDice = [
    { label: 'd4', value: 'd4' },
    { label: 'd6', value: 'd6' },
    { label: 'd8', value: 'd8' },
    { label: 'd10', value: 'd10' },
    { label: 'd12', value: 'd12' },
    { label: 'd20', value: 'd20' },
    { label: 'd100', value: 'd100' }
  ];

  const handleDiceRoll = (dice) => {
    onRollDice(`/roll 1${dice}`);
  };

  const handleAdvantageRoll = (dice) => {
    onRollDice(`/roll adv ${dice}`);
  };

  const handleDisadvantageRoll = (dice) => {
    onRollDice(`/roll dis ${dice}`);
  };

  return (
    <Paper sx={{ p: 2, height: '300px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CasinoIcon sx={{ mr: 1 }} />
        <Typography variant="h6">
          Кубики
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={1}>
        {commonDice.map((dice) => (
          <Grid item xs={4} key={dice.value}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => handleDiceRoll(dice.value)}
              sx={{ mb: 1 }}
            >
              {dice.label}
            </Button>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button
                variant="text"
                size="small"
                onClick={() => handleAdvantageRoll(dice.value)}
                sx={{ fontSize: '0.7rem', minWidth: 'auto', p: 0.5 }}
              >
                Adv
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => handleDisadvantageRoll(dice.value)}
                sx={{ fontSize: '0.7rem', minWidth: 'auto', p: 0.5 }}
              >
                Dis
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
      
      {lastRoll && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Последний бросок
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={lastRoll.command}
              color="primary"
              size="small"
            />
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              = {lastRoll.total}
            </Typography>
          </Box>
          {lastRoll.rolls && lastRoll.rolls.length > 1 && (
            <Typography variant="body2" color="text.secondary">
              Броски: [{lastRoll.rolls.join(', ')}]
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
};

export default DicePanel; 