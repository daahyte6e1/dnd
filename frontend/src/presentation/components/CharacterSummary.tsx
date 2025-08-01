import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar
} from '@mui/material';
import {
  Person as PersonIcon,
  Psychology as IntelligenceIcon,
  FitnessCenter as StrengthIcon,
  DirectionsRun as DexterityIcon,
  Favorite as ConstitutionIcon,
  Visibility as WisdomIcon,
  EmojiEmotions as CharismaIcon,
  Casino as CasinoIcon,
  Shield as ArmorIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

interface CharacterSummaryProps {
  character: any;
}

const ABILITY_NAMES = ['Сила', 'Ловкость', 'Телосложение', 'Интеллект', 'Мудрость', 'Харизма'];
const ABILITY_KEYS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const ABILITY_ICONS = [StrengthIcon, DexterityIcon, ConstitutionIcon, IntelligenceIcon, WisdomIcon, CharismaIcon];

const CharacterSummary: React.FC<CharacterSummaryProps> = ({ character }) => {
  const getModifier = (score: number) => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const getProficiencyBonus = (level: number) => {
    return Math.floor((level - 1) / 4) + 2;
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom>
              {character.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {character.race} {character.characterClass} {character.level}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label={character.background} size="small" variant="outlined" />
              <Chip label={character.alignment} size="small" variant="outlined" />
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* Основные характеристики */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Характеристики
            </Typography>
            <Grid container spacing={1}>
              {ABILITY_NAMES.map((ability, index) => {
                const Icon = ABILITY_ICONS[index];
                const score = character.stats[ABILITY_KEYS[index]];
                return (
                  <Grid item xs={6} key={ability}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Icon color="primary" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" color="textSecondary">
                        {ability}
                      </Typography>
                      <Typography variant="h6">
                        {score}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {getModifier(score)}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          {/* Боевые характеристики */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Боевые характеристики
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CasinoIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  HP: {character.hp}/{character.maxHp}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArmorIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  КБ: {character.armorClass}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SpeedIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Скорость: {character.speed} футов
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Бонус мастерства: +{getProficiencyBonus(character.level)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Навыки */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Навыки
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {Object.entries(character.skills).map(([skillKey, isProficient]) => {
              if (isProficient) {
                return (
                  <Chip
                    key={skillKey}
                    label={skillKey}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                );
              }
              return null;
            })}
          </Box>
        </Box>

        {/* Особенности */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Особенности
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {character.racialTraits?.map((trait: string, index: number) => (
              <Chip
                key={index}
                label={trait}
                size="small"
                variant="outlined"
              />
            ))}
            {character.classFeatures?.map((feature: string, index: number) => (
              <Chip
                key={`class-${index}`}
                label={feature}
                size="small"
                variant="outlined"
                color="secondary"
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CharacterSummary; 