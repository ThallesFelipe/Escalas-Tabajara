import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import page from '../../index.html?raw';
import { DashboardManager } from '../js/modules/dashboardManager.js';
import { ScheduleRenderer } from '../js/modules/scheduleRenderer.js';
import { WashingScheduleManager } from '../js/modules/washingScheduleManager.js';
import { ThemeManager } from '../js/modules/themeManager.js';
import { queryAppElements } from '../js/modules/domUtils.js';
import { REFERENCE_DATE, scheduleData, washingSchedule } from '../js/modules/data.js';
import { calculateWeekCycles, startOfWeek } from '../js/modules/dateUtils.js';

/** @param {string} id */
const element = id => /** @type {HTMLElement} */ (document.getElementById(id));

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 11, 12));
  document.documentElement.classList.remove('dark-mode');
  document.body.innerHTML = page.match(/<body>([\s\S]*)<\/body>/)?.[1] ?? '';
  vi.mocked(localStorage.getItem).mockReset().mockReturnValue(null);
  vi.mocked(localStorage.setItem).mockReset();
  vi.mocked(window.matchMedia)
    .mockReset()
    .mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const mountDashboard = () => {
  const dom = queryAppElements();
  const cleaning = new ScheduleRenderer(dom);
  const washing = new WashingScheduleManager(dom);
  const refresh = () => {
    cleaning.render(
      calculateWeekCycles(dashboard.date, REFERENCE_DATE, scheduleData),
      scheduleData
    );
    washing.highlightToday();
    dashboard.render();
  };
  const dashboard = new DashboardManager(refresh);
  washing.render();
  refresh();
  return { dashboard, refresh };
};

