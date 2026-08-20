// ========== 游戏状态 ==========
const Game = {
  state: null,
  battle: null,
  currentNode: null,
  delayedTimer: null,
};

// 节点动态文本缓存（供 UI 读取）
let _nodeDynamicText = null;

// 每场战斗最多服用丹药的次数
const MAX_PILLS_PER_BATTLE = 5;

// 玩家攻击力系数（整体削弱，避免打 boss 过快）
const PLAYER_ATK_SCALE = 0.6;

// Boss 动态平衡参数（按玩家当前强度生效，避免玩家一刀秒 Boss / Boss 打不动玩家）
const BOSS_HP_PER_HIT = 8;    // Boss 血量 ≈ 玩家每刀伤害 × 8
const BOSS_ATK_VS_DEF = 1.3;  // Boss 攻击 ≈ 玩家防御 × 1.3（稳定破防）
const BOSS_DEF_VS_ATK = 0.5;  // Boss 防御 ≈ 玩家攻击 × 0.5（玩家每刀约半攻）
const BOSS_DMG_MULT = 1.3;    // Boss 普通攻击伤害倍率（整体加强 Boss 伤害）
const BOSS_HP_MULT = 1.3;     // Boss 血量倍率（整体加厚 Boss 血量）

// 论道台同门名册：避免切磋时总是遇到同一两个固定对手。
const DAO_PEER_NAMES = [
  '顾长风', '沈青萝', '陆惊鸿', '苏晚晴', '萧云澜', '叶知秋',
  '楚凌霄', '宁采薇', '谢无尘', '白玉衡', '柳清弦', '温如玉',
  '秦逐月', '林听雪', '裴玄策', '唐栖梧', '姜明月', '程观澜',
  '方临渊', '宋流云', '洛星河', '韩青棠', '许归真', '钟离墨',
];

function getRandomDaoPeerName(s) {
  const candidates = DAO_PEER_NAMES.filter(name => name !== s.lastDaoPeerName);
  const name = candidates[Math.floor(Math.random() * candidates.length)];
  s.lastDaoPeerName = name;
  return name;
}

// ========== 战斗彩蛋台词（随机触发，仅普通小怪） ==========
const EASTER_EGG_INTRO = [
  '「此子恐怖如斯，断不可留！」——它说得义正辞严，仿佛自己不是先来送死的那一个。',
  '「三十年河东，三十年河西——」敌人话没说完，你提醒它：「这句不是这么用的。」',
  '敌人负手而立：「我为天帝，当镇杀世间一切敌……呃，至少镇杀你。」最后半句明显底气不足。',
  '敌人上下打量你：「就这？本座闭关十年，一觉醒来宗门没了，正好拿你出气。」',
  '「道友请留步。」敌人一脸和善——你心里咯噔一下，申公豹也是这么开场的。',
  '敌人小声嘀咕：「反派死于话多……所以本座决定，先动手，再补台词！」',
];
const EASTER_EGG_PLAYER_ATK = [
  '你心中默念「莫欺少年穷」，气势如虹——然后招式偏了三寸。',
  '你大喊「手握日月摘星辰」，嗓音破音，场面一度十分尴尬。',
  '你摆出「我为天帝」的架势，脚下一滑，顺势改成了一记平砍。',
  '你想起师尊说「打架别废话」，于是你只废话了半句就出手了。',
  '你默念口诀，念到一半忘了词，硬着头皮：「算了，能打到就行。」',
  '「苟住，别浪。」你对自己说，然后一个浪翻，冲了上去。',
];
const EASTER_EGG_ENEMY_ATK = [
  '「吃我这招『修为不够法宝来凑』！」它举起的法宝，怎么看都有点山寨。',
  '「别躲啊，我大招都读条一半了，你躲了怪浪费的。」',
  '敌人边打边喊「我于杀戮中绽放！」你：「你那是挨打中绽放吧。」',
  '「看我这招——诶，打偏了……不，这叫佯攻，是战术！」',
  '敌人喘着粗气骂骂咧咧：「你怎么这么抗揍，我手都打酸了，你改练铁布衫了？」',
  '「反派死于话多」——敌人明显犹豫了一下，最后选择闭嘴，狠狠给你一下。',
];

function rollEasterEgg(list, chance) {
  return Math.random() < chance ? list[Math.floor(Math.random() * list.length)] : null;
}

// ========== 初始化 ==========
function initGame() {
  UI.init();
  // 显示登录/取名界面，由玩家决定继续还是新开
  UI.showLogin();
}

// 开始新游戏（取名）
function startNewGame(name) {
  newGame();
  const s = Game.state;
  if (name && name.trim()) s.name = name.trim();
  clampByTribulation(s);
  realignRealm(s);
  goToNode('start');
}

// 继续上次存档
function continueGame() {
  const saved = loadGame();
  if (!saved) return;
  Game.state = saved;
  if (!Game.state.equipLevel) Game.state.equipLevel = {};
  migrateEquipment(Game.state);
  migrateMana(Game.state);
  migrateGacha(Game.state);
  migrateFinalBossLoot(Game.state);
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
}

function newGame() {
  Game.state = {
    name: '无名',
    linggen: 'fire',
    realmIndex: 0,
    xp: 0,
    maxHp: 100,
    hp: 100,
    maxMp: 44,
    mp: 44,
    atk: 8,
    def: 2,
    matk: 8,
    mdef: 2,
    pen: 0,
    stone: 20,
    fame: 0,
    dao: 0,
    bag: { huiqi_pill: 2 },
    equipment: { weapon: null, armor: null, artifact: null, shoes: null, extra1: null, extra2: null },
    equipLevel: {},
    achievements: [],
    titles: [],
    title: null,
    stats: {
      battleWin: 0,
      battleLoss: 0,
      winStreak: 0,
      enemiesKilled: 0,
    },
    nodeId: 'start',
    flags: {},
    killCount: {},
    signIn: { lastDate: '', streak: 0, total: 0 },
    daily: { date: '', tasks: {}, claimed: {} },
    pet: null,
    pets: [],
    petAutoRelease: {},
    gongfa: [],
    mijing: { floor: 0, best: 0, active: false },
    cave: { level: 1, plots: [] },
    sect: null,
    contribution: 0,
    arena: { score: 0, wins: 0, losses: 0 },
    mind: { xinjing: 0 },
    reincarnation: 0,
  };
}

function resetGame() {
  localStorage.removeItem('fantu_save');
  localStorage.removeItem('fantu_save_bak');
  localStorage.removeItem('fantu_save_1');
  localStorage.removeItem('fantu_save_2');
  localStorage.removeItem('fantu_save_3');
  newGame();
  goToNode('start');
  UI.showToast('已删档重开');
}

function restartGame() {
  // 死亡结局重开：只清自动档，保留手动存档槽，避免误删玩家手动保存的进度
  localStorage.removeItem('fantu_save');
  localStorage.removeItem('fantu_save_bak');
  newGame();
  goToNode('start');
  UI.showToast('已重新开始（手动存档已保留）');
}

// 转世永久加成：每次转世全属性 +5%（乘法叠加）
function getReincarnationBonus(s) {
  return 1 + 0.05 * (s.reincarnation || 0);
}

// 死亡转世重修：默认保留道号/功法/成就，其余清空，从炼气一层重新开始（灵根重新随机）。
// 测试码启用天命护持后，死亡不清档、不降修为，但仍累积同等的转世永久增幅。
function reincarnate(s) {
  const reincarnation = (s.reincarnation || 0) + 1;
  if (s.deathNoReincarnation) {
    s.reincarnation = reincarnation;
    realignRealm(s);
    s.hp = s.maxHp;
    s.mp = s.maxMp;
    goToNode(s.innerGate ? 'inner_gate' : 'start');
    autoSave();
    UI.showToast(`天命护持生效！第 ${reincarnation} 世增幅已叠加，修为与实力完整保留。`);
    return;
  }
  const keep = { name: s.name, gongfa: s.gongfa, achievements: s.achievements, titles: s.titles, title: s.title };
  newGame();
  const ns = Game.state;
  ns.name = keep.name;
  ns.gongfa = keep.gongfa;
  ns.achievements = keep.achievements;
  ns.titles = keep.titles;
  ns.title = keep.title;
  ns.reincarnation = reincarnation;
  realignRealm(ns); // 用炼气一层 + 转世加成重算属性
  goToNode('start');
  autoSave();
  UI.showToast(`转世重修成功！第 ${reincarnation} 世，全属性 +${reincarnation * 5}%`);
}

// ========== 存档 ==========
function saveGame(slot = 0) {
  if (!Game.state) return false;
  const key = slot === 0 ? 'fantu_save' : `fantu_save_${slot}`;
  Game.state.nodeId = Game.currentNode;
  Game.state.realmIndex = getRealmIndex(Game.state);
  Game.state.savedAt = Date.now();
  try {
    // 自动档：写入前先把上一版备份，防止单个存档损坏导致进度全丢
    if (slot === 0) {
      const prev = localStorage.getItem('fantu_save');
      if (prev) {
        try { JSON.parse(prev); localStorage.setItem('fantu_save_bak', prev); } catch (e) { /* 旧档损坏则跳过备份 */ }
      }
    }
    localStorage.setItem(key, JSON.stringify(Game.state));
    return true;
  } catch (e) {
    // 隐私模式禁用存储 / 存储空间已满等情况
    return false;
  }
}

function loadGame(slot = 0) {
  const key = slot === 0 ? 'fantu_save' : `fantu_save_${slot}`;
  const raw = localStorage.getItem(key);
  if (raw) {
    try { return JSON.parse(raw); }
    catch (e) { /* 主档损坏，下面自动档会尝试回退备份 */ }
  }
  // 自动档缺失或损坏：回退上一版备份
  if (slot === 0) {
    const bak = localStorage.getItem('fantu_save_bak');
    if (bak) {
      try { return JSON.parse(bak); } catch (e) { return null; }
    }
  }
  return null;
}

function autoSave() {
  saveGame(0);
  // 天机榜：内部自带「未登榜不上传 / 数据没变不上传 / 60 秒节流 / 战斗中跳过」，绝大多数调用会直接返回
  if (window.LB) LB.onSave();
}

// ========== 玩家编号 ==========
// 每台设备生成一次唯一编号，独立于存档存储，删档重开编号不变，用于客服对账/定位问题
function genPlayerId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除易混淆的 0/O/1/I/L
  let id = 'F';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function getPlayerId() {
  let id = null;
  try { id = localStorage.getItem('fantu_uid'); } catch (e) { /* 隐私模式可能禁用存储 */ }
  if (!id) {
    id = genPlayerId();
    try { localStorage.setItem('fantu_uid', id); } catch (e) { /* 存不进去则本次会话内一致 */ }
  }
  return id;
}

// ========== 灵根 ==========
function rollLinggen(s) {
  const keys = Object.keys(LINGGEN);
  s.linggen = keys[Math.floor(Math.random() * keys.length)];
}

// ========== 境界 ==========
// 仙帝（idx 35）之后的无限境界命名：循环尊号 + 重天
const REALM_NAMES_BEYOND = ['圣人', '道祖', '混沌', '鸿蒙', '无量', '无极'];
const REALM_LAST_FIXED_IDX = REALMS.length - 1; // 35，仙帝

// 统一境界访问：idx < REALMS.length 用固定数组，之后用公式无限生成
function getRealm(idx) {
  if (idx < REALMS.length) return REALMS[idx];
  const n = idx - REALM_LAST_FIXED_IDX; // 仙帝后第 n 个境界（n >= 1）
  const honor = REALM_NAMES_BEYOND[(n - 1) % REALM_NAMES_BEYOND.length];
  const tier = Math.floor((n - 1) / REALM_NAMES_BEYOND.length);
  const name = tier === 0 ? honor : `${honor}${tier + 1}重天`;
  return {
    name,
    max: Math.round(1750000 * Math.pow(1.24, n)),
    atk: Math.round(15000 * Math.pow(1.10, n)),
    def: Math.round(2560 * Math.pow(1.10, n)),
  };
}

function getRealmIndex(s) {
  const xp = s.xp;
  const lastFixedMax = REALMS[REALMS.length - 1].max;
  if (xp < lastFixedMax) {
    // 二分在固定境界内查找
    let lo = 0, hi = REALMS.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (xp < REALMS[mid].max) hi = mid; else lo = mid + 1;
    }
    return lo;
  }
  // 仙帝之后：按公式累加找境界（累计上限指数增长，循环次数极低）
  let idx = REALMS.length - 1;
  while (xp >= getRealm(idx).max) idx++;
  return idx;
}

function getRealmInfo(s) {
  if (!s) s = Game.state;
  const idx = getRealmIndex(s);
  return getRealm(idx);
}

function getXpToNext(s) {
  const idx = getRealmIndex(s);
  const prev = idx > 0 ? getRealm(idx - 1).max : 0;
  let cur = s.xp - prev;
  const max = getRealm(idx).max - prev;
  if (cur > max) cur = max; // 防御性 clamp（无限境界下正常不会触发）
  return { cur, max };
}

// ========== 渡劫门槛 ==========
const TRIBULATION_GATES = [
  { gateIdx: 9,  key: 'zhuji',    name: '筑基' },
  { gateIdx: 13, key: 'jindan',   name: '金丹' },
  { gateIdx: 17, key: 'yuanying', name: '元婴' },
  { gateIdx: 21, key: 'huashen',  name: '化神' },
  { gateIdx: 25, key: 'feisheng', name: '飞升' },
];

function getTribulationGateForIndex(idx) {
  const fixed = TRIBULATION_GATES.find(g => g.gateIdx === idx);
  if (fixed) return fixed;
  // 飞升后，每一个仙境小境界的突破都需渡劫。
  if (idx >= 26) {
    const next = getRealm(idx + 1);
    return { gateIdx: idx, key: `immortal_${idx}`, name: `${next.name}` };
  }
  return null;
}

function getCurrentTribulationGate(s) {
  const gate = getTribulationGateForIndex(getRealmIndex(s));
  if (!gate || (s.tribulations && s.tribulations[gate.key])) return null;
  return gate;
}

function isTribulationReady(s, gate = getCurrentTribulationGate(s)) {
  return !!gate && s.xp >= getRealm(gate.gateIdx).max - 1;
}

function getTribulationBattleConfig(gate) {
  return {
    turns: 5 + Math.min(5, Math.floor(gate.gateIdx / 6)),
    tribDmg: 0.10,
  };
}

function getTribulationReturnNode(s) {
  return getRealmIndex(s) < 14 ? 'qingyun_gate' : 'inner_gate';
}

// 修复旧存档：根据当前境界补齐已渡过的天劫 flag（防止高境界玩家因 flag 缺失被错误卡回）
function backfillTribulations(s) {
  if (!s.tribulations) s.tribulations = {};
  const idx = getRealmIndex(s);
  for (const g of TRIBULATION_GATES) {
    if (idx >= g.gateIdx + 1) s.tribulations[g.key] = true;
  }
  // 版本更新前已处于仙境的玩家，视为已渡过历史仙劫，避免上线后倒退。
  for (let i = 26; i < idx; i++) {
    const g = getTribulationGateForIndex(i);
    if (g) s.tribulations[g.key] = true;
  }
  // 旧存档兼容：已达成飞升成就的，补飞升 flag，避免被错误卡回化神大圆满
  if (s.achievements && s.achievements.includes('trib_feisheng')) {
    s.tribulations.feisheng = true;
  }
}

// 未渡劫则修为被卡在大圆满，无法跨越大境界
function clampByTribulation(s, skipTribulations = false) {
  if (!s.tribulations) s.tribulations = {};
  const maxIdx = getRealmIndex(s);
  for (let i = 0; i <= maxIdx; i++) {
    const g = getTribulationGateForIndex(i);
    if (g && !s.tribulations[g.key] && s.xp >= getRealm(g.gateIdx).max) {
      if (skipTribulations) {
        s.tribulations[g.key] = true;
        continue;
      }
      s.xp = getRealm(g.gateIdx).max - 1;
      UI.showToast(`境界桎梏：需渡过${g.name}天劫方可晋升`);
      return;
    }
  }
}

// 渡劫成功：设置 flag 并将修为提升到下一大境界
function passTribulation(s, key, gateIdx) {
  if (!s.tribulations) s.tribulations = {};
  s.tribulations[key] = true;
  const oldIdx = getRealmIndex(s);
  const threshold = getRealm(gateIdx).max;
  if (s.xp < threshold) s.xp = threshold;
  const newIdx = getRealmIndex(s);
  if (newIdx > oldIdx) {
    breakthrough(s, oldIdx, newIdx);
  }
  updateStatsFromRealm(s);
  autoSave();
  playTribulationSound();
}

function addXp(s, amount, skipTribulations = false) {
  const oldIdx = getRealmIndex(s);
  s.xp += amount;
  clampByTribulation(s, skipTribulations);
  const newIdx = getRealmIndex(s);
  if (newIdx > oldIdx) {
    // 突破
    breakthrough(s, oldIdx, newIdx);
  }
  updateStatsFromRealm(s);
}

function breakthrough(s, oldIdx, newIdx) {
  const newRealm = getRealm(newIdx);
  // 每突破一个小境界都加点
  for (let i = oldIdx + 1; i <= newIdx; i++) {
    const r = getRealm(i);
    s.maxHp = Math.floor((r.max * 0.6 + 50) * getReincarnationBonus(s)) + getGongfaBonus(s, 'hp') + getXinjingHpBonus(s);
    s.atk = r.atk;
    s.def = r.def;
    s.matk = r.atk;
    s.mdef = r.def;
  }
  s.hp = s.maxHp;
  s.maxMp = getMaxMp(s);
  s.mp = s.maxMp;
  UI.showToast(`突破！${newRealm.name}`);
  playBreakthroughSound();
  if (newIdx >= 10) grantAchievement('realm_zhuji');
  if (newIdx >= 14) grantAchievement('realm_jindan');
  if (newIdx >= 18) grantAchievement('realm_yuanying');
  if (newIdx >= 22) grantAchievement('realm_huashen');
}

function updateStatsFromRealm(s) {
  const r = getRealmInfo(s);
  // 基础属性随境界增长，但装备加成在 UI 侧叠加
  s.atkBase = r.atk;
  s.defBase = r.def;
  s.matkBase = r.atk;
  s.mdefBase = r.def;
}

// 依据当前修为重新对齐境界属性（用于纠正旧存档/渡劫后）
function realignRealm(s) {
  const r = getRealmInfo(s);
  s.maxHp = Math.floor((r.max * 0.6 + 50) * getReincarnationBonus(s)) + getGongfaBonus(s, 'hp') + getXinjingHpBonus(s);
  s.atk = r.atk;
  s.def = r.def;
  s.matk = r.atk;
  s.mdef = r.def;
  s.atkBase = r.atk;
  s.defBase = r.def;
  s.matkBase = r.atk;
  s.mdefBase = r.def;
  if (s.hp > s.maxHp) s.hp = s.maxHp;
  s.maxMp = getMaxMp(s);
  if (typeof s.mp !== 'number') s.mp = s.maxMp;
  if (s.mp > s.maxMp) s.mp = s.maxMp;
}

function startUnifiedTribulation() {
  const s = Game.state;
  const gate = getCurrentTribulationGate(s);
  if (!isTribulationReady(s, gate)) {
    UI.showToast('修为尚未圆满，暂不可引动天劫');
    return;
  }
  s.pendingTribulation = { key: gate.key, gateIdx: gate.gateIdx };
  if (s.tribulationBlessing) {
    UI.showToast('天道庇佑，无需渡劫！');
    goToNode('tribulation_blessed');
  } else {
    goToNode('tribulation_battle');
  }
}

