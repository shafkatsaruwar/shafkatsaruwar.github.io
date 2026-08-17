const updatedAt = new Date(document.lastModified);
const formattedUpdatedAt = updatedAt.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
});

const accessibilityOptions = {
    motion: "a11y-reduce-motion",
    contrast: "a11y-high-contrast",
    text: "a11y-large-text",
};

const getStoredAccessibility = () => {
    try {
        return JSON.parse(localStorage.getItem("portfolioAccessibility") || "{}");
    } catch {
        return {};
    }
};

const saveAccessibility = (settings) => {
    try {
        localStorage.setItem("portfolioAccessibility", JSON.stringify(settings));
    } catch {
        // Keep the controls usable even when storage is blocked.
    }
};

const applyAccessibilitySettings = (settings) => {
    Object.entries(accessibilityOptions).forEach(([key, className]) => {
        document.documentElement.classList.toggle(className, Boolean(settings[key]));
    });
    document.dispatchEvent(new CustomEvent("portfolio:accessibility-updated"));
};

const initAccessibility = () => {
    const settings = getStoredAccessibility();
    applyAccessibilitySettings(settings);

    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
        link.rel = "noopener noreferrer";
    });

    const main = document.querySelector("main");
    if (main && !main.id) {
        main.id = "main-content";
    }

    if (main && !document.querySelector(".skip-link")) {
        const skipLink = document.createElement("a");
        skipLink.className = "skip-link";
        skipLink.href = `#${main.id}`;
        skipLink.textContent = "Skip to content";
        document.body.prepend(skipLink);
    }

    if (document.querySelector("[data-accessibility-toggle]")) return;

    const panel = document.createElement("section");
    panel.className = "accessibility-panel";
    panel.id = "accessibility-panel";
    panel.hidden = true;
    panel.setAttribute("aria-label", "Accessibility settings");
    panel.innerHTML = `
        <div class="accessibility-panel-header">
            <h2>Accessibility</h2>
            <button type="button" data-accessibility-close aria-label="Close accessibility settings">Close</button>
        </div>
        <button type="button" data-accessibility-option="motion" aria-pressed="false">
            <span>Reduce Motion</span>
            <small>Calmer transitions</small>
        </button>
        <button type="button" data-accessibility-option="contrast" aria-pressed="false">
            <span>High Contrast</span>
            <small>Sharper text and borders</small>
        </button>
        <button type="button" data-accessibility-option="text" aria-pressed="false">
            <span>Larger Text</span>
            <small>More readable body copy</small>
        </button>
    `;

    const toggle = document.createElement("button");
    toggle.className = "accessibility-toggle";
    toggle.type = "button";
    toggle.dataset.accessibilityToggle = "";
    toggle.setAttribute("aria-controls", panel.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Accessibility";

    document.body.append(toggle, panel);

    const syncButtons = () => {
        panel.querySelectorAll("[data-accessibility-option]").forEach((button) => {
            const key = button.dataset.accessibilityOption;
            button.setAttribute("aria-pressed", String(Boolean(settings[key])));
        });
    };

    const setPanelOpen = (open) => {
        panel.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
        if (open) {
            syncButtons();
            panel.querySelector("[data-accessibility-option]")?.focus();
        } else {
            toggle.focus();
        }
    };

    syncButtons();

    toggle.addEventListener("click", () => {
        setPanelOpen(panel.hidden);
    });

    panel.querySelector("[data-accessibility-close]")?.addEventListener("click", () => {
        setPanelOpen(false);
    });

    panel.querySelectorAll("[data-accessibility-option]").forEach((button) => {
        button.addEventListener("click", () => {
            const key = button.dataset.accessibilityOption;
            settings[key] = !settings[key];
            applyAccessibilitySettings(settings);
            saveAccessibility(settings);
            syncButtons();
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !panel.hidden) {
            setPanelOpen(false);
        }
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAccessibility, { once: true });
} else {
    initAccessibility();
}

document.querySelectorAll("[data-last-updated]").forEach((element) => {
    element.textContent = formattedUpdatedAt;
});

const revealSelectors = [
    ".section-label",
    ".about-copy > *",
    ".proof-grid span",
    ".experience-list article",
    ".education-card",
    ".contact-hero > *",
    ".project-full",
    ".project-graphic",
    ".bento-card",
    ".mini-project-card",
    ".skill-category",
    ".contact-item",
];

const revealedElements = new WeakSet();
const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
    })
    : null;

