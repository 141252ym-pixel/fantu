// ========== UI 模块 ==========
const UI = {
  els: {},

  init() {
    // 缓存元素
    this.els = {
      topName: document.getElementById('top-name'),
      topRealm: document.getElementById('top-realm'),
      hpFill: document.getElementById('hp-fill'),
      hpVal: document.getElementById('hp-val'),
      xpFill: document.getElementById('xp-fill'),
      xpVal: document.getElementById('xp-val'),
      resStone: document.getElementById('res-stone'),
      resFame: document.getElementById('res-fame'),
      resDao: document.getElementById('res-dao'),
      sceneTitle: document.getElementById('scene-title'),
      sceneText: document.getElementById('scene-text'),
      actionArea: document.getElementById('action-area'),
      battleOverlay: document.getElementById('battle-overlay'),
      enemyName: document.getElementById('enemy-name'),
      enemyHpFill: document.getElementById('enemy-hp-fill'),
      enemyHpVal: document.getElementById('enemy-hp-val'),
      battleLog: document.getElementById('battle-log'),
      battleActions: document.getElementById('battle-actions'),
      sidePanel: document.getElementById('side-panel'),
      panelMask: document.getElementById('panel-mask'),
      statDetail: document.getElementById('stat-detail'),
      linggenDetail: document.getElementById('linggen-detail'),
      statTotal: document.getElementById('stat-total'),
      bagList: document.getElementById('bag-list'),
      achievementList: document.getElementById('achievement-list'),
      saveStatus: document.getElementById('save-status'),
      toast: document.getElementById('toast'),
      gachaOverlay: document.getElementById('gacha-overlay'),
      gachaRarity: document.getElementById('gacha-rarity'),
      gachaIcon: document.getElementById('gacha-icon'),
      gachaName: document.getElementById('gacha-name'),
      gachaDesc: document.getElementById('gacha-desc'),
      gachaTenOverlay: document.getElementById('gacha-ten-overlay'),
      gachaTenList: document.getElementById('gacha-ten-list'),
      loginOverlay: document.getElementById('login-overlay'),
      loginName: document.getElementById('login-name'),
      loginContinue: document.getElementById('login-continue'),
      redeemInput: document.getElementById('redeem-input'),
      redeemResult: document.getElementById('redeem-result'),
      dailySignin: document.getElementById('daily-signin'),
      dailyTasks: document.getElementById('daily-tasks'),
    };
    this.updateStats();
  },

  // ========== 登录界面 ==========
  showLogin() {
    const saved = loadGame();
    this.els.loginContinue.classList.toggle('hidden', !saved);
    this.els.loginName.value = saved ? (saved.name || '') : '';
    this.els.loginOverlay.classList.remove('hidden');
    setTimeout(() => this.els.loginName.focus(), 0);
  },

  loginStart() {
    let name = this.els.loginName.value.trim();
    if (!name) name = '无名';
    this.els.loginOverlay.classList.add('hidden');
    startNewGame(name);
  },

  loginContinue() {
    this.els.loginOverlay.classList.add('hidden');
    continueGame();
  },

  // ========== 场景渲染 ==========
  renderScene(node) {
    if (!node) return;
    const s = Game.state;

    // 先隐藏战斗
    if (!Game.battle) {
      this.els.battleOverlay.classList.add('hidden');
    }

    this.els.sceneTitle.textContent = node.title || '';

    // 文本（支持\n换行）
    const text = getNodeText(node);
    const paragraphs = text.split('\n').filter(p => p.trim());
    this.els.sceneText.innerHTML = '';
    paragraphs.forEach(p => {
      const div = document.createElement('p');
      // 简单处理 <b> 标签
      if (p.includes('<b')) {
        div.innerHTML = p;
      } else {
        div.textContent = p;
      }
      this.els.sceneText.appendChild(div);
    });

    // 滚回顶部
    this.els.sceneText.scrollTop = 0;

    // 选项
    this.els.actionArea.innerHTML = '';

    // 如果是商店节点
    if (node.shop) {
      this.renderShop(node.shop);
      return;
    }

    // 如果是合成坊节点
    if (node.craft) {
      this.renderCraft();
      return;
    }

    // 如果是炼丹炉节点
    if (node.alchemy) {
      this.renderAlchemy();
      return;
    }

    // 如果是灵兽谷节点
    if (node.tame) {
      this.renderTame();
      return;
    }

    // 如果是抽卡节点
    if (node.gacha) {
      this.renderGacha();
      return;
    }

    // 如果是战斗节点
    if (node.battle) {
      this.startBattle(node);
      return;
    }

    // 存在延迟自动跳转（随机遭遇等）时，不渲染选项，等待跳转
    if (Game.delayedTimer) {
      this.updateStats();
      return;
    }

    // 普通选项
    const choices = node.choices || [];
    choices.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.className = 'ink-btn';
      btn.textContent = c.label;

      // 检查需求
      if (c.req && !c.req(Game.state)) {
        btn.classList.add('disabled');
        btn.disabled = true;
        btn.textContent = c.label + ' （条件不足）';
      }

      btn.addEventListener('click', () => {
        playClickSound();
        if (c.action) c.action(Game.state);
        if (c.next) goToNode(c.next);
      });
      this.els.actionArea.appendChild(btn);
    });

    this.updateStats();
  },

  // ========== 商店 ==========
  renderShop(shop) {
    const s = Game.state;
    shop.items.forEach(it => {
      const item = ITEMS[it.id];
      if (!item) return;
      const btn = document.createElement('button');
      btn.className = 'ink-btn';
      btn.textContent = `${item.name} （${it.price}灵石）`;
      btn.addEventListener('click', () => {
        if (s.stone >= it.price) {
          s.stone -= it.price;
          grantItem(s, it.id, 1);
          UI.showToast(`购得 ${item.name}`);
          UI.updateStats();
          autoSave();
        } else {
          UI.showToast('灵石不足');
        }
      });
      this.els.actionArea.appendChild(btn);
    });
    const backBtn = document.createElement('button');
    backBtn.className = 'ink-btn';
    backBtn.textContent = '返回';
    backBtn.addEventListener('click', () => goToNode(shop.back));
    this.els.actionArea.appendChild(backBtn);
  },

  // ========== 合成坊 ==========
  renderCraft() {
    const s = Game.state;
    this.els.actionArea.innerHTML = '';
    RECIPES.forEach(r => {
      const costDesc = Object.keys(r.cost).map(id => `${ITEMS[id] ? ITEMS[id].name : id}×${r.cost[id]}`).join('、');
      const canCraft = Object.keys(r.cost).every(id => (s.bag[id] || 0) >= r.cost[id]);
      const btn = document.createElement('button');
      btn.className = 'ink-btn';
      btn.textContent = `${r.icon} ${r.name}（${costDesc}）`;
      if (!canCraft) {
        btn.classList.add('disabled');
        btn.disabled = true;
        btn.textContent += ' （材料不足）';
      }
      btn.addEventListener('click', () => {
        playClickSound();
        if (craftItem(r.id)) {
          UI.renderCraft();
          UI.updateBag();
          UI.updateStats();
        }
      });
      this.els.actionArea.appendChild(btn);
    });
    const backBtn = document.createElement('button');
    backBtn.className = 'ink-btn';
    backBtn.textContent = '返回';
    backBtn.addEventListener('click', () => goToNode('fangshi'));
    this.els.actionArea.appendChild(backBtn);
  },

  // ========== 炼丹炉 ==========
  renderAlchemy() {
    const s = Game.state;
    this.els.actionArea.innerHTML = '';
    ALCHEMY_RECIPES.forEach(r => {
      const costDesc = Object.keys(r.cost).map(id => `${ITEMS[id] ? ITEMS[id].name : id}×${r.cost[id]}`).join('、');
      const canAlchemy = Object.keys(r.cost).every(id => (s.bag[id] || 0) >= r.cost[id]);
      const btn = document.createElement('button');
      btn.className = 'ink-btn';
      btn.textContent = `${r.icon} ${r.name}（${costDesc}）`;
      if (!canAlchemy) {
        btn.classList.add('disabled');
        btn.disabled = true;
        btn.textContent += ' （材料不足）';
      }
      btn.addEventListener('click', () => {
        playClickSound();
        if (alchemy(r.id)) {
          UI.renderAlchemy();
          UI.updateBag();
          UI.updateStats();
        }
      });
      this.els.actionArea.appendChild(btn);
    });
    const tip = document.createElement('div');
    tip.className = 'gacha-pity';
    tip.textContent = '炼丹结果随机，投入越珍贵的材料，越有机会炼出上等丹药。';
    this.els.actionArea.appendChild(tip);
    const backBtn = document.createElement('button');
    backBtn.className = 'ink-btn';
    backBtn.textContent = '返回';
    backBtn.addEventListener('click', () => goToNode('fangshi'));
    this.els.actionArea.appendChild(backBtn);
  },

  // ========== 灵兽谷（灵宠转盘抽奖） ==========
  renderTame() {
    const s = Game.state;
    const el = this.els.actionArea;
    el.innerHTML = '';

    // 保底信息
    const pity = document.createElement('div');
    pity.className = 'gacha-pity';
    const sinceShen = s.petSinceShen || 0;
    pity.textContent = `已抽 ${s.petGachaCount || 0} 抽 · 距神品保底 ${Math.max(0, PET_GACHA_PITY - sinceShen)} 抽`;
    el.appendChild(pity);

    // 概率表
    const info = document.createElement('div');
    info.className = 'gacha-info';
    PET_GACHA_POOL.forEach(t => {
      const span = document.createElement('span');
      span.className = 'gacha-rate';
      span.style.color = t.color;
      span.textContent = `${t.rarity} ${t.weight}%`;
      info.appendChild(span);
    });
    el.appendChild(info);

    // 喂养道具数量
    const food = document.createElement('div');
    food.className = 'gacha-pity';
    food.textContent = `喂养道具：🥩 兽粮 ×${s.bag.shouliang || 0}　💊 灵兽丹 ×${s.bag.lingshou_dan || 0}`;
    el.appendChild(food);

    // 当前出战灵宠
    const cur = document.createElement('div');
    cur.className = 'gacha-pity';
    const equipped = getEquippedPet(s);
    if (equipped) {
      const pet = PETS[equipped.id];
      const lv = equipped.level || 1;
      const b = pet.base, g = pet.growth;
      cur.innerHTML = `
        <div style="font-size:30px">${pet.icon}</div>
        <div style="color:${pet.qc};font-weight:bold;font-size:17px">出战中：${pet.name} <span style="color:#ccc;font-size:13px">· ${pet.quality}</span></div>
        <div style="color:#aaa;font-size:12px">等级 ${lv} · ${pet.desc}</div>
        <div style="color:#ddd;font-size:12px;margin-top:4px">物攻+${b.atk + g.atk * (lv - 1)} 法攻+${b.matk + g.matk * (lv - 1)} 物抗+${b.def + g.def * (lv - 1)} 法抗+${b.mdef + g.mdef * (lv - 1)} 穿透+${b.pen + g.pen * (lv - 1)}</div>
        <div style="color:#ffd54f;font-size:12px;margin-top:4px">技能【${pet.skill}】：战斗中有 ${Math.round(pet.skillChance * 100)}% 概率追加伤害</div>
      `;
    } else {
      cur.innerHTML = '尚未拥有灵宠，抽一只助你征战吧！';
    }
    el.appendChild(cur);

    // 宠物背包列表
    if (s.pets.length > 0) {
      const title = document.createElement('div');
      title.className = 'pane-title';
      title.style.marginTop = '4px';
      title.textContent = `灵宠背包（${s.pets.length}只）`;
      el.appendChild(title);

      s.pets.forEach(p => {
        const pet = PETS[p.id];
        const lv = p.level || 1;
        const isEquipped = s.pet === p.id;
        const row = document.createElement('div');
        row.className = 'bag-item';
        row.innerHTML = `
          <div class="item-icon">${pet.icon}</div>
          <div class="item-info">
            <div class="item-name" style="color:${pet.qc}">${pet.name} <span style="color:#7a6a4a;font-size:11px">${pet.quality} · ${lv}级${isEquipped ? ' · 出战中' : ''}</span></div>
            <div class="item-desc">${pet.desc}</div>
          </div>
          <div class="item-actions">
            ${!isEquipped ? `<button class="item-use" data-act="equip" data-id="${p.id}">出战</button>` : ''}
            <button class="item-str" data-act="feed" data-id="${p.id}">喂食</button>
            <button class="item-sell" data-act="release" data-id="${p.id}">放生</button>
          </div>
        `;
        el.appendChild(row);
      });

      // 绑定宠物操作：出战 / 喂食 / 放生
      el.querySelectorAll('button[data-act]').forEach(b => {
        b.addEventListener('click', () => {
          playClickSound();
          const id = b.dataset.id;
          const act = b.dataset.act;
          if (act === 'equip') equipPet(id);
          else if (act === 'feed') feedPet(id);
          else if (act === 'release') releasePet(id);
          this.renderTame();
          this.updateStats();
        });
      });
    }

    // 抽一次
    const btn = document.createElement('button');
    btn.className = 'ink-btn';
    btn.textContent = `🐾 抽灵宠（${PET_GACHA_COST}灵石）`;
    btn.addEventListener('click', () => {
      playClickSound();
      const r = petGachaDraw();
      if (r) { this.showPetGachaResult(r); this.renderTame(); }
    });
    el.appendChild(btn);

    // 十连
    const tenBtn = document.createElement('button');
    tenBtn.className = 'ink-btn';
    tenBtn.textContent = `🐾 十连抽灵宠（${PET_GACHA_COST * 10}灵石）`;
    tenBtn.addEventListener('click', () => {
      playClickSound();
      const res = petGachaDrawTen();
      if (res) { this.showPetGachaTen(res); this.renderTame(); }
    });
    el.appendChild(tenBtn);

    const backBtn = document.createElement('button');
    backBtn.className = 'ink-btn';
    backBtn.textContent = '返回';
    backBtn.addEventListener('click', () => goToNode('fangshi'));
    el.appendChild(backBtn);
  },

  // 灵宠抽奖结果弹窗（复用藏宝阁转盘）
  showPetGachaResult(r) {
    this.els.gachaRarity.textContent = r.rarity;
    this.els.gachaRarity.style.color = r.color;
    this.els.gachaRarity.style.borderColor = r.color;
    if (r.type === 'item') {
      this.els.gachaIcon.textContent = r.item.icon;
      this.els.gachaName.textContent = r.item.name;
      this.els.gachaName.style.color = r.color;
      this.els.gachaDesc.textContent = `${r.item.desc}（已放入储物袋）`;
    } else {
      this.els.gachaIcon.textContent = r.pet.icon;
      this.els.gachaName.textContent = r.pet.name;
      this.els.gachaName.style.color = r.color;
      const b = r.pet.base;
      let extra = '';
      if (r.refund) extra = `<br>已拥有同名灵宠，转为 ${r.refund} 灵石`;
      else extra = `<br>已放入灵宠背包`;
      this.els.gachaDesc.innerHTML = `${r.pet.desc}<br>物攻+${b.atk} 法攻+${b.matk} 物抗+${b.def} 法抗+${b.mdef} 穿透+${b.pen}${extra}`;
    }
    this.els.gachaOverlay.classList.remove('hidden');
  },

  // 灵宠十连结果弹窗（复用藏宝阁十连）
  showPetGachaTen(res) {
    const list = this.els.gachaTenList;
    list.innerHTML = '';
    res.list.forEach(r => {
      const div = document.createElement('div');
      div.className = 'gacha-ten-item';
      div.style.color = r.color;
      if (r.type === 'item') div.textContent = `${r.item.icon}${r.item.name}`;
      else div.textContent = `${r.pet.icon}${r.pet.name}`;
      list.appendChild(div);
    });
    const tip = document.createElement('div');
    tip.className = 'gacha-ten-item';
    tip.style.color = '#e6d3a0';
    let msg = '全部奖励已放入背包';
    if (res.refund) msg += `，重复灵宠转 ${res.refund} 灵石`;
    tip.textContent = msg;
    list.appendChild(tip);
    this.els.gachaTenOverlay.classList.remove('hidden');
  },

  // ========== 侧边面板·灵宠 ==========
  renderPetPanel() {
    const s = Game.state;
    const el = document.getElementById('pet-panel');
    if (!el) return;
    if (!s.pets || s.pets.length === 0) {
      el.innerHTML = '<div class="pet-empty">尚未拥有灵宠，可前往坊市·灵兽谷抽取。</div>';
      return;
    }
    let html = `<div class="pet-level" style="color:#e6d3a0;text-align:center">喂养道具：🥩兽粮×${s.bag.shouliang || 0} 💊灵兽丹×${s.bag.lingshou_dan || 0}</div>`;
    s.pets.forEach(p => {
      const pet = PETS[p.id];
      const lv = p.level || 1;
      const b = pet.base, g = pet.growth;
      const isEquipped = s.pet === p.id;
      const feedCost = lv * 100;
      html += `
        <div class="pet-card">
          <div class="pet-icon">${pet.icon}</div>
          <div class="pet-name" style="color:${pet.qc}">${pet.name} <span style="color:#ccc">${pet.quality}</span>${isEquipped ? ' <span style="color:#ffd54f">·出战中</span>' : ''}</div>
          <div class="pet-level">等级 ${lv}</div>
          <div class="pet-desc">${pet.desc}</div>
          <div class="pet-stats">物攻+${b.atk + g.atk * (lv - 1)} 法攻+${b.matk + g.matk * (lv - 1)}<br>物抗+${b.def + g.def * (lv - 1)} 法抗+${b.mdef + g.mdef * (lv - 1)} 穿透+${b.pen + g.pen * (lv - 1)}</div>
          <div class="pet-skill">技能【${pet.skill}】：战斗中有 ${Math.round(pet.skillChance * 100)}% 概率追加伤害</div>
        </div>
        <div class="save-actions">
          ${!isEquipped ? `<button class="ink-btn" onclick="UI.equipPetFromPanel('${p.id}')">出战</button>` : ''}
          <button class="ink-btn" onclick="UI.feedPetFromPanel('${p.id}')">🍖 灵石喂养（${feedCost}）</button>
          <button class="ink-btn danger" onclick="UI.releasePetFromPanel('${p.id}')">放生</button>
        </div>
      `;
    });
    el.innerHTML = html;
  },

  equipPetFromPanel(id) {
    if (equipPet(id)) { this.renderPetPanel(); this.updateStats(); }
  },

  feedPetFromPanel(id) {
    if (feedPet(id)) { this.renderPetPanel(); this.updateStats(); }
  },

  releasePetFromPanel(id) {
    if (releasePet(id)) { this.renderPetPanel(); this.updateStats(); }
  },

  // ========== 抽卡（藏宝阁） ==========
  renderGacha() {
    const s = Game.state;
    const el = this.els.actionArea;
    el.innerHTML = '';

    // 抽数与保底
    const pity = document.createElement('div');
    pity.className = 'gacha-pity';
    const sinceXian = s.gachaSinceXian || 0;
    pity.textContent = `已抽 ${s.gachaCount || 0} 抽 · 距仙品保底 ${Math.max(0, GACHA_PITY - sinceXian)} 抽`;
    el.appendChild(pity);

    // 概率表
    const info = document.createElement('div');
    info.className = 'gacha-info';
    GACHA_POOL.forEach(t => {
      const span = document.createElement('span');
      span.className = 'gacha-rate';
      span.style.color = t.color;
      span.textContent = `${t.rarity} ${t.weight}%`;
      info.appendChild(span);
    });
    el.appendChild(info);

    // 单抽
    const btn = document.createElement('button');
    btn.className = 'ink-btn';
    btn.textContent = `抽一次（${GACHA_COST}灵石）`;
    btn.addEventListener('click', () => {
      playClickSound();
      const r = gachaDraw();
      if (r) { this.showGachaResult(r); this.renderGacha(); }
    });
    el.appendChild(btn);

    // 十连
    const tenBtn = document.createElement('button');
    tenBtn.className = 'ink-btn';
    tenBtn.textContent = `十连抽（${GACHA_COST * 10}灵石）`;
    tenBtn.addEventListener('click', () => {
      playClickSound();
      const rs = gachaDrawTen();
      if (rs) { this.showGachaTen(rs); this.renderGacha(); }
    });
    el.appendChild(tenBtn);

    const backBtn = document.createElement('button');
    backBtn.className = 'ink-btn';
    backBtn.textContent = '返回';
    backBtn.addEventListener('click', () => goToNode('fangshi'));
    el.appendChild(backBtn);
  },

  showGachaResult(r) {
    this.els.gachaRarity.textContent = r.rarity;
    this.els.gachaRarity.style.color = r.color;
    this.els.gachaRarity.style.borderColor = r.color;
    this.els.gachaIcon.textContent = r.item.icon;
    this.els.gachaName.textContent = r.count > 1 ? `${r.item.name} ×${r.count}` : r.item.name;
    this.els.gachaName.style.color = r.color;
    this.els.gachaDesc.textContent = r.item.desc;
    this.els.gachaOverlay.classList.remove('hidden');
  },

  closeGacha() {
    this.els.gachaOverlay.classList.add('hidden');
  },

  showGachaTen(results) {
    const list = this.els.gachaTenList;
    list.innerHTML = '';
    results.forEach(r => {
      const div = document.createElement('div');
      div.className = 'gacha-ten-item';
      div.style.color = r.color;
      div.textContent = `${r.item.icon}${r.item.name}${r.count > 1 ? ' ×' + r.count : ''}`;
      list.appendChild(div);
    });
    this.els.gachaTenOverlay.classList.remove('hidden');
  },

  closeGachaTen() {
    this.els.gachaTenOverlay.classList.add('hidden');
  },

  // ========== 战斗 ==========
  startBattle(node) {
    const s = Game.state;
    const b = node.battle;

    // 计算战斗属性（带装备）
    const origAtk = s.atk;
    const origDef = s.def;
    const origMatk = s.matk;
    const origMdef = s.mdef;
    const origPen = s.pen;
    s.atk = getTotalAtk(s);
    s.def = getTotalDef(s);
    s.matk = getTotalMatk(s);
    s.mdef = getTotalMdef(s);
    s.pen = getTotalPen(s);

    const winCb = () => {
      s.atk = origAtk;
      s.def = origDef;
      s.matk = origMatk;
      s.mdef = origMdef;
      s.pen = origPen;
      checkAchievements();
    };
    const loseCb = () => {
      s.atk = origAtk;
      s.def = origDef;
      s.matk = origMatk;
      s.mdef = origMdef;
      s.pen = origPen;
      // 战败恢复一些 HP（避免立刻又死）
      s.hp = Math.max(1, Math.floor(s.maxHp * 0.3));
    };
    const winNext = node.winNext;
    const loseNext = node.loseNext;

    const mult = b.mult || 1.0;

    startBattle(b.enemy, mult, winCb, loseCb, winNext, loseNext, b.tribulation, b.turns);

    // 显示战斗面板
    this.els.battleOverlay.classList.remove('hidden');

    // 更新一次
    this.updateBattle();
  },

  updateBattle() {
    if (!Game.battle) return;
    const e = Game.battle.enemy;
    const s = Game.state;

    this.els.enemyName.textContent = e.name;
    const hpPct = Math.max(0, (e.hp / e.maxHp) * 100);
    this.els.enemyHpFill.style.width = hpPct + '%';
    this.els.enemyHpVal.textContent = `${Math.max(0, e.hp)}/${e.maxHp}`;

    // 日志（用 DOM 文本节点注入，确保不会解析出 HTML/按钮文字）
    this.els.battleLog.innerHTML = '';
    Game.battle.log.forEach(l => {
      const div = document.createElement('div');
      div.className = 'log-' + l.type;
      div.textContent = l.text;
      this.els.battleLog.appendChild(div);
    });
    this.els.battleLog.scrollTop = this.els.battleLog.scrollHeight;

    // 按钮
    this.els.battleActions.innerHTML = '';
    if (!Game.battle.ended && Game.battle.turn === 'player') {
      // 选药子菜单：列出背包里拥有的回血丹药
      if (Game.battle.selectingPill) {
        const pills = [];
        for (const id in s.bag) {
          if (s.bag[id] > 0 && ITEMS[id] && ITEMS[id].type === 'pill' && ITEMS[id].healPct) {
            pills.push({ id, name: ITEMS[id].name, icon: ITEMS[id].icon, healPct: ITEMS[id].healPct, count: s.bag[id] });
          }
        }
        if (pills.length === 0) {
          const btn = document.createElement('button');
          btn.className = 'ink-btn disabled';
          btn.disabled = true;
          btn.textContent = '没有回血丹药';
          this.els.battleActions.appendChild(btn);
        } else {
          pills.forEach(p => {
            const btn = document.createElement('button');
            btn.className = 'ink-btn';
            btn.textContent = `${p.icon} ${p.name} ×${p.count}（回${Math.round(p.healPct * 100)}%）`;
            btn.addEventListener('click', () => {
              playClickSound();
              playerUsePill(p.id);
            });
            this.els.battleActions.appendChild(btn);
          });
        }
        const back = document.createElement('button');
        back.className = 'ink-btn';
        back.textContent = '返回';
        back.addEventListener('click', () => {
          playClickSound();
          Game.battle.selectingPill = false;
          UI.updateBattle();
        });
        this.els.battleActions.appendChild(back);
        this.updateStats();
        return;
      }

      const lg = LINGGEN[s.linggen];
      const actions = [
        { label: '普通攻击', action: () => playerAttack() },
        { label: lg.skill, action: () => playerSkill() },
        { label: '防御', action: () => playerDefend() },
        { label: '丹药（剩' + (MAX_PILLS_PER_BATTLE - (Game.battle.pillUsed || 0)) + '次）', action: () => playerOpenPill() },
        { label: '逃跑', action: () => playerFlee() },
      ];
      actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className = 'ink-btn';
        btn.textContent = a.label;
        btn.addEventListener('click', () => {
          playClickSound();
          a.action();
        });
        this.els.battleActions.appendChild(btn);
      });

      // 法宝按钮：装备了特效法宝（如混沌钟）才显示
      const specialId = s.equipment && s.equipment.weapon;
      if (specialId && ITEMS[specialId] && ITEMS[specialId].special) {
        const cd = (Game.battle.specialCd && Game.battle.specialCd[specialId]) || 0;
        const btn = document.createElement('button');
        btn.className = cd > 0 ? 'ink-btn disabled' : 'ink-btn';
        btn.disabled = cd > 0;
        btn.textContent = cd > 0 ? `法宝·${ITEMS[specialId].name}（冷却${cd}回合）` : `法宝·${ITEMS[specialId].name}`;
        btn.addEventListener('click', () => {
          playClickSound();
          playerUseSpecial(specialId);
        });
        this.els.battleActions.appendChild(btn);
      }
    }

    this.updateStats();
  },

  battleEnd(won, nextNodeId) {
    // 显示结果后自动跳转
    setTimeout(() => {
      Game.battle = null;
      this.updateStats();
      checkAchievements();
      autoSave();
      goToNode(nextNodeId);
    }, 1500);
  },

  // ========== 状态栏 ==========
  updateStats() {
    if (!Game.state) return;
    const s = Game.state;
    const realm = getRealmInfo();

    this.els.topName.textContent = s.name;
    this.els.topRealm.textContent = realm.name;

    const hpPct = (s.hp / s.maxHp) * 100;
    this.els.hpFill.style.width = hpPct + '%';
    this.els.hpVal.textContent = `${Math.floor(s.hp)}/${s.maxHp}`;

    const xpInfo = getXpToNext(s);
    const xpPct = Math.min(100, (xpInfo.cur / xpInfo.max) * 100);
    this.els.xpFill.style.width = xpPct + '%';
    this.els.xpVal.textContent = `${Math.floor(xpInfo.cur)}/${xpInfo.max}`;

    this.els.resStone.textContent = s.stone;
    this.els.resFame.textContent = s.fame;
    this.els.resDao.textContent = s.dao;
  },

  // ========== 侧边栏 ==========
  toggleSidePanel(tab) {
    const panel = this.els.sidePanel;
    const mask = this.els.panelMask;
    if (panel.classList.contains('open')) {
      this.closeSidePanel();
    } else {
      this.openSidePanel(tab);
    }
  },

  openSidePanel(tab) {
    this.els.sidePanel.classList.add('open');
    this.els.panelMask.classList.add('show');
    if (tab) this.switchSideTab(tab);
  },

  closeSidePanel() {
    this.els.sidePanel.classList.remove('open');
    this.els.panelMask.classList.remove('show');
  },

  switchSideTab(name) {
    document.querySelectorAll('.side-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === name);
    });
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === 'tab-' + name);
    });
    if (name === 'bag') this.updateBag('all');
    if (name === 'achievements') this.updateAchievements();
    if (name === 'pet') this.renderPetPanel();
    if (name === 'daily') this.renderDaily();
    if (name === 'save') this.updateSaveSlots();
  },

  // ========== 兑换码 ==========
  redeem() {
    const res = redeemCode(this.els.redeemInput.value);
    this.els.redeemResult.textContent = res.msg;
    this.els.redeemResult.className = 'redeem-result ' + (res.ok ? 'ok' : 'fail');
    this.showToast(res.msg);
    if (res.ok) {
      this.els.redeemInput.value = '';
      this.updateStats();
    }
  },

  // ========== 每日签到与日常 ==========
  renderDaily() {
    refreshDaily();
    const s = Game.state;
    if (!s) return;
    const si = s.signIn || { lastDate: '', streak: 0, total: 0 };
    const signed = si.lastDate === getTodayStr();

    let html = '<div class="daily-streak">已连续签到 <b>' + si.streak + '</b> 天 · 累计 ' + (si.total || 0) + ' 天</div>';
    html += '<div class="daily-week">';
    const todayIdx = signed ? ((si.streak - 1) % 7) + 1 : (si.streak % 7) + 1;
    SIGNIN_REWARDS.forEach((r, i) => {
      const day = i + 1;
      let desc = '灵石' + r.stone;
      if (r.item) desc += ' ' + (ITEMS[r.item.id] ? ITEMS[r.item.id].name : '') + '×' + r.item.count;
      html += '<div class="daily-cell' + (day === todayIdx ? ' today' : '') + '">'
        + '<div class="daily-day">' + day + '天</div>'
        + '<div class="daily-reward">' + desc + '</div>'
        + '</div>';
    });
    html += '</div>';
    html += signed
      ? '<button class="ink-btn daily-sign-btn" disabled>今日已签到</button>'
      : '<button class="ink-btn daily-sign-btn" onclick="UI.signInClick()">立即签到</button>';
    this.els.dailySignin.innerHTML = html;

    let taskHtml = '';
    DAILY_TASKS.forEach(t => {
      const done = (s.daily.tasks[t.key] || 0) >= 1;
      const claimed = !!s.daily.claimed[t.key];
      let rewardDesc = '';
      if (t.reward.stone) rewardDesc += '灵石×' + t.reward.stone;
      if (t.reward.xp) rewardDesc += (rewardDesc ? '、' : '') + '修为×' + t.reward.xp;
      let stateHtml;
      if (claimed) stateHtml = '<span class="daily-claimed">已领取</span>';
      else if (done) stateHtml = '<button class="ink-btn" onclick="UI.claimDaily(\'' + t.key + '\')">领取</button>';
      else stateHtml = '<span class="daily-undone">未完成</span>';
      taskHtml += '<div class="daily-task">'
        + '<div class="daily-task-name">' + t.name + ' <span class="daily-task-reward">（' + rewardDesc + '）</span></div>'
        + '<div class="daily-task-state">' + stateHtml + '</div>'
        + '</div>';
    });
    this.els.dailyTasks.innerHTML = taskHtml;
  },

  signInClick() {
    const res = signIn();
    this.showToast(res.msg);
    this.renderDaily();
    this.updateStats();
  },

  claimDaily(key) {
    const res = claimDailyTask(key);
    this.showToast(res.msg);
    this.renderDaily();
    this.updateStats();
  },

  // ========== 背包 ==========
  updateBag(cat = 'all') {
    const s = Game.state;
    if (!s) return;
    let items = [];
    for (const id in s.bag) {
      if (s.bag[id] > 0 && ITEMS[id]) {
        const it = ITEMS[id];
        if (cat === 'all' || it.type === cat) {
          items.push({ id, ...it, count: s.bag[id] });
        }
      }
    }
    if (items.length === 0) {
      this.els.bagList.innerHTML = '<div style="text-align:center;color:#7a6a4a;padding:20px;">空空如也</div>';
      return;
    }
    this.els.bagList.innerHTML = '';
    items.forEach(item => {
      const equipped = s.equipment.weapon === item.id || s.equipment.armor === item.id;
      const lv = (s.equipLevel && s.equipLevel[item.id]) || 0;
      const usable = item.type === 'weapon' || item.type === 'pill'
        || !!((item.type === 'material' || item.type === 'misc') && item.effect);

      const div = document.createElement('div');
      div.className = 'bag-item';
      let nameStyle = '';
      if (item.rarity) {
        const tier = GACHA_POOL.find(t => t.rarity === item.rarity);
        if (tier) nameStyle = ` style="color:${tier.color}"`;
      }
      div.innerHTML = `
        <span class="item-icon">${item.icon}</span>
        <div class="item-info">
          <div class="item-name"${nameStyle}>${item.name}${equipped && lv > 0 ? ` +${lv}` : ''}</div>
          <div class="item-desc">${item.desc}${item.sell ? ` · 售价${item.sell}灵石` : ''}</div>
        </div>
        <div class="item-count">×${item.count}</div>
      `;

      const actions = document.createElement('div');
      actions.className = 'item-actions';

      const useBtn = document.createElement('button');
      useBtn.className = 'item-use';
      if (item.type === 'weapon') {
        useBtn.textContent = equipped ? '卸下' : '装备';
      } else if (usable) {
        useBtn.textContent = '使用';
      } else {
        useBtn.textContent = '查看';
        useBtn.disabled = true;
        useBtn.style.opacity = '0.5';
      }
      useBtn.addEventListener('click', () => {
        playClickSound();
        useItem(item.id);
        UI.updateBag(cat);
        UI.updateStats();
        UI.renderStatDetail();
      });
      actions.appendChild(useBtn);

      // 强化按钮（仅装备中的武器/防具）
      if (equipped && item.type === 'weapon') {
        const strBtn = document.createElement('button');
        strBtn.className = 'item-str';
        strBtn.textContent = lv > 0 ? `强化 +${lv}` : '强化';
        if (lv >= EQUIP_MAX_LEVEL) {
          strBtn.disabled = true;
          strBtn.style.opacity = '0.4';
        }
        strBtn.addEventListener('click', () => {
          playClickSound();
          if (strengthenItem(item.id)) {
            UI.updateBag(cat);
            UI.updateStats();
            UI.renderStatDetail();
          }
        });
        actions.appendChild(strBtn);
      }

      const sellBtn = document.createElement('button');
      sellBtn.className = 'item-sell';
      sellBtn.textContent = '出售';
      if (!item.sell || item.sell <= 0 || equipped) {
        sellBtn.disabled = true;
        sellBtn.style.opacity = '0.4';
      }
      sellBtn.addEventListener('click', () => {
        playClickSound();
        if (sellItem(item.id)) {
          UI.updateBag(cat);
          UI.updateStats();
          UI.renderStatDetail();
        }
      });
      actions.appendChild(sellBtn);

      div.appendChild(actions);
      this.els.bagList.appendChild(div);
    });
  },

  // ========== 成就 ==========
  updateAchievements() {
    const s = Game.state;
    this.els.achievementList.innerHTML = '';
    ACHIEVEMENTS.forEach(ach => {
      const done = s.achievements && s.achievements.includes(ach.id);
      const div = document.createElement('div');
      div.className = 'ach-item' + (done ? ' done' : ' locked');
      div.innerHTML = `
        <div class="ach-icon">${ach.icon}</div>
        <div class="ach-info">
          <div class="ach-name">${ach.name}</div>
          <div class="ach-desc">${ach.desc}</div>
        </div>
      `;
      this.els.achievementList.appendChild(div);
    });
  },

  // ========== 存档面板 ==========
  updateSaveSlots() {
    this.els.saveStatus.textContent = '';
  },

  saveToSlot(slot) {
    saveGame(slot);
    this.els.saveStatus.textContent = `存档 ${slot} 已保存`;
    this.showToast('保存成功');
  },

  loadFromSlot(slot) {
    const data = loadGame(slot);
    if (!data) {
      this.els.saveStatus.textContent = `存档 ${slot} 为空`;
      this.showToast('无存档');
      return;
    }
    Game.state = data;
    migratePets(Game.state);
    goToNode(Game.state.nodeId || 'start');
    this.els.saveStatus.textContent = `已读取存档 ${slot}`;
    this.showToast('读档成功');
    this.closeSidePanel();
  },

  resetAll() {
    if (!confirm('确定要删除所有存档重新开始吗？此操作不可恢复。')) return;
    resetGame();
    this.closeSidePanel();
  },

  // ========== Toast ==========
  showToast(msg) {
    const el = this.els.toast;
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      el.classList.add('hidden');
    }, 2000);
  },
};

