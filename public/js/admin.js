let siteData = null;

const adminForm = document.querySelector("#adminForm");
const formMessage = document.querySelector("#formMessage");

function getElement(selector) {
    return document.querySelector(selector);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function htmlToTextarea(value) {
    return String(value ?? "").replace(/<br\s*\/?>/gi, "\n");
}

function textareaToHtml(value) {
    return String(value ?? "")
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .join("<br>");
}

function nextId(items) {
    if (!items.length) {
        return 1;
    }

    return Math.max(...items.map(item => Number(item.id) || 0)) + 1;
}

async function loadData() {
    const response = await fetch("/api/data");
    siteData = await response.json();

    renderAll();
}

function renderAll() {
    renderHero();
    renderAdvantages();
    renderTeam();
    renderPlatform();
    renderClients();
}

function renderHero() {
    const hero = siteData.sections.hero;

    getElement("#heroTitle").value = htmlToTextarea(hero.titleHtml);
    getElement("#heroVideo").value = hero.video.src;
}

function renderAdvantages() {
    const section = siteData.sections.advantages;

    const titlePartsContainer = getElement("#advantagesTitleParts");
    titlePartsContainer.innerHTML = "";

    section.titleParts.forEach((part, index) => {
        if (part.type === "text") {
            titlePartsContainer.innerHTML += `
                <div class="admin-card">
                    <h4>Элемент ${index + 1}</h4>

                    <input
                        data-advantage-title-index="${index}"
                        data-field="value"
                        type="text"
                        value="${escapeHtml(part.value)}"
                    >
                </div>
            `;
        }

        if (part.type === "image") {
            titlePartsContainer.innerHTML += `
                <div class="admin-card">
                    <h4>Картинка ${index + 1}</h4>

                    <label>
                        Путь к картинке
                        <input
                            data-advantage-title-index="${index}"
                            data-field="src"
                            type="text"
                            value="${escapeHtml(part.src)}"
                        >
                    </label>

                    <label>
                        Alt
                        <input
                            data-advantage-title-index="${index}"
                            data-field="alt"
                            type="text"
                            value="${escapeHtml(part.alt)}"
                        >
                    </label>
                </div>
            `;
        }
    });

    const itemsContainer = getElement("#advantagesItems");
    itemsContainer.innerHTML = "";

    section.items.forEach((item, index) => {
        itemsContainer.innerHTML += `
            <div class="admin-card" data-advantage-id="${item.id}">
                <h4>Преимущество ${index + 1}</h4>

                <label>
                    Заголовок
                    <input data-field="title" type="text" value="${escapeHtml(item.title)}">
                </label>

                <label>
                    Текст
                    <textarea data-field="text" rows="3">${escapeHtml(item.text)}</textarea>
                </label>

                <button
                    class="delete-button"
                    type="button"
                    data-action="delete-advantage"
                    data-index="${index}"
                >
                    Удалить
                </button>
            </div>
        `;
    });
}

function renderTeam() {
    const section = siteData.sections.team;

    getElement("#teamTitle").value = section.title;
    getElement("#teamDescription").value = section.description;

    const container = getElement("#teamMembers");
    container.innerHTML = "";

    section.members.forEach((member, index) => {
        container.innerHTML += `
            <div class="admin-card" data-team-id="${member.id}">
                <h4>Сотрудник ${index + 1}</h4>

                <label>
                    Имя
                    <input data-field="name" type="text" value="${escapeHtml(member.name)}">
                </label>

                <label>
                    Должность
                    <input data-field="position" type="text" value="${escapeHtml(member.position)}">
                </label>

                <label>
                    Фото
                    <input data-field="image" type="text" value="${escapeHtml(member.image)}">
                </label>

                <label>
                    Alt
                    <input data-field="alt" type="text" value="${escapeHtml(member.alt)}">
                </label>

                <button
                    class="delete-button"
                    type="button"
                    data-action="delete-team"
                    data-index="${index}"
                >
                    Удалить
                </button>
            </div>
        `;
    });
}

function renderPlatform() {
    const section = siteData.sections.platform;

    getElement("#platformTitle").value = section.title;
    getElement("#platformDescription").value = section.description;

    const container = getElement("#platformItems");
    container.innerHTML = "";

    section.items.forEach((item, index) => {
        container.innerHTML += `
            <div class="admin-card" data-platform-id="${item.id}">
                <h4>Продукт ${index + 1}</h4>

                <label>
                    Год
                    <input data-field="year" type="text" value="${escapeHtml(item.year)}">
                </label>

                <label>
                    Название
                    <input data-field="title" type="text" value="${escapeHtml(item.title)}">
                </label>

                <label>
                    Тип
                    <input data-field="type" type="text" value="${escapeHtml(item.type)}">
                </label>

                <label>
                    Подзаголовок
                    <input data-field="subtitle" type="text" value="${escapeHtml(item.subtitle)}">
                </label>

                <label>
                    Описание
                    <textarea data-field="description" rows="4">${escapeHtml(item.description)}</textarea>
                </label>

                <button
                    class="delete-button"
                    type="button"
                    data-action="delete-platform"
                    data-index="${index}"
                >
                    Удалить
                </button>
            </div>
        `;
    });
}

function renderClients() {
    const section = siteData.sections.clients;

    const container = getElement("#clientsItems");
    container.innerHTML = "";

    section.items.forEach((client, index) => {
        container.innerHTML += `
            <div class="admin-card">
                <h4>Клиент ${index + 1}</h4>

                <label>
                    Название
                    <input data-field="name" type="text" value="${escapeHtml(client.name)}">
                </label>

                <label>
                    Логотип
                    <input data-field="logo" type="text" value="${escapeHtml(client.logo)}">
                </label>

                <button
                    class="delete-button"
                    type="button"
                    data-action="delete-client"
                    data-index="${index}"
                >
                    Удалить
                </button>
            </div>
        `;
    });
}

function collectAllData() {
    collectHero();
    collectAdvantages();
    collectTeam();
    collectPlatform();
    collectClients();
}

function collectHero() {
    const hero = siteData.sections.hero;

    hero.titleHtml = textareaToHtml(getElement("#heroTitle").value);
    hero.titleText = getElement("#heroTitle").value.replace(/\s+/g, " ").trim();
    hero.video.src = getElement("#heroVideo").value.trim();
    hero.video.dataSrc = getElement("#heroVideo").value.trim();
}

function collectAdvantages() {
    const section = siteData.sections.advantages;

    document.querySelectorAll("[data-advantage-title-index]").forEach(input => {
        const index = Number(input.dataset.advantageTitleIndex);
        const field = input.dataset.field;

        section.titleParts[index][field] = input.value.trim();
    });

    const oldItems = section.items;

    section.items = Array.from(document.querySelectorAll("[data-advantage-id]")).map(card => {
        const id = Number(card.dataset.advantageId);
        const oldItem = oldItems.find(item => Number(item.id) === id) || {};

        const title = card.querySelector('[data-field="title"]').value.trim();
        const text = card.querySelector('[data-field="text"]').value.trim();

        return {
            ...oldItem,
            id,
            title,
            text,
            textHtml: textareaToHtml(text)
        };
    });
}

function collectTeam() {
    const section = siteData.sections.team;

    section.title = getElement("#teamTitle").value.trim();
    section.description = getElement("#teamDescription").value.trim();

    const oldMembers = section.members;

    section.members = Array.from(document.querySelectorAll("[data-team-id]")).map(card => {
        const id = Number(card.dataset.teamId);
        const oldMember = oldMembers.find(member => Number(member.id) === id) || {};

        return {
            ...oldMember,
            id,
            name: card.querySelector('[data-field="name"]').value.trim(),
            position: card.querySelector('[data-field="position"]').value.trim(),
            image: card.querySelector('[data-field="image"]').value.trim(),
            alt: card.querySelector('[data-field="alt"]').value.trim(),
            width: oldMember.width || "336",
            height: oldMember.height || "477"
        };
    });
}

function collectPlatform() {
    const section = siteData.sections.platform;

    section.title = getElement("#platformTitle").value.trim();
    section.description = getElement("#platformDescription").value.trim();

    const oldItems = section.items;

    section.items = Array.from(document.querySelectorAll("[data-platform-id]")).map(card => {
        const id = Number(card.dataset.platformId);
        const oldItem = oldItems.find(item => Number(item.id) === id) || {};

        const title = card.querySelector('[data-field="title"]').value.trim();
        const type = card.querySelector('[data-field="type"]').value.trim();
        const subtitle = card.querySelector('[data-field="subtitle"]').value.trim();
        const description = card.querySelector('[data-field="description"]').value.trim();

        return {
            ...oldItem,
            id,
            year: card.querySelector('[data-field="year"]').value.trim(),
            title,
            shortTitle: title,
            type,
            subtitle,
            description,
            htmlDescription: createPlatformHtmlDescription(title, type, subtitle, description)
        };
    });

    rebuildPlatformYears();
}

function createPlatformHtmlDescription(title, type, subtitle, description) {
    let html = `<b>${title} ${type ? `<span>${type}</span>` : ""}</b>`;

    if (subtitle) {
        html += `\n<small>${subtitle}</small>`;
    }

    if (description) {
        html += `\n<p>${description}</p>`;
    }

    return html;
}

function rebuildPlatformYears() {
    const items = siteData.sections.platform.items;
    const grouped = {};

    items.forEach(item => {
        if (!grouped[item.year]) {
            grouped[item.year] = [];
        }

        grouped[item.year].push(item.id);
    });

    siteData.sections.platform.years = Object.keys(grouped)
        .sort((a, b) => Number(a) - Number(b))
        .map(year => ({
            year,
            items: grouped[year]
        }));
}

function collectClients() {
    const section = siteData.sections.clients;

    section.items = Array.from(document.querySelectorAll("#clientsItems .admin-card")).map(card => {
        return {
            name: card.querySelector('[data-field="name"]').value.trim(),
            logo: card.querySelector('[data-field="logo"]').value.trim()
        };
    });
}

async function saveData() {
    const response = await fetch("/api/data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(siteData)
    });

    if (!response.ok) {
        throw new Error("Ошибка сохранения");
    }

    formMessage.textContent = "Данные сохранены";
}

adminForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
        collectAllData();
        await saveData();
    } catch (error) {
        console.error(error);
        formMessage.textContent = "Ошибка сохранения данных";
    }
});

document.addEventListener("click", function (event) {
    const action = event.target.dataset.action;

    if (!action) {
        return;
    }

    if (action === "delete-advantage") {
        collectAdvantages();
        siteData.sections.advantages.items.splice(Number(event.target.dataset.index), 1);
        renderAdvantages();
    }

    if (action === "delete-team") {
        collectTeam();
        siteData.sections.team.members.splice(Number(event.target.dataset.index), 1);
        renderTeam();
    }

    if (action === "delete-platform") {
        collectPlatform();
        siteData.sections.platform.items.splice(Number(event.target.dataset.index), 1);
        rebuildPlatformYears();
        renderPlatform();
    }

    if (action === "delete-client") {
        collectClients();
        siteData.sections.clients.items.splice(Number(event.target.dataset.index), 1);
        renderClients();
    }
});

getElement("#addAdvantageItem").addEventListener("click", function () {
    collectAdvantages();

    siteData.sections.advantages.items.push({
        id: nextId(siteData.sections.advantages.items),
        title: "Новый пункт",
        text: "Описание",
        textHtml: "Описание"
    });

    renderAdvantages();
});

