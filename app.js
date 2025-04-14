/**
 * @typedef {Object.<string, string>} DailyScheduleItem Mapeia cômodo para responsável.
 * @property {string} cozinha
 * @property {string} banhBaixo
 * @property {string} banhSuite
 * @property {string} sala
 * @property {string} lavabo
 */

/**
 * @typedef {Object.<string, DailyScheduleItem[]>} WeeklyScheduleData Contém as escalas para os dias de limpeza.
 * @property {DailyScheduleItem[]} monday
 * @property {DailyScheduleItem[]} wednesday
 * @property {DailyScheduleItem[]} friday
 */

/**
 * Dados da escala de limpeza.
 * @type {WeeklyScheduleData}
 */
const scheduleData = {
    monday: [
        { cozinha: "Bixo Rita", banhBaixo: "Agregado ViihTube", banhSuite: "Bixo Tchairô", sala: "Pakita", lavabo: "Pakita" },
        { cozinha: "Pakita", banhBaixo: "Bixo Rita", banhSuite: "Agregado ViihTube", sala: "Bixo Tchairô", lavabo: "Bixo Tchairô" },
        { cozinha: "Bixo Tchairô", banhBaixo: "Pakita", banhSuite: "Bixo Rita", sala: "Agregado ViihTube", lavabo: "Agregado ViihTube" },
        { cozinha: "Agregado ViihTube", banhBaixo: "Bixo Tchairô", banhSuite: "Pakita", sala: "Bixo Rita", lavabo: "Bixo Rita" }
    ],
    wednesday: [
        { cozinha: "BBB", banhBaixo: "TPM", banhSuite: "Bixo TotalFlex", sala: "Bixo Smigou", lavabo: "Bixo Smigou" },
        { cozinha: "Bixo Smigou", banhBaixo: "BBB", banhSuite: "TPM", sala: "Bixo TotalFlex", lavabo: "Bixo TotalFlex" },
        { cozinha: "Bixo TotalFlex", banhBaixo: "Bixo Smigou", banhSuite: "BBB", sala: "TPM", lavabo: "TPM" },
        { cozinha: "TPM", banhBaixo: "Bixo TotalFlex", banhSuite: "Bixo Smigou", sala: "BBB", lavabo: "BBB" }
    ],
    friday: [
        { cozinha: "Leidi", banhBaixo: "Madre", banhSuite: "Espalha", sala: "Latam", lavabo: "Caldo" },
        { cozinha: "Caldo", banhBaixo: "Leidi", banhSuite: "Madre", sala: "Espalha", lavabo: "Latam" },
        { cozinha: "Latam", banhBaixo: "Caldo", banhSuite: "Leidi", sala: "Madre", lavabo: "Espalha" },
        { cozinha: "Espalha", banhBaixo: "Latam", banhSuite: "Caldo", sala: "Leidi", lavabo: "Madre" },
        { cozinha: "Madre", banhBaixo: "Espalha", banhSuite: "Latam", sala: "Caldo", lavabo: "Leidi" }
    ]
};

/**
 * Definição dos cômodos a serem limpos.
 * @type {Array<{label: string, key: keyof DailyScheduleItem}>}
 */
const rooms = [
    { label: "🍽️ Cozinha", key: "cozinha" },
    { label: "🚿 Banheiro de baixo", key: "banhBaixo" },
    { label: "🛁 Banheiro suíte", key: "banhSuite" },
    { label: "🛋️ Sala e corredor", key: "sala" },
    { label: "🚽 Lavabo", key: "lavabo" }
];

/**
 * Data de referência para o início do ciclo (Segunda-feira).
 * @type {Date}
 */
const REFERENCE_DATE = new Date(2020, 1, 24); // 24 de fevereiro de 2020 (mês é 0-indexado)

/** Cache de seletores DOM para evitar repetições */
const DOM = {
    scheduleContainer: document.getElementById('cleaningSchedule'),
    washingTableBody: document.querySelector('.washing-schedule table tbody'),
    themeToggle: document.getElementById('themeToggle'),
    themeIcon: document.getElementById('themeIcon'),
    footerYear: document.getElementById('currentYear')
};

/**
 * Formata a data no formato DD/MM.
 * @param {Date} date - Data a ser formatada.
 * @returns {string} Data formatada como DD/MM ou mensagem de erro.
 */
const formatDate = (date) => {
    try {
        // Verifica se é uma data válida
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new Error("Data inválida fornecida.");
        }
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
        });
    } catch (error) {
        console.error("Erro ao formatar data:", error);
        return "Inválida";
    }
};

/**
 * Calcula a diferença de semanas completas entre duas datas.
 * @param {Date} date1 - Data mais recente.
 * @param {Date} date2 - Data mais antiga.
 * @returns {number} Número de semanas completas de diferença.
 */