function completePendingTribulation(s) {
  const pending = s.pendingTribulation;
  const gate = pending && getTribulationGateForIndex(pending.gateIdx);
  if (!gate || gate.key !== pending.key || !isTribulationReady(s, gate)) return false;
  passTribulation(s, gate.key, gate.gateIdx);
  s.pendingTribulation = null;
  grantAchievement('survive_tribulation');
  const achievements = { jindan: 'trib_jindan', yuanying: 'trib_yuanying', huashen: 'trib_huashen', feisheng: 'trib_feisheng' };
  if (achievements[gate.key]) grantAchievement(achievements[gate.key]);
  return true;
}

// 新装备使用明确 slot；旧存档仍可由旧 effect 推断槽位。
function getItemSlot(item) {
  if (!item) return null;
  if (item.slot) return item.slot;
  if (item.type === 'armor' || (item.effect && (item.effect.startsWith('def') || item.effect.startsWith('mdef')))) return 'armor';
  if (item.type === 'artifact' || item.special) return 'artifact';
  return item.type === 'weapon' ? 'weapon' : null;
}

// 判断某件装备能否装入指定槽位：6 个槽全通用，装任意可装备物（不重复由 equipToSlot 保证）
function canEquipToSlot(item, slot) {
  if (!item) return false;
  if (!EQUIP_SLOTS.includes(slot)) return false;
  return !!getItemSlot(item);
}

// 卸下指定槽位的装备回背包（空槽返回 false）
function unequipSlot(slot) {
  const s = Game.state;
  const id = s.equipment && s.equipment[slot];
  if (!id) return false;
  s.equipment[slot] = null;
  grantItem(s, id, 1);
  return true;
}

// 将装备穿戴到指定槽位（供备战页面选装备弹窗）；内置「不重复」校验。
// 若该装备已装备在其他槽，则先卸下再装入目标槽（即「移动」而非复制）。
function equipToSlot(id, targetSlot) {
  const s = Game.state;
  const item = ITEMS[id];
  if (!item || !canEquipToSlot(item, targetSlot)) return { ok: false, msg: '该装备无法放入此槽位' };
  const occupied = EQUIP_SLOTS.find(slot => s.equipment[slot] === id);
  if (occupied && occupied === targetSlot) return { ok: false, msg: '该装备已在此槽位' };
  if (!hasItem(id) && !occupied) return { ok: false, msg: '背包中没有这件装备' };
  // 已装备在其他槽：先卸下回背包
  if (occupied) {
    s.equipment[occupied] = null;
    grantItem(s, id, 1);
  }
  // 目标槽已有装备，先放回背包
  if (s.equipment[targetSlot]) grantItem(s, s.equipment[targetSlot], 1);
  s.equipment[targetSlot] = id;
  removeItemFromState(s, id, 1);
  return { ok: true };
}

function migrateEquipment(s) {
  if (!s.bag || typeof s.bag !== 'object') s.bag = {};
  if (!s.equipment || typeof s.equipment !== 'object') s.equipment = {};
  if (!s.equipLevel || typeof s.equipLevel !== 'object') s.equipLevel = {};
  for (const slot of EQUIP_SLOTS) {
    if (s.equipment[slot] == null) s.equipment[slot] = null;
  }
  // 旧存档强化等级原样保留；仅修正异常值，避免更新后装备等级丢失或超出新上限。
  Object.keys(s.equipLevel).forEach(id => {
    const level = Math.floor(Number(s.equipLevel[id]) || 0);
    s.equipLevel[id] = Math.max(0, Math.min(EQUIP_MAX_LEVEL, level));
  });
}

function getMaxMp(s) {
  const r = getRealmInfo(s);
  return Math.max(40, Math.floor(40 + r.atk * 0.5));
}

function migrateMana(s) {
  const maxMp = getMaxMp(s);
  if (typeof s.maxMp !== 'number' || s.maxMp <= 0) s.maxMp = maxMp;
  else s.maxMp = maxMp;
  if (typeof s.mp !== 'number' || s.mp < 0) s.mp = s.maxMp;
  if (s.mp > s.maxMp) s.mp = s.maxMp;
}

function migrateGacha(s) {
  // 仙品仍是 100 抽保底；累计获得 3 件仙品后，开启持续 100 抽的神品保底窗口。
  if (typeof s.gachaSinceXian !== 'number' || s.gachaSinceXian < 0) s.gachaSinceXian = 0;
  s.gachaSinceXian = Math.min(99, Math.floor(s.gachaSinceXian));
  if (typeof s.gachaXianCount !== 'number' || s.gachaXianCount < 0) s.gachaXianCount = 0;
  if (typeof s.gachaShenPityRemaining !== 'number' || s.gachaShenPityRemaining < 0) {
    // 兼容旧版本已积累三件仙品、但尚未来得及触发神品的存档。
    s.gachaShenPityRemaining = s.gachaXianCount >= 3 ? GACHA_PITY : 0;
  }
  s.gachaShenPityRemaining = Math.min(GACHA_PITY, Math.floor(s.gachaShenPityRemaining));
  s.gachaXianCount = Math.min(2, Math.floor(s.gachaXianCount));
  // v41 起重新计算两池各抽取档位前十次的八折资格；历史抽取不占次数。
  if (s.gachaDiscountV41 !== true) {
    for (const pool of ['gacha', 'petGacha']) {
      for (const size of ['Single', 'Ten', 'Hundred', 'Thousand']) s[`${pool}Discount${size}Uses`] = 0;
    }
    s.gachaDiscountV41 = true;
  }
  for (const pool of ['gacha', 'petGacha']) {
    for (const size of ['Single', 'Ten', 'Hundred', 'Thousand']) {
      const key = `${pool}Discount${size}Uses`;
      s[key] = Math.max(0, Math.min(GACHA_DISCOUNT_USES, Math.floor(s[key] || 0)));
    }
  }
}

function getGachaDiscountKey(pool, count) {
  const size = ({ 1: 'Single', 10: 'Ten', 100: 'Hundred', 1000: 'Thousand' })[count];
  if (!size) throw new Error(`不支持的抽取数量：${count}`);
  return `${pool === 'pet' ? 'petGacha' : 'gacha'}Discount${size}Uses`;
}

function getGachaPurchaseInfo(s, pool, count) {
  migrateGacha(s);
  const isPet = pool === 'pet';
  const baseCost = (isPet ? PET_GACHA_COST : GACHA_COST) * count;
  const key = getGachaDiscountKey(pool, count);
  const used = s[key] || 0;
  const discounted = used < GACHA_DISCOUNT_USES;
  return { cost: Math.floor(baseCost * (discounted ? GACHA_DISCOUNT_RATE : 1)), discounted, used, remaining: Math.max(0, GACHA_DISCOUNT_USES - used) };
}

function payGachaPurchase(s, pool, count, label) {
  const info = getGachaPurchaseInfo(s, pool, count);
  if (s.stone < info.cost) {
    UI.showToast(`灵石不足（${label}需 ${info.cost}）`);
    return null;
  }
  s.stone -= info.cost;
  const key = getGachaDiscountKey(pool, count);
  if (info.discounted) s[key]++;
  return info;
}

// 本次更新后，所有已有玩家首次登录均恢复满状态；新档天然为满值。
function migrateUpdateVitals(s) {
  if (s.updateVitalsFullV1) return;
  s.hp = s.maxHp;
  s.mp = s.maxMp;
  s.updateVitalsFullV1 = true;
}

// 旧版按境界拆分的渡劫节点仅作存档兼容，统一回到渡劫台。
function migrateLegacyTribulationNode(s) {
  const legacy = new Set([
    'zhuji_prep', 'zhuji_tribulation', 'zhuji_success', 'zhuji_fail',
    'jindan_prep', 'jindan_tribulation', 'jindan_success', 'jindan_fail',
    'yuanying_prep', 'yuanying_tribulation', 'yuanying_success', 'yuanying_fail',
    'huashen_prep', 'huashen_tribulation', 'huashen_success', 'huashen_fail',
    'feisheng_prep', 'feisheng_tribulation', 'feisheng_success', 'feisheng_fail',
  ]);
  if (legacy.has(s.nodeId)) s.nodeId = 'tribulation_hall';
}

function getManaCost(s, pct) {
  return Math.max(6, Math.ceil((s.maxMp || getMaxMp(s)) * pct));
}

function restoreBattleMana(s) {
  const gain = Math.max(1, Math.floor(s.maxMp * 0.12));
  s.mp = Math.min(s.maxMp, s.mp + gain);
  return gain;
}

// ===== 装备槽位：6 个通用槽（备战页），同一装备在 6 槽中不能重复 =====
const EQUIP_SLOTS = ['weapon', 'armor', 'artifact', 'shoes', 'extra1', 'extra2'];

// 装备强化只成长 effect 中的固定基础属性；百分比、减伤、额外回合等特殊词条恒定不变。
const EQUIP_MAX_LEVEL = 100;
const EQUIP_FIRST_HALF_LEVELS = 50;
const EQUIP_FIRST_HALF_RATE = 0.02;
const EQUIP_SECOND_HALF_RATE = 0.03;

// 暴击（来自装备法宝加成）
const CRIT_RATE_BASE = 0.05;   // 基础暴击率
const CRIT_RATE_CAP = 0.60;    // 暴击率上限
const CRIT_DMG_BASE = 2.0;     // 基础暴击伤害倍率
const CRIT_DMG_CAP = 3.0;      // 暴击伤害倍率上限

function getEquipFlatAttribute(item) {
  if (!item || !item.effect) return null;
  const match = item.effect.match(/^(atk|matk|def|mdef|pen)(\d+)$/);
  return match ? { prefix: match[1], base: parseInt(match[2], 10) || 0 } : null;
}

function getEquipStrengthenStoneCost(level) {
  return Math.floor(Math.max(0, level) / 5) + 1;
}

function getEquipStrengthenStoneSpent(level) {
  let total = 0;
  for (let current = 0; current < Math.max(0, level); current++) total += getEquipStrengthenStoneCost(current);
  return total;
}

function getEquipEnhanceSummary(s, item) {
  const attr = getEquipFlatAttribute(item);
  if (!attr) return null;
  const level = Math.max(0, Math.min(EQUIP_MAX_LEVEL, (s.equipLevel && s.equipLevel[item.id]) || 0));
  const earlyGain = Math.max(1, Math.floor(attr.base * EQUIP_FIRST_HALF_RATE));
  const lateGain = Math.max(1, Math.floor(attr.base * EQUIP_SECOND_HALF_RATE));
  const earlyLevels = Math.min(level, EQUIP_FIRST_HALF_LEVELS);
  const lateLevels = Math.max(0, level - EQUIP_FIRST_HALF_LEVELS);
  return {
    ...attr,
    level,
    earlyGain,
    lateGain,
    total: attr.base + earlyLevels * earlyGain + lateLevels * lateGain,
    nextStoneCost: level < EQUIP_MAX_LEVEL ? getEquipStrengthenStoneCost(level) : 0,
  };
}

// 读取装备槽中某前缀属性的固定加成（含强化等级）。
function getEquipBonus(s, slot, prefix) {
  const id = s.equipment && s.equipment[slot];
  if (!id) return 0;
  const it = ITEMS[id];
  const info = getEquipEnhanceSummary(s, it);
  return !info || info.prefix !== prefix ? 0 : info.total;
}

function getAllEquipBonus(s, prefix) {
  return EQUIP_SLOTS.reduce((total, slot) => total + getEquipBonus(s, slot, prefix), 0);
}

// 暴击：读取装备法宝中的 crit（暴击率%）与 critDmg（暴击伤害%）加成
function getEquipCritBonus(s) {
  return EQUIP_SLOTS.reduce((total, slot) => {
    const id = s.equipment && s.equipment[slot];
    const it = id && ITEMS[id];
    return total + (it && it.crit ? it.crit : 0);
  }, 0);
}

function getEquipCritDmgBonus(s) {
  return EQUIP_SLOTS.reduce((total, slot) => {
    const id = s.equipment && s.equipment[slot];
    const it = id && ITEMS[id];
    return total + (it && it.critDmg ? it.critDmg : 0);
  }, 0);
}

function getCritRate(s) {
  return Math.min(CRIT_RATE_CAP, CRIT_RATE_BASE + getEquipCritBonus(s) / 100);
}

function getCritDmg(s) {
  return Math.min(CRIT_DMG_CAP, CRIT_DMG_BASE + getEquipCritDmgBonus(s) / 100);
}

// 判定一次是否暴击；暴击则返回放大后的伤害
function applyCrit(s, dmg) {
  if (Math.random() < getCritRate(s)) {
    return { dmg: Math.floor(dmg * getCritDmg(s)), isCrit: true };
  }
  return { dmg, isCrit: false };
}

// ========== 灵宠 ==========
// 迁移旧存档：现在每只灵宠均有唯一 uid，避免神品重复时互相覆盖。
function migratePets(s) {
  if (!Array.isArray(s.pets)) s.pets = [];
  const oldEquipped = s.pet;
  if (s.pet && typeof s.pet === 'object') {
    const old = s.pet;
    if (old.id && !s.pets.some(p => p.id === old.id && (p.level || 1) === (old.level || 1))) {
      s.pets.push({ id: old.id, level: old.level || 1 });
    }
  }
  const used = new Set();
  s.pets = s.pets.filter(p => p && PETS[p.id]).map((p, index) => {
    let uid = p.uid || `pet_${p.id}_${index}_${Date.now().toString(36)}`;
    while (used.has(uid)) uid += '_1';
    used.add(uid);
    const level = Math.max(1, p.level || 1);
    // 旧档若已有独立技能等级，完整保留；没有时按已有等级补齐进阶对应的技能等级。
    const entry = {
      ...p, uid, level, exp: p.exp || 0,
      skillLevel: Math.max(Math.floor(level / 10), p.skillLevel || 0),
      favor: p.favor || 0, favorExp: p.favorExp || 0,
      // 囤囤鼠旧存档补齐偷宝计数；不影响其他灵宠。
      bossStealMisses: Math.max(0, p.bossStealMisses || 0),
      bossStealDuplicateStreak: Math.max(0, p.bossStealDuplicateStreak || 0),
    };
    // 老玩家福利：历史神品灵宠补发一次随机神品天赋；已有天赋绝不改动。
    if (PETS[entry.id].quality === '神品' && !getPetTrait(entry)) entry.trait = rollDivineTrait(entry.id);
    return entry;
  });
  if (typeof oldEquipped === 'string' && s.pets.some(p => p.uid === oldEquipped)) s.pet = oldEquipped;
  else {
    const equipped = s.pets.find(p => p.id === (typeof oldEquipped === 'object' ? oldEquipped.id : oldEquipped));
    s.pet = equipped ? equipped.uid : null;
  }
  if (!s.pet && s.pets.length > 0) s.pet = s.pets[0].uid;
  if (!s.petAutoRelease || typeof s.petAutoRelease !== 'object') s.petAutoRelease = {};
}

// 迁移旧存档：确保 s.gongfa 是已学功法数组
function migrateGongfa(s) {
  if (!Array.isArray(s.gongfa)) s.gongfa = [];
}

// ========== 洞府经营 ==========
function migrateCave(s) {
  if (!s.cave || typeof s.cave !== 'object') s.cave = { level: 1, plots: [] };
  if (!s.cave.level) s.cave.level = 1;
  if (!Array.isArray(s.cave.plots)) s.cave.plots = [];
  s.cave.plots = s.cave.plots.filter(p => p && HERBS[p.herb]);
}

function getCaveInfo(s) {
  if (!s) s = Game.state;
  migrateCave(s);
  const lv = Math.min(s.cave.level, CAVE_LEVELS.length);
  const conf = CAVE_LEVELS[lv - 1];
  return { level: lv, conf, plots: s.cave.plots, maxPlots: conf.plots, xpBonus: conf.xpBonus };
}

// 洞府修炼加成（作用于闭关修炼）
function getCaveXpBonus(s) {
  if (!s) s = Game.state;
  return getCaveInfo(s).xpBonus;
}

// 种植灵药到第一块空闲田
function plantHerb(s, herbId) {
  const c = getCaveInfo(s);
  const herb = HERBS[herbId];
  if (!herb) return { ok: false, msg: '未知灵药' };
  if (c.plots.length >= c.maxPlots) return { ok: false, msg: '灵田已满，请先收获或升级洞府' };
  if ((s.stone || 0) < herb.seed) return { ok: false, msg: `灵石不足（需 ${herb.seed}）` };
  s.stone -= herb.seed;
  s.cave.plots.push({ herb: herbId, plantedAt: Date.now() });
  autoSave();
  return { ok: true, msg: `种下了${herb.name}` };
}

// 收获某块田
function harvestPlot(s, index) {
  const c = getCaveInfo(s);
  const plot = c.plots[index];
  if (!plot) return { ok: false, msg: '没有这块田' };
  const herb = HERBS[plot.herb];
  const now = Date.now();
  if (now - plot.plantedAt < herb.growMs) {
    const remain = Math.ceil((herb.growMs - (now - plot.plantedAt)) / 60000);
    return { ok: false, msg: `${herb.name} 尚未成熟（约 ${remain} 分钟）` };
  }
  s.cave.plots.splice(index, 1);
  const y = herb.yield;
  let text = `收获 ${herb.name}：`;
  if (y.stone) { s.stone += y.stone; text += `灵石 +${y.stone}`; }
  if (y.item) { grantItem(s, y.item, y.count || 1); const it = ITEMS[y.item]; text += `${it ? it.name : '道具'} ×${y.count || 1}`; }
  if (y.xp) { addXp(s, y.xp); text += `修为 +${y.xp}`; }
  if (y.dao) { s.dao += y.dao; text += `道韵 +${y.dao}`; }
  grantAchievement('cave_harvest');
  autoSave();
  return { ok: true, msg: text };
}

// 升级洞府
function upgradeCave(s) {
  const c = getCaveInfo(s);
  if (c.level >= CAVE_LEVELS.length) return { ok: false, msg: '洞府已满级' };
  const next = CAVE_LEVELS[c.level];
  if ((s.stone || 0) < next.cost) return { ok: false, msg: `灵石不足（需 ${next.cost}）` };
  s.stone -= next.cost;
  s.cave.level = c.level + 1;
  if (s.cave.level >= 3) grantAchievement('cave_lv3');
  if (s.cave.level >= 7) grantAchievement('cave_lv7');
  autoSave();
  return { ok: true, msg: `洞府升到 ${s.cave.level} 级，灵田 +1，修炼加成提升` };
}

// ========== 宗门系统 ==========
function migrateSect(s) {
  if (!s.sect || !SECTS[s.sect]) s.sect = null;
  if (typeof s.contribution !== 'number') s.contribution = 0;
}

function getSectInfo(s) {
  if (!s) s = Game.state;
  if (!s.sect) return null;
  return SECTS[s.sect];
}

function joinSect(s, sectId) {
  const sect = SECTS[sectId];
  if (!sect) return;
  s.sect = sectId;
  s.contribution = 0;
  grantAchievement('sect_join');
  autoSave();
}

const SECT_TRANSFER_COST = 1000;

