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
const PLAYER_ATK_SCALE = 0.8;

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
  if (!Game.state.tribulations) Game.state.tribulations = {};
  backfillTribulations(Game.state);
  clampByTribulation(Game.state);
  realignRealm(Game.state);
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
    atk: 8,
    def: 2,
    matk: 8,
    mdef: 2,
    pen: 0,
    stone: 20,
    fame: 0,
    dao: 0,
    bag: { huiqi_pill: 2 },
    equipment: { weapon: null, armor: null },
    equipLevel: {},
    achievements: [],
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
  };
}

function resetGame() {
  localStorage.removeItem('fantu_save');
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
  newGame();
  goToNode('start');
  UI.showToast('已重新开始（手动存档已保留）');
}

// ========== 存档 ==========
function saveGame(slot = 0) {
  if (!Game.state) return;
  const key = slot === 0 ? 'fantu_save' : `fantu_save_${slot}`;
  Game.state.nodeId = Game.currentNode;
  localStorage.setItem(key, JSON.stringify(Game.state));
}

function loadGame(slot = 0) {
  const key = slot === 0 ? 'fantu_save' : `fantu_save_${slot}`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function autoSave() {
  saveGame(0);
}

// ========== 灵根 ==========
function rollLinggen(s) {
  const keys = Object.keys(LINGGEN);
  s.linggen = keys[Math.floor(Math.random() * keys.length)];
  // 根据灵根微调初始属性
  const lg = s.linggen;
  if (lg === 'metal')  { s.atk += 2; }
  if (lg === 'wood')   { s.maxHp += 20; s.hp += 20; }
  if (lg === 'water')  { s.def += 2; }
  if (lg === 'fire')   { s.atk += 3; }
  if (lg === 'thunder'){ s.atk += 2; s.dao += 2; }
  if (lg === 'sword')  { s.atk += 2; s.def += 1; }
}

// ========== 境界 ==========
function getRealmIndex(s) {
  // REALMS[i].max 是累计修为上限，直接比较即可，无需累加
  for (let i = 0; i < REALMS.length; i++) {
    if (s.xp < REALMS[i].max) {
      return i;
    }
  }
  return REALMS.length - 1;
}

function getRealmInfo(s) {
  if (!s) s = Game.state;
  const idx = getRealmIndex(s);
  return REALMS[idx];
}

function getXpToNext(s) {
  const idx = getRealmIndex(s);
  const prev = idx > 0 ? REALMS[idx - 1].max : 0;
  let cur = s.xp - prev;
  const max = REALMS[idx].max - prev;
  if (cur > max) cur = max; // 满级封顶，进度条保持满
  return { cur, max };
}

// ========== 渡劫门槛 ==========
const TRIBULATION_GATES = [
  { gateIdx: 9,  key: 'zhuji',    name: '筑基' },
  { gateIdx: 13, key: 'jindan',   name: '金丹' },
  { gateIdx: 17, key: 'yuanying', name: '元婴' },
  { gateIdx: 21, key: 'huashen',  name: '化神' },
];

// 修复旧存档：根据当前境界补齐已渡过的天劫 flag（防止高境界玩家因 flag 缺失被错误卡回）
function backfillTribulations(s) {
  if (!s.tribulations) s.tribulations = {};
  const idx = getRealmIndex(s);
  for (const g of TRIBULATION_GATES) {
    if (idx >= g.gateIdx + 1) s.tribulations[g.key] = true;
  }
}

// 未渡劫则修为被卡在大圆满，无法跨越大境界
function clampByTribulation(s) {
  if (!s.tribulations) s.tribulations = {};
  for (const g of TRIBULATION_GATES) {
    if (!s.tribulations[g.key] && s.xp >= REALMS[g.gateIdx].max) {
      s.xp = REALMS[g.gateIdx].max - 1;
      UI.showToast(`境界桎梏：需渡过${g.name}天劫方可晋升`);
    }
  }
}

// 渡劫成功：设置 flag 并将修为提升到下一大境界
function passTribulation(s, key, gateIdx) {
  if (!s.tribulations) s.tribulations = {};
  s.tribulations[key] = true;
  const oldIdx = getRealmIndex(s);
  const threshold = REALMS[gateIdx].max;
  if (s.xp < threshold) s.xp = threshold;
  const newIdx = getRealmIndex(s);
  if (newIdx > oldIdx) {
    breakthrough(s, oldIdx, newIdx);
  }
  updateStatsFromRealm(s);
  autoSave();
}

function addXp(s, amount) {
  const oldIdx = getRealmIndex(s);
  s.xp += amount;
  clampByTribulation(s);
  const newIdx = getRealmIndex(s);
  if (newIdx > oldIdx) {
    // 突破
    breakthrough(s, oldIdx, newIdx);
  }
  updateStatsFromRealm(s);
}

function breakthrough(s, oldIdx, newIdx) {
  const oldRealm = REALMS[oldIdx];
  const newRealm = REALMS[newIdx];
  // 每突破一个小境界都加点
  for (let i = oldIdx + 1; i <= newIdx; i++) {
    const r = REALMS[i];
    s.maxHp = Math.floor(r.max * 0.6) + 50;
    s.atk = r.atk;
    s.def = r.def;
    s.matk = r.atk;
    s.mdef = r.def;
  }
  s.hp = s.maxHp;
  UI.showToast(`突破！${newRealm.name}`);
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
  s.maxHp = Math.floor(r.max * 0.6) + 50;
  s.atk = r.atk;
  s.def = r.def;
  s.matk = r.atk;
  s.mdef = r.def;
  s.atkBase = r.atk;
  s.defBase = r.def;
  s.matkBase = r.atk;
  s.mdefBase = r.def;
  if (s.hp > s.maxHp) s.hp = s.maxHp;
}

// 读取装备槽中某前缀属性的加成（含强化等级，每级 +2）
function getEquipBonus(s, slot, prefix) {
  const id = s.equipment && s.equipment[slot];
  if (!id) return 0;
  const it = ITEMS[id];
  if (!it || !it.effect || !it.effect.startsWith(prefix)) return 0;
  const base = parseInt(it.effect.slice(prefix.length)) || 0;
  const lv = (s.equipLevel && s.equipLevel[id]) || 0;
  return base + lv * 2;
}

// 计算五维属性（含装备）：物攻/法攻/物抗/法抗/穿透
function getTotalAtk(s) {
  let atk = s.atkBase || s.atk;
  atk += getEquipBonus(s, 'weapon', 'atk');
  return Math.floor(atk * PLAYER_ATK_SCALE);
}
function getTotalMatk(s) {
  let matk = (s.matkBase != null) ? s.matkBase : (s.atkBase || s.atk);
  matk += getEquipBonus(s, 'weapon', 'matk');
  return Math.floor(matk * PLAYER_ATK_SCALE);
}
function getTotalDef(s) {
  let def = s.defBase || s.def;
  def += getEquipBonus(s, 'armor', 'def');
  return def;
}
function getTotalMdef(s) {
  let mdef = (s.mdefBase != null) ? s.mdefBase : (s.defBase || s.def);
  mdef += getEquipBonus(s, 'armor', 'mdef');
  return mdef;
}
function getTotalPen(s) {
  let pen = s.pen || 0;
  pen += getEquipBonus(s, 'weapon', 'pen');
  pen += getEquipBonus(s, 'armor', 'pen');
  return pen;
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
  if (!hasItem(id)) return false;

  if (item.type === 'pill') {
    if (item.healPct) {
      const heal = Math.max(1, Math.floor(s.maxHp * item.healPct));
      s.hp = Math.min(s.maxHp, s.hp + heal);
      UI.showToast(`服用${item.name}，回复${heal}气血`);
    } else if (item.effect === 'xp50') {
      addXp(s, 50);
      UI.showToast(`服用${item.name}，获得50修为`);
    } else {
      UI.showToast('此物品无法直接使用');
      return false;
    }
    removeItemFromState(s, id, 1);
    incDailyTask('pill');
  } else if (item.type === 'weapon') {
    // 装备/卸下
    const key = item.effect && (item.effect.startsWith('def') || item.effect.startsWith('mdef')) ? 'armor' : 'weapon';
    if (s.equipment[key] === id) {
      // 卸下
      s.equipment[key] = null;
      UI.showToast(`卸下${item.name}`);
    } else {
      // 装备（旧的放回背包）
      if (s.equipment[key]) {
        grantItem(s, s.equipment[key], 1);
      }
      s.equipment[key] = id;
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
  if (s.equipment.weapon === id || s.equipment.armor === id) {
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

// 抽卡（藏宝阁）：扣除灵石，按稀有度权重抽一件装备
// 单次抽卡核心（不含扣灵石/存档/UI），更新保底计数并返回结果
function rollGachaOnce(s) {
  s.gachaCount = (s.gachaCount || 0) + 1;
  if (s.gachaSinceXian == null) s.gachaSinceXian = 0;
  // 仙品档在池子最后
  const xianTier = GACHA_POOL[GACHA_POOL.length - 1];
  let tier;
  if (s.gachaSinceXian >= GACHA_PITY - 1) {
    // 保底：第 GACHA_PITY 抽强制出仙品
    tier = xianTier;
  } else {
    let roll = Math.random() * 100;
    tier = GACHA_POOL[0];
    for (const t of GACHA_POOL) {
      if (roll < t.weight) { tier = t; break; }
      roll -= t.weight;
    }
  }
  if (tier === xianTier) {
    s.gachaSinceXian = 0;
  } else {
    s.gachaSinceXian++;
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
  const s = Game.state;
  if (s.stone < GACHA_COST) {
    UI.showToast(`灵石不足（需 ${GACHA_COST}）`);
    return null;
  }
  s.stone -= GACHA_COST;
  const r = rollGachaOnce(s);
  autoSave();
  UI.updateStats();
  UI.updateBag();
  return r;
}

// 十连抽
function gachaDrawTen() {
  const s = Game.state;
  const cost = GACHA_COST * 10;
  if (s.stone < cost) {
    UI.showToast(`灵石不足（十连需 ${cost}）`);
    return null;
  }
  s.stone -= cost;
  const results = [];
  for (let i = 0; i < 10; i++) {
    results.push(rollGachaOnce(s));
  }
  autoSave();
  UI.updateStats();
  UI.updateBag();
  return results;
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

// 强化已装备的武器/防具
const EQUIP_MAX_LEVEL = 5;
function strengthenItem(id) {
  const s = Game.state;
  const item = ITEMS[id];
  if (!item) return false;
  if (item.type !== 'weapon') { UI.showToast('该物品无法强化'); return false; }
  const isEquipped = s.equipment.weapon === id || s.equipment.armor === id;
  if (!isEquipped) { UI.showToast('请先装备再强化'); return false; }

  const lv = (s.equipLevel && s.equipLevel[id]) || 0;
  if (lv >= EQUIP_MAX_LEVEL) { UI.showToast('已达到最高强化等级'); return false; }

  const costStone = (lv + 1) * 20;
  if (!hasItem('lieyangshi', 1)) { UI.showToast('需要 烈阳石×1'); return false; }
  if (s.stone < costStone) { UI.showToast(`灵石不足（需 ${costStone}）`); return false; }

  removeItemFromState(s, 'lieyangshi', 1);
  s.stone -= costStone;
  if (!s.equipLevel) s.equipLevel = {};
  s.equipLevel[id] = lv + 1;
  UI.showToast(`强化成功！${item.name} +${lv + 1}`);
  incDailyTask('strengthen');
  autoSave();
  UI.updateStats();
  UI.updateBag();
  return true;
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
    untouchable: !!enemyData.untouchable,
    tribDmg: enemyData.tribDmg || 0.15,
  };

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
    pillUsed: 0,
    specialCd: {},
  };

  logBattle(`遭遇了 ${enemy.name}！`, 'sys');
}

function logBattle(text, type = 'sys') {
  Game.battle.log.push({ text, type });
}

function playerAttack() {
  if (Game.battle.ended || Game.battle.turn !== 'player') return;
  const s = Game.state;
  const e = Game.battle.enemy;
  const dmg = Math.max(1, s.atk - e.def + (s.pen || 0) + Math.floor(Math.random() * 5));
  e.hp -= dmg;
  logBattle(`你身形一动，法器在手，全力向 ${e.name} 攻去！`, 'player');
  logBattle(`命中要害，造成 ${dmg} 点伤害。`, 'player');
  checkBattleEnd();
  if (!Game.battle.ended) enemyTurn();
}

function playerSkill() {
  if (Game.battle.ended || Game.battle.turn !== 'player') return;
  const s = Game.state;
  const e = Game.battle.enemy;
  const lg = LINGGEN[s.linggen];
  // 灵技伤害 = 攻击力 * 1.5 ~ 2
  const mult = 1.5 + Math.random() * 0.5;
  const dmg = Math.max(1, Math.floor(s.matk * mult) - e.mdef + (s.pen || 0));
  e.hp -= dmg;
  logBattle(lg.skillText, 'player');
  logBattle(`【${lg.skill}】对 ${e.name} 造成 ${dmg} 点伤害！`, 'player');
  checkBattleEnd();
  if (!Game.battle.ended) enemyTurn();
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
  if (!item || !item.healPct) {
    logBattle('此物并非回血丹药。', 'sys');
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
  // 修为越高，服药越容易被敌人打断；打断后药被消耗但效果落空
  const interruptChance = Math.min(0.35, 0.05 + getRealmIndex(s) * 0.015);
  removeItemFromState(s, id, 1);
  Game.battle.pillUsed = (Game.battle.pillUsed || 0) + 1;
  if (Math.random() < interruptChance) {
    logBattle(`你正欲服下${item.name}，${Game.battle.enemy.name} 却看准破绽猛攻而来！丹药被打落在地，白白损失。`, 'enemy');
    Game.battle.selectingPill = false;
    enemyTurn();
    return;
  }
  const heal = Math.max(1, Math.floor(s.maxHp * item.healPct));
  s.hp = Math.min(s.maxHp, s.hp + heal);
  logBattle(`你探手取出一枚${item.name}，仰头吞下。一股温润的药力在体内化开，伤势顿时好转。`, 'player');
  logBattle(`恢复了 ${heal} 点气血。`, 'player');
  Game.battle.selectingPill = false;
  enemyTurn();
}

function playerFlee() {
  if (Game.battle.ended || Game.battle.turn !== 'player') return;
  const e = Game.battle.enemy;
  if (e.boss) {
    logBattle(`${e.name} 气息如山岳般压来，将你退路完全封死，根本无从逃遁！`, 'sys');
    enemyTurn();
    return;
  }
  const chance = 0.4 + Game.state.dao * 0.004;
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
    logBattle('你刚要抽身，对方早已看破，反手一击逼得你不得不回防。', 'sys');
    enemyTurn();
  }
}

// 使用法宝特效（如混沌钟：控制敌人一回合，CD 10 回合）
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
    e.stunned = true;
    logBattle(`你祭起${item.name}，一道宝光罩向 ${e.name}，将其定在原地！`, 'player');
  }
  Game.battle.specialCd = Game.battle.specialCd || {};
  Game.battle.specialCd[itemId] = 10; // 冷却 10 回合
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
    if (e.stunned) {
      e.stunned = false;
      logBattle(`${e.name} 被法宝定在原地，动弹不得！`, 'sys');
    } else if (e.untouchable) {
      // 天劫特殊：每次造成固定大伤害，但玩家可用防御硬扛
      let dmg = Math.max(5, Math.floor(s.maxHp * (e.tribDmg || 0.15)));
      if (Game.battle.defending) {
        dmg = Math.floor(dmg * 0.4);
        Game.battle.defending = false;
        logBattle('你凝神守一，护体灵光硬撼天雷！', 'player');
      }
      s.hp -= dmg;
      Game.battle.turnCount = (Game.battle.turnCount || 0) + 1;
      logBattle(`${e.name} 降下天威，你受到 ${dmg} 点伤害！`, 'enemy');
    } else {
      const isMagic = e.matk > e.atk;
      let dmg = isMagic
        ? Math.max(1, e.matk - s.mdef + (e.pen || 0) + Math.floor(Math.random() * 3))
        : Math.max(1, e.atk - s.def + (e.pen || 0) + Math.floor(Math.random() * 3));
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
      s.hp -= dmg;
      logBattle(`你受到 ${dmg} 点伤害。`, 'enemy');
    }
    checkBattleEnd();
    if (!Game.battle.ended) {
      decrementSpecialCd();
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

  if (s.hp <= 0) {
    s.hp = 0;
    Game.battle.ended = true;
    s.stats.battleLoss++;
    s.stats.winStreak = 0;
    logBattle('你倒了下去……', 'sys');
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
    addXp(s, e.xp);
    const stoneGain = e.stoneMin + Math.floor(Math.random() * (e.stoneMax - e.stoneMin + 1));
    s.stone += stoneGain;
    if (e.fame) s.fame += e.fame;
    logBattle(`你硬生生扛过了 ${Game.battle.turns} 重天雷，劫云随之散去！获得 ${e.xp} 修为、${stoneGain} 灵石。`, 'sys');
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
    const xpGain = grantBattleXp(s, e.id, e.xp);
    addXp(s, xpGain);
    const stoneGain = e.stoneMin + Math.floor(Math.random() * (e.stoneMax - e.stoneMin + 1));
    s.stone += stoneGain;
    if (e.fame) s.fame += e.fame;
    // 掉落
    let dropText = '';
    if (e.drops && e.drops.length) {
      e.drops.forEach(d => {
        if (Math.random() < d.chance) {
          grantItem(s, d.id, 1);
          const item = ITEMS[d.id];
          if (item) dropText += `${item.name} `;
        }
      });
    }
    logBattle(`你战胜了 ${e.name}！获得 ${xpGain} 修为、${stoneGain} 灵石。${dropText ? '掉落：' + dropText : ''}`, 'sys');
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
  if (s.redeemed.includes(key)) return { ok: false, msg: '该兑换码已领取过' };

  const parts = [];
  if (reward.stone) { s.stone += reward.stone; parts.push(`灵石×${reward.stone}`); }
  if (reward.xp) { addXp(s, reward.xp); parts.push(`修为×${reward.xp}`); }
  if (reward.dao) { s.dao += reward.dao; parts.push(`道韵×${reward.dao}`); }
  if (reward.fame) { s.fame += reward.fame; parts.push(`名望×${reward.fame}`); }
  if (reward.item && reward.item.id) {
    const cnt = reward.item.count || 1;
    grantItem(s, reward.item.id, cnt);
    const it = ITEMS[reward.item.id];
    parts.push(`${it ? it.name : reward.item.id}×${cnt}`);
  }

  s.redeemed.push(key);
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
