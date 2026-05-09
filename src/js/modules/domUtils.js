/**
 * Helpers mínimos para criação e localização de elementos no DOM.
 */

/**
 * Resolve, uma única vez, todas as referências de DOM que a aplicação precisa.
 * Sempre que um elemento for opcional, o consumidor deve checar antes de usar.
 *
 * @returns {import('../types').AppElements}
 */
export const queryAppElements = () => ({
  schedule:    document.getElementById('cleaningSchedule'),
  washing:     document.getElementById('washingTableBody'),
  themeToggle: document.getElementById('themeToggle'),
  themeIcon:   document.getElementById('themeIcon'),
  footerYear:  document.getElementById('currentYear'),
});

/**
 * Cria um elemento HTML configurado em uma única chamada.
 *
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag
 * @param {{
 *   id?: string,
 *   className?: string,
 *   text?: string | null,
 *   html?: string | null,
 *   attrs?: Record<string, string>,
 *   children?: (Node | null | undefined | false)[],
 * }} [options]
 * @returns {HTMLElementTagNameMap[K]}
 */
export const el = (tag, options = {}) => {
  const node = document.createElement(tag);
  const { id, className, text, html, attrs, children } = options;

  if (id) node.id = id;
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  else if (html != null) node.innerHTML = html;

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      node.setAttribute(key, value);
    }
  }
  if (children) {
    node.append(.../** @type {Node[]} */ (children.filter(Boolean)));
  }
  return node;
};
