import { REFERENCE_DATE, washingSchedule } from './data.js';
import { startOfWeek } from './dateUtils.js';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export class DashboardManager {
  /** @param {() => void} onChange */
  constructor(onChange) {
    /** @type {Date | null} null follows the current week, including after midnight. */
    this.selectedWeek = null;
    this.onChange = onChange;
    this.previous = document.querySelector('#previousWeek');
    this.next = document.querySelector('#nextWeek');
    this.current = document.querySelector('#currentWeek');
    this.previous?.addEventListener('click', () => this.moveWeek(-1));
    this.next?.addEventListener('click', () => this.moveWeek(1));
    this.current?.addEventListener('click', () => {
      this.selectedWeek = null;
      this.onChange();
      this.animateChange();
    });
  }

  get date() {
    return this.selectedWeek ?? new Date();
  }

  /** @param {number} direction */
  moveWeek(direction) {
    const monday = startOfWeek(this.date);
    monday.setDate(monday.getDate() + direction * 7);
    // Rotations only exist from the reference week onwards.
    if (monday < startOfWeek(REFERENCE_DATE)) return;
    this.selectedWeek = monday.getTime() === startOfWeek(new Date()).getTime() ? null : monday;
    this.onChange();
    this.animateChange();
  }

  animateChange() {
    const container = document.getElementById('cleaningSchedule');
    if (
      !container ||
      typeof container.animate !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    // Replace the previous effect, so rapid clicks never queue animations.
    for (const animation of container.getAnimations()) animation.cancel();
    container.animate(
      [
        { opacity: 0.5, transform: 'translateY(4px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    );
  }

  render() {
    const today = new Date();
    const monday = startOfWeek(this.date);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const range = dateFormatter.formatRange(monday, sunday).replaceAll('.', '');
    const current = monday.getTime() === startOfWeek(today).getTime();
    this.setText('weekRange', range);
    this.current?.toggleAttribute('disabled', current);
    this.previous?.toggleAttribute('disabled', monday <= startOfWeek(REFERENCE_DATE));
    this.setText(
      'todayDate',
      today.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    );
    this.setText(
      'todayWashing',
      washingSchedule.find(day => day.dayIndex === today.getDay())?.users ?? 'Sem escala'
    );
    const cleaningDay = [1, 2, 4, 5].includes(today.getDay());
    this.setText(
      'todayCleaning',
      cleaningDay
        ? 'Também é dia de limpeza. Confira sua parte na escala.'
        : 'Sem rodada de limpeza hoje. Vamos manter o cuidado!'
    );
    this.setText('currentYear', String(today.getFullYear()));
  }

  /** @param {string} id @param {string} text */
  setText(id, text) {
    const element = document.getElementById(id);
    if (element && element.textContent !== text) element.textContent = text;
  }
}
