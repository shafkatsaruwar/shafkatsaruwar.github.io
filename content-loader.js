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

const renderFeaturedProjects = (projects = []) => {
    const grid = document.querySelector("[data-featured-projects]");
    if (!grid) return;

    grid.innerHTML = projects.map((project) => `
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
};

fetch("content.json")
    .then((response) => response.json())
    .then(applyContent)
    .catch(() => {});
