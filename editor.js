let siteContent = {};

const editor = document.querySelector("#contentEditor");
const downloadButton = document.querySelector("#downloadContent");
const resetButton = document.querySelector("#resetContent");

const fieldGroups = [
    {
        title: "Site",
        fields: [
            ["site.brand", "Brand name"],
            ["site.owner", "Footer name"]
        ]
    },
    {
        title: "Home Hero",
        fields: [
            ["hero.name", "Name"],
            ["hero.subtitle", "Subtitle"],
            ["hero.tagline", "Tagline", "textarea"],
            ["hero.resumeHref", "Resume file/link"],
            ["hero.githubHref", "GitHub link"],
            ["hero.linkedinHref", "LinkedIn link"],
            ["hero.email", "Email"]
        ]
    },
    {
        title: "Featured Projects",
        fields: [
            ["featured.heading", "Heading"],
            ["featured.projects.0.title", "Project 1 title"],
            ["featured.projects.0.description", "Project 1 description", "textarea"],
            ["featured.projects.0.tags", "Project 1 tags"],
            ["featured.projects.0.href", "Project 1 link"],
            ["featured.projects.1.title", "Project 2 title"],
            ["featured.projects.1.description", "Project 2 description", "textarea"],
            ["featured.projects.1.tags", "Project 2 tags"],
            ["featured.projects.1.href", "Project 2 link"],
            ["featured.projects.2.title", "Project 3 title"],
            ["featured.projects.2.description", "Project 3 description", "textarea"],
            ["featured.projects.2.tags", "Project 3 tags"],
            ["featured.projects.2.href", "Project 3 link"],
            ["featured.projects.3.title", "Project 4 title"],
            ["featured.projects.3.description", "Project 4 description", "textarea"],
            ["featured.projects.3.tags", "Project 4 tags"],
            ["featured.projects.3.href", "Project 4 link"],
            ["featured.projects.4.title", "Project 5 title"],
            ["featured.projects.4.description", "Project 5 description", "textarea"],
            ["featured.projects.4.tags", "Project 5 tags"],
            ["featured.projects.4.href", "Project 5 link"]
        ]
    },
    {
        title: "Projects Page",
        fields: [
            ["projectsPage.heading", "Heading"],
            ["projectsPage.intro", "Intro", "textarea"]
        ]
    },
    {
        title: "Project Details",
        fields: [
            ["projectsPage.projects.0.title", "Project 1 title"],
            ["projectsPage.projects.0.summary", "Project 1 summary", "textarea"],
            ["projectsPage.projects.0.tags", "Project 1 tags"],
            ["projectsPage.projects.0.overview", "Project 1 overview", "textarea"],
            ["projectsPage.projects.0.features", "Project 1 features, one per line", "textarea"],
            ["projectsPage.projects.0.contributionTitle", "Project 1 final section title"],
            ["projectsPage.projects.0.contributionIntro", "Project 1 final section intro", "textarea"],
            ["projectsPage.projects.0.contributions", "Project 1 final bullets, one per line", "textarea"],
            ["projectsPage.projects.1.title", "Project 2 title"],
            ["projectsPage.projects.1.summary", "Project 2 summary", "textarea"],
            ["projectsPage.projects.1.tags", "Project 2 tags"],
            ["projectsPage.projects.1.overview", "Project 2 overview", "textarea"],
            ["projectsPage.projects.1.features", "Project 2 features, one per line", "textarea"],
            ["projectsPage.projects.1.contributionTitle", "Project 2 final section title"],
            ["projectsPage.projects.1.contributionIntro", "Project 2 final section text", "textarea"],
            ["projectsPage.projects.2.title", "Project 3 title"],
            ["projectsPage.projects.2.summary", "Project 3 summary", "textarea"],
            ["projectsPage.projects.2.tags", "Project 3 tags"],
            ["projectsPage.projects.2.overview", "Project 3 overview", "textarea"],
            ["projectsPage.projects.2.features", "Project 3 features, one per line", "textarea"],
            ["projectsPage.projects.2.contributionTitle", "Project 3 final section title"],
            ["projectsPage.projects.2.contributionIntro", "Project 3 final section text", "textarea"],
            ["projectsPage.projects.3.title", "Project 4 title"],
            ["projectsPage.projects.3.summary", "Project 4 summary", "textarea"],
            ["projectsPage.projects.3.tags", "Project 4 tags"],
            ["projectsPage.projects.3.overview", "Project 4 overview", "textarea"],
            ["projectsPage.projects.3.features", "Project 4 features, one per line", "textarea"],
            ["projectsPage.projects.3.contributionTitle", "Project 4 final section title"],
            ["projectsPage.projects.3.contributionIntro", "Project 4 final section text", "textarea"],
            ["projectsPage.projects.3.contributions", "Project 4 final bullets, one per line", "textarea"],
            ["projectsPage.projects.4.title", "Project 5 title"],
            ["projectsPage.projects.4.summary", "Project 5 summary", "textarea"],
            ["projectsPage.projects.4.tags", "Project 5 tags"],
            ["projectsPage.projects.4.overview", "Project 5 overview", "textarea"],
            ["projectsPage.projects.4.features", "Project 5 features, one per line", "textarea"],
            ["projectsPage.projects.4.contributionTitle", "Project 5 final section title"],
            ["projectsPage.projects.4.contributionIntro", "Project 5 final section text", "textarea"],
            ["projectsPage.projects.4.contributions", "Project 5 final bullets, one per line", "textarea"]
        ]
    },
    {
        title: "About",
        fields: [
            ["about.heading", "Heading"],
            ["about.intro", "Intro paragraphs", "textarea"],
            ["about.skillsHeading", "Skills heading"],
            ["about.skills.0.title", "Skill group 1 title"],
            ["about.skills.0.items", "Skill group 1 items, one per line", "textarea"],
            ["about.skills.1.title", "Skill group 2 title"],
            ["about.skills.1.items", "Skill group 2 items, one per line", "textarea"],
            ["about.skills.2.title", "Skill group 3 title"],
            ["about.skills.2.items", "Skill group 3 items, one per line", "textarea"],
            ["about.skills.3.title", "Skill group 4 title"],
            ["about.skills.3.items", "Skill group 4 items, one per line", "textarea"],
            ["about.experienceHeading", "Experience heading"],
            ["about.experience", "Experience text", "textarea"],
            ["about.educationHeading", "Education heading"],
            ["about.education", "Education text", "textarea"],
            ["about.learningHeading", "Learning heading"],
            ["about.learning", "Learning text", "textarea"]
        ]
    },
    {
        title: "Contact",
        fields: [
            ["contact.heading", "Heading"],
            ["contact.intro", "Intro", "textarea"],
            ["contact.methods.0.label", "Contact 1 label"],
            ["contact.methods.0.text", "Contact 1 display text"],
            ["contact.methods.0.href", "Contact 1 link"],
            ["contact.methods.1.label", "Contact 2 label"],
            ["contact.methods.1.text", "Contact 2 display text"],
            ["contact.methods.1.href", "Contact 2 link"],
            ["contact.methods.2.label", "Contact 3 label"],
            ["contact.methods.2.text", "Contact 3 display text"],
            ["contact.methods.2.href", "Contact 3 link"],
            ["contact.methods.3.label", "Contact 4 label"],
            ["contact.methods.3.text", "Contact 4 display text"],
            ["contact.methods.3.href", "Contact 4 link"]
        ]
    }
];

