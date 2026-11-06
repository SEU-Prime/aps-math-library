async function initializeReadingPage() {
  const pathParts = decodeURIComponent(window.location.pathname).split("/").filter(Boolean);
  const courseId = pathParts[pathParts.length - 2];
  const response = await fetch("../../courses.json");
  if (!response.ok) throw new Error(`Course list request failed: ${response.status}`);
  const courses = await response.json();
  const course = courses.find((item) => item.id === courseId);
  if (!course) throw new Error(`Unknown course: ${courseId}`);

  document.title = `${course.title} | APS 数学课程资料库`;
  const bar = document.createElement("header");
  bar.className = "reading-bar";
  const back = document.createElement("a");
  back.className = "reading-back";
  back.href = "../../index.html";
  back.textContent = "← 课程目录";
  const title = document.createElement("strong");
  title.className = "reading-title";
  title.textContent = `${course.title} · ${course.subtitle}`;
  const scope = document.createElement("span");
  scope.className = "reading-scope";
  scope.textContent = `${course.scope} · ${course.pages} 页`;
  bar.append(back, title, scope);
  document.body.prepend(bar);

  const pages = [...document.querySelectorAll('div[id^="page"][id$="-div"]')];
  const pageStack = document.createElement("main");
  pageStack.className = "reading-pages";
  pages[0]?.before(pageStack);
  pages.forEach((page) => {
    page.classList.add("reading-page");
    page.querySelectorAll('img[alt="background image"]').forEach((image) => {
      image.alt = "";
      image.setAttribute("aria-hidden", "true");
    });
    pageStack.append(page);
  });

  const resizePages = () => {
    pages.forEach((page) => {
      const pageWidth = Number.parseFloat(page.style.width) || 595;
      const scale = Math.min(1, Math.max(0.45, (document.documentElement.clientWidth - 24) / pageWidth));
      page.style.zoom = String(scale);
    });
  };
  resizePages();
  window.addEventListener("resize", resizePages, { passive: true });
}

initializeReadingPage().catch((error) => {
  const message = document.createElement("p");
  message.className = "reading-error";
  message.textContent = `讲义页面无法载入：${error.message}`;
  document.body.prepend(message);
});
