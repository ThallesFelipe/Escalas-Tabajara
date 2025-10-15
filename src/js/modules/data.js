/**
 * @fileoverview Dados da escala de limpeza e configurações da República Tabajara
 */

/**
 * Dados da escala de limpeza da República Tabajara
 * Organizado por dia da semana com rotação de responsabilidades
 */
export const scheduleData = {
  monday_tuesday: [
    {
      cozinha: 'Smigou',
      banhBaixo: 'Rita',
      banhSuite: 'B. Gaga',
      sala: 'A. Viihtube',
      lavabo: 'A. Viihtube',
    },
    {
      cozinha: 'A. Viihtube',
      banhBaixo: 'Smigou',
      banhSuite: 'Rita',
      sala: 'B. Gaga',
      lavabo: 'B. Gaga',
    },
    {
      cozinha: 'B. Gaga',
      banhBaixo: 'A. Viihtube',
      banhSuite: 'Smigou',
      sala: 'Rita',
      lavabo: 'Rita',
    },
    {
      cozinha: 'Rita',
      banhBaixo: 'B. Gaga',
      banhSuite: 'A. Viihtube',
      sala: 'Smigou',
      lavabo: 'Smigou',
    }
  ],

  thursday_friday: [
    {
      cozinha: 'BBB',
      banhBaixo: 'Leidi',
      banhBaixo: 'Espalha Lixo',
      sala: 'Navala',
      lavabo: 'LATAM',
    },
    {
      cozinha: 'LATAM',
      banhBaixo: 'BBB',
      banhSuite: 'Leidi',
      sala: 'Espalha Lixo',
      lavabo: 'Navala',
    },
    {
      cozinha: 'Navala',
      banhBaixo: 'LATAM',
      banhSuite: 'BBB',
      sala: 'Leidi',
      lavabo: 'Espalha Lixo',
    },
    {
      cozinha: 'Espalha Lixo',
      banhBaixo: 'Navala',
      banhSuite: 'LATAM',
      sala: 'BBB',
      lavabo: 'Leidi',
    },
    {
      cozinha: 'Leidi',
      banhBaixo: 'Espalha Lixo',
      banhSuite: 'Navala',
      sala: 'LATAM',
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
  { day: 'Segunda e Terça', users: 'B. Gaga e B. Alexa', dayIndex: 1 },
  { day: 'Terça-feira', users: 'Latam e A. Viihtube', dayIndex: 2 },
  { day: 'Quarta-feira', users: 'Madre e Navala', dayIndex: 3 },
  { day: 'Quinta-feira', users: 'BBB e Smigou', dayIndex: 4 },
  { day: 'Quinta e Sexta', users: 'Leidi', dayIndex: 5 },
  { day: 'Sábado', users: 'I. Ivan', dayIndex: 6 },
];

/**
 * Configurações da aplicação
 */
export const appConfig = {
  /** Data de referência para o início do ciclo (Segunda e Terça, 24 de fevereiro de 2020) */
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
