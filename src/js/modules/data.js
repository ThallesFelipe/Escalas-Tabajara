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
      cozinha: 'Bixo Alexa', 
      banhBaixo: 'Bixo Gaga', 
      banhSuite: 'I. Ivan', 
      sala: 'A. Viihtube', 
      lavabo: 'A. Viihtube' 
    },
    { 
      cozinha: 'I. Ivan', 
      banhBaixo: 'Bixo Alexa', 
      banhSuite: 'Bixo Gaga', 
      sala: 'Bixo Alexa', 
      lavabo: 'Bixo Alexa' 
    },
    { 
      cozinha: 'Bixo Gaga', 
      banhBaixo: 'A. Viihtube', 
      banhSuite: 'B. Alexa', 
      sala: 'I. Ivan', 
      lavabo: 'I. Ivan' 
    },
    { 
      cozinha: 'A. Viihtube', 
      banhBaixo: 'I. Ivan', 
      banhSuite: 'Bixo Alexa', 
      sala: 'Bixo Gaga', 
      lavabo: 'Bixo Gaga' 
    }
  ],
  wednesday: [
    { 
      cozinha: 'LATAM', 
      banhBaixo: 'TPM', 
      banhSuite: 'Bixo TotalFlex', 
      sala: 'Bixo Smigou', 
      lavabo: 'Bixo Rita' 
    },
    { 
      cozinha: 'Bixo Rita', 
      banhBaixo: 'LATAM', 
      banhSuite: 'TPM', 
      sala: 'Bixo TotalFlex', 
      lavabo: 'Bixo Smigou' 
    },
    { 
      cozinha: 'Bixo Smigou', 
      banhBaixo: 'Bixo Rita', 
      banhSuite: 'LATAM', 
      sala: 'TPM', 
      lavabo: 'Bixo TotalFlex' 
    },
    { 
      cozinha: 'Bixo TotalFlex', 
      banhBaixo: 'Bixo Smigou', 
      banhSuite: 'Bixo Rita', 
      sala: 'LATAM', 
      lavabo: 'TPM' 
    },
    { 
      cozinha: 'TPM', 
      banhBaixo: 'Bixo TotalFlex', 
      banhSuite: 'Bixo Smigou', 
      sala: 'Bixo Rita', 
      lavabo: 'LATAM' 
    }
  ],
  friday: [
    { 
      cozinha: 'BBB', 
      banhBaixo: 'Leidi', 
      banhSuite: 'Madre', 
      sala: 'Espalha', 
      lavabo: 'Navala' 
    },
    { 
      cozinha: 'Navala', 
      banhBaixo: 'BBB', 
      banhSuite: 'Leidi', 
      sala: 'Madre', 
      lavabo: 'Espalha' 
    },
    { 
      cozinha: 'Espalha', 
      banhBaixo: 'Navala', 
      banhSuite: 'BBB', 
      sala: 'Leidi', 
      lavabo: 'Madre' 
    },
    { 
      cozinha: 'Madre', 
      banhBaixo: 'Espalha', 
      banhSuite: 'Navala', 
      sala: 'BBB', 
      lavabo: 'Leidi' 
    },
    { 
      cozinha: 'Leidi', 
      banhBaixo: 'Madre', 
      banhSuite: 'Espalha', 
      sala: 'Navala', 
      lavabo: 'BBB' 
    }
  ]
};

/**
 * Definição dos cômodos com seus labels e chaves correspondentes
 */
export const rooms = [
  { label: '🍽️ Cozinha', key: 'cozinha' },
  { label: '🚿 Banheiro de baixo', key: 'banhBaixo' },
  { label: '🛁 Banheiro suíte', key: 'banhSuite' },
  { label: '🛋️ Sala e corredor', key: 'sala' },
  { label: '🚽 Lavabo', key: 'lavabo' }
];

/**
 * Dados da escala da máquina de lavar por dia da semana
 */
export const washingSchedule = [
  { day: 'Domingo', users: 'Espalha Lixo e B. Rita', dayIndex: 0 },
  { day: 'Segunda-feira', users: 'B. Gaga e B. Alexa', dayIndex: 1 },
  { day: 'Terça-feira', users: 'Latam, TPM e A. Viihtube', dayIndex: 2 },
  { day: 'Quarta-feira', users: 'Madre e Navala', dayIndex: 3 },
  { day: 'Quinta-feira', users: 'BBB e B. Smigou', dayIndex: 4 },
  { day: 'Sexta-feira', users: 'Leidi e B. Total', dayIndex: 5 },
  { day: 'Sábado', users: 'I. Ivan', dayIndex: 6 }
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
  darkModeClass: 'dark-mode'
};

/**
 * Configuração de temas
 */
export const themeConfig = {
  lightIcon: '☀️',
  darkIcon: '🌙',
  lightLabel: 'Alternar para modo escuro',
  darkLabel: 'Alternar para modo claro'
};
