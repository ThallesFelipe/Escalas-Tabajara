/**
 * @fileoverview Dados da escala de limpeza e configurações da República Tabajara
 */

/**
 * Dados da escala de limpeza da República Tabajara
 * Organizado por dia da semana com rotação de responsabilidades
 */
export const scheduleData = {
  monday: [
    {
      cozinha: 'A. Viihtube',
      banhBaixo: 'Bixo Gaga',
      banhSuite: 'Bixo Alexa',
      sala: 'I. Ivan',
      lavabo: 'I. Ivan',
    },
    {
      cozinha: 'I. Ivan',
      banhBaixo: 'A. Viihtube',
      banhSuite: 'Bixo Gaga',
      sala: 'Bixo Alexa',
      lavabo: 'Bixo Alexa',
    },
    {
      cozinha: 'Bixo Alexa',
      banhBaixo: 'I. Ivan',
      banhSuite: 'A. Viihtube',
      sala: 'Bixo Gaga',
      lavabo: 'Bixo Gaga',
    },
    {
      cozinha: 'Bixo Gaga',
      banhBaixo: 'Bixo Alexa',
      banhSuite: 'I. Ivan',
      sala: 'A. Viihtube',
      lavabo: 'A. Viihtube',
    },
  ],
  wednesday: [
    {
      cozinha: 'Rita',
      banhBaixo: 'LATAM',
      banhSuite: 'Navala',
      sala: 'Smigou',
      lavabo: 'Smigou',
    },
    {
      cozinha: 'Smigou',
      banhBaixo: 'Rita',
      banhSuite: 'LATAM',
      sala: 'Navala',
      lavabo: 'Navala'
    },
    {
      cozinha: 'Navala',
      banhBaixo: 'Smigou',
      banhSuite: 'Rita',
      sala: 'LATAM',
      lavabo: 'LATAM',
    },
    {
      cozinha: 'LATAM',
      banhBaixo: 'Navala',
      banhSuite: 'Smigou',
      sala: 'Rita',
      lavabo: 'Rita',
    },
  ],
  friday: [
    {
      cozinha: 'BBB',
      banhBaixo: 'Madre',
      banhSuite: 'Espalha',
      sala: 'Leidi',
      lavabo: 'Leidi',
    },
    {
      cozinha: 'Leidi',
      banhBaixo: 'BBB',
      banhSuite: 'Madre',
      sala: 'Espalha',
      lavabo: 'Espalha',
    },
    {
      cozinha: 'Espalha',
      banhBaixo: 'Leidi',
      banhSuite: 'BBB',
      sala: 'Madre',
      lavabo: 'Madre',
    },
    {
      cozinha: 'Madre',
      banhBaixo: 'Espalha',
      banhSuite: 'Leidi',
      sala: 'BBB',
      lavabo: 'BBB',
    },
  ],
};

/**
 * Definição dos cômodos com seus labels e chaves correspondentes
 */
export const rooms = [
  { label: '🍽️ Cozinha', key: 'cozinha' },
  { label: '🚿 Banheiro de baixo', key: 'banhBaixo' },
  { label: '🛁 Banheiro suíte', key: 'banhSuite' },
  { label: '🛋️ Sala e corredor', key: 'sala' },
  { label: '🚽 Lavabo', key: 'lavabo' },
];

/**
 * Dados da escala da máquina de lavar por dia da semana
 */
export const washingSchedule = [
  { day: 'Domingo', users: 'Espalha Lixo e Rita', dayIndex: 0 },
  { day: 'Segunda-feira', users: 'B. Gaga e B. Alexa', dayIndex: 1 },
  { day: 'Terça-feira', users: 'Latam e A. Viihtube', dayIndex: 2 },
  { day: 'Quarta-feira', users: 'Madre e Navala', dayIndex: 3 },
  { day: 'Quinta-feira', users: 'BBB e Smigou', dayIndex: 4 },
  { day: 'Sexta-feira', users: 'Leidi', dayIndex: 5 },
  { day: 'Sábado', users: 'I. Ivan', dayIndex: 6 },
];

/**
 * Configurações da aplicação
 */
export const appConfig = {
  /** Data de referência para o início do ciclo (Segunda-feira, 24 de fevereiro de 2020) */
  referenceDate: new Date(2020, 1, 24),
  /** Chave para salvar preferência de tema no localStorage */
  themeStorageKey: 'escalas-tabajara-theme',
  /** Classe CSS para modo escuro */
  darkModeClass: 'dark-mode',
};

/**
 * Configuração de temas
 */
export const themeConfig = {
  lightIcon: '☀️',
  darkIcon: '🌙',
  lightLabel: 'Alternar para modo escuro',
  darkLabel: 'Alternar para modo claro',
};