const getWeekDifference = (date1, date2) => {
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    // Garante que estamos comparando o início do dia para evitar problemas de fuso horário/DST
    const startOfDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const startOfDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    const diffMs = startOfDate1.getTime() - startOfDate2.getTime(); // Use getTime() para subtrair
    return Math.floor(diffMs / msPerWeek);
};

/**
 * Encontra a data da segunda-feira da semana de uma data específica.
 * @param {Date} date - A data de referência (geralmente hoje).
 * @returns {Date} A data da segunda-feira dessa semana.
 */
const getMondayDate = (date) => {
    const currentDay = date.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    // Calcula a diferença em dias para a última segunda-feira (ou a própria segunda)
    const diffToMonday = (currentDay === 0 ? -6 : 1 - currentDay);
    const mondayDate = new Date(date);
    mondayDate.setDate(date.getDate() + diffToMonday);
    mondayDate.setHours(0, 0, 0, 0); // Zera a hora para consistência
    return mondayDate;
};

/**
 * Cria e retorna um elemento de coluna do cronograma de limpeza.
 * Usa createElement e textContent para segurança e performance.
 * @param {string} id - ID do elemento da coluna.
 * @param {string} dayName - Nome do dia (ex: "Segunda-feira").
 * @param {DailyScheduleItem | undefined} schedule - Dados da escala para o dia.
 * @param {Date} cleaningDate - Data da limpeza.
 * @returns {HTMLElement} Elemento `div` da coluna criado.
 */
const createScheduleColumn = (id, dayName, schedule, cleaningDate) => {
    const column = document.createElement('div');
    column.id = id;
    column.className = 'column';

    // Cabeçalho da coluna
    const columnHeader = document.createElement('header');
    const title = document.createElement('h3'); // Usar H3 como no HTML
    const dateSpan = document.createElement('span');
    title.textContent = dayName;
    dateSpan.textContent = formatDate(cleaningDate);
    columnHeader.appendChild(title);
    columnHeader.appendChild(dateSpan);
    column.appendChild(columnHeader);

    // Itens de cômodo
    rooms.forEach(room => {
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room';

        const roomNameSpan = document.createElement('span');
        roomNameSpan.className = 'room-name';
        roomNameSpan.textContent = room.label;

        const responsibleSpan = document.createElement('span');
        responsibleSpan.className = 'responsible';
        // Verifica se schedule e a chave existem antes de acessar
        responsibleSpan.textContent = schedule?.[room.key] ?? 'N/D'; // Usa optional chaining e nullish coalescing

        roomDiv.appendChild(roomNameSpan);
        roomDiv.appendChild(responsibleSpan);
        column.appendChild(roomDiv);
    });

    return column;
};

/**
 * Inicializa e renderiza o cronograma de limpeza na página.
 */
const initCleaningSchedule = () => {
    try {
        if (!DOM.scheduleContainer) {
            console.error("Elemento #cleaningSchedule não encontrado.");
            return;
        }

        const today = new Date();
        const mondayDate = getMondayDate(today);

        // Calcula a diferença de semanas desde a data de referência
        const weekDiff = Math.max(0, getWeekDifference(mondayDate, REFERENCE_DATE));

        // Calcula os índices dos ciclos para segunda/quarta e sexta
        // Garante que os índices sejam válidos mesmo se scheduleData for modificado
        const mondayCycleIndex = weekDiff % (scheduleData.monday?.length || 1);
        const wednesdayCycleIndex = weekDiff % (scheduleData.wednesday?.length || 1);
        const fridayCycleIndex = weekDiff % (scheduleData.friday?.length || 1);

        // Calcula as datas de quarta e sexta
        const wednesdayDate = new Date(mondayDate);
        wednesdayDate.setDate(mondayDate.getDate() + 2);
        const fridayDate = new Date(mondayDate);
        fridayDate.setDate(mondayDate.getDate() + 4);

        // Limpa container antes de adicionar novas colunas
        DOM.scheduleContainer.innerHTML = '';

        // Cria as colunas usando os dados e índices calculados
        const mondayColumn = createScheduleColumn(
            "monday", "Segunda-feira", scheduleData.monday?.[mondayCycleIndex], mondayDate
        );
        const wednesdayColumn = createScheduleColumn(
            "wednesday", "Quarta-feira", scheduleData.wednesday?.[wednesdayCycleIndex], wednesdayDate
        );
        const fridayColumn = createScheduleColumn(
            "friday", "Sexta-feira", scheduleData.friday?.[fridayCycleIndex], fridayDate
        );

        // Adiciona colunas ao DOM
        DOM.scheduleContainer.appendChild(mondayColumn);
        DOM.scheduleContainer.appendChild(wednesdayColumn);
        DOM.scheduleContainer.appendChild(fridayColumn);

        // Destaca o dia atual da limpeza (Segunda, Quarta ou Sexta)
        const todayWeekDay = today.getDay(); // 1 = Segunda, 3 = Quarta, 5 = Sexta
        if (todayWeekDay === 1) mondayColumn.classList.add("current-day");
        else if (todayWeekDay === 3) wednesdayColumn.classList.add("current-day");
        else if (todayWeekDay === 5) fridayColumn.classList.add("current-day");

    } catch (error) {
        console.error("Erro ao inicializar a escala de limpeza:", error);
        if (DOM.scheduleContainer) {
            DOM.scheduleContainer.textContent = "Erro ao carregar a escala de limpeza.";
            DOM.scheduleContainer.style.color = 'red'; // Indica erro visualmente
        }
    }
};

