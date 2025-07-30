/**
 * @fileoverview Renderização da escala de limpeza
 */

import { rooms } from './data.js';
import { formatDate, isToday } from './dateUtils.js';

/**
 * Renderizador da escala de limpeza
 */
export class ScheduleRenderer {
  /**
   * @param {Object} domCache - Cache de elementos DOM
   */
  constructor(domCache) {
    this.domCache = domCache;
  }

  /**
   * Renderiza toda a escala de limpeza
   * @param {Object} cycleData - Dados calculados dos ciclos
   * @param {Object} scheduleData - Dados da escala
   */
  renderSchedule(cycleData, scheduleData) {
    const container = this.domCache.get('scheduleContainer');

    if (!container) {
      console.error('Container da escala não encontrado');
      return;
    }

    // Limpa o container
    this.clearElement(container);

    try {
      // Cria as colunas para cada dia
      const mondayColumn = this.createScheduleColumn(
        'monday',
        'Segunda-feira',
        scheduleData.monday?.[cycleData.mondayCycleIndex],
        cycleData.mondayDate
      );

      const wednesdayColumn = this.createScheduleColumn(
        'wednesday',
        'Quarta-feira',
        scheduleData.wednesday?.[cycleData.wednesdayCycleIndex],
        cycleData.wednesdayDate
      );

      const fridayColumn = this.createScheduleColumn(
        'friday',
        'Sexta-feira',
        scheduleData.friday?.[cycleData.fridayCycleIndex],
        cycleData.fridayDate
      );

      // Adiciona as colunas ao container
      container.appendChild(mondayColumn);
      container.appendChild(wednesdayColumn);
      container.appendChild(fridayColumn);

      // Destaca o dia atual
      this.highlightCurrentDay(cycleData);

    } catch (error) {
      console.error('Erro ao renderizar escala:', error);
      this.renderErrorMessage(container);
    }
  }

  /**
   * Cria uma coluna da escala
   * @param {string} id - ID da coluna
   * @param {string} dayName - Nome do dia
   * @param {import('../types/index.js').DailyScheduleItem} schedule - Escala do dia
   * @param {Date} cleaningDate - Data da limpeza
   * @returns {HTMLElement} Elemento da coluna
   */
  createScheduleColumn(id, dayName, schedule, cleaningDate) {
    if (!schedule) {
      console.warn(`Escala não encontrada para ${dayName}`);
      return this.createEmptyColumn(id, dayName, cleaningDate);
    }

    const column = this.createElement('div', {
      id,
      className: 'column',
      attributes: {
        'role': 'region',
        'aria-labelledby': `${id}-header`
      }
    });

    // Cabeçalho da coluna
    const header = this.createColumnHeader(id, dayName, cleaningDate);
    column.appendChild(header);

    // Lista de cômodos
    const roomsList = this.createElement('div', {
      className: 'rooms-list',
      attributes: {
        'role': 'list',
        'aria-label': `Responsáveis pela limpeza de ${dayName}`
      }
    });

    rooms.forEach(room => {
      const roomElement = this.createRoomElement(room, schedule);
      roomsList.appendChild(roomElement);
    });

    column.appendChild(roomsList);
    return column;
  }

  /**
   * Cria o cabeçalho de uma coluna
   * @param {string} id - ID da coluna
   * @param {string} dayName - Nome do dia
   * @param {Date} date - Data
   * @returns {HTMLElement} Elemento do cabeçalho
   */
  createColumnHeader(id, dayName, date) {
    const header = this.createElement('header', {
      className: 'column-header'
    });

    const title = this.createElement('h3', {
      textContent: dayName,
      id: `${id}-header`,
      className: 'day-title'
    });

    const dateSpan = this.createElement('span', {
      textContent: formatDate(date),
      className: 'date-display',
      attributes: {
        'aria-label': `Data: ${formatDate(date)}`
      }
    });

    header.appendChild(title);
    header.appendChild(dateSpan);
    return header;
  }

