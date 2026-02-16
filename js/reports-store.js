// 活動報告データストア (localStorage)
const REPORTS_KEY = 'demo_pta_reports';

const SEED_REPORTS = [
  {
    id: '1',
    title: '夏祭りを開催しました',
    date: '2025-07-20',
    body: '今年も恒例の夏祭りを開催しました。模擬店5店舗、参加者約200名で大いに盛り上がりました。',
    image: 'images/activity-gym.jpg',
    status: 'published',
    createdAt: '2025-07-22T09:00:00',
    updatedAt: '2025-07-22T09:00:00',
  },
  {
    id: '2',
    title: '交通安全教室レポート',
    date: '2025-06-15',
    body: '富士警察署の協力のもと、交通安全教室を実施しました。親子120組が参加し、横断歩道の渡り方や自転車の乗り方を学びました。',
    image: '',
    status: 'published',
    createdAt: '2025-06-17T09:00:00',
    updatedAt: '2025-06-17T09:00:00',
  },
  {
    id: '3',
    title: '花壇整備ボランティア',
    date: '2025-05-10',
    body: '春の花壇整備を実施しました。保護者15名が参加し、チューリップとパンジーを植えました。',
    image: 'images/activity-garden.jpg',
    status: 'published',
    createdAt: '2025-05-12T09:00:00',
    updatedAt: '2025-05-12T09:00:00',
  },
];

const ReportsStore = {
  _cache: null,

  async init() {
    try {
      const res = await fetch('data/reports.json');
      if (res.ok) {
        this._cache = await res.json();
        return;
      }
    } catch (e) { /* fetch失敗時はlocalStorageフォールバック */ }
    this._cache = null;
  },

  _getAll() {
    if (this._cache) return [...this._cache];
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(SEED_REPORTS));
      return [...SEED_REPORTS];
    }
    return JSON.parse(raw);
  },

  getPublished() {
    return this._getAll()
      .filter(r => r.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getAll() {
    return this._getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById(id) {
    return this._getAll().find(r => r.id === id) || null;
  },

  save(item) {
    const all = this._getAll();
    const now = new Date().toISOString();
    if (item.id) {
      const idx = all.findIndex(r => r.id === item.id);
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
    localStorage.setItem(REPORTS_KEY, JSON.stringify(all));
    return item;
  },

  delete(id) {
    const all = this._getAll().filter(r => r.id !== id);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(all));
  },
};

if (typeof module !== 'undefined') module.exports = ReportsStore;
