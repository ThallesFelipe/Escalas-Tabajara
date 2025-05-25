/**
 * @typedef {Object.<string, string>} DailyScheduleItem
 * @property {string} cozinha
 * @property {string} banhBaixo
 * @property {string} banhSuite
 * @property {string} sala
 * @property {string} lavabo
 */

/**
 * @typedef {Object.<string, DailyScheduleItem[]>} WeeklyScheduleData
 * @property {DailyScheduleItem[]} monday
 * @property {DailyScheduleItem[]} wednesday
 * @property {DailyScheduleItem[]} friday
 */

/** Dados da escala de limpeza. */
const scheduleData = {
    monday: [
        { cozinha: "Bixo Alexa", banhBaixo: "Bixo Gaga", banhSuite: "I. Ivan", sala: "A. Viihtube", lavabo: "A. Viihtube" },
        { cozinha: "I. Ivan", banhBaixo: "Bixo Alexa", banhSuite: "Bixo Gaga", sala: "Bixo Alexa", lavabo: "Bixo Alexa" },
        { cozinha: "Bixo Gaga", banhBaixo: "A. Viihtube", banhSuite: "I. Ivan", sala: "I. Ivan", lavabo: "I. Ivan" },
        { cozinha: "A. Viihtube", banhBaixo: "I. Ivan", banhSuite: "Bixo Alexa", sala: "Bixo Gaga", lavabo: "Bixo Gaga" }
    ],
    wednesday: [
        { cozinha: "LATAM", banhBaixo: "TPM", banhSuite: "Bixo TotalFlex", sala: "Bixo Smigou", lavabo: "Bixo Rita" },
        { cozinha: "Bixo Rita", banhBaixo: "LATAM", banhSuite: "TPM", sala: "Bixo TotalFlex", lavabo: "Bixo Smigou" },
        { cozinha: "Bixo Smigou", banhBaixo: "Bixo Rita", banhSuite: "LATAM", sala: "TPM", lavabo: "Bixo TotalFlex" },
        { cozinha: "Bixo TotalFlex", banhBaixo: "Bixo Smigou", banhSuite: "Bixo Rita", sala: "LATAM", lavabo: "TPM" },
        { cozinha: "TPM", banhBaixo: "Bixo TotalFlex", banhSuite: "Bixo Smigou", sala: "Bixo Rita", lavabo: "LATAM" }
    ],
    friday: [
        { cozinha: "BBB", banhBaixo: "Leidi", banhSuite: "Madre", sala: "Espalha", lavabo: "Navala" },
        { cozinha: "Navala", banhBaixo: "BBB", banhSuite: "Leidi", sala: "Madre", lavabo: "Espalha" },
        { cozinha: "Espalha", banhBaixo: "Navala", banhSuite: "BBB", sala: "Leidi", lavabo: "Madre" },
        { cozinha: "Madre", banhBaixo: "Espalha", banhSuite: "Navala", sala: "BBB", lavabo: "Leidi" },
        { cozinha: "Leidi", banhBaixo: "Madre", banhSuite: "Espalha", sala: "Navala", lavabo: "BBB" }
    ]
};

/** Definição dos cômodos a serem limpos. */
const rooms = [
    { label: "🍽️ Cozinha", key: "cozinha" },
    { label: "🚿 Banheiro de baixo", key: "banhBaixo" },
    { label: "🛁 Banheiro suíte", key: "banhSuite" },
    { label: "🛋️ Sala e corredor", key: "sala" },
    { label: "🚽 Lavabo", key: "lavabo" }
];

/** Data de referência para o início do ciclo (Segunda-feira). */
const REFERENCE_DATE = new Date(2020, 1, 24);

/** Cache de seletores DOM para evitar repetições */
const DOM = {
    scheduleContainer: document.getElementById('cleaningSchedule'),
    washingTableBody: document.querySelector('.washing-schedule table tbody'),
    themeToggle: document.getElementById('themeToggle'),
    themeIcon: document.getElementById('themeIcon'),
    footerYear: document.getElementById('currentYear')
};

/** Formata a data no formato DD/MM. */
const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "Inválida";
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

/** Calcula a diferença de semanas completas entre duas datas. */
const getWeekDifference = (date1, date2) => {
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    const startOfDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const startOfDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((startOfDate1 - startOfDate2) / msPerWeek);
};

/** Encontra a data da segunda-feira da semana de uma data específica. */
const getMondayDate = (date) => {
    const currentDay = date.getDay();
    const diffToMonday = (currentDay === 0 ? -6 : 1 - currentDay);
    const mondayDate = new Date(date);
    mondayDate.setDate(date.getDate() + diffToMonday);
    mondayDate.setHours(0, 0, 0, 0);
    return mondayDate;
};

