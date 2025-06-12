/**
 * @fileoverview Aplicação principal do sistema de escalas da República Tabajara
 */

import { scheduleData, appConfig } from './modules/data.js';
import { calculateWeekCycles } from './modules/dateUtils.js';
import { DOMCache } from './modules/domUtils.js';
import { ThemeManager } from './modules/themeManager.js';
import { ScheduleRenderer } from './modules/scheduleRenderer.js';
import { WashingScheduleManager } from './modules/washingScheduleManager.js';

/**
 * Classe principal da aplicação
 */
class EscalasTabajaraApp {
  constructor() {
    this.domCache = null;
    this.themeManager = null;
    this.scheduleRenderer = null;
    this.washingManager = null;
    this.isInitialized = false;
    this.initTime = Date.now();
    this.errorCount = 0;
    this.lastUpdate = null;
    this.lastError = '';
  }

  /**
   * Inicializa a aplicação
   */
  async init() {
    try {
      console.log('🧹 Inicializando Sistema de Escalas da República Tabajara...');
      
      // Inicializa o cache DOM
      this.domCache = new DOMCache();
      
      // Valida elementos essenciais
      if (!this.domCache.validateEssentialElements()) {
        throw new Error('Elementos essenciais do DOM não encontrados');
      }

      // Inicializa os módulos
      this.themeManager = new ThemeManager(this.domCache);
      this.scheduleRenderer = new ScheduleRenderer(this.domCache);
      this.washingManager = new WashingScheduleManager(this.domCache);

      // Configura eventos globais
      this.setupGlobalEventListeners();

      // Renderiza a escala inicial
      await this.renderCleaningSchedule();

      // Inicializa a escala da máquina de lavar
      this.washingManager.init();

      // Atualiza o ano no rodapé
      this.updateFooterYear();

      this.isInitialized = true;
      console.log('✅ Sistema inicializado com sucesso!');    } catch (error) {
      console.error('❌ Erro ao inicializar aplicação:', error);
      this.handleInitializationError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Renderiza a escala de limpeza
   */
  async renderCleaningSchedule() {
    try {
      const today = new Date();
      const cycleData = calculateWeekCycles(today, appConfig.referenceDate, scheduleData);
      
      if (this.scheduleRenderer) {
        this.scheduleRenderer.renderSchedule(cycleData, scheduleData);
      }
        } catch (error) {
      console.error('Erro ao renderizar escala de limpeza:', error);
      this.handleScheduleError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Configura listeners de eventos globais
   */
  setupGlobalEventListeners() {
    // Listener para mudanças de visibilidade da página
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isInitialized) {
        this.handleVisibilityChange();
      }
    });

    // Listener para erros não capturados
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error);
    });

    // Listener para promises rejeitadas
    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(event.reason);
    });
  }

  /**
   * Atualiza o ano no rodapé
   */
  updateFooterYear() {
    const footerYear = this.domCache?.get('footerYear');
    if (footerYear) {
      footerYear.textContent = new Date().getFullYear().toString();
    }
  }

  /**
   * Manipula mudanças de visibilidade da página
   */
  handleVisibilityChange() {
    // Quando a página volta a ficar visível, atualiza os dados
    setTimeout(() => {
      this.renderCleaningSchedule();
      if (this.washingManager) {
        this.washingManager.highlightCurrentWashingDay();
      }
    }, 100);
  }

  /**
   * Manipula erros de inicialização
   * @param {Error} error - Erro ocorrido
   */
  handleInitializationError(error) {
    const container = document.getElementById('cleaningSchedule');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <h3>❌ Erro de Inicialização</h3>
          <p>Não foi possível inicializar o sistema de escalas.</p>
          <p>Erro: ${error.message}</p>
          <button onclick="location.reload()" class="reload-button">
            🔄 Recarregar página
          </button>
        </div>
      `;
    }
  }

  /**
   * Manipula erros na renderização da escala
   * @param {Error} error - Erro ocorrido
   */
  handleScheduleError(error) {
    console.error('Erro na escala:', error);
    
    const container = this.domCache?.get('scheduleContainer');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <h3>❌ Erro na Escala</h3>
          <p>Não foi possível carregar a escala de limpeza.</p>
          <button onclick="location.reload()" class="reload-button">
            🔄 Tentar novamente
          </button>
        </div>
      `;
    }
  }

  /**
   * Manipula erros globais não capturados
   * @param {unknown} error - Erro ocorrido
   */
  handleGlobalError(error) {
    console.error('Erro global capturado:', error);
    this.errorCount++;
    
    // Evita spam de logs para o mesmo erro
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (this.lastError && this.lastError === errorMessage) {
      return;
    }
    
    this.lastError = errorMessage;
  }

  /**
   * Obtém estatísticas da aplicação
   * @returns {Object} Estatísticas de uso
   */
  getAppStats() {
    return {
      isInitialized: this.isInitialized,
      uptime: this.isInitialized ? Date.now() - this.initTime : 0,
      theme: this.themeManager?.getCurrentTheme() || 'unknown',
      errors: this.errorCount || 0,
      lastUpdate: this.lastUpdate || null
    };
  }

  /**
   * Força atualização de todos os componentes
   */
  forceUpdate() {
    if (!this.isInitialized) {
      console.warn('Aplicação não está inicializada');
      return;
    }

    console.log('🔄 Forçando atualização...');
    
    this.renderCleaningSchedule();
    if (this.washingManager) {
      this.washingManager.highlightCurrentWashingDay();
    }
    this.updateFooterYear();
    
    this.lastUpdate = new Date();
    console.log('✅ Atualização concluída');
  }

  /**
   * Limpa recursos e para timers
   */
  destroy() {
    this.isInitialized = false;
    console.log('🧹 Aplicação destruída');
  }
}

// Instância global da aplicação
let app = null;

/**
 * Inicializa a aplicação quando o DOM estiver pronto
 */
const initializeApp = async () => {
  try {
    app = new EscalasTabajaraApp();
    await app.init();
    
    // Expõe a instância globalmente para debugging
    if (typeof window !== 'undefined') {
      window.EscalasApp = app;
    }
    
  } catch (error) {
    console.error('Falha crítica na inicialização:', error);
  }
};

/**
 * Inicialização baseada no estado do documento
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM já está carregado
  initializeApp();
}

// Exporta a função de inicialização para uso em testes
export { initializeApp, EscalasTabajaraApp };
