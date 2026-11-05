# Escalas Tabajara

Página estática que organiza as escalas semanais de limpeza e da máquina de lavar de uma república estudantil. A rotação é calculada a partir de uma data de referência, e o dia atual fica destacado em ambas as escalas.

## Funcionalidades

- Rotação circular automática a partir das listas de moradores — sem necessidade de editar a tabela manualmente.
- Navegação entre semanas com retorno à semana atual e limite na data de início da escala.
- Resumo do dia com os responsáveis pela lavanderia e indicação de dia de limpeza.
- Destaque do dia corrente nas duas escalas, atualizado ao voltar à aba e na mudança de dia. Semanas consultadas fora da atual não recebem o destaque de hoje.
- Tema claro/escuro com persistência da preferência e fallback para `prefers-color-scheme`.
- Layout responsivo, acessível (ARIA, navegação por teclado) e otimizado para impressão.
- Identidade em coral, latte e café, ícones SVG locais e transições que respeitam movimento reduzido.

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
│       ├── dashboardManager.js         # navegação semanal e resumo de hoje
│       ├── domUtils.js                 # helpers de criação e localização de DOM
│       ├── icons.js                    # ícones SVG locais
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

A semana inicial é **07/09/2026**. Os grupos são fixos: segunda/terça e quinta/sexta têm cinco pessoas e cinco tarefas, sem a limpeza da Lavanderia. As listas de tarefas ficam em `roomsByGroup`, e os dois grupos usam o mesmo gerador de rotações. A lista de segunda/terça foi alinhada para preservar a rotação da semana de **02/11/2026**, retirando Agregu e compactando os demais responsáveis; Agregu substitui Smigou na quinta/sexta.

A cada semana, cada pessoa sobe uma tarefa na ordem da lista; quem estava na Cozinha passa para a última tarefa do seu próprio grupo. Ambos os ciclos se repetem após cinco semanas. A escala de uso da máquina de lavar é independente; o sábado fica livre, e os demais dias permanecem inalterados.

## Licença

MIT — ver [LICENSE](LICENSE).