/**
 * Gerencia a funcionalidade de alternância de tema claro/escuro.
 */
const initThemeManager = () => {
    try {
        if (!DOM.themeToggle || !DOM.themeIcon) {
            console.error("Elementos do tema não encontrados (#themeToggle, #themeIcon).");
            return;
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        /** Aplica o tema (claro ou escuro) e atualiza UI e localStorage */
        const applyTheme = (isDark) => {
            document.body.classList.toggle('dark-mode', isDark);
            DOM.themeIcon.textContent = isDark ? '☀️' : '🌙';
            // Atualiza aria-label para refletir a *próxima* ação
            DOM.themeToggle.setAttribute('aria-label', isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro');
            try {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            } catch (storageError) {
                console.warn("Não foi possível salvar a preferência de tema no localStorage:", storageError);
            }
        };

        // Verifica tema salvo ou preferência do sistema
        const savedTheme = localStorage.getItem('theme');
        let currentThemeIsDark = savedTheme ? savedTheme === 'dark' : prefersDark.matches;

        applyTheme(currentThemeIsDark); // Aplica tema inicial

        // Alternar tema ao clicar no botão
        DOM.themeToggle.addEventListener('click', () => {
            // Verifica o estado *atual* antes de alternar
            const isCurrentlyDark = document.body.classList.contains('dark-mode');
            applyTheme(!isCurrentlyDark);
        });

        // Ouvir mudanças nas preferências do sistema (se nenhum tema foi salvo manualmente)
        prefersDark.addEventListener('change', (e) => {
            // Só atualiza se o usuário não tiver definido manualmente um tema
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches);
            }
        });

    } catch (error) {
        console.error("Erro ao inicializar o gerenciador de tema:", error);
    }
};

/**
 * Destaca o dia atual na tabela da máquina de lavar.
 */
const highlightCurrentWashingDay = () => {
    try {
        if (!DOM.washingTableBody) {
            console.error("Corpo da tabela da máquina de lavar não encontrado.");
            return;
        }

        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

        const rows = DOM.washingTableBody.querySelectorAll('tr');
        if (rows.length !== 7) {
            console.warn("Número inesperado de linhas na tabela da máquina de lavar:", rows.length);
            // Continua mesmo assim, se possível
        }

        // Remove destaque de qualquer linha que possa ter
        rows.forEach(row => row.classList.remove('current-day'));

        // Mapeia o índice do dia da semana (0-6) diretamente para o índice da linha da tabela (0-6)
        // Nova Tabela HTML: 0=Dom, 1=Seg, ..., 6=Sáb
        const rowIndex = dayOfWeek; // O índice agora corresponde diretamente

        // Adiciona a classe de destaque à linha correspondente, se existir
        if (rows[rowIndex]) {
            rows[rowIndex].classList.add('current-day');
        } else {
            console.warn(`Linha de índice ${rowIndex} não encontrada na tabela de lavagem.`);
        }
    } catch (error) {
        console.error("Erro ao destacar dia na tabela da máquina de lavar:", error);
    }
};

/**
 * Atualiza o ano no rodapé.
 */
const updateFooterYear = () => {
    try {
        if (DOM.footerYear) {
            DOM.footerYear.textContent = new Date().getFullYear();
        } else {
            console.warn("Elemento #currentYear do rodapé não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao atualizar o ano no rodapé:", error);
    }
};

/**
 * Inicializa todas as funcionalidades da aplicação.
 */
const initializeApp = () => {
    initCleaningSchedule();
    initThemeManager();
    highlightCurrentWashingDay();
    updateFooterYear();
};

// --- Inicialização ---

// Garante que o DOM está carregado antes de executar o script principal
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp(); // DOM já carregado
}

// --- Tratamento Global de Erros (Opcional, mas recomendado) ---
window.addEventListener('error', (event) => {
    console.error('Erro global não capturado:', event.error, event.message, event.filename, event.lineno);
    // Aqui você poderia enviar o erro para um serviço de logging
});
window.addEventListener('unhandledrejection', (event) => {
    console.error('Rejeição de Promise não tratada:', event.reason);
    // Aqui você poderia enviar o erro para um serviço de logging
});