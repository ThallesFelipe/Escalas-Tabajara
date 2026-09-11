import { washingSchedule } from './data.js';
import { el } from './domUtils.js';

export class WashingScheduleManager {
  /** @param {import('../types').AppElements} elements */
  constructor({ washing }) {
    this.tbody = washing;
  }

  render() {
    if (!this.tbody) return;
    this.tbody.replaceChildren(
      ...washingSchedule.map(({ dayIndex, day, users }) =>
        el('tr', {
          attrs: { 'data-day-index': String(dayIndex) },
          children: [
            el('th', {
              attrs: { scope: 'row' },
              children: [
                el('span', {
                  className: 'washing-day',
                  children: [
                    el('span', { text: day.replace('-feira', '') }),
                    el('span', { className: 'today-badge', text: 'HOJE', attrs: { hidden: '' } }),
                  ],
                }),
              ],
            }),
            el('td', { text: users }),
          ],
        })
      )
    );
    this.highlightToday();
  }

  highlightToday() {
    if (!this.tbody) return;
    const todayIndex = new Date().getDay();
    for (const row of this.tbody.querySelectorAll('tr')) {
      const isToday = Number(row.dataset.dayIndex) === todayIndex;
      row.classList.toggle('current-day', isToday);
      row.querySelector('.today-badge')?.toggleAttribute('hidden', !isToday);
      if (isToday) row.setAttribute('aria-current', 'date');
      else row.removeAttribute('aria-current');
    }
  }
}