getElement("#addTeamMember").addEventListener("click", function () {
    collectTeam();

    siteData.sections.team.members.push({
        id: nextId(siteData.sections.team.members),
        name: "Новый сотрудник",
        position: "Должность",
        image: "images/photo.png",
        alt: "Новый сотрудник",
        width: "336",
        height: "477"
    });

    renderTeam();
});

getElement("#addPlatformItem").addEventListener("click", function () {
    collectPlatform();

    const firstItem = siteData.sections.platform.items[0];

    siteData.sections.platform.items.push({
        id: nextId(siteData.sections.platform.items),
        year: "2026",
        title: "Новый продукт",
        type: "B2B",
        shortTitle: "Новый продукт",
        subtitle: "Краткое описание",
        description: "Описание продукта",
        iconClass: firstItem?.iconClass || "icon-block--1",
        iconSvg: firstItem?.iconSvg || "",
        htmlDescription: "<b>Новый продукт <span>B2B</span></b><small>Краткое описание</small><p>Описание продукта</p>"
    });

    rebuildPlatformYears();
    renderPlatform();
});

getElement("#addClient").addEventListener("click", function () {
    collectClients();

    siteData.sections.clients.items.push({
        name: "Новый клиент",
        logo: "images/logo.svg"
    });

    renderClients();
});

loadData();