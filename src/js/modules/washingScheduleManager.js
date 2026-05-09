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
            el('td', { text: day }),
            el('td', { text: users }),
          ],
        }),
      ),
    );
    this.highlightToday();
  }

  highlightToday() {
    if (!this.tbody) return;
    const todayIndex = new Date().getDay();
    for (const row of this.tbody.querySelectorAll('tr')) {
      const isToday = Number(row.dataset.dayIndex) === todayIndex;
      row.classList.toggle('current-day', isToday);
      if (isToday) row.setAttribute('aria-current', 'date');
      else row.removeAttribute('aria-current');
    }
  }
}
