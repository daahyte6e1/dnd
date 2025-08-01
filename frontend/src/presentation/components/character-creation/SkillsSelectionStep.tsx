import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import useApiStore from '../../../infrastructure/store/apiStore';
import { CharacterCreationStepProps } from './types';

const SkillsSelectionStep: React.FC<CharacterCreationStepProps> = ({
  characterData,
  setCharacterData,
  creationData,
  validationErrors,
  availableSkills,
  setAvailableSkills,
  requiredSkillChoices,
  setRequiredSkillChoices
}) => {
  const { get } = useApiStore();

  // Функция для получения рекомендаций по навыкам
  const getSkillRecommendations = (characterClass: string, background: string): string[] => {
    const recommendations: string[] = [];
    
    // Базовые рекомендации на основе класса
    switch (characterClass) {
      case 'fighter':
        recommendations.push('Атлетика - полезна для воина в бою и преодолении препятствий');
        recommendations.push('Запугивание - помогает в социальных взаимодействиях');
        break;
      case 'wizard':
        recommendations.push('Магия - необходима для изучения заклинаний');
        recommendations.push('Анализ - помогает в исследовании и решении загадок');
        break;
      case 'rogue':
        recommendations.push('Скрытность - ключевой навык разбойника');
        recommendations.push('Ловкость рук - полезна для воровства и ловкости');
        break;
      case 'cleric':
        recommendations.push('Проницательность - помогает понимать мотивы других');
        recommendations.push('Религия - связана с божественной магией');
        break;
      case 'ranger':
        recommendations.push('Выживание - необходимо для жизни в дикой природе');
        recommendations.push('Восприятие - помогает замечать опасности и следы');
        break;
      case 'barbarian':
        recommendations.push('Атлетика - полезна для варвара в бою');
        recommendations.push('Выживание - помогает в дикой природе');
        break;
      case 'bard':
        recommendations.push('Выступление - ключевой навык барда');
        recommendations.push('Убеждение - помогает в социальных взаимодействиях');
        break;
      case 'druid':
        recommendations.push('Природа - связана с друидской магией');
        recommendations.push('Выживание - помогает в дикой природе');
        break;
      case 'monk':
        recommendations.push('Акробатика - полезна для монаха в бою');
        recommendations.push('Скрытность - помогает в скрытном передвижении');
        break;
      case 'paladin':
        recommendations.push('Проницательность - помогает паладину судить о людях');
        recommendations.push('Религия - связана с божественной магией');
        break;
      case 'sorcerer':
        recommendations.push('Магия - связана с чародейской силой');
        recommendations.push('Обман - помогает в социальных взаимодействиях');
        break;
      case 'warlock':
        recommendations.push('Магия - связана с пактовой магией');
        recommendations.push('Обман - помогает в сделках с потусторонними существами');
        break;
    }
    
    return recommendations;
  };

  const updateAvailableSkills = async () => {
    if (!characterData.characterClass || !characterData.background) return;

    console.log('🔄 Обновление доступных навыков для:', characterData.characterClass, characterData.background);

    try {
      // Используем API store для получения доступных навыков
      const endpoint = `/games/character-creation/available-skills?characterClass=${characterData.characterClass}&background=${characterData.background}`;
      console.log('📡 Вызываем API:', endpoint);
      
      const skillsInfo = await get(endpoint);
      console.log('✅ Получены данные навыков:', skillsInfo);

      setAvailableSkills(skillsInfo.availableSkills);
      setRequiredSkillChoices(skillsInfo.requiredChoices);
      
      // Показываем информацию о навыках предыстории
      if (skillsInfo.backgroundSkills.length > 0) {
        console.log('Навыки от предыстории:', skillsInfo.backgroundSkills);
      }
    } catch (error) {
      console.error('❌ Ошибка при обновлении доступных навыков:', error);
      
      // Fallback к старой логике
      if (!creationData) return;

      const classData = creationData.classes[characterData.characterClass];
      const backgroundData = creationData.backgrounds[characterData.background];
      
      if (!classData || !backgroundData) return;

      const classSkillChoices = classData.skillChoices || 2;
      setRequiredSkillChoices(classSkillChoices);

      const classSkills = classData.skills || [];
      const backgroundSkills = backgroundData.skillProficiencies || [];
      const availableSkillsList = classSkills.filter((skill: string) => !backgroundSkills.includes(skill));
      
      setAvailableSkills(availableSkillsList);
    }
  };

  // Обновляем доступные навыки при изменении класса или предыстории
  useEffect(() => {
    if (characterData.characterClass && characterData.background) {
      updateAvailableSkills();
    }
  }, [characterData.characterClass, characterData.background]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Навыки
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Выберите {requiredSkillChoices} дополнительных навыка для вашего персонажа
      </Alert>
      {validationErrors.skillChoices && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationErrors.skillChoices}
        </Alert>
      )}

      {/* Рекомендации по навыкам */}
      {characterData.characterClass && characterData.background && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            💡 Рекомендации для {creationData?.classes[characterData.characterClass]?.name}:
          </Typography>
          <Typography variant="body2">
            {(() => {
              const recommendations = getSkillRecommendations(characterData.characterClass, characterData.background);
              return recommendations.map((rec, index) => (
                <Box key={index} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="primary">
                    • {rec}
                  </Typography>
                </Box>
              ));
            })()}
          </Typography>
        </Alert>
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1 }}>
        {availableSkills.map((skillKey) => {
          return (
            <FormControlLabel
              key={skillKey}
              control={
                <Checkbox
                  checked={characterData.skillChoices.includes(skillKey)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCharacterData(prev => ({
                        ...prev,
                        skillChoices: [...prev.skillChoices, skillKey]
                      }));
                    } else {
                      setCharacterData(prev => ({
                        ...prev,
                        skillChoices: prev.skillChoices.filter((s: string) => s !== skillKey)
                      }));
                    }
                  }}
                />
              }
              label={
                <Box>
                  <div>{creationData?.skills}</div>
                  <div>{skillKey}</div>
                  <Typography variant="body2">{creationData?.skills[skillKey]?.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    ({creationData?.skills[skillKey]?.ability})
                  </Typography>
                </Box>
              }
            />
          );
        })}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Выбрано: {characterData.skillChoices.length} из {requiredSkillChoices}
        </Typography>
      </Box>
    </Box>
  );
};

export default SkillsSelectionStep; 