(() => {
  "use strict";

  const resources = Array.isArray(window.TRILHA_RESOURCES) ? window.TRILHA_RESOURCES : [];
  const savedKey = "trilha-aberta:favoritos:v1";
  const themeKey = "trilha-aberta:tema:v1";
  const form = document.querySelector("#filters");
  const searchInput = document.querySelector("#search-input");
  const topicFilter = document.querySelector("#topic-filter");
  const levelFilter = document.querySelector("#level-filter");
  const savedOnly = document.querySelector("#saved-only");
  const grid = document.querySelector("#resource-grid");
  const count = document.querySelector("#result-count");
  const savedCount = document.querySelector("#saved-count");
  const emptyState = document.querySelector("#empty-state");
  const toast = document.querySelector("#toast");
  const themeToggle = document.querySelector("#theme-toggle");
  const themeLabel = themeToggle.querySelector(".theme-label");

  function readSaved() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(savedKey) || "[]");
      return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []);
    } catch {
      return new Set();
    }
  }

  let savedIds = readSaved();
  let toastTimer;

  function applyTheme(theme, persist = false) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    const isDark = nextTheme === "dark";
    document.documentElement.dataset.theme = nextTheme;
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.title = `Ativar tema ${isDark ? "claro" : "escuro"}`;
    themeLabel.textContent = isDark ? "Claro" : "Escuro";
    document.querySelector('meta[name="theme-color"]').content = isDark ? "#0d1825" : "#172c45";
    if (persist) {
      try {
        window.localStorage.setItem(themeKey, nextTheme);
      } catch {
        showToast("O tema ficará ativo até você fechar esta página.");
      }
    }
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    applyTheme(currentTheme === "dark" ? "light" : "dark", true);
  });

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR")
      .trim();
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function persistSaved() {
    try {
      window.localStorage.setItem(savedKey, JSON.stringify([...savedIds]));
      return true;
    } catch {
      return false;
    }
  }

  function bookmarkIcon(isSaved) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4.75h11a1 1 0 0 1 1 1v14l-6.5-3.9-6.5 3.9v-14a1 1 0 0 1 1-1Z" ${isSaved ? 'fill="currentColor"' : 'fill="none"'} stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`;
  }

  function resourceCard(resource) {
    const isSaved = savedIds.has(resource.id);
    const initials = resource.provider
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    const title = escapeHTML(resource.title);

    return `
      <article class="resource-card">
        <div class="card-topline">
          <span class="provider-avatar" aria-hidden="true">${escapeHTML(initials)}</span>
          <span class="provider-name">${escapeHTML(resource.provider)}</span>
          <button class="save-button${isSaved ? " is-saved" : ""}" type="button" data-save-id="${escapeHTML(resource.id)}" aria-pressed="${isSaved}" aria-label="${isSaved ? "Remover dos salvos" : "Salvar"}: ${title}">
            ${bookmarkIcon(isSaved)}<span>${isSaved ? "Salva" : "Salvar"}</span>
          </button>
        </div>
        <div class="card-content">
          <div class="card-tags"><span class="topic-tag">${escapeHTML(resource.topic)}</span><span class="level-tag">${escapeHTML(resource.level)}</span></div>
          <h3>${title}</h3>
          <p class="resource-description">${escapeHTML(resource.description)}</p>
          <dl class="resource-meta">
            <div><dt>Formato</dt><dd>${escapeHTML(resource.format)}</dd></div>
            <div><dt>Duração</dt><dd>${escapeHTML(resource.duration)}</dd></div>
          </dl>
          <div class="access-row"><span class="free-indicator"><i aria-hidden="true"></i>${escapeHTML(resource.access)}</span></div>
          <p class="access-note">${escapeHTML(resource.accessNote)}</p>
          <a class="source-link" href="${escapeHTML(resource.url)}" target="_blank" rel="noopener noreferrer">
            Ver fonte oficial <span aria-hidden="true">↗</span>
          </a>
          <p class="checked-note">Fonte conferida em ${escapeHTML(resource.checkedAt)}. As condições podem mudar.</p>
        </div>
      </article>`;
  }

  function render() {
    const query = normalize(searchInput.value);
    const topic = topicFilter.value;
    const level = levelFilter.value;
    const showSavedOnly = savedOnly.checked;

    const visibleResources = resources.filter((resource) => {
      const searchable = normalize([
        resource.title,
        resource.provider,
        resource.description,
        resource.topic,
        resource.format,
        resource.accessNote
      ].join(" "));
      return (!query || searchable.includes(query))
        && (!topic || resource.topic === topic)
        && (!level || resource.level === level)
        && (!showSavedOnly || savedIds.has(resource.id));
    });

    grid.innerHTML = visibleResources.map(resourceCard).join("");
    const noun = visibleResources.length === 1 ? "oportunidade" : "oportunidades";
    count.textContent = `${visibleResources.length} ${noun}`;
    savedCount.textContent = String(savedIds.size);
    emptyState.hidden = visibleResources.length > 0;
    grid.hidden = visibleResources.length === 0;
  }

  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", render);
  form.addEventListener("change", render);
  form.addEventListener("reset", () => window.setTimeout(render, 0));

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-save-id]");
    if (!button) return;

    const id = button.dataset.saveId;
    if (savedIds.has(id)) {
      savedIds.delete(id);
      showToast("Removida das suas oportunidades salvas.");
    } else {
      savedIds.add(id);
      showToast("Oportunidade salva neste navegador.");
    }

    if (!persistSaved()) showToast("Favorito ativo só durante esta sessão neste navegador.");
    render();
  });

  document.querySelector("#empty-reset").addEventListener("click", () => {
    form.reset();
    searchInput.focus();
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLElement
      && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
    if (event.key === "/" && !isTyping && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === "Escape" && target === searchInput) {
      searchInput.value = "";
      render();
      searchInput.blur();
    }
  });

  applyTheme(document.documentElement.dataset.theme || "light");
  render();
})();
