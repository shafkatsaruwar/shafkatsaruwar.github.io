const splitLines = (value) => String(value || "").split("\n").filter(Boolean);
const splitTags = (value) => String(value || "").split(",").map((tag) => tag.trim()).filter(Boolean);

const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && value !== undefined) {
        element.textContent = value;
    }
};

const setHref = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && value) {
        element.href = value;
    }
};

const renderParagraphs = (container, value) => {
    container.innerHTML = splitLines(value)
        .map((line) => `<p>${line}</p>`)
        .join("");
};

const renderTags = (container, tags) => {
    container.innerHTML = splitTags(tags)
        .map((tag) => `<span>${tag}</span>`)
        .join("");
};

const renderList = (container, items) => {
    container.innerHTML = splitLines(items)
        .map((item) => `<li>${item}</li>`)
        .join("");
};

const getProjectGraphicType = (project) => {
    const key = `${project.id || ""} ${project.title || ""}`.toLowerCase();
    if (key.includes("synapse")) return "synapse";
    if (key.includes("lifeos") || key.includes("life os")) return "lifeos";
    if (key.includes("resume")) return "resume";
    return "system";
};

const renderProjectGraphic = (project, variant = "compact") => {
    const type = getProjectGraphicType(project);

    if (type === "synapse") {
        return `
            <div class="project-graphic project-graphic-${variant} graphic-synapse" aria-hidden="true">
                <div class="phone-shell">
                    <span></span>
                    <span class="joke-score">129% guardian mode</span>
                    <div class="phone-card phone-card-primary"><b>8:00</b><em>Medication due</em></div>
                    <div class="phone-card"><i></i><em>Symptom log</em></div>
                    <div class="phone-card"><i></i><em>Recovery trend</em></div>
                </div>
            </div>
        `;
    }

    if (type === "lifeos") {
        return `
            <div class="project-graphic project-graphic-${variant} graphic-lifeos" aria-hidden="true">
                <div class="dashboard-shell">
                    <span class="joke-score">90% life together</span>
                    <span class="dash-rail"></span>
                    <span class="dash-card dash-card-wide"></span>
                    <span class="dash-card"></span>
                    <span class="dash-card"></span>
                    <span class="dash-pill"></span>
                    <span class="dash-line"></span>
                </div>
            </div>
        `;
    }

    if (type === "resume") {
        return `
            <div class="project-graphic project-graphic-${variant} graphic-resume" aria-hidden="true">
                <div class="resume-shell-graphic">
                    <span class="resume-score">92% brain power used</span>
                    <span class="resume-line resume-line-long"></span>
                    <span class="resume-line"></span>
                    <span class="resume-line resume-line-short"></span>
                    <span class="resume-gap"></span>
                    <span class="resume-check"></span>
                </div>
            </div>
        `;
    }

    return `
        <div class="project-graphic project-graphic-${variant} graphic-system" aria-hidden="true">
            <span></span><span></span><span></span>
        </div>
    `;
};

const renderFeaturedProjects = (projects = []) => {
    const grid = document.querySelector("[data-featured-projects]");
    if (!grid) return;

    if (grid.classList.contains("project-showcase")) {
        delete grid.dataset.carouselReady;
        grid.innerHTML = projects.slice(0, 3).map((project, index) => `
            <article class="showcase-slide${index === 0 ? " is-active" : ""}" data-carousel-slide>
                <span class="showcase-number">${String(index + 1).padStart(2, "0")}</span>
                <div class="showcase-copy">
                    <p>${splitTags(project.tags).slice(0, 2).join(" / ") || "Featured"}</p>
                    <h2>${project.title}</h2>
                    <span>${project.description}</span>
                </div>
                ${renderProjectGraphic(project)}
                <a href="${project.href}">Open Project</a>
            </article>
        `).join("");
        return;
    }

    grid.innerHTML = projects.slice(0, 3).map((project) => `
        <div class="project-card">
            <div class="project-visual" aria-hidden="true">
                <span class="project-mark">${project.title.split(" ").map((word) => word[0]).join("").slice(0, 3)}</span>
                <span class="project-line project-line-long"></span>
                <span class="project-line"></span>
                <span class="project-line project-line-short"></span>
            </div>
            <div class="project-card-body">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tech-tags">${splitTags(project.tags).map((tag) => `<span>${tag}</span>`).join("")}</div>
                <a href="${project.href}" class="project-link">Learn More -></a>
            </div>
        </div>
    `).join("");
};