function changeSect(s, sectId) {
  if (sectId && !SECTS[sectId]) return { ok: false, msg: '目标宗门不存在' };
  if (!s.sect) return { ok: false, msg: '当前已是散修，请直接加入宗门' };
  if (s.sect === sectId) return { ok: false, msg: '你已在该宗门' };
  if ((s.contribution || 0) < SECT_TRANSFER_COST) return { ok: false, msg: `贡献不足，转换门派需要 ${SECT_TRANSFER_COST} 贡献` };
  s.contribution -= SECT_TRANSFER_COST;
  s.sect = sectId || null;
  const learned = [];
  if (sectId) {
    for (const id of Object.keys(GONGFA)) {
      const g = GONGFA[id];
      if (g.sect === sectId && !s.gongfa.includes(id)) {
        s.gongfa.push(id);
        learned.push(g.name);
      }
    }
  }
  realignRealm(s);
  updateStatsFromRealm(s);
  autoSave();
  const target = sectId ? SECTS[sectId].name : '散修';
  return { ok: true, msg: `已转入${target}。旧门派绝学已封禁${learned.length ? `，习得：${learned.map(name => `【${name}】`).join('、')}` : ''}` };
}

// 宗门被动加成
function getSectBonus(s, prefix) {
  const sect = getSectInfo(s);
  if (!sect || !sect.bonus) return 0;
  return sect.bonus[prefix] || 0;
}

// 完成宗门任务
function doSectTask(s, taskId) {
  const task = SECT_TASKS.find(t => t.id === taskId);
  if (!task) return { ok: false, msg: '未知任务' };
  if (!s.sect) return { ok: false, msg: '尚未加入宗门' };
  if (getRealmIndex(s) < (task.minRealm || 0)) return { ok: false, msg: `修为不足，需达到${getRealm(task.minRealm).name}` };
  if (task.cost && task.cost.item) {
    const need = task.cost.count || 1;
    if (!hasItem(task.cost.item, need)) {
      const it = ITEMS[task.cost.item];
      return { ok: false, msg: `材料不足（需 ${it ? it.name : task.cost.item} ×${need}）` };
    }
    removeItemFromState(s, task.cost.item, need);
  }
  s.contribution = (s.contribution || 0) + task.reward;
  if (s.contribution >= 300) grantAchievement('sect_contrib');
  autoSave();
  return { ok: true, msg: `任务完成，贡献 +${task.reward}` };
}

// 贡献商店购买
function buySectItem(s, shopId) {
  const item = SECT_SHOP.find(x => x.id === shopId);
  if (!item) return { ok: false, msg: '未知商品' };
  if ((s.contribution || 0) < item.cost) return { ok: false, msg: `贡献不足（需 ${item.cost}）` };
  s.contribution -= item.cost;
  const r = item.reward;
  let text = `兑换 ${item.name}：`;
  if (r.stone) { s.stone += r.stone; text += `灵石 +${r.stone}`; }
  if (r.item) { grantItem(s, r.item, r.count || 1); const it = ITEMS[r.item]; text += `${it ? it.name : '道具'} ×${r.count || 1}`; }
  if (r.dao) { s.dao += r.dao; text += `道韵 +${r.dao}`; }
  if (r.gongfa) { const res = learnGongfa(s, r.gongfa); text += res.duplicate ? `功法重复，转 ${res.refund} 灵石` : `功法【${res.name}】`; }
  autoSave();
  return { ok: true, msg: text };
}

// 宗门讨伐任务：进入一场战斗，胜利后获得贡献
function startSectHunt(taskId) {
  const s = Game.state;
  if (!s.sect) return;
  const task = SECT_TASKS.find(t => t.id === taskId && t.cost && t.cost.battle);
  if (!task) return;
  if (getRealmIndex(s) < (task.minRealm || 0)) {
    UI.showToast(`修为不足，需达到${getRealm(task.minRealm).name}`);
    return;
  }
  const enemyId = task.cost.enemy;
  const enemyData = ENEMIES[enemyId];
  if (!enemyData) return;
  const orig = { atk: s.atk, def: s.def, matk: s.matk, mdef: s.mdef, pen: s.pen };
  s.atk = getTotalAtk(s);
  s.def = getTotalDef(s);
  s.matk = getTotalMatk(s);
  s.mdef = getTotalMdef(s);
  s.pen = getTotalPen(s);
  const winCb = () => {
    s.atk = orig.atk; s.def = orig.def; s.matk = orig.matk; s.mdef = orig.mdef; s.pen = orig.pen;
    s.contribution = (s.contribution || 0) + task.reward;
    if (s.contribution >= 300) grantAchievement('sect_contrib');
    checkAchievements();
    autoSave();
  };
  const loseCb = () => {
    s.atk = orig.atk; s.def = orig.def; s.matk = orig.matk; s.mdef = orig.mdef; s.pen = orig.pen;
    s.hp = Math.max(1, Math.floor(s.maxHp * 0.3));
  };
  startBattle(enemyId, 1.0, winCb, loseCb, 'sect_tasks', 'sect_tasks');
  UI.els.battleOverlay.classList.remove('hidden');
  UI.updateBattle();
}

// ========== 竞技斗法 ==========
function migrateArena(s) {
  if (!s.arena || typeof s.arena !== 'object') s.arena = { score: 0, wins: 0, losses: 0 };
  if (typeof s.arena.score !== 'number') s.arena.score = 0;
  if (typeof s.arena.wins !== 'number') s.arena.wins = 0;
  if (typeof s.arena.losses !== 'number') s.arena.losses = 0;
}

function getArenaTier(score) {
  let cur = ARENA_TIERS[0];
  for (const t of ARENA_TIERS) {
    if (score >= t.min) cur = t;
    else break;
  }
  return cur;
}

function getArenaLadderText(s) {
  const score = (s.arena && s.arena.score) || 0;
  const list = ARENA_LADDER.map(e => ({ name: e.name, score: e.score }));
  list.push({ name: s.name + '（你）', score, me: true });
  list.sort((a, b) => b.score - a.score);
  const rank = list.findIndex(e => e.me) + 1;
  let text = `你的排名：第 ${rank} 名\n\n`;
  list.forEach((e, i) => {
    text += `${i + 1}. ${e.name}　${e.score}\n`;
  });
  return text;
}

// 生成同阶对手
function genArenaOpponent(s) {
  const r = getRealmInfo(s);
  const surname = ARENA_NAMES[Math.floor(Math.random() * ARENA_NAMES.length)];
  const title = ['散修', '剑客', '道人', '仙子', '狂徒'][Math.floor(Math.random() * 5)];
  const factor = 0.85 + Math.random() * 0.3; // 0.85~1.15
  return {
    name: surname + '·' + title,
    hp: Math.floor((r.max * 0.5 + 50) * factor),
    atk: Math.floor(r.atk * factor),
    def: Math.floor(r.def * factor),
    matk: Math.floor(r.atk * factor),
    mdef: Math.floor(r.def * factor),
    pen: Math.floor(10 * factor),
  };
}

// ========== 心魔试炼 ==========
function migrateMind(s) {
  if (!s.mind || typeof s.mind !== 'object') s.mind = { xinjing: 0 };
  if (typeof s.mind.xinjing !== 'number') s.mind.xinjing = 0;
}

function getXinjing(s) {
  if (!s) s = Game.state;
  return (s.mind && s.mind.xinjing) || 0;
}
function getXinjingBonus(s) {
  return Math.floor(getXinjing(s) * 0.5);
}
function getXinjingHpBonus(s) {
  return getXinjing(s) * 5;
}
function getMindInfo(s) {
  if (!s) s = Game.state;
  return { xinjing: getXinjing(s), bonus: getXinjingBonus(s), hpBonus: getXinjingHpBonus(s) };
}

// 触发心魔（随机事件或战斗）
function triggerXinmo(s) {
  if (Math.random() < 0.35) {
    goToNode('xinmo_battle');
  } else {
    const ev = XINMO_EVENTS[Math.floor(Math.random() * XINMO_EVENTS.length)];
    Game.currentXinmo = ev;
    Game.xinmoResult = null;
    goToNode('xinmo_event');
  }
}

// 应用心魔选择题结果
function applyXinmoChoice(delta) {
  const s = Game.state;
  s.mind = s.mind || { xinjing: 0 };
  const before = s.mind.xinjing || 0;
  s.mind.xinjing = Math.max(0, before + delta);
  const diff = s.mind.xinjing - before;
  Game.currentXinmo = null;
  realignRealm(s);
  if (s.mind.xinjing >= 100) grantAchievement('xinjing_100');
  autoSave();
  Game.xinmoResult = diff >= 0 ? `心境 +${diff}（当前 ${s.mind.xinjing}）。道心愈发坚定。` : `心境 ${diff}（当前 ${s.mind.xinjing}）。需砥砺道心。`;
  goToNode('xinmo_result');
}

// 获取当前出战灵宠（背包条目）
function getEquippedPet(s) {
  if (!s) s = Game.state;
  if (!s.pet) return null;
  return (s.pets || []).find(p => p.uid === s.pet) || null;
}

function getPetStage(entry) { return Math.floor((entry.level || 1) / 10); }
function getPetMaxLevel(entry) {
  const pet = PETS[entry.id];
  const base = (pet && PET_MAX_LEVEL[pet.quality]) || 50;
  return base + ((entry.star || 1) - 1) * 10;
}
// 升到下一级所需经验：100 × 等级²，越往后越难
function getPetExpToNext(level) { return 100 * level * level; }
// 灵宠经验值：1 灵石 = 1 经验；兽粮 +40、灵兽丹 +200
function getPetItemExp(itemId) { return itemId === 'lingshou_dan' ? 200 : 40; }
function getPetSkillRank(entry) { return Math.max(getPetStage(entry), entry.skillLevel || 0); }
function getPetQualityGrowth(pet) { return PET_QUALITY_GROWTH[pet.quality] || PET_QUALITY_GROWTH['废品']; }
function getPetTrait(entry) { return entry && entry.trait ? DIVINE_PET_TRAITS[entry.trait.id] : null; }

function rollDivineTrait(petId) {
  const weights = petId === 'shenlong'
    ? [['follow', 55], ['shield', 20], ['mana', 15], ['resist', 10]]
    : [['shield', 35], ['mana', 35], ['resist', 20], ['follow', 10]];
  let roll = Math.random() * 100;
  for (const [id, weight] of weights) { roll -= weight; if (roll <= 0) return { id }; }
  return { id: weights[0][0] };
}

function getPetStatBonus(s, entry, stat) {
  const pet = PETS[entry.id];
  if (!pet) return 0;
  const lv = entry.level || 1;
  const stage = getPetStage(entry);
  const fixed = (pet.base[stat] || 0) + (pet.growth[stat] || 0) * (lv - 1) * (1 + stage * 0.45);
  const conf = getPetQualityGrowth(pet);
  const owner = stat === 'atk' ? (s.atkBase || s.atk) : stat === 'matk' ? (s.matkBase != null ? s.matkBase : (s.atkBase || s.atk)) : stat === 'def' ? (s.defBase || s.def) : stat === 'mdef' ? (s.mdefBase != null ? s.mdefBase : (s.defBase || s.def)) : (s.atkBase || s.atk) * 0.25;
  let affinity = 1;
  if (pet.affinity === 'attack') affinity = ['atk', 'matk', 'pen'].includes(stat) ? 1.35 : 0.78;
  if (pet.affinity === 'guard') affinity = ['def', 'mdef'].includes(stat) ? 1.35 : 0.78;
  const percent = owner * conf.pct * (1 + stage * 0.20) * affinity;
  const starMult = 1 + ((entry.star || 1) - 1) * 0.03;
  return Math.floor((fixed + percent) * starMult);
}

// 好感度 → 技能概率系数：0 级 0.5 → 满级 1.5（线性）
function getPetFavorMult(entry) {
  const favor = entry.favor || 0;
  return 0.5 + (favor / PET_FAVOR_MAX) * 1.0;
}
// 好感度信息（等级/进度/百分比），供 UI 渲染
function getPetFavorInfo(entry) {
  return {
    favor: entry.favor || 0,
    favorExp: entry.favorExp || 0,
    max: PET_FAVOR_MAX,
    expPerLevel: PET_FAVOR_EXP_PER_LEVEL,
    pct: Math.min(100, Math.round(((entry.favorExp || 0) / PET_FAVOR_EXP_PER_LEVEL) * 100)),
  };
}
function getPetSkillChance(entry) {
  const pet = PETS[entry.id];
  return Math.min(0.85, pet.skillChance * getPetQualityGrowth(pet).skillChance * (1 + getPetSkillRank(entry) * 0.12) * getPetFavorMult(entry));
}
function getPetSkillMult(entry) {
  const pet = PETS[entry.id];
  return pet.skillMult * getPetQualityGrowth(pet).skillPower * (1 + getPetSkillRank(entry) * 0.18);
}
// 囤囤鼠闪避率：基础 + 每阶 + 满好感加成，封顶
function getTuntunshuDodgeRate(entry) {
  const favor = entry.favor || 0;
  return Math.min(TUNTUNSHU_DODGE_CAP, TUNTUNSHU_DODGE_BASE + getPetStage(entry) * TUNTUNSHU_DODGE_PER_STAGE + (favor / PET_FAVOR_MAX) * TUNTUNSHU_DODGE_FAVOR_MAX);
}

// 终局 Boss 神藏与囤囤鼠偷取各自独立保底、独立重复保护。
// 老存档的魔尊进度迁移到六位终局 Boss 共用的进度，避免更新后吃亏。
function migrateFinalBossLoot(s) {
  const legacyMisses = Math.max(0, s.demonLordLootMisses || 0);
  const legacyDuplicateStreak = Math.max(0, s.demonLordLootDuplicateStreak || 0);
  s.finalBossLootMisses = Math.max(0, s.finalBossLootMisses ?? legacyMisses);
  s.finalBossLootDuplicateStreak = Math.max(0, s.finalBossLootDuplicateStreak ?? legacyDuplicateStreak);
}

// 囤囤鼠偷 Boss 专属装备：等级、十级进阶和好感共同成长，满培养为 0.1%。
function getTuntunshuBossStealRate(entry) {
  const maxLevel = Math.max(1, getPetMaxLevel(entry));
  const levelRatio = Math.min(1, Math.max(0, (entry.level || 1) / maxLevel));
  const maxStage = Math.max(1, Math.floor(maxLevel / 10));
  const stageRatio = Math.min(1, Math.max(0, getPetStage(entry) / maxStage));
  const favorRatio = Math.min(1, Math.max(0, (entry.favor || 0) / PET_FAVOR_MAX));
  return TUNTUNSHU_BOSS_STEAL_BASE_CHANCE
    + levelRatio * TUNTUNSHU_BOSS_STEAL_LEVEL_MAX_BONUS
    + stageRatio * TUNTUNSHU_BOSS_STEAL_STAGE_MAX_BONUS
    + favorRatio * TUNTUNSHU_BOSS_STEAL_FAVOR_MAX_BONUS;
}

function ownsTuntunshuLoot(s, itemId) {
  return (s.bag && s.bag[itemId] > 0) || Object.values(s.equipment || {}).includes(itemId);
}
// 囤囤鼠带主人闪避：成功返回 0（免伤），否则返回原伤害
function tryPetDodge(s, dmg) {
  const entry = getEquippedPet(s);
  if (!entry || entry.id !== 'tuntunshu' || dmg <= 0) return dmg;
  if (Math.random() < getTuntunshuDodgeRate(entry)) {
    logBattle(`【囤囤鼠】眼疾手快，叼着你的衣角一个翻滚，堪堪躲开了这一击！`, 'player');
    return 0;
  }
  return dmg;
}
// 囤囤鼠战后偷取：偷灵石、偷材料、极低概率偷 Boss 掉落，返回额外日志文本
function tuntunshuSteal(s, e, stoneGain) {
  const entry = getEquippedPet(s);
  if (!entry || entry.id !== 'tuntunshu') return '';
  const parts = [];
  if (stoneGain > 0 && Math.random() < TUNTUNSHU_STEAL_CHANCE) {
    const steal = Math.max(1, Math.floor(stoneGain * TUNTUNSHU_STEAL_STONE_PCT));
    s.stone += steal;
    parts.push(`顺手牵羊偷了 ${steal} 灵石`);
  }
  if (e.drops && e.drops.length) {
    const materialDrops = e.drops.filter(d => ITEMS[d.id] && ITEMS[d.id].type === 'material');
    if (materialDrops.length && Math.random() < TUNTUNSHU_STEAL_CHANCE) {
      const d = materialDrops[Math.floor(Math.random() * materialDrops.length)];
      grantItem(s, d.id, 1);
      parts.push(`偷来一份${ITEMS[d.id].name}`);
    }
  }
  // 偷神藏：仅限中后期 Boss。连续 2000 次合资格胜利未得时，本次保底获得。
  if (TUNTUNSHU_STEAL_BOSSES.includes(e.id)) {
    const misses = Math.max(0, entry.bossStealMisses || 0);
    const guaranteed = misses >= TUNTUNSHU_BOSS_STEAL_PITY - 1;
    if (guaranteed || Math.random() < getTuntunshuBossStealRate(entry)) {
      const missingLoot = TUNTUNSHU_BOSS_LOOT.filter(id => !ownsTuntunshuLoot(s, id));
      const protectDuplicates = (entry.bossStealDuplicateStreak || 0) >= 4 && missingLoot.length > 0;
      const pool = protectDuplicates ? missingLoot : TUNTUNSHU_BOSS_LOOT;
      const d = pool[Math.floor(Math.random() * pool.length)];
      const isDuplicate = ownsTuntunshuLoot(s, d);
      entry.bossStealMisses = 0;
      entry.bossStealDuplicateStreak = isDuplicate ? (entry.bossStealDuplicateStreak || 0) + 1 : 0;
      grantItem(s, d, 1);
      const guaranteeText = guaranteed ? '（2000 次保底）' : '';
      const protectText = protectDuplicates ? '（重复保护）' : '';
      parts.push(`竟从 ${e.name} 身上顺走了一件${ITEMS[d].name}！！${guaranteeText}${protectText}`);
      grantAchievement('tuntun_theft');
    } else {
      entry.bossStealMisses = misses + 1;
    }
  }
  return parts.length ? `囤囤鼠${parts.join('，')}！` : '';
}

function tryFinalBossLoot(s, e) {
  if (!isFinalBoss(e)) return '';
  // 神藏只能由囤囤鼠偷取；未出战囤囤鼠时，终局 Boss 不再独立掉落神藏。
  const pet = getEquippedPet(s);
  if (!pet || pet.id !== 'tuntunshu') return '';
  const misses = Math.max(0, s.finalBossLootMisses || 0);
  const guaranteed = misses >= FINAL_BOSS_LOOT_PITY - 1;
  if (!guaranteed && Math.random() >= FINAL_BOSS_LOOT_CHANCE) {
    s.finalBossLootMisses = misses + 1;
    return '';
  }
  const missingLoot = TUNTUNSHU_BOSS_LOOT.filter(id => !ownsTuntunshuLoot(s, id));
  const protectDuplicates = (s.finalBossLootDuplicateStreak || 0) >= 4 && missingLoot.length > 0;
  const pool = protectDuplicates ? missingLoot : TUNTUNSHU_BOSS_LOOT;
  const itemId = pool[Math.floor(Math.random() * pool.length)];
  const duplicate = ownsTuntunshuLoot(s, itemId);
  s.finalBossLootMisses = 0;
  s.finalBossLootDuplicateStreak = duplicate ? (s.finalBossLootDuplicateStreak || 0) + 1 : 0;
  grantItem(s, itemId, 1);
  if (typeof UI !== 'undefined' && UI.showBossLootCelebration) UI.showBossLootCelebration(ITEMS[itemId], e.name);
  return `${e.name}遗落了一件${ITEMS[itemId].name}！${guaranteed ? '（2000 次保底）' : ''}${protectDuplicates ? '（重复保护）' : ''}`;
}

