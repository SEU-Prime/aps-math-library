# APS 数学课程资料库

一个无需构建步骤的静态课程目录，收录 14 门 APS 数学面试双语讲义。每门课程包含编译后的 PDF、对应的 LaTeX 源文件和用于目录预览的首页缩略图。

## 本地预览

在 PowerShell 中从本目录启动预览服务器：

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

浏览器打开 `http://localhost:8000`。也可以使用任意静态 HTTP 服务器。不要直接用 `file://` 打开，因为课程目录通过 `fetch` 读取 `courses.json`。

## 发布到 GitHub Pages

将本目录推送到 GitHub 的 `main` 分支后，`.github/workflows/pages.yml` 会自动构建并部署网站。首次部署完成后，可在仓库的 **Settings → Pages** 查看访问地址。

页面是纯静态文件，不依赖 Node.js 或第三方 CDN。公开仓库会让讲义 PDF 和 TeX 源文件对所有人可访问。

## 目录结构

- `index.html`、`styles.css`、`app.js`：课程目录、筛选、搜索和 PDF 阅读器。
- `courses.json`：课程范围、简介及材料链接。
- `materials/<课程代号>/`：各课程 PDF、TeX 源文件和封面缩略图。

本仓库仅包含 APS 复习讲义，不包含原始教材、原始 APS 素材或课程原始课件。
