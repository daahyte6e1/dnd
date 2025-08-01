import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Favorite as HealthIcon,
  Shield as ArmorIcon,
  Speed as SpeedIcon,
  Psychology as IntelligenceIcon,
  FitnessCenter as StrengthIcon,
  DirectionsRun as DexterityIcon,
  Favorite as ConstitutionIcon,
  Visibility as WisdomIcon,
  EmojiEmotions as CharismaIcon,
  Info as InfoIcon
} from '@mui/icons-material';

interface CharacterPanelProps {
  character: any;
  onCharacterUpdate?: (character: any) => void;
}

const ABILITY_NAMES = ['Сила', 'Ловкость', 'Телосложение', 'Интеллект', 'Мудрость', 'Харизма'];
const ABILITY_KEYS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const ABILITY_ICONS = [StrengthIcon, DexterityIcon, ConstitutionIcon, IntelligenceIcon, WisdomIcon, CharismaIcon];

const CharacterPanel: React.FC<CharacterPanelProps> = ({ character, onCharacterUpdate }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getModifier = (score: number) => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const getProficiencyBonus = (level: number) => {
    return Math.floor((level - 1) / 4) + 2;
  };

  const getSkillModifier = (skill: string, abilityScore: number, isProficient: boolean) => {
    const baseModifier = Math.floor((abilityScore - 10) / 2);
    const proficiencyBonus = isProficient ? getProficiencyBonus(character.level) : 0;
    const total = baseModifier + proficiencyBonus;
    return total >= 0 ? `+${total}` : `${total}`;
  };

  const getSavingThrowModifier = (abilityScore: number, isProficient: boolean) => {
    const baseModifier = Math.floor((abilityScore - 10) / 2);
    const proficiencyBonus = isProficient ? getProficiencyBonus(character.level) : 0;
    const total = baseModifier + proficiencyBonus;
    return total >= 0 ? `+${total}` : `${total}`;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {character.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {character.race} {character.characterClass} {character.level}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {character.background} • {character.alignment}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* Основные характеристики */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
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
                        <Icon color="primary" />
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
            </CardContent>
          </Card>
        </Grid>

        {/* Боевые характеристики */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Боевые характеристики
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <HealthIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    HP: {character.hp}/{character.maxHp}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ArmorIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    КБ: {character.armorClass}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SpeedIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Скорость: {character.speed} футов
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Бонус мастерства: +{getProficiencyBonus(character.level)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Броски спасения */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Броски спасения
              </Typography>
              <List dense>
                {ABILITY_NAMES.map((ability, index) => {
                  const score = character.stats[ABILITY_KEYS[index]];
                  const isProficient = character.savingThrows[ABILITY_KEYS[index]];
                  return (
                    <ListItem key={ability} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {isProficient && <Chip label="✓" size="small" color="primary" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${ability} ${getSavingThrowModifier(score, isProficient)}`}
                        secondary={`${score} (${getModifier(score)})`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Навыки */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Навыки
          </Typography>
          <Grid container spacing={1}>
            {Object.entries(character.skills).map(([skillKey, isProficient]) => {
              if (isProficient) {
                const abilityKey = Object.keys(character.skills).find(key => 
                  key === skillKey
                );
                const abilityScore = character.stats[abilityKey];
                return (
                  <Grid item xs={6} sm={4} md={3} key={skillKey}>
                    <Chip
                      label={`${skillKey} ${getSkillModifier(skillKey, abilityScore, true)}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Детальная информация */}
      <Accordion expanded={expanded === 'details'} onChange={handleAccordionChange('details')} sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Детальная информация</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Особенности расы</Typography>
              <List dense>
                {character.racialTraits.map((trait: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemText primary={trait} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Особенности класса</Typography>
              <List dense>
                {character.classFeatures.map((feature: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Снаряжение */}
      <Accordion expanded={expanded === 'equipment'} onChange={handleAccordionChange('equipment')} sx={{ mt: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Снаряжение</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1" gutterBottom>Начальное снаряжение</Typography>
          <Grid container spacing={1}>
            {character.startingEquipment.map((item: string, index: number) => (
              <Grid item xs={6} sm={4} key={index}>
                <Chip label={item} size="small" variant="outlined" />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Языки */}
      <Accordion expanded={expanded === 'languages'} onChange={handleAccordionChange('languages')} sx={{ mt: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Языки</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            {character.languages.map((language: string, index: number) => (
              <Grid item xs={6} sm={4} key={index}>
                <Chip label={language} size="small" />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Внешность и история */}
      <Accordion expanded={expanded === 'appearance'} onChange={handleAccordionChange('appearance')} sx={{ mt: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Внешность и история</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Внешность</Typography>
              <Typography variant="body2">
                <strong>Возраст:</strong> {character.appearance?.age || 'Не указан'}
              </Typography>
              <Typography variant="body2">
                <strong>Рост:</strong> {character.appearance?.height || 'Не указан'}
              </Typography>
              <Typography variant="body2">
                <strong>Вес:</strong> {character.appearance?.weight || 'Не указан'}
              </Typography>
              <Typography variant="body2">
                <strong>Глаза:</strong> {character.appearance?.eyes || 'Не указан'}
              </Typography>
              <Typography variant="body2">
                <strong>Кожа:</strong> {character.appearance?.skin || 'Не указан'}
              </Typography>
              <Typography variant="body2">
                <strong>Волосы:</strong> {character.appearance?.hair || 'Не указан'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>История</Typography>
              <Typography variant="body2">
                {character.backstory || 'История персонажа не указана'}
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CharacterPanel; 