function getEquipStoneDropChance(s) {
  let chance = EQUIP_STONE_DROP_CHANCE * (1 + (Game.battle.rewardBoost || 0));
  const pet = getEquippedPet(s);
  if (pet && pet.id === 'tuntunshu') chance *= TUNTUNSHU_EQUIP_STONE_DROP_MULTIPLIER;
  return Math.min(1, chance);
}

function tryEquipStoneDrop(s, e) {
  if (!isFinalBoss(e)) return '';
  const chance = getEquipStoneDropChance(s);
  if (Math.random() >= chance) return '';
  grantItem(s, 'equip_stone', 1);
  return `掉落：装备强化石×1（掉率${Math.round(chance * 100)}%）`;
}

// 灵宠喜好判断：likes.food / likes.decor 支持单个或多个（数组）
function petLikeFood(pet, taste) {
  const f = pet && pet.likes && pet.likes.food;
  return Array.isArray(f) ? f.includes(taste) : f === taste;
}
function petLikeDecor(pet, style) {
  const d = pet && pet.likes && pet.likes.decor;
  return Array.isArray(d) ? d.includes(style) : d === style;
}

// 送灵宠零食/装饰：投其所好 ×2、送错 ×0.5，叠加好感进度，进度满升 1 级
function feedPetTreat(s, petId, itemId) {
  const item = ITEMS[itemId];
  if (!item || !item.favor) { UI.showToast('该物品不能送灵宠'); return null; }
  const entry = s.pets.find(p => p.uid === petId);
  if (!entry) { UI.showToast('找不到这只灵宠'); return null; }
  if ((s.bag[itemId] || 0) <= 0) { UI.showToast('没有该礼物'); return null; }
  const pet = PETS[entry.id];
  const liked = (item.cat === 'food' && petLikeFood(pet, item.taste)) || (item.cat === 'decor' && petLikeDecor(pet, item.style));
  const gain = liked ? Math.floor(item.favor * 2) : Math.floor(item.favor * 0.5);
  const before = entry.favor || 0;
  if (before >= PET_FAVOR_MAX) {
    UI.showToast(`${pet.name} 好感已满（${PET_FAVOR_MAX}级），不能再提升`);
    return { gained: 0, favor: before, favorExp: entry.favorExp || 0, liked, isMax: true };
  }
  s.bag[itemId] -= 1;
  let favor = before;
  let favorExp = (entry.favorExp || 0) + gain;
  while (favorExp >= PET_FAVOR_EXP_PER_LEVEL && favor < PET_FAVOR_MAX) {
    favorExp -= PET_FAVOR_EXP_PER_LEVEL;
    favor++;
  }
  if (favor >= PET_FAVOR_MAX) favorExp = 0;
  entry.favor = favor;
  entry.favorExp = favorExp;
  const up = favor - before;
  const tag = liked ? '（投其所好）' : '（不感兴趣）';
  UI.showToast(`${pet.name} 收到 ${item.name}，好感 +${gain}${tag}${up > 0 ? `，好感提升至 ${favor} 级！` : ''}`);
  autoSave(); UI.updateStats();
  return { gained: gain, favor, favorExp, liked, leveledUp: up };
}

// 抽到的宠物入背包；勾选自动放生的非神品会立即折算灵石，神品始终保留。
function addPetToBag(s, petId) {
  if (!Array.isArray(s.pets)) s.pets = [];
  const pet = PETS[petId];
  if (!pet) return null;
  const entry = { id: petId, uid: `pet_${petId}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`, level: 1, star: 1, favor: 0, favorExp: 0 };
  if (pet.quality === '神品') entry.trait = rollDivineTrait(petId);
  entry.skillLevel = 0;
  if (pet.quality !== '神品' && s.petAutoRelease && s.petAutoRelease[pet.quality]) {
    const refund = PET_REFUND[pet.quality] || 0;
    s.stone += refund;
    return { ...entry, autoReleased: true, refund };
  }
  s.pets.push(entry);
  if (!s.pet) s.pet = entry.uid;
  return entry;
}

function getPetBonus(s, stat) {
  const entry = getEquippedPet(s);
  if (!entry) return 0;
  return getPetStatBonus(s, entry, stat);
}

// 灵宠抽奖：按权重随机，可能抽到宠物或喂养道具（神品保底仅作用于宠物）
function rollPetOnce(s) {
  s.petGachaCount = (s.petGachaCount || 0) + 1;
  if (s.petSinceShen == null) s.petSinceShen = 0;
  const shenTier = PET_GACHA_POOL.find(t => t.rarity === '神品');
  let tier;
  if (s.petSinceShen >= PET_GACHA_PITY - 1) {
    tier = shenTier;
  } else {
    let roll = Math.random() * 100;
    tier = PET_GACHA_POOL[0];
    for (const t of PET_GACHA_POOL) {
      if (roll < t.weight) { tier = t; break; }
      roll -= t.weight;
    }
  }
  if (tier === shenTier) { s.petSinceShen = 0; } else { s.petSinceShen++; }
  const pickId = tier.items[Math.floor(Math.random() * tier.items.length)];
  if (tier.type === 'item') {
    return { type: 'item', item: ITEMS[pickId], rarity: tier.rarity, color: tier.color };
  }
  return { type: 'pet', pet: PETS[pickId], rarity: tier.rarity, color: tier.color };
}

function petGachaDraw() {
  const result = petGachaDrawMany(1, '抽灵宠');
  return result ? result.list[0] : null;
}

function petGachaDrawMany(count, label) {
  const s = Game.state;
  const purchase = payGachaPurchase(s, 'pet', count, label);
  if (!purchase) return null;
  const list = [];
  for (let i = 0; i < count; i++) {
    const r = rollPetOnce(s);
    if (r.type === 'item') {
      grantItem(s, r.item.id, 1);
    } else {
      const entry = addPetToBag(s, r.pet.id);
      r.autoReleased = !!(entry && entry.autoReleased);
      r.refund = entry && entry.refund || 0;
    }
    list.push(r);
  }
  autoSave();
  UI.updateStats();
  return { list, drawCount: count, cost: purchase.cost, discounted: purchase.discounted };
}

// 十连抽灵宠：抽到的宠物与喂养道具全部入包，同名重复转灵石
function petGachaDrawTen() {
  return petGachaDrawMany(10, '十连');
}

// 百连抽灵宠
function petGachaDrawHundred() {
  return petGachaDrawMany(100, '百连');
}

function petGachaDrawThousand() {
  return petGachaDrawMany(1000, '千连');
}

// 灵宠零食/装饰转盘：按权重随机，抽出道具入包
function rollTreatOnce(s) {
  s.treatGachaCount = (s.treatGachaCount || 0) + 1;
  let roll = Math.random() * 100;
  let tier = PET_TREAT_POOL[0];
  for (const t of PET_TREAT_POOL) {
    if (roll < t.weight) { tier = t; break; }
    roll -= t.weight;
  }
  const pickId = tier.items[Math.floor(Math.random() * tier.items.length)];
  return { type: 'item', item: ITEMS[pickId], rarity: tier.rarity, color: tier.color };
}

function treatGachaDraw() {
  const s = Game.state;
  if (s.stone < PET_TREAT_COST) { UI.showToast(`灵石不足（需 ${PET_TREAT_COST}）`); return null; }
  s.stone -= PET_TREAT_COST;
  const r = rollTreatOnce(s);
  grantItem(s, r.item.id, 1);
  r.granted = true;
  autoSave();
  UI.updateStats();
  return r;
}

function treatGachaDrawTen() {
  const s = Game.state;
  const cost = PET_TREAT_COST * 10;
  if (s.stone < cost) { UI.showToast(`灵石不足（十连需 ${cost}）`); return null; }
  s.stone -= cost;
  const list = [];
  for (let i = 0; i < 10; i++) {
    const r = rollTreatOnce(s);
    grantItem(s, r.item.id, 1);
    list.push(r);
  }
  autoSave();
  UI.updateStats();
  return { list };
}

function treatGachaDrawHundred() {
  const s = Game.state;
  const cost = Math.floor(PET_TREAT_COST * 100 * 0.8);
  if (s.stone < cost) { UI.showToast(`灵石不足（百连需 ${cost}）`); return null; }
  s.stone -= cost;
  const list = [];
  for (let i = 0; i < 100; i++) {
    const r = rollTreatOnce(s);
    grantItem(s, r.item.id, 1);
    list.push(r);
  }
  autoSave();
  UI.updateStats();
  return { list };
}

// 出战某只灵宠
function equipPet(petId) {
  const s = Game.state;
  const entry = s.pets.find(p => p.uid === petId);
  if (!entry) { UI.showToast('你没有这只灵宠'); return false; }
  s.pet = petId;
  UI.showToast(`${PETS[entry.id].name} 已出战！`);
  autoSave();
  UI.updateStats();
  return true;
}

// 给灵宠加经验，自动处理升级（受等级上限约束）；返回本次升级的级数
function addPetExp(entry, amount) {
  if (!entry || amount <= 0) return 0;
  const maxLv = getPetMaxLevel(entry);
  let lv = entry.level || 1;
  let exp = entry.exp || 0;
  const beforeStage = getPetStage(entry);
  exp += amount;
  let levelUps = 0;
  while (lv < maxLv && exp >= getPetExpToNext(lv)) {
    exp -= getPetExpToNext(lv);
    lv++;
    levelUps++;
  }
  if (lv >= maxLv) exp = 0; // 到顶后多余经验清零
  entry.level = lv;
  entry.exp = exp;
  const afterStage = getPetStage(entry);
  if (afterStage > beforeStage) entry.skillLevel = Math.max(entry.skillLevel || 0, afterStage);
  return levelUps;
}

// 灵石喂养：消耗灵石换取经验（1 灵石 = 1 经验），一次补满当前等级升 1 级
function feedPet(petId) {
  const s = Game.state;
  if (!petId) petId = s.pet;
  if (!petId) { UI.showToast('你还没有灵宠'); return false; }
  const entry = s.pets.find(p => p.uid === petId);
  if (!entry) return false;
  const pet = PETS[entry.id];
  const lv = entry.level || 1;
  const maxLv = getPetMaxLevel(entry);
  if (lv >= maxLv) { UI.showToast(`${pet.name} 已达等级上限（${maxLv}级），升星可突破`); return false; }
  const need = getPetExpToNext(lv) - (entry.exp || 0); // 升 1 级还差的经验 = 所需灵石
  if (s.stone < need) { UI.showToast(`灵石不足（升1级需${need}灵石）`); return false; }
  s.stone -= need;
  addPetExp(entry, need);
  UI.showToast(`${pet.name} 提升至 ${entry.level} 级！`);
  autoSave();
  UI.updateStats();
  return true;
}

// 用喂养道具加经验：兽粮 +40、灵兽丹 +200；count 可批量
function feedPetByItem(petId, itemId, count) {
  const s = Game.state;
  if (!petId) petId = s.pet;
  if (!petId) { UI.showToast('你还没有灵宠'); return false; }
  const entry = s.pets.find(p => p.uid === petId);
  if (!entry) return false;
  const have = (s.bag && s.bag[itemId]) || 0;
  if (have <= 0) { UI.showToast('没有该喂养道具'); return false; }
  const pet = PETS[entry.id];
  const lv = entry.level || 1;
  const maxLv = getPetMaxLevel(entry);
  if (lv >= maxLv) { UI.showToast(`${pet.name} 已达等级上限（${maxLv}级），升星可突破`); return false; }
  count = Math.max(1, Math.min(count || 1, have));
  const perExp = getPetItemExp(itemId);
  removeItemFromState(s, itemId, count);
  const before = lv;
  addPetExp(entry, perExp * count);
  const leveled = entry.level - before;
  UI.showToast(`${pet.name} 获得 ${perExp * count} 经验${leveled > 0 ? `，提升至 ${entry.level} 级` : ''}${leveled > 1 ? `（连升${leveled}级）` : ''}！`);
  autoSave();
  UI.updateStats();
  return true;
}

// 放生灵宠：转为灵石
function releasePet(petId) {
  const s = Game.state;
  if (!petId) petId = s.pet;
  const idx = s.pets.findIndex(p => p.uid === petId);
  if (idx < 0) return false;
  const pet = PETS[s.pets[idx].id];
  const refund = PET_REFUND[pet.quality] || 0;
  s.pets.splice(idx, 1);
  s.stone += refund;
  if (s.pet === petId) {
    s.pet = s.pets.length > 0 ? s.pets[0].uid : null;
  }
  UI.showToast(`放生了 ${pet.name}，获得 ${refund} 灵石`);
  autoSave();
  UI.updateStats();
  return true;
}

// 对当前勾选品质批量放生：保护出战灵宠与全部神品，统一结算一次。
function releasePetsByQualities(s, qualities) {
  const selected = new Set((qualities || []).filter(q => q && q !== '神品'));
  if (!selected.size) return { count: 0, refund: 0 };
  const released = (s.pets || []).filter(p => {
    const pet = PETS[p.id];
    return pet && p.uid !== s.pet && pet.quality !== '神品' && selected.has(pet.quality);
  });
  if (!released.length) return { count: 0, refund: 0 };
  const releasedIds = new Set(released.map(p => p.uid));
  const refund = released.reduce((sum, p) => sum + (PET_REFUND[PETS[p.id].quality] || 0), 0);
  s.pets = s.pets.filter(p => !releasedIds.has(p.uid));
  s.stone += refund;
  autoSave();
  return { count: released.length, refund };
}

// 灵宠升星：3 只同名同星宠物合成 1 只星级+1 的主宠（每星全属性 +10%）
function starUpPet(petId) {
  const s = Game.state;
  if (!petId) petId = s.pet;
  if (!petId) { UI.showToast('你还没有灵宠'); return false; }
  const entry = s.pets.find(p => p.uid === petId);
  if (!entry) return false;
  const pet = PETS[entry.id];
  const star = entry.star || 1;
  const cost = PET_STAR_COST[pet.quality] || 100;
  // 找另外两只同名同星（且不是主宠自身）的宠物
  const others = s.pets.filter(p => p.id === entry.id && p.uid !== entry.uid && (p.star || 1) === star);
  if (others.length < 2) {
    UI.showToast(`升星需 3 只同名${star}星宠物，还差 ${2 - others.length} 只（当前同星 ${others.length} 只）`);
    return false;
  }
  if (s.stone < cost) {
    UI.showToast(`灵石不足（升星需 ${cost} 灵石）`);
    return false;
  }
  // 消耗 2 只素材 + 灵石
  for (let i = 0; i < 2; i++) {
    const idx = s.pets.findIndex(p => p.uid === others[i].uid);
    if (idx >= 0) s.pets.splice(idx, 1);
  }
  s.stone -= cost;
  entry.star = star + 1;
  UI.showToast(`✨ ${pet.name} 升为 ${star + 1} 星！全属性 +5%（累计 +${star * 5}%），消耗 ${cost} 灵石`);
  autoSave();
  UI.updateStats();
  return true;
}

// 灵宠战斗助攻：有概率触发技能造成额外伤害
function petAssist(ownerDamage) {
  const s = Game.state;
  const entry = getEquippedPet(s);
  if (!entry || !ownerDamage || ownerDamage <= 0) return;
  const pet = PETS[entry.id];
  if (!pet || Game.battle.ended) return;
  if (pet.id === 'tuntunshu') return; // 囤囤鼠不追加伤害，靠闪避+偷取
  if (Math.random() < getPetSkillChance(entry)) {
    const e = Game.battle.enemy;
    const rawDamage = Math.max(1, Math.floor(s.atk * getPetSkillMult(entry)) + (entry.level || 1) * 4 - getEnemyDefense(e, false) + (s.pen || 0));
    const dmg = Math.min(rawDamage, Math.max(1, Math.floor(ownerDamage * 0.5)));
    const actualDamage = dealDamageToEnemy(e, dmg);
    logBattle(`【${pet.name}】吐出${pet.skill}，对 ${e.name} 造成 ${actualDamage} 点伤害！`, 'player');
    checkBattleEnd();
  }
}

// 计算五维属性（含装备与灵宠）：物攻/法攻/物抗/法抗/穿透
function getTotalAtk(s) {
  let atk = s.atkBase || s.atk;
  atk += getAllEquipBonus(s, 'atk');
  atk += getPetBonus(s, 'atk');
  atk += getGongfaBonus(s, 'atk');
  atk += getSectBonus(s, 'atk');
  atk += getXinjingBonus(s);
  if (s.equipment && s.equipment.weapon === 'tun_tushenjian') atk *= 1.10;
  return Math.floor(atk * PLAYER_ATK_SCALE * getReincarnationBonus(s));
}
function getTotalMatk(s) {
  let matk = (s.matkBase != null) ? s.matkBase : (s.atkBase || s.atk);
  matk += getAllEquipBonus(s, 'matk');
  matk += getPetBonus(s, 'matk');
  matk += getGongfaBonus(s, 'matk');
  matk += getSectBonus(s, 'matk');
  matk += getXinjingBonus(s);
  if (s.equipment && s.equipment.weapon === 'tun_canglongqiang') matk *= 1.10;
  return Math.floor(matk * PLAYER_ATK_SCALE * getReincarnationBonus(s));
}
function getTotalDef(s) {
  let def = s.defBase || s.def;
  def += getAllEquipBonus(s, 'def');
  def += getPetBonus(s, 'def');
  def += getGongfaBonus(s, 'def');
  def += getSectBonus(s, 'def');
  def += getXinjingBonus(s);
  return Math.floor(def * getReincarnationBonus(s));
}
function getTotalMdef(s) {
  let mdef = (s.mdefBase != null) ? s.mdefBase : (s.defBase || s.def);
  mdef += getAllEquipBonus(s, 'mdef');
  mdef += getPetBonus(s, 'mdef');
  mdef += getGongfaBonus(s, 'mdef');
  mdef += getSectBonus(s, 'mdef');
  mdef += getXinjingBonus(s);
  return Math.floor(mdef * getReincarnationBonus(s));
}
function getTotalPen(s) {
  let pen = s.pen || 0;
  pen += getAllEquipBonus(s, 'pen');
  pen += getPetBonus(s, 'pen');
  pen += getGongfaBonus(s, 'pen');
  pen += getSectBonus(s, 'pen');
  pen += getXinjingBonus(s);
  return Math.floor(pen * getReincarnationBonus(s));
}

// ========== 功法 ==========
// 累加已学功法的某一类被动加成
function getGongfaBonus(s, prefix) {
  let total = 0;
  const list = s.gongfa;
  if (!Array.isArray(list)) return 0;
  for (const id of list) {
    const g = GONGFA[id];
    if (g && g.type === prefix && isGongfaUsable(s, g)) total += g.value;
  }
  return total;
}

function isGongfaUsable(s, gongfa) {
  return !!gongfa && (!gongfa.sect || s.sect === gongfa.sect);
}

// 学习功法：加入已学列表；重复获得则转灵石补偿
function learnGongfa(s, id) {
  const g = GONGFA[id];
  if (!g) return { duplicate: false, refund: 0, name: '' };
  if (!Array.isArray(s.gongfa)) s.gongfa = [];
  if (s.gongfa.includes(id)) {
    const refund = GONGFA_REFUND[g.grade] || 100;
    s.stone += refund;
    return { duplicate: true, refund, name: g.name };
  }
  s.gongfa.push(id);
  realignRealm(s); // 重算气血等（含功法 hp 加成）
  updateStatsFromRealm(s);
  autoSave();
  return { duplicate: false, refund: 0, name: g.name };
}