const renderProjectDetails = (projects = []) => {
    const section = document.querySelector("[data-projects-section]");
    if (!section) return;

    section.innerHTML = projects.map((project) => `
        <div class="project-full" id="${project.id}">
            <h2>${project.title}</h2>
            <p><strong>${project.summary}</strong></p>
            <div class="tech-tags">${splitTags(project.tags).map((tag) => `<span>${tag}</span>`).join("")}</div>
            <h3>Overview</h3>
            <p>${project.overview}</p>
            <h3>Key Features</h3>
            <ul>${splitLines(project.features).map((item) => `<li>${item}</li>`).join("")}</ul>
            <h3>${project.contributionTitle}</h3>
            <p>${project.contributionIntro}</p>
            ${project.contributions ? `<ul>${splitLines(project.contributions).map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
            <div class="project-links">
                ${(project.links || []).map((link) => `<a href="${link.href}" target="_blank" class="btn btn-${link.style === "secondary" ? "secondary" : "primary"}">${link.label}</a>`).join("")}
            </div>
        </div>
    `).join("");
};

const renderSkills = (skills = []) => {
    const grid = document.querySelector("[data-skills-grid]");
    if (!grid) return;

    grid.innerHTML = skills.map((skill) => `
        <div class="skill-category">
            <h3>${skill.title}</h3>
            <ul>${splitLines(skill.items).map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
    `).join("");
};

const renderContactMethods = (methods = []) => {
    const list = document.querySelector("[data-contact-methods]");
    if (!list) return;

    list.innerHTML = methods.map((method) => `
        <div class="contact-item">
            <h3>${method.label}</h3>
            <a href="${method.href}" target="${method.href.startsWith("mailto:") ? "_self" : "_blank"}">${method.text}</a>
        </div>
    `).join("");
};

const applyContent = (content) => {
    document.querySelectorAll("[data-brand]").forEach((element) => {
        element.textContent = content.site.brand;
    });

    setText("[data-hero-name]", content.hero.name);
    setText("[data-hero-subtitle]", content.hero.subtitle);
    setText("[data-hero-tagline]", content.hero.tagline);
    setHref("[data-resume-link]", content.hero.resumeHref);
    setHref("[data-github-link]", content.hero.githubHref);
    setHref("[data-linkedin-link]", content.hero.linkedinHref);
    setHref("[data-email-link]", `mailto:${content.hero.email}`);
    setText("[data-featured-heading]", content.featured.heading);
    renderFeaturedProjects(content.featured.projects);

    setText("[data-projects-heading]", content.projectsPage.heading);
    setText("[data-projects-intro]", content.projectsPage.intro);
    renderProjectDetails(content.projectsPage.projects);

    setText("[data-about-heading]", content.about.heading);
    const aboutIntro = document.querySelector("[data-about-intro]");
    if (aboutIntro) renderParagraphs(aboutIntro, content.about.intro);
    setText("[data-skills-heading]", content.about.skillsHeading);
    renderSkills(content.about.skills);
    setText("[data-experience-heading]", content.about.experienceHeading);
    const experience = document.querySelector("[data-experience]");
    if (experience) renderParagraphs(experience, content.about.experience);
    setText("[data-education-heading]", content.about.educationHeading);
    const education = document.querySelector("[data-education]");
    if (education) renderParagraphs(education, content.about.education);
    setText("[data-learning-heading]", content.about.learningHeading);
    const learning = document.querySelector("[data-learning]");
    if (learning) renderParagraphs(learning, content.about.learning);

    setText("[data-contact-heading]", content.contact.heading);
    setText("[data-contact-intro]", content.contact.intro);
    renderContactMethods(content.contact.methods);

    document.querySelectorAll("[data-owner]").forEach((element) => {
        element.textContent = content.site.owner;
    });

    document.dispatchEvent(new CustomEvent("portfolio:content-ready"));
};

fetch(`content.json?v=${Date.now()}`)
    .then((response) => response.json())
    .then(applyContent)
    .catch(() => {});
