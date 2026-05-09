const STORAGE_KEY = 'escalas-tabajara-theme';
const DARK_CLASS = 'dark-mode';

const ICON = { light: 'light_mode', dark: 'dark_mode' };
const LABEL = {
  light: 'Alternar para modo escuro',
  dark: 'Alternar para modo claro',
};

const readStoredTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

/** @param {string} value */
const writeStoredTheme = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
  }
};

export class ThemeManager {
  /** @param {import('../types').AppElements} elements */
  constructor({ themeToggle, themeIcon }) {
    this.toggle = themeToggle;
    this.icon = themeIcon;
    this.media = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDark = this.#initialPreference();

    this.#apply();
    this.toggle?.addEventListener('click', () => this.#flip());
    this.media.addEventListener('change', (event) => {
      if (readStoredTheme() === null) {
        this.isDark = event.matches;
        this.#apply();
      }
    });
  }

  #initialPreference() {
    const saved = readStoredTheme();
    if (saved === 'dark' || saved === 'light') return saved === 'dark';
    return this.media.matches;
  }

  #flip() {
    this.isDark = !this.isDark;
    this.#apply();
    writeStoredTheme(this.isDark ? 'dark' : 'light');
  }

  #apply() {
    const mode = this.isDark ? 'dark' : 'light';
    document.body.classList.toggle(DARK_CLASS, this.isDark);
    if (this.icon) this.icon.textContent = ICON[mode];
    this.toggle?.setAttribute('aria-label', LABEL[mode]);
    this.toggle?.setAttribute('aria-pressed', String(this.isDark));
  }
}