const getValue = (path) => path.split(".").reduce((value, key) => value?.[key], siteContent) ?? "";

const setValue = (path, value) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((object, key) => object[key], siteContent);
    target[lastKey] = value;
};

const makeField = ([path, label, type = "input"]) => {
    const field = document.createElement("label");
    field.className = "editor-field";
    field.innerHTML = `<span>${label}</span>`;

    const input = document.createElement(type === "textarea" ? "textarea" : "input");
    input.value = getValue(path);
    input.dataset.path = path;
    input.addEventListener("input", () => setValue(path, input.value));
    field.append(input);

    return field;
};

const renderEditor = () => {
    editor.innerHTML = "";

    fieldGroups.forEach((group) => {
        const section = document.createElement("section");
        section.className = "editor-card";
        section.innerHTML = `<h2>${group.title}</h2>`;
        group.fields.forEach((field) => section.append(makeField(field)));
        editor.append(section);
    });
};

const downloadContent = () => {
    const blob = new Blob([JSON.stringify(siteContent, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "content.json";
    link.click();
    URL.revokeObjectURL(url);
};

fetch("content.json")
    .then((response) => response.json())
    .then((content) => {
        siteContent = content;
        renderEditor();
    });

downloadButton.addEventListener("click", downloadContent);
resetButton.addEventListener("click", () => window.location.reload());
