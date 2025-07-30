/**
 * @fileoverview Gerenciamento de DOM e cache de elementos
 */

/**
 * Cache de seletores DOM para otimizar performance
 * Evita consultas repetitivas ao DOM
 */
export class DOMCache {
  constructor() {
    this.cache = new Map();
    this.initializeCache();
  }

  /**
   * Inicializa o cache com os elementos principais
   * @private
   */
  initializeCache() {
    const selectors = {
      scheduleContainer: '#cleaningSchedule',
      washingTableBody: '.washing-schedule table tbody',
      themeToggle: '#themeToggle',
      themeIcon: '#themeIcon',
      footerYear: '#currentYear'
    };

    for (const [key, selector] of Object.entries(selectors)) {
      this.cache.set(key, document.querySelector(selector));
    }
  }

  /**
   * Obtém um elemento do cache
   * @param {string} key - Chave do elemento
   * @returns {HTMLElement|null} Elemento do DOM ou null se não encontrado
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Adiciona um elemento ao cache
   * @param {string} key - Chave para identificar o elemento
   * @param {HTMLElement} element - Elemento do DOM
   */
  set(key, element) {
    this.cache.set(key, element);
  }

  /**
   * Verifica se todos os elementos essenciais estão disponíveis
   * @returns {boolean} True se todos os elementos essenciais existem
   */
  validateEssentialElements() {
    const essential = ['scheduleContainer', 'themeToggle', 'themeIcon'];
    return essential.every(key => this.get(key) !== null);
  }

  /**
   * Limpa o cache e reinicializa
   */
  refresh() {
    this.cache.clear();
    this.initializeCache();
  }
}

/**
 * Utilitários para manipulação do DOM
 */
export class DOMUtils {
  /**
   * Cria um elemento com classes e atributos
   * @param {string} tag - Tag do elemento
   * @param {Object} options - Opções do elemento
   * @param {string[]} options.classes - Classes CSS
   * @param {Object} options.attributes - Atributos do elemento
   * @param {string} options.textContent - Conteúdo de texto
   * @param {string} options.innerHTML - Conteúdo HTML
   * @returns {HTMLElement} Elemento criado
   */
  static createElement(tag, options = {}) {
    const element = document.createElement(tag);

    if (options.classes) {
      element.classList.add(...options.classes);
    }

    if (options.attributes) {
      for (const [key, value] of Object.entries(options.attributes)) {
        element.setAttribute(key, value);
      }
    }

    if (options.textContent) {
      element.textContent = options.textContent;
    }

    if (options.innerHTML) {
      element.innerHTML = options.innerHTML;
    }

    return element;
  }

  /**
   * Remove todos os filhos de um elemento
   * @param {HTMLElement} element - Elemento pai
   */
  static clearElement(element) {
    if (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }

  /**
   * Adiciona classe com verificação de existência do elemento
   * @param {HTMLElement|null} element - Elemento do DOM
   * @param {string} className - Nome da classe
   */
  static safeAddClass(element, className) {
    if (element && typeof element.classList !== 'undefined') {
      element.classList.add(className);
    }
  }

  /**
   * Remove classe com verificação de existência do elemento
   * @param {HTMLElement|null} element - Elemento do DOM
   * @param {string} className - Nome da classe
   */
  static safeRemoveClass(element, className) {
    if (element && typeof element.classList !== 'undefined') {
      element.classList.remove(className);
    }
  }

  /**
   * Verifica se um elemento tem uma classe específica
   * @param {HTMLElement|null} element - Elemento do DOM
   * @param {string} className - Nome da classe
   * @returns {boolean} True se o elemento tem a classe
   */
  static hasClass(element, className) {
    return element && element.classList && element.classList.contains(className);
  }

  /**
   * Define atributo com verificação de existência do elemento
   * @param {HTMLElement|null} element - Elemento do DOM
   * @param {string} attribute - Nome do atributo
   * @param {string} value - Valor do atributo
   */
  static safeSetAttribute(element, attribute, value) {
    if (element && typeof element.setAttribute === 'function') {
      element.setAttribute(attribute, value);
    }
  }

  /**
   * Define texto com verificação de existência do elemento
   * @param {HTMLElement|null} element - Elemento do DOM
   * @param {string} text - Texto a ser definido
   */
  static safeSetText(element, text) {
    if (element) {
      element.textContent = text;
    }
  }

  /**
   * Adiciona event listener com verificação de existência do elemento
   * @param {HTMLElement|null} element - Elemento do DOM
   * @param {string} event - Nome do evento
   * @param {Function} handler - Função manipuladora do evento
   * @param {Object} options - Opções do event listener
   */
  static safeAddEventListener(element, event, handler, options = {}) {
    if (element && typeof element.addEventListener === 'function') {
      element.addEventListener(event, handler, options);
    }
  }
}
