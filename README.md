# APS 数学课程资料库

一个无需构建步骤的静态课程网站，收录 14 门 APS 数学面试双语讲义。课程卡片提供代表公式预览；每门课程有独立 HTML 阅读页，页面直接呈现讲义文字和公式，无需打开或下载 PDF。

## 本地预览

在 PowerShell 中从本目录启动预览服务器：

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

浏览器打开 `http://localhost:8000`。也可以使用任意静态 HTTP 服务器。不要直接用 `file://` 打开，因为课程目录通过 `fetch` 读取 `courses.json`。

## 发布到 GitHub Pages

公开仓库会由 `.github/workflows/pages.yml` 自动部署到 GitHub Pages。当前仓库为 Private，GitHub API 已返回当前账号计划不支持该私有仓库的 Pages，因此部署工作流会跳过；可在本地预览，或在具备 Pages 权限后启用在线托管。

页面是纯静态文件，不依赖 Node.js；目录卡片上的代表公式由 MathJax CDN 排版，因此公式预览需要联网。课程阅读页由讲义 PDF 转换为可选择、可搜索的 HTML 文字页面。公开仓库会让讲义和源文件对所有人可访问。

## 目录结构

- `index.html`、`styles.css`、`app.js`：课程目录、筛选、搜索和公式预览。
- `reader.css`、`reader.js`：HTML 讲义阅读页的版式和导航。
- `courses.json`：课程范围、简介及材料链接。
- `materials/<课程代号>/`：各课程 PDF、TeX 源文件和封面缩略图。

本仓库仅包含 APS 复习讲义，不包含原始教材、原始 APS 素材或课程原始课件。
