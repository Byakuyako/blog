---
title: 博客迁移复盘
date: 2026-05-22
tags: ["学习笔记"]
categories: [""]
---

## 一、背景

- **旧博客**：基于 Hexo 3.8.0 + Matery 主题，最后更新 2022-05
- **目标**：迁移到现代框架 + 自动化部署
- **最终选型**：Astro（最初考虑过 Next.js，后因学习成本和项目优先级选择放弃）

---

## 二、任务流程

| 步骤 | 内容         | 结果                                         |
| ---- | ------------ | -------------------------------------------- |
| 1    | 框架选型讨论 | 初始选 Next.js，后改成 Astro                 |
| 2    | 搭建项目骨架 | Astro 5 + Tailwind CSS + Content Collections |
| 3    | 创建页面     | 首页/文章/标签/分类/归档/关于/404 共 7 页    |
| 4    | 迁移旧文章   | 从 Hexo 生成 HTML 反提取内容 → Markdown      |
| 5    | 配置自动部署 | GitHub Actions → 构建并推送到 GitHub Pages   |
| 6    | 修复 CI 错误 | 逐个解决 4 个构建问题（见下文）              |
| 7    | 部署成功     | 博客已在 GitHub Pages 上线                   |

## 三、项目技术栈

```
Astro 5          — 静态站点框架（零 JS 默认输出）
Tailwind CSS 3   — 原子化 CSS
Content Collections — 类型安全的 Markdown 内容管理
GitHub Actions   — 自动构建 + 部署到 GitHub Pages
```

## 四、踩过的坑与解决方案

### 坑 1：`npm ci` 报错 — 缺少 lock file

**现象**：GitHub Actions 中 `npm ci` 失败，提示 `Dependencies lock file is not found`

**原因**：项目文件是手动创建的，没有 `package-lock.json`。`npm ci` 要求必须有锁文件。

**解决**：workflow 中 `npm ci` → `npm install`。

```diff
- run: npm ci
+ run: npm install
```

---

### 坑 2：`setup-node` 缓存失败

**现象**：改 `npm install` 后仍报 lock file 找不到。

**原因**：`actions/setup-node@v4` 的 `cache: npm` 在安装命令执行前就读取 lock file 计算缓存 key，找不到即报错。

**解决**：删除 `with.cache` 配置项。

```diff
  - uses: actions/setup-node@v4
    with:
      node-version: 22
-     cache: npm
```

---

### 坑 3：ESM 模块中 `require()` 不可用

**现象**：构建时 `require is not defined`

**原因**：`package.json` 声明 `"type": "module"`，项目运行在 ESM 模式。`tailwind.config.mjs` 中使用了 CommonJS 的 `require()`。

**解决**：改为 ESM `import`。

```diff
+ import typography from "@tailwindcss/typography";
+
  export default {
-   plugins: [require("@tailwindcss/typography")],
+   plugins: [typography],
  };
```

---

### 坑 4：Vite 不识别 `@/` 路径别名

**现象**：构建时报错 `Rollup failed to resolve import "@/layouts/BaseLayout.astro"`

**原因**：`tsconfig.json` 中的 `paths` 配置只对 TypeScript 类型检查生效，实际构建工具 Vite 不认识该别名。

**解决**：在 `astro.config.mjs` 中显式配置 `vite.resolve.alias`。

```js
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
});
```

---

### 坑 5：GitHub Actions Node.js 20 deprecation 警告

**现象**：Actions 日志中提示 Node.js 20 将在 2026-06-02 强制升级到 Node.js 24。

**解决**：workflow 中添加环境变量 `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`，同时 Node 版本升到 22。
