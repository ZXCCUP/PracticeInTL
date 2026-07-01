(function () {
  const apiUrl = "/api/data";

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }

  async function initPage() {
    try {
      const response = await fetch(`${apiUrl}?time=${Date.now()}`);

      if (!response.ok) {
        throw new Error("Не удалось загрузить данные");
      }

      const data = await response.json();

      renderMeta(data.meta);
      renderHeader(data.header);
      renderHero(data.sections?.hero);
      renderAdvantages(data.sections?.advantages);
      renderTeam(data.sections?.team);
      renderPlatform(data.sections?.platform);
      renderClients(data.sections?.clients);
      updateSwipers();
    } catch (error) {
      console.error("Ошибка загрузки данных страницы:", error);
    }
  }

  function get(selector, root = document) {
    return root.querySelector(selector);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replaceAll("`", "&#096;");
  }

  function renderMeta(meta) {
    if (!meta) {
      return;
    }

    if (meta.title) {
      document.title = meta.title;
    }

    if (meta.lang) {
      document.documentElement.lang = meta.lang;
    }
  }

  function renderHeader(header) {
    if (!header) {
      return;
    }

    const logoLink = get(".header__logo-link");

    if (logoLink && header.logoSvg) {
      logoLink.innerHTML = header.logoSvg;
    }
  }

  function renderHero(hero) {
    if (!hero) {
      return;
    }

    const heroSection = get("#hero");
    const video = get(".hero__video", heroSection);
    const title = get(".hero__title", heroSection);

    if (video && hero.video) {
      video.src = hero.video.src || "";
      video.dataset.src = hero.video.dataSrc || hero.video.src || "";

      if (hero.video.width) {
        video.setAttribute("width", hero.video.width);
      }

      if (hero.video.height) {
        video.setAttribute("height", hero.video.height);
      }

      video.load();
    }

    if (title) {
      title.innerHTML = hero.titleHtml || escapeHtml(hero.titleText);
    }
  }

  function renderAdvantages(advantages) {
    if (!advantages) {
      return;
    }

    const title = get(".advantages__title");
    const list = get(".advantages__list");

    if (title && Array.isArray(advantages.titleParts)) {
      title.innerHTML = advantages.titleParts.map(renderAdvantageTitlePart).join("");
    }

    if (list && Array.isArray(advantages.items)) {
      list.innerHTML = advantages.items.map(renderAdvantageItem).join("");
    }
  }

  function renderAdvantageTitlePart(part) {
    if (part.type === "image") {
      return `
        <span class="advantages__title-part advantages__title-part--icon">
          <img src="${escapeAttribute(part.src)}" alt="${escapeAttribute(part.alt)}" width="${escapeAttribute(part.width || 80)}" height="${escapeAttribute(part.height || 80)}">
        </span>
      `;
    }

    return `
      <span class="advantages__title-part">${escapeHtml(part.value)}</span>
    `;
  }

  function renderAdvantageItem(item) {
    const titleContent = item.titleImage
      ? `<img src="${escapeAttribute(item.titleImage.src)}" alt="${escapeAttribute(item.titleImage.alt)}" width="${escapeAttribute(item.titleImage.width || 80)}" height="${escapeAttribute(item.titleImage.height || 80)}">`
      : escapeHtml(item.title);

    const textContent = item.textHtml || escapeHtml(item.text);

    return `
      <li class="advantages__item">
        <span class="advantages__item-title">${titleContent}</span>
        ${textContent}
      </li>
    `;
  }

  function renderTeam(team) {
    if (!team) {
      return;
    }

    const title = get(".team__title");
    const description = get(".team__description");
    const list = get(".team__list");

    if (title) {
      title.textContent = team.title || "";
    }

    if (description) {
      description.textContent = team.description || "";
    }

    if (list && Array.isArray(team.members)) {
      list.innerHTML = team.members.map(renderTeamMember).join("");
    }
  }

  function renderTeamMember(member) {
    return `
      <article class="swiper-slide team__item">
        <div class="team__item-card card card--rounded">
          <img src="${escapeAttribute(member.image)}" class="team__item-image card__image" alt="${escapeAttribute(member.alt || member.name)}" width="${escapeAttribute(member.width || 336)}" height="${escapeAttribute(member.height || 477)}" loading="lazy">
          <div class="card__description">
            <h3 class="team__item-title">${escapeHtml(member.name)}</h3>
            <p class="team__item-description">${escapeHtml(member.position)}</p>
          </div>
        </div>
        <p class="team__item-text"></p>
      </article>
    `;
  }

  function renderPlatform(platform) {
    if (!platform) {
      return;
    }

    const title = get(".platform__title");
    const description = get(".platform__description");
    const wrapper = get(".platform-chart__wrapper");

    if (title) {
      title.textContent = platform.title || "";
    }

    if (description) {
      description.textContent = platform.description || "";
    }

    if (wrapper && Array.isArray(platform.items)) {
      const groups = getPlatformGroups(platform);
      wrapper.innerHTML = groups.map(renderPlatformYear).join("");
      initPlatformModal();
    }
  }

  function getPlatformGroups(platform) {
    const items = Array.isArray(platform.items) ? platform.items : [];
    const itemById = new Map(items.map(item => [Number(item.id), item]));

    if (Array.isArray(platform.years) && platform.years.length > 0) {
      return platform.years.map(group => {
        return {
          year: group.year,
          items: group.items.map(id => itemById.get(Number(id))).filter(Boolean)
        };
      });
    }

    const grouped = {};

    items.forEach(item => {
      if (!grouped[item.year]) {
        grouped[item.year] = [];
      }

      grouped[item.year].push(item);
    });

    return Object.keys(grouped)
      .sort((a, b) => Number(a) - Number(b))
      .map(year => ({
        year,
        items: grouped[year]
      }));
  }

  function renderPlatformYear(group) {
    return `
      <div class="platform-chart__col">
        <p class="platform-chart__col-title">${escapeHtml(group.year)}</p>
        <div class="platform-chart__col-items">
          ${group.items.map(renderPlatformItem).join("")}
        </div>
      </div>
    `;
  }

  function renderPlatformItem(item) {
    const description = item.htmlDescription || createPlatformDescription(item);

    return `
      <div class="platform-chart__col-item icon-block ${escapeAttribute(item.iconClass || "")}" role="button" tabindex="0" data-title="${escapeAttribute(item.title)}" data-description="${escapeAttribute(description)}">
        <div class="icon-block__icon">
          ${item.iconSvg || ""}
          <div class="icon-block__description">
            ${description}
          </div>
        </div>
        <p class="icon-block__text">${escapeHtml(item.shortTitle || item.title)}</p>
        <p class="icon-block__year">${escapeHtml(item.year)}</p>
      </div>
    `;
  }

  function createPlatformDescription(item) {
    let html = `<b>${escapeHtml(item.title)} ${item.type ? `<span>${escapeHtml(item.type)}</span>` : ""}</b>`;

    if (item.subtitle) {
      html += `<small>${escapeHtml(item.subtitle)}</small>`;
    }

    if (item.description) {
      html += `<p>${escapeHtml(item.description)}</p>`;
    }

    return html;
  }

  function initPlatformModal() {
    const modal = get("[data-platform-modal]");

    if (!modal) {
      return;
    }

    const title = get("#platform-modal-title", modal);
    const body = get(".platform-widget-modal__body", modal);
    const closeButton = get(".platform-widget-modal__close", modal);

    document.querySelectorAll(".platform-chart__col-item").forEach(block => {
      block.addEventListener("click", () => openPlatformModal(modal, title, body, block));

      block.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPlatformModal(modal, title, body, block);
        }
      });
    });

    if (closeButton && !closeButton.dataset.ready) {
      closeButton.addEventListener("click", () => closePlatformModal(modal));
      closeButton.dataset.ready = "true";
    }

    if (!modal.dataset.ready) {
      modal.addEventListener("click", event => {
        if (event.target === modal) {
          closePlatformModal(modal);
        }
      });

      document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
          closePlatformModal(modal);
        }
      });

      modal.dataset.ready = "true";
    }
  }

  function openPlatformModal(modal, title, body, block) {
    if (title) {
      title.textContent = block.dataset.title || "Продукт";
    }

    if (body) {
      body.innerHTML = block.dataset.description || "";
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closePlatformModal(modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  function renderClients(clients) {
    if (!clients || !Array.isArray(clients.items)) {
      return;
    }

    const wrapper = get(".platform__brands .swiper-wrapper");

    if (!wrapper) {
      return;
    }

    const slides = Array.from({ length: 4 }, (_, index) => {
      return `
        <ul class="brands__list swiper-slide u-style-2" role="group" aria-label="${index + 1} / 4">
          ${clients.items.map(renderClient).join("")}
        </ul>
      `;
    });

    wrapper.innerHTML = slides.join("");
  }

  function renderClient(client, index) {
    const extraClass = index >= 6 ? " u-style-3" : "";

    return `
      <li class="brands__item${extraClass}">
        <img src="${escapeAttribute(client.logo)}" alt="${escapeAttribute(client.name)}">
      </li>
    `;
  }

  function updateSwipers() {
    document.querySelectorAll(".swiper").forEach(swiperElement => {
      if (swiperElement.swiper && typeof swiperElement.swiper.update === "function") {
        swiperElement.swiper.update();
      }
    });
  }
})();