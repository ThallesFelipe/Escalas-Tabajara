/**
 * Configuração das escalas. Para atualizar moradores ou a tabela da máquina de
 * lavar, basta editar os arrays abaixo — a rotação é regenerada automaticamente.
 */

const monTueMembers = ['A. Viihtube', 'Gaga', 'LATAM', 'B. Fábio', 'B. Sereno'];

const thuFriMembers = ['Espalha', 'Navala', 'Agregu', 'Rita', 'B. Gugu'];

/** @type {import('../types').Room[]} */
const commonRooms = [
  { label: 'Cozinha', key: 'cozinha', icon: 'restaurant' },
  { label: 'Banheiro de baixo', key: 'banhBaixo', icon: 'shower' },
  { label: 'Banheiro suíte', key: 'banhSuite', icon: 'bathtub' },
  { label: 'Sala e corredor', key: 'sala', icon: 'weekend' },
  { label: 'Lavabo', key: 'lavabo', icon: 'wash' },
];

/** @type {Record<keyof import('../types').ScheduleData, import('../types').Room[]>} */
export const roomsByGroup = {
  monTue: [...commonRooms],
  thuFri: [...commonRooms],
};

/** @type {import('../types').WashingDay[]} */
export const washingSchedule = [
  { dayIndex: 0, day: 'Domingo', users: 'Panos' },
  { dayIndex: 1, day: 'Segunda-feira', users: 'Gaga e A. Viihtube' },
  { dayIndex: 2, day: 'Terça-feira', users: 'LATAM e B. Çerenu' },
  { dayIndex: 3, day: 'Quarta-feira', users: 'Navala e Rita' },
  { dayIndex: 4, day: 'Quinta-feira', users: 'B. Fábio e Agregu' },
  { dayIndex: 5, day: 'Sexta-feira', users: 'Espalha e B. Gugu' },
  { dayIndex: 6, day: 'Sábado', users: 'Livre' },
];

// Segunda, 7 de setembro de 2026 — distribuição inicial dos dois grupos fixos.
export const REFERENCE_DATE = new Date(2026, 8, 7);

/**
 * Rotação circular dentro do grupo: cada pessoa sobe uma tarefa por semana.
 * Quem estava na primeira tarefa vai para a última, sem trocar de grupo.
 *
 * @param {string[]} members
 * @param {import('../types').Room[]} groupRooms
 * @returns {import('../types').Rotation[]}
 */
function buildRotations(members, groupRooms) {
  if (members.length === 0 || members.length !== groupRooms.length) {
    throw new Error('Cada grupo deve ter uma pessoa por tarefa.');
  }
  return members.map((_member, week) => {
    const rotation = Object.fromEntries(
      groupRooms.map((room, i) => [room.key, members[(i + week) % members.length]])
    );
    return /** @type {import('../types').Rotation} */ (rotation);
  });
}

/** @type {import('../types').ScheduleData} */
export const scheduleData = {
  monTue: buildRotations(monTueMembers, roomsByGroup.monTue),
  thuFri: buildRotations(thuFriMembers, roomsByGroup.thuFri),
};
