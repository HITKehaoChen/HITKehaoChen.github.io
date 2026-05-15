// Content data - Add your weekly posts and articles here
const postsData = [
  // ---------- AI 周刊 ----------
  {
    type: 'weekly',
    title: '周刊 #1：AI 周报模板',
    date: '2025-05-15',
    slug: 'weekly-01',
    content: `# 周刊 #1：AI 周报

> 记录本周 AI 领域值得关注的事件和思考。

## 本周头条

### 值得关注的动态

## 工具推荐

## 我的看法

## 文章推荐

- [链接标题](https://example.com)
`,
  },
  // ---------- 博客文章 ----------
  {
    type: 'post',
    title: '个人站搭建记：从零到上线',
    date: '2025-05-15',
    slug: 'site-launch',
    content: `# 个人站搭建记：从零到上线

这个网站终于上线了。记录一下它是怎么来的，以及接下来要做的事。

## 为什么做这个站？

一直想有个自己的地方，整理 AI 相关的信息和自己的一些实践经验。公众号、知乎这些平台都好，但终究是别人的地盘——内容怎么写、排版怎么弄、会不会被限流，都不由自己决定。

自己的站，自己说了算。

## 怎么搭的

我提了个需求：**简单、周刊+博客、极简优雅**。然后小艺 Claw 帮我弄了全程：

**1. 选方案**
- 纯静态站点，零后端，零数据库
- 免费托管在 GitHub Pages
- 极简设计，没有多余框架

**2. 建站**
- 手写 HTML + CSS + JS，没有任何框架依赖
- 深色字体、留白排版、Inter + Noto Sans SC 字体组合
- 支持 Markdown 写文章（虽然前端做了简单渲染）
- 自动路由——所有文章内容维护在 JS 数据里

**3. 上线**
- git 推送到 GitHub
- 开启 Pages 服务
- 2 分钟后就能访问了

整个从提需求到上线，大概半小时。

## 还缺什么？（TODO）

站虽然上线了，但还缺不少东西，记录在这里：

### 🔧 功能层面
- **RSS 订阅** —— 应该加，方便别人订阅周刊
- **搜索功能** —— 文章多了以后需要站内搜索
- **评论区** —— 考虑用 GitHub Issues 或 Giscus 做轻量评论
- **标签/分类** —— 现在只有周刊和博客两大类，细分不够

### 📝 内容层面
- **第一份 AI 周刊**还空着模板等填内容
- **个人介绍**页在 about 里，后续可以更丰富
- **文章 SEO**还没优化（meta description、og:image 等）

### 🛠 技术优化
- 当前是 SPA 式的客户端路由，SEO 不太友好
- 后续可以考虑迁移到 Hugo，自动生成静态页面
- CI/CD 还没配，现在是手动推送

## 写在最后

这是第一篇文章，也是这个站点的一个起点。接下来会保持每周更新 AI 周刊，不定期写写技术实践和经验总结。

如果你有什么想法想交流，[GitHub](https://github.com/HITKehaoChen) 上找我。
`,
  },
];

// ---------- 页面路由逻辑 ----------
function initRouter() {
  const path = location.pathname;

  if (path === '/' || path === '/index.html') {
    renderHome();
  } else if (path.startsWith('/weekly/')) {
    const slug = path.replace('/weekly/', '').replace(/\/$/, '');
    if (slug) renderPost(slug, 'weekly');
    else renderList('weekly', 'AI 周刊', '/weekly/');
  } else if (path.startsWith('/posts/')) {
    const slug = path.replace('/posts/', '').replace(/\/$/, '');
    if (slug) renderPost(slug, 'post');
    else renderList('post', '博客文章', '/posts/');
  }
}

function renderHome() {
  const weeklyList = document.getElementById('weekly-list');
  const postList = document.getElementById('post-list');
  if (!weeklyList || !postList) return;

  const weekly = postsData.filter(p => p.type === 'weekly').reverse();
  const posts = postsData.filter(p => p.type === 'post').reverse();

  weekly.slice(0, 5).forEach(p => {
    weeklyList.appendChild(createPostItem(p));
  });

  posts.slice(0, 5).forEach(p => {
    postList.appendChild(createPostItem(p));
  });
}

function createPostItem(post) {
  const prefix = post.type === 'weekly' ? '/weekly/' : '/posts/';
  const a = document.createElement('a');
  a.className = 'post-item';
  a.href = `${prefix}${post.slug}/`;

  const title = document.createElement('span');
  title.className = 'post-title';
  title.textContent = post.title;

  const date = document.createElement('span');
  date.className = 'post-date';
  date.textContent = post.date;

  a.appendChild(title);
  a.appendChild(date);
  return a;
}

function renderList(type, title, basePath) {
  const items = postsData.filter(p => p.type === type).reverse();
  const main = document.querySelector('main');
  if (!main) return;

  main.innerHTML = `
    <div class="post-page">
      <h1>${title}</h1>
      <div class="post-list" style="margin-top:32px">
        ${items.map(p => `
          <a href="${basePath}${p.slug}/" class="post-item">
            <span class="post-title">${p.title}</span>
            <span class="post-date">${p.date}</span>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

function renderPost(slug, type) {
  const post = postsData.find(p => p.slug === slug && p.type === type);
  const main = document.querySelector('main');
  if (!main) {
    document.body.innerHTML = '<main class="container post-page"><p>文章未找到</p></main>';
    return;
  }

  if (!post) {
    main.innerHTML = '<div class="container post-page"><p>文章未找到</p></div>';
    return;
  }

  // Simple markdown to HTML (basic)
  const html = simpleMarkdown(post.content);

  main.innerHTML = `
    <article class="post-page">
      <h1>${post.title}</h1>
      <div class="post-meta">${post.date}</div>
      <div class="post-content">${html}</div>
    </article>
  `;
}

function simpleMarkdown(md) {
  let html = md
    // Headers
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Blockquote
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    // Bold & italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    // Horizontal rule
    .replace(/^---$/gm, '<hr>')
    // Line breaks - paragraphs
    .replace(/\n\n/g, '</p><p>');

  // Wrap in paragraphs (but not for block-level elements)
  html = '<p>' + html + '</p>';
  
  // Clean up nested paragraph around block elements
  html = html.replace(/<p><blockquote>/g, '<blockquote>');
  html = html.replace(/<\/blockquote><\/p>/g, '</blockquote>');
  html = html.replace(/<p><h([1-6])>/g, '<h$1>');
  html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
  html = html.replace(/<p><hr>/g, '<hr>');
  html = html.replace(/<hr><\/p>/g, '<hr>');
  html = html.replace(/<p><(ul|ol)>/g, '<$1>');
  html = html.replace(/<\/(ul|ol)><\/p>/g, '</$1>');
  html = html.replace(/<p><(li|pre)>/g, '<$1>');

  return html;
}

// Init
document.addEventListener('DOMContentLoaded', initRouter);