// 战斗：施展功法主动技能
function playerCastGongfa(id) {
  if (!Game.battle || Game.battle.ended || Game.battle.turn !== 'player') return;
  const g = GONGFA[id];
  if (!g || !g.combat) return;
  const s = Game.state;
  if (!isGongfaUsable(s, g)) {
    logBattle(`【${g.name}】已被宗门禁制封禁，当前无法施展。`, 'sys');
    UI.updateBattle();
    return;
  }
  const e = Game.battle.enemy;
  const cdKey = 'gong_' + id;
  const cd = (Game.battle.specialCd && Game.battle.specialCd[cdKey]) || 0;
  if (cd > 0) {
    logBattle(`${g.name} 尚在冷却中（${cd} 回合）。`, 'sys');
    UI.updateBattle();
    return;
  }
  const manaPct = g.combat.manaPct ?? 0.25;
  const manaCost = manaPct > 0 ? getManaCost(s, manaPct) : 0;
  if (manaCost > 0 && s.mp < manaCost) {
    logBattle(`灵力不足，施展【${g.name}】需 ${manaCost} 点灵力。`, 'sys');
    UI.updateBattle();
    return;
  }
  const combat = g.combat;
  let dealtDamage = 0;
  s.mp -= manaCost;
  Game.battle.specialCd = Game.battle.specialCd || {};
  Game.battle.specialCd[cdKey] = combat.cd;
  if (combat.kind === 'blood_escape') {
    const e = Game.battle.enemy;
    if (e.noEscape || e.untouchable) {
      delete Game.battle.specialCd[cdKey];
      logBattle('这是你无法逃脱的宿命。', 'sys');
      UI.updateBattle();
      return;
    }
    if (e.id === 'dao_competitor' || e.id === 'dao_elder') {
      delete Game.battle.specialCd[cdKey];
      logBattle('打个表演跑啥跑。', 'sys');
      UI.updateBattle();
      return;
    }
    const hpCost = Math.max(1, Math.floor(s.maxHp * combat.hpPct));
    if (s.hp <= hpCost) {
      delete Game.battle.specialCd[cdKey];
      logBattle(`气血不足，无法施展【${g.name}】。`, 'sys');
      UI.updateBattle();
      return;
    }
    s.hp -= hpCost;
    if (Math.random() < 0.95) {
      logBattle(`【${g.name}】燃去 ${hpCost} 点气血，化作血光远遁而去（血遁成功）。`, 'player');
      Game.battle.ended = true;
      s.stats.battleLoss++;
      s.stats.winStreak = 0;
      setTimeout(() => {
        Game.battle.loseCallback && Game.battle.loseCallback();
        UI.battleEnd(false, Game.battle.loseNext || Game.state.nodeId);
      }, 1000);
    } else {
      s.hp = 0;
      Game.battle.ended = true;
      s.stats.battleLoss++;
      s.stats.winStreak = 0;
      logBattle('血遁失败，你炸成了一团血雾，然后挑战失败。', 'sys');
      playLoseSound();
      setTimeout(() => {
        Game.battle.loseCallback && Game.battle.loseCallback();
        UI.battleEnd(false, Game.battle.loseNext || Game.state.nodeId);
      }, 1500);
    }
    UI.updateBattle();
    return;
  }
  if (combat.kind === 'reward_boost') {
    const hpCost = Math.max(1, Math.floor(s.maxHp * combat.hpPct));
    if (Game.battle.rewardBoostUsed) {
      delete Game.battle.specialCd[cdKey];
      logBattle(`【${g.name}】本场已施展过。`, 'sys');
      UI.updateBattle();
      return;
    }
    if (s.hp <= hpCost) {
      delete Game.battle.specialCd[cdKey];
      logBattle(`气血不足，无法施展【${g.name}】。`, 'sys');
      UI.updateBattle();
      return;
    }
    s.hp -= hpCost;
    Game.battle.rewardBoostUsed = true;
    Game.battle.rewardBoost = combat.rewardBoost || 0.20;
    logBattle(`【${g.name}】燃去 ${hpCost} 点气血！本场经验、灵石、名望与掉落概率提高 ${Math.round(Game.battle.rewardBoost * 100)}%。`, 'player');
    enemyTurn();
    return;
  }
  if (combat.kind === 'heal') {
    const heal = Math.max(1, Math.floor(s.maxHp * combat.healPct));
    s.hp = Math.min(s.maxHp, s.hp + heal);
    logBattle(`【${g.name}】消耗 ${manaCost} 灵力，回复 ${heal} 点气血！`, 'player');
  } else if (combat.kind === 'buff') {
    Game.battle.attackBoost = Math.max(Game.battle.attackBoost || 0, combat.boost);
    Game.battle.attackBoostTurns = Math.max(Game.battle.attackBoostTurns || 0, combat.turns + 1);
    logBattle(`【${g.name}】消耗 ${manaCost} 灵力，攻击提高 ${Math.round(combat.boost * 100)}%，持续 ${combat.turns} 回合！`, 'player');
  } else if (combat.kind === 'guard') {
    Game.battle.danxiaGuard = { reduce: combat.guard, reflect: combat.reflect || 1 };
    logBattle(`【${g.name}】消耗 ${manaCost} 灵力，下一次受击减伤 ${Math.round(combat.guard * 100)}%，并反弹 ${Math.round((combat.reflect || 1) * 100)}% 来袭伤害！`, 'player');
  } else if (combat.kind === 'blood_rage') {
    const hpCost = Math.max(1, Math.floor(s.maxHp * combat.hpPct));
    if (s.hp <= hpCost) {
      s.mp += manaCost;
      delete Game.battle.specialCd[cdKey];
      logBattle(`气血不足，无法施展【${g.name}】。`, 'sys');
      UI.updateBattle();
      return;
    }
    s.hp -= hpCost;
    Game.battle.attackBoost = Math.max(Game.battle.attackBoost || 0, combat.boost);
    Game.battle.attackBoostTurns = Math.max(Game.battle.attackBoostTurns || 0, combat.turns + 1);
    logBattle(`【${g.name}】燃去 ${hpCost} 点气血，攻击提高 ${Math.round(combat.boost * 100)}%，持续 ${combat.turns} 回合！`, 'player');
  } else if (combat.kind === 'blood_strike') {
    const hpCost = Math.max(1, Math.floor(s.maxHp * combat.hpPct));
    if (s.hp <= hpCost) {
      s.mp += manaCost;
      delete Game.battle.specialCd[cdKey];
      logBattle(`气血不足，无法施展【${g.name}】。`, 'sys');
      UI.updateBattle();
      return;
    }
    s.hp -= hpCost;
    let dmg = Math.max(1, Math.floor(s.atk * combat.mult * (1 + (Game.battle.attackBoost || 0)) * (1 - getPlayerWeakenRate())) - getEnemyDefense(e, false) + (s.pen || 0));
    const cr = applyCrit(s, dmg);
    if (cr.isCrit) dmg = cr.dmg;
    dealtDamage = dealDamageToEnemy(e, dmg);
    logBattle(`【${g.name}】燃去 ${hpCost} 点气血，血焰贯穿 ${e.name}，${cr.isCrit ? '暴击！' : ''}造成 ${dealtDamage} 点伤害！`, 'player');
  } else {
    let dmg = Math.max(1, Math.floor(s.matk * combat.mult * (1 + (Game.battle.attackBoost || 0)) * (1 - getPlayerWeakenRate())) - getEnemyDefense(e, true) + (s.pen || 0));
    const cr = applyCrit(s, dmg);
    if (cr.isCrit) dmg = cr.dmg;
    dealtDamage = dealDamageToEnemy(e, dmg);
    logBattle(`你催动【${g.name}】，天地变色，一击轰出！`, 'player');
    logBattle(`【${g.name}】消耗 ${manaCost} 灵力，对 ${e.name} ${cr.isCrit ? '打出暴击，' : ''}造成 ${dealtDamage} 点伤害！`, 'player');
  }
  checkBattleEnd();
  if (!Game.battle.ended) petAssist(dealtDamage);
  if (!Game.battle.ended && (!dealtDamage || !trySpecialWeaponExtraTurn())) enemyTurn();
}

// ========== 奇遇 ==========
// 按权重随机抽取一次奇遇
function rollQyu(s) {
  const pool = QYU_POOL.filter(q => !q.sect || q.sect === s.sect);
  let total = 0;
  for (const q of pool) total += (q.weight || 1);
  let r = Math.random() * total;
  for (const q of pool) {
    r -= (q.weight || 1);
    if (r <= 0) return q;
  }
  return pool[pool.length - 1];
}

// 应用奇遇奖励，返回展示文本
function applyQyuReward(s, q) {
  const r = q.reward || {};
  if (r.type === 'gongfa') {
    const res = learnGongfa(s, r.id);
    const g = GONGFA[r.id];
    if (res.duplicate) {
      return { text: `你再次参悟【${g.name}】，已有小成，化作 ${res.refund} 灵石。`, type: 'gongfa' };
    }
    return { text: `你习得了功法【${g.name}】！`, type: 'gongfa', gongfa: g };
  } else if (r.type === 'stone') {
    s.stone += r.value;
    return { text: `你获得了 ${r.value} 灵石。`, type: 'stone' };
  } else if (r.type === 'item') {
    grantItem(s, r.id, r.count || 1);
    const it = ITEMS[r.id];
    return { text: `你获得了 ${it ? it.name : '道具'} ×${r.count || 1}。`, type: 'item' };
  } else if (r.type === 'dao') {
    s.dao += r.value;
    return { text: `道韵 +${r.value}。`, type: 'dao' };
  } else if (r.type === 'xp') {
    addXp(s, r.value);
    return { text: `修为 +${r.value}。`, type: 'xp' };
  }
  return { text: '你一无所获。', type: 'none' };
}

const QYU_COST = 10; // 主动云游一次消耗的道韵

// 触发奇遇：cost=true 时消耗道韵（主动云游），否则为探索随机触发（免费）
function triggerQiyu(s, cost) {
  if (cost) {
    if ((s.dao || 0) < QYU_COST) {
      UI.showToast(`道韵不足（需 ${QYU_COST}）`);
      return false;
    }
    s.dao -= QYU_COST;
  }
  const q = rollQyu(s);
  const result = applyQyuReward(s, q);
  Game.lastQiyu = { q, result };
  goToNode(cost ? 'qiyu_wander' : 'qiyu_result');
  return true;
}

function triggerQiyuTen(s) {
  const cost = QYU_COST * 10;
  if ((s.dao || 0) < cost) {
    UI.showToast(`道韵不足（需 ${cost}）`);
    return false;
  }
  s.dao -= cost;
  const draws = [];
  for (let i = 0; i < 10; i++) {
    const q = rollQyu(s);
    draws.push({ q, result: applyQyuReward(s, q) });
  }
  const last = draws[draws.length - 1];
  Game.lastQiyu = { ...last, draws };
  autoSave();
  goToNode('qiyu_wander');
  return true;
}

// ========== 物品 ==========
function hasItem(id, count = 1) {
  return (Game.state.bag[id] || 0) >= count;
}

function grantItem(stateOrId, id, count = 1) {
  let s, itemId;
  if (typeof stateOrId === 'string') {
    s = Game.state;
    itemId = stateOrId;
    count = id || 1;
  } else {
    s = stateOrId;
    itemId = id;
  }
  if (!s.bag[itemId]) s.bag[itemId] = 0;
  s.bag[itemId] += count;
  // 成就：收集
  const types = Object.keys(s.bag).filter(k => s.bag[k] > 0 && ITEMS[k]);
  if (types.length >= 10) grantAchievement('collector');
}

function removeItemFromState(s, id, count = 1) {
  if (!s.bag[id]) return false;
  if (s.bag[id] < count) return false;
  s.bag[id] -= count;
  if (s.bag[id] <= 0) delete s.bag[id];
  return true;
}

function useItem(id) {
  const s = Game.state;
  const item = ITEMS[id];
  if (!item) return false;
  // 已装备的武器/防具可卸下，此时不在背包里，跳过 hasItem 检查
  const slot = getItemSlot(item);
  const equippedSlot = slot ? EQUIP_SLOTS.find(sl => s.equipment[sl] === id) : null;
  if (!hasItem(id) && !equippedSlot) return false;

  // 喂养灵宠道具：兽粮 +40 经验，灵兽丹 +200 经验
  if (item.effect === 'pet_food1' || item.effect === 'pet_food3') {
    if (!s.pet) { UI.showToast('你还没有出战灵宠，先去灵兽谷抽一只吧'); return false; }
    const result = feedPetByItem(s.pet, id);
    if (result) UI.updateBag();
    return result;
  }

  if (item.type === 'pill') {
    if (item.healPct) {
      const heal = Math.max(1, Math.floor(s.maxHp * item.healPct));
      s.hp = Math.min(s.maxHp, s.hp + heal);
      UI.showToast(`服用${item.name}，回复${heal}气血`);
    } else if (item.manaPct) {
      const mana = Math.max(1, Math.floor(s.maxMp * item.manaPct));
      s.mp = Math.min(s.maxMp, s.mp + mana);
      UI.showToast(`服用${item.name}，回复${mana}灵力`);
    } else if (item.effect === 'xp50') {
      addXp(s, 50);
      UI.showToast(`服用${item.name}，获得50修为`);
    } else {
      UI.showToast('此物品无法直接使用');
      return false;
    }
    removeItemFromState(s, id, 1);
    incDailyTask('pill');
  } else if (slot) {
    // 装备/卸下
    if (equippedSlot) {
      // 卸下：装备放回背包
      s.equipment[equippedSlot] = null;
      grantItem(s, id, 1);
      UI.showToast(`卸下${item.name}`);
    } else {
      // 确定目标槽位：6 槽全通用，装到第一个空槽
      const targetSlot = EQUIP_SLOTS.find(sl => !s.equipment[sl]);
      if (!targetSlot) {
        UI.showToast('装备槽已满，请先在备战页卸下');
        return false;
      }
      // 不重复：该装备已在其他槽（双保险）
      if (EQUIP_SLOTS.some(sl => s.equipment[sl] === id)) {
        UI.showToast('同一装备不能重复装备');
        return false;
      }
      // 装备（旧的放回背包）
      if (s.equipment[targetSlot]) {
        grantItem(s, s.equipment[targetSlot], 1);
      }
      s.equipment[targetSlot] = id;
      removeItemFromState(s, id, 1);
      UI.showToast(`装备${item.name}`);
    }
  } else if (item.type === 'material' || item.type === 'misc') {
    if (!useConsumableEffect(s, item)) return false;
    removeItemFromState(s, id, 1);
  } else {
    UI.showToast('此物品无法直接使用');
    return false;
  }
  autoSave();
  UI.updateStats();
  UI.updateBag();
  return true;
}

// 消耗类物品（材料/杂物）的使用效果
function useConsumableEffect(s, item) {
  const e = item.effect;
  if (!e) {
    UI.showToast(`${item.name} 没有可用效果`);
    return false;
  }
  if (e === 'xp30') { addXp(s, 30); UI.showToast(`你炼化了${item.name}，获得30修为`); }
  else if (e === 'xp80') { addXp(s, 80); UI.showToast(`你炼化了${item.name}，获得80修为`); }
  else if (e === 'heal50') { s.hp = Math.min(s.maxHp, s.hp + 50); UI.showToast(`你服用了${item.name}，回复50气血`); }
  else if (e === 'heal80') { s.hp = Math.min(s.maxHp, s.hp + 80); UI.showToast(`你服用了${item.name}，回复80气血`); }
  else if (e === 'dao5') { s.dao += 5; UI.showToast(`你参悟了${item.name}，道韵+5`); }
  else if (e === 'dao10') { s.dao += 10; UI.showToast(`你参悟了${item.name}，道韵+10`); }
  else { UI.showToast('此物品无法直接使用'); return false; }
  return true;
}

// 出售物品换取灵石
function sellItem(id) {
  const s = Game.state;
  const item = ITEMS[id];
  if (!item) return false;
  if (!hasItem(id)) return false;
  if (EQUIP_SLOTS.some(slot => s.equipment[slot] === id)) {
    UI.showToast('请先卸下装备');
    return false;
  }
  if (!item.sell || item.sell <= 0) {
    UI.showToast('此物品无法出售');
    return false;
  }
  removeItemFromState(s, id, 1);
  if (s.equipLevel) delete s.equipLevel[id];
  s.stone += item.sell;
  UI.showToast(`出售${item.name}，获得${item.sell}灵石`);
  autoSave();
  UI.updateStats();
  UI.updateBag();
    return true;
}

function sellItemBatch(id) {
    const s = Game.state;
    const item = ITEMS[id];
    const count = s.bag[id] || 0;
    if (!item || count <= 0) return false;
    if (EQUIP_SLOTS.some(slot => s.equipment[slot] === id)) {
        UI.showToast('已装备的物品无法出售');
        return false;
    }
    if (!item.sell || item.sell <= 0) {
        UI.showToast('该物品无法出售');
        return false;
    }

    removeItemFromState(s, id, count);
    if (s.equipLevel) delete s.equipLevel[id];
    const gain = item.sell * count;
    s.stone += gain;
    UI.showToast(`批量出售${item.name}×${count}，获得${gain}灵石`);
    autoSave();
    UI.updateStats();
    UI.updateBag();
    return true;
}

// 抽卡（藏宝阁）：100 抽必出仙品；每获得 3 件仙品后，下一抽必出神品。
function rollGachaOnce(s) {
  s.gachaCount = (s.gachaCount || 0) + 1;
  migrateGacha(s);
  const xianTier = GACHA_POOL.find(t => t.rarity === '仙品');
  const shenTier = GACHA_POOL.find(t => t.rarity === '神品');
  let tier;
  if (s.gachaShenPityRemaining === 1 && shenTier) {
    tier = shenTier;
  } else if (s.gachaSinceXian >= GACHA_PITY - 1 && xianTier) {
    tier = xianTier;
  } else {
    let roll = Math.random() * 100;
    tier = GACHA_POOL[0];
    for (const t of GACHA_POOL) {
      if (roll < t.weight) { tier = t; break; }
      roll -= t.weight;
    }
  }
  if (tier === shenTier) {
    s.gachaXianCount = 0;
    s.gachaSinceXian = 0;
    s.gachaShenPityRemaining = 0;
  } else if (tier === xianTier) {
    s.gachaXianCount++;
    s.gachaSinceXian = 0;
    if (s.gachaXianCount >= 3) {
      s.gachaXianCount = 0;
      s.gachaShenPityRemaining = GACHA_PITY;
    } else if (s.gachaShenPityRemaining > 0) {
      s.gachaShenPityRemaining--;
    }
  } else {
    s.gachaSinceXian++;
    if (s.gachaShenPityRemaining > 0) s.gachaShenPityRemaining--;
  }
  // 该档内随机一项（装备为字符串，丹药为 {id,count} 可给多个）
  const entry = tier.items[Math.floor(Math.random() * tier.items.length)];
  const itemId = typeof entry === 'string' ? entry : entry.id;
  const count = typeof entry === 'string' ? 1 : (entry.count || 1);
  const item = ITEMS[itemId];
  grantItem(s, itemId, count);
  return { item, count, rarity: tier.rarity, color: tier.color };
}

function gachaDraw() {
  const result = gachaDrawMany(1, '抽一次');
  return result ? result.results[0] : null;
}