describe('dashboard semanal', () => {
  it('mostra os responsáveis reais e o destaque textual de hoje', () => {
    mountDashboard();
    expect(document.querySelectorAll('.room')).toHaveLength(11);
    expect(element('cleaning-mon-tue').querySelectorAll('.room')).toHaveLength(6);
    expect(element('cleaning-thu-fri').querySelectorAll('.room')).toHaveLength(5);
    expect(element('cleaning-mon-tue').textContent).toContain('Lavanderia');
    expect(element('cleaning-thu-fri').textContent).not.toContain('Lavanderia');
    expect(document.querySelectorAll('#washingTableBody tr')).toHaveLength(7);
    expect(element('todayWashing').textContent).toBe('Espalha e B. Gugu');
    expect(element('cleaning-thu-fri').getAttribute('aria-current')).toBe('date');
    expect(document.querySelectorAll('.today-badge:not([hidden])')).toHaveLength(2);
    expect(element('currentWeek').hasAttribute('disabled')).toBe(true);
  });

  it('avança a rotação, remove o destaque da limpeza e retorna à semana atual', () => {
    mountDashboard();
    const original = element('cleaningSchedule').textContent;
    element('nextWeek').click();
    expect(element('cleaningSchedule').textContent).not.toBe(original);
    expect(document.querySelector('#cleaningSchedule [aria-current]')).toBeNull();
    expect(element('currentWeek').hasAttribute('disabled')).toBe(false);
    expect(element('todayWashing').textContent).toBe('Espalha e B. Gugu');
    expect(document.querySelector('#washingTableBody [aria-current]')).not.toBeNull();
    element('currentWeek').click();
    expect(element('cleaningSchedule').textContent).toBe(original);
    expect(element('cleaning-thu-fri').getAttribute('aria-current')).toBe('date');
  });

  it('renderiza as distribuições iniciais e a rotação de cada grupo nas linhas corretas', () => {
    mountDashboard();
    /** @param {string} id */
    const assignments = id =>
      Array.from(element(id).querySelectorAll('.room'), room => [
        room.querySelector('.room-name')?.textContent,
        room.querySelector('.responsible')?.textContent,
      ]);
    expect(assignments('cleaning-mon-tue')).toEqual([
      ['Cozinha', 'Gaga'],
      ['Banheiro de baixo', 'LATAM'],
      ['Banheiro suíte', 'B. Fábio'],
      ['Sala e corredor', 'B. Sereno'],
      ['Lavabo', 'A. Viihtube'],
      ['Lavanderia', 'Agregu'],
    ]);
    expect(assignments('cleaning-thu-fri')).toEqual([
      ['Cozinha', 'Espalha'],
      ['Banheiro de baixo', 'Navala'],
      ['Banheiro suíte', 'Smigou'],
      ['Sala e corredor', 'Rita'],
      ['Lavabo', 'B. Gugu'],
    ]);
    element('nextWeek').click();
    expect(assignments('cleaning-mon-tue')).toEqual([
      ['Cozinha', 'LATAM'],
      ['Banheiro de baixo', 'B. Fábio'],
      ['Banheiro suíte', 'B. Sereno'],
      ['Sala e corredor', 'A. Viihtube'],
      ['Lavabo', 'Agregu'],
      ['Lavanderia', 'Gaga'],
    ]);
    expect(assignments('cleaning-thu-fri')).toEqual([
      ['Cozinha', 'Navala'],
      ['Banheiro de baixo', 'Smigou'],
      ['Banheiro suíte', 'Rita'],
      ['Sala e corredor', 'B. Gugu'],
      ['Lavabo', 'Espalha'],
    ]);
  });

  it('impede navegação para antes da origem das escalas', () => {
    vi.setSystemTime(new Date(2026, 8, 7, 12));
    const { dashboard } = mountDashboard();
    expect(element('previousWeek').hasAttribute('disabled')).toBe(true);
    dashboard.moveWeek(-1);
    expect(startOfWeek(dashboard.date)).toEqual(REFERENCE_DATE);
    element('nextWeek').click();
    expect(element('previousWeek').hasAttribute('disabled')).toBe(false);
    element('previousWeek').click();
    expect(element('previousWeek').hasAttribute('disabled')).toBe(true);
  });

  it('atualiza a semana e o resumo na virada de domingo para segunda', () => {
    vi.setSystemTime(new Date(2026, 8, 13, 23, 59));
    const { refresh } = mountDashboard();
    expect(document.querySelector('#cleaningSchedule [aria-current]')).toBeNull();
    const range = element('weekRange').textContent;
    vi.setSystemTime(new Date(2026, 8, 14, 0, 1));
    refresh();
    expect(element('weekRange').textContent).not.toBe(range);
    expect(element('todayWashing').textContent).toBe('Gaga e A. Viihtube');
    expect(element('cleaning-mon-tue').getAttribute('aria-current')).toBe('date');
  });

  it('mantém a semana consultada ao atualizar o dia', () => {
    const { dashboard, refresh } = mountDashboard();
    dashboard.moveWeek(2);
    const range = element('weekRange').textContent;
    vi.setSystemTime(new Date(2026, 8, 12, 12));
    refresh();
    expect(element('weekRange').textContent).toBe(range);
    expect(element('todayWashing').textContent).toBe('Smigou');
    expect(element('todayCleaning').textContent).toContain('Sem rodada');
  });

  it.each(washingSchedule)(
    'destaca corretamente $day, sem depender apenas de cor',
    ({ dayIndex, users }) => {
      vi.setSystemTime(new Date(2026, 8, 6 + dayIndex, 12));
      mountDashboard();
      const rows = document.querySelectorAll('#washingTableBody [aria-current="date"]');
      expect(rows).toHaveLength(1);
      expect(rows[0].getAttribute('data-day-index')).toBe(String(dayIndex));
      expect(rows[0].querySelector('.today-badge')?.hasAttribute('hidden')).toBe(false);
      expect(element('todayWashing').textContent).toBe(users);
    }
  );

  it('navega entre anos mantendo as datas e a rotação', () => {
    vi.setSystemTime(new Date(2026, 11, 28, 12));
    mountDashboard();
    expect(element('weekRange').textContent).toContain('2026');
    expect(element('weekRange').textContent).toContain('2027');
    element('nextWeek').click();
    expect(element('weekRange').textContent).toContain('2027');
    expect(document.querySelectorAll('.room')).toHaveLength(11);
  });

  it('troca a semana sem animação quando movimento reduzido está ativo', () => {
    const animate = vi.fn();
    element('cleaningSchedule').animate = animate;
    vi.mocked(window.matchMedia).mockReturnValue({
      ...window.matchMedia('(prefers-reduced-motion: reduce)'),
      matches: true,
    });
    mountDashboard();
    element('nextWeek').click();
    expect(element('currentWeek').hasAttribute('disabled')).toBe(false);
    expect(animate).not.toHaveBeenCalled();
  });
});

describe('tema', () => {
  it('aplica a preferência salva na raiz e mantém o controle acessível', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('dark');
    new ThemeManager(queryAppElements());
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    expect(element('themeToggle').getAttribute('aria-pressed')).toBe('true');
    expect(element('themeIcon').querySelector('svg')).not.toBeNull();
    element('themeToggle').click();
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    expect(element('themeToggle').getAttribute('aria-label')).toBe('Alternar para modo escuro');
    expect(localStorage.setItem).toHaveBeenCalledWith('escalas-tabajara-theme', 'light');
  });

  it('continua alternando quando armazenamento está bloqueado', () => {
    vi.mocked(localStorage.getItem).mockImplementation(() => {
      throw new Error('Bloqueado');
    });
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new Error('Bloqueado');
    });
    new ThemeManager(queryAppElements());
    element('themeToggle').click();
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
  });
});
