/**
 * @fileoverview Testes para utilitários de data
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatDate,
  getWeekDifference,
  getmonday_tuesdayDate,
  calculateWeekCycles,
  isToday,
  getDayName,
  isValidDateRange
} from '../js/modules/dateUtils.js';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('deve formatar data corretamente no padrão brasileiro', () => {
      const date = new Date(2023, 4, 15); // 15 de maio de 2023
      const result = formatDate(date);
      expect(result).toBe('15/05');
    });

    it('deve lançar erro para data inválida', () => {
      const invalidDate = new Date('invalid');
      expect(() => formatDate(invalidDate)).toThrow('Data inválida fornecida para formatação');
    });

    it('deve lançar erro para valor que não é Date', () => {
      expect(() => formatDate('not a date')).toThrow('Data inválida fornecida para formatação');
    });
  });

  describe('getWeekDifference', () => {
    it('deve calcular diferença de semanas corretamente', () => {
      const date1 = new Date(2023, 4, 15); // 15 de maio de 2023
      const date2 = new Date(2023, 4, 8);  // 8 de maio de 2023
      const result = getWeekDifference(date1, date2);
      expect(result).toBe(1);
    });

    it('deve retornar 0 para datas na mesma semana', () => {
      const date1 = new Date(2023, 4, 15); // Segunda
      const date2 = new Date(2023, 4, 17); // Quarta
      const result = getWeekDifference(date1, date2);
      expect(result).toBe(0);
    });

    it('deve lançar erro para datas inválidas', () => {
      const validDate = new Date(2023, 4, 15);
      const invalidDate = new Date('invalid');
      expect(() => getWeekDifference(validDate, invalidDate)).toThrow();
    });
  });

  describe('getmonday_tuesdayDate', () => {
    it('deve retornar a própria data se for Segunda e Terça', () => {
      const monday_tuesday = new Date(2023, 4, 15); // Segunda e Terça
      const result = getmonday_tuesdayDate(monday_tuesday);
      expect(result.getDay()).toBe(1); // Segunda
      expect(result.getDate()).toBe(15);
    });

    it('deve retornar a Segunda e Terça anterior para outros dias', () => {
      const wednesday = new Date(2023, 4, 17); // Quarta-feira
      const result = getmonday_tuesdayDate(wednesday);
      expect(result.getDay()).toBe(1); // Segunda
      expect(result.getDate()).toBe(15);
    });

    it('deve tratar domingo corretamente', () => {
      const sunday = new Date(2023, 4, 21); // Domingo
      const result = getmonday_tuesdayDate(sunday);
      expect(result.getDay()).toBe(1); // Segunda
      expect(result.getDate()).toBe(15);
    });

    it('deve lançar erro para data inválida', () => {
      const invalidDate = new Date('invalid');
      expect(() => getmonday_tuesdayDate(invalidDate)).toThrow();
    });
  });

  describe('isToday', () => {
    it('deve retornar true para data de hoje', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('deve retornar false para data diferente', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('deve retornar false para data inválida', () => {
      const invalidDate = new Date('invalid');
      expect(isToday(invalidDate)).toBe(false);
    });
  });

  describe('getDayName', () => {
    it('deve retornar nomes corretos dos dias', () => {
      expect(getDayName(0)).toBe('Domingo');
      expect(getDayName(1)).toBe('Segunda-feira');
      expect(getDayName(2)).toBe('Terça-feira');
      expect(getDayName(3)).toBe('Quarta-feira');
      expect(getDayName(4)).toBe('Quinta-feira');
      expect(getDayName(5)).toBe('Sexta-feira');
      expect(getDayName(6)).toBe('Sábado');
    });

    it('deve retornar mensagem de erro para índice inválido', () => {
      expect(getDayName(7)).toBe('Dia inválido');
      expect(getDayName(-1)).toBe('Dia inválido');
      expect(getDayName(null)).toBe('Dia inválido');
    });
  });

  describe('isValidDateRange', () => {
    it('deve retornar true para datas dentro do range', () => {
      const currentYear = new Date().getFullYear();
      const validDate = new Date(currentYear, 0, 1);
      expect(isValidDateRange(validDate)).toBe(true);
    });

    it('deve retornar false para datas muito antigas', () => {
      const oldDate = new Date(1900, 0, 1);
      expect(isValidDateRange(oldDate, 5)).toBe(false);
    });

    it('deve retornar false para data inválida', () => {
      const invalidDate = new Date('invalid');
      expect(isValidDateRange(invalidDate)).toBe(false);
    });
  });

  describe('calculateWeekCycles', () => {
    let mockScheduleData;

    beforeEach(() => {
      mockScheduleData = {
        monday_tuesday: [{ cozinha: 'A' }, { cozinha: 'B' }],
        thursday_friday: [{ cozinha: 'F' }]
      };
    });

    it('deve calcular ciclos corretamente', () => {
      const currentDate = new Date(2023, 4, 15); // Segunda
      const referenceDate = new Date(2023, 4, 8); // Segunda anterior

      const result = calculateWeekCycles(currentDate, referenceDate, mockScheduleData);

      expect(result).toHaveProperty('monday_tuesdayDate');
      expect(result).toHaveProperty('thursday_fridayDate');
      expect(result).toHaveProperty('monday_tuesdayCycleIndex');
      expect(result).toHaveProperty('thursday_fridayCycleIndex');
    });

    it('deve tratar domingo corretamente', () => {
      const sunday = new Date(2023, 4, 21);
      const referenceDate = new Date(2023, 4, 8);

      const result = calculateWeekCycles(sunday, referenceDate, mockScheduleData);

      expect(result.monday_tuesdayDate.getDay()).toBe(1); // Segunda
    });

    it('deve lançar erro para datas inválidas', () => {
      const invalidDate = new Date('invalid');
      const validDate = new Date(2023, 4, 15);

      expect(() => calculateWeekCycles(invalidDate, validDate, mockScheduleData)).toThrow();
      expect(() => calculateWeekCycles(validDate, invalidDate, mockScheduleData)).toThrow();
    });
  });
});
