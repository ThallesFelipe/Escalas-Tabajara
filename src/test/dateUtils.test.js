import { describe, it, expect } from 'vitest';

import {
  calculateWeekCycles,
  formatDate,
  startOfWeek,
  weeksBetween,
} from '../js/modules/dateUtils.js';

describe('formatDate', () => {
  it('formata como DD/MM em pt-BR', () => {
    expect(formatDate(new Date(2023, 4, 15))).toBe('15/05');
  });

  it('rejeita datas inválidas', () => {
    expect(() => formatDate(new Date('invalid'))).toThrow(/inválida/);
    expect(() => formatDate(/** @type {any} */ ('not a date'))).toThrow(/inválida/);
  });
});

describe('startOfWeek', () => {
  it('retorna a própria data quando já é segunda-feira', () => {
    const monday = startOfWeek(new Date(2023, 4, 15));
    expect(monday.getDay()).toBe(1);
    expect(monday.getDate()).toBe(15);
  });

  it('volta para a segunda-feira da mesma semana', () => {
    const monday = startOfWeek(new Date(2023, 4, 17));
    expect(monday.getDate()).toBe(15);
  });

  it('trata domingo como o último dia da semana anterior', () => {
    const monday = startOfWeek(new Date(2023, 4, 21));
    expect(monday.getDate()).toBe(15);
  });

  it('zera o horário', () => {
    const monday = startOfWeek(new Date(2023, 4, 17, 23, 59, 59, 999));
    expect(monday.getHours()).toBe(0);
    expect(monday.getMinutes()).toBe(0);
    expect(monday.getSeconds()).toBe(0);
    expect(monday.getMilliseconds()).toBe(0);
  });

  it('rejeita datas inválidas', () => {
    expect(() => startOfWeek(new Date('invalid'))).toThrow(/inválida/);
  });
});

describe('weeksBetween', () => {
  it('conta semanas completas comparando segundas-feiras', () => {
    expect(
      weeksBetween(new Date(2023, 4, 15), new Date(2023, 4, 8)),
    ).toBe(1);
  });

  it('retorna zero para dias da mesma semana', () => {
    expect(
      weeksBetween(new Date(2023, 4, 17), new Date(2023, 4, 15)),
    ).toBe(0);
  });

  it('aceita ordens invertidas (resultado negativo)', () => {
    expect(
      weeksBetween(new Date(2023, 4, 8), new Date(2023, 4, 15)),
    ).toBe(-1);
  });

  it('rejeita datas inválidas', () => {
    expect(() =>
      weeksBetween(new Date(2023, 4, 15), new Date('invalid')),
    ).toThrow();
  });
});

describe('calculateWeekCycles', () => {
  /** @type {import('../js/types').ScheduleData} */
  const mockSchedule = {
    monTue: [
      { cozinha: 'A', banhBaixo: 'A', banhSuite: 'A', sala: 'A', lavabo: 'A' },
      { cozinha: 'B', banhBaixo: 'B', banhSuite: 'B', sala: 'B', lavabo: 'B' },
    ],
    thuFri: [
      { cozinha: 'F', banhBaixo: 'F', banhSuite: 'F', sala: 'F', lavabo: 'F' },
    ],
  };

  it('expõe data de segunda, data de quinta e índices de rotação', () => {
    const cycle = calculateWeekCycles(
      new Date(2023, 4, 15),
      new Date(2023, 4, 8),
      mockSchedule,
    );

    expect(cycle.monTueDate.getDay()).toBe(1);
    expect(cycle.thuFriDate.getDay()).toBe(4);
    expect(cycle.monTueCycleIndex).toBe(1 % mockSchedule.monTue.length);
    expect(cycle.thuFriCycleIndex).toBe(1 % mockSchedule.thuFri.length);
  });

  it('agrupa o domingo na semana anterior', () => {
    const cycle = calculateWeekCycles(
      new Date(2023, 4, 21),
      new Date(2023, 4, 8),
      mockSchedule,
    );

    expect(cycle.monTueDate.getDate()).toBe(15);
  });

  it('clampa weekDiff em zero quando today é anterior à referência', () => {
    const cycle = calculateWeekCycles(
      new Date(2023, 4, 1),
      new Date(2023, 4, 8),
      mockSchedule,
    );

    expect(cycle.monTueCycleIndex).toBe(0);
    expect(cycle.thuFriCycleIndex).toBe(0);
  });

  it('rejeita datas inválidas', () => {
    expect(() =>
      calculateWeekCycles(new Date('invalid'), new Date(), mockSchedule),
    ).toThrow();
  });
});
