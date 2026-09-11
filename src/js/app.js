import { REFERENCE_DATE, scheduleData } from './modules/data.js';
import { calculateWeekCycles } from './modules/dateUtils.js';
import { el, queryAppElements } from './modules/domUtils.js';
import { ScheduleRenderer } from './modules/scheduleRenderer.js';
import { ThemeManager } from './modules/themeManager.js';
import { WashingScheduleManager } from './modules/washingScheduleManager.js';
import { DashboardManager } from './modules/dashboardManager.js';
import { hydrateIcons } from './modules/icons.js';

/**
 * @param {HTMLElement | null} container
 * @param {unknown} error
 */
const renderError = (container, error) => {
  if (!container) return;
  const btn = el('button', {
    className: 'retry-button',
    text: 'Recarregar',
    attrs: { type: 'button' },
  });
  btn.addEventListener('click', () => location.reload());
  container.replaceChildren(
    el('div', {
      className: 'error-message',
      attrs: { role: 'alert' },
      children: [
        el('h3', { text: 'Não foi possível carregar a escala' }),
        el('p', {
          text: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
        }),
        btn,
      ],
    })
  );
};

const init = () => {
  const dom = queryAppElements();
  if (!dom.schedule || !dom.themeToggle) {
    console.error('Elementos essenciais do DOM não encontrados.');
    return;
  }

  hydrateIcons();
  new ThemeManager(dom);
  const cleaning = new ScheduleRenderer(dom);
  const washing = new WashingScheduleManager(dom);

  const refresh = () => {
    try {
      const cycle = calculateWeekCycles(dashboard.date, REFERENCE_DATE, scheduleData);
      cleaning.render(cycle, scheduleData);
      washing.highlightToday();
      dashboard.render();
    } catch (error) {
      console.error(error);
      renderError(dom.schedule, error);
    }
  };

  const dashboard = new DashboardManager(refresh);
  washing.render();
  refresh();

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refresh();
  });
  window.addEventListener('focus', refresh);
  // Keep an open tab accurate when the day changes, without rebuilding it every minute.
  let lastDate = new Date().toDateString();
  window.setInterval(() => {
    const date = new Date().toDateString();
    if (date !== lastDate) {
      lastDate = date;
      refresh();
    }
  }, 60_000);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
