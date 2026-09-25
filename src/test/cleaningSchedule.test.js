import { describe, expect, it } from 'vitest';
import { REFERENCE_DATE, roomsByGroup, scheduleData, washingSchedule } from '../js/modules/data.js';
import { calculateWeekCycles } from '../js/modules/dateUtils.js';

const initialMonTue = {
  cozinha: 'Gaga',
  banhBaixo: 'LATAM',
  banhSuite: 'B. Fábio',
  sala: 'B. Sereno',
  lavabo: 'A. Viihtube',
  lavanderia: 'Agregu',
};
const initialThuFri = {
  cozinha: 'Espalha',
  banhBaixo: 'Navala',
  banhSuite: 'Smigou',
  sala: 'Rita',
  lavabo: 'B. Gugu',
};

/** @param {number} week */
const rotationsAt = week => {
  const date = new Date(2026, 8, 7 + week * 7, 12);
  const cycle = calculateWeekCycles(date, REFERENCE_DATE, scheduleData);
  return {
    monTue: scheduleData.monTue[cycle.monTueCycleIndex],
    thuFri: scheduleData.thuFri[cycle.thuFriCycleIndex],
  };
};

describe('grupos fixos de limpeza', () => {
  it('começa em 07/09/2026 com as duas distribuições solicitadas', () => {
    expect(REFERENCE_DATE).toEqual(new Date(2026, 8, 7));
    expect(rotationsAt(0)).toEqual({ monTue: initialMonTue, thuFri: initialThuFri });
    expect(roomsByGroup.monTue.map(room => room.label)).toEqual([
      'Cozinha',
      'Banheiro de baixo',
      'Banheiro suíte',
      'Sala e corredor',
      'Lavabo',
      'Lavanderia',
    ]);
    expect(roomsByGroup.thuFri.map(room => room.label)).toEqual([
      'Cozinha',
      'Banheiro de baixo',
      'Banheiro suíte',
      'Sala e corredor',
      'Lavabo',
    ]);
  });

  it('faz cada pessoa subir uma tarefa em 14/09, levando a primeira para a última', () => {
    expect(rotationsAt(1)).toEqual({
      monTue: {
        cozinha: 'LATAM',
        banhBaixo: 'B. Fábio',
        banhSuite: 'B. Sereno',
        sala: 'A. Viihtube',
        lavabo: 'Agregu',
        lavanderia: 'Gaga',
      },
      thuFri: {
        cozinha: 'Navala',
        banhBaixo: 'Smigou',
        banhSuite: 'Rita',
        sala: 'B. Gugu',
        lavabo: 'Espalha',
      },
    });
  });

  it('fecha os ciclos independentes em seis e cinco semanas, sem repetições antecipadas', () => {
    expect(scheduleData.monTue).toHaveLength(6);
    expect(scheduleData.thuFri).toHaveLength(5);
    for (let week = 1; week < 6; week++) {
      expect(rotationsAt(week).monTue).not.toEqual(initialMonTue);
    }
    for (let week = 1; week < 5; week++) {
      expect(rotationsAt(week).thuFri).not.toEqual(initialThuFri);
    }
    expect(rotationsAt(5).thuFri).toEqual(initialThuFri);
    expect(rotationsAt(6).monTue).toEqual(initialMonTue);
    expect(rotationsAt(6).thuFri).toEqual(rotationsAt(1).thuFri);
    expect(rotationsAt(30)).toEqual(rotationsAt(0));
  });

  it.each([
    { group: /** @type {const} */ ('monTue'), initial: initialMonTue, length: 6 },
    { group: /** @type {const} */ ('thuFri'), initial: initialThuFri, length: 5 },
  ])(
    'mantém pessoas e tarefas de $group durante 30 semanas, incluindo a virada do ano',
    ({ group, initial, length }) => {
      const keys = roomsByGroup[group].map(room => room.key);
      const members = Object.values(initial).sort();
      for (let week = 0; week <= 30; week++) {
        const rotation = rotationsAt(week)[group];
        expect(Object.keys(rotation)).toEqual(keys);
        expect(Object.values(rotation).sort()).toEqual(members);
        expect(new Set(Object.values(rotation)).size).toBe(length);
        if (group === 'thuFri') expect(rotation).not.toHaveProperty('lavanderia');

        // Check each person's movement relative to the previous week, including wraparound.
        if (week > 0) {
          const previous = rotationsAt(week - 1)[group];
          for (const person of members) {
            const oldPosition = keys.findIndex(key => previous[key] === person);
            const newPosition = keys.findIndex(key => rotation[key] === person);
            expect(newPosition).toBe(oldPosition === 0 ? length - 1 : oldPosition - 1);
          }
        }
      }
      for (const person of members) {
        const visited = new Set(
          Array.from({ length }, (_, week) =>
            keys.find(key => rotationsAt(week)[group][key] === person)
          )
        );
        expect(visited.size).toBe(length);
      }
    }
  );

  it('mantém a mesma distribuição de segunda até domingo e avança na segunda seguinte', () => {
    for (let day = 7; day <= 13; day++) {
      const cycle = calculateWeekCycles(
        new Date(2026, 8, day, 23, 59),
        REFERENCE_DATE,
        scheduleData
      );
      expect(cycle.monTueCycleIndex).toBe(0);
      expect(cycle.thuFriCycleIndex).toBe(0);
      expect(cycle.monTueDate).toEqual(new Date(2026, 8, 7));
      expect(cycle.thuFriDate).toEqual(new Date(2026, 8, 10));
    }
    const next = calculateWeekCycles(new Date(2026, 8, 14), REFERENCE_DATE, scheduleData);
    expect(next.monTueCycleIndex).toBe(1);
    expect(next.thuFriCycleIndex).toBe(1);
  });

  it('preserva integralmente a escala independente da máquina de lavar', () => {
    expect(washingSchedule).toEqual([
      { dayIndex: 0, day: 'Domingo', users: 'Panos' },
      { dayIndex: 1, day: 'Segunda-feira', users: 'Gaga e A. Viihtube' },
      { dayIndex: 2, day: 'Terça-feira', users: 'LATAM e B. Çerenu' },
      { dayIndex: 3, day: 'Quarta-feira', users: 'Navala e Rita' },
      { dayIndex: 4, day: 'Quinta-feira', users: 'B. Fábio e Agregu' },
      { dayIndex: 5, day: 'Sexta-feira', users: 'Espalha e B. Gugu' },
      { dayIndex: 6, day: 'Sábado', users: 'Smigou' },
    ]);
  });
});
