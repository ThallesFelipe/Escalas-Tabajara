import { roomsByGroup } from './data.js';
import { formatDate, startOfWeek } from './dateUtils.js';
import { el } from './domUtils.js';
import { icon } from './icons.js';

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

    this.weekStart = cycle.monTueDate;
    this.container.replaceChildren(
      this.#column(
        'cleaning-mon-tue',
        'Segunda e Terça',
        scheduleData.monTue?.[cycle.monTueCycleIndex],
        cycle.monTueDate,
        roomsByGroup.monTue
      ),
      this.#column(
        'cleaning-thu-fri',
        'Quinta e Sexta',
        scheduleData.thuFri?.[cycle.thuFriCycleIndex],
        cycle.thuFriDate,
        roomsByGroup.thuFri
      )
    );
    this.highlightToday();
  }

  highlightToday() {
    if (!this.container) return;
    const today = new Date();
    const isCurrentWeek = this.weekStart?.getTime() === startOfWeek(today).getTime();
    const activeId = isCurrentWeek ? COLUMN_BY_WEEKDAY[today.getDay()] : undefined;
    for (const column of this.container.querySelectorAll('.column')) {
      const isToday = column.id === activeId;
      column.classList.toggle('current-day', isToday);
      if (isToday) column.setAttribute('aria-current', 'date');
      else column.removeAttribute('aria-current');
      const badge = column.querySelector('.today-badge');
      badge?.toggleAttribute('hidden', !isToday);
    }
  }

  /**
   * @param {string} id
   * @param {string} label
   * @param {import('../types').Rotation | undefined} rotation
   * @param {Date} startDate
   * @param {import('../types').Room[]} groupRooms
   */
  #column(id, label, rotation, startDate, groupRooms) {
    const headerId = `${id}-header`;
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    const dateRange = `${formatDate(startDate)} – ${formatDate(endDate)}`;

    const header = el('header', {
      className: 'column-header',
      children: [
        el('div', {
          children: [
            el('h3', { id: headerId, className: 'day-title', text: label }),
            el('span', {
              className: 'date-display',
              text: dateRange,
              attrs: { 'aria-label': `Datas: ${dateRange}` },
            }),
          ],
        }),
        el('span', { className: 'today-badge', text: 'HOJE', attrs: { hidden: '' } }),
      ],
    });

    const body = rotation
      ? el('div', {
          className: 'rooms-list',
          attrs: {
            role: 'list',
            'aria-label': `Responsáveis pela limpeza de ${label}`,
          },
          children: groupRooms.map(room => this.#room(room, rotation)),
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
              className: 'room-icon',
              children: [icon(room.icon)],
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
