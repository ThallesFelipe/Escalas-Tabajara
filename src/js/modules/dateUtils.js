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
  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const monday1 = getMonday(date1);
  const monday2 = getMonday(date2);

  return Math.floor((monday1 - monday2) / msPerWeek);
};

/**
 * Encontra a data da segunda-feira da semana de uma data específica
 * @param {Date} date - Data de referência
 * @returns {Date} Data da segunda-feira da mesma semana
 * @throws {Error} Se a data for inválida
 */
export const getMondayDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Data inválida fornecida para encontrar segunda-feira');
  }

  const currentDay = date.getDay();
  const diffToMonday = (currentDay === 0 ? -6 : 1 - currentDay);
  const mondayDate = new Date(date);

  mondayDate.setDate(date.getDate() + diffToMonday);
  mondayDate.setHours(0, 0, 0, 0);

  return mondayDate;
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

  let referenceDate2 = new Date(currentDate);

  // Se for domingo, usar a próxima segunda-feira
  if (currentDate.getDay() === 0) {
    referenceDate2.setDate(currentDate.getDate() + 1);
  }

  const mondayDate = getMondayDate(referenceDate2);
  const weekDiff = Math.max(0, getWeekDifference(mondayDate, referenceDate));

  // Calcula os índices dos ciclos para cada dia
  const mondayCycleIndex = weekDiff % (scheduleData.monday?.length || 1);
  const wednesdayCycleIndex = weekDiff % (scheduleData.wednesday?.length || 1);
  const fridayCycleIndex = weekDiff % (scheduleData.friday?.length || 1);

  // Calcula as datas da quarta e sexta
  const wednesdayDate = new Date(mondayDate);
  wednesdayDate.setDate(mondayDate.getDate() + 2);

  const fridayDate = new Date(mondayDate);
  fridayDate.setDate(mondayDate.getDate() + 4);

  return {
    mondayDate,
    wednesdayDate,
    fridayDate,
    mondayCycleIndex,
    wednesdayCycleIndex,
    fridayCycleIndex
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
