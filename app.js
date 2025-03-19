/**
 * Dados da escala de limpeza
 * @type {Object}
 */
const scheduleData = {
    monday: [
        {
            cozinha: "Bixo Rita",
            banhBaixo: "Agregado ViihTube",
            banhSuite: "Bixo Tchairô",
            sala: "Pakita",
            lavabo: "Pakita"
        },
        {
            cozinha: "Pakita",
            banhBaixo: "Bixo Rita",
            banhSuite: "Agregado ViihTube",
            sala: "Bixo Tchairô",
            lavabo: "Bixo Tchairô"
        },
        {
            cozinha: "Bixo Tchairô",
            banhBaixo: "Pakita",
            banhSuite: "Bixo Rita",
            sala: "Agregado ViihTube",
            lavabo: "Agregado ViihTube"
        },
        {
            cozinha: "Agregado ViihTube",
            banhBaixo: "Bixo Tchairô",
            banhSuite: "Pakita",
            sala: "Bixo Rita",
            lavabo: "Bixo Rita"
        }
    ],
    wednesday: [
        {
            cozinha: "BBB",
            banhBaixo: "TPM",
            banhSuite: "Bixo TotalFlex",
            sala: "Bixo Junior",
            lavabo: "Bixo Junior"
        },
        {
            cozinha: "Bixo Junior",
            banhBaixo: "BBB",
            banhSuite: "TPM",
            sala: "Bixo TotalFlex",
            lavabo: "Bixo TotalFlex"
        },
        {
            cozinha: "Bixo TotalFlex",
            banhBaixo: "Bixo Junior",
            banhSuite: "BBB",
            sala: "TPM",
            lavabo: "TPM"
        },
        {
            cozinha: "TPM",
            banhBaixo: "Bixo TotalFlex",
            banhSuite: "Bixo Junior",
            sala: "BBB",
            lavabo: "BBB"
        }
    ],
    friday: [
        {
            cozinha: "Leidi",
            banhBaixo: "Madre",
            banhSuite: "Espalha",
            sala: "Latam",
            lavabo: "Caldo"
        },
        {
            cozinha: "Caldo",
            banhBaixo: "Leidi",
            banhSuite: "Madre",
            sala: "Espalha",
            lavabo: "Latam"
        },
        {
            cozinha: "Latam",
            banhBaixo: "Caldo",
            banhSuite: "Leidi",
            sala: "Madre",
            lavabo: "Espalha"
        },
        {
            cozinha: "Espalha",
            banhBaixo: "Latam",
            banhSuite: "Caldo",
            sala: "Leidi",
            lavabo: "Madre"
        },
        {
            cozinha: "Madre",
            banhBaixo: "Espalha",
            banhSuite: "Latam",
            sala: "Caldo",
            lavabo: "Leidi"
        }
    ]
};

/**
 * Definição dos cômodos a serem limpos
 * @type {Array<Object>}
 */
const rooms = [
    { label: "🍽️ Cozinha", key: "cozinha" },
    { label: "🚿 Banheiro de baixo", key: "banhBaixo" },
    { label: "🛁 Banheiro suíte", key: "banhSuite" },
    { label: "🛋️ Sala e corredor", key: "sala" },
    { label: "🚽 Lavabo", key: "lavabo" }
];

/**
 * Data de referência para o início do ciclo
 * @type {Date}
 */
const REFERENCE_DATE = new Date(2020, 1, 24); // 24 de fevereiro de 2020

/**
 * Formata a data no formato DD/MM
 * @param {Date} date - Data a ser formatada
 * @returns {string} Data formatada como DD/MM
 */
function formatDate(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
    });
}

/**
 * Calcula a diferença de semanas entre duas datas
 * @param {Date} date1 - Data mais recente
 * @param {Date} date2 - Data mais antiga
 * @returns {number} Número de semanas de diferença
 */
function getWeekDifference(date1, date2) {
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor((date1 - date2) / msPerWeek);
}

/**
 * Encontra a data da segunda-feira da semana atual
 * @param {Date} today - Data atual
 * @returns {Date} Data da segunda-feira
 */
function getMondayDate(today) {
    const currentDay = today.getDay();
    const diffToMonday = (currentDay === 0 ? -6 : 1 - currentDay);
    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() + diffToMonday);
    return mondayDate;
}

/**
 * Cria e renderiza uma coluna do cronograma de limpeza
 * @param {string} id - ID do contêiner
 * @param {string} dayName - Nome do dia
 * @param {Object} schedule - Dados da escala para o dia
 * @param {Date} cleaningDate - Data da limpeza
 * @returns {HTMLElement} Elemento da coluna criado
 */