function gachaDrawMany(count, label) {
  const s = Game.state;
  const purchase = payGachaPurchase(s, 'equipment', count, label);
  if (!purchase) return null;
  const results = [];
  for (let i = 0; i < count; i++) results.push(rollGachaOnce(s));
  playGachaSound();
  autoSave();
  UI.updateStats();
  UI.updateBag();
  return { results, drawCount: count, cost: purchase.cost, discounted: purchase.discounted };
}

// 十连抽
function gachaDrawTen() {
  const result = gachaDrawMany(10, '十连');
  return result ? result.results : null;
}

// 百连抽
function gachaDrawHundred() {
  const result = gachaDrawMany(100, '百连');
  return result ? result.results : null;
}

function gachaDrawThousand() {
  const result = gachaDrawMany(1000, '千连');
  return result ? result.results : null;
}

// 合成物品
function craftItem(recipeId) {
  const s = Game.state;
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return false;
  // 检查材料是否充足
  for (const matId in recipe.cost) {
    if ((s.bag[matId] || 0) < recipe.cost[matId]) {
      UI.showToast('材料不足');
      return false;
    }
  }
  // 扣除材料
  for (const matId in recipe.cost) {
    removeItemFromState(s, matId, recipe.cost[matId]);
  }
  // 给予产物
  grantItem(s, recipe.result, 1);
  const item = ITEMS[recipe.result];
  let extra = 0;
  if (Math.random() < 0.15) {
    grantItem(s, recipe.result, 1);
    extra = 1;
  }
  UI.showToast(extra ? `合成大成功！获得 ${item.name} ×2` : `合成成功！获得 ${item.name}`);
  autoSave();
  UI.updateStats();
  UI.updateBag();
  return true;
}

// ========== 炼丹（随机炼丹炉） ==========
function alchemy(recipeId) {
  const s = Game.state;
  const recipe = ALCHEMY_RECIPES.find(r => r.id === recipeId);
  if (!recipe) return false;
  for (const matId in recipe.cost) {
    if ((s.bag[matId] || 0) < recipe.cost[matId]) { UI.showToast('材料不足'); return false; }
  }
  for (const matId in recipe.cost) {
    removeItemFromState(s, matId, recipe.cost[matId]);
  }
  // 按权重随机结果
  const total = recipe.results.reduce((a, r) => a + r.weight, 0);
  let roll = Math.random() * total;
  let chosen = recipe.results[0];
  for (const r of recipe.results) {
    roll -= r.weight;
    if (roll < 0) { chosen = r; break; }
  }
  grantItem(s, chosen.id, chosen.count);
  const item = ITEMS[chosen.id];
  UI.showToast(`炼丹成功！炼得 ${item.name}×${chosen.count}`);
  autoSave();
  UI.updateStats();
  UI.updateBag();
  return true;
}

// 强化已装备的武器/防具/鞋履；仅增强固定基础属性，百分比词条与特殊效果不参与强化。
function strengthenItem(id) {
  const s = Game.state;
  const item = ITEMS[id];
  if (!item) return false;
  const slot = getItemSlot(item);
  if (!slot || slot === 'artifact') { UI.showToast('该物品无法强化'); return false; }
  const isEquipped = EQUIP_SLOTS.some(sl => s.equipment[sl] === id);
  if (!isEquipped) { UI.showToast('请先装备再强化'); return false; }

  const lv = (s.equipLevel && s.equipLevel[id]) || 0;
  if (lv >= EQUIP_MAX_LEVEL) { UI.showToast('已达到最高强化等级'); return false; }

  const costStone = (lv + 1) * 20;
  const strengthenStoneCost = getEquipStrengthenStoneCost(lv);
  if (!hasItem('equip_stone', strengthenStoneCost)) { UI.showToast(`需要 装备强化石×${strengthenStoneCost}`); return false; }
  if (s.stone < costStone) { UI.showToast(`灵石不足（需 ${costStone}）`); return false; }

  removeItemFromState(s, 'equip_stone', strengthenStoneCost);
  s.stone -= costStone;
  if (!s.equipLevel) s.equipLevel = {};
  s.equipLevel[id] = lv + 1;
  UI.showToast(`强化成功！${item.name} +${lv + 1}（消耗强化石×${strengthenStoneCost}、灵石×${costStone}）`);
  incDailyTask('strengthen');
  autoSave();
  UI.updateStats();
  UI.updateBag();
  return true;
}

function getEquipDismantleRefund(item, level) {
  const strengthenRefund = Math.floor(getEquipStrengthenStoneSpent(level) / 2);
  const rarityRefund = item && item.rarity === '神品' ? 3 : (item && item.rarity === '仙品' ? 1 : 0);
  return { strengthenRefund, rarityRefund, total: strengthenRefund + rarityRefund };
}

// 分解未装备的强化装备：返还累计消耗强化石的一半，小数直接舍弃；仙品/神品额外返还强化石，灵石不返还。
function dismantleStrengthenedItem(id) {
  const s = Game.state;
  const item = ITEMS[id];
  const slot = getItemSlot(item);
  const level = (s.equipLevel && s.equipLevel[id]) || 0;
  const refundInfo = getEquipDismantleRefund(item, level);
  if (!item || !slot || refundInfo.total <= 0 || !hasItem(id)) return { ok: false, msg: '该装备无法分解' };
  if (s.equipment && EQUIP_SLOTS.some(sl => s.equipment[sl] === id)) return { ok: false, msg: '请先卸下装备再分解' };
  const refund = refundInfo.total;
  removeItemFromState(s, id, 1);
  delete s.equipLevel[id];
  if (refund > 0) grantItem(s, 'equip_stone', refund);
  autoSave();
  UI.updateStats();
  UI.updateBag();
  return { ok: true, refund, ...refundInfo, level };
}

// ========== 成就 ==========
function grantAchievement(id) {
  const s = Game.state;
  if (!s.achievements) s.achievements = [];
  if (s.achievements.includes(id)) return;
  s.achievements.push(id);
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (ach) {
    UI.showToast(`成就达成：${ach.name}`);
    // 成就附带称号：解锁并自动佩戴（首个称号）
    if (ach.title) {
      if (!s.titles) s.titles = [];
      if (!s.titles.includes(ach.title)) {
        s.titles.push(ach.title);
        if (!s.title) s.title = ach.title;
        UI.showToast(`获得称号「${ach.title}」`);
      }
    }
  }
  autoSave();
}

function checkAchievements() {
  const s = Game.state;
  if (!s.stats) s.stats = { battleWin: 0, battleLoss: 0, winStreak: 0, enemiesKilled: 0 };
  if (s.stats.battleWin >= 1) grantAchievement('first_battle');
  if (s.stats.battleWin >= 10) grantAchievement('battle_10');
  if (s.stone >= 1000) grantAchievement('rich_1000');
  if (s.fame >= 100) grantAchievement('fame_100');
  if (s.dao >= 50) grantAchievement('dao_50');
}

// ========== 剧情节点 ==========
function goToNode(nodeId) {
  if (Game.delayedTimer) { clearTimeout(Game.delayedTimer); Game.delayedTimer = null; }
  Game.currentNode = nodeId;
  Game.state.nodeId = nodeId;
  _nodeDynamicText = null;

  const node = STORY_NODES[nodeId];
  if (!node) {
    console.error('Node not found:', nodeId);
    return;
  }

  // 探索随机触发奇遇（标记 explore 的节点进入时，小概率撞到奇遇，惊喜彩蛋）
  if (node.explore && nodeId !== 'qiyu_result' && Math.random() < 0.12) {
    if (triggerQiyu(Game.state, false)) {
      return;
    }
  }

  // 执行 onEnter
  if (node.onEnter) {
    node.onEnter(Game.state);
  }

  // 检查成就
  checkAchievements();

  // 自动存档
  autoSave();

  // 更新 UI
  UI.renderScene(node);
}

function setNodeText(text) {
  _nodeDynamicText = text;
}

function goToNodeAfterDelay(nodeId, ms) {
  Game.delayedTimer = setTimeout(() => {
    goToNode(nodeId);
  }, ms);
}

// 获取节点文本（支持动态替换）
function getNodeText(node) {
  if (_nodeDynamicText) return _nodeDynamicText;
  if (node.dynamicText) return node.dynamicText(Game.state);
  return node.text || '';
}

// ========== 战斗系统 ==========
function beginDemonLordChallenge() {
  const s = Game.state;
  // 人仙、地仙及以下挑战时明确告知风险；地仙之后可直接迎战。
  if (getRealmIndex(s) <= 27) {
    const ok = confirm('你与魔尊的实力差距仍然过大，且此战不可逃脱。\n确定仍要挑战魔尊吗？');
    if (!ok) return false;
  }
  goToNode('demon_lord_fight');
  return true;
}

