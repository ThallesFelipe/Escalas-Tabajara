/**
 * @fileoverview Utilitários para manipulação de datas e cálculos de escala
 */

/**
 * Formata uma data no formato DD/MM para exibição
 * @param {Date} date - Data a ser formatada
 * @returns {string} Data formatada no padrão brasileiro
 * @throws {Error} Se a data for inválida
 */
export const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Data inválida fornecida para formatação');
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  });
};

/**
 * Calcula a diferença de semanas completas entre duas datas
 * @param {Date} date1 - Data mais recente
 * @param {Date} date2 - Data de referência
 * @returns {number} Número de semanas de diferença
 * @throws {Error} Se alguma das datas for inválida
 */
export const getWeekDifference = (date1, date2) => {
  if (!(date1 instanceof Date) || isNaN(date1.getTime()) ||
    !(date2 instanceof Date) || isNaN(date2.getTime())) {
    throw new Error('Datas inválidas fornecidas para cálculo de diferença');
  }

  const msPerWeek = 1000 * 60 * 60 * 24 * 7;

  // Alinha ambas as datas para a segunda-feira da semana
  const getmonday_tuesday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const monday_tuesday1 = getmonday_tuesday(date1);
  const monday_tuesday2 = getmonday_tuesday(date2);

  return Math.floor((monday_tuesday1 - monday_tuesday2) / msPerWeek);
};

/**
 * Encontra a data da segunda-feira da semana de uma data específica
 * Para dias de domingo, retorna a segunda-feira da semana anterior
 * @param {Date} date - Data de referência
 * @returns {Date} Data da segunda-feira da mesma semana
 * @throws {Error} Se a data for inválida
 */
export const getmonday_tuesdayDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Data inválida fornecida para encontrar Segunda e Terça');
  }

  const currentDay = date.getDay();
  const diffTomonday_tuesday = (currentDay === 0 ? -6 : 1 - currentDay);
  const monday_tuesdayDate = new Date(date);

  monday_tuesdayDate.setDate(date.getDate() + diffTomonday_tuesday);
  monday_tuesdayDate.setHours(0, 0, 0, 0);

  return monday_tuesdayDate;
};

/**
 * Calcula as datas e índices dos ciclos para uma semana específica
 * @param {Date} currentDate - Data atual para cálculo
 * @param {Date} referenceDate - Data de referência do sistema
 * @param {Object} scheduleData - Dados da escala
 * @returns {Object} Objeto com datas e índices calculados
 */
export const calculateWeekCycles = (currentDate, referenceDate, scheduleData) => {
  if (!(currentDate instanceof Date) || isNaN(currentDate.getTime()) ||
    !(referenceDate instanceof Date) || isNaN(referenceDate.getTime())) {
    throw new Error('Datas inválidas fornecidas para cálculo de ciclos');
  }

  // Para domingo, considera a semana atual (que termina no domingo)
  // Para outros dias, usa a semana corrente normalmente
  const monday_tuesdayDate = getmonday_tuesdayDate(currentDate);
  const weekDiff = Math.max(0, getWeekDifference(monday_tuesdayDate, referenceDate));

  // Calcula os índices dos ciclos para cada dia
  const monday_tuesdayCycleIndex = weekDiff % (scheduleData.monday_tuesday?.length || 1);
  const thursday_fridayCycleIndex = weekDiff % (scheduleData.thursday_friday?.length || 1);

  // Calcula a data da quinta-feira (segunda + 3 dias)
  const thursday_fridayDate = new Date(monday_tuesdayDate);
  thursday_fridayDate.setDate(monday_tuesdayDate.getDate() + 3);

  return {
    monday_tuesdayDate,
    thursday_fridayDate,
    monday_tuesdayCycleIndex,
    thursday_fridayCycleIndex
  };
};

/**
 * Verifica se uma data é hoje
 * @param {Date} date - Data a ser verificada
 * @returns {boolean} True se a data for hoje
 */
export const isToday = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * Obtém o nome do dia da semana em português
 * @param {number} dayIndex - Índice do dia (0 = domingo)
 * @returns {string} Nome do dia da semana
 */
export const getDayName = (dayIndex) => {
  const days = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  return days[dayIndex] || 'Dia inválido';
};

/**
 * Valida se uma data está dentro de um intervalo razoável
 * @param {Date} date - Data a ser validada
 * @param {number} yearsRange - Range de anos permitido (padrão: 10)
 * @returns {boolean} True se a data for válida
 */
export const isValidDateRange = (date, yearsRange = 10) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }

  const currentYear = new Date().getFullYear();
  const dateYear = date.getFullYear();

  return Math.abs(dateYear - currentYear) <= yearsRange;
};
