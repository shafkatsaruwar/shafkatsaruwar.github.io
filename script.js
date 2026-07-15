const updatedAt = new Date(document.lastModified);
const formattedUpdatedAt = updatedAt.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
});

document.querySelectorAll("[data-last-updated]").forEach((element) => {
    element.textContent = formattedUpdatedAt;
});