function createScheduleColumn(id, dayName, schedule, cleaningDate) {
    const column = document.createElement('div');
    column.id = id;
    column.className = 'column';

    const columnHeader = document.createElement('header');
    columnHeader.innerHTML = `
        <h2>${dayName}</h2>
        <span>${formatDate(cleaningDate)}</span>
    `;

    column.appendChild(columnHeader);

    rooms.forEach(room => {
        const div = document.createElement('div');
        div.classList.add('room');
        div.innerHTML = `
            <span class="room-name">${room.label}</span>
            <span class="responsible">${schedule[room.key]}</span>
        `;
        column.appendChild(div);
    });

    return column;
}

/**
 * Inicializa o cronograma de limpeza
 */
function initCleaningSchedule() {
    const today = new Date();
    const mondayDate = getMondayDate(today);

    const weekDiff = Math.max(0, getWeekDifference(mondayDate, REFERENCE_DATE));
    const mondayWednesdayCycleIndex = weekDiff % 4;
    const fridayCycleIndex = weekDiff % 5;

    const wednesdayDate = new Date(mondayDate);
    wednesdayDate.setDate(mondayDate.getDate() + 2);

    const fridayDate = new Date(mondayDate);
    fridayDate.setDate(mondayDate.getDate() + 4);

    const scheduleContainer = document.getElementById('cleaningSchedule');
    if (!scheduleContainer) return;

    // Criar colunas
    const mondayColumn = createScheduleColumn(
        "monday",
        "Segunda-feira",
        scheduleData.monday[mondayWednesdayCycleIndex],
        mondayDate
    );

    const wednesdayColumn = createScheduleColumn(
        "wednesday",
        "Quarta-feira",
        scheduleData.wednesday[mondayWednesdayCycleIndex],
        wednesdayDate
    );

    const fridayColumn = createScheduleColumn(
        "friday",
        "Sexta-feira",
        scheduleData.friday[fridayCycleIndex],
        fridayDate
    );

    // Adicionar colunas ao contêiner
    scheduleContainer.appendChild(mondayColumn);
    scheduleContainer.appendChild(wednesdayColumn);
    scheduleContainer.appendChild(fridayColumn);

    // Destacar o dia atual
    const todayWeekDay = today.getDay();
    if (todayWeekDay === 1) {
        mondayColumn.classList.add("current-day");
    } else if (todayWeekDay === 3) {
        wednesdayColumn.classList.add("current-day");
    } else if (todayWeekDay === 5) {
        fridayColumn.classList.add("current-day");
    }
}

/**
 * Gerencia o tema claro/escuro
 */
function initThemeManager() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    /**
     * Define o tema da aplicação
     * @param {boolean} isDark - Se o tema deve ser escuro
     */
    function setTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        themeIcon.textContent = isDark ? '☀️' : '🌙';

        // Alterar o estilo do ícone do cabeçalho
        const headerIcon = document.querySelector('.page-header img');
        if (headerIcon) {
            // Aplicar filtro de inversão no modo escuro
            headerIcon.style.filter = isDark ? 'invert(1) brightness(1.5)' : 'none';
        }

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Verificar tema salvo ou preferência do sistema
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        setTheme(prefersDark.matches);
    }

    // Alternar tema ao clicar no botão
    themeToggle.addEventListener('click', () => {
        setTheme(!document.body.classList.contains('dark-mode'));
    });

    // Ouvir mudanças nas preferências do sistema
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });
}

/**
 * Destaca o dia atual na tabela da máquina de lavar
 */
function highlightCurrentWashingDay() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const washingTable = document.querySelector('.washing-schedule table');
    if (!washingTable) return;

    // Get all rows in the table body
    const rows = washingTable.querySelectorAll('tbody tr');

    // Map JavaScript day index (0-6) to table row index (0-6)
    // In our table: 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
    let rowIndex;
    if (dayOfWeek === 0) {
        rowIndex = 6; // Sunday is the last row
    } else {
        rowIndex = dayOfWeek - 1; // Adjust for other days
    }

    // Add the highlight class to the corresponding row
    if (rowIndex >= 0 && rowIndex < rows.length) {
        rows[rowIndex].classList.add('current-day');
    }
}

/**
 * Inicializa a aplicação quando o DOM está pronto
 */
document.addEventListener('DOMContentLoaded', () => {
    initCleaningSchedule();
    initThemeManager();
    highlightCurrentWashingDay();
});

// Habilitar registro de erros
window.addEventListener('error', (event) => {
    console.error('Erro capturado:', event.error);
});