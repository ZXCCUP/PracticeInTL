if (window.Lenis) {
    window.lenis = new Lenis({ wheelMultiplier: 0.6 });

    function raf(time) {
        window.lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

(function () {
    const header = document.querySelector('.page__header.header');
    const themedSections = Array.from(document.querySelectorAll('[data-header-theme]'));

    if (!header || themedSections.length === 0) return;

    function findSectionUnderHeader() {
        const headerRect = header.getBoundingClientRect();
        const y = Math.min(
            window.innerHeight - 1,
            Math.max(1, headerRect.top + headerRect.height * 0.65)
        );

        const xPoints = [
            80,
            Math.round(window.innerWidth / 2),
            Math.max(1, window.innerWidth - 80)
        ];

        const oldPointerEvents = header.style.pointerEvents;
        header.style.pointerEvents = 'none';

        let section = null;

        for (const x of xPoints) {
            const element = document.elementFromPoint(x, y);
            const candidate = element && element.closest('[data-header-theme]');

            if (candidate) {
                section = candidate;
                break;
            }
        }

        header.style.pointerEvents = oldPointerEvents;

        if (section) return section;

        return themedSections.find((item) => {
            const rect = item.getBoundingClientRect();
            return rect.top <= y && rect.bottom >= y;
        }) || themedSections[0];
    }

    function updateHeaderColor() {
        const currentSection = findSectionUnderHeader();
        const theme = currentSection ? currentSection.dataset.headerTheme : 'dark';

        header.classList.toggle('header--on-light', theme === 'light');
        header.classList.toggle('header--hidden', theme === 'hidden');
    }

    let ticking = false;

    function requestHeaderColorUpdate() {
        if (ticking) return;

        ticking = true;

        requestAnimationFrame(() => {
            updateHeaderColor();
            ticking = false;
        });
    }

    updateHeaderColor();

    window.addEventListener('scroll', requestHeaderColorUpdate, { passive: true });
    window.addEventListener('resize', requestHeaderColorUpdate);
    window.addEventListener('load', requestHeaderColorUpdate);
    document.addEventListener('DOMContentLoaded', requestHeaderColorUpdate);

    if (window.lenis && typeof window.lenis.on === 'function') {
        window.lenis.on('scroll', requestHeaderColorUpdate);
    }

    if (window.ScrollTrigger && typeof window.ScrollTrigger.addEventListener === 'function') {
        window.ScrollTrigger.addEventListener('refresh', requestHeaderColorUpdate);
    }

    setTimeout(requestHeaderColorUpdate, 100);
    setTimeout(requestHeaderColorUpdate, 600);
})();

(function () {
    const modal = document.querySelector('[data-platform-modal]');
    if (!modal) return;

    const titleNode = modal.querySelector('.platform-widget-modal__title');
    const bodyNode = modal.querySelector('.platform-widget-modal__body');
    const closeButton = modal.querySelector('.platform-widget-modal__close');
    const card = modal.querySelector('.platform-widget-modal__card');

    let lastFocusedElement = null;

    function openModal(block) {
        const description = block.querySelector('.icon-block__description');
        const title = block.querySelector('.icon-block__text')?.textContent?.trim() || 'Продукт';
        const year = block.querySelector('.icon-block__year')?.textContent?.trim();

        titleNode.textContent = year ? `${title} · ${year}` : title;
        bodyNode.innerHTML = description ? description.innerHTML : `<p>${title}</p>`;

        lastFocusedElement = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        closeButton.focus();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        bodyNode.innerHTML = '';

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    document.querySelectorAll('.platform .icon-block').forEach((block) => {
        block.addEventListener('click', () => openModal(block));

        block.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(block);
            }
        });
    });

    closeButton.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (!card.contains(event.target)) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
})();