// 秘境爬塔：根据层数返回随机敌人 id
function pickMijingEnemy(floor) {
  let pool = MIJING_POOLS[0].enemies;
  for (const seg of MIJING_POOLS) {
    if (floor >= seg.minFloor) pool = seg.enemies;
    else break;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function applyDivinePetBattleStart(s) {
  const entry = getEquippedPet(s);
  const trait = getPetTrait(entry);
  if (!trait) return;
  if (trait.id === 'shield') {
    const stage = getPetStage(entry);
    const shield = Math.max(1, Math.floor(s.maxHp * (0.08 + stage * 0.04)));
    Game.battle.petShield = shield;
    logBattle(`【${PETS[entry.id].name}·${trait.name}】为你展开 ${shield} 点护盾。`, 'player');
  }
}

function getDivinePetManaRecovery(entry) {
  const stage = getPetStage(entry);
  return {
    chance: Math.min(0.40, 0.20 + stage * 0.01),
    manaPct: Math.min(0.35, 0.15 + stage * 0.01),
  };
}

function tryDivinePetManaRecovery(s) {
  const entry = getEquippedPet(s);
  const trait = getPetTrait(entry);
  if (!entry || !trait || trait.id !== 'mana') return false;
  if ((Game.battle.petManaTraitCd || 0) > 0) {
    Game.battle.petManaTraitCd--;
    return false;
  }
  const recovery = getDivinePetManaRecovery(entry);
  if (Math.random() >= recovery.chance) return false;
  const gain = Math.max(1, Math.floor(s.maxMp * recovery.manaPct));
  s.mp = Math.min(s.maxMp, s.mp + gain);
  Game.battle.petManaTraitCd = 3;
  logBattle(`【${PETS[entry.id].name}·${trait.name}】灵息回潮，恢复 ${gain} 点灵力（${Math.round(recovery.manaPct * 100)}%）！`, 'player');
  return true;
}

function applyPetIncomingDamage(s, dmg) {
  const entry = getEquippedPet(s);
  const trait = getPetTrait(entry);
  if (trait && trait.id === 'resist') {
    const rate = Math.min(0.35, 0.10 + getPetStage(entry) * 0.04);
    dmg = Math.max(1, Math.floor(dmg * (1 - rate)));
    logBattle(`【${PETS[entry.id].name}·${trait.name}】替你化去 ${Math.round(rate * 100)}% 伤害。`, 'player');
  }
  if (Game.battle.petShield > 0) {
    const absorb = Math.min(dmg, Game.battle.petShield);
    Game.battle.petShield -= absorb;
    dmg -= absorb;
    logBattle(`灵宠护盾吸收了 ${absorb} 点伤害${Game.battle.petShield ? `（剩余${Game.battle.petShield}）` : '（已破碎）'}。`, 'player');
  }
  return dmg;
}

function petFollowUpOnPlayerAttack(ownerDamage) {
  const s = Game.state;
  const entry = getEquippedPet(s);
  const trait = getPetTrait(entry);
  if (!entry || !trait || trait.id !== 'follow' || !ownerDamage || ownerDamage <= 0 || Game.battle.ended) return;
  const stage = getPetStage(entry);
  if (Math.random() >= Math.min(0.65, 0.20 + stage * 0.06)) return;
  const e = Game.battle.enemy;
  const rawDamage = Math.max(1, Math.floor(s.atk * (0.45 + stage * 0.10)) - getEnemyDefense(e, false) + (s.pen || 0));
  const weakenedDamage = Math.max(1, Math.floor(rawDamage * (1 - getPlayerWeakenRate())));
  const dmg = Math.min(weakenedDamage, Math.max(1, Math.floor(ownerDamage * 0.5)));
  const actualDamage = dealDamageToEnemy(e, dmg);
  logBattle(`【${PETS[entry.id].name}·${trait.name}】随主人攻势追击，造成 ${actualDamage} 点伤害！`, 'player');
  checkBattleEnd();
}

// 普通敌人按所在区域与玩家境界温和对齐：新手区止于筑基、中期止于元婴、高阶止于化神。
// 这样玩家回头刷图仍能遇到同境妖物，同时不会反客为主压过玩家。
const ENEMY_REALM_BANDS = {
  wolf: 'novice', wolf_alpha: 'novice', bandit: 'novice', bandit_chief: 'novice', snake_demon: 'novice', low_monk: 'novice',
  stone_monkey: 'mid', blood_cultist: 'mid', bifuluan: 'mid',
  qiongqi: 'high', taotie: 'high', nine_tails: 'high', yinglong: 'high',
};
const ENEMY_BAND_CONFIG = {
  novice: { min: 0, max: 13, hp: 0.20, atk: 0.35, def: 0.18 },
  mid:    { min: 14, max: 21, hp: 0.35, atk: 0.60, def: 0.25 },
  high:   { min: 18, max: 25, hp: 0.55, atk: 0.85, def: 0.45 },
};
const ENEMY_RANK = {
  wolf_alpha: 1.35, bandit_chief: 1.55, bifuluan: 1.40,
  qiongqi: 1.00, taotie: 1.15, nine_tails: 1.30, yinglong: 1.50,
};

function scaleEnemyForRealm(enemy, s) {
  const band = ENEMY_REALM_BANDS[enemy.id];
  const conf = ENEMY_BAND_CONFIG[band];
  if (!conf) return;
  const idx = Math.max(conf.min, Math.min(conf.max, getRealmIndex(s)));
  const realm = getRealm(idx);
  const rank = ENEMY_RANK[enemy.id] || 1;
  const baseHp = Math.floor(realm.max * 0.6 + 50);
  enemy.maxHp = Math.max(1, Math.floor(baseHp * conf.hp * rank));
  enemy.hp = enemy.maxHp;
  enemy.atk = Math.max(1, Math.floor(realm.atk * conf.atk * rank));
  enemy.def = Math.max(0, Math.floor(realm.def * conf.def * rank));
  enemy.matk = Math.max(1, Math.floor(realm.atk * conf.atk * rank));
  enemy.mdef = Math.max(0, Math.floor(realm.def * conf.def * rank));
  enemy.realmName = realm.name;
}

// Boss 动态平衡：按玩家当前总强度（含装备/神兽/功法/宗门）对齐，保证不被秒、能破防（仅 boss 且非天劫）
function scaleBossForPlayer(enemy, s) {
  if (!enemy.boss || enemy.untouchable) return;
  const p = enemy.power || 1;
  const atk = getTotalAtk(s);
  const def = getTotalDef(s);
  const mdef = getTotalMdef(s);
  const perHit = Math.max(1, Math.floor(atk * (1 - BOSS_DEF_VS_ATK)));
  const targetHp = perHit * BOSS_HP_PER_HIT * p;
  const targetAtk = Math.floor(def * BOSS_ATK_VS_DEF * p);
  const targetDef = Math.floor(atk * BOSS_DEF_VS_ATK);
  enemy.maxHp = Math.max(enemy.maxHp, targetHp);
  enemy.hp = enemy.maxHp;
  enemy.atk = Math.max(enemy.atk, targetAtk);
  enemy.def = Math.max(enemy.def, targetDef);
  enemy.matk = Math.max(enemy.matk, Math.floor(mdef * BOSS_ATK_VS_DEF * p));
  enemy.mdef = Math.max(enemy.mdef, targetDef);
}

function startBattle(enemyId, multiplier = 1.0, winCallback, loseCallback, winNext, loseNext, tribulation = false, turns = 0) {
  const enemyData = ENEMIES[enemyId];
  if (!enemyData) return;

  const mult = multiplier;
  const enemy = {
    id: enemyId,
    name: enemyData.name,
    maxHp: Math.floor(enemyData.hp * mult),
    hp: Math.floor(enemyData.hp * mult),
    atk: Math.floor(enemyData.atk * mult),
    def: Math.floor(enemyData.def * mult),
    matk: Math.floor((enemyData.matk != null ? enemyData.matk : enemyData.atk * 0.8) * mult),
    mdef: Math.floor((enemyData.mdef != null ? enemyData.mdef : enemyData.def * 0.8) * mult),
    pen: Math.floor((enemyData.pen || 0) * mult),
    xp: Math.floor(enemyData.xp * mult),
    stoneMin: Math.floor(enemyData.stone[0] * mult),
    stoneMax: Math.floor(enemyData.stone[1] * mult),
    drops: enemyData.drops || [],
    fame: Math.floor((enemyData.fame || 0) * mult),
    boss: !!enemyData.boss,
    demonLord: !!enemyData.demonLord,
    finalBoss: !!enemyData.finalBoss,
    finalHitPct: enemyData.finalHitPct || enemyData.demonHitPct || 0.10,
    finalDoubleChance: enemyData.finalDoubleChance || enemyData.demonDoubleChance || 0.20,
    finalSkill: enemyData.finalSkill || (enemyData.demonLord ? '灭世魔掌' : '终焉一击'),
    noEscape: !!enemyData.noEscape,
    untouchable: !!enemyData.untouchable,
    tribDmg: enemyData.tribDmg || 0.15,
    power: enemyData.power,
    special: enemyData.special || null,
  };
  if (enemyId === 'dao_competitor') enemy.name = getRandomDaoPeerName(Game.state);
  if (enemyId === 'lei_jie_unified') {
    const pending = Game.state.pendingTribulation;
    const gate = pending && getTribulationGateForIndex(pending.gateIdx);
    if (gate) {
      const conf = getTribulationBattleConfig(gate);
      enemy.name = `${getRealm(gate.gateIdx).name}·${gate.name}天劫`;
      enemy.tribDmg = conf.tribDmg;
    }
  }
  scaleEnemyForRealm(enemy, Game.state);
  scaleBossForPlayer(enemy, Game.state);
  // Boss 血量整体加厚（天劫除外，天劫按固定百分比伤害结算）
  if (enemy.boss && !enemy.untouchable) {
    enemy.maxHp = Math.floor(enemy.maxHp * BOSS_HP_MULT);
    enemy.hp = enemy.maxHp;
  }
  // 普通怪(非 Boss)最低血量:对齐玩家总攻击,保证至少扛 5 刀,避免后期一招秒
  if (!enemy.boss && !enemy.untouchable) {
    const minHp = Math.floor(Game.state.atk * 5);
    if (enemy.maxHp < minHp) { enemy.maxHp = minHp; enemy.hp = minHp; }
  }
  migrateMana(Game.state);
  Game.state.mp = Game.state.maxMp;

  Game.battle = {
    enemy: enemy,
    turn: 'player',
    log: [],
    winCallback: winCallback,
    loseCallback: loseCallback,
    winNext: winNext,
    loseNext: loseNext,
    ended: false,
    tribulation: tribulation,
    turns: turns,
    turnCount: 0,
    finalBossRounds: 0,
    pillUsed: 0,
    specialCd: {},
  };

  logBattle(`遭遇了 ${enemy.name}！`, 'sys');
  // 战斗彩蛋：开场独白（普通小怪与 Boss，天劫除外）
  if (!enemy.untouchable) {
    const introEgg = rollEasterEgg(EASTER_EGG_INTRO, 0.20);
    if (introEgg) logBattle(introEgg, 'enemy');
  }
  applyDivinePetBattleStart(Game.state);
}

function logBattle(text, type = 'sys') {
  Game.battle.log.push({ text, type });
}

function getEnemyDefense(enemy, magic) {
  const base = magic ? enemy.mdef : enemy.def;
  let defense = Math.max(0, base - (enemy.armorBreak || 0));
  // 星龙靴的双伤穿透直接作用于物防与法防。
  if (Game.state && Game.state.equipment && Game.state.equipment.shoes === 'tun_xinglongxue') {
    defense = Math.floor(defense * 0.90);
  }
  return defense;
}

function isDemonLord(e) {
  return !!(e && e.demonLord);
}

function isFinalBoss(e) {
  return isDemonLord(e) || !!(e && e.finalBoss);
}

// 魔尊每一次受到的独立伤害均有上限，避免单段爆发直接跳关。
function dealDamageToEnemy(e, rawDamage) {
  const raw = Math.max(0, Math.floor(rawDamage || 0));
  const cap = isFinalBoss(e) ? Math.max(1, Math.floor(e.maxHp * 0.20)) : raw;
  const damage = Math.min(raw, cap);
  e.hp -= damage;
  return damage;
}

function trySpecialWeaponExtraTurn() {
  const s = Game.state;
  const weapon = s.equipment && s.equipment.weapon;
  if (!['tun_tushenjian', 'tun_canglongqiang'].includes(weapon) || Math.random() >= 0.05) return false;
  Game.battle.turn = 'player';
  logBattle(`【${ITEMS[weapon].name}】神威再现，你获得一个额外回合！`, 'player');
  UI.updateBattle();
  return true;
}

function getSpecialArmorDamageMultiplier(s, isMagic) {
  const armor = s.equipment && s.equipment.armor;
  if (armor === 'tun_hunyuanjia') return 0.90 * (isMagic ? 1 : 0.90);
  if (armor === 'tun_tianxuanjia') return 0.90 * (isMagic ? 0.90 : 1);
  return 1;
}

function applySpecialArmorReduction(s, dmg, isMagic) {
  return Math.max(1, Math.floor(dmg * getSpecialArmorDamageMultiplier(s, isMagic)));
}

function getPlayerWeakenRate() {
  return (Game.battle && Game.battle.playerWeakenRate) || 0;
}

function performEnemySpecial(s, e) {
  const skill = e.special;
  if (!skill) return false;
  Game.battle.enemySpecialCd = Game.battle.enemySpecialCd || 0;
  if (Game.battle.enemySpecialCd > 0 || Math.random() >= (skill.chance || 0.24)) return false;
  Game.battle.enemySpecialCd = skill.cd || 3;
  if (skill.type === 'poison') {
    Game.battle.poisonTurns = Math.max(Game.battle.poisonTurns || 0, skill.turns || 2);
    Game.battle.poisonPct = Math.max(Game.battle.poisonPct || 0, skill.pct || 0.02);
    logBattle(`${e.name} 施展【${skill.name}】，毒煞侵入经脉！`, 'enemy');
  } else if (skill.type === 'weaken') {
    // 内部多留一轮，确保玩家能完整经历标注的两次行动。
    Game.battle.playerWeakenTurns = Math.max(Game.battle.playerWeakenTurns || 0, (skill.turns || 2) + 1);
    Game.battle.playerWeakenRate = Math.max(Game.battle.playerWeakenRate || 0, skill.rate || 0.25);
    logBattle(`${e.name} 施展【${skill.name}】，你的攻势被压制 ${Math.round(Game.battle.playerWeakenRate * 100)}%！`, 'enemy');
  } else if (skill.type === 'stun') {
    Game.battle.playerStunnedTurns = 1;
    logBattle(`${e.name} 施展【${skill.name}】，你神魂震荡，下一次行动将被跳过！`, 'enemy');
  } else if (skill.type === 'percent') {
    let dmg = Math.max(1, Math.floor(s.maxHp * (skill.pct || 0.05)));
    if (Game.battle.defending) {
      dmg = Math.floor(dmg * 0.4);
      Game.battle.defending = false;
      logBattle('你以守代攻，硬接这记致命神通！', 'player');
    }
    if (Game.battle.waterGuard) {
      dmg = Math.floor(dmg * (1 - Game.battle.waterGuard));
      Game.battle.waterGuard = 0;
    }
    if (Game.battle.danxiaGuard) {
      const guard = Game.battle.danxiaGuard;
      const reflect = Math.max(1, Math.floor(dmg * guard.reflect));
      dmg = Math.floor(dmg * (1 - guard.reduce));
      Game.battle.danxiaGuard = 0;
      const actualReflect = dealDamageToEnemy(e, reflect);
      logBattle(`丹霞灵壁反震【${skill.name}】，${e.name} 受到 ${actualReflect} 点伤害！`, 'player');
    }
    dmg = applySpecialArmorReduction(s, dmg, true);
    dmg = applyPetIncomingDamage(s, dmg);
    s.hp -= dmg;
    logBattle(`${e.name} 施展【${skill.name}】，造成 ${dmg} 点（最大气血${Math.round((skill.pct || 0) * 100)}%）伤害！`, 'enemy');
  }
  return true;
}

// 终局 Boss 的攻击不走普通伤害链：无视防御、守势、减伤、护盾、闪避与反弹。
function performFinalBossAttack(s, e) {
  const hits = Math.random() < (e.finalDoubleChance || 0.20) ? 2 : 1;
  if (Game.battle.defending || Game.battle.waterGuard || Game.battle.danxiaGuard || Game.battle.metalReflect) {
    Game.battle.defending = false;
    Game.battle.waterGuard = 0;
    Game.battle.danxiaGuard = 0;
    Game.battle.metalReflect = 0;
    logBattle('魔尊魔威贯穿一切防护，守势、减伤与反震尽数失效！', 'enemy');
  }
  for (let i = 0; i < hits; i++) {
    const hitPct = e.finalHitPct || 0.10;
    const dmg = Math.max(1, Math.floor(s.maxHp * hitPct));
    s.hp -= dmg;
    logBattle(`${e.name}施展【${e.finalSkill || '终焉一击'}】${hits === 2 ? `（第${i + 1}击）` : ''}，无视一切防护，固定扣除你 ${dmg} 点气血（${Math.round(hitPct * 100)}%）！`, 'enemy');
    checkBattleEnd();
    if (Game.battle.ended) return;
  }
  if (hits === 2) logBattle(`${e.name}威压暴涨，连续发动两次攻势！`, 'enemy');
}

function endFinalBossBattleByTimeout() {
  const s = Game.state;
  Game.battle.ended = true;
  s.hp = 0;
  s.stats.battleLoss++;
  s.stats.winStreak = 0;
  logBattle(`鏖战已超过五十回合，${Game.battle.enemy.name}威压不减。你真元耗尽，最终败下阵来……`, 'sys');
  playLoseSound();
  setTimeout(() => {
    Game.battle.loseCallback && Game.battle.loseCallback();
    UI.battleEnd(false, Game.battle.loseNext || Game.state.nodeId);
  }, 1500);
  UI.updateBattle();
}

function playerAttack() {
  if (Game.battle.ended || Game.battle.turn !== 'player') return;
  const s = Game.state;
  const e = Game.battle.enemy;
  const rawDamage = Math.max(1, Math.floor(s.atk * (1 + (Game.battle.attackBoost || 0)) * (1 - getPlayerWeakenRate())) - getEnemyDefense(e, false) + (s.pen || 0) + Math.floor(Math.random() * 5));
  const cr = applyCrit(s, rawDamage);
  const dmg = dealDamageToEnemy(e, cr.dmg);
  playBattleHitSound();
  logBattle(`你身形一动，法器在手，全力向 ${e.name} 攻去！`, 'player');
  logBattle(cr.isCrit ? `暴击！造成 ${dmg} 点伤害！` : `命中要害，造成 ${dmg} 点伤害。`, 'player');
  // 战斗彩蛋：出手独白（普通小怪与 Boss，天劫除外）
  if (!e.untouchable) {
    const atkEgg = rollEasterEgg(EASTER_EGG_PLAYER_ATK, 0.15);
    if (atkEgg) logBattle(atkEgg, 'player');
  }
  checkBattleEnd();
  if (!Game.battle.ended) petFollowUpOnPlayerAttack(dmg);
  if (!Game.battle.ended) petAssist(dmg);
  if (!Game.battle.ended && !trySpecialWeaponExtraTurn()) enemyTurn();
}

function playerSkill() {
  if (Game.battle.ended || Game.battle.turn !== 'player') return;
  const s = Game.state;
  const e = Game.battle.enemy;
  const lg = LINGGEN[s.linggen];
  const manaCost = getManaCost(s, lg.manaPct || 0.2);
  if (s.mp < manaCost) {
    logBattle(`灵力不足，施展【${lg.skill}】需 ${manaCost} 点灵力。`, 'sys');
    UI.updateBattle();
    return;
  }
  s.mp -= manaCost;
  const atkBoost = 1 + (Game.battle.attackBoost || 0);
  const matk = s.matk * atkBoost;
  const atk = s.atk * atkBoost;
  let dmg = 0;
  let extraText = '';
  const magicDef = () => getEnemyDefense(e, true);
  if (s.linggen === 'fire') {
    dmg = Math.max(1, Math.floor(matk * 2.05) - magicDef() + (s.pen || 0));
    if (isFinalBoss(e)) extraText = `${e.name}免疫灼烧`;
    else {
      e.burnTurns = 2;
      e.burnDamage = Math.max(1, Math.floor(matk * 0.28));
      extraText = `烈焰附体（每回合 ${e.burnDamage} 点，持续2回合）`;
    }
  } else if (s.linggen === 'wood') {
    dmg = Math.max(1, Math.floor(matk * 1.15) - magicDef() + (s.pen || 0));
    const heal = Math.max(1, Math.floor(s.maxHp * 0.12));
    s.hp = Math.min(s.maxHp, s.hp + heal);
    const seal = !isFinalBoss(e) && Math.random() < 0.45;
    if (seal) e.rootedTurns = 1;
    extraText = `回复 ${heal} 气血${seal ? '，藤蔓封住敌方下次攻击' : ''}`;
  } else if (s.linggen === 'water') {
    dmg = Math.max(1, Math.floor(matk * 1.45) - magicDef() + (s.pen || 0));
    const heal = Math.max(1, Math.floor(s.maxHp * 0.02));
    s.hp = Math.min(s.maxHp, s.hp + heal);
    Game.battle.waterGuard = 0.25;
    if (isFinalBoss(e)) extraText = `回复 ${heal} 气血，水幕减免下一击25%伤害（${e.name}免疫寒水侵蚀）`;
    else {
      e.waterTurns = 2;
      e.waterDamage = Math.max(1, Math.floor(matk * 0.22));
      extraText = `回复 ${heal} 气血，水幕减免下一击25%伤害，寒水渗透（每回合 ${e.waterDamage} 点，持续2回合）`;
    }
  } else if (s.linggen === 'thunder') {
    const crit = Math.random() < 0.32;
    const mult = crit ? 2.8 : 1.7;
    dmg = Math.max(1, Math.floor(matk * mult) - magicDef() + (s.pen || 0));
    if (!isFinalBoss(e) && Math.random() < 0.28) { e.stunned = true; extraText = '敌人陷入麻痹'; }
    if (isFinalBoss(e)) extraText = `${e.name}免疫麻痹`;
    if (crit) extraText = (extraText ? `${extraText}，` : '') + '雷霆暴击';
  } else if (s.linggen === 'sword') {
    const bonusPen = Math.max(8, Math.floor(atk * 0.12));
    dmg = Math.max(1, Math.floor(matk * 1.35) - magicDef() + (s.pen || 0) + bonusPen);
    if (Math.random() < 0.42) {
      const follow = Math.max(1, Math.floor(matk * 0.75) - magicDef() + (s.pen || 0) + bonusPen);
      const actualFollow = dealDamageToEnemy(e, follow);
      extraText = `剑气追击 ${actualFollow} 点伤害`;
    }
  } else { // metal
    dmg = Math.max(1, Math.floor(matk * 1.4) - magicDef() + (s.pen || 0));
    if (!isFinalBoss(e)) {
      e.armorBreak = Math.max(e.armorBreak || 0, Math.max(3, Math.floor(e.def * 0.30)));
      e.armorBreakTurns = 2;
    }
    Game.battle.metalReflect = 0.35;
    extraText = isFinalBoss(e) ? `${e.name}免疫破甲，并反震下一击35%伤害` : `敌方防御降低 ${e.armorBreak}，并反震下一击35%伤害`;
  }
  // 通用暴击（雷灵根自带专属暴击，跳过）
  if (s.linggen !== 'thunder') {
    const cr = applyCrit(s, dmg);
    if (cr.isCrit) {
      dmg = cr.dmg;
      extraText = (extraText ? extraText + '，' : '') + '暴击！';
    }
  }
  dmg = Math.max(1, Math.floor(dmg * (1 - getPlayerWeakenRate())));
  dmg = dealDamageToEnemy(e, dmg);
  playBattleHitSound();
  logBattle(lg.skillText, 'player');
  logBattle(`【${lg.skill}】消耗 ${manaCost} 灵力，对 ${e.name} 造成 ${dmg} 点伤害。${extraText ? ' ' + extraText + '。' : ''}`, 'player');
  checkBattleEnd();
  if (!Game.battle.ended) petAssist(dmg);
  if (!Game.battle.ended && !trySpecialWeaponExtraTurn()) enemyTurn();
}

function playerDefend() {
  if (Game.battle.ended || Game.battle.turn !== 'player') return;
  Game.battle.defending = true;
  logBattle('你凝神敛气，双臂交叉护在胸前，周身灵力凝成一道护体光罩。', 'player');
  enemyTurn();
}

function playerOpenPill() {
  if (Game.battle.ended || Game.battle.turn !== 'player') return;
  Game.battle.selectingPill = true;
  UI.updateBattle();
}

function playerUsePill(id) {
  if (Game.battle.ended || Game.battle.turn !== 'player') return;
  const s = Game.state;
  const item = ITEMS[id];
  if (!item || (!item.healPct && !item.manaPct)) {
    logBattle('此物并非恢复丹药。', 'sys');
    return;
  }
  if (!hasItem(id)) {
    logBattle('你翻遍储物袋，竟找不到这枚丹药，心中一沉。', 'sys');
    return;
  }
  // 每场战斗服药次数限制
  if ((Game.battle.pillUsed || 0) >= MAX_PILLS_PER_BATTLE) {
    logBattle(`你已连服 ${MAX_PILLS_PER_BATTLE} 枚丹药，药力淤积，再难吸收。`, 'sys');
    Game.battle.selectingPill = false;
    UI.updateBattle();
    return;
  }
  removeItemFromState(s, id, 1);
  Game.battle.pillUsed = (Game.battle.pillUsed || 0) + 1;
  // 首次服药有 20% 概率被打断：丹药照常消耗，并立即承受一次敌方回合；下一次服药必定成功。
  if (!Game.battle.pillNextGuaranteed && Math.random() < 0.20) {
    Game.battle.pillNextGuaranteed = true;
    Game.battle.selectingPill = false;
    logBattle(`你正要服下${item.name}，${Game.battle.enemy.name} 抓住破绽将丹药打落！丹药已消耗；下一次服药将必定成功。`, 'enemy');
    enemyTurn();
    return;
  }
  Game.battle.pillNextGuaranteed = false;
  if (item.healPct) {
    const heal = Math.max(1, Math.floor(s.maxHp * item.healPct));
    s.hp = Math.min(s.maxHp, s.hp + heal);
    logBattle(`你探手取出一枚${item.name}，仰头吞下。一股温润的药力在体内化开，伤势顿时好转。`, 'player');
    logBattle(`恢复了 ${heal} 点气血。`, 'player');
  } else {
    const mana = Math.max(1, Math.floor(s.maxMp * item.manaPct));
    s.mp = Math.min(s.maxMp, s.mp + mana);
    logBattle(`你服下${item.name}，丹田灵气迅速回涌。`, 'player');
    logBattle(`恢复了 ${mana} 点灵力。`, 'player');
  }
  Game.battle.selectingPill = false;
  UI.updateBattle();
}

function playerFlee() {
  if (Game.battle.ended || Game.battle.turn !== 'player') return;
  const e = Game.battle.enemy;
  if (e.noEscape || e.untouchable) {
    logBattle('这是你无法逃脱的宿命。', 'sys');
    UI.updateBattle();
    return;
  }
  if (e.id === 'dao_competitor' || e.id === 'dao_elder') {
    logBattle('打个表演跑啥跑。', 'sys');
    UI.updateBattle();
    return;
  }
  const s = Game.state;
  const playerPower = Math.max(1, s.atk + s.matk + s.def + s.mdef + s.maxHp * 0.015 + (s.pen || 0));
  const enemyPower = Math.max(1, e.atk + e.matk + e.def + e.mdef + e.maxHp * 0.015 + (e.pen || 0));
  const gap = enemyPower / playerPower;
  // 敌人越强于玩家，越难摆脱；境界/属性碾压时仍保留最低 5% 生机。
  const chance = Math.max(0.05, Math.min(0.80, 0.55 + s.dao * 0.002 - Math.max(0, gap - 1) * 0.16));
  if (Math.random() < chance) {
    logBattle('你虚晃一招，转身纵身掠出，几个起落便甩开了敌人。', 'sys');
    Game.battle.ended = true;
    Game.state.stats.battleLoss++;
    Game.state.stats.winStreak = 0;
    setTimeout(() => {
      Game.battle.loseCallback && Game.battle.loseCallback();
      UI.battleEnd(false, Game.battle.loseNext || Game.state.nodeId);
    }, 1000);
  } else {
    logBattle(`你刚要抽身，对方早已看破（逃脱概率${Math.round(chance * 100)}%），反手一击逼得你不得不回防。`, 'sys');
    enemyTurn();
  }
}

// 使用法宝特效：神品法宝拥有独立的主动能力与冷却。
function playerUseSpecial(itemId) {
  if (Game.battle.ended || Game.battle.turn !== 'player') return;
  const item = ITEMS[itemId];
  if (!item || !item.special) return;
  const cd = (Game.battle.specialCd && Game.battle.specialCd[itemId]) || 0;
  if (cd > 0) {
    logBattle(`${item.name} 尚在冷却中（${cd} 回合）。`, 'sys');
    UI.updateBattle();
    return;
  }
  const e = Game.battle.enemy;
  if (item.special === 'stun') {
    if (isFinalBoss(e)) logBattle(`你祭起${item.name}，宝光尚未近身便被${e.name}震碎；其免疫控制。`, 'enemy');
    else {
      e.stunned = true;
      logBattle(`你祭起${item.name}，一道宝光罩向 ${e.name}，将其定在原地！`, 'player');
    }
  } else if (item.special === 'heal_mana') {
    const heal = Math.max(1, Math.floor(Game.state.maxHp * 0.30));
    const mana = Math.max(1, Math.floor(Game.state.maxMp * 0.30));
    Game.state.hp = Math.min(Game.state.maxHp, Game.state.hp + heal);
    Game.state.mp = Math.min(Game.state.maxMp, Game.state.mp + mana);
    logBattle(`你祭起${item.name}，鼎中灵光流转，回复 ${heal} 气血与 ${mana} 灵力！`, 'player');
  } else if (item.special === 'weaken') {
    if (isFinalBoss(e)) logBattle(`你拨动${item.name}，琴音被${e.name}震散；其免疫减益。`, 'enemy');
    else {
      e.rootedTurns = 1;
      logBattle(`你拨动${item.name}，琴音缠绕 ${e.name} 的神魂，其下次攻击失效！`, 'player');
    }
  } else if (item.special === 'heal') {
    const heal = Math.max(1, Math.floor(Game.state.maxHp * 0.50));
    Game.state.hp = Math.min(Game.state.maxHp, Game.state.hp + heal);
    logBattle(`你祭起${item.name}，药气回春，回复 ${heal} 气血！`, 'player');
  }
  Game.battle.specialCd = Game.battle.specialCd || {};
  Game.battle.specialCd[itemId] = item.specialCd || 10;
  enemyTurn();
}

function decrementSpecialCd() {
  if (!Game.battle.specialCd) return;
  for (const k in Game.battle.specialCd) {
    if (Game.battle.specialCd[k] > 0) Game.battle.specialCd[k]--;
  }
}

function enemyTurn() {
  if (Game.battle.ended) return;
  Game.battle.turn = 'enemy';
  setTimeout(() => {
    const s = Game.state;
    const e = Game.battle.enemy;
    if (isFinalBoss(e)) {
      // 旧回合残留状态也不应影响终局 Boss。
      e.burnTurns = 0;
      e.waterTurns = 0;
      e.rootedTurns = 0;
      e.stunned = false;
      e.armorBreak = 0;
      e.armorBreakTurns = 0;
    }
    if (e.burnTurns > 0) {
      const burn = dealDamageToEnemy(e, e.burnDamage || 1);
      e.burnTurns--;
      logBattle(`${e.name} 被烈焰灼烧，受到 ${burn} 点伤害！`, 'player');
      checkBattleEnd();
      if (Game.battle.ended) return;
    }
    if (e.waterTurns > 0) {
      const water = dealDamageToEnemy(e, e.waterDamage || 1);
      e.waterTurns--;
      logBattle(`${e.name} 被寒水侵蚀，受到 ${water} 点伤害！`, 'player');
      checkBattleEnd();
      if (Game.battle.ended) return;
    }
    if (Game.battle.poisonTurns > 0) {
      const poison = Math.max(1, Math.floor(s.maxHp * (Game.battle.poisonPct || 0.02)));
      s.hp -= poison;
      Game.battle.poisonTurns--;
      logBattle(`毒煞发作，你损失 ${poison} 点气血！`, 'enemy');
      checkBattleEnd();
      if (Game.battle.ended) return;
    }
    if (isFinalBoss(e)) {
      performFinalBossAttack(s, e);
    } else if (e.stunned) {
      e.stunned = false;
      logBattle(`${e.name} 被法宝定在原地，动弹不得！`, 'sys');
    } else if (!e.untouchable && e.rootedTurns > 0) {
      e.rootedTurns--;
      logBattle(`${e.name} 被藤蔓封住经脉，下一次攻击完全落空！`, 'sys');
    } else if (!e.untouchable && performEnemySpecial(s, e)) {
      // 敌方施展专属神通的回合，不再叠加普通攻击。
    } else if (e.untouchable) {
      // 天劫特殊：每次造成固定大伤害，但玩家可用防御硬扛
      let dmg = Math.max(5, Math.floor(s.maxHp * (e.tribDmg || 0.15)));
      if (Game.battle.defending) {
        dmg = Math.floor(dmg * 0.4);
        Game.battle.defending = false;
        logBattle('你凝神守一，护体灵光硬撼天雷！', 'player');
      }
      if (Game.battle.waterGuard) {
        dmg = Math.floor(dmg * (1 - Game.battle.waterGuard));
        Game.battle.waterGuard = 0;
        logBattle('水幕流转，替你卸去了大半伤势！', 'player');
      }
      if (Game.battle.danxiaGuard) {
        const guard = Game.battle.danxiaGuard;
        const reflect = Math.max(1, Math.floor(dmg * guard.reflect));
        dmg = Math.floor(dmg * (1 - guard.reduce));
        Game.battle.danxiaGuard = 0;
        const actualReflect = dealDamageToEnemy(e, reflect);
        logBattle(`丹霞灵壁展开，将来袭之力卸去大半，并反震 ${e.name} ${actualReflect} 点伤害！`, 'player');
      }
      dmg = applySpecialArmorReduction(s, dmg, true);
      dmg = applyPetIncomingDamage(s, dmg);
      s.hp -= dmg;
      Game.battle.turnCount = (Game.battle.turnCount || 0) + 1;
      logBattle(`${e.name} 降下天威，你受到 ${dmg} 点伤害！`, 'enemy');
    } else {
      const isMagic = e.matk > e.atk;
      let dmg = isMagic
        ? Math.max(1, e.matk - s.mdef + (e.pen || 0) + Math.floor(Math.random() * 3))
        : Math.max(1, e.atk - s.def + (e.pen || 0) + Math.floor(Math.random() * 3));
      if (e.boss) dmg = Math.floor(dmg * BOSS_DMG_MULT);
      if (Game.battle.defending) {
        dmg = Math.floor(dmg * 0.4);
        Game.battle.defending = false;
        logBattle('你以守代攻，护体光罩硬生生接下了这一击，身形一晃，气血翻涌。', 'player');
      } else {
        // 根据敌人类型选用不同的攻击描述
        const attackLines = {
          wolf: '野狼龇牙咧嘴，纵身扑来，利爪划破空气！',
          bandit: '山贼挥刀横斩，刀风扑面，直取你脖颈！',
          snake_demon: '蛇妖长尾一甩，毒牙暴起，带着腥风咬向你！',
          low_monk: '那修士剑诀一引，法器化作一道寒芒，激射而至！',
          stone_monkey: '石猴捶胸咆哮，举起巨石般的拳头，重重砸下！',
          blood_cultist: '血教弟子狞笑一声，血色爪芒划破虚空，抓向你的天灵盖！',
          bifuluan: '毕方清啸一声，张口喷出一团青焰，所过之处空气都被点燃！',
          qiongqi: '穷奇怒吼，双翼展开，如一座小山般碾压过来！',
          taotie: '饕餮巨口一张，一股磅礴吸力席卷四方，要将你生吞活剥！',
          nine_tails: '九尾狐媚眼如丝，九条狐尾忽然化作九道利刃，同时袭来！',
          yinglong: '应龙龙吟震九霄，龙爪带着万钧之势从天而降！',
          dao_competitor: '对手步法轻灵，一招紧似一招，法器在掌中化作一道流光！',
          dao_elder: '长老袍袖一挥，灵力如山如海般压来，令人窒息！',
          demon_lord: '魔尊冷笑，魔气滔天，一只漆黑的巨手自虚空中探出，抓向你的神魂！',
        };
        const line = attackLines[e.id] || `${e.name} 发出一声怒吼，朝你猛扑过来！`;
        logBattle(line, 'enemy');
      }
      if (Game.battle.waterGuard) {
        dmg = Math.floor(dmg * (1 - Game.battle.waterGuard));
        Game.battle.waterGuard = 0;
        logBattle('水幕流转，替你卸去了大半伤势！', 'player');
      }
      if (Game.battle.danxiaGuard) {
        const guard = Game.battle.danxiaGuard;
        const reflect = Math.max(1, Math.floor(dmg * guard.reflect));
        dmg = Math.floor(dmg * (1 - guard.reduce));
        Game.battle.danxiaGuard = 0;
        const actualReflect = dealDamageToEnemy(e, reflect);
        logBattle(`丹霞灵壁展开，将来袭之力卸去大半，并反震 ${e.name} ${actualReflect} 点伤害！`, 'player');
      }
      dmg = applySpecialArmorReduction(s, dmg, isMagic);
      dmg = applyPetIncomingDamage(s, dmg);
      dmg = tryPetDodge(s, dmg);
      s.hp -= dmg;
      if (dmg > 0) logBattle(`你受到 ${dmg} 点伤害。`, 'enemy');
      // 战斗彩蛋：敌人独白（普通小怪与 Boss，天劫除外）
      if (!e.untouchable) {
        const enemyEgg = rollEasterEgg(EASTER_EGG_ENEMY_ATK, 0.15);
        if (enemyEgg) logBattle(enemyEgg, 'enemy');
      }
      if (Game.battle.metalReflect) {
        const reflect = Math.max(1, Math.floor(dmg * Game.battle.metalReflect));
        const actualReflect = dealDamageToEnemy(e, reflect);
        Game.battle.metalReflect = 0;
        logBattle(`金灵反震，${e.name} 受到 ${actualReflect} 点反伤！`, 'player');
      }
    }
    checkBattleEnd();
    // 仅终局 Boss 与玩家各完成一次常规行动才算一回合；额外回合和连击不额外计数。
    if (!Game.battle.ended && isFinalBoss(e)) {
      Game.battle.finalBossRounds = (Game.battle.finalBossRounds || 0) + 1;
      if (Game.battle.finalBossRounds > 50) {
        endFinalBossBattleByTimeout();
        return;
      }
    }
    if (!Game.battle.ended) {
      if (e.armorBreakTurns > 0 && --e.armorBreakTurns === 0) e.armorBreak = 0;
      if (Game.battle.enemySpecialCd > 0) Game.battle.enemySpecialCd--;
      if (Game.battle.playerWeakenTurns > 0 && --Game.battle.playerWeakenTurns === 0) {
        Game.battle.playerWeakenRate = 0;
        logBattle('压制感消散，你的攻势恢复如常。', 'sys');
      }
      if (Game.battle.attackBoostTurns > 0 && --Game.battle.attackBoostTurns === 0) {
        Game.battle.attackBoost = 0;
        logBattle('增益真元渐渐散去，攻击恢复如常。', 'sys');
      }
      decrementSpecialCd();
      const manaGain = restoreBattleMana(s);
      logBattle(`灵气回流，恢复 ${manaGain} 点灵力。`, 'sys');
      tryDivinePetManaRecovery(s);
      if (Game.battle.playerStunnedTurns > 0) {
        Game.battle.playerStunnedTurns--;
        logBattle('你仍陷在眩晕之中，本次行动被迫跳过！', 'enemy');
        enemyTurn();
        return;
      }
      Game.battle.turn = 'player';
      UI.updateBattle();
    }
  }, 600);
}

// 重复击杀同一敌人，经验递减（第 n 次击杀 = 基础 × 0.7^(n-1)，下限 10%）
function grantBattleXp(s, enemyId, baseXp) {
  if (!s.killCount) s.killCount = {};
  const n = s.killCount[enemyId] || 0;
  const mult = Math.max(0.1, Math.pow(0.7, n));
  s.killCount[enemyId] = n + 1;
  return Math.floor(baseXp * mult);
}

function checkBattleEnd() {
  const s = Game.state;
  const e = Game.battle.enemy;
  const rewardMultiplier = 1 + (Game.battle.rewardBoost || 0);

  if (s.hp <= 0) {
    s.hp = 0;
    Game.battle.ended = true;
    s.stats.battleLoss++;
    s.stats.winStreak = 0;
    logBattle('你倒了下去……', 'sys');
    playLoseSound();
    setTimeout(() => {
      Game.battle.loseCallback && Game.battle.loseCallback();
      UI.battleEnd(false, Game.battle.loseNext || Game.state.nodeId);
    }, 1500);
    UI.updateBattle();
    return;
  }

  if (e.untouchable && Game.battle.tribulation && Game.battle.turns > 0 && Game.battle.turnCount >= Game.battle.turns) {
    Game.battle.ended = true;
    s.stats.battleWin++;
    s.stats.winStreak++;
    s.stats.enemiesKilled++;
    incDailyTask('battle');
    const xpGain = Math.floor(e.xp * rewardMultiplier);
    addXp(s, xpGain);
    const stoneBase = e.stoneMin + Math.floor(Math.random() * (e.stoneMax - e.stoneMin + 1));
    const stoneGain = Math.floor(stoneBase * rewardMultiplier);
    s.stone += stoneGain;
    if (e.fame) s.fame += Math.floor(e.fame * rewardMultiplier);
    logBattle(`你硬生生扛过了 ${Game.battle.turns} 重天雷，劫云随之散去！获得 ${xpGain} 修为、${stoneGain} 灵石。`, 'sys');
    playWinSound();
    setTimeout(() => {
      Game.battle.winCallback && Game.battle.winCallback();
      UI.battleEnd(true, Game.battle.winNext || Game.state.nodeId);
    }, 1500);
    UI.updateBattle();
    return;
  }

  if (e.hp <= 0 && !e.untouchable) {
    e.hp = 0;
    Game.battle.ended = true;
    s.stats.battleWin++;
    s.stats.winStreak++;
    s.stats.enemiesKilled++;
    incDailyTask('battle');
    // 奖励（重复击杀同一敌人，经验递减）
    const xpGain = Math.floor(grantBattleXp(s, e.id, e.xp) * rewardMultiplier);
    addXp(s, xpGain);
    const stoneBase = e.stoneMin + Math.floor(Math.random() * (e.stoneMax - e.stoneMin + 1));
    const stoneGain = Math.floor(stoneBase * rewardMultiplier);
    s.stone += stoneGain;
    const fameGain = e.fame ? Math.floor(e.fame * rewardMultiplier) : 0;
    if (fameGain) s.fame += fameGain;
    // 掉落
    let dropText = '';
    if (e.drops && e.drops.length) {
      e.drops.forEach(d => {
        if (Math.random() < Math.min(1, d.chance * rewardMultiplier)) {
          grantItem(s, d.id, 1);
          const item = ITEMS[d.id];
          if (item) dropText += `${item.name} `;
        }
      });
    }
    const equipStoneText = tryEquipStoneDrop(s, e);
    const finalBossLootText = tryFinalBossLoot(s, e);
    const stealText = tuntunshuSteal(s, e, stoneGain);
    const rewardBoostText = Game.battle.rewardBoost ? ` 燃血夺宝生效：奖励提高${Math.round(Game.battle.rewardBoost * 100)}%。` : '';
    logBattle(`你战胜了 ${e.name}！获得 ${xpGain} 修为、${stoneGain} 灵石${fameGain ? `、${fameGain} 名望` : ''}。${dropText ? '掉落：' + dropText : ''}${equipStoneText ? ' ' + equipStoneText : ''}${finalBossLootText ? ' ' + finalBossLootText : ''}${rewardBoostText}${stealText ? ' ' + stealText : ''}`, 'sys');
    playWinSound();
    setTimeout(() => {
      Game.battle.winCallback && Game.battle.winCallback();
      UI.battleEnd(true, Game.battle.winNext || Game.state.nodeId);
    }, 1500);
    UI.updateBattle();
    return;
  }

  UI.updateBattle();
}

// ========== 兑换码 ==========
function redeemCode(code) {
  const s = Game.state;
  if (!s) return { ok: false, msg: '尚未开始游戏' };
  const key = (code || '').trim().toUpperCase();
  if (!key) return { ok: false, msg: '请输入兑换码' };
  const reward = REDEEM_CODES[key];
  if (!reward) return { ok: false, msg: '兑换码无效' };
  if (!s.redeemed) s.redeemed = [];
  if (!reward.repeatable && s.redeemed.includes(key)) return { ok: false, msg: '该兑换码已领取过' };

  const parts = [];
  if (reward.tribulations) {
    if (!s.tribulations) s.tribulations = {};
    for (const g of TRIBULATION_GATES) s.tribulations[g.key] = true;
    parts.push('已渡全部天劫');
  }
  if (reward.tribulationBlessing) {
    s.tribulationBlessing = true;
    parts.push('获得天道庇佑（修为圆满后可免渡劫）');
  }
  if (reward.deathNoReincarnation) {
    s.deathNoReincarnation = true;
    parts.push('获得天命护持（死亡不降修为，仍获转世增幅）');
  }
  if (reward.stone) { s.stone += reward.stone; parts.push(`灵石×${reward.stone}`); }
  if (reward.xp) {
    addXp(s, reward.xp, !!reward.skipTribulations);
    parts.push(`修为×${reward.xp}`);
    if (reward.skipTribulations) parts.push('本次修为突破已越过天劫');
  }
  if (reward.dao) { s.dao += reward.dao; parts.push(`道韵×${reward.dao}`); }
  if (reward.fame) { s.fame += reward.fame; parts.push(`名望×${reward.fame}`); }
  if (reward.item && reward.item.id) {
    const cnt = reward.item.count || 1;
    grantItem(s, reward.item.id, cnt);
    const it = ITEMS[reward.item.id];
    parts.push(`${it ? it.name : reward.item.id}×${cnt}`);
  }
  if (reward.items && Array.isArray(reward.items)) {
    for (const itm of reward.items) {
      if (!itm || !itm.id) continue;
      const cnt = itm.count || 1;
      grantItem(s, itm.id, cnt);
      const it = ITEMS[itm.id];
      parts.push(`${it ? it.name : itm.id}×${cnt}`);
    }
  }

  if (!reward.repeatable) s.redeemed.push(key);
  autoSave();
  return { ok: true, msg: '兑换成功：' + parts.join('、') };
}

// ========== 签到与日常 ==========
function getTodayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
// 刷新每日状态（跨天时重置日常任务）
function refreshDaily() {
  const s = Game.state;
  if (!s) return;
  if (!s.signIn) s.signIn = { lastDate: '', streak: 0, total: 0 };
  if (!s.daily) s.daily = { date: '', tasks: {}, claimed: {} };
  const today = getTodayStr();
  if (s.daily.date !== today) {
    s.daily.date = today;
    s.daily.tasks = {};
    s.daily.claimed = {};
    DAILY_TASKS.forEach(t => { s.daily.tasks[t.key] = 0; });
  }
}
// 日常任务进度 +1（由各动作埋点调用）
function incDailyTask(key) {
  const s = Game.state;
  if (!s) return;
  refreshDaily();
  if (s.daily.tasks[key] == null) s.daily.tasks[key] = 0;
  s.daily.tasks[key]++;
}
// 每日签到
function signIn() {
  refreshDaily();
  const s = Game.state;
  const today = getTodayStr();
  if (s.signIn.lastDate === today) return { ok: false, msg: '今日已签到' };
  s.signIn.streak = (s.signIn.lastDate === getYesterdayStr()) ? s.signIn.streak + 1 : 1;
  s.signIn.lastDate = today;
  s.signIn.total = (s.signIn.total || 0) + 1;
  const idx = (s.signIn.streak - 1) % SIGNIN_REWARDS.length;
  const r = SIGNIN_REWARDS[idx];
  const parts = [];
  if (r.stone) { s.stone += r.stone; parts.push(`灵石×${r.stone}`); }
  if (r.item && ITEMS[r.item.id]) { grantItem(s, r.item.id, r.item.count); parts.push(`${ITEMS[r.item.id].name}×${r.item.count}`); }
  autoSave();
  return { ok: true, msg: `签到成功！连续第 ${s.signIn.streak} 天，获得 ${parts.join('、')}` };
}
// 领取日常任务奖励
function claimDailyTask(key) {
  refreshDaily();
  const s = Game.state;
  const task = DAILY_TASKS.find(t => t.key === key);
  if (!task) return { ok: false, msg: '任务不存在' };
  if (s.daily.claimed[key]) return { ok: false, msg: '该奖励已领取' };
  if ((s.daily.tasks[key] || 0) < 1) return { ok: false, msg: '任务尚未完成' };
  s.daily.claimed[key] = true;
  const parts = [];
  if (task.reward.stone) { s.stone += task.reward.stone; parts.push(`灵石×${task.reward.stone}`); }
  if (task.reward.xp) { addXp(s, task.reward.xp); parts.push(`修为×${task.reward.xp}`); }
  autoSave();
  return { ok: true, msg: `领取成功：${parts.join('、')}` };
}