/** Cria e retorna um elemento de coluna do cronograma de limpeza. */
const createScheduleColumn = (id, dayName, schedule, cleaningDate) => {
    const column = document.createElement('div');
    column.id = id;
    column.className = 'column';

    const columnHeader = document.createElement('header');
    const title = document.createElement('h3');
    const dateSpan = document.createElement('span');
    title.textContent = dayName;
    dateSpan.textContent = formatDate(cleaningDate);
    columnHeader.appendChild(title);
    columnHeader.appendChild(dateSpan);
    column.appendChild(columnHeader);

    rooms.forEach(room => {
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room';

        const roomNameSpan = document.createElement('span');
        roomNameSpan.className = 'room-name';
        roomNameSpan.textContent = room.label;

        const responsibleSpan = document.createElement('span');
        responsibleSpan.className = 'responsible';
        responsibleSpan.textContent = schedule?.[room.key] ?? 'N/D';

        roomDiv.appendChild(roomNameSpan);
        roomDiv.appendChild(responsibleSpan);
        column.appendChild(roomDiv);
    });

    return column;
};

/** Inicializa e renderiza o cronograma de limpeza na página. */
const initCleaningSchedule = () => {
    if (!DOM.scheduleContainer) return;

    const today = new Date();
    let referenceDate = new Date(today);
    if (today.getDay() === 0) {
        referenceDate.setDate(today.getDate() + 1); // Segunda-feira seguinte
    }
    const mondayDate = getMondayDate(referenceDate);

    const weekDiff = Math.max(0, getWeekDifference(mondayDate, REFERENCE_DATE));
    const mondayCycleIndex = weekDiff % (scheduleData.monday?.length || 1);
    const wednesdayCycleIndex = weekDiff % (scheduleData.wednesday?.length || 1);
    const fridayCycleIndex = weekDiff % (scheduleData.friday?.length || 1);

    const wednesdayDate = new Date(mondayDate);
    wednesdayDate.setDate(mondayDate.getDate() + 2);
    const fridayDate = new Date(mondayDate);
    fridayDate.setDate(mondayDate.getDate() + 4);

    DOM.scheduleContainer.innerHTML = '';

    const mondayColumn = createScheduleColumn(
        "monday", "Segunda-feira", scheduleData.monday?.[mondayCycleIndex], mondayDate
    );
    const wednesdayColumn = createScheduleColumn(
        "wednesday", "Quarta-feira", scheduleData.wednesday?.[wednesdayCycleIndex], wednesdayDate
    );
    const fridayColumn = createScheduleColumn(
        "friday", "Sexta-feira", scheduleData.friday?.[fridayCycleIndex], fridayDate
    );

    DOM.scheduleContainer.appendChild(mondayColumn);
    DOM.scheduleContainer.appendChild(wednesdayColumn);
    DOM.scheduleContainer.appendChild(fridayColumn);

    const todayWeekDay = today.getDay();
    if (todayWeekDay === 1) mondayColumn.classList.add("current-day");
    else if (todayWeekDay === 3) wednesdayColumn.classList.add("current-day");
    else if (todayWeekDay === 5) fridayColumn.classList.add("current-day");
};

/** Alternância de tema claro/escuro com acessibilidade. */
const initThemeManager = () => {
    if (!DOM.themeToggle || !DOM.themeIcon) return;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (isDark) => {
        document.body.classList.toggle('dark-mode', isDark);
        DOM.themeIcon.textContent = isDark ? '☀️' : '🌙';
        DOM.themeToggle.setAttribute('aria-label', isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro');
        try {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        } catch (e) { /* ignore */ }
    };

    const savedTheme = localStorage.getItem('theme');
    let currentThemeIsDark = savedTheme ? savedTheme === 'dark' : prefersDark.matches;
    applyTheme(currentThemeIsDark);

    DOM.themeToggle.addEventListener('click', () => {
        const isCurrentlyDark = document.body.classList.contains('dark-mode');
        applyTheme(!isCurrentlyDark);
    });

    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches);
        }
    });
};

/** Destaca o dia atual na tabela da máquina de lavar. */
const highlightCurrentWashingDay = () => {
    if (!DOM.washingTableBody) return;

    const today = new Date();
    const dayOfWeek = today.getDay();

    const rows = DOM.washingTableBody.querySelectorAll('tr');
    rows.forEach(row => row.classList.remove('current-day'));
    if (rows[dayOfWeek]) rows[dayOfWeek].classList.add('current-day');
};

/** Atualiza o ano no rodapé. */
const updateFooterYear = () => {
    if (DOM.footerYear) {
        DOM.footerYear.textContent = new Date().getFullYear();
    }
};

/** Inicializa todas as funcionalidades da aplicação. */
const initializeApp = () => {
    initCleaningSchedule();
    initThemeManager();
    highlightCurrentWashingDay();
    updateFooterYear();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

window.addEventListener('error', (event) => {
    // Log simplificado para produção
    // console.error('Erro global não capturado:', event.error, event.message, event.filename, event.lineno);
});
window.addEventListener('unhandledrejection', (event) => {
    // console.error('Rejeição de Promise não tratada:', event.reason);
});