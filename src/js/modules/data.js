/**
 * @fileoverview Dados da escala de limpeza e configurações da República Tabajara
 * 
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                    COMO ATUALIZAR AS ESCALAS                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  1. ADICIONAR MORADOR:                                                     ║
 * ║     - Adicione o nome na lista correspondente (seg/ter ou qui/sex)         ║
 * ║     - Ex: members: ['Fulano', 'Ciclano', 'NOVO_MORADOR']                   ║
 * ║                                                                            ║
 * ║  2. REMOVER MORADOR:                                                       ║
 * ║     - Simplesmente remova o nome da lista                                  ║
 * ║     - O sistema recalcula tudo automaticamente!                            ║
 * ║                                                                            ║
 * ║  3. TROCAR ORDEM:                                                          ║
 * ║     - Reordene os nomes na lista como preferir                             ║
 * ║                                                                            ║
 * ║  4. MÁQUINA DE LAVAR:                                                      ║
 * ║     - Edite o array washingSchedule abaixo                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// 🏠 MORADORES - EDITE AQUI!
// ============================================================================

/**
 * Grupo de Segunda e Terça
 * 📝 Adicione ou remova nomes conforme necessário
 */
const mondayTuesdayMembers = [
  'Gaga',
  'A. Viihtube',
  'Smigou',
  'Rita',
];

/**
 * Grupo de Quinta e Sexta
 * 📝 Adicione ou remova nomes conforme necessário
 */
const thursdayFridayMembers = [
  'Navala',
  'LATAM',
  'BBB',
  'Leidi',
  'Espalha Lixo',
];

// ============================================================================
// 🧹 CÔMODOS - EDITE AQUI SE PRECISAR MUDAR OS AMBIENTES
// ============================================================================

/**
 * Definição dos cômodos com seus labels e chaves correspondentes
 * 📝 Adicione ou remova cômodos conforme a estrutura da república
 */
export const rooms = [
  { label: 'Cozinha', key: 'cozinha', icon: 'restaurant' },
  { label: 'Banheiro de baixo', key: 'banhBaixo', icon: 'shower' },
  { label: 'Banheiro suíte', key: 'banhSuite', icon: 'bathtub' },
  { label: 'Sala e corredor', key: 'sala', icon: 'weekend' },
  { label: 'Lavabo', key: 'lavabo', icon: 'wash' },
];

// ============================================================================
// 🧺 MÁQUINA DE LAVAR - EDITE AQUI!
// ============================================================================

/**
 * Escala da máquina de lavar por dia da semana
 * 📝 Edite os usuários de cada dia conforme necessário
 */
export const washingSchedule = [
  { day: 'Domingo', users: 'Espalha Lixo e Rita', dayIndex: 0 },
  { day: 'Segunda-feira', users: 'Gaga e A. Rodrigo', dayIndex: 1 },
  { day: 'Terça-feira', users: 'A. Viihtube', dayIndex: 2 },
  { day: 'Quarta-feira', users: 'Navala e LATAM', dayIndex: 3 },
  { day: 'Quinta-feira', users: 'BBB e Smigou', dayIndex: 4 },
  { day: 'Sexta-feira', users: 'Leidi', dayIndex: 5 },
  { day: 'Sábado', users: 'PANOS', dayIndex: 6 },
];

// ============================================================================
// ⚙️ CONFIGURAÇÕES DO SISTEMA - NÃO PRECISA MEXER
// ============================================================================

/**
 * Configurações da aplicação
 */
export const appConfig = {
  /** Data de referência para o início do ciclo (Segunda, 8 de dezembro de 2025) */
  referenceDate: new Date(2025, 11, 8),
  /** Chave para salvar preferência de tema no localStorage */
  themeStorageKey: 'escalas-tabajara-theme',
  /** Classe CSS para modo escuro */
  darkModeClass: 'dark-mode',
};

/**
 * Configuração de temas
 */
export const themeConfig = {
  lightIcon: 'light_mode',
  darkIcon: 'dark_mode',
  lightLabel: 'Alternar para modo escuro',
  darkLabel: 'Alternar para modo claro',
};

// ============================================================================
// 🔄 GERADOR AUTOMÁTICO DE ESCALAS - NÃO PRECISA MEXER
// ============================================================================

/**
 * Gera automaticamente todas as rotações da escala de limpeza
 * baseado na lista de moradores.
 * 
 * Regras:
 * - Cada pessoa limpa um cômodo diferente por semana
 * - Se há menos pessoas que cômodos, quem limpa a sala também limpa o lavabo
 * - A rotação é circular (após a última posição, volta para a primeira)
 * 
 * @param {string[]} members - Lista de moradores do grupo
 * @returns {Object[]} Array de rotações com as atribuições de cada cômodo
 */
function generateScheduleRotations(members) {
  const numMembers = members.length;
  const numRooms = rooms.length;
  const rotations = [];

  // Gera uma rotação para cada membro (ciclo completo)
  for (let rotation = 0; rotation < numMembers; rotation++) {
    const schedule = {};

    rooms.forEach((room, roomIndex) => {
      // Calcula qual membro fica responsável por este cômodo nesta rotação
      const memberIndex = (roomIndex + rotation) % numMembers;
      schedule[room.key] = members[memberIndex];
    });

    // Se há menos pessoas que cômodos, quem limpa a sala também limpa o lavabo
    if (numMembers < numRooms) {
      schedule.lavabo = schedule.sala;
    }

    rotations.push(schedule);
  }

  return rotations;
}

/**
 * Dados da escala de limpeza - GERADO AUTOMATICAMENTE
 * Não precisa editar manualmente! Apenas modifique as listas de moradores acima.
 */
export const scheduleData = {
  monday_tuesday: generateScheduleRotations(mondayTuesdayMembers),
  thursday_friday: generateScheduleRotations(thursdayFridayMembers),
};

// ============================================================================
// 📊 INFORMAÇÕES ÚTEIS (para debug/verificação)
// ============================================================================

/**
 * Exibe informações sobre a configuração atual no console (apenas em desenvolvimento)
 */
if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
  console.info('📋 Escalas Tabajara - Configuração atual:');
  console.info(`   Segunda/Terça: ${mondayTuesdayMembers.length} pessoas → ${scheduleData.monday_tuesday.length} rotações`);
  console.info(`   Quinta/Sexta: ${thursdayFridayMembers.length} pessoas → ${scheduleData.thursday_friday.length} rotações`);
  console.info('   Moradores Seg/Ter:', mondayTuesdayMembers.join(', '));
  console.info('   Moradores Qui/Sex:', thursdayFridayMembers.join(', '));
}