// 在 stats tab 打开时更新详情
// 监听 panel 打开事件来更新
const _origOpenSidePanel = UI.openSidePanel;
UI.openSidePanel = function(tab) {
  _origOpenSidePanel.call(UI, tab);
  if (tab === 'stats') UI.renderStatDetail();
};

UI.renderStatDetail = function() {
  const s = Game.state;
  if (!s) return;
  const realm = getRealmInfo();
  const xp = getXpToNext(s);
  const totalAtk = getTotalAtk(s);
  const totalDef = getTotalDef(s);
  const totalMatk = getTotalMatk(s);
  const totalMdef = getTotalMdef(s);
  const totalPen = getTotalPen(s);

  this.els.statDetail.innerHTML = `
    <div class="stat-line"><span class="label">境界</span><span class="value">${realm.name}</span></div>
    <div class="stat-line"><span class="label">修为</span><span class="value">${xp.cur}/${xp.max}</span></div>
    <div class="stat-line"><span class="label">气血</span><span class="value">${Math.floor(s.hp)}/${s.maxHp}</span></div>
    <div class="stat-line"><span class="label">物攻</span><span class="value">${totalAtk}</span></div>
    <div class="stat-line"><span class="label">法攻</span><span class="value">${totalMatk}</span></div>
    <div class="stat-line"><span class="label">物抗</span><span class="value">${totalDef}</span></div>
    <div class="stat-line"><span class="label">法抗</span><span class="value">${totalMdef}</span></div>
    <div class="stat-line"><span class="label">穿透</span><span class="value">${totalPen}</span></div>
    <div class="stat-line"><span class="label">灵石</span><span class="value">${s.stone}</span></div>
    <div class="stat-line"><span class="label">名望</span><span class="value">${s.fame}</span></div>
    <div class="stat-line"><span class="label">道韵</span><span class="value">${s.dao}</span></div>
  `;

  const lg = LINGGEN[s.linggen];
  this.els.linggenDetail.innerHTML = `
    <div class="lg-name" style="color:${lg.color}">${lg.name}</div>
    <div class="lg-skill">天赋灵技：${lg.skill}</div>
    <div class="lg-desc">${lg.desc}</div>
  `;

  const st = s.stats || {};
  this.els.statTotal.innerHTML = `
    <div class="stat-line"><span class="label">总胜场</span><span class="value">${st.battleWin || 0}</span></div>
    <div class="stat-line"><span class="label">总败场</span><span class="value">${st.battleLoss || 0}</span></div>
    <div class="stat-line"><span class="label">连胜</span><span class="value">${st.winStreak || 0}</span></div>
    <div class="stat-line"><span class="label">击杀</span><span class="value">${st.enemiesKilled || 0}</span></div>
    <div class="stat-line"><span class="label">成就</span><span class="value">${(s.achievements || []).length}/${ACHIEVEMENTS.length}</span></div>
  `;
};

// ========== 音效占位 ==========
function playClickSound() {
  // 轻量静音占位，需要时可加 WebAudio
}
