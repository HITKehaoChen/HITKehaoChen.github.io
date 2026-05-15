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
