// メインJS: スクロールアニメーション、ヘッダー制御、動的コンテンツ
document.addEventListener('DOMContentLoaded', async () => {
  // --- Store Init ---
  const inits = [];
  if (typeof NewsStore !== 'undefined' && NewsStore.init) inits.push(NewsStore.init());
  if (typeof EventsStore !== 'undefined' && EventsStore.init) inits.push(EventsStore.init());
  if (typeof ReportsStore !== 'undefined' && ReportsStore.init) inits.push(ReportsStore.init());
  await Promise.all(inits);

  // --- Scroll Header ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('header--scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // --- Mobile Menu ---
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-open');
      nav.classList.toggle('is-open');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        nav.classList.remove('is-open');
      });
    });
  }

  // --- Scroll Reveal ---
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // --- Re-observe helper ---
  function reobserve(container) {
    container.querySelectorAll('.reveal').forEach(el => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.1 });
      obs.observe(el);
    });
  }

  // --- Dynamic News (Top page) ---
  const newsList = document.getElementById('news-list');
  if (newsList && typeof NewsStore !== 'undefined') {
    const news = NewsStore.getPublished().slice(0, 5);
    newsList.innerHTML = news.map(n => {
      const date = new Date(n.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
      const tagClass = n.category === '連絡' ? 'tag-contact' : 'tag-info';
      return `<li>
        <a href="news.html?id=${n.id}">
          <span class="news-date">${date}</span>
          <span class="news-tag ${tagClass}">${n.category}</span>
          <span class="news-text">${n.title}</span>
        </a>
      </li>`;
    }).join('');
  }

  // --- Dynamic Events Table (Top page) ---
  const eventsList = document.getElementById('events-list');
  if (eventsList && typeof EventsStore !== 'undefined') {
    const events = EventsStore.getPublished();
    eventsList.innerHTML = `
      <table class="events-table">
        <thead>
          <tr><th>月</th><th>行事名</th><th>内容</th></tr>
        </thead>
        <tbody>
          ${events.map(e => `
            <tr class="reveal">
              <td class="events-month">${e.month}</td>
              <td class="events-name">${e.name}</td>
              <td class="events-desc">${e.description}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    reobserve(eventsList);
  }

  // --- Dynamic Reports Cards (Top page) ---
  const reportsList = document.getElementById('reports-list');
  if (reportsList && typeof ReportsStore !== 'undefined') {
    const reports = ReportsStore.getPublished();
    reportsList.innerHTML = '<div class="report-cards">' + reports.map(r => {
      const imgHtml = r.image
        ? `<div class="report-card-img"><img src="${r.image}" alt="${r.title}" loading="lazy"></div>`
        : `<div class="report-card-noimg">&#128247;</div>`;
      return `
        <div class="report-card reveal">
          ${imgHtml}
          <div class="report-card-body">
            <h3 class="report-card-title">${r.title}</h3>
            <p class="report-card-date">${r.date}</p>
            <p class="report-card-summary">${r.body}</p>
          </div>
        </div>
      `;
    }).join('') + '</div>';
    reobserve(reportsList);
  }
});
