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
      mpFill: document.getElementById('mp-fill'),
      mpVal: document.getElementById('mp-val'),
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
      battlePlayerName: document.getElementById('battle-player-name'),
      battleHpFill: document.getElementById('battle-hp-fill'),
      battleHpVal: document.getElementById('battle-hp-val'),
      battleMpFill: document.getElementById('battle-mp-fill'),
      battleMpVal: document.getElementById('battle-mp-val'),
      battleStatus: document.getElementById('battle-status'),
      battlePlayerStats: document.getElementById('battle-player-stats'),
      battleEnemyStats: document.getElementById('battle-enemy-stats'),
      battleRecommend: document.getElementById('battle-recommend'),
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
      gachaHundredOverlay: document.getElementById('gacha-hundred-overlay'),
      gachaHundredList: document.getElementById('gacha-hundred-list'),
      gachaHundredTitle: document.getElementById('gacha-hundred-title'),
      batchSellConfirmOverlay: document.getElementById('batch-sell-confirm-overlay'),
      batchSellConfirmDesc: document.getElementById('batch-sell-confirm-desc'),
      bossLootOverlay: document.getElementById('boss-loot-overlay'),
      bossLootIcon: document.getElementById('boss-loot-icon'),
      bossLootName: document.getElementById('boss-loot-name'),
      bossLootBlessing: document.getElementById('boss-loot-blessing'),
      loginOverlay: document.getElementById('login-overlay'),
      loginName: document.getElementById('login-name'),
      loginContinue: document.getElementById('login-continue'),
      loginStart: document.getElementById('login-start'),
      loginTip: document.getElementById('login-tip'),
      redeemInput: document.getElementById('redeem-input'),
      redeemResult: document.getElementById('redeem-result'),
      dailySignin: document.getElementById('daily-signin'),
      dailyTasks: document.getElementById('daily-tasks'),
      loadoutSlots: document.getElementById('loadout-slots'),
      loadoutStats: document.getElementById('loadout-stats'),
      equipPickOverlay: document.getElementById('equip-pick-overlay'),
      equipPickTitle: document.getElementById('equip-pick-title'),
      equipPickList: document.getElementById('equip-pick-list'),
    };
    this.updateStats();
    updateSoundIcon();
    updateBgmIcon();
    // BGM 首次用户交互后自动播放（浏览器自动播放策略要求先有用户手势）。
    // 每次交互时若该播放却没在播放则重试，避免首次手势时音频尚未就绪、play() 被拒后永远没声音。
    // 除 pointerdown/keydown 外再兜底 click/touchstart：老版 iOS Safari 及部分 WebView 不支持 PointerEvent，
    // 此时音效(click 触发)能响而 BGM(仅 pointerdown 触发)会一直无声。
    const tryStartBgm = () => {
      if (!_bgmEnabled) return;
      const audio = getBgmAudio();
      if (!audio) return;
      // 音频曾加载失败时重载一次，避免一次网络抖动导致永久无声
      if (audio.error) { try { audio.load(); } catch (e) {} }
      if (audio.paused) startBgm();
    };
    ['pointerdown', 'keydown', 'click', 'touchstart'].forEach(evt =>
      document.addEventListener(evt, tryStartBgm)
    );
  },

  // ========== 登录界面 ==========
  showLogin() {
    const saved = loadGame();
    const has = !!saved;
    this.els.loginContinue.classList.toggle('hidden', !has);
    this.els.loginOverlay.classList.toggle('has-save', has);
    if (has) {
      const realm = saved.realmIndex != null ? getRealm(saved.realmIndex).name : '';
      this.els.loginContinue.textContent = `继续修炼 · ${saved.name || '无名'}（${realm}）`;
      this.els.loginStart.textContent = '重新开始';
      this.els.loginName.value = saved.name || '';
      this.els.loginTip.textContent = saved.savedAt ? `上次修炼 · ${this._formatSaveTime(saved.savedAt)}` : '道号将伴随你的整个仙途';
    } else {
      this.els.loginContinue.textContent = '继续上次修炼';
      this.els.loginStart.textContent = '踏入仙途';
      this.els.loginName.value = '';
      this.els.loginTip.textContent = '道号将伴随你的整个仙途';
    }
    this.els.loginOverlay.classList.remove('hidden');
    if (!has) setTimeout(() => this.els.loginName.focus(), 0);
  },

  loginStart() {
    let name = this.els.loginName.value.trim();
    if (!name) name = '无名';
    // 已有存档时二次确认，防止误点「踏入仙途」覆盖进度
    if (loadGame() && !confirm('检测到已有存档，重新开始会覆盖当前进度。\n确定要重新开始吗？')) {
      return;
    }
    this.els.loginOverlay.classList.add('hidden');
    startNewGame(name);
    this.maybeShowAnnounce();
  },

  loginContinue() {
    this.els.loginOverlay.classList.add('hidden');
    continueGame();
    this.maybeShowAnnounce();
  },

  // ========== 更新公告 ==========
  openAnnounce() {
    const list = document.getElementById('announce-list');
    if (list && Array.isArray(UPDATE_LOG)) {
      // 只默认展开最新一条，更早的公告折叠成标题行，点击标题可展开/收起
      // 玩家交流群二维码紧跟最新一条公告下方，随列表一起滚动，本身不折叠
      const qunHtml = `
        <div class="announce-qun">
          <div class="announce-qun-title">📱 道友交流群</div>
          <div class="announce-qun-desc">仙路漫漫，何不结伴同行？<br>遇 bug 或有高见，扫码入群共商大道。</div>
          <img class="announce-qun-img" src="qun-qr.jpg" alt="玩家交流群二维码">
        </div>
      `;
      list.innerHTML = UPDATE_LOG.map((u, i) => {
        const item = `
          <details class="announce-item" ${i === 0 ? 'open' : ''}>
            <summary class="announce-head">
              <span class="announce-title">${u.title}</span>
              <span class="announce-date">${u.date} · ${u.version}</span>
            </summary>
            <ul>${(u.items || []).map(t => `<li>${t}</li>`).join('')}</ul>
          </details>
        `;
        return i === 0 ? item + qunHtml : item;
      }).join('');
    }
    document.getElementById('announce-overlay').classList.remove('hidden');
  },

  closeAnnounce() {
    document.getElementById('announce-overlay').classList.add('hidden');
  },

  // ========== 藏宝阁图鉴 ==========
  openCodex() {
    const list = document.getElementById('codex-list');
    if (!list || !Array.isArray(GACHA_POOL)) return;
    list.innerHTML = GACHA_POOL.map(tier => {
      const rows = tier.items.map(entry => {
        const id = typeof entry === 'string' ? entry : entry.id;
        const count = typeof entry === 'string' ? 1 : entry.count;
        const it = ITEMS[id];
        if (!it) return '';
        const desc = (it.desc || '').replace(/^[^·]+·\s*/, '');
        return `
          <div class="codex-row">
            <span class="codex-icon">${it.icon}</span>
            <span class="codex-name" style="color:${tier.color}">${it.name}${count > 1 ? ` ×${count}` : ''}</span>
            <span class="codex-desc">${desc}</span>
          </div>
        `;
      }).join('');
      return `
        <div class="codex-tier">
          <div class="codex-tier-head">
            <span style="color:${tier.color}">${tier.rarity}</span>
            <span class="codex-weight">概率 ${tier.weight}%</span>
          </div>
          ${rows}
        </div>
      `;
    }).join('');
    document.getElementById('codex-overlay').classList.remove('hidden');
  },

  closeCodex() {
    document.getElementById('codex-overlay').classList.add('hidden');
  },

  // ========== 功法图鉴 ==========
  openGongfaCodex() {
    const list = document.getElementById('gongfa-codex-list');
    if (!list || !GONGFA) return;
    const grades = ['黄级', '玄级', '地级', '天级', '仙级', '神级'];
    const gradeColor = { '黄级': '#9aa0a6', '玄级': '#4caf50', '地级': '#4a90d9', '天级': '#9b59b6', '仙级': '#e6a23c', '神级': '#e0473c' };
    const learned = Game.state.gongfa || [];
    const gongfaArr = Object.values(GONGFA);

    // 宗门绝学：按宗门分组展示各派独门战斗技能（含宗门加成）
    const sectBlock = Object.values(SECTS).map(s => {
      const skills = gongfaArr.filter(g => g.combat && g.sect === s.id);
      if (!skills.length) return '';
      const rows = skills.map(g => {
        const has = learned.includes(g.id);
        return `
          <div class="codex-row" style="${has ? '' : 'opacity:.5;'}">
            <span class="codex-icon">${g.icon}</span>
            <span class="codex-name" style="color:${g.color}">${g.name}<span class="codex-tag codex-tag-active">主动</span>${has ? ' ✓' : ''}</span>
            <span class="codex-desc">${g.desc}</span>
          </div>
        `;
      }).join('');
      return `
        <div class="codex-tier">
          <div class="codex-tier-head">
            <span style="color:${s.color}">${s.icon} ${s.name}</span>
            <span class="codex-weight">绝学 ${skills.length} 式</span>
          </div>
          <div class="codex-desc" style="margin-bottom:6px;">${s.desc}</div>
          ${rows}
        </div>
      `;
    }).join('');

    // 功法全书：按品阶分组展示被动功法
    const gradeBlock = grades.map(grade => {
      const items = gongfaArr.filter(g => g.grade === grade && !g.combat);
      if (!items.length) return '';
      const rows = items.map(g => {
        const has = learned.includes(g.id);
        return `
          <div class="codex-row" style="${has ? '' : 'opacity:.5;'}">
            <span class="codex-icon">${g.icon}</span>
            <span class="codex-name" style="color:${g.color}">${g.name}<span class="codex-tag codex-tag-passive">被动</span>${has ? ' ✓' : ''}</span>
            <span class="codex-desc">${g.desc}</span>
          </div>
        `;
      }).join('');
      return `
        <div class="codex-tier">
          <div class="codex-tier-head">
            <span style="color:${gradeColor[grade]}">${grade}</span>
            <span class="codex-weight">共 ${items.length} 本</span>
          </div>
          ${rows}
        </div>
      `;
    }).join('');

    list.innerHTML = sectBlock + gradeBlock;
    document.getElementById('gongfa-codex-overlay').classList.remove('hidden');
  },

  closeGongfaCodex() {
    document.getElementById('gongfa-codex-overlay').classList.add('hidden');
  },

  // 每次上线自动弹出公告
  maybeShowAnnounce() {
    try { this.openAnnounce(); } catch (e) {}
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

    // 如果是洞府灵田
    if (node.cave) {
      this.renderCave();
      return;
    }

    // 如果是宗门任务
    if (node.sectTasks) {
      this.renderSectTasks();
      return;
    }

    // 如果是贡献商店
    if (node.sectShop) {
      this.renderSectShop();
      return;
    }

    // 如果是转换门派
    if (node.sectTransfer) {
      this.renderSectTransfer();
      return;
    }

    // 如果是竞技斗法挑战
    if (node.arena) {
      this.startArenaBattle(node);
      return;
    }

    // 如果是心魔事件
    if (node.xinmo) {
      this.renderXinmo();
      return;
    }

    // 如果是心魔战斗
    if (node.xinmoBattle) {
      this.startXinmoBattle(node);
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
      btn.textContent = typeof c.label === 'function' ? c.label(s) : c.label;

      // 检查需求
      if (c.req && !c.req(Game.state)) {
        btn.classList.add('disabled');
        btn.disabled = true;
        const label = typeof c.label === 'function' ? c.label(s) : c.label;
        btn.textContent = label + ' （条件不足）';
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

  // ========== 洞府经营 ==========
  renderCave() {
    const s = Game.state;
    const el = this.els.actionArea;
    el.innerHTML = '';
    const c = getCaveInfo(s);

    const info = document.createElement('div');
    info.className = 'gacha-pity';
    info.textContent = `洞府 ${c.level} 级 · 灵田 ${c.plots.length}/${c.maxPlots} 块 · 修炼加成 +${Math.round(c.xpBonus * 100)}%`;
    el.appendChild(info);

    c.plots.forEach((plot, i) => {
      const herb = HERBS[plot.herb];
      const remain = herb.growMs - (Date.now() - plot.plantedAt);
      const row = document.createElement('button');
      row.className = 'ink-btn';
      if (remain > 0) {
        const mins = Math.max(1, Math.ceil(remain / 60000));
        row.disabled = true;
        row.classList.add('disabled');
        row.textContent = `田${i + 1} · ${herb.icon} ${herb.name}（生长中，约 ${mins} 分钟）`;
      } else {
        row.textContent = `田${i + 1} · ${herb.icon} ${herb.name}（已成熟，点击收获）`;
        row.addEventListener('click', () => {
          playClickSound();
          const r = harvestPlot(s, i);
          UI.showToast(r.msg);
          UI.renderCave();
          UI.updateStats();
        });
      }
      el.appendChild(row);
    });

    if (c.plots.length < c.maxPlots) {
      const tip = document.createElement('div');
      tip.className = 'gacha-pity';
      tip.textContent = `还有 ${c.maxPlots - c.plots.length} 块灵田空闲，可选择灵药种植：`;
      el.appendChild(tip);
      for (const hid in HERBS) {
        const herb = HERBS[hid];
        const btn = document.createElement('button');
        btn.className = 'ink-btn';
        btn.textContent = `${herb.icon} 种${herb.name}（${herb.seed}灵石 · ${Math.round(herb.growMs / 60000)}分钟）`;
        btn.addEventListener('click', () => {
          playClickSound();
          const r = plantHerb(s, hid);
          UI.showToast(r.msg);
          UI.renderCave();
          UI.updateStats();
        });
        el.appendChild(btn);
      }
    }

    if (c.level < CAVE_LEVELS.length) {
      const next = CAVE_LEVELS[c.level];
      const up = document.createElement('button');
      up.className = 'ink-btn';
      up.textContent = `⬆ 升级洞府（${next.cost}灵石 → ${next.level}级，灵田+1，修炼加成+${Math.round(next.xpBonus * 100)}%）`;
      up.addEventListener('click', () => {
        playClickSound();
        const r = upgradeCave(s);
        UI.showToast(r.msg);
        UI.renderCave();
        UI.updateStats();
      });
      el.appendChild(up);
    } else {
      const tip = document.createElement('div');
      tip.className = 'gacha-pity';
      tip.textContent = '洞府已升至满级。';
      el.appendChild(tip);
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'ink-btn';
    backBtn.textContent = '返回';
    backBtn.addEventListener('click', () => goToNode('cave_home'));
    el.appendChild(backBtn);
  },

  // ========== 宗门任务 ==========
  renderSectTasks() {
    const s = Game.state;
    const el = this.els.actionArea;
    el.innerHTML = '';
    const info = document.createElement('div');
    info.className = 'gacha-pity';
    info.textContent = `当前贡献：${s.contribution || 0} 点`;
    el.appendChild(info);
    ['outer', 'inner'].forEach(tier => {
      const title = document.createElement('div');
      title.className = 'pane-title';
      title.textContent = tier === 'outer' ? '外门任务' : '内门任务';
      el.appendChild(title);
      SECT_TASKS.filter(task => task.tier === tier).forEach(task => {
      const btn = document.createElement('button');
      btn.className = 'ink-btn';
      let costDesc = '';
      if (task.cost && task.cost.item) {
        const it = ITEMS[task.cost.item];
        costDesc = `（需 ${it ? it.name : task.cost.item} ×${task.cost.count || 1}）`;
      }
      if (task.cost && task.cost.battle) costDesc = `（讨伐${ENEMIES[task.cost.enemy].name}）`;
      const locked = getRealmIndex(s) < (task.minRealm || 0);
      btn.textContent = `${task.icon} ${task.name} · 贡献+${task.reward}${costDesc}${locked ? `（需${getRealm(task.minRealm).name}）` : ''}`;
      if (locked) {
        btn.classList.add('disabled');
        btn.disabled = true;
      }
      btn.addEventListener('click', () => {
        playClickSound();
        if (task.cost && task.cost.battle) {
          startSectHunt(task.id);
        } else {
          const r = doSectTask(s, task.id);
          UI.showToast(r.msg);
          UI.renderSectTasks();
          UI.updateStats();
        }
      });
      el.appendChild(btn);
      });
    });
    const backBtn = document.createElement('button');
    backBtn.className = 'ink-btn';
    backBtn.textContent = '返回';
    backBtn.addEventListener('click', () => goToNode('sect_home'));
    el.appendChild(backBtn);
  },

  // ========== 贡献商店 ==========
  renderSectShop() {
    const s = Game.state;
    const el = this.els.actionArea;
    el.innerHTML = '';
    const info = document.createElement('div');
    info.className = 'gacha-pity';
    info.textContent = `当前贡献：${s.contribution || 0} 点`;
    el.appendChild(info);
    SECT_SHOP.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'ink-btn';
      btn.textContent = `${item.icon} ${item.name}（${item.cost}贡献）`;
      if ((s.contribution || 0) < item.cost) {
        btn.classList.add('disabled');
        btn.disabled = true;
        btn.textContent += ' （贡献不足）';
      }
      btn.addEventListener('click', () => {
        playClickSound();
        const r = buySectItem(s, item.id);
        UI.showToast(r.msg);
        UI.renderSectShop();
        UI.updateStats();
      });
      el.appendChild(btn);
    });
    const backBtn = document.createElement('button');
    backBtn.className = 'ink-btn';
    backBtn.textContent = '返回';
    backBtn.addEventListener('click', () => goToNode('sect_home'));
    el.appendChild(backBtn);
  },

  // ========== 竞技斗法 ==========
  startArenaBattle(node) {
    const s = Game.state;
    migrateMana(s);
    s.mp = s.maxMp;
    const origAtk = s.atk, origDef = s.def, origMatk = s.matk, origMdef = s.mdef, origPen = s.pen;
    s.atk = getTotalAtk(s);
    s.def = getTotalDef(s);
    s.matk = getTotalMatk(s);
    s.mdef = getTotalMdef(s);
    s.pen = getTotalPen(s);
    const winCb = () => { s.atk = origAtk; s.def = origDef; s.matk = origMatk; s.mdef = origMdef; s.pen = origPen; checkAchievements(); };
    const loseCb = () => { s.atk = origAtk; s.def = origDef; s.matk = origMatk; s.mdef = origMdef; s.pen = origPen; s.hp = Math.max(1, Math.floor(s.maxHp * 0.3)); };
    const opp = genArenaOpponent(s);
    const enemy = { id: 'arena', name: opp.name, maxHp: opp.hp, hp: opp.hp, atk: opp.atk, def: opp.def, matk: opp.matk, mdef: opp.mdef, pen: opp.pen, xp: 0, stoneMin: 0, stoneMax: 0, drops: [], fame: 0, boss: false, untouchable: false, tribDmg: 0.15 };
    Game.battle = { enemy, turn: 'player', log: [], winCallback: winCb, loseCallback: loseCb, winNext: 'arena_win', loseNext: 'arena_lose', ended: false, tribulation: false, turns: 0, turnCount: 0, pillUsed: 0, specialCd: {} };
    logBattle(`斗法台上，${enemy.name} 抱拳施礼。`, 'sys');
    this.els.battleOverlay.classList.remove('hidden');
    this.updateBattle();
  },

  // ========== 心魔试炼 ==========
  renderXinmo() {
    const el = this.els.actionArea;
    el.innerHTML = '';
    const ev = Game.currentXinmo;
    if (!ev) {
      const backBtn = document.createElement('button');
      backBtn.className = 'ink-btn';
      backBtn.textContent = '返回';
      backBtn.addEventListener('click', () => goToNode('xinmo_enter'));
      el.appendChild(backBtn);
      return;
    }
    ev.choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'ink-btn';
      btn.textContent = c.label;
      btn.addEventListener('click', () => {
        playClickSound();
        applyXinmoChoice(c.xinjing);
      });
      el.appendChild(btn);
    });
  },

  startXinmoBattle(node) {
    const s = Game.state;
    migrateMana(s);
    s.mp = s.maxMp;
    const origAtk = s.atk, origDef = s.def, origMatk = s.matk, origMdef = s.mdef, origPen = s.pen;
    s.atk = getTotalAtk(s);
    s.def = getTotalDef(s);
    s.matk = getTotalMatk(s);
    s.mdef = getTotalMdef(s);
    s.pen = getTotalPen(s);
    const winCb = () => { s.atk = origAtk; s.def = origDef; s.matk = origMatk; s.mdef = origMdef; s.pen = origPen; };
    const loseCb = () => { s.atk = origAtk; s.def = origDef; s.matk = origMatk; s.mdef = origMdef; s.pen = origPen; s.hp = Math.max(1, Math.floor(s.maxHp * 0.3)); };
    const factor = 0.85;
    const hp = Math.max(20, Math.floor(s.maxHp * factor));
    const atk = Math.max(1, Math.floor(getTotalAtk(s) * factor));
    const def = Math.max(0, Math.floor(getTotalDef(s) * factor));
    const matk = Math.max(1, Math.floor(getTotalMatk(s) * factor));
    const mdef = Math.max(0, Math.floor(getTotalMdef(s) * factor));
    const pen = Math.max(0, Math.floor(getTotalPen(s) * factor));
    const enemy = { id: 'xinmo', name: '心魔化身', maxHp: hp, hp, atk, def, matk, mdef, pen, xp: 0, stoneMin: 0, stoneMax: 0, drops: [], fame: 0, boss: false, untouchable: false, tribDmg: 0.15 };
    Game.battle = { enemy, turn: 'player', log: [], winCallback: winCb, loseCallback: loseCb, winNext: 'xinmo_battle_win', loseNext: 'xinmo_battle_lose', ended: false, tribulation: false, turns: 0, turnCount: 0, pillUsed: 0, specialCd: {} };
    logBattle(`心魔化身狞笑着扑来！`, 'sys');
    this.els.battleOverlay.classList.remove('hidden');
    this.updateBattle();
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

    const discountInfo = document.createElement('div');
    discountInfo.id = 'pet-gacha-discount-info';
    discountInfo.className = 'gacha-pity';
    el.appendChild(discountInfo);

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
      const stage = getPetStage(equipped);
      const trait = getPetTrait(equipped);
      cur.innerHTML = `
        <div style="font-size:30px">${pet.icon}</div>
        <div style="color:${pet.qc};font-weight:bold;font-size:17px">出战中：${pet.name} <span style="color:#ccc;font-size:13px">· ${pet.quality}</span></div>
        <div style="color:#aaa;font-size:12px">等级 ${lv}/${getPetMaxLevel(equipped)} · ${stage}阶 · ${pet.desc}</div>
        <div style="color:#ddd;font-size:12px;margin-top:4px">物攻+${getPetStatBonus(s, equipped, 'atk')} 法攻+${getPetStatBonus(s, equipped, 'matk')} 物抗+${getPetStatBonus(s, equipped, 'def')} 法抗+${getPetStatBonus(s, equipped, 'mdef')} 穿透+${getPetStatBonus(s, equipped, 'pen')}</div>
        <div style="color:#ffd54f;font-size:12px;margin-top:4px">技能【${pet.skill}】：${Math.round(getPetSkillChance(equipped) * 100)}% 概率追加伤害（单次不超过主人本次伤害50%，每10级进阶强化）</div>
        ${trait ? `<div style="color:#ffad66;font-size:12px;margin-top:4px">神品天赋【${trait.name}】：${trait.desc}（仅进阶强化）</div>` : ''}
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
        const isEquipped = s.pet === p.uid;
        const row = document.createElement('div');
        row.className = 'bag-item';
        row.innerHTML = `
          <div class="item-icon">${pet.icon}</div>
          <div class="item-info">
            <div class="item-name" style="color:${pet.qc}">${pet.name} <span style="color:#7a6a4a;font-size:11px">${pet.quality} · ${lv}级 · ${getPetStage(p)}阶${isEquipped ? ' · 出战中' : ''}</span></div>
            <div class="item-desc">${pet.desc}</div>
          </div>
          <div class="item-actions">
            ${!isEquipped ? `<button class="item-use" data-act="equip" data-id="${p.uid}">出战</button>` : ''}
            <button class="item-str" data-act="feed" data-id="${p.uid}">喂食</button>
            <button class="item-sell" data-act="release" data-id="${p.uid}">放生</button>
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
    btn.dataset.petGachaCount = '1';
    btn.addEventListener('click', () => {
      playClickSound();
      const r = petGachaDraw();
      // 抽取后只展示结果弹窗，避免重绘灵宠列表将抽取按钮挤位；新灵宠请在灵宠背包查看。
      if (r) { this.showPetGachaResult(r); this.refreshPetGachaDiscounts(); }
    });
    el.appendChild(btn);

    // 十连
    const tenBtn = document.createElement('button');
    tenBtn.className = 'ink-btn';
    tenBtn.dataset.petGachaCount = '10';
    tenBtn.addEventListener('click', () => {
      playClickSound();
      const res = petGachaDrawTen();
      if (res) { this.showPetGachaTen(res); this.refreshPetGachaDiscounts(); }
    });
    el.appendChild(tenBtn);

    // 百连
    const hundredBtn = document.createElement('button');
    hundredBtn.className = 'ink-btn';
    hundredBtn.dataset.petGachaCount = '100';
    hundredBtn.addEventListener('click', () => {
      playClickSound();
      const purchase = getGachaPurchaseInfo(s, 'pet', 100);
      if (!window.confirm(`灵宠百连抽将消耗 ${purchase.cost} 灵石${purchase.discounted ? '（八折）' : ''}，确定继续吗？`)) return;
      const res = petGachaDrawHundred();
      if (res) { this.showPetGachaHundred(res); this.refreshPetGachaDiscounts(); }
    });
    el.appendChild(hundredBtn);

    const thousandBtn = document.createElement('button');
    thousandBtn.className = 'ink-btn';
    thousandBtn.dataset.petGachaCount = '1000';
    thousandBtn.addEventListener('click', () => {
      playClickSound();
      const purchase = getGachaPurchaseInfo(s, 'pet', 1000);
      if (!window.confirm(`灵宠千连抽将消耗 ${purchase.cost} 灵石${purchase.discounted ? '（八折）' : ''}，确定继续吗？`)) return;
      const res = petGachaDrawThousand();
      if (res) { this.showPetGachaHundred(res); this.refreshPetGachaDiscounts(); }
    });
    el.appendChild(thousandBtn);
    this.refreshPetGachaDiscounts();

    const backBtn = document.createElement('button');
    backBtn.className = 'ink-btn';
    backBtn.textContent = '返回';
    backBtn.addEventListener('click', () => goToNode('fangshi'));
    el.appendChild(backBtn);
  },

  refreshPetGachaDiscounts() {
    const s = Game.state;
    if (!s) return;
    const names = { 1: '🐾 抽灵宠', 10: '🐾 十连抽灵宠', 100: '🐾 百连抽灵宠', 1000: '🐾 千连抽灵宠' };
    document.querySelectorAll('[data-pet-gacha-count]').forEach(btn => {
      const count = Number(btn.dataset.petGachaCount);
      const info = getGachaPurchaseInfo(s, 'pet', count);
      btn.textContent = `${names[count]}（${info.cost}灵石${info.discounted ? `·八折剩${info.remaining}次` : ''}）`;
    });
    const infoEl = document.getElementById('pet-gacha-discount-info');
    if (infoEl) infoEl.textContent = `独立八折次数：单抽${getGachaPurchaseInfo(s, 'pet', 1).remaining} · 十连${getGachaPurchaseInfo(s, 'pet', 10).remaining} · 百连${getGachaPurchaseInfo(s, 'pet', 100).remaining} · 千连${getGachaPurchaseInfo(s, 'pet', 1000).remaining}`;
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
      const extra = r.autoReleased
        ? `<br>已按自动放生设置折算为 ${r.refund} 灵石`
        : `<br>已放入灵宠背包（重复灵宠可攒齐 3 只升星）`;
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
      else div.textContent = `${r.pet.icon}${r.pet.name}${r.autoReleased ? `（自动放生 +${r.refund}灵石）` : ''}`;
      list.appendChild(div);
    });
    const tip = document.createElement('div');
    tip.className = 'gacha-ten-item';
    tip.style.color = '#e6d3a0';
    const autoReleased = res.list.filter(r => r.autoReleased);
    const refund = autoReleased.reduce((sum, r) => sum + (r.refund || 0), 0);
    tip.textContent = autoReleased.length ? `其余奖励已放入背包；${autoReleased.length} 只灵宠自动放生，获得 ${refund} 灵石` : '全部奖励已放入背包';
    list.appendChild(tip);
    this.els.gachaTenOverlay.classList.remove('hidden');
  },

  // 灵宠百连结果弹窗（复用藏宝阁百连）
  showPetGachaHundred(res) {
    const list = this.els.gachaHundredList;
    if (this.els.gachaHundredTitle) this.els.gachaHundredTitle.textContent = `${res.drawCount === 1000 ? '千连' : '百连'}抽结果`;
    list.innerHTML = '';
    // 稀有度统计
    const rareCount = {};
    res.list.forEach(r => { rareCount[r.rarity] = (rareCount[r.rarity] || 0) + 1; });
    const summary = document.createElement('div');
    summary.className = 'gacha-hundred-summary';
    summary.innerHTML = PET_GACHA_POOL.map(t => {
      const n = rareCount[t.rarity] || 0;
      return n > 0 ? `<span style="color:${t.color}">${t.rarity}×${n}</span>` : '';
    }).filter(Boolean).join(' ');
    list.appendChild(summary);
    // 同 id 合并数量，按稀有度升序（高稀有度在前）
    const rareOrder = PET_GACHA_POOL.map(t => t.rarity);
    const agg = {};
    res.list.forEach(r => {
      const key = r.type === 'pet' ? 'pet:' + r.pet.id : 'item:' + r.item.id;
      if (!agg[key]) {
        agg[key] = {
          type: r.type,
          icon: r.type === 'pet' ? r.pet.icon : r.item.icon,
          name: r.type === 'pet' ? r.pet.name : r.item.name,
          count: 0, color: r.color, rarity: r.rarity,
        };
      }
        agg[key].count++;
        if (r.autoReleased) {
          agg[key].autoReleased = (agg[key].autoReleased || 0) + 1;
          agg[key].refund = (agg[key].refund || 0) + (r.refund || 0);
        }
    });
    Object.values(agg).sort((a, b) => rareOrder.indexOf(a.rarity) - rareOrder.indexOf(b.rarity)).forEach(e => {
      const div = document.createElement('div');
      div.className = 'gacha-ten-item';
      div.style.color = e.color;
      div.textContent = `${e.icon}${e.name} ×${e.count}${e.autoReleased ? `（自动放生×${e.autoReleased}，+${e.refund}灵石）` : ''}`;
      list.appendChild(div);
    });
    this.els.gachaHundredOverlay.classList.remove('hidden');
  },

  // ========== 侧边面板·灵宠 ==========
  renderPetPanel() {
    const s = Game.state;
    const el = document.getElementById('pet-panel');
    if (!el) return;
    let html = `<div class="pet-level" style="color:#e6d3a0;text-align:center">喂养道具：🥩兽粮×${s.bag.shouliang || 0} 💊灵兽丹×${s.bag.lingshou_dan || 0}</div>`;
    html += `<div class="pet-auto-release"><div>自动放生（神品不会自动放生）</div>${Object.keys(PET_QUALITY_RANK).filter(q => q !== '神品').map(q => `<label><input type="checkbox" ${s.petAutoRelease && s.petAutoRelease[q] ? 'checked' : ''} onchange="UI.togglePetAutoRelease('${q}', this.checked)">${q}</label>`).join('')}<button class="ink-btn danger" onclick="UI.releaseSelectedPetQualities()">放生已选品质</button><small>立即放生会保留出战灵宠与神品。</small></div>`;
    if (!s.pets || s.pets.length === 0) html += '<div class="pet-empty">尚未拥有灵宠，可前往坊市·灵兽谷抽取。</div>';
    (s.pets || []).forEach(p => {
      const pet = PETS[p.id];
      const lv = p.level || 1;
      const stage = getPetStage(p);
      const trait = getPetTrait(p);
      const isEquipped = s.pet === p.uid;
      const star = p.star || 1;
      const maxLv = getPetMaxLevel(p);
      const isMax = lv >= maxLv;
      const exp = p.exp || 0;
      const expNeed = getPetExpToNext(lv);
      const feedCost = isMax ? 0 : expNeed - exp; // 升1级还差的经验 = 所需灵石
      const starLabel = star > 1 ? ` <span style="color:#ffd54f">★${star}星</span>` : '';
      html += `
        <div class="pet-card">
          <div class="pet-icon">${pet.icon}</div>
          <div class="pet-name" style="color:${pet.qc}">${pet.name} <span style="color:#ccc">${pet.quality}</span>${starLabel}${isEquipped ? ' <span style="color:#ffd54f">·出战中</span>' : ''}</div>
          <div class="pet-level">等级 ${lv}/${maxLv} · ${stage}阶（每10级进阶）${star > 1 ? ` · 升星加成 +${(star - 1) * 5}%` : ''}</div>
          ${isMax
            ? `<div class="pet-exp" style="color:#ffd54f">已满级，升星可突破上限</div>`
            : `<div class="pet-exp-bar"><div class="pet-exp-fill" style="width:${Math.max(2, Math.round(exp / expNeed * 100))}%"></div></div>
               <div class="pet-exp">经验 ${exp}/${expNeed} · 升1级还差 ${expNeed - exp}</div>`}
          <div class="pet-desc">${pet.desc}</div>
          <div class="pet-stats">固定值 + 主人属性百分比<br>物攻+${getPetStatBonus(s, p, 'atk')} 法攻+${getPetStatBonus(s, p, 'matk')}<br>物抗+${getPetStatBonus(s, p, 'def')} 法抗+${getPetStatBonus(s, p, 'mdef')} 穿透+${getPetStatBonus(s, p, 'pen')}</div>
          <div class="pet-skill">技能【${pet.skill}】：${Math.round(getPetSkillChance(p) * 100)}% 概率追加伤害（单次不超过主人本次伤害50%）</div>
          ${trait ? `<div class="pet-trait">神品天赋【${trait.name}】：${trait.desc}（仅随进阶强化）</div>` : ''}
        </div>
        <div class="save-actions">
          ${!isEquipped ? `<button class="ink-btn" onclick="UI.equipPetFromPanel('${p.uid}')">出战</button>` : ''}
          ${isMax
            ? `<button class="ink-btn disabled" disabled>🈵 已达上限（${maxLv}级）</button>`
            : `<button class="ink-btn" onclick="UI.feedPetFromPanel('${p.uid}')">🍖 升1级（${feedCost}灵石）</button>
               <button class="ink-btn" onclick="UI.feedPetItemFromPanel('${p.uid}', 'lingshou_dan')">💊 喂灵兽丹</button>
               <button class="ink-btn" onclick="UI.feedPetItemFromPanel('${p.uid}', 'shouliang')">🥩 喂兽粮</button>`}
          <button class="ink-btn" onclick="UI.starUpPetFromPanel('${p.uid}')">⭐ 升星</button>
          <button class="ink-btn danger" onclick="UI.releasePetFromPanel('${p.uid}')">放生</button>
        </div>
      `;
    });
    el.innerHTML = html;
  },

  // ========== 灵宠独立界面（全屏覆盖） ==========
  openPetOverlay() {
    this.renderPetOverlay();
    document.getElementById('pet-overlay').classList.remove('hidden');
  },

  closePetOverlay() {
    document.getElementById('pet-overlay').classList.add('hidden');
  },

  renderPetOverlay() {
    const s = Game.state;
    const el = document.getElementById('pet-overlay-body');
    if (!el) return;
    const FOOD_NAME = { meat: '肉食', fruit: '果食', grass: '草食', nut: '坚果' };
    const DECOR_NAME = { bell: '铃铛', ribbon: '绸带', gem: '宝珠', toy: '玩具' };
    const QUALITY_COLOR = { '废品': '#7a7a7a', '凡品': '#c9c9c9', '良品': '#4caf50', '中品': '#4a90d9', '上品': '#9b59b6', '极品': '#e6a23c', '神品': '#e0473c' };
    const QUALITY_ORDER = ['神品', '极品', '上品', '中品', '良品', '凡品', '废品'];
    const filter = this._petFilter || 'all';
    const pets = (s.pets || []).slice().sort((a, b) => {
      const qa = PET_QUALITY_RANK[(PETS[a.id] || {}).quality] || 0;
      const qb = PET_QUALITY_RANK[(PETS[b.id] || {}).quality] || 0;
      if (qb !== qa) return qb - qa;
      if ((b.star || 1) !== (a.star || 1)) return (b.star || 1) - (a.star || 1);
      return (b.level || 1) - (a.level || 1);
    }).filter(p => filter === 'all' || (PETS[p.id] && PETS[p.id].quality === filter));
    let html = `<div class="pet-level" style="color:#e6d3a0;text-align:center">喂养道具：🥩兽粮×${s.bag.shouliang || 0} 💊灵兽丹×${s.bag.lingshou_dan || 0}</div>`;
    html += `<div style="text-align:center;margin:8px 0"><button class="ink-btn" onclick="UI.openPetCodex()">📖 灵宠图鉴</button> <button class="ink-btn" onclick="UI.openGiftCodex()">📖 礼物图鉴</button></div>`;
    html += `<div class="pet-auto-release"><div>自动放生（神品不会自动放生）</div>${Object.keys(PET_QUALITY_RANK).filter(q => q !== '神品').map(q => `<label><input type="checkbox" ${s.petAutoRelease && s.petAutoRelease[q] ? 'checked' : ''} onchange="UI.togglePetAutoRelease('${q}', this.checked)">${q}</label>`).join('')}<button class="ink-btn danger" onclick="UI.releaseSelectedPetQualities()">放生已选品质</button><small>立即放生会保留出战灵宠与神品。</small></div>`;
    html += `<div class="pet-filter"><button class="pet-filter-btn${filter === 'all' ? ' active' : ''}" onclick="UI.setPetFilter('all')">全部</button>${QUALITY_ORDER.map(q => `<button class="pet-filter-btn${filter === q ? ' active' : ''}" onclick="UI.setPetFilter('${q}')"><span style="color:${QUALITY_COLOR[q]}">●</span>${q}</button>`).join('')}</div>`;
    if (!s.pets || s.pets.length === 0) html += '<div class="pet-empty">尚未拥有灵宠，可前往坊市·灵兽谷抽取。</div>';
    else if (pets.length === 0) html += `<div class="pet-empty">没有「${filter}」品质的灵宠。</div>`;
    pets.forEach(p => {
      const pet = PETS[p.id];
      const lv = p.level || 1;
      const stage = getPetStage(p);
      const trait = getPetTrait(p);
      const isEquipped = s.pet === p.uid;
      const star = p.star || 1;
      const maxLv = getPetMaxLevel(p);
      const isMax = lv >= maxLv;
      const exp = p.exp || 0;
      const expNeed = getPetExpToNext(lv);
      const feedCost = isMax ? 0 : expNeed - exp;
      const starLabel = star > 1 ? ` <span style="color:#ffd54f">★${star}星</span>` : '';
      const fi = getPetFavorInfo(p);
      const likes = pet.likes || {};
      const likeFood = Array.isArray(likes.food) ? likes.food : [likes.food];
      const likeDecor = Array.isArray(likes.decor) ? likes.decor : [likes.decor];
      const foodStr = likeFood.map(f => FOOD_NAME[f]).filter(Boolean).join('、') || '—';
      const decorStr = likeDecor.map(d => DECOR_NAME[d]).filter(Boolean).join('、') || '—';
      const chance = Math.round(getPetSkillChance(p) * 100);
      html += `
        <div class="pet-overlay-card">
          <div class="pet-icon">${pet.icon}</div>
          <div class="pet-name" style="color:${pet.qc}">${pet.name} <span style="color:#ccc">${pet.quality}</span>${starLabel}${isEquipped ? ' <span style="color:#ffd54f">·出战中</span>' : ''}</div>
          <div class="pet-level">等级 ${lv}/${maxLv} · ${stage}阶${star > 1 ? ` · 升星加成 +${(star - 1) * 5}%` : ''}</div>
          ${isMax ? `<div class="pet-exp" style="color:#ffd54f">已满级，升星可突破上限</div>` : `<div class="pet-exp-bar"><div class="pet-exp-fill" style="width:${Math.max(2, Math.round(exp / expNeed * 100))}%"></div></div><div class="pet-exp">经验 ${exp}/${expNeed}</div>`}
          <div class="pet-desc">${pet.desc}</div>
          <div class="pet-like">喜好：${foodStr} · ${decorStr}（送对好感加倍）</div>
          <div class="pet-favor">
            <div class="pet-favor-head"><span>❤️ 好感</span><span>Lv.${fi.favor}/${fi.max}${fi.favor >= fi.max ? '（已满）' : ''}</span></div>
            <div class="pet-favor-bar"><div class="pet-favor-fill" style="width:${fi.favor >= fi.max ? 100 : Math.max(2, fi.pct)}%"></div></div>
            <div class="pet-favor-sub">${fi.favor >= fi.max ? '好感已满，出手概率达上限' : `进度 ${fi.favorExp}/${fi.expPerLevel}`}</div>
          </div>
          <div class="pet-stats">物攻+${getPetStatBonus(s, p, 'atk')} 法攻+${getPetStatBonus(s, p, 'matk')} 物抗+${getPetStatBonus(s, p, 'def')} 法抗+${getPetStatBonus(s, p, 'mdef')} 穿透+${getPetStatBonus(s, p, 'pen')}</div>
          ${pet.id === 'tuntunshu'
            ? `<div class="pet-skill">技能【${pet.skill}】：闪避 ${Math.round(getTuntunshuDodgeRate(p) * 100)}% · 战后偷灵石/材料 · 偷Boss专属装备 ${(getTuntunshuBossStealRate(p) * 100).toFixed(3)}%（再胜 ${Math.max(0, TUNTUNSHU_BOSS_STEAL_PITY - (p.bossStealMisses || 0))} 次保底）</div>`
            : `<div class="pet-skill">技能【${pet.skill}】：${chance}% 概率追加伤害（好感越高出手越勤）</div>`}
          ${trait ? `<div class="pet-trait">神品天赋【${trait.name}】：${trait.desc}</div>` : ''}
        </div>
        <div class="save-actions">
          ${!isEquipped ? `<button class="ink-btn" onclick="UI.equipPetFromPanel('${p.uid}')">出战</button>` : ''}
          ${isMax ? `<button class="ink-btn disabled" disabled>🈵 已达上限</button>` : `<button class="ink-btn" onclick="UI.feedPetFromPanel('${p.uid}')">🍖 升1级（${feedCost}灵石）</button><button class="ink-btn" onclick="UI.feedPetItemFromPanel('${p.uid}', 'lingshou_dan')">💊 喂灵兽丹</button><button class="ink-btn" onclick="UI.feedPetItemFromPanel('${p.uid}', 'shouliang')">🥩 喂兽粮</button>`}
          <button class="ink-btn" onclick="UI.starUpPetFromPanel('${p.uid}')">⭐ 升星（${PET_STAR_COST[pet.quality] || 100}灵石）</button>
          <button class="ink-btn" onclick="UI.togglePetGift('${p.uid}')">🎁 送礼物</button>
          <button class="ink-btn danger" onclick="UI.releasePetFromPanel('${p.uid}')">放生</button>
        </div>
      `;
      if (this._giftPetId === p.uid) {
        const treats = Object.values(ITEMS).filter(it => it.favor && (s.bag[it.id] || 0) > 0);
        html += `<div class="treat-list">`;
        if (!treats.length) html += `<div class="treat-empty">暂无零食/装饰，可去「🎡 零食转盘」抽取</div>`;
        treats.forEach(it => {
          const liked = (it.cat === 'food' && petLikeFood(pet, it.taste)) || (it.cat === 'decor' && petLikeDecor(pet, it.style));
          html += `<button class="treat-item${liked ? ' liked' : ''}" onclick="UI.giveTreat('${p.uid}', '${it.id}')"><span>${it.icon} ${it.name}×${s.bag[it.id]}</span><span class="treat-gain">${liked ? '❤️+' + Math.floor(it.favor * 2) : '+' + Math.floor(it.favor * 0.5)}</span></button>`;
        });
        html += `</div>`;
      }
    });
    el.innerHTML = html;
  },

  setPetFilter(q) {
    this._petFilter = q;
    this.renderPetOverlay();
  },

  togglePetGift(uid) {
    this._giftPetId = (this._giftPetId === uid) ? null : uid;
    this.renderPetOverlay();
  },

  giveTreat(uid, itemId) {
    if (feedPetTreat(Game.state, uid, itemId)) { this.renderPetOverlay(); this.updateStats(); }
  },

  // ========== 灵宠图鉴 ==========
  openPetCodex() {
    const list = document.getElementById('pet-codex-list');
    if (!list || !PETS) return;
    const FOOD_NAME = { meat: '肉食', fruit: '果食', grass: '草食', nut: '坚果' };
    const DECOR_NAME = { bell: '铃铛', ribbon: '绸带', gem: '宝珠', toy: '玩具' };
    const QUALITY_ORDER = ['神品', '极品', '上品', '中品', '良品', '凡品', '废品'];
    const QUALITY_COLOR = { '废品': '#7a7a7a', '凡品': '#c9c9c9', '良品': '#4caf50', '中品': '#4a90d9', '上品': '#9b59b6', '极品': '#e6a23c', '神品': '#e0473c' };
    const owned = (Game.state.pets || []).map(p => p.id);
    const html = QUALITY_ORDER.map(q => {
      const pets = Object.values(PETS).filter(p => p.quality === q);
      if (!pets.length) return '';
      const rows = pets.map(p => {
        const likes = p.likes || {};
        const foodStr = (Array.isArray(likes.food) ? likes.food : [likes.food]).map(f => FOOD_NAME[f]).filter(Boolean).join('、') || '—';
        const decorStr = (Array.isArray(likes.decor) ? likes.decor : [likes.decor]).map(d => DECOR_NAME[d]).filter(Boolean).join('、') || '—';
        const has = owned.includes(p.id);
        return `
          <div class="codex-row" style="${has ? '' : 'opacity:.5;'}">
            <span class="codex-icon">${p.icon}</span>
            <span class="codex-name" style="color:${p.qc}">${p.name}${has ? ' ✓' : ''}</span>
            <span class="codex-desc">【${p.skill}】喜 ${foodStr}/${decorStr} · ${p.desc}</span>
          </div>
        `;
      }).join('');
      return `
        <div class="codex-tier">
          <div class="codex-tier-head">
            <span style="color:${QUALITY_COLOR[q]}">${q}</span>
            <span class="codex-weight">共 ${pets.length} 只</span>
          </div>
          ${rows}
        </div>
      `;
    }).join('');
    list.innerHTML = html;
    document.getElementById('pet-codex-overlay').classList.remove('hidden');
  },

  closePetCodex() {
    document.getElementById('pet-codex-overlay').classList.add('hidden');
  },

  // ========== 礼物图鉴（灵宠零食/装饰） ==========
  openGiftCodex() {
    const list = document.getElementById('gift-codex-list');
    if (!list || !ITEMS) return;
    const FOOD_NAME = { meat: '肉食', fruit: '果食', grass: '草食', nut: '坚果' };
    const DECOR_NAME = { bell: '铃铛', ribbon: '绸带', gem: '宝珠', toy: '玩具' };
    const treats = Object.values(ITEMS).filter(it => it.favor);
    const groups = [];
    ['meat', 'fruit', 'grass', 'nut'].forEach(taste => {
      const items = treats.filter(it => it.cat === 'food' && it.taste === taste);
      if (items.length) groups.push({ title: `🍽 零食 · ${FOOD_NAME[taste]}`, items });
    });
    ['bell', 'ribbon', 'gem', 'toy'].forEach(style => {
      const items = treats.filter(it => it.cat === 'decor' && it.style === style);
      if (items.length) groups.push({ title: `🎁 装饰 · ${DECOR_NAME[style]}`, items });
    });
    const html = groups.map(g => {
      const rows = g.items.map(it => `
        <div class="codex-row">
          <span class="codex-icon">${it.icon}</span>
          <span class="codex-name">${it.name}</span>
          <span class="codex-desc">好感 +${it.favor} · 投其所好 ×2 / 送错 ×0.5</span>
        </div>
      `).join('');
      return `
        <div class="codex-tier">
          <div class="codex-tier-head"><span>${g.title}</span><span class="codex-weight">共 ${g.items.length} 种</span></div>
          ${rows}
        </div>
      `;
    }).join('');
    list.innerHTML = html;
    document.getElementById('gift-codex-overlay').classList.remove('hidden');
  },

  closeGiftCodex() {
    document.getElementById('gift-codex-overlay').classList.add('hidden');
  },

  // ========== 灵宠零食/装饰转盘 ==========
  openTreatGacha() {
    this.renderTreatGacha();
    document.getElementById('treat-gacha-overlay').classList.remove('hidden');
  },

  closeTreatGacha() {
    document.getElementById('treat-gacha-overlay').classList.add('hidden');
  },

  renderTreatGacha() {
    const s = Game.state;
    const el = document.getElementById('treat-gacha-body');
    if (!el) return;
    let html = `<div class="gacha-pity">已抽 ${s.treatGachaCount || 0} 抽 · 零食/装饰放入储物袋·杂物，用于在灵宠界面送礼培养好感</div>`;
    html += `<div class="gacha-info">${PET_TREAT_POOL.map(t => `<span class="gacha-rate" style="color:${t.color}">${t.rarity} ${t.weight}%</span>`).join('')}</div>`;
    html += `<button class="ink-btn" onclick="UI.treatGachaOnce()">🎡 抽一次（${PET_TREAT_COST}灵石）</button>`;
    html += `<button class="ink-btn" onclick="UI.treatGachaTen()">🎡 十连（${PET_TREAT_COST * 10}灵石）</button>`;
    html += `<button class="ink-btn" onclick="UI.treatGachaHundred()">🎡 百连（${Math.floor(PET_TREAT_COST * 100 * 0.8)}灵石·八折）</button>`;
    el.innerHTML = html;
  },

  treatGachaOnce() {
    playClickSound();
    const r = treatGachaDraw();
    if (r) { this.showPetGachaResult(r); this.renderTreatGacha(); this.renderPetOverlay(); }
  },

  treatGachaTen() {
    playClickSound();
    const res = treatGachaDrawTen();
    if (res) { this.showTreatGachaTen(res); this.renderTreatGacha(); this.renderPetOverlay(); }
  },

  treatGachaHundred() {
    playClickSound();
    if (!window.confirm(`零食百连将消耗 ${Math.floor(PET_TREAT_COST * 100 * 0.8)} 灵石（八折），确定继续吗？`)) return;
    const res = treatGachaDrawHundred();
    if (res) { this.showTreatGachaHundred(res); this.renderTreatGacha(); this.renderPetOverlay(); }
  },

  showTreatGachaTen(res) {
    const list = this.els.gachaTenList;
    list.innerHTML = '';
    res.list.forEach(r => {
      const div = document.createElement('div');
      div.className = 'gacha-ten-item';
      div.style.color = r.color;
      div.textContent = `${r.item.icon}${r.item.name}`;
      list.appendChild(div);
    });
    const tip = document.createElement('div');
    tip.className = 'gacha-ten-item';
    tip.style.color = '#e6d3a0';
    tip.textContent = '全部奖励已放入储物袋';
    list.appendChild(tip);
    this.els.gachaTenOverlay.classList.remove('hidden');
  },

  showTreatGachaHundred(res) {
    const list = this.els.gachaHundredList;
    list.innerHTML = '';
    const rareCount = {};
    res.list.forEach(r => { rareCount[r.rarity] = (rareCount[r.rarity] || 0) + 1; });
    const summary = document.createElement('div');
    summary.className = 'gacha-hundred-summary';
    summary.innerHTML = PET_TREAT_POOL.map(t => {
      const n = rareCount[t.rarity] || 0;
      return n > 0 ? `<span style="color:${t.color}">${t.rarity}×${n}</span>` : '';
    }).filter(Boolean).join(' ');
    list.appendChild(summary);
    const rareOrder = PET_TREAT_POOL.map(t => t.rarity);
    const agg = {};
    res.list.forEach(r => {
      const key = 'item:' + r.item.id;
      if (!agg[key]) agg[key] = { icon: r.item.icon, name: r.item.name, count: 0, color: r.color, rarity: r.rarity };
      agg[key].count++;
    });
    Object.values(agg).sort((a, b) => rareOrder.indexOf(a.rarity) - rareOrder.indexOf(b.rarity)).forEach(e => {
      const div = document.createElement('div');
      div.className = 'gacha-ten-item';
      div.style.color = e.color;
      div.textContent = `${e.icon}${e.name} ×${e.count}`;
      list.appendChild(div);
    });
    this.els.gachaHundredOverlay.classList.remove('hidden');
  },

  equipPetFromPanel(id) {
    if (equipPet(id)) { this.renderPetOverlay(); this.updateStats(); }
  },

  feedPetFromPanel(id) {
    if (feedPet(id)) { this.renderPetOverlay(); this.updateStats(); }
  },

  releasePetFromPanel(id) {
    if (releasePet(id)) { this.renderPetOverlay(); this.updateStats(); }
  },

  feedPetItemFromPanel(id, itemId) {
    const s = Game.state;
    const have = (s.bag && s.bag[itemId]) || 0;
    if (have <= 0) { this.showToast('没有该喂养道具'); return; }
    const entry = s.pets.find(p => p.uid === id);
    if (!entry) return;
    const name = itemId === 'lingshou_dan' ? '灵兽丹' : '兽粮';
    const perExp = getPetItemExp(itemId);
    const lv = entry.level || 1;
    const maxLv = getPetMaxLevel(entry);
    if (lv >= maxLv) { this.showToast(`已达等级上限（${maxLv}级），升星可突破`); return; }
    // 升到上限还差的总经验（决定最多投喂多少颗，避免溢出浪费）
    let toCap = 0;
    for (let t = lv; t < maxLv; t++) toCap += getPetExpToNext(t);
    toCap -= (entry.exp || 0);
    const maxCount = Math.min(have, Math.ceil(toCap / perExp));
    this._count = { petId: id, itemId, max: Math.max(1, maxCount), name, perExp };
    document.getElementById('count-title').textContent = `喂${name}`;
    document.getElementById('count-desc').textContent = `等级 ${lv}/${maxLv}，拥有 ${name}×${have}，每颗 +${perExp} 经验`;
    document.getElementById('count-max').textContent = `最多可喂 ${maxCount} 颗（共 ${perExp * maxCount} 经验）`;
    const input = document.getElementById('count-input');
    input.max = maxCount;
    input.value = maxCount;
    document.getElementById('count-overlay').classList.remove('hidden');
    input.focus();
  },

  countClamp() {
    const c = this._count;
    if (!c) return;
    const input = document.getElementById('count-input');
    let n = parseInt(input.value, 10);
    if (!n || n < 1) n = 1;
    if (n > c.max) n = c.max;
    input.value = n;
  },

  countStep(delta) {
    const input = document.getElementById('count-input');
    input.value = (parseInt(input.value, 10) || 1) + delta;
    this.countClamp();
  },

  countConfirm() {
    const c = this._count;
    if (!c) return;
    const input = document.getElementById('count-input');
    let n = parseInt(input.value, 10);
    if (!n || n < 1) n = 1;
    if (n > c.max) n = c.max;
    this.countCancel();
    if (feedPetByItem(c.petId, c.itemId, n)) { this.renderPetOverlay(); this.updateStats(); }
  },

  countCancel() {
    document.getElementById('count-overlay').classList.add('hidden');
    this._count = null;
  },

  starUpPetFromPanel(id) {
    if (starUpPet(id)) { this.renderPetOverlay(); this.updateStats(); }
  },

  renderSectTransfer() {
    const s = Game.state;
    const el = this.els.actionArea;
    el.innerHTML = '';
    const info = document.createElement('div');
    info.className = 'gacha-pity';
    info.textContent = `当前贡献：${s.contribution || 0} 点 · 转换门派需 ${SECT_TRANSFER_COST} 点`;
    el.appendChild(info);
    for (const sectId of Object.keys(SECTS)) {
      if (sectId === s.sect) continue;
      const sect = SECTS[sectId];
      const btn = document.createElement('button');
      btn.className = 'ink-btn';
      btn.textContent = `转入 ${sect.icon} ${sect.name}（${SECT_TRANSFER_COST}贡献）`;
      btn.addEventListener('click', () => {
        if (!confirm(`确定消耗${SECT_TRANSFER_COST}贡献转入${sect.name}？旧门派绝学将被封禁。`)) return;
        playClickSound();
        const result = changeSect(s, sectId);
        this.showToast(result.msg);
        if (result.ok) goToNode('sect_home');
      });
      el.appendChild(btn);
    }
    const rogueBtn = document.createElement('button');
    rogueBtn.className = 'ink-btn danger';
    rogueBtn.textContent = `叛出宗门，成为散修（${SECT_TRANSFER_COST}贡献）`;
    rogueBtn.addEventListener('click', () => {
      if (!confirm(`确定消耗${SECT_TRANSFER_COST}贡献成为散修？所有门派绝学都会被封禁。`)) return;
      playClickSound();
      const result = changeSect(s, null);
      this.showToast(result.msg);
      if (result.ok) goToNode('sect_home');
    });
    el.appendChild(rogueBtn);
    const backBtn = document.createElement('button');
    backBtn.className = 'ink-btn';
    backBtn.textContent = '返回';
    backBtn.addEventListener('click', () => goToNode('sect_home'));
    el.appendChild(backBtn);
  },

  togglePetAutoRelease(quality, enabled) {
    const s = Game.state;
    if (quality === '神品') return;
    s.petAutoRelease = s.petAutoRelease || {};
    s.petAutoRelease[quality] = !!enabled;
    autoSave();
    this.showToast(`${quality}灵宠自动放生已${enabled ? '开启' : '关闭'}`);
  },

  releaseSelectedPetQualities() {
    const s = Game.state;
    const qualities = Object.keys(s.petAutoRelease || {}).filter(q => s.petAutoRelease[q] && q !== '神品');
    if (!qualities.length) { this.showToast('请先勾选要放生的品质'); return; }
    const preview = (s.pets || []).filter(p => {
      const pet = PETS[p.id];
      return pet && p.uid !== s.pet && pet.quality !== '神品' && qualities.includes(pet.quality);
    });
    if (!preview.length) { this.showToast('没有可放生的已选品质灵宠（出战灵宠与神品受保护）'); return; }
    const refund = preview.reduce((sum, p) => sum + (PET_REFUND[PETS[p.id].quality] || 0), 0);
    if (!confirm(`确认放生 ${preview.length} 只已选品质灵宠，获得 ${refund} 灵石？\n出战灵宠与神品不会被放生。`)) return;
    const result = releasePetsByQualities(s, qualities);
    this.showToast(`已批量放生 ${result.count} 只灵宠，获得 ${result.refund} 灵石`);
    this.renderPetPanel();
    this.renderPetOverlay();
    this.updateStats();
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
    const xianCount = s.gachaXianCount || 0;
    const shenLeft = s.gachaShenPityRemaining || 0;
    const shenText = shenLeft > 0 ? `神品保底窗口：剩余 ${shenLeft} 抽` : `再获 ${3 - xianCount} 件仙品开启神品保底`;
    pity.textContent = `已抽 ${s.gachaCount || 0} 抽 · 距仙品保底 ${Math.max(0, GACHA_PITY - sinceXian)} 抽 · ${shenText}`;
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

    const discountInfo = document.createElement('div');
    discountInfo.className = 'gacha-pity';
    const discountParts = [1, 10, 100, 1000].map(count => `${({ 1: '单抽', 10: '十连', 100: '百连', 1000: '千连' })[count]}${getGachaPurchaseInfo(s, 'equipment', count).remaining}`);
    discountInfo.textContent = `独立八折次数：${discountParts.join(' · ')}`;
    el.appendChild(discountInfo);

    // 单抽
    const btn = document.createElement('button');
    btn.className = 'ink-btn';
    const singlePurchase = getGachaPurchaseInfo(s, 'equipment', 1);
    btn.textContent = `抽一次（${singlePurchase.cost}灵石${singlePurchase.discounted ? `·八折剩${singlePurchase.remaining}次` : ''}）`;
    btn.addEventListener('click', () => {
      playClickSound();
      const r = gachaDraw();
      if (r) { this.showGachaResult(r); this.renderGacha(); }
    });
    el.appendChild(btn);

    // 十连
    const tenBtn = document.createElement('button');
    tenBtn.className = 'ink-btn';
    const tenPurchase = getGachaPurchaseInfo(s, 'equipment', 10);
    tenBtn.textContent = `十连抽（${tenPurchase.cost}灵石${tenPurchase.discounted ? `·八折剩${tenPurchase.remaining}次` : ''}）`;
    tenBtn.addEventListener('click', () => {
      playClickSound();
      const rs = gachaDrawTen();
      if (rs) { this.showGachaTen(rs); this.renderGacha(); }
    });
    el.appendChild(tenBtn);

    // 百连
    const hundredBtn = document.createElement('button');
    hundredBtn.className = 'ink-btn';
    const hundredPurchase = getGachaPurchaseInfo(s, 'equipment', 100);
    hundredBtn.textContent = `百连抽（${hundredPurchase.cost}灵石${hundredPurchase.discounted ? `·八折剩${hundredPurchase.remaining}次` : ''}）`;
    hundredBtn.addEventListener('click', () => {
      playClickSound();
      const purchase = getGachaPurchaseInfo(s, 'equipment', 100);
      if (!window.confirm(`百连抽将消耗 ${purchase.cost} 灵石${purchase.discounted ? '（八折）' : ''}，确定继续吗？`)) return;
      const rs = gachaDrawHundred();
      if (rs) { this.showGachaHundred(rs); this.renderGacha(); }
    });
    el.appendChild(hundredBtn);

    const thousandBtn = document.createElement('button');
    thousandBtn.className = 'ink-btn';
    const thousandPurchase = getGachaPurchaseInfo(s, 'equipment', 1000);
    thousandBtn.textContent = `千连抽（${thousandPurchase.cost}灵石${thousandPurchase.discounted ? `·八折剩${thousandPurchase.remaining}次` : ''}）`;
    thousandBtn.addEventListener('click', () => {
      playClickSound();
      const purchase = getGachaPurchaseInfo(s, 'equipment', 1000);
      if (!window.confirm(`千连抽将消耗 ${purchase.cost} 灵石${purchase.discounted ? '（八折）' : ''}，确定继续吗？`)) return;
      const rs = gachaDrawThousand();
      if (rs) { this.showGachaHundred(rs, 1000); this.renderGacha(); }
    });
    el.appendChild(thousandBtn);

    // 图鉴
    const codexBtn = document.createElement('button');
    codexBtn.className = 'ink-btn';
    codexBtn.textContent = '📖 图鉴';
    codexBtn.addEventListener('click', () => { playClickSound(); this.openCodex(); });
    el.appendChild(codexBtn);

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

  showGachaHundred(results, drawCount = 100) {
    const list = this.els.gachaHundredList;
    if (this.els.gachaHundredTitle) this.els.gachaHundredTitle.textContent = `${drawCount === 1000 ? '千连' : '百连'}抽结果`;
    list.innerHTML = '';
    // 稀有度统计（按池子顺序展示）
    const rareCount = {};
    results.forEach(r => { rareCount[r.rarity] = (rareCount[r.rarity] || 0) + 1; });
    const summary = document.createElement('div');
    summary.className = 'gacha-hundred-summary';
    summary.innerHTML = GACHA_POOL.map(t => {
      const n = rareCount[t.rarity] || 0;
      return n > 0 ? `<span style="color:${t.color}">${t.rarity}×${n}</span>` : '';
    }).filter(Boolean).join(' ');
    list.appendChild(summary);
    // 同 id 物品合并数量，按稀有度升序（高稀有度在前）
    const rareOrder = GACHA_POOL.map(t => t.rarity);
    const agg = {};
    results.forEach(r => {
      const key = r.item.id;
      if (!agg[key]) agg[key] = { item: r.item, count: 0, color: r.color, rarity: r.rarity };
      agg[key].count += r.count;
    });
    Object.values(agg).sort((a, b) => rareOrder.indexOf(a.rarity) - rareOrder.indexOf(b.rarity)).forEach(e => {
      const div = document.createElement('div');
      div.className = 'gacha-ten-item';
      div.style.color = e.color;
      div.textContent = `${e.item.icon}${e.item.name} ×${e.count}`;
      list.appendChild(div);
    });
    this.els.gachaHundredOverlay.classList.remove('hidden');
  },

  closeGachaHundred() {
    this.els.gachaHundredOverlay.classList.add('hidden');
  },

  openBatchSellConfirm(item, count, cat) {
    if (!item || count <= 0) return;
    const gain = item.sell * count;
    this.pendingBatchSell = { itemId: item.id, cat };
    this.els.batchSellConfirmDesc.textContent = `确定出售 ${item.name}×${count}，获得 ${gain} 灵石？`;
    this.els.batchSellConfirmOverlay.classList.remove('hidden');
  },

  cancelBatchSellConfirm() {
    this.pendingBatchSell = null;
    this.els.batchSellConfirmOverlay.classList.add('hidden');
  },

  confirmBatchSell() {
    const pending = this.pendingBatchSell;
    this.cancelBatchSellConfirm();
    if (!pending) return;
    playClickSound();
    if (sellItemBatch(pending.itemId)) {
      this.updateBag(pending.cat);
      this.updateStats();
      this.renderStatDetail();
    }
  },

  showBossLootCelebration(item, bossName) {
    if (!item || !this.els.bossLootOverlay) return;
    const blessings = [
      `恭喜道友！${bossName}陨落之际遗下神藏「${item.name}」。愿此宝护你仙途长明，问鼎大道！`,
      `天机垂怜，${bossName}的遗藏认你为主。得「${item.name}」相助，道友当破尽万劫！`,
      `神光落入掌中！你从${bossName}身上获得「${item.name}」，愿你执此至宝，直上九霄。`,
    ];
    this.els.bossLootIcon.textContent = item.icon;
    this.els.bossLootName.textContent = item.name;
    this.els.bossLootName.style.color = item.color || '#ffe49a';
    this.els.bossLootBlessing.textContent = blessings[Math.floor(Math.random() * blessings.length)];
    this.els.bossLootOverlay.classList.remove('hidden');
  },

  closeBossLootCelebration() {
    this.els.bossLootOverlay.classList.add('hidden');
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
    const pendingGate = getCurrentTribulationGate(s) || getTribulationGateForIndex(s.pendingTribulation && s.pendingTribulation.gateIdx);
    const dynamicTurns = b.dynamicTribulation && pendingGate
      ? getTribulationBattleConfig(pendingGate).turns
      : b.turns;

    startBattle(b.enemy, mult, winCb, loseCb, winNext, loseNext, b.tribulation, dynamicTurns);

    // 显示战斗面板
    this.els.battleOverlay.classList.remove('hidden');

    // 更新一次
    this.updateBattle();
  },

  updateBattle() {
    if (!Game.battle) return;
    const e = Game.battle.enemy;
    const s = Game.state;

    this.els.enemyName.textContent = e.realmName ? `${e.name} · ${e.realmName}` : e.name;
    const hpPct = Math.max(0, (e.hp / e.maxHp) * 100);
    this.els.enemyHpFill.style.width = hpPct + '%';
    this.els.enemyHpVal.textContent = `${Math.max(0, e.hp)}/${e.maxHp}`;

    // 玩家血条（战斗中也能看到自己的气血/灵力，渡劫时尤其关键）
    this.els.battlePlayerName.textContent = s.name || '我';
    const phpPct = Math.max(0, (s.hp / s.maxHp) * 100);
    this.els.battleHpFill.style.width = phpPct + '%';
    this.els.battleHpVal.textContent = `${Math.max(0, Math.round(s.hp))}/${Math.round(s.maxHp)}`;
    const pmpPct = s.maxMp > 0 ? Math.max(0, (s.mp / s.maxMp) * 100) : 0;
    this.els.battleMpFill.style.width = pmpPct + '%';
    this.els.battleMpVal.textContent = `${Math.max(0, Math.round(s.mp))}/${Math.round(s.maxMp)}`;

    // 攻防属性（物攻/法攻/物抗/法抗）
    const atkBoost = Game.battle.attackBoost || 0;
    const atkShow = atkBoost > 0 ? Math.round(s.atk * (1 + atkBoost)) : Math.round(s.atk);
    const atkLabel = atkBoost > 0 ? `（+${Math.round(atkBoost * 100)}%）` : '';
    const critRate = Math.round(getCritRate(s) * 100);
    this.els.battlePlayerStats.innerHTML = `物攻 <b>${atkShow}${atkLabel}</b> · 法攻 <b>${Math.round(s.matk)}</b> · 物抗 <b>${Math.round(s.def)}</b> · 法抗 <b>${Math.round(s.mdef)}</b> · 暴击 <b>${critRate}%</b>`;
    this.els.battleEnemyStats.innerHTML = `物攻 <b>${Math.round(e.atk)}</b> · 法攻 <b>${Math.round(e.matk)}</b> · 物抗 <b>${Math.round(e.def)}</b> · 法抗 <b>${Math.round(e.mdef)}</b>`;
    // Boss 挑战推荐（天劫按百分比结算，不给攻防建议）
    if (e.boss && !e.untouchable) {
      const recAtk = Math.max(e.def, e.mdef);
      const recDef = Math.floor(Math.max(e.atk, e.matk) * 0.6);
      const recHp = Math.floor(Math.max(e.atk, e.matk) * 3);
      this.els.battleRecommend.innerHTML = `推荐：攻击 ≥ <b>${recAtk}</b> ｜ 防御 ≥ <b>${recDef}</b> ｜ 气血 ≥ <b>${recHp}</b>`;
      this.els.battleRecommend.style.display = '';
    } else {
      this.els.battleRecommend.style.display = 'none';
    }

    const statuses = [];
    if (e.burnTurns > 0) statuses.push(`敌·灼烧 ${e.burnTurns}回合`);
    if (e.stunned) statuses.push('敌·麻痹');
    if (e.rootedTurns > 0) statuses.push('敌·封招（下次攻击无效）');
    if (e.armorBreakTurns > 0) statuses.push(`敌·破甲 ${e.armorBreakTurns}回合`);
    if (Game.battle.waterGuard) statuses.push('我·水幕护体');
    if (Game.battle.metalReflect) statuses.push('我·金灵反震');
    if (Game.battle.poisonTurns > 0) statuses.push(`我·中毒 ${Game.battle.poisonTurns}回合`);
    if (Game.battle.playerWeakenTurns > 0) statuses.push(`我·虚弱 ${Math.max(1, Game.battle.playerWeakenTurns - 1)}回合`);
    if (Game.battle.playerStunnedTurns > 0) statuses.push('我·眩晕（下回合跳过）');
    if (Game.battle.attackBoost > 0) statuses.push(`我·攻击+${Math.round(Game.battle.attackBoost * 100)}%（剩${Game.battle.attackBoostTurns}回合）`);
    if (Game.battle.enemySpecialCd > 0 && e.special) statuses.push(`敌·${e.special.name}冷却${Game.battle.enemySpecialCd}`);
    this.els.battleStatus.textContent = statuses.length ? `状态：${statuses.join(' ｜ ')}` : '状态：无';

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
          if (s.bag[id] > 0 && ITEMS[id] && ITEMS[id].type === 'pill' && (ITEMS[id].healPct || ITEMS[id].manaPct)) {
            const item = ITEMS[id];
            pills.push({ id, name: item.name, icon: item.icon, healPct: item.healPct, manaPct: item.manaPct, count: s.bag[id] });
          }
        }
        if (pills.length === 0) {
          const btn = document.createElement('button');
          btn.className = 'ink-btn disabled';
          btn.disabled = true;
          btn.textContent = '没有恢复丹药';
          this.els.battleActions.appendChild(btn);
        } else {
          pills.forEach(p => {
            const btn = document.createElement('button');
            btn.className = 'ink-btn';
            btn.textContent = `${p.icon} ${p.name} ×${p.count}（回${Math.round((p.healPct || p.manaPct) * 100)}%${p.healPct ? '气血' : '灵力'}）`;
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
      const skillManaCost = getManaCost(s, lg.manaPct || 0.2);
      const actions = [
        { label: '普通攻击', action: () => playerAttack() },
        { label: `${lg.skill}（${skillManaCost}灵力）`, action: () => playerSkill() },
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

      // 法宝按钮：装备了特效法宝（如乾坤鼎）才显示；6 槽全通用，逐件遍历
      for (const slot of EQUIP_SLOTS) {
        const specialId = s.equipment && s.equipment[slot];
        const specialItem = specialId && ITEMS[specialId];
        if (!specialItem || !specialItem.special) continue;
        const cd = (Game.battle.specialCd && Game.battle.specialCd[specialId]) || 0;
        const btn = document.createElement('button');
        btn.className = cd > 0 ? 'ink-btn disabled' : 'ink-btn';
        btn.disabled = cd > 0;
        btn.textContent = cd > 0 ? `法宝·${specialItem.name}（冷却${cd}回合）` : `法宝·${specialItem.name}`;
        btn.addEventListener('click', () => {
          playClickSound();
          playerUseSpecial(specialId);
        });
        this.els.battleActions.appendChild(btn);
      }

      // 功法技能按钮：已学的战斗功法才显示
      for (const gid of (s.gongfa || [])) {
        const g = GONGFA[gid];
        if (!g || !g.combat || !isGongfaUsable(s, g)) continue;
        const cdKey = 'gong_' + gid;
        const cd = (Game.battle.specialCd && Game.battle.specialCd[cdKey]) || 0;
        const onceUsed = !!g.combat.onceBattle && !!Game.battle.rewardBoostUsed;
        const disabled = cd > 0 || onceUsed;
        const btn = document.createElement('button');
        btn.className = disabled ? 'ink-btn disabled' : 'ink-btn';
        btn.disabled = disabled;
        const manaPct = g.combat.manaPct ?? 0.25;
        const manaCost = manaPct > 0 ? getManaCost(s, manaPct) : 0;
        btn.textContent = cd > 0 ? `${g.icon} ${g.name}（冷却${cd}回合）` : onceUsed ? `${g.icon} ${g.name}（本场已用）` : `${g.icon} ${g.name}（${manaCost > 0 ? `${manaCost}灵力` : '无需灵力'}）`;
        btn.addEventListener('click', () => {
          playClickSound();
          playerCastGongfa(gid);
        });
        this.els.battleActions.appendChild(btn);
      }
    }

    this.updateStats();
  },

  battleEnd(won, nextNodeId) {
    // 显示结果后自动跳转
    setTimeout(() => {
      const s = Game.state;
      if (s) {
        const hpGain = Math.max(1, Math.floor(s.maxHp * 0.20));
        const mpGain = Math.max(1, Math.floor(s.maxMp * 0.20));
        s.hp = Math.min(s.maxHp, s.hp + hpGain);
        s.mp = Math.min(s.maxMp, s.mp + mpGain);
        this.showToast('战后调息：气血与灵力各回复20%');
      }
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

    this.els.topName.textContent = s.title ? `${s.name}「${s.title}」` : s.name;
    this.els.topRealm.textContent = realm.name;

    const hpPct = (s.hp / s.maxHp) * 100;
    this.els.hpFill.style.width = hpPct + '%';
    this.els.hpVal.textContent = `${Math.floor(s.hp)}/${s.maxHp}`;

    const mpPct = (s.mp / s.maxMp) * 100;
    this.els.mpFill.style.width = mpPct + '%';
    this.els.mpVal.textContent = `${Math.floor(s.mp)}/${s.maxMp}`;

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
    if (name === 'stats') this.renderStatDetail();
    if (name === 'loadout') this.renderLoadout();
    if (name === 'achievements') this.updateAchievements();
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
    // 已装备的武器/防具不在背包里，单独列在最前，方便查看/卸下/强化
    for (const slot of EQUIP_SLOTS) {
      const eqId = s.equipment && s.equipment[slot];
      if (eqId && ITEMS[eqId]) {
        const it = ITEMS[eqId];
        if (cat === 'all' || it.type === cat) {
          items.push({ id: eqId, ...it, count: 1, _equipped: true });
        }
      }
    }
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
      const equipped = item._equipped === true;
      const lv = (s.equipLevel && s.equipLevel[item.id]) || 0;
      const enhance = getEquipEnhanceSummary(s, item);
      const usable = !!getItemSlot(item) || item.type === 'pill'
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
          <div class="item-name"${nameStyle}>${item.name}${equipped ? '〔已装备〕' : ''}${equipped && lv > 0 ? ` +${lv}` : ''}</div>
          <div class="item-desc">${item.desc}${item.sell ? ` · 售价${item.sell}灵石` : ''}</div>
          ${enhance ? `<div class="item-desc">强化基础${({ atk: '物攻', matk: '法攻', def: '物抗', mdef: '法抗', pen: '穿透' })[enhance.prefix]}：${enhance.base} → ${enhance.total}（+${enhance.level}/100；百分比词条固定）</div>` : ''}
        </div>
        <div class="item-count">${equipped ? '' : `×${item.count}`}</div>
      `;

      const actions = document.createElement('div');
      actions.className = 'item-actions';

      const useBtn = document.createElement('button');
      useBtn.className = 'item-use';
      if (getItemSlot(item)) {
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
      if (equipped && getItemSlot(item) !== 'artifact') {
        const strBtn = document.createElement('button');
        strBtn.className = 'item-str';
        const nextCost = getEquipStrengthenStoneCost(lv);
        strBtn.textContent = `强化 +${lv}/100（强化石×${nextCost}）`;
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

      if (!equipped && getItemSlot(item) && (lv > 0 || item.rarity === '仙品' || item.rarity === '神品')) {
        const dismantleBtn = document.createElement('button');
        const refundInfo = getEquipDismantleRefund(item, lv);
        dismantleBtn.className = 'item-sell';
        dismantleBtn.textContent = `分解（返强化石×${refundInfo.total}）`;
        dismantleBtn.addEventListener('click', () => {
          const rarityText = refundInfo.rarityRefund ? `（含${item.rarity}装备基础返还×${refundInfo.rarityRefund}）` : '';
          if (!confirm(`确定分解已强化的${item.name} +${lv}？\n将返还装备强化石×${refundInfo.total}${rarityText}，已消耗灵石不返还。`)) return;
          playClickSound();
          const result = dismantleStrengthenedItem(item.id);
          this.showToast(result.ok ? `分解成功，返还装备强化石×${result.refund}` : result.msg);
          if (result.ok) {
            UI.updateBag(cat);
            UI.updateStats();
            UI.renderStatDetail();
          }
        });
        actions.appendChild(dismantleBtn);
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

            if (!equipped && item.sell > 0 && item.count > 1) {
                const sellAllBtn = document.createElement('button');
                sellAllBtn.className = 'item-sell';
                sellAllBtn.textContent = `全部出售×${item.count}`;
                sellAllBtn.addEventListener('click', () => {
                    playClickSound();
                    this.openBatchSellConfirm(item, item.count, cat);
                });
                actions.appendChild(sellAllBtn);
            }

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
      const titleSuffix = ach.title ? ` · 称号「${ach.title}」` : '';
      const div = document.createElement('div');
      div.className = 'ach-item' + (done ? ' done' : ' locked');
      div.innerHTML = `
        <div class="ach-icon">${ach.icon}</div>
        <div class="ach-info">
          <div class="ach-name">${ach.name}</div>
          <div class="ach-desc">${ach.desc}${titleSuffix}</div>
        </div>
      `;
      this.els.achievementList.appendChild(div);
    });
  },

  // ========== 存档面板 ==========
  _formatSaveTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const p = n => (n < 10 ? '0' + n : '' + n);
    return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  },

  _desc(data) {
    const realm = data.realmIndex != null ? getRealm(data.realmIndex).name : '';
    return `${data.name || '无名'} · ${realm || '?'} · ${this._formatSaveTime(data.savedAt)}`;
  },

  updateSaveSlots() {
    const auto = loadGame(0);
    const pid = getPlayerId();
    let html = `<div class="save-pid">玩家编号 <b>${pid}</b><button class="pid-copy" onclick="UI.copyPlayerId()">复制</button></div>`;
    html += '<div class="pane-title" style="margin-top:0">存档概览</div>';
    html += `<div class="save-row"><span class="save-row-label">自动档</span><span class="save-row-info">${auto ? this._desc(auto) : '（空）'}</span></div>`;
    for (let i = 1; i <= 3; i++) {
      const d = loadGame(i);
      html += `<div class="save-row"><span class="save-row-label">存档 ${i}</span><span class="save-row-info">${d ? this._desc(d) : '（空）'}</span></div>`;
    }
    this.els.saveStatus.innerHTML = html;
  },

  copyPlayerId() {
    const pid = getPlayerId();
    const done = () => this.showToast('编号已复制');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pid).then(done).catch(() => this.showToast('复制失败，请手动抄写：' + pid));
    } else {
      this.showToast('复制失败，请手动抄写：' + pid);
    }
  },

  saveToSlot(slot) {
    const ok = saveGame(slot);
    this.showToast(ok ? `存档 ${slot} 已保存` : '保存失败（浏览器存储不可用）');
    this.updateSaveSlots();
  },

  loadFromSlot(slot) {
    const data = loadGame(slot);
    if (!data) {
      this.showToast(`存档 ${slot} 为空`);
      return;
    }
    Game.state = data;
    if (!Game.state.equipLevel) Game.state.equipLevel = {};
    migrateEquipment(Game.state);
    migrateMana(Game.state);
    migrateGacha(Game.state);
    if (!Game.state.tribulations) Game.state.tribulations = {};
    migratePets(Game.state);
    migrateGongfa(Game.state);
    migrateCave(Game.state);
    migrateSect(Game.state);
    migrateArena(Game.state);
    migrateMind(Game.state);
    backfillTribulations(Game.state);
    clampByTribulation(Game.state);
    realignRealm(Game.state);
    migrateUpdateVitals(Game.state);
    migrateLegacyTribulationNode(Game.state);
    goToNode(Game.state.nodeId || 'start');
    this.showToast('读档成功');
    this.closeSidePanel();
  },

  // 导出存档：复制到剪贴板，失败则显示文本框手动复制
  exportSave() {
    const data = loadGame(0);
    if (!data) { this.showToast('暂无自动存档可导出'); return; }
    data.playerId = getPlayerId(); // 注入编号，便于客服对账
    const text = JSON.stringify(data);
    const done = () => this.showToast('存档已复制到剪贴板，请粘贴到记事本/备忘录保存');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => this.showImportBox(text));
    } else {
      this.showImportBox(text);
    }
  },

  // 下载存档文件
  downloadSave() {
    const data = loadGame(0);
    if (!data) { this.showToast('暂无自动存档可下载'); return; }
    const pid = getPlayerId();
    data.playerId = pid; // 注入编号
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `fantu_save_${pid}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    this.showToast('存档文件已下载');
  },

  // 显示导入文本框（可选预填导出的文本）
  showImportBox(text) {
    const box = document.getElementById('import-box');
    const ta = document.getElementById('import-text');
    if (!box || !ta) return;
    if (text) ta.value = text;
    box.classList.remove('hidden');
    setTimeout(() => { ta.focus(); ta.select(); }, 0);
  },

  // 导入存档
  importSave() {
    const ta = document.getElementById('import-text');
    if (!ta) return;
    const text = ta.value.trim();
    if (!text) { this.showToast('请先粘贴存档文本'); return; }
    let data;
    try { data = JSON.parse(text); } catch (e) { this.showToast('存档文本格式错误'); return; }
    if (!data || typeof data !== 'object' || data.name == null) { this.showToast('无效的存档数据'); return; }
    delete data.playerId; // 编号是设备级的，导入时不覆盖本机编号
    Game.state = data;
    if (!Game.state.equipLevel) Game.state.equipLevel = {};
    migrateEquipment(Game.state);
    migrateMana(Game.state);
    migrateGacha(Game.state);
    if (!Game.state.tribulations) Game.state.tribulations = {};
    migratePets(Game.state);
    migrateGongfa(Game.state);
    migrateCave(Game.state);
    migrateSect(Game.state);
    migrateArena(Game.state);
    migrateMind(Game.state);
    backfillTribulations(Game.state);
    clampByTribulation(Game.state);
    realignRealm(Game.state);
    migrateUpdateVitals(Game.state);
    migrateLegacyTribulationNode(Game.state);
    autoSave();
    goToNode(Game.state.nodeId || 'start');
    document.getElementById('import-box').classList.add('hidden');
    this.showToast('存档导入成功');
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
  const critRate = getCritRate(s);
  const critDmg = getCritDmg(s);
  const sect = s.sect && SECTS[s.sect];
  const identity = sect ? `${sect.icon} ${sect.name}弟子` : '云游散修';

  this.els.statDetail.innerHTML = `
    <div class="stat-intro"><div class="stat-intro-name">${s.name || '无名'}${s.title ? `<span class="stat-title">「${s.title}」</span>` : ''}</div><div class="stat-intro-desc">${identity} · ${realm.name}修士</div></div>
    <div class="stat-line"><span class="label">境界</span><span class="value">${realm.name}</span></div>
    <div class="stat-line"><span class="label">修为</span><span class="value">${xp.cur}/${xp.max}</span></div>
    <div class="stat-line"><span class="label">气血</span><span class="value">${Math.floor(s.hp)}/${s.maxHp}</span></div>
    <div class="stat-line"><span class="label">灵力</span><span class="value">${Math.floor(s.mp)}/${s.maxMp}</span></div>
    <div class="stat-line"><span class="label">物攻</span><span class="value">${totalAtk}</span></div>
    <div class="stat-line"><span class="label">法攻</span><span class="value">${totalMatk}</span></div>
    <div class="stat-line"><span class="label">物抗</span><span class="value">${totalDef}</span></div>
    <div class="stat-line"><span class="label">法抗</span><span class="value">${totalMdef}</span></div>
    <div class="stat-line"><span class="label">穿透</span><span class="value">${totalPen}</span></div>
    <div class="stat-line"><span class="label">暴击率</span><span class="value">${Math.round(critRate * 100)}%</span></div>
    <div class="stat-line"><span class="label">暴击伤害</span><span class="value">${critDmg.toFixed(1)}x</span></div>
    <div class="stat-line"><span class="label">灵石</span><span class="value">${s.stone}</span></div>
    <div class="stat-line"><span class="label">名望</span><span class="value">${s.fame}</span></div>
    <div class="stat-line"><span class="label">道韵</span><span class="value">${s.dao}</span></div>
    <div class="stat-line"><span class="label">功法</span><span class="value">${(s.gongfa || []).length} 本</span></div>
  `;

  const lg = LINGGEN[s.linggen];
  let gongfaHtml = '<div style="margin-top:12px;text-align:right"><button class="codex-open-btn" onclick="UI.openGongfaCodex()">📖 功法图鉴</button></div>';
  const gongfaList = s.gongfa || [];
  if (gongfaList.length > 0) {
    gongfaHtml += '<div class="pane-title" style="margin-top:14px">已学功法</div>';
    for (const gid of gongfaList) {
      const g = GONGFA[gid];
      if (!g) continue;
      const sealed = !isGongfaUsable(s, g);
      gongfaHtml += `<div class="gongfa-item" style="border-left:3px solid ${sealed ? '#888' : g.color};${sealed ? 'opacity:.55' : ''}"><span style="font-weight:600">${g.icon} ${g.name}</span> <span style="color:#7a6a4a;font-size:11px">${g.grade}${sealed ? ' · 已封禁' : ''}</span><div style="color:#5c3a1a;font-size:11px;margin-top:2px">${g.desc}${sealed ? '（需重返所属宗门方可使用）' : ''}</div></div>`;
    }
  } else {
    gongfaHtml += '<div class="pane-title" style="margin-top:14px">已学功法</div><div style="color:#7a6a4a;font-size:12px">尚未习得功法。云游寻缘或外出探索，或有奇遇。</div>';
  }
  this.els.linggenDetail.innerHTML = `
    <div class="lg-name" style="color:${lg.color}">${lg.name}</div>
    <div class="lg-skill">天赋灵技：${lg.skill}</div>
    <div class="lg-desc">${lg.desc}</div>
    ${gongfaHtml}
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

// ========== 装备备战页面 ==========
const LOADOUT_SLOT_NAMES = {
  weapon: '装备槽 · 壹', armor: '装备槽 · 贰', artifact: '装备槽 · 叁', shoes: '装备槽 · 肆',
  extra1: '装备槽 · 伍', extra2: '装备槽 · 陆',
};
let _loadoutPickSlot = null;

UI.renderLoadout = function() {
  const s = Game.state;
  if (!s || !this.els.loadoutSlots) return;

  const slotHtml = EQUIP_SLOTS.map(slot => {
    const id = s.equipment && s.equipment[slot];
    const it = id && ITEMS[id];
    const lv = (s.equipLevel && s.equipLevel[id]) || 0;
    let inner;
    if (it) {
      let nameStyle = '';
      if (it.rarity) {
        const tier = GACHA_POOL.find(t => t.rarity === it.rarity);
        if (tier) nameStyle = ` style="color:${tier.color}"`;
      }
      inner = `
        <span class="loadout-item-icon">${it.icon}</span>
        <div class="loadout-item-info">
          <div class="loadout-item-name"${nameStyle}>${it.name}${lv > 0 ? ` +${lv}` : ''}</div>
          <div class="loadout-item-desc">${it.desc || ''}</div>
        </div>
        <div class="loadout-item-remove" onclick="event.stopPropagation();UI.unequipLoadoutSlot('${slot}')">卸</div>
      `;
    } else {
      inner = `<span class="loadout-empty">— 空 —</span>`;
    }
    return `
      <div class="loadout-slot" onclick="UI.openEquipPick('${slot}')">
        <div class="loadout-slot-name">${LOADOUT_SLOT_NAMES[slot]}</div>
        <div class="loadout-slot-body">${inner}</div>
      </div>
    `;
  }).join('');
  this.els.loadoutSlots.innerHTML = slotHtml;

  const atk = getAllEquipBonus(s, 'atk');
  const matk = getAllEquipBonus(s, 'matk');
  const def = getAllEquipBonus(s, 'def');
  const mdef = getAllEquipBonus(s, 'mdef');
  const pen = getAllEquipBonus(s, 'pen');
  const crit = getEquipCritBonus(s);
  const critDmg = getEquipCritDmgBonus(s);
  this.els.loadoutStats.innerHTML = `
    <div class="loadout-stat"><span class="ls-label">物攻</span><b>+${atk}</b></div>
    <div class="loadout-stat"><span class="ls-label">法攻</span><b>+${matk}</b></div>
    <div class="loadout-stat"><span class="ls-label">物抗</span><b>+${def}</b></div>
    <div class="loadout-stat"><span class="ls-label">法抗</span><b>+${mdef}</b></div>
    <div class="loadout-stat"><span class="ls-label">穿透</span><b>+${pen}</b></div>
    <div class="loadout-stat"><span class="ls-label">暴击率</span><b>+${crit}%</b></div>
    <div class="loadout-stat"><span class="ls-label">暴击伤害</span><b>+${critDmg}%</b></div>
  `;
};

UI.openEquipPick = function(slot) {
  const s = Game.state;
  if (!s || !this.els.equipPickOverlay) return;
  _loadoutPickSlot = slot;
  this.els.equipPickTitle.textContent = `选择装备 · ${LOADOUT_SLOT_NAMES[slot] || slot}`;

  // 候选：背包中可装入该槽的 + 其他槽已装备的（可移动过来，排除本槽自身）
  const seen = new Set();
  const candidates = [];
  EQUIP_SLOTS.forEach(sl => {
    if (sl === slot) return;
    const id = s.equipment && s.equipment[sl];
    if (id && ITEMS[id] && canEquipToSlot(ITEMS[id], slot) && !seen.has(id)) {
      seen.add(id);
      candidates.push({ id, source: sl });
    }
  });
  for (const id in s.bag) {
    if (s.bag[id] > 0 && ITEMS[id] && canEquipToSlot(ITEMS[id], slot) && !seen.has(id)) {
      seen.add(id);
      candidates.push({ id });
    }
  }

  if (candidates.length === 0) {
    this.els.equipPickList.innerHTML = '<div class="loadout-empty">没有可放入此槽的装备</div>';
  } else {
    this.els.equipPickList.innerHTML = candidates.map(c => {
      const it = ITEMS[c.id];
      const lv = (s.equipLevel && s.equipLevel[c.id]) || 0;
      let nameStyle = '';
      if (it.rarity) {
        const tier = GACHA_POOL.find(t => t.rarity === it.rarity);
        if (tier) nameStyle = ` style="color:${tier.color}"`;
      }
      return `
        <div class="loadout-pick-item" onclick="UI.pickEquipSlot('${c.id}')">
          <span class="loadout-item-icon">${it.icon}</span>
          <div class="loadout-item-info">
            <div class="loadout-item-name"${nameStyle}>${it.name}${lv > 0 ? ` +${lv}` : ''}</div>
            <div class="loadout-item-desc">${it.desc || ''}${c.source ? '（已装备，将移动）' : ''}</div>
          </div>
        </div>
      `;
    }).join('');
  }
  this.els.equipPickOverlay.classList.remove('hidden');
};

UI.closeEquipPick = function() {
  if (this.els.equipPickOverlay) this.els.equipPickOverlay.classList.add('hidden');
  _loadoutPickSlot = null;
};

UI.pickEquipSlot = function(id) {
  const slot = _loadoutPickSlot;
  if (!slot) return;
  const res = equipToSlot(id, slot);
  this.showToast(res.ok ? '已装备' : res.msg);
  this.closeEquipPick();
  this.renderLoadout();
  this.updateStats();
  this.updateBag('all');
};

UI.unequipLoadoutSlot = function(slot) {
  const s = Game.state;
  const id = s.equipment && s.equipment[slot];
  if (!id) return;
  const name = ITEMS[id] ? ITEMS[id].name : '装备';
  unequipSlot(slot);
  this.showToast(`已卸下${name}`);
  this.renderLoadout();
  this.updateStats();
  this.updateBag('all');
};

// ========== 音效系统（Web Audio 合成） ==========
let _audioCtx = null;
let _soundEnabled = (() => {
  try { return localStorage.getItem('fantu_sound') !== '0'; } catch (e) { return true; }
})();

function ensureAudioCtx() {
  if (!_audioCtx) {
    try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { _audioCtx = null; }
  }
  if (_audioCtx && _audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

// 播放单音：freq 频率、dur 时长、type 波形、vol 音量、delay 延迟秒
function playTone(freq, dur, type = 'sine', vol = 0.15, delay = 0) {
  if (!_soundEnabled) return;
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// 按钮点击：短促清脆
function playClickSound() {
  playTone(760, 0.05, 'triangle', 0.1);
}

// 突破：上行音阶
function playBreakthroughSound() {
  [523, 659, 784, 1047].forEach((f, i) => playTone(f, 0.16, 'sine', 0.14, i * 0.09));
}

// 战斗命中
function playBattleHitSound() {
  playTone(160, 0.09, 'square', 0.11);
  playTone(90, 0.12, 'sawtooth', 0.07, 0.02);
}

// 战斗胜利：上行大调
function playWinSound() {
  [523, 659, 784, 1047].forEach((f, i) => playTone(f, 0.18, 'triangle', 0.13, i * 0.1));
}

// 战斗失败：下行
function playLoseSound() {
  [392, 330, 262, 196].forEach((f, i) => playTone(f, 0.22, 'sine', 0.13, i * 0.14));
}

// 抽卡：琶音
function playGachaSound() {
  [659, 880, 1175, 1568].forEach((f, i) => playTone(f, 0.14, 'triangle', 0.13, i * 0.08));
}

// 渡劫：低鸣 + 上行
function playTribulationSound() {
  playTone(98, 0.5, 'sawtooth', 0.16, 0);
  [392, 523, 659, 784].forEach((f, i) => playTone(f, 0.2, 'sine', 0.14, 0.3 + i * 0.1));
}

// 获得物品：轻快双音
function playItemSound() {
  playTone(660, 0.08, 'triangle', 0.12, 0);
  playTone(990, 0.1, 'triangle', 0.12, 0.07);
}

// 音效开关
function toggleSound() {
  _soundEnabled = !_soundEnabled;
  try { localStorage.setItem('fantu_sound', _soundEnabled ? '1' : '0'); } catch (e) {}
  updateSoundIcon();
  if (_soundEnabled) playClickSound();
}

function updateSoundIcon() {
  const btn = document.getElementById('sound-toggle');
  if (btn) {
    btn.textContent = _soundEnabled ? '🔊' : '🔇';
    btn.classList.toggle('off', !_soundEnabled);
    btn.title = _soundEnabled ? '音效：开' : '音效：关';
  }
}

// ========== BGM 背景音乐 ==========
let _bgmEnabled = (() => {
  try { return localStorage.getItem('fantu_bgm') !== '0'; } catch (e) { return true; }
})();
let _bgmAudio = null;

function getBgmAudio() {
  if (!_bgmAudio) _bgmAudio = document.getElementById('bgm-audio');
  return _bgmAudio;
}

function startBgm() {
  const audio = getBgmAudio();
  if (!audio) return;
  audio.volume = 0.4;
  audio.loop = true;
  audio.muted = false;
  const p = audio.play();
  if (p && typeof p.catch === 'function') {
    p.catch(() => {
      // play() 被自动播放策略或音频未就绪拒绝时重试一次。
      // 注意：若音频 preload 已就绪(readyState>=2)，canplay 早已触发过、不会再触发，需立即重试；
      // 否则同时监听 canplay/loadeddata，等数据就绪后再试。
      const retry = () => {
        if (!_bgmEnabled) return;
        const q = audio.play();
        if (q && typeof q.catch === 'function') q.catch(() => {});
      };
      if (audio.readyState >= 2) {
        retry();
      } else {
        audio.addEventListener('canplay', retry, { once: true });
        audio.addEventListener('loadeddata', retry, { once: true });
      }
    });
  }
}

// 音乐开关
function toggleBgm() {
  _bgmEnabled = !_bgmEnabled;
  try { localStorage.setItem('fantu_bgm', _bgmEnabled ? '1' : '0'); } catch (e) {}
  const audio = getBgmAudio();
  if (_bgmEnabled) {
    if (audio) { const p = audio.play(); if (p && typeof p.catch === 'function') p.catch(() => {}); }
  } else if (audio) {
    audio.pause();
  }
  updateBgmIcon();
}

function updateBgmIcon() {
  const btn = document.getElementById('bgm-toggle');
  if (btn) {
    btn.textContent = _bgmEnabled ? '🎵' : '🔕';
    btn.classList.toggle('off', !_bgmEnabled);
    btn.title = _bgmEnabled ? '音乐：开' : '音乐：关';
  }
}
