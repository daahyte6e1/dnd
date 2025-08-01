import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

import useApiStore from '../../infrastructure/store/apiStore';
import {
  RaceSelectionStep,
  ClassSelectionStep,
  AbilityScoresStep,
  BackgroundSelectionStep,
  SkillsSelectionStep,
  EquipmentStep,
  PersonalityStep,
  CharacterSummaryStep
} from './character-creation';

interface CharacterCreationData {
  races: { [key: string]: any };
  classes: { [key: string]: any };
  backgrounds: { [key: string]: any };
  skills: { [key: string]: any };
}

interface CharacterCreationWizardProps {
  userId: string;
  onCharacterCreated: (character: any) => void;
  onCancel: () => void;
}

const steps = [
  'Раса',
  'Класс',
  'Характеристики',
  'Предыстория',
  'Навыки',
  'Снаряжение',
  'Личность',
  'Завершение'
];

const CharacterCreationWizard: React.FC<CharacterCreationWizardProps> = ({
  userId,
  onCharacterCreated,
  onCancel
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [creationData, setCreationData] = useState<CharacterCreationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Получаем методы из API store
  const { getCharacterCreationData, createDnDCharacter } = useApiStore();

  // Данные персонажа
  const [characterData, setCharacterData] = useState({
    name: '',
    race: '',
    characterClass: '',
    background: '',
    alignment: 'Neutral',
    abilityScores: [0, 0, 0, 0, 0, 0],
    skillChoices: [] as string[],
    appearance: {
      age: 20,
      height: '',
      weight: '',
      eyes: '',
      skin: '',
      hair: ''
    },
    personality: {
      traits: [],
      ideals: [],
      bonds: [],
      flaws: []
    },
    backstory: '',
    abilityMethod: 'fixed'
  });

  // Состояние для отслеживания доступных навыков
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [requiredSkillChoices, setRequiredSkillChoices] = useState(0);

  useEffect(() => {
    loadCreationData();
  }, []);

  const loadCreationData = async () => {
    try {
      console.log('🔄 Загрузка данных для создания персонажа...');
      setLoading(true);
      const data = await getCharacterCreationData();
      console.log('✅ Данные загружены:', data);
      setCreationData(data);
    } catch (err: any) {
      console.error('❌ Ошибка загрузки данных:', err);
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = async (step: number): Promise<boolean> => {
    const errors: {[key: string]: string} = {};

    switch (step) {
      case 0: // Раса
        if (!characterData.race) {
          errors.race = 'Выберите расу';
        }
        break;

      case 1: // Класс
        if (!characterData.characterClass) {
          errors.characterClass = 'Выберите класс';
        }
        break;

      case 2: // Характеристики
        if (characterData.abilityMethod === 'fixed') {
          const scores = characterData.abilityScores.filter(score => score !== 0);
          const uniqueScores = new Set(scores);
          const validScores = [15, 14, 13, 12, 10, 8];
          const isValidDistribution = scores.length === 6 && 
                                    uniqueScores.size === 6 && 
                                    scores.every(score => validScores.includes(score));
          
          if (!isValidDistribution) {
            errors.abilityScores = 'Каждое значение должно быть выбрано только один раз. Используйте все значения из [15, 14, 13, 12, 10, 8]';
          }
        } else {
          if (characterData.abilityScores.some(score => score < 3 || score > 18)) {
            errors.abilityScores = 'Характеристики должны быть от 3 до 18';
          }
        }
        break;

      case 3: // Предыстория
        if (!characterData.background) {
          errors.background = 'Выберите предысторию';
        }
        break;

      case 4: // Навыки
        if (characterData.skillChoices.length !== requiredSkillChoices) {
          errors.skillChoices = `Выберите ровно ${requiredSkillChoices} навыка`;
        }
        break;

      case 6: // Личность
        if (!characterData.name.trim()) {
          errors.name = 'Имя персонажа обязательно';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    const isValid = await validateStep(activeStep);
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setValidationErrors({});
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setValidationErrors({});
  };

  const handleCreateCharacter = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await createDnDCharacter(userId, characterData);
      onCharacterCreated(response.character);
    } catch (err: any) {
      setError(err.message || 'Ошибка создания персонажа');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step: number) => {
    const commonProps = {
      characterData,
      setCharacterData,
      creationData,
      validationErrors,
      availableSkills,
      setAvailableSkills,
      requiredSkillChoices,
      setRequiredSkillChoices
    };

    switch (step) {
      case 0:
        return <RaceSelectionStep {...commonProps} />;
      case 1:
        return <ClassSelectionStep {...commonProps} />;
      case 2:
        return <AbilityScoresStep {...commonProps} />;
      case 3:
        return <BackgroundSelectionStep {...commonProps} />;
      case 4:
        return <SkillsSelectionStep {...commonProps} />;
      case 5:
        return <EquipmentStep {...commonProps} />;
      case 6:
        return <PersonalityStep {...commonProps} />;
      case 7:
        return <CharacterSummaryStep {...commonProps} />;
      default:
        return 'Unknown step';
    }
  };

  if (loading && !creationData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Загрузка данных...</Typography>
      </Box>
    );
  }

  return (
    <Dialog open={true} maxWidth="md" fullWidth>
      <DialogTitle>
        Создание персонажа D&D 5e
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 2 }}>
          {getStepContent(activeStep)}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>
          Отмена
        </Button>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Назад
        </Button>
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleCreateCharacter : handleNext}
          disabled={loading}
        >
          {activeStep === steps.length - 1 ? 'Создать персонажа' : 'Далее'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CharacterCreationWizard; 