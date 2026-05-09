import { rooms } from './data.js';
import { formatDate } from './dateUtils.js';
import { el } from './domUtils.js';

/** @type {Record<number, string | undefined>} */
const COLUMN_BY_WEEKDAY = {
  1: 'cleaning-mon-tue',
  2: 'cleaning-mon-tue',
  4: 'cleaning-thu-fri',
  5: 'cleaning-thu-fri',
};

export class ScheduleRenderer {
  /** @param {import('../types').AppElements} elements */
  constructor({ schedule }) {
    this.container = schedule;
  }

  /**
   * @param {import('../types').WeekCycle} cycle
   * @param {import('../types').ScheduleData} scheduleData
   */
  render(cycle, scheduleData) {
    if (!this.container) return;

    this.container.replaceChildren(
      this.#column(
        'cleaning-mon-tue',
        'Segunda e Terça',
        scheduleData.monTue?.[cycle.monTueCycleIndex],
        cycle.monTueDate,
      ),
      this.#column(
        'cleaning-thu-fri',
        'Quinta e Sexta',
        scheduleData.thuFri?.[cycle.thuFriCycleIndex],
        cycle.thuFriDate,
      ),
    );
    this.highlightToday();
  }

  highlightToday() {
    if (!this.container) return;
    const activeId = COLUMN_BY_WEEKDAY[new Date().getDay()];
    for (const column of this.container.querySelectorAll('.column')) {
      column.classList.toggle('current-day', column.id === activeId);
    }
  }

  /**
   * @param {string} id
   * @param {string} label
   * @param {import('../types').Rotation | undefined} rotation
   * @param {Date} startDate
   */
  #column(id, label, rotation, startDate) {
    const headerId = `${id}-header`;
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    const dateRange = `${formatDate(startDate)} – ${formatDate(endDate)}`;

    const header = el('header', {
      className: 'column-header',
      children: [
        el('h3', { id: headerId, className: 'day-title', text: label }),
        el('span', {
          className: 'date-display',
          text: dateRange,
          attrs: { 'aria-label': `Datas: ${dateRange}` },
        }),
      ],
    });

    const body = rotation
      ? el('div', {
          className: 'rooms-list',
          attrs: {
            role: 'list',
            'aria-label': `Responsáveis pela limpeza de ${label}`,
          },
          children: rooms.map((room) => this.#room(room, rotation)),
        })
      : el('p', {
          className: 'empty-message',
          text: 'Escala não disponível.',
        });

    return el('div', {
      id,
      className: rotation ? 'column' : 'column column-empty',
      attrs: { role: 'region', 'aria-labelledby': headerId },
      children: [header, body],
    });
  }

  /**
   * @param {import('../types').Room} room
   * @param {import('../types').Rotation} rotation
   */
  #room(room, rotation) {
    const responsible = rotation[room.key] ?? '—';
    return el('div', {
      className: 'room',
      attrs: {
        role: 'listitem',
        'aria-label': `${room.label}: ${responsible}`,
      },
      children: [
        el('div', {
          className: 'room-info',
          children: [
            el('span', {
              className: 'material-symbols-rounded room-icon',
              text: room.icon,
              attrs: { 'aria-hidden': 'true' },
            }),
            el('span', { className: 'room-name', text: room.label }),
          ],
        }),
        el('span', {
          className: 'responsible',
          text: responsible,
          attrs: { title: `Responsável: ${responsible}` },
        }),
      ],
    });
  }
}
