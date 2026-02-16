// 年間行事データストア (localStorage)
const EVENTS_KEY = 'demo_pta_events';

const SEED_EVENTS = [
  { id: '1', month: '4月', name: 'PTA総会', description: '年度活動計画・予算の承認', status: 'published' },
  { id: '2', month: '6月', name: '交通安全教室', description: '親子参加型の交通安全講習', status: 'published' },
  { id: '3', month: '7月', name: '夏祭り', description: '校庭での模擬店、盆踊り', status: 'published' },
  { id: '4', month: '10月', name: '運動会サポート', description: 'テント設営、受付、誘導', status: 'published' },
  { id: '5', month: '12月', name: 'もちつき大会', description: '地域のお年寄りと交流', status: 'published' },
  { id: '6', month: '2月', name: '卒業を祝う会', description: '6年生への感謝の会', status: 'published' },
];

const EventsStore = {
  _cache: null,

  async init() {
    try {
      const res = await fetch('data/events.json');
      if (res.ok) {
        this._cache = await res.json();
        return;
      }
    } catch (e) { /* fetch失敗時はlocalStorageフォールバック */ }
    this._cache = null;
  },

  _getAll() {
    if (this._cache) return [...this._cache];
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(SEED_EVENTS));
      return [...SEED_EVENTS];
    }
    return JSON.parse(raw);
  },

  getPublished() {
    return this._getAll().filter(e => e.status === 'published');
  },

  getAll() {
    return this._getAll();
  },

  getById(id) {
    return this._getAll().find(e => e.id === id) || null;
  },

  save(item) {
    const all = this._getAll();
    if (item.id) {
      const idx = all.findIndex(e => e.id === item.id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...item };
      }
    } else {
      item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      item.status = item.status || 'published';
      all.push(item);
    }
    localStorage.setItem(EVENTS_KEY, JSON.stringify(all));
    return item;
  },

  delete(id) {
    const all = this._getAll().filter(e => e.id !== id);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(all));
  },
};

if (typeof module !== 'undefined') module.exports = EventsStore;