const initReveals = () => {
    document.querySelectorAll(revealSelectors.join(",")).forEach((element, index) => {
        if (revealedElements.has(element)) return;

        revealedElements.add(element);
        element.classList.add("reveal-target");
        element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 70}ms`);

        if (revealObserver) {
            revealObserver.observe(element);
        } else {
            element.classList.add("is-visible");
        }
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveals, { once: true });
} else {
    initReveals();
}

window.addEventListener("load", initReveals, { once: true });
document.addEventListener("portfolio:content-ready", initReveals);

const initProjectCarousel = () => {
    const carousel = document.querySelector(".project-showcase");
    if (!carousel || carousel.dataset.carouselReady === "true") return;

    const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
    if (!slides.length) return;

    carousel.dataset.carouselReady = "true";
    carousel.tabIndex = 0;
    carousel.setAttribute("role", "region");
    carousel.setAttribute("aria-label", "Featured project carousel");

    let activeIndex = Math.max(slides.findIndex((slide) => slide.classList.contains("is-active")), 0);
    let wheelLocked = false;

    const setActive = (nextIndex) => {
        activeIndex = (nextIndex + slides.length) % slides.length;

        slides.forEach((slide, index) => {
            slide.classList.toggle("is-active", index === activeIndex);
            slide.classList.toggle("is-before", index === (activeIndex - 1 + slides.length) % slides.length);
            slide.classList.toggle("is-after", index === (activeIndex + 1) % slides.length);
            slide.setAttribute("aria-hidden", index === activeIndex ? "false" : "true");
        });
    };

    slides.forEach((slide, index) => {
        slide.addEventListener("click", (event) => {
            if (index === activeIndex || event.target.closest("a")) return;
            setActive(index);
        });
    });

    carousel.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) < 18 || wheelLocked) return;

        event.preventDefault();
        wheelLocked = true;
        setActive(activeIndex + (event.deltaY > 0 ? 1 : -1));
        window.setTimeout(() => {
            wheelLocked = false;
        }, 620);
    }, { passive: false });

    carousel.addEventListener("keydown", (event) => {
        if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) return;

        event.preventDefault();
        setActive(activeIndex + (event.key === "ArrowDown" || event.key === "PageDown" ? 1 : -1));
    });

    setActive(activeIndex);
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectCarousel, { once: true });
} else {
    initProjectCarousel();
}

window.addEventListener("load", initProjectCarousel, { once: true });
document.addEventListener("portfolio:content-ready", initProjectCarousel);

const initExpandableBento = () => {
    document.querySelectorAll("[data-expand-bento]").forEach((grid) => {
        if (grid.dataset.expandReady === "true") return;

        const cards = [...grid.querySelectorAll(".expand-bento-card[aria-expanded]")];
        if (!cards.length) return;

        grid.dataset.expandReady = "true";

        const setExpanded = (activeCard) => {
            cards.forEach((card) => {
                const isActive = card === activeCard;
                card.classList.toggle("is-expanded", isActive);
                card.setAttribute("aria-expanded", String(isActive));
            });
        };

        cards.forEach((card) => {
            card.addEventListener("click", () => {
                setExpanded(card);
            });
        });
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExpandableBento, { once: true });
} else {
    initExpandableBento();
}

document.addEventListener("portfolio:content-ready", initExpandableBento);

const initHeroEyes = () => {
    const avatar = document.querySelector("[data-eye-track]");
    if (!avatar || avatar.dataset.eyeTrackingReady === "true") return;

    const eyes = [...avatar.querySelectorAll(".memoji-eye")];
    if (!eyes.length) return;

    avatar.dataset.eyeTrackingReady = "true";

    const resetEyes = () => {
        eyes.forEach((eye) => {
            eye.style.setProperty("--eye-x", "0px");
            eye.style.setProperty("--eye-y", "0px");
        });
    };

    const setEyes = (event) => {
        if (document.documentElement.classList.contains("a11y-reduce-motion")) {
            resetEyes();
            return;
        }

        const rect = avatar.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height * 0.47;
        const distanceX = Math.max(-1, Math.min(1, (event.clientX - centerX) / (window.innerWidth * 0.34)));
        const distanceY = Math.max(-1, Math.min(1, (event.clientY - centerY) / (window.innerHeight * 0.34)));

        eyes.forEach((eye) => {
            eye.style.setProperty("--eye-x", `${(distanceX * 3.2).toFixed(2)}px`);
            eye.style.setProperty("--eye-y", `${(distanceY * 2.1).toFixed(2)}px`);
        });
    };

    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("pointermove", setEyes, { passive: true });
        window.addEventListener("pointerleave", resetEyes);
    }

    document.addEventListener("portfolio:accessibility-updated", () => {
        if (document.documentElement.classList.contains("a11y-reduce-motion")) {
            resetEyes();
        }
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroEyes, { once: true });
} else {
    initHeroEyes();
}

const resumeToggle = document.querySelector("[data-resume-toggle]");

if (resumeToggle) {
    const setResumeMode = (enabled) => {
        document.body.classList.toggle("resume-mode", enabled);
        resumeToggle.setAttribute("aria-pressed", String(enabled));
        resumeToggle.textContent = enabled ? "Portfolio Mode" : "Resume Mode";
        window.scrollTo({
            top: 0,
            behavior: document.documentElement.classList.contains("a11y-reduce-motion") ? "auto" : "smooth",
        });
    };

    resumeToggle.addEventListener("click", () => {
        setResumeMode(!document.body.classList.contains("resume-mode"));
    });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
            behavior: document.documentElement.classList.contains("a11y-reduce-motion") ? "auto" : "smooth",
            block: "start",
        });
    });
});
