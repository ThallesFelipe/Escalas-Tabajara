/**
 * @fileoverview Testes para utilitários de data
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  formatDate, 
  getWeekDifference, 
  getMondayDate, 
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

  describe('getMondayDate', () => {
    it('deve retornar a própria data se for segunda-feira', () => {
      const monday = new Date(2023, 4, 15); // Segunda-feira
      const result = getMondayDate(monday);
      expect(result.getDay()).toBe(1); // Segunda
      expect(result.getDate()).toBe(15);
    });

    it('deve retornar a segunda-feira anterior para outros dias', () => {
      const wednesday = new Date(2023, 4, 17); // Quarta-feira
      const result = getMondayDate(wednesday);
      expect(result.getDay()).toBe(1); // Segunda
      expect(result.getDate()).toBe(15);
    });

    it('deve tratar domingo corretamente', () => {
      const sunday = new Date(2023, 4, 21); // Domingo
      const result = getMondayDate(sunday);
      expect(result.getDay()).toBe(1); // Segunda
      expect(result.getDate()).toBe(15);
    });

    it('deve lançar erro para data inválida', () => {
      const invalidDate = new Date('invalid');
      expect(() => getMondayDate(invalidDate)).toThrow();
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
        monday: [{ cozinha: 'A' }, { cozinha: 'B' }],
        wednesday: [{ cozinha: 'C' }, { cozinha: 'D' }, { cozinha: 'E' }],
        friday: [{ cozinha: 'F' }]
      };
    });

    it('deve calcular ciclos corretamente', () => {
      const currentDate = new Date(2023, 4, 15); // Segunda
      const referenceDate = new Date(2023, 4, 8); // Segunda anterior
      
      const result = calculateWeekCycles(currentDate, referenceDate, mockScheduleData);
      
      expect(result).toHaveProperty('mondayDate');
      expect(result).toHaveProperty('wednesdayDate');
      expect(result).toHaveProperty('fridayDate');
      expect(result).toHaveProperty('mondayCycleIndex');
      expect(result).toHaveProperty('wednesdayCycleIndex');
      expect(result).toHaveProperty('fridayCycleIndex');
    });

    it('deve tratar domingo corretamente', () => {
      const sunday = new Date(2023, 4, 21);
      const referenceDate = new Date(2023, 4, 8);
      
      const result = calculateWeekCycles(sunday, referenceDate, mockScheduleData);
      
      expect(result.mondayDate.getDay()).toBe(1); // Segunda
    });

    it('deve lançar erro para datas inválidas', () => {
      const invalidDate = new Date('invalid');
      const validDate = new Date(2023, 4, 15);
      
      expect(() => calculateWeekCycles(invalidDate, validDate, mockScheduleData)).toThrow();
      expect(() => calculateWeekCycles(validDate, invalidDate, mockScheduleData)).toThrow();
    });
  });
});

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
