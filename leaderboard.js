// ========== 天机榜 · 全球排行榜 ==========
// 后端为 Supabase（建表脚本见 supabase-setup.sql）。
// 前端不直连数据表，只调 fantu_submit / fantu_board 两个数据库函数，
// 数值上限、写入频率、成绩归属都由服务端把关。
//
// 设计约定：
//   · 所有人默认上榜：没填过榜单昵称时，沿用当前道号作为默认名（可随时改名）
//   · 上传是覆盖式 upsert ⇒ 离线时只留最新一份快照，不需要队列
//   · 战斗过程中 s.atk 会被临时改写成总攻击，此时跳过上传，避免战力翻倍

const LB = {
  // Supabase 项目（141252ym-pixel's Org / 141252ym-pixel's Project，region ca-central-1）
  URL: 'https://dgiowdcjffatfxygicnn.supabase.co',
  KEY: 'sb_publishable_FZ_wxRod-lcpj3cy0XJTpQ_J0vLR7Eq',
  // 这个 publishable key 设计上就是公开的：它对数据表没有任何权限（已实测 permission denied），
  // 只能调用 fantu_submit / fantu_board 两个函数，规则全在服务端。

  BOARDS: [
    { id: 'realm', name: '境界榜', hint: '以转世次数、境界、修为论道' },
    { id: 'power', name: '战力榜', hint: '以物攻法攻物抗法抗穿透之和论道' },
    { id: 'mijing', name: '秘境榜', hint: '以试炼秘境最高层数论道' },
    { id: 'fame', name: '名望榜', hint: '以名望高低论道' },
    { id: 'pet', name: '灵宠榜', hint: '以出战灵宠星级、等级论道' },
  ],

  SUBMIT_INTERVAL: 60000, // 本地上传节流（服务端另有 20 秒硬限制）
  TIMEOUT: 8000,

  _board: 'realm',
  _lastSig: '',
  _loading: false,

  // ---------- 小工具 ----------
  configured() {
    return this.URL.indexOf('http') === 0 && this.KEY.indexOf('PASTE_') !== 0;
  },

  ls(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { /* 隐私模式可能禁用存储 */ }
    return null;
  },

  lsDel(key) {
    try { localStorage.removeItem(key); } catch (e) { /* 同上 */ }
  },

  esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },

  // 大数字转「万 / 亿」，与游戏内其它数值展示习惯一致
  fmt(n) {
    n = Math.floor(Number(n) || 0);
    if (n >= 100000000) {
      const t = (n / 100000000).toFixed(2);
      return (t.endsWith('.00') ? t.slice(0, -3) : t) + '亿';
    }
    if (n >= 10000) {
      const t = (n / 10000).toFixed(1);
      return (t.endsWith('.0') ? t.slice(0, -2) : t) + '万';
    }
    return String(n);
  },

  realmName(idx) {
    try { return getRealm(Math.max(0, Number(idx) || 0)).name; } catch (e) { return '—'; }
  },

  boardHonor(board, rank) {
    const honors = {
      realm: ['\u4e07\u5883\u9053\u9b41', '\u767b\u4ed9\u4e9a\u5c0a', '\u95ee\u9053\u5b63\u541b'],
      power: ['\u6597\u6218\u65e0\u53cc', '\u7834\u519b\u4e9a\u5c0a', '\u9547\u5cb3\u5b63\u541b'],
      mijing: ['\u79d8\u5883\u9b41\u9996', '\u8e0f\u6e0a\u4e9a\u5c0a', '\u63a2\u5e7d\u5b63\u541b'],
      fame: ['\u58f0\u540d\u9707\u5bf0\u5b87', '\u540d\u626c\u5929\u4e0b\u60ca', '\u540d\u626c\u5929\u4e0b\u60ca'],
      pet: ['\u4e07\u7075\u4e4b\u4e3b', '\u5fa1\u7075\u4e9a\u5c0a', '\u7075\u5ba0\u5b63\u541b'],
    };
    return honors[board] ? (honors[board][rank - 1] || '') : '';
  },

  getNick() { return this.ls('fantu_lb_nick') || ''; },
  isOptOut() { return this.ls('fantu_lb_optout') === '1'; },
  isTestExcluded() {
    try { return !!(typeof Game !== 'undefined' && Game.state && Game.state.excludeFromRanking); }
    catch (e) { return false; }
  },

  // 取榜单名：玩家没手动改名时，沿用当前道号作为默认名，并固化下来避免每次重算
  resolveNick() {
    const saved = this.getNick();
    if (saved) return saved;
    let name = '';
    try { name = (typeof Game !== 'undefined' && Game.state && Game.state.name) || ''; } catch (e) { /* 忽略 */ }
    name = String(name || '').replace(/[<>]/g, '').trim().slice(0, 12);
    if (!name) name = '无名道友';
    this.ls('fantu_lb_nick', name);
    return name;
  },

  // ---------- 数据 ----------
  // 从当前存档提取一份可上传的快照
  snapshot() {
    const s = (typeof Game !== 'undefined') && Game.state;
    if (!s) return null;
    let realm = s.realmIndex;
    if (realm == null) { try { realm = getRealmIndex(s); } catch (e) { realm = 0; } }
    return {
      pid: getPlayerId(),
      nick: this.resolveNick(),
      realm: Math.max(0, Math.floor(realm || 0)),
      xp: Math.max(0, Math.floor(s.xp || 0)),
      power: this.calcPower(s),
      mijing: Math.max(0, Math.floor((s.mijing && s.mijing.best) || 0)),
      rein: Math.max(0, Math.floor(s.reincarnation || 0)),
      title: s.title || null,
      fame: Math.max(0, Math.floor(s.fame || 0)),
      pet: this.petSnap(s),
    };
  },

  // 灵宠榜快照：取等级最高的灵宠参评（平级比星级）
  petSnap(s) {
    try {
      const list = (s.pets || []).filter(p => p && PETS[p.id]);
      if (!list.length) return null;
      const best = list.slice().sort((a, b) =>
        (b.level || 1) - (a.level || 1) || (b.star || 0) - (a.star || 0)
      )[0];
      return { id: best.id, star: best.star || 1, level: best.level || 1 };
    } catch (e) { return null; }
  },

  calcPower(s) {
    try {
      return Math.max(0, Math.floor(
        getTotalAtk(s) + getTotalMatk(s) + getTotalDef(s) + getTotalMdef(s) + getTotalPen(s)
      ));
    } catch (e) { return 0; }
  },

  sig(snap) {
    if (!snap) return '';
    const p = snap.pet || {};
    return [snap.nick, snap.realm, snap.xp, snap.power, snap.mijing, snap.rein, snap.title, snap.fame,
            p.id || '', p.star || 0, p.level || 0].join('|');
  },

  stash(snap) { if (snap) this.ls('fantu_lb_pending', JSON.stringify(snap)); },
  unstash() { this.lsDel('fantu_lb_pending'); },

  // ---------- 网络 ----------
  async rpc(fn, body) {
    if (!this.configured()) throw new Error('unconfigured');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.TIMEOUT);
    try {
      const res = await fetch(this.URL.replace(/\/+$/, '') + '/rest/v1/rpc/' + fn, {
        method: 'POST',
        headers: {
          'apikey': this.KEY,
          'Authorization': 'Bearer ' + this.KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  },

  // 存档钩子：由 autoSave() 调用，绝大多数情况下会在这里直接返回
  onSave() {
    if (!this.configured()) return;
    if (this.isOptOut()) return;                                 // 已归隐，不再上传
    if (typeof Game === 'undefined' || !Game.state) return;
    if (Game.state.excludeFromRanking) return;                    // 策划测试存档不参与榜单
    if (Game.battle && !Game.battle.ended) return;                // 战斗中属性被临时改写
    const snap = this.snapshot();
    if (!snap || this.sig(snap) === this._lastSig) return;        // 数据没变化
    if (Date.now() - Number(this.ls('fantu_lb_last') || 0) < this.SUBMIT_INTERVAL) {
      this.stash(snap);                                           // 节流期内先攒着
      return;
    }
    this.submit(snap);
  },

  async submit(snap) {
    if (!this.configured()) return { ok: false, error: 'unconfigured' };
    if (this.isOptOut()) return { ok: false, error: 'optout' };
    if (typeof Game !== 'undefined' && Game.state && Game.state.excludeFromRanking) return { ok: false, error: 'excluded' };
    snap = snap || this.snapshot();
    if (!snap || !snap.nick) return { ok: false, error: 'no_nick' };
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.stash(snap);
      return { ok: false, error: 'offline' };
    }
    try {
      const res = await this.rpc('fantu_submit', {
        p_pid: snap.pid,
        p_secret: this.ls('fantu_lb_secret') || '',
        p_nick: snap.nick,
        p_realm: snap.realm,
        p_xp: snap.xp,
        p_power: snap.power,
        p_mijing: snap.mijing,
        p_rein: snap.rein,
        p_title: snap.title,
        p_fame: snap.fame,
        p_pet_id: (snap.pet && snap.pet.id) || '',
        p_pet_star: (snap.pet && snap.pet.star) || 0,
        p_pet_level: (snap.pet && snap.pet.level) || 0,
      });
      if (res && res.ok) {
        if (res.secret) this.ls('fantu_lb_secret', res.secret);
        if (!res.throttled) {
          this.ls('fantu_lb_last', String(Date.now()));
          this._lastSig = this.sig(snap);
        }
        this.unstash();
      }
      return res || { ok: false };
    } catch (e) {
      this.stash(snap);   // 网络问题：留到下次联网补传
      return { ok: false, error: 'network' };
    }
  },

  // 联网后补传：直接用当前最新数据，比暂存的快照更准
  async flushPending() {
    if (!this.configured()) return;
    if (!this.ls('fantu_lb_pending')) return;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
    await this.submit(this.snapshot());
  },

  // 归隐（退出榜单）：本地标记 + 删云端那一行。凭证保留到删除成功后再清。
  optOut() {
    const pid = getPlayerId();
    const secret = this.ls('fantu_lb_secret') || '';
    this.ls('fantu_lb_optout', '1');           // 先标记，立刻阻止后续任何上传
    this.lsDel('fantu_lb_pending');
    this._lastSig = '';
    if (!this.configured()) return;
    this.rpc('fantu_optout', { p_pid: pid, p_secret: secret }).then(res => {
      if (res && res.ok) this.lsDel('fantu_lb_secret');
    }).catch(() => { /* 联网失败下次启动重试 */ });
  },

  // 策划测试档：仅删除当前玩家的云端成绩，不写浏览器级「归隐」标记。
  // 这样读回普通存档后可正常重新参与天机榜，测试档本身仍可浏览所有榜单。
  excludeCurrentSave() {
    const pid = getPlayerId();
    const secret = this.ls('fantu_lb_secret') || '';
    this.lsDel('fantu_lb_pending');
    this._lastSig = '';
    this.ls('fantu_lb_test_exclude_pending', '1');
    if (!this.configured()) return;
    this.rpc('fantu_optout', { p_pid: pid, p_secret: secret }).then(res => {
      if (res && res.ok) {
        this.lsDel('fantu_lb_secret');
        this.lsDel('fantu_lb_test_exclude_pending');
        this.ls('fantu_lb_test_excluded_pid', pid);
      }
    }).catch(() => {});
  },

  // 读档后重新按“当前存档”判断资格，兼容旧版测试码遗留的浏览器级归隐标记。
  afterStateLoaded() {
    if (this.isTestExcluded()) {
      this.lsDel('fantu_lb_optout');
      this.lsDel('fantu_lb_pending');
      if (this.ls('fantu_lb_test_exclude_pending') === '1' || this.ls('fantu_lb_test_excluded_pid') !== getPlayerId()) {
        this.excludeCurrentSave();
      }
      return;
    }
    if (!this.isOptOut()) { this.onSave(); this.flushPending(); }
  },

  // ---------- 界面 ----------
  open() {
    const el = document.getElementById('lb-overlay');
    if (!el) return;
    el.classList.remove('hidden');
    this.syncTabs();
    this.load(true);
  },

  close() {
    const el = document.getElementById('lb-overlay');
    if (el) el.classList.add('hidden');
  },

  switchTab(board) {
    if (this._loading || board === this._board) return;
    this._board = board;
    this.syncTabs();
    this.load(false);
  },

  syncTabs() {
    const row = document.getElementById('lb-tabs');
    if (!row) return;
    row.querySelectorAll('.pet-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-board') === this._board);
    });
  },

  // submitFirst：打开榜单时顺便把自己的最新成绩推上去
  async load(submitFirst) {
    const body = document.getElementById('lb-body');
    const foot = document.getElementById('lb-foot');
    if (!body) return;

    if (!this.configured()) {
      body.innerHTML = '<div class="lb-hint">天机榜尚未开启，请稍候。</div>';
      if (foot) foot.innerHTML = '';
      return;
    }

    this._loading = true;
    body.innerHTML = '<div class="lb-hint">正在推演天机…</div>';
    if (foot) foot.innerHTML = '';

    try {
      if (submitFirst) await this.submit();
      const res = await this.rpc('fantu_board', { p_board: this._board, p_pid: getPlayerId() });
      if (!res || !res.ok) throw new Error('bad_response');
      this.renderList(res);
    } catch (e) {
      const offline = (typeof navigator !== 'undefined' && navigator.onLine === false);
      body.innerHTML = '<div class="lb-hint">' +
        (offline ? '当前离线，成绩会在联网后自动同步。' : '天机推演失败，请稍后再试。') +
        '</div><div class="lb-hint"><button class="ink-btn" onclick="LB.load(false)">重新推演</button></div>';
    } finally {
      this._loading = false;
    }
  },

  renderList(res) {
    const body = document.getElementById('lb-body');
    const foot = document.getElementById('lb-foot');
    const board = this._board;
    const myPid = getPlayerId();
    const testExcluded = this.isTestExcluded();
    const list = (res.top || []).filter(row => !testExcluded || row.player_id !== myPid);
    const me = testExcluded ? null : (res.me || null);

    if (!list.length) {
      body.innerHTML = '<div class="lb-hint">榜上无名，此刻天下修士皆未登榜。<br>你可以做第一个。</div>';
    } else {
      let html = '';
      list.forEach(row => {
        const rank = Number(row.rank) || 0;
        const rankCls = rank <= 3 ? ' lb-rank-' + rank : '';
        const isMe = row.player_id === myPid;
        const honor = this.boardHonor(board, rank);
        let main, sub;
        if (board === 'power') {
          main = this.fmt(row.power);
          sub = this.realmName(row.realm_index);
        } else if (board === 'mijing') {
          main = '第 ' + (Number(row.mijing_best) || 0) + ' 层';
          sub = this.realmName(row.realm_index);
        } else if (board === 'fame') {
          main = this.fmt(row.fame) + ' 名望';
          sub = this.realmName(row.realm_index);
        } else if (board === 'pet') {
          const pid = row.pet_id;
          const pet = (typeof PETS !== 'undefined' && PETS[pid]) ? PETS[pid] : null;
          main = (pet ? pet.icon + pet.name : (pid || '神秘灵宠')) + ' ★' + (Number(row.pet_star) || 0);
          sub = (Number(row.pet_level) || 0) + ' 级';
        } else {
          main = this.realmName(row.realm_index);
          sub = (Number(row.reincarnation) > 0 ? '转世 ' + row.reincarnation + ' 次' : '初世');
        }
        html += '<div class="lb-row' + (rank <= 3 ? ' lb-row-top lb-row-top-' + rank : '') + (isMe ? ' lb-me' : '') + '">' +
          '<span class="lb-rank' + rankCls + '">' + rank + '</span>' +
          '<span class="lb-name">' + this.esc(row.nickname) +
            (honor ? '<em class="lb-honor lb-honor-' + rank + '">' + this.esc(honor) + '</em>' : '') +
            (row.title ? '<em class="lb-title">' + this.esc(row.title) + '</em>' : '') +
          '</span>' +
          '<span class="lb-score">' + this.esc(main) + '<em class="lb-sub">' + this.esc(sub) + '</em></span>' +
        '</div>';
      });
      body.innerHTML = html;
    }

    if (!foot) return;
    if (this.isTestExcluded()) {
      foot.innerHTML = '<span class="lb-foot-txt">策划测试存档不参与排行，可正常查看天机榜</span>';
      return;
    }
    if (this.isOptOut()) {
      foot.innerHTML = '<span class="lb-foot-txt">你已归隐山林，不在天机榜之列</span>';
      return;
    }
    const total = Number(res.total) || 0;
    if (me) {
      foot.innerHTML = '<span class="lb-foot-txt">你的名次 <b class="lb-myrank">#' + (Number(me.rank) || 0) +
        '</b> / 共 ' + total + ' 位道友</span>' +
        '<button class="ink-btn" onclick="LB.openNick()">改名</button>';
    } else {
      foot.innerHTML = '<span class="lb-foot-txt">共 ' + total + ' 位道友在榜 · 你的成绩正在同步</span>' +
        '<button class="ink-btn" onclick="LB.openNick()">改名</button>';
    }
  },

  // ---------- 登榜昵称（自定义弹窗，不用原生 prompt） ----------
  openNick() {
    const el = document.getElementById('lb-nick-overlay');
    const input = document.getElementById('lb-nick-input');
    if (!el || !input) return;
    input.value = this.resolveNick();
    el.classList.remove('hidden');
    setTimeout(() => { try { input.focus(); input.select(); } catch (e) { /* 移动端可能拒绝 */ } }, 50);
  },

  closeNick() {
    const el = document.getElementById('lb-nick-overlay');
    if (el) el.classList.add('hidden');
  },

  async confirmNick() {
    const input = document.getElementById('lb-nick-input');
    if (!input) return;
    const nick = String(input.value || '').replace(/[<>]/g, '').trim().slice(0, 12);
    if (!nick) { UI.showToast('请先取个名号'); return; }

    this.ls('fantu_lb_nick', nick);
    this.closeNick();
    UI.showToast('正在更新名号…');

    const res = await this.submit();
    if (res && res.ok) {
      UI.showToast('名号已更新');
    } else if (res && res.error === 'offline') {
      UI.showToast('当前离线，联网后自动同步');
    } else if (res && res.error === 'bad_secret') {
      UI.showToast('更新失败，请联系作者');
    } else {
      UI.showToast('更新失败，稍后会自动重试');
    }
    this.load(false);
  },

  // ---------- 启动 ----------
  init() {
    if (!this.configured()) return;
    if (this.isTestExcluded()) return;
    if (this.isOptOut()) {
      // 已归隐：若上次云端删除没成功，用保留的凭证重试一次
      const secret = this.ls('fantu_lb_secret');
      if (secret) {
        this.rpc('fantu_optout', { p_pid: getPlayerId(), p_secret: secret }).then(res => {
          if (res && res.ok) this.lsDel('fantu_lb_secret');
        }).catch(() => {});
      }
      return;
    }
    // 打开游戏即推送一次：让从不点开榜单的玩家也能上榜（onSave 内部自带去重 + 节流）
    this.onSave();
    // 补传上次离线时攒下的成绩
    this.flushPending();
    window.addEventListener('online', () => this.flushPending());
  },
};

// const 声明不会挂到 window 上，这里显式导出，供 autoSave() 钩子与 HTML 的 onclick 使用
window.LB = LB;
