---
title: CSS 学习笔记：CSS 选择器
date: 2018-11-15
tags: ["CSS", "学习笔记"]
categories: ["前端"]
excerpt: >
  CSS 学习笔记：基础选择器包括通用选择器、元素选择器、类选择器和 ID 选择器。
---

## CSS 选择器

记录 CSS 选择器的基础知识。

### 基础选择器

CSS 提供了多种基础选择器用于选取 HTML 元素：

- **通用选择器** (`*`) — 选取所有元素
- **元素选择器** (`element`) — 选取指定标签的所有元素
- **类选择器** (`.class`) — 选取指定 class 的所有元素
- **ID 选择器** (`#id`) — 选取指定 id 的唯一元素

### 示例

```css
/* 通用选择器 */
* {
  margin: 0;
  padding: 0;
}

/* 元素选择器 */
p {
  color: #333;
  line-height: 1.6;
}

/* 类选择器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ID 选择器 */
#header {
  background: #fff;
  position: sticky;
  top: 0;
}
```

> 第四次提交 — 2018 年 11 月 15 日
