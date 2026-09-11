// Local SVGs keep icons crisp and available without a network font request.
const paths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-8h6v8"/>',
  sparkles: '<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4ZM20 2v4m-2-2h4"/>',
  washer:
    '<rect x="4" y="2" width="16" height="20" rx="3"/><path d="M4 7h16M7 4.5h.01M10 4.5h.01"/><circle cx="12" cy="14" r="4"/><path d="M8 14c3-2 5 2 8 0"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 11h18m-13 4h2m4 0h2"/>',
  chevronLeft: '<path d="m14 6-6 6 6 6"/>',
  chevronRight: '<path d="m10 6 6 6-6 6"/>',
  rotate:
    '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 6.1A8 8 0 0 1 20 12M4 12a8 8 0 0 0 13.9 5.9"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
  restaurant: '<path d="M5 3v6a2 2 0 0 0 4 0V3M7 3v18M19 21V3c-4 2-5 8-2 10h2"/>',
  shower: '<path d="M5 21V7a4 4 0 0 1 8 0v1m-4 4a4 4 0 0 1 8 0Zm2 4v1m4-1v1m-2 3v1m4-1v1"/>',
  bathtub:
    '<path d="M4 12V5a2 2 0 0 1 4 0v1M2 12h20M3 12v4a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-4M6 20v2m12-2v2"/>',
  weekend:
    '<path d="M5 11V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4M5 16v-3a2 2 0 0 0-4 0v6h22v-6a2 2 0 0 0-4 0v3ZM4 19v2m16-2v2"/>',
  wash: '<path d="M4 12h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6ZM12 12V5a2 2 0 0 1 4 0M9 20v2m6-2v2"/>',
};

/** @param {string} name @param {string} [className] */
export const icon = (name, className = '') => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for (const [key, value] of Object.entries({
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.6',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    focusable: 'false',
    class: `icon ${className}`.trim(),
  }))
    svg.setAttribute(key, value);
  svg.innerHTML = paths[/** @type {keyof typeof paths} */ (name)] || paths.sparkles;
  return svg;
};

export const hydrateIcons = () => {
  for (const element of document.querySelectorAll('[data-icon]')) {
    element.replaceChildren(icon(element.getAttribute('data-icon') || 'sparkles'));
  }
};
