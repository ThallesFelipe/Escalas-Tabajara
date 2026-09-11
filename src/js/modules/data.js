/**
 * Configuração das escalas. Para atualizar moradores ou a tabela da máquina de
 * lavar, basta editar os arrays abaixo — a rotação é regenerada automaticamente.
 */

const monTueMembers = ['Rita', 'Navala', 'A. Gustavo', 'Smigou', 'I. Oliver'];

const thuFriMembers = ['LATAM', 'Gaga', 'Espalha', 'B. Gugu', 'A. Viihtube'];

/** @type {import('../types').Room[]} */
export const rooms = [
  { label: 'Cozinha', key: 'cozinha', icon: 'restaurant' },
  { label: 'Banheiro de baixo', key: 'banhBaixo', icon: 'shower' },
  { label: 'Banheiro suíte', key: 'banhSuite', icon: 'bathtub' },
  { label: 'Sala e corredor', key: 'sala', icon: 'weekend' },
  { label: 'Lavabo', key: 'lavabo', icon: 'wash' },
];

/** @type {import('../types').WashingDay[]} */
export const washingSchedule = [
  { dayIndex: 0, day: 'Domingo', users: 'Franceses' },
  { dayIndex: 1, day: 'Segunda-feira', users: 'Gaga e A. Viihtube' },
  { dayIndex: 2, day: 'Terça-feira', users: 'LATAM e B. Çerenu' },
  { dayIndex: 3, day: 'Quarta-feira', users: 'Navala e Rita' },
  { dayIndex: 4, day: 'Quinta-feira', users: 'B. Fábio e Agregu' },
  { dayIndex: 5, day: 'Sexta-feira', users: 'Espalha e B. Gugu' },
  { dayIndex: 6, day: 'Sábado', users: 'Smigou' },
];

// Segunda, 8 de dezembro de 2025 — origem do ciclo semanal.
export const REFERENCE_DATE = new Date(2025, 11, 8);

/**
 * Rotação circular: a cada semana, todo morador avança um cômodo. Quando há
 * menos moradores que cômodos, a sala assume também o lavabo.
 *
 * @param {string[]} members
 * @returns {import('../types').Rotation[]}
 */
function buildRotations(members) {
  return members.map((_member, week) => {
    const rotation = Object.fromEntries(
      rooms.map((room, i) => [room.key, members[(i + week) % members.length]])
    );
    if (members.length < rooms.length) rotation['lavabo'] = rotation['sala'];
    return /** @type {import('../types').Rotation} */ (rotation);
  });
}

/** @type {import('../types').ScheduleData} */
export const scheduleData = {
  monTue: buildRotations(monTueMembers),
  thuFri: buildRotations(thuFriMembers),
};
