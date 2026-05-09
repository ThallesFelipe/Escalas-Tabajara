/**
 * Utilitários de data centrados em semanas que começam na segunda-feira.
 */

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/**
 * @param {unknown} date
 * @param {string} [name]
 * @returns {asserts date is Date}
 */
const assertDate = (date, name = 'data') => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error(`${name} inválida`);
  }
};

/**
 * Formata uma data como `DD/MM` no padrão pt-BR.
 * @param {Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  assertDate(date);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

/**
 * Retorna a segunda-feira da semana de `date`. Domingo é tratado como o
 * último dia da semana anterior.
 * @param {Date} date
 * @returns {Date}
 */
export const startOfWeek = (date) => {
  assertDate(date);
  const day = date.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + offset);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

/**
 * Diferença em semanas completas entre duas datas, sempre comparando suas
 * respectivas segundas-feiras.
 * @param {Date} a
 * @param {Date} b
 * @returns {number}
 */
export const weeksBetween = (a, b) => {
  assertDate(a, 'data inicial');
  assertDate(b, 'data final');
  return Math.floor((startOfWeek(a).getTime() - startOfWeek(b).getTime()) / MS_PER_WEEK);
};

/**
 * Para um instante qualquer, calcula as datas e os índices de rotação das
 * duas duplas (segunda/terça e quinta/sexta) a partir de uma data de referência.
 *
 * @param {Date} today
 * @param {Date} referenceDate
 * @param {import('../types').ScheduleData} scheduleData
 * @returns {import('../types').WeekCycle}
 */
export const calculateWeekCycles = (today, referenceDate, scheduleData) => {
  const monTueDate = startOfWeek(today);
  const thuFriDate = new Date(monTueDate);
  thuFriDate.setDate(monTueDate.getDate() + 3);

  const weekDiff = Math.max(0, weeksBetween(monTueDate, referenceDate));
  const monTueCycleIndex = weekDiff % (scheduleData.monTue?.length || 1);
  const thuFriCycleIndex = weekDiff % (scheduleData.thuFri?.length || 1);

  return { monTueDate, thuFriDate, monTueCycleIndex, thuFriCycleIndex };
};
