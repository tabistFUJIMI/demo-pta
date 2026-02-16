// お知らせデータストア (localStorage)
const NEWS_KEY = 'demo_pta_news';

const SEED_NEWS = [
  {
    id: '1',
    title: 'PTA公式ホームページを開設しました',
    body: 'ふじみDXラボ小学校PTAの公式ホームページを開設いたしました。今後、お知らせや活動報告を掲載してまいります。',
    category: 'お知らせ',
    status: 'published',
    createdAt: '2026-02-10T09:00:00',
    updatedAt: '2026-02-10T09:00:00',
  },
  {
    id: '2',
    title: '3月のPTA役員会のお知らせ',
    body: '3月12日(木) 19:00より、多目的室にてPTA役員会を開催いたします。議題：来年度の役員選出、卒業を祝う会の準備について。',
    category: '連絡',
    status: 'published',
    createdAt: '2026-02-05T09:00:00',
    updatedAt: '2026-02-05T09:00:00',
  },
  {
    id: '3',
    title: 'ベルマーク集計結果のお知らせ',
    body: '12月までのベルマーク集計が完了しました。合計32,500点。一輪車2台の購入を予定しています。ご協力ありがとうございました。',
    category: 'お知らせ',
    status: 'published',
    createdAt: '2026-01-15T09:00:00',
    updatedAt: '2026-01-15T09:00:00',
  },
];

const NewsStore = {
  _cache: null,

  async init() {
    try {
      const res = await fetch('data/news.json');
      if (res.ok) {
        this._cache = await res.json();
        return;
      }
    } catch (e) { /* fetch失敗時はlocalStorageフォールバック */ }
    this._cache = null;
  },

  _getAll() {
    if (this._cache) return [...this._cache];
    const raw = localStorage.getItem(NEWS_KEY);
    if (!raw) {
      localStorage.setItem(NEWS_KEY, JSON.stringify(SEED_NEWS));
      return [...SEED_NEWS];
    }
    return JSON.parse(raw);
  },

  getPublished() {
    return this._getAll()
      .filter(n => n.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getAll() {
    return this._getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById(id) {
    return this._getAll().find(n => n.id === id) || null;
  },

  save(item) {
    const all = this._getAll();
    const now = new Date().toISOString();
    if (item.id) {
      const idx = all.findIndex(n => n.id === item.id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...item, updatedAt: now };
      }
    } else {
      item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      item.createdAt = now;
      item.updatedAt = now;
      item.status = item.status || 'published';
      all.push(item);
    }
    localStorage.setItem(NEWS_KEY, JSON.stringify(all));
    return item;
  },

  delete(id) {
    const all = this._getAll().filter(n => n.id !== id);
    localStorage.setItem(NEWS_KEY, JSON.stringify(all));
  },
};

if (typeof module !== 'undefined') module.exports = NewsStore;
