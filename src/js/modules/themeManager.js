/**
 * @fileoverview Gerenciamento de temas claro/escuro com persistência
 */

import { themeConfig, appConfig } from './data.js';
import { DOMUtils } from './domUtils.js';

/**
 * Gerenciador de temas da aplicação
 */
export class ThemeManager {
  constructor(domCache) {
    this.domCache = domCache;
    this.isDarkMode = false;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.init();
  }

  /**
   * Inicializa o gerenciador de temas
   */
  init() {
    this.loadSavedTheme();
    this.setupEventListeners();
    this.setupMediaQueryListener();
    this.applyTheme(this.isDarkMode);
  }

  /**
   * Carrega o tema salvo do localStorage ou usa a preferência do sistema
   * @private
   */
  loadSavedTheme() {
    try {
      const savedTheme = localStorage.getItem(appConfig.themeStorageKey);

      if (savedTheme !== null) {
        this.isDarkMode = savedTheme === 'dark';
      } else {
        // Usa a preferência do sistema se não há tema salvo
        this.isDarkMode = this.mediaQuery.matches;
      }
    } catch (error) {
      console.warn('Erro ao carregar tema do localStorage:', error);
      this.isDarkMode = this.mediaQuery.matches;
    }
  }

  /**
   * Configura os event listeners
   * @private
   */
  setupEventListeners() {
    const themeToggle = this.domCache.get('themeToggle');

    DOMUtils.safeAddEventListener(themeToggle, 'click', () => {
      this.toggleTheme();
    });

    // Adiciona suporte para tecla Enter no botão de tema
    DOMUtils.safeAddEventListener(themeToggle, 'keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggleTheme();
      }
    });
  }

  /**
   * Configura listener para mudanças na preferência do sistema
   * @private
   */
  setupMediaQueryListener() {
    this.mediaQuery.addEventListener('change', (e) => {
      // Só aplica a preferência do sistema se não há tema salvo manualmente
      const savedTheme = localStorage.getItem(appConfig.themeStorageKey);
      if (savedTheme === null) {
        this.isDarkMode = e.matches;
        this.applyTheme(this.isDarkMode);
      }
    });
  }

  /**
   * Alterna entre tema claro e escuro
   */
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme(this.isDarkMode);
    this.saveTheme();
  }

  /**
   * Aplica o tema especificado
   * @param {boolean} isDark - Se deve aplicar o tema escuro
   */
  applyTheme(isDark) {
    const body = document.body;
    const themeIcon = this.domCache.get('themeIcon');
    const themeToggle = this.domCache.get('themeToggle');

    if (isDark) {
      DOMUtils.safeAddClass(body, appConfig.darkModeClass);
      DOMUtils.safeSetText(themeIcon, themeConfig.darkIcon);
      DOMUtils.safeSetAttribute(themeToggle, 'aria-label', themeConfig.darkLabel);
    } else {
      DOMUtils.safeRemoveClass(body, appConfig.darkModeClass);
      DOMUtils.safeSetText(themeIcon, themeConfig.lightIcon);
      DOMUtils.safeSetAttribute(themeToggle, 'aria-label', themeConfig.lightLabel);
    }

    // Dispara evento customizado para outros módulos que possam precisar reagir
    this.dispatchThemeChangeEvent(isDark);
  }

  /**
   * Salva a preferência de tema no localStorage
   * @private
   */
  saveTheme() {
    try {
      localStorage.setItem(
        appConfig.themeStorageKey,
        this.isDarkMode ? 'dark' : 'light'
      );
    } catch (error) {
      console.warn('Erro ao salvar tema no localStorage:', error);
    }
  }

  /**
   * Dispara evento customizado de mudança de tema
   * @param {boolean} isDark - Se o tema atual é escuro
   * @private
   */
  dispatchThemeChangeEvent(isDark) {
    const event = new CustomEvent('themeChanged', {
      detail: { isDarkMode: isDark }
    });
    document.dispatchEvent(event);
  }

  /**
   * Obtém o tema atual
   * @returns {string} 'dark' ou 'light'
   */
  getCurrentTheme() {
    return this.isDarkMode ? 'dark' : 'light';
  }

  /**
   * Define o tema programaticamente
   * @param {string} theme - 'dark' ou 'light'
   */
  setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') {
      console.warn('Tema inválido. Use "dark" ou "light".');
      return;
    }

    this.isDarkMode = theme === 'dark';
    this.applyTheme(this.isDarkMode);
    this.saveTheme();
  }

  /**
   * Reseta o tema para o padrão do sistema
   */
  resetTheme() {
    try {
      localStorage.removeItem(appConfig.themeStorageKey);
      this.isDarkMode = this.mediaQuery.matches;
      this.applyTheme(this.isDarkMode);
    } catch (error) {
      console.warn('Erro ao resetar tema:', error);
    }
  }
  /**
   * Limpa recursos e para listeners
   */
  destroy() {
    // Método para limpeza de recursos se necessário
    console.log('ThemeManager destruído');
  }
}
