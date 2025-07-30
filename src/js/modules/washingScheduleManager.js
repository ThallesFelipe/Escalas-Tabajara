/**
 * @fileoverview Gerenciamento da escala da máquina de lavar
 */

import { washingSchedule } from './data.js';
import { DOMUtils } from './domUtils.js';

/**
 * Gerenciador da escala da máquina de lavar
 */
export class WashingScheduleManager {
  constructor(domCache) {
    this.domCache = domCache;
  }

  /**
   * Inicializa a escala da máquina de lavar
   */
  init() {
    this.highlightCurrentWashingDay();
    this.setupAutoUpdate();
  }

  /**
   * Destaca o dia atual na tabela da máquina de lavar
   */
  highlightCurrentWashingDay() {
    const tableBody = this.domCache.get('washingTableBody');

    if (!tableBody) {
      console.warn('Tabela da máquina de lavar não encontrada');
      return;
    }

    try {
      // Remove destaque anterior
      const previousHighlighted = tableBody.querySelectorAll('tr.current-day');
      previousHighlighted.forEach(row => {
        DOMUtils.safeRemoveClass(row, 'current-day');
      });

      // Obtém o dia atual
      const today = new Date();
      const currentDayIndex = today.getDay();

      // Encontra e destaca a linha correspondente ao dia atual
      const rows = tableBody.querySelectorAll('tr');

      if (rows[currentDayIndex]) {
        DOMUtils.safeAddClass(rows[currentDayIndex], 'current-day');

        // Adiciona atributo ARIA para acessibilidade
        DOMUtils.safeSetAttribute(
          rows[currentDayIndex],
          'aria-current',
          'date'
        );

        // Remove atributo ARIA das outras linhas
        rows.forEach((row, index) => {
          if (index !== currentDayIndex) {
            row.removeAttribute('aria-current');
          }
        });

        // Rola suavemente para a linha atual se ela estiver fora da visualização
        this.scrollToCurrentDay(rows[currentDayIndex]);
      }

    } catch (error) {
      console.error('Erro ao destacar dia atual na máquina de lavar:', error);
    }
  }

  /**
   * Rola suavemente para o dia atual se necessário
   * @param {HTMLElement} currentRow - Linha do dia atual
   * @private
   */
  scrollToCurrentDay(currentRow) {
    if (!currentRow) return;

    try {
      // Verifica se a linha está visível na viewport
      const rect = currentRow.getBoundingClientRect();
      const isVisible = rect.top >= 0 &&
        rect.bottom <= window.innerHeight;

      if (!isVisible) {
        currentRow.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    } catch (error) {
      console.warn('Erro ao rolar para o dia atual:', error);
    }
  }

  /**
   * Configura atualização automática da escala
   * @private
   */
  setupAutoUpdate() {
    // Atualiza o destaque a cada minuto para capturar mudanças de dia
    setInterval(() => {
      this.highlightCurrentWashingDay();
    }, 60000); // 1 minuto

    // Atualiza quando a página volta ao foco (usuário retorna à aba)
    DOMUtils.safeAddEventListener(document, 'visibilitychange', () => {
      if (!document.hidden) {
        this.highlightCurrentWashingDay();
      }
    });

    // Atualiza quando a janela recebe foco
    DOMUtils.safeAddEventListener(window, 'focus', () => {
      this.highlightCurrentWashingDay();
    });
  }

  /**
   * Obtém informações sobre quem usa a máquina hoje
   * @returns {Object|null} Informações do dia atual ou null se não encontrado
   */
  getTodayWashingInfo() {
    const today = new Date();
    const currentDayIndex = today.getDay();

    return washingSchedule.find(day => day.dayIndex === currentDayIndex) || null;
  }

  /**
   * Obtém informações sobre quem usa a máquina em um dia específico
   * @param {number} dayIndex - Índice do dia (0 = domingo)
   * @returns {Object|null} Informações do dia ou null se não encontrado
   */
  getWashingInfoForDay(dayIndex) {
    if (dayIndex < 0 || dayIndex > 6) {
      console.warn('Índice de dia inválido. Use 0-6 (domingo-sábado)');
      return null;
    }

    return washingSchedule.find(day => day.dayIndex === dayIndex) || null;
  }

  /**
   * Obtém a escala completa da semana
   * @returns {Array} Array com todos os dias da semana
   */
  getFullWeekSchedule() {
    return [...washingSchedule];
  }

  /**
   * Verifica se um usuário específico usa a máquina hoje
   * @param {string} userName - Nome do usuário
   * @returns {boolean} True se o usuário usa a máquina hoje
   */
  isUserScheduledToday(userName) {
    const todayInfo = this.getTodayWashingInfo();

    if (!todayInfo) return false;

    return todayInfo.users.toLowerCase().includes(userName.toLowerCase());
  }

  /**
   * Encontra em quais dias um usuário específico usa a máquina
   * @param {string} userName - Nome do usuário
   * @returns {Array} Array com os dias em que o usuário usa a máquina
   */
  findUserDays(userName) {
    return washingSchedule.filter(day =>
      day.users.toLowerCase().includes(userName.toLowerCase())
    );
  }

  /**
   * Renderiza a tabela da máquina de lavar (caso precise ser recriada)
   */
  renderWashingTable() {
    const tableBody = this.domCache.get('washingTableBody');

    if (!tableBody) {
      console.error('Container da tabela da máquina de lavar não encontrado');
      return;
    }

    try {
      // Limpa a tabela
      DOMUtils.clearElement(tableBody);

      // Cria as linhas da tabela
      washingSchedule.forEach((dayInfo, index) => {
        const row = this.createWashingTableRow(dayInfo, index);
        tableBody.appendChild(row);
      });

      // Destaca o dia atual
      this.highlightCurrentWashingDay();

    } catch (error) {
      console.error('Erro ao renderizar tabela da máquina de lavar:', error);
    }
  }

  /**
   * Cria uma linha da tabela da máquina de lavar
   * @param {Object} dayInfo - Informações do dia
   * @param {number} index - Índice da linha
   * @returns {HTMLElement} Elemento da linha
   * @private
   */
  createWashingTableRow(dayInfo, index) {
    const row = DOMUtils.createElement('tr', {
      attributes: {
        'data-day-index': dayInfo.dayIndex.toString()
      }
    });

    const dayCell = DOMUtils.createElement('td', {
      textContent: dayInfo.day
    });

    const usersCell = DOMUtils.createElement('td', {
      textContent: dayInfo.users
    });

    row.appendChild(dayCell);
    row.appendChild(usersCell);

    return row;
  }

  /**
   * Força atualização do destaque do dia atual
   */
  forceUpdate() {
    this.highlightCurrentWashingDay();
  }

  /**
   * Limpa recursos e para timers
   */
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}
