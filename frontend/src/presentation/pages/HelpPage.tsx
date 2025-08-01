import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  PlayArrow as PlayIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Casino as CasinoIcon,
  Settings as SettingsIcon,
  QuestionAnswer as FAQIcon,
  Book as BookIcon,
  VideoLibrary as VideoIcon
} from '@mui/icons-material';

const HelpPage = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqData = [
    {
      question: 'Как создать персонажа?',
      answer: 'Перейдите в раздел "Управление персонажами" и нажмите "Создать персонажа". Выберите имя, класс и другие характеристики вашего персонажа.'
    },
    {
      question: 'Как присоединиться к игре?',
      answer: 'В лобби игр выберите доступную игру и нажмите "Присоединиться". Убедитесь, что у вас есть персонаж для участия.'
    },
    {
      question: 'Как работает система бросков кубиков?',
      answer: 'В игре вы можете использовать команды для бросков кубиков, например: "1d20" для броска двадцатигранного кубика или "2d6" для двух шестигранных кубиков.'
    },
    {
      question: 'Можно ли играть без регистрации?',
      answer: 'Нет, для участия в играх необходимо создать аккаунт и персонажа. Это обеспечивает безопасность и сохранение прогресса.'
    },
    {
      question: 'Как работает система опыта?',
      answer: 'Персонажи получают опыт за участие в играх и выполнение действий. При накоплении достаточного количества опыта персонаж повышает уровень.'
    }
  ];

  const tutorials = [
    {
      title: 'Создание персонажа',
      description: 'Пошаговое руководство по созданию первого персонажа',
      icon: <PersonIcon />,
      steps: [
        'Перейдите в раздел "Управление персонажами"',
        'Нажмите "Создать персонажа"',
        'Введите имя персонажа',
        'Выберите класс (Воин, Волшебник, Разбойник, Жрец)',
        'Нажмите "Создать"'
      ]
    },
    {
      title: 'Участие в игре',
      description: 'Как присоединиться к игре и начать играть',
      icon: <PlayIcon />,
      steps: [
        'Перейдите в "Лобби игр"',
        'Выберите доступную игру',
        'Выберите персонажа для участия',
        'Нажмите "Присоединиться"',
        'Дождитесь начала игры'
      ]
    },
    {
      title: 'Использование кубиков',
      description: 'Как использовать систему бросков кубиков',
      icon: <CasinoIcon />,
      steps: [
        'В игре откройте панель кубиков',
        'Выберите тип броска (d4, d6, d8, d10, d12, d20)',
        'Укажите количество кубиков',
        'Нажмите "Бросить"',
        'Результат появится в чате'
      ]
    }
  ];

  const features = [
    {
      title: 'Многопользовательская игра',
      description: 'Играйте с друзьями в реальном времени',
      icon: <GroupIcon />
    },
    {
      title: 'Система персонажей',
      description: 'Создавайте и развивайте своих персонажей',
      icon: <PersonIcon />
    },
    {
      title: 'Виртуальные кубики',
      description: 'Используйте различные типы кубиков для игры',
      icon: <CasinoIcon />
    },
    {
      title: 'Автогенерация мира',
      description: 'Исследуйте уникальные миры, созданные автоматически',
      icon: <BookIcon />
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Помощь и документация
        </Typography>
        
        <Alert severity="info" sx={{ mb: 4 }}>
          Здесь вы найдете всю необходимую информацию для начала игры в D&D
        </Alert>
        
        <Grid container spacing={4}>
          {/* Быстрый старт */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Быстрый старт
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="1. Создайте персонажа" 
                    secondary="Перейдите в раздел 'Управление персонажами' и создайте своего первого персонажа"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <GroupIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="2. Присоединитесь к игре" 
                    secondary="В лобби игр выберите доступную игру или создайте новую"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PlayIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="3. Начните играть" 
                    secondary="Используйте элементы управления для взаимодействия с игровым миром"
                  />
                </ListItem>
              </List>
            </Paper>
            
            {/* FAQ */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Часто задаваемые вопросы
              </Typography>
              {faqData.map((faq, index) => (
                <Accordion 
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={handleChange(`panel${index}`)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>
          
          {/* Боковая панель */}
          <Grid item xs={12} md={4}>
            {/* Возможности */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Возможности платформы
              </Typography>
              <List dense>
                {features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {feature.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature.title}
                      secondary={feature.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            {/* Учебники */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Учебники
              </Typography>
              {tutorials.map((tutorial, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {tutorial.icon}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {tutorial.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {tutorial.description}
                    </Typography>
                    <List dense>
                      {tutorial.steps.map((step, stepIndex) => (
                        <ListItem key={stepIndex} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={`${stepIndex + 1}. ${step}`}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>
        </Grid>
        
        {/* Контакты поддержки */}
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Нужна дополнительная помощь?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<FAQIcon />}
            >
              Задать вопрос
            </Button>
            <Button
              variant="outlined"
              startIcon={<VideoIcon />}
            >
              Видеоуроки
            </Button>
            <Button
              variant="outlined"
              startIcon={<BookIcon />}
            >
              Полная документация
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default HelpPage; 