# Escalas-Tabajara 🧹

> Sistema de escalas de limpeza e lavanderia da República Tabajara

## 📋 Sobre o Projeto

Este projeto foi desenvolvido para solucionar um problema comum em repúblicas estudantis: a organização das tarefas domésticas. Como morador da República Tabajara, percebi que as escalas de limpeza e uso da máquina de lavar anotadas em planilhas geralmente não eram de fácil acesso ou não seguiam uma certa lógica.

Decidi transformar esse problema em uma oportunidade de aprendizado, criando uma aplicação web que:

- Exibe de forma clara quem é responsável por cada ambiente em cada dia
- Destaca automaticamente o dia atual
- Mostra a escala semanal da máquina de lavar
- Funciona bem em qualquer dispositivo
- Oferece tema claro e escuro

## ✨ Funcionalidades

- **Escala de Limpeza**: Exibição das tarefas de limpeza para segunda, quarta e sexta-feira
- **Rotação Automática**: Sistema inteligente que calcula a rotação das responsabilidades a cada semana
- **Escala da Máquina de Lavar**: Tabela com os dias e horários reservados para cada morador
- **Design Responsivo**: Funciona perfeitamente em desktops, tablets e celulares
- **Modo Escuro**: Alternância entre tema claro e escuro conforme preferência do usuário
- **Destaque do Dia Atual**: Identificação visual do dia atual em ambas as escalas

## 🖥️ Tecnologias Utilizadas

- JavaScript ES Modules
- HTML5 e CSS3 com variáveis e design responsivo
- Vite como bundler e servidor de desenvolvimento
- Vitest para testes automatizados
- Sistema modular de componentes
- Date-fns para manipulação de datas
- Persistência de preferências no localStorage

## 🏛️ Arquitetura

O projeto segue uma estrutura modular, separando responsabilidades:

- data.js: Contém os dados das escalas e configurações
- dateUtils.js: Funções para manipulação de datas e cálculos de ciclos
- domUtils.js: Utilitários para manipulação do DOM de forma segura
- themeManager.js: Gerencia as preferências de tema
- scheduleRenderer.js: Renderiza a escala de limpeza
- washingScheduleManager.js: Gerencia a escala da máquina de lavar
- app.js: Orquestra os diferentes componentes

## 🚀 Como Usar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute o servidor de desenvolvimento: `npm run dev`
4. Para compilar para produção: `npm run build`

## 🎯 Motivação Pessoal

Este projeto nasceu de duas necessidades:

1. **Prática**: Melhorar a organização na república onde moro, evitando conflitos sobre responsabilidades domésticas e uso da máquina de lavar.

2. **Aprendizado**: Aprofundar meus conhecimentos em desenvolvimento web frontend, aplicando conceitos como:
   - Arquitetura modular de JavaScript
   - Manipulação eficiente do DOM
   - Design responsivo
   - Persistência de dados no navegador
   - Práticas modernas de CSS (variáveis, temas)
   - Testes automatizados
   - Acessibilidade web

## 📊 Aprendizados

Durante o desenvolvimento deste projeto, adquiri experiência em:

- Organização de código JavaScript modular
- Manipulação de dados temporais (datas e ciclos)
- Implementação de temas escuro/claro com CSS e JavaScript
- Práticas de acessibilidade web
- Testes unitários com Vitest
- Otimização de performance em aplicações web

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

---

Desenvolvido com 🧹 por Espalha Lixo
