# Escalas Tabajara

Página estática que organiza as escalas semanais de limpeza e da máquina de lavar de uma república estudantil. A rotação é calculada a partir de uma data de referência, e o dia atual fica destacado em ambas as escalas.

## Funcionalidades

- Rotação circular automática a partir das listas de moradores — sem necessidade de editar a tabela manualmente.
- Destaque do dia corrente nas duas escalas, atualizado quando a aba volta a receber foco.
- Tema claro/escuro com persistência da preferência e fallback para `prefers-color-scheme`.
- Layout responsivo, acessível (ARIA, navegação por teclado) e otimizado para impressão.

## Stack

- JavaScript ES2022 modular, sem framework.
- HTML5 e CSS3 com design tokens (variáveis CSS).
- [Vite](https://vitejs.dev/) para build e servidor de desenvolvimento.
- [Vitest](https://vitest.dev/) com jsdom para testes.
- TypeScript em modo somente checagem (`tsc --noEmit`) sobre código JS anotado por JSDoc.

## Estrutura

```
src/
├── js/
│   ├── app.js                          # bootstrap da aplicação
│   ├── types.d.ts                      # tipos consumidos via JSDoc
│   └── modules/
│       ├── data.js                     # moradores, cômodos e tabela da máquina
│       ├── dateUtils.js                # cálculos de semana e ciclos
│       ├── domUtils.js                 # helpers de criação e localização de DOM
│       ├── themeManager.js             # tema claro/escuro
│       ├── scheduleRenderer.js         # render da escala de limpeza
│       └── washingScheduleManager.js   # render da escala da máquina
└── test/                               # testes Vitest
```

## Desenvolvimento

```bash
npm install
npm run dev          # servidor em http://localhost:3000
npm run build        # build de produção em dist/
npm run preview      # serve o build de produção
npm run test         # testes unitários
npm run lint
npm run type-check
```

## Atualizando a escala

Para alterar moradores, cômodos ou os dias da máquina de lavar, edite [`src/js/modules/data.js`](src/js/modules/data.js). A rotação semanal é regenerada automaticamente a partir das listas de moradores; a data de início do ciclo é controlada por `REFERENCE_DATE` no mesmo arquivo.

## Licença

MIT — ver [LICENSE](LICENSE).