  /**
   * Cria um elemento de cômodo
   * @param {import('../types/index.js').Room} room - Dados do cômodo
   * @param {import('../types/index.js').DailyScheduleItem} schedule - Escala do dia
   * @returns {HTMLElement} Elemento do cômodo
   */
  createRoomElement(room, schedule) {
    const responsible = schedule[room.key] || 'Não definido';

    const roomElement = this.createElement('div', {
      className: 'room',
      attributes: {
        'role': 'listitem',
        'aria-label': `${room.label}: ${responsible}`
      }
    });

    const roomName = this.createElement('span', {
      className: 'room-name',
      textContent: room.label,
      attributes: {
        'aria-hidden': 'true'
      }
    });

    const responsibleSpan = this.createElement('span', {
      className: 'responsible',
      textContent: responsible,
      attributes: {
        'title': `Responsável: ${responsible}`
      }
    });

    roomElement.appendChild(roomName);
    roomElement.appendChild(responsibleSpan);
    return roomElement;
  }

  /**
   * Cria uma coluna vazia para casos de erro
   * @param {string} id - ID da coluna
   * @param {string} dayName - Nome do dia
   * @param {Date} date - Data
   * @returns {HTMLElement} Elemento da coluna vazia
   */
  createEmptyColumn(id, dayName, date) {
    const column = this.createElement('div', {
      id,
      className: 'column column-empty'
    });

    const header = this.createColumnHeader(id, dayName, date);
    column.appendChild(header);

    const message = this.createElement('p', {
      textContent: 'Escala não disponível para este dia',
      className: 'empty-message'
    });

    column.appendChild(message);
    return column;
  }

  /**
   * Destaca o dia atual
   * @param {import('../types/index.js').CycleCalculation} cycleData - Dados dos ciclos
   */
  highlightCurrentDay(cycleData) {
    const today = new Date();
    const todayWeekDay = today.getDay();

    // Remove destaques anteriores
    document.querySelectorAll('.column.current-day').forEach(col => {
      col.classList.remove('current-day');
    });

    // Destaca o dia atual
    if (todayWeekDay === 1 && isToday(cycleData.mondayDate)) {
      document.getElementById('monday')?.classList.add('current-day');
    } else if (todayWeekDay === 3 && isToday(cycleData.wednesdayDate)) {
      document.getElementById('wednesday')?.classList.add('current-day');
    } else if (todayWeekDay === 5 && isToday(cycleData.fridayDate)) {
      document.getElementById('friday')?.classList.add('current-day');
    }
  }

  /**
   * Renderiza uma mensagem de erro
   * @param {HTMLElement} container - Container para a mensagem
   */
  renderErrorMessage(container) {
    this.clearElement(container);

    const errorElement = this.createElement('div', {
      className: 'error-message',
      innerHTML: `
        <h3>❌ Erro ao carregar escala</h3>
        <p>Não foi possível carregar a escala de limpeza. Tente recarregar a página.</p>
        <button onclick="location.reload()" class="reload-button">
          🔄 Recarregar página
        </button>
      `
    });

    container.appendChild(errorElement);
  }

  /**
   * Atualiza apenas o destaque do dia atual sem re-renderizar toda a escala
   */
  updateCurrentDayHighlight() {
    // Busca os dados atuais do cache/estado se disponível
    // Por enquanto, apenas remove e não re-adiciona até ter os dados corretos
    document.querySelectorAll('.column.current-day').forEach(col => {
      col.classList.remove('current-day');
    });
  }

  /**
   * Utilitário para criar elementos DOM
   * @param {string} tagName - Nome da tag
   * @param {Object} options - Opções do elemento
   * @returns {HTMLElement} Elemento criado
   */
  createElement(tagName, options = {}) {
    const element = document.createElement(tagName);

    if (options.id) element.id = options.id;
    if (options.className) element.className = options.className;
    if (options.textContent) element.textContent = options.textContent;
    if (options.innerHTML) element.innerHTML = options.innerHTML;

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    return element;
  }

  /**
   * Limpa todos os filhos de um elemento
   * @param {HTMLElement} element - Elemento a ser limpo
   */
  clearElement(element) {
    if (element && element.children) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }
}
