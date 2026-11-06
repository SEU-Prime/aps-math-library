const list = document.querySelector("#course-list");
const search = document.querySelector("#course-search");
const count = document.querySelector("#result-count");
const empty = document.querySelector("#empty-state");
const filters = [...document.querySelectorAll("[data-filter]")];

let courses = [];
let activeFilter = "all";
let typesetQueue = Promise.resolve();

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function courseCard(course) {
  const readerUrl = course.pdf.replace(/\/[^/]+$/, "/read.html");
  const href = `./${escapeHtml(readerUrl)}`;
  return `
    <article class="course-card" data-group="${escapeHtml(course.group)}">
      <a class="cover-link" href="${href}" aria-label="阅读${escapeHtml(course.title)}">
        <img src="./${escapeHtml(course.cover)}" alt="${escapeHtml(course.title)}讲义封面" loading="lazy" width="600" height="800">
      </a>
      <div class="course-content">
        <div class="course-meta"><span class="category-label">${escapeHtml(course.groupLabel)}</span><span class="course-pages">${escapeHtml(course.scope)} · ${course.pages} 页</span></div>
        <h2 class="course-title">${escapeHtml(course.title)}<span class="course-subtitle">${escapeHtml(course.subtitle)}</span></h2>
        <p class="course-summary">${escapeHtml(course.summary)}</p>
        <div class="course-formula" aria-label="代表公式"><span>\\(${escapeHtml(course.formula)}\\)</span></div>
        <div class="course-actions">
          <a class="action-button action-primary" href="${href}">在线阅读</a>
        </div>
      </div>
    </article>`;
}

function typesetFormulas() {
  if (!window.MathJax?.typesetPromise) return;
  typesetQueue = typesetQueue
    .catch(() => {})
    .then(() => {
      window.MathJax.typesetClear([list]);
      return window.MathJax.typesetPromise([list]);
    })
    .catch(() => {});
}

function updateCourses() {
  const query = search.value.trim().toLocaleLowerCase();
  const filtered = courses.filter((course) => {
    const matchesGroup = activeFilter === "all" || course.group === activeFilter;
    const searchText = `${course.title} ${course.subtitle} ${course.scope} ${course.summary} ${course.keywords}`.toLocaleLowerCase();
    return matchesGroup && (!query || searchText.includes(query));
  });
  list.innerHTML = filtered.map(courseCard).join("");
  typesetFormulas();
  count.textContent = `显示 ${filtered.length} 门课程`;
  empty.hidden = filtered.length !== 0;
}

async function initialize() {
  try {
    const response = await fetch("./courses.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    courses = await response.json();
    document.querySelector("#course-total").textContent = String(courses.length);
    updateCourses();
  } catch (error) {
    count.textContent = "课程目录暂时无法载入";
    empty.hidden = false;
    empty.textContent = "请通过本地静态服务器或 GitHub Pages 打开此页面。";
  }
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    updateCourses();
  });
});

search.addEventListener("input", updateCourses);

initialize();
