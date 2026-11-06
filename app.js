const list = document.querySelector("#course-list");
const search = document.querySelector("#course-search");
const count = document.querySelector("#result-count");
const empty = document.querySelector("#empty-state");
const filters = [...document.querySelectorAll("[data-filter]")];
const reader = document.querySelector("#reader");
const frame = document.querySelector("#pdf-frame");
const readerTitle = document.querySelector("#reader-title");
const readerDownload = document.querySelector("#reader-download");
const readerTex = document.querySelector("#reader-tex");
const readerNewTab = document.querySelector("#reader-new-tab");

let courses = [];
let activeFilter = "all";

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
  const searchable = `${course.title} ${course.subtitle} ${course.scope} ${course.summary} ${course.keywords}`.toLocaleLowerCase();
  return `
    <article class="course-card" data-group="${escapeHtml(course.group)}" data-search="${escapeHtml(searchable)}">
      <a class="cover-link" href="./${escapeHtml(course.pdf)}" data-read="${escapeHtml(course.id)}" aria-label="阅读${escapeHtml(course.title)} PDF">
        <img src="./${escapeHtml(course.cover)}" alt="${escapeHtml(course.title)}讲义封面" loading="lazy" width="600" height="800">
      </a>
      <div class="course-content">
        <div class="course-meta"><span class="category-label">${escapeHtml(course.groupLabel)}</span><span class="course-pages">${escapeHtml(course.scope)} · ${course.pages} 页</span></div>
        <h2 class="course-title">${escapeHtml(course.title)}<span class="course-subtitle">${escapeHtml(course.subtitle)}</span></h2>
        <p class="course-summary">${escapeHtml(course.summary)}</p>
        <div class="course-actions">
          <button class="action-button action-primary" type="button" data-read="${escapeHtml(course.id)}">阅读 PDF</button>
          <a class="action-button action-secondary" href="./${escapeHtml(course.tex)}" download>TeX 源文件</a>
        </div>
      </div>
    </article>`;
}

function updateCourses() {
  const query = search.value.trim().toLocaleLowerCase();
  const filtered = courses.filter((course) => {
    const matchesGroup = activeFilter === "all" || course.group === activeFilter;
    const searchText = `${course.title} ${course.subtitle} ${course.scope} ${course.summary} ${course.keywords}`.toLocaleLowerCase();
    return matchesGroup && (!query || searchText.includes(query));
  });
  list.innerHTML = filtered.map(courseCard).join("");
  count.textContent = `显示 ${filtered.length} 门课程`;
  empty.hidden = filtered.length !== 0;
}

function openReader(course) {
  readerTitle.textContent = `${course.title} · ${course.subtitle}`;
  const pdfUrl = `./${course.pdf}`;
  frame.src = `${pdfUrl}#view=FitH`;
  readerDownload.href = pdfUrl;
  readerDownload.download = `${course.id}-aps.pdf`;
  readerTex.href = `./${course.tex}`;
  readerTex.download = `${course.id}-source.tex`;
  readerNewTab.href = pdfUrl;
  reader.showModal();
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

list.addEventListener("click", (event) => {
  const target = event.target.closest("[data-read]");
  if (!target) return;
  const course = courses.find((item) => item.id === target.dataset.read);
  if (!course) return;
  event.preventDefault();
  openReader(course);
});

document.querySelector("[data-close]").addEventListener("click", () => reader.close());
reader.addEventListener("close", () => { frame.src = "about:blank"; });
reader.addEventListener("click", (event) => {
  if (event.target === reader) reader.close();
});

initialize();
