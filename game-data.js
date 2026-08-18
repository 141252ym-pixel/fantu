// ========== 灵根设定 ==========
const LINGGEN = {
  metal:   { name: '金灵根', color: '#b8b8b8', skill: '金刃斩', desc: '锋锐无匹，破甲伤身',
             skillText: '你催动金灵根，指尖凝聚出一道金芒，化作一柄无形利刃，破空而出！' },
  wood:    { name: '木灵根', color: '#5d8a4a', skill: '缠藤术', desc: '生生不息，恢复制敌',
             skillText: '你脚下木灵气涌动，数道藤蔓自地面暴起，如毒蛇般缠向敌人！' },
  water:   { name: '水灵根', color: '#4a7a9a', skill: '水幕术', desc: '柔能克刚，防御见长',
             skillText: '你双手结印，水汽在身周汇聚成一道洪流，顺势席卷而去！' },
  fire:    { name: '火灵根', color: '#c25a2a', skill: '烈焰术', desc: '炽热燎原，伤害极高',
             skillText: '你催动火灵根，一团灼热烈焰从掌心喷涌而出，所过之处空气都在扭曲！' },
  thunder: { name: '雷灵根', color: '#8a6ab8', skill: '天雷诀', desc: '雷霆万钧，出其不意',
             skillText: '你引动雷灵根，一道紫色雷光从天而降，劈在敌人身上，电弧四下炸开！' },
  sword:   { name: '剑灵根', color: '#c9a962', skill: '御剑术', desc: '剑心通明，攻守兼备',
             skillText: '你剑诀一引，法器飞剑应声出鞘，化作一道寒芒，直取敌人要害！' },
};

// ========== 境界设定 ==========
const REALMS = [
  { name: '炼气一层',  max: 50,   atk: 8,  def: 2 },
  { name: '炼气二层',  max: 100,  atk: 12, def: 3 },
  { name: '炼气三层',  max: 180,  atk: 16, def: 4 },
  { name: '炼气四层',  max: 280,  atk: 20, def: 5 },
  { name: '炼气五层',  max: 420,  atk: 26, def: 7 },
  { name: '炼气六层',  max: 600,  atk: 32, def: 9 },
  { name: '炼气七层',  max: 820,  atk: 40, def: 11 },
  { name: '炼气八层',  max: 1100, atk: 50, def: 14 },
  { name: '炼气九层',  max: 1500, atk: 62, def: 18 },
  { name: '炼气大圆满', max: 2000, atk: 78, def: 22 },
  { name: '筑基初期',  max: 2800, atk: 100, def: 28 },
  { name: '筑基中期',  max: 3800, atk: 130, def: 36 },
  { name: '筑基后期',  max: 5000, atk: 165, def: 45 },
  { name: '筑基大圆满', max: 6500, atk: 210, def: 56 },
  { name: '金丹初期',  max: 8500, atk: 270, def: 70 },
  { name: '金丹中期',  max: 11000, atk: 340, def: 88 },
  { name: '金丹后期',  max: 14000, atk: 430, def: 108 },
  { name: '金丹大圆满', max: 18000, atk: 540, def: 132 },
  { name: '元婴初期',  max: 23000, atk: 680, def: 162 },
  { name: '元婴中期',  max: 30000, atk: 850, def: 200 },
  { name: '元婴后期',  max: 38000, atk: 1050, def: 240 },
  { name: '元婴大圆满', max: 48000, atk: 1300, def: 285 },
  { name: '化神初期',  max: 60000, atk: 1600, def: 340 },
  { name: '化神中期',  max: 75000, atk: 1950, def: 400 },
  { name: '化神后期',  max: 93000, atk: 2350, def: 470 },
  { name: '化神大圆满', max: 115000, atk: 2800, def: 550 },
];

// ========== 物品设定 ==========
const ITEMS = {
  zhixie_san:   { id: 'zhixie_san',   name: '止血散',     type: 'pill',     icon: '🌿', desc: '回复3%气血',     healPct: 0.03, sell: 10 },
  huiqi_pill:   { id: 'huiqi_pill',   name: '回气丹',     type: 'pill',     icon: '💊', desc: '回复5%气血',     healPct: 0.05, sell: 100 },
  huichun_pill: { id: 'huichun_pill', name: '回春丹',     type: 'pill',     icon: '💚', desc: '回复20%气血',    healPct: 0.20, sell: 400 },
  dahuan_pill:  { id: 'dahuan_pill',  name: '大还丹',     type: 'pill',     icon: '💛', desc: '回复45%气血',    healPct: 0.45, sell: 1600 },
  jiuzhuan_pill:{ id: 'jiuzhuan_pill',name: '九转还魂丹', type: 'pill',     icon: '✨', desc: '回复65%气血',    healPct: 0.65, sell: 5000 },
  juqi_pill:    { id: 'juqi_pill',    name: '聚气丹',     type: 'pill',     icon: '🧪', desc: '获得50修为',      effect: 'xp50',   sell: 40 },
  tieyijia:     { id: 'tieyijia',     name: '铁衣甲',     type: 'weapon',   icon: '🛡️', desc: '防御+5',         effect: 'def5',   sell: 60 },
  mujian:       { id: 'mujian',       name: '木剑',       type: 'weapon',   icon: '🗡️', desc: '攻击+3',         effect: 'atk3',   sell: 15 },
  tiebi:        { id: 'tiebi',        name: '铁笔',       type: 'weapon',   icon: '✍️',  desc: '攻击+8',         effect: 'atk8',   sell: 75 },
  fengyuteng:   { id: 'fengyuteng',   name: '风语藤',     type: 'material', icon: '🌿', desc: '炼器材料',       effect: 'xp30',   sell: 8 },
  lieyangshi:   { id: 'lieyangshi',   name: '烈阳石',     type: 'material', icon: '🔶', desc: '炼器材料',       effect: 'xp80',   sell: 30 },
  hanbingxue:   { id: 'hanbingxue',   name: '寒冰雪',     type: 'material', icon: '❄️', desc: '炼丹材料',       effect: 'heal50', sell: 25 },
  yaowanggu_lingzhi:{ id:'yaowanggu_lingzhi',name:'药王谷灵草',type:'material',icon:'🌱', desc:'药草', effect:'heal80', sell: 20 },
  shanzhifu:    { id: 'shanzhifu',    name: '山贼符',     type: 'misc',     icon: '📜', desc: '似乎没什么用',   effect: null,    sell: 10 },
  dao_compass:  { id: 'dao_compass',  name: '问道罗盘',   type: 'misc',     icon: '🧭', desc: '感应机缘',       effect: 'dao10', sell: 100 },
  lianhua_meng: { id: 'lianhua_meng', name: '莲花盟令',   type: 'misc',     icon: '🌸', desc: '莲花盟信物',     effect: null,    sell: 50 },

  // ===== 抽卡装备（稀有度分层，越高越稀有） =====
  g_qingfeng:  { id: 'g_qingfeng',   name: '青锋剑',    type: 'weapon', icon: '🗡️', desc: '凡品·攻击+15',  effect: 'atk15',   sell: 30,   rarity: '凡品' },
  g_qingbu:    { id: 'g_qingbu',     name: '青布衣',    type: 'weapon', icon: '🛡️', desc: '凡品·防御+10',  effect: 'def10',   sell: 30,   rarity: '凡品' },
  g_jinggang:  { id: 'g_jinggang',   name: '精钢剑',    type: 'weapon', icon: '🗡️', desc: '良品·攻击+30',  effect: 'atk30',   sell: 70,   rarity: '良品' },
  g_suozijia:  { id: 'g_suozijia',   name: '锁子甲',    type: 'weapon', icon: '🛡️', desc: '良品·防御+20',  effect: 'def20',   sell: 70,   rarity: '良品' },
  g_lingwen:   { id: 'g_lingwen',    name: '灵纹剑',    type: 'weapon', icon: '🗡️', desc: '中品·攻击+60',  effect: 'atk60',   sell: 180,  rarity: '中品' },
  g_lingwenjia:{ id: 'g_lingwenjia', name: '灵纹甲',    type: 'weapon', icon: '🛡️', desc: '中品·防御+40',  effect: 'def40',   sell: 180,  rarity: '中品' },
  g_xuantie:   { id: 'g_xuantie',    name: '玄铁重剑',  type: 'weapon', icon: '⚔️', desc: '上品·攻击+120', effect: 'atk120',  sell: 450,  rarity: '上品' },
  g_xuantiejia:{ id: 'g_xuantiejia', name: '玄铁甲',    type: 'weapon', icon: '🛡️', desc: '上品·防御+80',  effect: 'def80',   sell: 450,  rarity: '上品' },
  g_chixiao:   { id: 'g_chixiao',    name: '赤霄剑',    type: 'weapon', icon: '⚔️', desc: '极品·攻击+240', effect: 'atk240',  sell: 1100, rarity: '极品' },
  g_chiyanjia: { id: 'g_chiyanjia',  name: '赤焰甲',    type: 'weapon', icon: '🛡️', desc: '极品·防御+150', effect: 'def150',  sell: 1100, rarity: '极品' },
  g_zhuxian:   { id: 'g_zhuxian',    name: '诛仙剑',    type: 'weapon', icon: '🗡️', desc: '仙品·攻击+500', effect: 'atk500',  sell: 2500, rarity: '仙品' },
  g_xianlingjia:{id: 'g_xianlingjia',name: '仙灵甲',    type: 'weapon', icon: '🛡️', desc: '仙品·防御+300', effect: 'def300',  sell: 2500, rarity: '仙品' },

  // ===== 抽卡装备（第二批：更多武器/防具） =====
  g_taomu:     { id: 'g_taomu',      name: '桃木剑',    type: 'weapon', icon: '🗡️', desc: '凡品·攻击+12',  effect: 'atk12',   sell: 30,   rarity: '凡品' },
  g_cubu:      { id: 'g_cubu',       name: '粗布鞋',    type: 'weapon', icon: '👟', desc: '凡品·防御+8',   effect: 'def8',    sell: 30,   rarity: '凡品' },
  g_tiejidao:  { id: 'g_tiejidao',   name: '铁脊刀',    type: 'weapon', icon: '🔪', desc: '良品·攻击+28',  effect: 'atk28',   sell: 70,   rarity: '良品' },
  g_niupijia:  { id: 'g_niupijia',   name: '牛皮甲',    type: 'weapon', icon: '🛡️', desc: '良品·防御+18',  effect: 'def18',   sell: 70,   rarity: '良品' },
  g_hantieqiang:{id: 'g_hantieqiang',name: '寒铁枪',    type: 'weapon', icon: '🔱', desc: '中品·攻击+55',  effect: 'atk55',   sell: 180,  rarity: '中品' },
  g_jinsijia:  { id: 'g_jinsijia',   name: '金丝甲',    type: 'weapon', icon: '🛡️', desc: '中品·防御+35',  effect: 'def35',   sell: 180,  rarity: '中品' },
  g_zixiaodao: { id: 'g_zixiaodao',  name: '紫霄刀',    type: 'weapon', icon: '🔪', desc: '上品·攻击+110', effect: 'atk110',  sell: 450,  rarity: '上品' },
  g_yudaijia:  { id: 'g_yudaijia',   name: '玉带甲',    type: 'weapon', icon: '🛡️', desc: '上品·防御+75',  effect: 'def75',   sell: 450,  rarity: '上品' },
  g_longyuanqiang:{id:'g_longyuanqiang',name:'龙渊枪',  type: 'weapon', icon: '🔱', desc: '极品·攻击+220', effect: 'atk220',  sell: 1100, rarity: '极品' },
  g_tiancanjia:{ id: 'g_tiancanjia', name: '天蚕甲',    type: 'weapon', icon: '🛡️', desc: '极品·防御+140', effect: 'def140',  sell: 1100, rarity: '极品' },
  g_xuanyuan:  { id: 'g_xuanyuan',   name: '轩辕剑',    type: 'weapon', icon: '⚔️', desc: '仙品·攻击+480', effect: 'atk480',  sell: 2500, rarity: '仙品' },
  g_hundunjia: { id: 'g_hundunjia',  name: '混沌甲',    type: 'weapon', icon: '🛡️', desc: '仙品·防御+280', effect: 'def280',  sell: 2500, rarity: '仙品' },

  // ===== 抽卡装备（第三批：更多仙品类型） =====
  g_zhanxiandao: { id: 'g_zhanxiandao', name: '斩仙刀',  type: 'weapon', icon: '🔪', desc: '仙品·攻击+495', effect: 'atk495', sell: 2500, rarity: '仙品' },
  g_shishenqiang:{ id: 'g_shishenqiang',name: '弑神枪',  type: 'weapon', icon: '🔱', desc: '仙品·攻击+515', effect: 'atk515', sell: 2500, rarity: '仙品' },
  g_dashenbian: { id: 'g_dashenbian',  name: '打神鞭',  type: 'weapon', icon: '⚡', desc: '仙品·法攻+505', effect: 'matk505', sell: 2500, rarity: '仙品' },
  g_taijitu:    { id: 'g_taijitu',     name: '太极图',  type: 'weapon', icon: '☯️', desc: '仙品·法抗+320', effect: 'mdef320', sell: 2500, rarity: '仙品' },
  g_zishou:     { id: 'g_zishou',      name: '紫绶仙衣',type: 'weapon', icon: '👘', desc: '仙品·法抗+305', effect: 'mdef305', sell: 2500, rarity: '仙品' },
  g_hundunzhong:{ id: 'g_hundunzhong', name: '混沌钟',  type: 'weapon', icon: '🔔', desc: '仙品·特效（定身一回合，冷却10回合）', effect: null, special: 'stun', sell: 2500, rarity: '仙品' },

  // ===== 抽卡装备（第四批：法攻/法抗/穿透） =====
  g_xuanmuzhang: { id: 'g_xuanmuzhang', name: '玄木杖',  type: 'weapon', icon: '🪄', desc: '中品·法攻+58',   effect: 'matk58',  sell: 180,  rarity: '中品' },
  g_yanlingzhu:  { id: 'g_yanlingzhu',  name: '炎灵珠',  type: 'weapon', icon: '🔮', desc: '上品·法攻+115',  effect: 'matk115', sell: 450,  rarity: '上品' },
  g_wuleizhu:    { id: 'g_wuleizhu',    name: '五雷珠',  type: 'weapon', icon: '⚡', desc: '极品·法攻+225',  effect: 'matk225', sell: 1100, rarity: '极品' },
  g_susefapao:   { id: 'g_susefapao',   name: '素色法袍',type: 'weapon', icon: '🥼', desc: '中品·法抗+38',   effect: 'mdef38',  sell: 180,  rarity: '中品' },
  g_yunwenfapao: { id: 'g_yunwenfapao', name: '云纹法袍',type: 'weapon', icon: '👘', desc: '上品·法抗+78',   effect: 'mdef78',  sell: 450,  rarity: '上品' },
  g_tianluofapao:{ id: 'g_tianluofapao',name: '天罗法袍',type: 'weapon', icon: '🧥', desc: '极品·法抗+145',  effect: 'mdef145', sell: 1100, rarity: '极品' },
  g_pojiazhui:   { id: 'g_pojiazhui',   name: '破甲锥',  type: 'weapon', icon: '🗡️', desc: '中品·穿透+25',  effect: 'pen25',   sell: 180,  rarity: '中品' },
  g_chuanxinci:  { id: 'g_chuanxinci',  name: '穿心刺',  type: 'weapon', icon: '💉', desc: '上品·穿透+55',  effect: 'pen55',   sell: 450,  rarity: '上品' },
  g_pojunzhui:   { id: 'g_pojunzhui',   name: '破军锥',  type: 'weapon', icon: '🔱', desc: '极品·穿透+110', effect: 'pen110',  sell: 1100, rarity: '极品' },
  g_zhuxianzhui: { id: 'g_zhuxianzhui', name: '诛仙锥',  type: 'weapon', icon: '💠', desc: '仙品·穿透+150', effect: 'pen150',  sell: 2500, rarity: '仙品' },

  // ===== 抽卡废品（抽空产物，只能卖几灵石） =====
  shuzhi:  { id: 'shuzhi',  name: '枯树枝', type: 'misc', icon: '🌿', desc: '路边捡的，没什么用', effect: null, sell: 3 },
  shitou:  { id: 'shitou',  name: '碎石子', type: 'misc', icon: '🪨', desc: '随处可见的石头',     effect: null, sell: 5 },
  pobu:    { id: 'pobu',    name: '破布片', type: 'misc', icon: '🧵', desc: '破破烂烂的布',       effect: null, sell: 4 },
  lanyez:  { id: 'lanyez',  name: '烂叶子', type: 'misc', icon: '🍂', desc: '已经枯萎发黄',       effect: null, sell: 2 },
  powan:   { id: 'powan',   name: '破陶碗', type: 'misc', icon: '🥣', desc: '缺了个口',           effect: null, sell: 3 },
};

// ========== 抽卡池（藏宝阁） ==========
const GACHA_COST = 200;
const GACHA_PITY = 200; // 仙品保底：每200抽必出一次
const GACHA_POOL = [
  { rarity: '废品', weight: 36, color: '#7a7a7a', items: [
    'shuzhi', 'shitou', 'pobu', 'lanyez', 'powan',
  ]},
  { rarity: '凡品', weight: 30, color: '#c9c9c9', items: [
    'g_qingfeng', 'g_taomu', 'g_qingbu', 'g_cubu',
    { id: 'huiqi_pill', count: 3 }, { id: 'juqi_pill', count: 2 },
  ]},
  { rarity: '良品', weight: 17, color: '#4caf50', items: [
    'g_jinggang', 'g_tiejidao', 'g_suozijia', 'g_niupijia',
    { id: 'huichun_pill', count: 2 }, { id: 'juqi_pill', count: 4 },
  ]},
  { rarity: '中品', weight: 10, color: '#4a90d9', items: [
    'g_lingwen', 'g_hantieqiang', 'g_lingwenjia', 'g_jinsijia',
    'g_xuanmuzhang', 'g_susefapao', 'g_pojiazhui',
    { id: 'dahuan_pill', count: 1 }, { id: 'juqi_pill', count: 6 },
  ]},
  { rarity: '上品', weight: 5, color: '#9b59b6', items: [
    'g_xuantie', 'g_zixiaodao', 'g_xuantiejia', 'g_yudaijia',
    'g_yanlingzhu', 'g_yunwenfapao', 'g_chuanxinci',
    { id: 'jiuzhuan_pill', count: 1 },
  ]},
  { rarity: '极品', weight: 1.5, color: '#e6a23c', items: [
    'g_chixiao', 'g_longyuanqiang', 'g_chiyanjia', 'g_tiancanjia',
    'g_wuleizhu', 'g_tianluofapao', 'g_pojunzhui',
    { id: 'jiuzhuan_pill', count: 2 },
  ]},
  { rarity: '仙品', weight: 0.5, color: '#e0473c', items: [
    'g_zhuxian', 'g_xuanyuan', 'g_zhanxiandao', 'g_shishenqiang', 'g_dashenbian',
    'g_xianlingjia', 'g_hundunjia', 'g_taijitu', 'g_zishou', 'g_hundunzhong',
    'g_zhuxianzhui',
    { id: 'jiuzhuan_pill', count: 3 },
  ]},
];

// ========== 成就设定 ==========
const ACHIEVEMENTS = [
  { id: 'first_battle', name: '初入江湖',   desc: '赢得第一场战斗',         icon: '⚔️' },
  { id: 'battle_10',    name: '身经百战',   desc: '累计胜场达到10场',       icon: '🏆' },
  { id: 'realm_zhuji',  name: '筑基之路',   desc: '突破到筑基期',           icon: '🌟' },
  { id: 'realm_jindan', name: '金丹大道',   desc: '凝结金丹',               icon: '✨' },
  { id: 'rich_1000',    name: '小富即安',   desc: '累计灵石达到1000',       icon: '💰' },
  { id: 'fame_100',     name: '声名鹊起',   desc: '名望达到100',            icon: '📯' },
  { id: 'dao_50',       name: '道心初成',   desc: '道韵达到50',             icon: '☯️' },
  { id: 'collector',    name: '博采众长',   desc: '储物袋中物品种类达到10种', icon: '🎒' },
  { id: 'boss_wolf',    name: '狼穴除患',   desc: '斩杀狼群首领',           icon: '🐺' },
  { id: 'boss_bandit',  name: '清风寨破',   desc: '击败清风寨寨主',         icon: '🗡️' },
  { id: 'survive_tribulation', name: '劫后余生', desc: '成功渡过一次天劫',   icon: '⚡' },
  { id: 'trib_jindan',    name: '金丹雷劫',   desc: '渡过金丹天劫',           icon: '🌩️' },
  { id: 'trib_yuanying',  name: '元婴雷劫',   desc: '渡过元婴天劫',           icon: '⛈️' },
  { id: 'realm_yuanying', name: '元婴大道',   desc: '突破到元婴期',           icon: '🌌' },
  { id: 'realm_huashen',  name: '化神之巅',   desc: '突破到化神期',           icon: '🕉️' },
  { id: 'trib_huashen',   name: '化神雷劫',   desc: '渡过化神天劫',           icon: '🌩️' },
  { id: 'trib_feisheng',  name: '飞升之劫',   desc: '渡过飞升劫',             icon: '☀️' },
  { id: 'boss_zhulong',   name: '烛龙陨落',   desc: '击败隐藏boss烛龙',       icon: '🐉' },
];

// ========== 合成配方 ==========
const RECIPES = [
  { id: 'r_mujian', name: '锻造木剑',   icon: '🗡️', result: 'mujian',    cost: { fengyuteng: 2 } },
  { id: 'r_tieyi',  name: '锻造铁衣甲', icon: '🛡️', result: 'tieyijia',  cost: { lieyangshi: 3 } },
  { id: 'r_tiebi',  name: '锻造铁笔',   icon: '✍️', result: 'tiebi',     cost: { lieyangshi: 2, fengyuteng: 2 } },
  { id: 'r_juqi',   name: '炼制聚气丹', icon: '🧪', result: 'juqi_pill', cost: { hanbingxue: 3 } },
  { id: 'r_daopei', name: '炼制道佩',   icon: '🔮', result: 'daopei',    cost: { yaowanggu_lingzhi: 1, hanbingxue: 1 } },
];

// ========== 炼丹炉（随机炼丹） ==========
// 投入材料随机炼出丹药，品质数量随机（weight 为概率权重）
const ALCHEMY_RECIPES = [
  { id: 'a_huixue', name: '气血丹方', icon: '💊', cost: { hanbingxue: 2, yaowanggu_lingzhi: 1 },
    results: [
      { id: 'zhixie_san', count: 1, weight: 50 },
      { id: 'huiqi_pill', count: 1, weight: 35 },
      { id: 'huichun_pill', count: 1, weight: 12 },
      { id: 'dahuan_pill', count: 1, weight: 3 },
    ] },
  { id: 'a_xiuwei', name: '修为丹方', icon: '🧪', cost: { lieyangshi: 2, fengyuteng: 1 },
    results: [
      { id: 'juqi_pill', count: 1, weight: 65 },
      { id: 'juqi_pill', count: 2, weight: 25 },
      { id: 'juqi_pill', count: 3, weight: 10 },
    ] },
  { id: 'a_dahuan', name: '大还丹方', icon: '💛', cost: { lieyangshi: 3, hanbingxue: 2, yaowanggu_lingzhi: 2 },
    results: [
      { id: 'huichun_pill', count: 1, weight: 45 },
      { id: 'dahuan_pill', count: 1, weight: 30 },
      { id: 'jiuzhuan_pill', count: 1, weight: 15 },
      { id: 'dahuan_pill', count: 2, weight: 10 },
    ] },
];

// ========== 灵宠系统 ==========
// 灵宠图鉴：base 为 1 级属性加成，growth 为每级成长，品质由低到高
const PETS = {
  // 废品
  lingshu: { id: 'lingshu', name: '灵鼠', icon: '🐭', quality: '废品', qc: '#7a7a7a',
    base: { atk: 1, matk: 1, def: 0, mdef: 0, pen: 0 },
    growth: { atk: 1, matk: 1, def: 1, mdef: 0, pen: 0 },
    skill: '啮咬', skillChance: 0.10, skillMult: 1.1,
    desc: '山林间最不起眼的小灵兽。' },
  huitu: { id: 'huitu', name: '灰兔', icon: '🐰', quality: '废品', qc: '#7a7a7a',
    base: { atk: 1, matk: 1, def: 1, mdef: 1, pen: 0 },
    growth: { atk: 1, matk: 1, def: 1, mdef: 1, pen: 0 },
    skill: '蹬腿', skillChance: 0.10, skillMult: 1.1,
    desc: '机警的小灰兔，速度飞快。' },
  // 凡品
  xiaobaihu: { id: 'xiaobaihu', name: '小白狐', icon: '🦊', quality: '凡品', qc: '#c9c9c9',
    base: { atk: 4, matk: 4, def: 2, mdef: 2, pen: 0 },
    growth: { atk: 2, matk: 2, def: 1, mdef: 1, pen: 0 },
    skill: '狐火', skillChance: 0.18, skillMult: 1.3,
    desc: '通体雪白的小狐狸，性情温顺，口吐狐火。' },
  qingshe: { id: 'qingshe', name: '青蛇', icon: '🐍', quality: '凡品', qc: '#c9c9c9',
    base: { atk: 5, matk: 3, def: 2, mdef: 2, pen: 0 },
    growth: { atk: 2, matk: 2, def: 1, mdef: 1, pen: 0 },
    skill: '毒牙', skillChance: 0.15, skillMult: 1.3,
    desc: '通体青碧的灵蛇，毒牙锋利。' },
  // 良品
  xuanwu: { id: 'xuanwu', name: '玄龟', icon: '🐢', quality: '良品', qc: '#4caf50',
    base: { atk: 3, matk: 3, def: 10, mdef: 7, pen: 0 },
    growth: { atk: 1, matk: 1, def: 4, mdef: 3, pen: 0 },
    skill: '玄龟冲撞', skillChance: 0.15, skillMult: 1.5,
    desc: '背负玄甲的灵龟，防御无双，坚不可摧。' },
  linglu: { id: 'linglu', name: '灵鹿', icon: '🦌', quality: '良品', qc: '#4caf50',
    base: { atk: 4, matk: 7, def: 4, mdef: 4, pen: 0 },
    growth: { atk: 2, matk: 3, def: 2, mdef: 2, pen: 0 },
    skill: '灵角', skillChance: 0.18, skillMult: 1.4,
    desc: '头顶灵角的灵鹿，通体灵光。' },
  // 中品
  huoya: { id: 'huoya', name: '火鸦', icon: '🦅', quality: '中品', qc: '#4a90d9',
    base: { atk: 8, matk: 10, def: 4, mdef: 4, pen: 1 },
    growth: { atk: 3, matk: 4, def: 2, mdef: 2, pen: 0 },
    skill: '火羽', skillChance: 0.20, skillMult: 1.5,
    desc: '浑身燃着赤焰的火鸦，鸣声如雷。' },
  baiyuan: { id: 'baiyuan', name: '白猿', icon: '🐒', quality: '中品', qc: '#4a90d9',
    base: { atk: 10, matk: 6, def: 7, mdef: 5, pen: 1 },
    growth: { atk: 4, matk: 3, def: 3, mdef: 2, pen: 0 },
    skill: '猿啸', skillChance: 0.18, skillMult: 1.5,
    desc: '通臂白猿，力大无穷。' },
  // 上品
  baihu: { id: 'baihu', name: '白虎', icon: '🐯', quality: '上品', qc: '#9b59b6',
    base: { atk: 15, matk: 10, def: 8, mdef: 7, pen: 3 },
    growth: { atk: 5, matk: 4, def: 3, mdef: 3, pen: 1 },
    skill: '虎啸', skillChance: 0.20, skillMult: 1.6,
    desc: '西方庚金白虎，主杀伐，威震山野。' },
  jinpeng: { id: 'jinpeng', name: '金鹏', icon: '🦜', quality: '上品', qc: '#9b59b6',
    base: { atk: 13, matk: 15, def: 7, mdef: 8, pen: 3 },
    growth: { atk: 5, matk: 5, def: 3, mdef: 3, pen: 1 },
    skill: '金翅', skillChance: 0.20, skillMult: 1.6,
    desc: '展翅千里的大鹏，金羽遮天。' },
  // 极品
  qinglong: { id: 'qinglong', name: '青龙', icon: '🐉', quality: '极品', qc: '#e6a23c',
    base: { atk: 22, matk: 17, def: 11, mdef: 10, pen: 6 },
    growth: { atk: 7, matk: 6, def: 4, mdef: 4, pen: 2 },
    skill: '龙息', skillChance: 0.22, skillMult: 1.8,
    desc: '东方苍龙，龙威浩荡，睥睨天下。' },
  huofeng: { id: 'huofeng', name: '火凤', icon: '🦚', quality: '极品', qc: '#e6a23c',
    base: { atk: 18, matk: 24, def: 9, mdef: 11, pen: 6 },
    growth: { atk: 6, matk: 8, def: 3, mdef: 4, pen: 2 },
    skill: '凤炎', skillChance: 0.22, skillMult: 1.8,
    desc: '浴火而生的火凤，烈焰滔天。' },
  // 神品（最高，龙与凤凰）
  shenlong: { id: 'shenlong', name: '神龙', icon: '🐲', quality: '神品', qc: '#e0473c',
    base: { atk: 32, matk: 28, def: 16, mdef: 15, pen: 10 },
    growth: { atk: 10, matk: 9, def: 5, mdef: 5, pen: 3 },
    skill: '神龙吐息', skillChance: 0.25, skillMult: 2.2,
    desc: '九天之上的神龙，俯瞰众生，威压万物。' },
  fenghuang: { id: 'fenghuang', name: '凤凰', icon: '🦩', quality: '神品', qc: '#e0473c',
    base: { atk: 28, matk: 32, def: 14, mdef: 17, pen: 10 },
    growth: { atk: 9, matk: 10, def: 5, mdef: 6, pen: 3 },
    skill: '涅槃', skillChance: 0.25, skillMult: 2.2,
    desc: '百鸟之王的凤凰，浴火涅槃，不死不灭。' },
};

// 灵宠抽奖池（爆率参照藏宝阁：weight 为概率权重）
const PET_GACHA_COST = 200;
const PET_GACHA_PITY = 100; // 神品保底：每100抽必出一次
const PET_GACHA_POOL = [
  { rarity: '废品', weight: 36, color: '#7a7a7a', items: ['lingshu', 'huitu'] },
  { rarity: '凡品', weight: 30, color: '#c9c9c9', items: ['xiaobaihu', 'qingshe'] },
  { rarity: '良品', weight: 17, color: '#4caf50', items: ['xuanwu', 'linglu'] },
  { rarity: '中品', weight: 10, color: '#4a90d9', items: ['huoya', 'baiyuan'] },
  { rarity: '上品', weight: 5,  color: '#9b59b6', items: ['baihu', 'jinpeng'] },
  { rarity: '极品', weight: 1.5,color: '#e6a23c', items: ['qinglong', 'huofeng'] },
  { rarity: '神品', weight: 0.5,color: '#e0473c', items: ['shenlong', 'fenghuang'] },
];
// 品质档位（用于比较强弱）与重复抽到的灵石补偿
const PET_QUALITY_RANK = { '废品': 0, '凡品': 1, '良品': 2, '中品': 3, '上品': 4, '极品': 5, '神品': 6 };
const PET_REFUND = { '废品': 10, '凡品': 30, '良品': 60, '中品': 120, '上品': 250, '极品': 600, '神品': 1500 };

// ========== 敌人设定 ==========
const ENEMIES = {
  // 新手区
  wolf:       { id: 'wolf',       name: '野狼',       hp: 30,  atk: 6,  def: 1,  xp: 12,  stone: [3, 8],   drops: [] },
  wolf_alpha: { id: 'wolf_alpha', name: '狼群首领',   hp: 130, atk: 15, def: 4,  xp: 60,  stone: [20, 40], drops: [{id:'tieyijia', chance:0.3}], boss: true },
  bandit:     { id: 'bandit',     name: '山贼',       hp: 50,  atk: 9,  def: 2,  xp: 20,  stone: [10, 20], drops: [{id:'shanzhifu',chance:0.5}] },
  bandit_chief:{id: 'bandit_chief',name:'清风寨寨主', hp: 300, atk: 24, def: 7,  xp: 150, stone: [80, 150],drops: [{id:'tiebi',chance:0.5},{id:'juqi_pill',chance:1}], boss: true },
  snake_demon:{ id: 'snake_demon',name: '蛇妖',       hp: 70,  atk: 14, def: 2,  matk: 18, mdef: 4, xp: 40,  stone: [15, 30], drops: [{id:'hanbingxue',chance:0.4}] },
  low_monk:   { id: 'low_monk',   name: '低阶修士',   hp: 80,  atk: 13, def: 4,  matk: 18, mdef: 6, xp: 35,  stone: [20, 40], drops: [{id:'huiqi_pill',chance:0.6}] },

  // 中段
  stone_monkey:{id: 'stone_monkey',name:'石猴',      hp: 150, atk: 22, def: 10, xp: 80,  stone: [30, 60], drops: [{id:'lieyangshi',chance:0.5}] },
  blood_cultist:{id:'blood_cultist',name:'血教弟子', hp: 180, atk: 28, def: 8,  matk: 38, mdef: 12, xp: 100, stone: [40, 80], drops: [{id:'juqi_pill',chance:0.4}] },
  bifuluan:    { id: 'bifuluan',   name: '毕方（灵禽）', hp: 500, atk: 52, def: 15, matk: 70, mdef: 20, xp: 220, stone: [100,180], drops: [{id:'lieyangshi',chance:1}], boss: true },

  // 高阶
  qiongqi:     { id: 'qiongqi',    name: '穷奇',      hp: 2400, atk: 280, def: 40, xp: 650, stone: [300,450], drops: [{id:'fengyuteng',chance:1}], boss: true },
  taotie:      { id: 'taotie',     name: '饕餮',      hp: 4500, atk: 380, def: 52, xp: 1100, stone: [500,750], drops: [{id:'hanbingxue',chance:1}], boss: true },
  nine_tails:  { id: 'nine_tails', name: '九尾天狐',  hp: 3200, atk: 330, def: 48, matk: 460, mdef: 60, xp: 950, stone: [400,700], drops: [{id:'dao_compass',chance:1}], boss: true },
  yinglong:    { id: 'yinglong',   name: '应龙',      hp: 6400, atk: 470, def: 72, xp: 1600, stone: [750,1100], drops: [{id:'tieyijia',chance:0.5}], boss: true },

  // 论道
  dao_competitor:{ id:'dao_competitor',name:'论道对手',hp: 250, atk: 30, def: 10, xp: 150, stone: [60,100], drops: [{id:'daopei',chance:0.3}], untouchable: false },
  dao_elder:   { id: 'dao_elder',  name: '宗门长老',  hp: 850, atk: 74, def: 22, matk: 105, mdef: 30, xp: 400, stone: [150,250],drops: [{id:'daopei',chance:1}], boss: true },

  // 天劫
  lei_jie_1:   { id: 'lei_jie_1',  name: '筑基天劫·一重', hp: 1, atk: 0, def: 0, xp: 500, stone: [100,100], drops: [], untouchable: true, boss: true, tribDmg: 0.15 },

  // 魔尊
  demon_lord:  { id: 'demon_lord', name: '魔尊',       hp: 26000,atk: 1000,def: 220, matk: 1400, mdef: 280, xp: 8000,stone: [4000,6000], drops: [], boss: true },

  // 四凶禁地（高难度挑战）
  taowu:       { id: 'taowu',    name: '梼杌',       hp: 7000, atk: 520, def: 90,  xp: 2000, stone: [700,1100],  drops: [{id:'lieyangshi',chance:1},{id:'tiebi',chance:0.5}], boss: true },
  hundun:      { id: 'hundun',   name: '混沌',       hp: 12000, atk: 720, def: 135, xp: 3000, stone: [1200,1800], drops: [{id:'hanbingxue',chance:1},{id:'juqi_pill',chance:1}], boss: true },
  zhulong:     { id: 'zhulong',  name: '烛龙',       hp: 30000, atk: 1350, def: 265, xp: 6000, stone: [3500,5500], drops: [{id:'lieyangshi',chance:1},{id:'tiebi',chance:1},{id:'juqi_pill',chance:1},{id:'dahuan_pill',chance:0.5}], boss: true },

  // 天劫
  lei_jie_2:   { id: 'lei_jie_2',  name: '金丹天劫·二重', hp: 1, atk: 0, def: 0, xp: 1500, stone: [300,300], drops: [], untouchable: true, boss: true, tribDmg: 0.20 },
  lei_jie_3:   { id: 'lei_jie_3',  name: '元婴天劫·三重', hp: 1, atk: 0, def: 0, xp: 3000, stone: [600,600], drops: [], untouchable: true, boss: true, tribDmg: 0.22 },

  // 化神期：天劫与魔域
  lei_jie_4:   { id: 'lei_jie_4',   name: '化神天劫·四重', hp: 1, atk: 0, def: 0, xp: 4000, stone: [800,800], drops: [], untouchable: true, boss: true, tribDmg: 0.24 },
  fei_sheng_jie:{ id:'fei_sheng_jie',name:'飞升天劫·九重',hp: 1, atk: 0, def: 0, xp: 8000, stone: [2000,2000], drops: [], untouchable: true, boss: true, tribDmg: 0.22 },
  tianmo:      { id: 'tianmo',      name: '域外天魔',    hp: 28000, atk: 2100, def: 420, matk: 2900, mdef: 520, xp: 7000,  stone: [3000,5000], drops: [{id:'juqi_pill',chance:1},{id:'lieyangshi',chance:1},{id:'dahuan_pill',chance:1}], boss: true },
  mojun:       { id: 'mojun',       name: '上古魔君',    hp: 56000, atk: 3100, def: 560, matk: 4300, mdef: 700, xp: 12000, stone: [5000,8000], drops: [{id:'juqi_pill',chance:1},{id:'lieyangshi',chance:1},{id:'tiebi',chance:1},{id:'jiuzhuan_pill',chance:1}], boss: true },
};

// ========== 秘境爬塔 ==========
// 按层数分段随机敌人池
const MIJING_POOLS = [
  { minFloor: 1,  enemies: ['wolf', 'bandit', 'snake_demon', 'low_monk'] },
  { minFloor: 5,  enemies: ['stone_monkey', 'blood_cultist'] },
  { minFloor: 10, enemies: ['bifuluan', 'qiongqi', 'nine_tails'] },
  { minFloor: 15, enemies: ['taotie', 'yinglong'] },
  { minFloor: 20, enemies: ['taowu', 'hundun', 'zhulong'] },
  { minFloor: 25, enemies: ['tianmo', 'mojun'] },
];

// 不存在的 daopei 物品兜底（上面的敌人 drop 里用到了）
if (!ITEMS.daopei) {
  ITEMS.daopei = { id: 'daopei', name: '道佩', type: 'misc', icon: '🔮', desc: '蕴含道韵的佩饰', effect: 'dao5', sell: 30 };
}

// ========== 剧情节点 ==========
// 每个节点: id, title, text, choices, onEnter(可选)
// choices: [{ label, next, action?, req? }]
const STORY_NODES = {

  // ===== 开场 =====
  start: {
    title: '凡途',
    text: `你是青阳城一个普通少年。这一日，山门大开，青云宗来此招收弟子。你怀揣着修仙之梦，挤在人群之中。
    灵根测试的光柱缓缓亮起……`,
    choices: [
      { label: '测试灵根', next: 'linggen_roll' },
    ],
  },

  linggen_roll: {
    title: '灵根测试',
    text: '测灵石在你掌心发出幽幽光芒，一道灵根属性在你体内觉醒。',
    onEnter: (s) => { rollLinggen(s); },
    choices: [
      { label: '查看灵根', next: 'linggen_show' },
    ],
  },

  linggen_show: {
    title: '灵根觉醒',
    dynamicText: (s) => {
      const lg = LINGGEN[s.linggen];
      return `你的灵根：<b style="color:${lg.color}">${lg.name}</b>\n天赋灵技：${lg.skill}\n${lg.desc}\n\n青云宗接引长老微微颔首，将你收入外门。从此，你踏上修仙之途。`;
    },
    choices: [
      { label: '进入青云宗', next: 'qingyun_gate' },
    ],
  },

  // ===== 青云宗外门 =====
  qingyun_gate: {
    title: '青云宗',
    text: `青云宗，座落于青云山脉之巅，云雾缭绕，仙鹤长鸣。你作为外门弟子，被分配到一处简陋的洞府。
    每月有宗门任务，可换取灵石与修炼资源。`,
    choices: [
      { label: '开始修炼', next: 'outer_cultivate' },
      { label: '前往任务堂', next: 'quest_hall' },
      { label: '去坊市逛逛', next: 'fangshi' },
      { label: '前往药王谷', next: 'yaowanggu_entrance' },
      { label: '前往论道台', next: 'lundaotai' },
      { label: '进入试炼秘境', next: 'mijing_entrance' },
      { label: '宗门大比报名', next: 'zongmen_bi_notice' },
      { label: '准备筑基渡劫', next: 'zhuji_prep' },
      { label: '前往内门', next: 'inner_gate', req: (s) => !!s.innerGate },
    ],
  },

  outer_cultivate: {
    title: '打坐修炼',
    text: '你盘坐于石榻之上，五心朝天，吐纳天地灵气。一缕缕灵气被吸入体内，沿经脉缓缓运转。',
    onEnter: (s) => {
      const gain = 20 + Math.floor(Math.random() * 15);
      addXp(s, gain);
      setNodeText('修炼完毕，你感到体内灵气又充盈了几分。' + '（+' + gain + '修为）');
    },
    choices: [
      { label: '继续修炼', next: 'outer_cultivate_2' },
      { label: '离开洞府', next: 'qingyun_gate' },
    ],
  },

  outer_cultivate_2: {
    title: '再修一轮',
    text: '你再次沉下心神，进入更深层次的入定。',
    onEnter: (s) => {
      const gain = 25 + Math.floor(Math.random() * 20);
      addXp(s, gain);
      setNodeText('这一次修炼比上次更有进益。' + '（+' + gain + '修为）');
    },
    choices: [
      { label: '返回', next: 'qingyun_gate' },
    ],
  },

  quest_hall: {
    title: '任务堂',
    text: `任务堂前人来人往，墙上贴着各式各样的任务告示。你走上前去查看。`,
    choices: [
      { label: '猎杀野狼（低阶）', next: 'quest_wolf' },
      { label: '采集风语藤（低阶）', next: 'quest_fengyuteng' },
      { label: '清剿山贼（中阶）', next: 'quest_bandit', req: (s) => getRealmIndex(s) >= 2 },
      { label: '返回', next: 'qingyun_gate' },
    ],
  },

  quest_wolf: {
    title: '猎杀野狼',
    text: '任务：猎杀三匹野狼，带回狼耳为证。奖励：三十灵石。你按照任务指引来到后山。',
    onEnter: (s) => { s.questWolf = 0; },
    choices: [
      { label: '进入山林', next: 'wolf_fight_1' },
    ],
  },

  wolf_fight_1: {
    title: '野狼出没',
    text: '林深处，一头野狼从草丛中窜出，獠牙森森，直扑而来！',
    battle: { enemy: 'wolf', mult: 1.0 },
    winNext: 'wolf_fight_1_win',
    loseNext: 'wolf_defeat',
  },

  wolf_fight_1_win: {
    title: '首胜',
    text: '你击退了野狼，将狼耳割下收好。林中似乎还有更多狼踪。',
    onEnter: (s) => { s.questWolf = (s.questWolf || 0) + 1; },
    choices: [
      { label: '继续深入', next: 'wolf_fight_2' },
      { label: '返回宗门', next: 'quest_hall' },
    ],
  },

  wolf_fight_2: {
    title: '狼群',
    text: '又有两头野狼从两侧包抄过来，你腹背受敌！',
    battle: { enemy: 'wolf', mult: 1.2 },
    winNext: 'wolf_fight_2_win',
    loseNext: 'wolf_defeat',
  },

  wolf_fight_2_win: {
    title: '再胜',
    text: '你连斩两狼，收获颇丰。任务的三匹狼已经凑齐。前方似乎传来低沉的狼嚎……',
    onEnter: (s) => { s.questWolf = (s.questWolf || 0) + 2; },
    choices: [
      { label: '去看看', next: 'wolf_alpha_encounter' },
      { label: '见好就收，返回', next: 'quest_wolf_complete' },
    ],
  },

  wolf_alpha_encounter: {
    title: '狼群首领',
    text: '一头体型庞大的灰狼挡在你面前，双目赤红，显然是狼群首领！',
    battle: { enemy: 'wolf_alpha', mult: 1.0 },
    winNext: 'wolf_alpha_win',
    loseNext: 'wolf_defeat',
  },

  wolf_alpha_win: {
    title: '除狼首',
    text: '你斩杀狼群首领，整个山林都安静了下来。你从其巢穴中找到了不少宝贝。',
    onEnter: (s) => {
      s.stone += 50;
      grantItem(s, 'tieyijia');
      grantAchievement('boss_wolf');
      setNodeText('你斩杀狼群首领，整个山林都安静了下来。你从其巢穴中找到了五十枚灵石和一件铁衣甲。');
    },
    choices: [
      { label: '返回任务堂', next: 'quest_wolf_complete' },
    ],
  },

  wolf_defeat: {
    title: '重伤而归',
    text: '你不敌野狼，昏倒在地。所幸被路过的同门救回宗门，捡回一条命。',
    onEnter: (s) => { s.hp = Math.max(1, Math.floor(s.maxHp * 0.3)); },
    choices: [
      { label: '回到洞府修养', next: 'qingyun_gate' },
    ],
  },

  quest_wolf_complete: {
    title: '任务完成',
    text: '你回到任务堂，交上狼耳。执事长老满意地点了点头，递给你三十灵石。',
    onEnter: (s) => {
      s.stone += 30;
      s.fame += 5;
    },
    choices: [
      { label: '继续接任务', next: 'quest_hall' },
      { label: '离开', next: 'qingyun_gate' },
    ],
  },

  quest_fengyuteng: {
    title: '采集风语藤',
    text: '任务：采集五株风语藤。奖励：二十灵石。你来到山涧边，听说那里风语藤最多。',
    choices: [
      { label: '仔细寻找', next: 'find_teng_1' },
      { label: '返回', next: 'quest_hall' },
    ],
  },

  find_teng_1: {
    title: '寻找灵草',
    text: '你沿着山涧一路寻觅……',
    onEnter: (s) => {
      const r = Math.random();
      if (r < 0.7) {
        grantItem(s, 'fengyuteng', 2);
        setNodeText('你在石壁缝隙间发现了两株风语藤，小心地采摘下来。');
      } else {
        setNodeText('你找了半天，什么也没找到，反而惊动了一条蛇妖！');
        goToNodeAfterDelay('snake_encounter', 1200);
      }
    },
    choices: [
      { label: '继续寻找', next: 'find_teng_2' },
      { label: '返回宗门', next: 'quest_hall' },
    ],
  },

  find_teng_2: {
    title: '再寻',
    text: '你继续向山涧深处走去。',
    onEnter: (s) => {
      grantItem(s, 'fengyuteng', 3);
      setNodeText('在一处向阳的岩坡上，你竟发现了三株风语藤，顿时喜出望外。五株任务已凑齐！');
    },
    choices: [
      { label: '交任务去', next: 'quest_fengyuteng_complete' },
    ],
  },

  snake_encounter: {
    title: '蛇妖突袭',
    text: '一条青色蛇妖从草丛中窜出，蛇口大张，毒牙闪着寒光！',
    battle: { enemy: 'snake_demon', mult: 0.8 },
    winNext: 'snake_win',
    loseNext: 'wolf_defeat',
  },

  snake_win: {
    title: '斩蛇',
    text: '你击杀蛇妖，从其腹中竟找到了一些宝贝。',
    onEnter: (s) => {
      grantItem(s, 'hanbingxue', 1);
    },
    choices: [
      { label: '继续寻找风语藤', next: 'find_teng_2' },
    ],
  },

  quest_fengyuteng_complete: {
    title: '任务完成',
    text: '你交上五株风语藤，领到了二十灵石的奖励。',
    onEnter: (s) => { s.stone += 20; s.fame += 3; },
    choices: [
      { label: '继续接任务', next: 'quest_hall' },
      { label: '离开', next: 'qingyun_gate' },
    ],
  },

  quest_bandit: {
    title: '清剿山贼',
    text: '任务：前往清风寨，清剿盘踞在那里的山贼。奖励：一百灵石，加宗门贡献。',
    choices: [
      { label: '前往清风寨', next: 'bandit_road' },
      { label: '返回', next: 'quest_hall' },
    ],
  },

  bandit_road: {
    title: '清风寨',
    text: '你一路潜行，来到清风寨山下。山路狭窄，两边密林，正行间，几名山贼跳了出来！',
    battle: { enemy: 'bandit', mult: 1.0 },
    winNext: 'bandit_road_win',
    loseNext: 'wolf_defeat',
  },

  bandit_road_win: {
    title: '上山',
    text: '你解决掉放哨的山贼，继续往山寨深处前行。',
    choices: [
      { label: '继续深入', next: 'bandit_camp' },
    ],
  },

  bandit_camp: {
    title: '山贼营寨',
    text: '山贼大营出现在眼前，营中巡哨众多。你正思索如何潜入，又一队山贼迎面走来。',
    battle: { enemy: 'bandit', mult: 1.2 },
    winNext: 'bandit_camp_win',
    loseNext: 'wolf_defeat',
  },

  bandit_camp_win: {
    title: '逼近寨厅',
    text: '你接连击溃数名山贼，终于逼近了山寨的聚义厅。厅中传来粗犷的笑声——清风寨寨主显然就在里面。',
    choices: [
      { label: '闯进去！', next: 'bandit_chief_fight' },
    ],
  },

  bandit_chief_fight: {
    title: '清风寨寨主',
    text: '寨主是个满脸刀疤的壮汉，手中一柄鬼头刀重逾百斤。他见你闯入，狞笑一声，挥刀劈来！',
    battle: { enemy: 'bandit_chief', mult: 1.0 },
    winNext: 'bandit_chief_win',
    loseNext: 'wolf_defeat',
  },

  bandit_chief_win: {
    title: '大破清风寨',
    text: '你力斩寨主，清风寨群龙无首，作鸟兽散。你在寨中搜刮了一番，收获颇丰。',
    onEnter: (s) => {
      s.stone += 100;
      s.fame += 20;
      s.dao += 2;
      grantAchievement('boss_bandit');
    },
    choices: [
      { label: '回宗门复命', next: 'quest_bandit_complete' },
    ],
  },

  quest_bandit_complete: {
    title: '任务完成',
    text: '执事长老对你大为赞赏，不仅给了你灵石奖励，还记下了你的宗门功绩。',
    onEnter: (s) => { s.stone += 100; },
    choices: [
      { label: '继续接任务', next: 'quest_hall' },
      { label: '离开', next: 'qingyun_gate' },
    ],
  },

  // ===== 坊市 =====
  fangshi: {
    title: '青云坊市',
    text: '坊市之中人来人往，各式摊位鳞次栉比。丹药、法器、材料，应有尽有。',
    choices: [
      { label: '丹药铺', next: 'pill_shop' },
      { label: '法器铺', next: 'weapon_shop' },
      { label: '材料铺', next: 'material_shop' },
      { label: '炼器坊', next: 'craft_hall' },
      { label: '炼丹炉', next: 'danlu' },
      { label: '灵兽谷', next: 'lingshou_gu' },
      { label: '藏宝阁（抽奖）', next: 'gacha_hall' },
      { label: '返回', next: 'qingyun_gate' },
    ],
  },

  pill_shop: {
    title: '丹药铺',
    text: '一位白须老者守在丹炉旁，柜台上摆着各色丹药。',
    shop: {
      items: [
        { id: 'zhixie_san', price: 50 },
        { id: 'huiqi_pill', price: 500 },
        { id: 'huichun_pill', price: 2000 },
        { id: 'dahuan_pill', price: 8000 },
        { id: 'jiuzhuan_pill', price: 25000 },
        { id: 'juqi_pill', price: 80 },
      ],
      back: 'fangshi',
    },
    choices: [],
  },

  weapon_shop: {
    title: '法器铺',
    text: '店铺中陈列着各式法器，刀枪剑戟，一应俱全。',
    shop: {
      items: [
        { id: 'mujian', price: 30 },
        { id: 'tiebi', price: 150 },
        { id: 'tieyijia', price: 120 },
      ],
      back: 'fangshi',
    },
    choices: [],
  },

  gacha_hall: {
    title: '藏宝阁',
    text: '阁中宝光流转，一尊青铜宝鉴悬浮半空。传闻投下二百灵石，宝鉴便会吐出一件法器，品质全凭机缘。仙品法器，万中无一。',
    gacha: true,
    choices: [],
  },

  material_shop: {
    title: '材料铺',
    text: '这家铺子专卖各种炼器炼丹材料。',
    shop: {
      items: [
        { id: 'fengyuteng', price: 15 },
        { id: 'lieyangshi', price: 60 },
        { id: 'hanbingxue', price: 50 },
      ],
      back: 'fangshi',
    },
    choices: [],
  },

  craft_hall: {
    title: '炼器坊',
    text: '坊市角落有一家炼器坊，炉火正旺，叮叮当当的敲击声不绝于耳。掌柜的愿意用你带来的材料，帮你锻造法器、炼制丹药。',
    craft: true,
    choices: [],
  },

  danlu: {
    title: '炼丹炉',
    text: '一尊古朴的青铜丹炉立在坊市一角，炉内丹火熊熊。你可将材料投入炉中，随机炼出丹药，成色全凭运气。',
    alchemy: true,
    choices: [],
  },

  lingshou_gu: {
    title: '灵兽谷',
    text: '山谷深处林木葱郁，时有灵兽出没。你可在此抽取灵宠，龙与凤凰皆有可能现世。',
    tame: true,
    choices: [],
  },

  // ===== 试炼秘境（随机无尽爬塔） =====
  mijing_entrance: {
    title: '试炼秘境',
    text: '',
    dynamicText: (s) => {
      const best = (s.mijing && s.mijing.best) || 0;
      return `一座古老的传送阵悬浮于山巅，通往传说中的试炼秘境。秘境共分无数层，层数越深，敌人越强，奖励越丰厚。\n你当前的最高纪录：第 ${best} 层。`;
    },
    onEnter: (s) => {
      if (!s.mijing) s.mijing = { floor: 0, best: 0, active: false };
    },
    choices: [
      { label: '进入秘境（从第一层开始）', action: (s) => { s.mijing.floor = 0; s.mijing.active = true; }, next: 'mijing_fight' },
      { label: '返回', next: 'qingyun_gate' },
    ],
  },

  mijing_fight: {
    title: '秘境试炼',
    text: '',
    dynamicText: (s) => `秘境第 ${(s.mijing && s.mijing.floor) || 1} 层。前方一阵强大的气息逼近……`,
    onEnter: (s) => {
      if (!s.mijing) s.mijing = { floor: 0, best: 0, active: false };
      s.mijing.floor = (s.mijing.floor || 0) + 1;
      const floor = s.mijing.floor;
      const enemyId = pickMijingEnemy(floor);
      const mult = 1 + (floor - 1) * 0.08;
      STORY_NODES.mijing_fight.battle = { enemy: enemyId, mult: mult };
    },
    battle: null,
    winNext: 'mijing_continue',
    loseNext: 'mijing_end',
  },

  mijing_continue: {
    title: '层数突破',
    text: '',
    dynamicText: () => '你战胜了本层守关之敌！',
    onEnter: (s) => {
      const floor = s.mijing.floor || 0;
      if (floor > (s.mijing.best || 0)) s.mijing.best = floor;
      const bonus = floor * 5;
      s.stone += bonus;
      setNodeText(`你战胜了第 ${floor} 层守关之敌，额外获得 ${bonus} 灵石。即将进入第 ${floor + 1} 层……`);
      goToNodeAfterDelay('mijing_fight', 900);
    },
    choices: [],
  },

  mijing_end: {
    title: '秘境终结',
    text: '',
    dynamicText: (s) => {
      const last = (s.mijing && s.mijing.lastFloor) || 0;
      const best = (s.mijing && s.mijing.best) || 0;
      return `你止步于第 ${last} 层，被传送出了秘境。\n本次试炼到此为止，最高纪录：第 ${best} 层。`;
    },
    onEnter: (s) => {
      if (s.mijing) {
        s.mijing.lastFloor = s.mijing.floor || 0;
        s.mijing.active = false;
        s.mijing.floor = 0;
      }
    },
    choices: [
      { label: '返回宗门', next: 'qingyun_gate' },
    ],
  },

  // ===== 更多区域：药王谷 =====
  yaowanggu_entrance: {
    title: '药王谷',
    text: '传闻药王谷隐居着一位医术通神的修士，谷中更是灵药遍地。但谷口迷雾重重，常人难入。',
    choices: [
      { label: '尝试进入', next: 'yaowanggu_mist' },
      { label: '返回', next: 'qingyun_gate' },
    ],
  },

  yaowanggu_mist: {
    title: '迷踪雾',
    text: '你踏入浓雾之中，感到四周灵气紊乱，方向感渐渐模糊……',
    onEnter: (s) => {
      const r = Math.random();
      if (r < 0.5) {
        setNodeText('你在雾中走了许久，竟然意外找到了一片药园！');
        goToNodeAfterDelay('yaowanggu_garden', 1500);
      } else {
        setNodeText('迷雾中，一道身影缓缓走出——竟是一位低阶修士，似乎和你一样迷了路。他二话不说就向你出手！');
        goToNodeAfterDelay('yaowanggu_monk', 1500);
      }
    },
    choices: [
      { label: '继续', next: 'yaowanggu_garden' },
    ],
  },

  yaowanggu_monk: {
    title: '迷踪修士',
    text: '那修士眼神阴冷，显然把你当成了争抢机缘的对手。',
    battle: { enemy: 'low_monk', mult: 1.0 },
    winNext: 'yaowanggu_garden',
    loseNext: 'wolf_defeat',
  },

  yaowanggu_garden: {
    title: '灵药园',
    text: '你走出迷雾，眼前竟是一片生机勃勃的药园，各种灵草散发着淡淡的光晕。',
    onEnter: (s) => {
      grantItem(s, 'yaowanggu_lingzhi', 2);
      grantItem(s, 'huiqi_pill', 2);
    },
    choices: [
      { label: '深入谷中', next: 'yaowanggu_deep' },
      { label: '见好就收', next: 'qingyun_gate' },
    ],
  },

  yaowanggu_deep: {
    title: '谷深处',
    text: '药园深处，有一座小木屋。一位白发老者坐在屋前，似乎等你多时了。',
    choices: [
      { label: '上前见礼', next: 'yaowang_meet' },
    ],
  },

  yaowang_meet: {
    title: '药王',
    text: '"小友能破老夫的迷踪雾，也算有缘。你可愿拜入老夫门下，学习丹道？"',
    choices: [
      { label: '愿意拜师', next: 'yaowang_disciple' },
      { label: '婉拒，告辞', next: 'qingyun_gate' },
    ],
  },

  yaowang_disciple: {
    title: '药王弟子',
    text: '药王满意地点点头，传授你基础丹道知识，并赠你一瓶丹药。',
    onEnter: (s) => {
      s.dao += 5;
      grantItem(s, 'juqi_pill', 3);
      s.fame += 10;
    },
    choices: [
      { label: '谢过师尊', next: 'qingyun_gate' },
    ],
  },

  // ===== 论道台 =====
  lundaotai: {
    title: '论道台',
    text: '青云宗论道台，弟子间切磋较艺之所。胜者可获道韵、名望之利。',
    choices: [
      { label: '挑战同门', next: 'dao_vs_peer' },
      { label: '挑战长老', next: 'dao_vs_elder', req: (s) => getRealmIndex(s) >= 8 },
      { label: '返回', next: 'qingyun_gate' },
    ],
  },

  dao_vs_peer: {
    title: '同门切磋',
    text: '你跃上论道台，一名外门弟子手持法器，向你抱拳行礼。',
    battle: { enemy: 'dao_competitor', mult: 1.0 },
    winNext: 'dao_peer_win',
    loseNext: 'dao_lose',
  },

  dao_peer_win: {
    title: '论道得胜',
    text: '你一招制胜，台下众弟子纷纷喝彩。',
    onEnter: (s) => { s.dao += 3; s.fame += 8; },
    choices: [
      { label: '再来一场', next: 'dao_vs_peer_2' },
      { label: '下台休息', next: 'lundaotai' },
    ],
  },

  dao_vs_peer_2: {
    title: '再战一场',
    text: '又一名弟子不服，跃上擂台。',
    battle: { enemy: 'dao_competitor', mult: 1.3 },
    winNext: 'dao_peer_2_win',
    loseNext: 'dao_lose',
  },

  dao_peer_2_win: {
    title: '连胜',
    text: '你连胜两场，声名鹊起。',
    onEnter: (s) => { s.dao += 5; s.fame += 15; },
    choices: [
      { label: '回宗', next: 'qingyun_gate' },
    ],
  },

  dao_lose: {
    title: '惜败',
    text: '你技差一筹，败下阵来。但对方随即扶起你，二人切磋论道，各有所得。',
    onEnter: (s) => { s.dao += 1; s.hp = Math.max(1, Math.floor(s.maxHp * 0.4)); },
    choices: [
      { label: '下台', next: 'lundaotai' },
    ],
  },

  dao_vs_elder: {
    title: '挑战长老',
    text: '一位长老缓步上台，身上气息深不可测。"小友，请。"',
    battle: { enemy: 'dao_elder', mult: 1.0 },
    winNext: 'dao_elder_win',
    loseNext: 'dao_lose',
  },

  dao_elder_win: {
    title: '惊人之胜',
    text: '你竟在长老手中走过百招而不败，长老最后主动认输，台下一片哗然。',
    onEnter: (s) => { s.dao += 20; s.fame += 50; },
    choices: [
      { label: '谢过长老', next: 'qingyun_gate' },
    ],
  },

  // ===== 天劫：筑基 =====
  zhuji_prep: {
    title: '筑基在即',
    text: '你感到自身修为已达炼气大圆满的顶点，再进一步便是筑基。但筑基必渡天劫，失败则形神俱灭。',
    choices: [
      { label: '准备渡劫', next: 'zhuji_tribulation', req: (s) => getRealmIndex(s) >= 9 },
      { label: '再等等', next: 'qingyun_gate' },
    ],
  },

  zhuji_tribulation: {
    title: '筑基天劫',
    text: '你寻了一处山谷，盘坐于地。天空乌云汇聚，电蛇游走。天劫，即将降下！',
    battle: { enemy: 'lei_jie_1', mult: 1.0, tribulation: true, turns: 5 },
    winNext: 'zhuji_success',
    loseNext: 'zhuji_fail',
  },

  zhuji_success: {
    title: '筑基成功',
    text: '你硬生生扛过了九重天雷，经脉被天雷洗练得愈发坚韧。一股磅礴的气息自你体内涌出——筑基成功！',
    onEnter: (s) => {
      passTribulation(s, 'zhuji', 9);
      grantAchievement('survive_tribulation');
      grantAchievement('realm_zhuji');
      s.dao += 15;
      s.fame += 30;
    },
    choices: [
      { label: '返回宗门', next: 'qingyun_gate' },
    ],
  },

  zhuji_fail: {
    title: '渡劫失败',
    text: '最后一道天雷落下，你再也支撑不住，浑身焦黑，昏死过去。不知过了多久，你悠悠醒来，发现自己被一位路过的散修所救。',
    onEnter: (s) => {
      s.xp = Math.floor(s.xp * 0.7);
      s.hp = Math.max(1, Math.floor(s.maxHp * 0.2));
    },
    choices: [
      { label: '谢过恩人', next: 'qingyun_gate' },
    ],
  },

  // ===== 主线推进：宗门大比 =====
  zongmen_bi_notice: {
    title: '宗门大比',
    text: '山门处贴出告示：三月后将举办宗门大比，届时内门长老亲自到场，表现优异者可被收入内门。',
    choices: [
      { label: '报名参加', next: 'zongmen_bi_round1' },
      { label: '暂时放弃', next: 'qingyun_gate' },
    ],
  },

  zongmen_bi_round1: {
    title: '初赛',
    text: '宗门大比初赛，对手是一名与你境界相当的外门弟子。',
    battle: { enemy: 'dao_competitor', mult: 1.2 },
    winNext: 'zongmen_bi_round2',
    loseNext: 'zongmen_bi_lose',
  },

  zongmen_bi_round2: {
    title: '复赛',
    text: '你顺利晋级复赛。这一轮的对手明显更加强大。',
    battle: { enemy: 'dao_competitor', mult: 1.6 },
    winNext: 'zongmen_bi_final',
    loseNext: 'zongmen_bi_lose',
  },

  zongmen_bi_final: {
    title: '决赛',
    text: '决赛的对手，是外门弟子中久负盛名的天才人物。',
    battle: { enemy: 'dao_elder', mult: 0.8 },
    winNext: 'zongmen_bi_champion',
    loseNext: 'zongmen_bi_lose',
  },

  zongmen_bi_champion: {
    title: '魁首',
    text: '你一路过关斩将，夺得宗门大比魁首！内门长老亲自接见，允诺收入内门，并赐下丰厚奖励。',
    onEnter: (s) => {
      s.stone += 500;
      s.dao += 25;
      s.fame += 100;
      grantItem(s, 'tiebi');
    },
    choices: [
      { label: '拜入内门', next: 'inner_gate' },
    ],
  },

  zongmen_bi_lose: {
    title: '落败',
    text: '你在大比中落败，但也从战斗中领悟了许多。',
    onEnter: (s) => { s.dao += 5; s.fame += 10; },
    choices: [
      { label: '返回修炼', next: 'qingyun_gate' },
    ],
  },

  inner_gate: {
    title: '内门弟子',
    text: '你成为了青云宗内门弟子，拥有了更优渥的修炼资源。更广阔的天地，在你眼前徐徐展开。',
    onEnter: (s) => {
      if (!s.innerGate) {
        s.innerGate = true;
        s.stone += 200;
      }
    },
    choices: [
      { label: '继续修炼', next: 'inner_cultivate' },
      { label: '去内门任务堂', next: 'inner_quest_hall' },
      { label: '离开宗门历练', next: 'lianyu_entrance' },
      { label: '准备渡劫结丹', next: 'jindan_prep', req: (s) => getRealmIndex(s) >= 13 },
      { label: '准备渡劫成婴', next: 'yuanying_prep', req: (s) => getRealmIndex(s) >= 17 },
      { label: '准备渡劫化神', next: 'huashen_prep', req: (s) => getRealmIndex(s) >= 21 },
      { label: '准备飞升', next: 'feisheng_prep', req: (s) => getRealmIndex(s) >= 25 },
      { label: '迎战魔尊（终局）', next: 'final_story' },
      { label: '返回外门', next: 'qingyun_gate' },
    ],
  },

  inner_cultivate: {
    title: '内门修炼',
    text: '内门洞府灵气浓度远胜外门，你修炼起来事半功倍。',
    onEnter: (s) => {
      const gain = 80 + Math.floor(Math.random() * 40);
      addXp(s, gain);
      setNodeText(`修炼完毕，你感到体内灵气暴涨。（+${gain}修为）`);
    },
    choices: [
      { label: '继续修炼', next: 'inner_cultivate_2' },
      { label: '离开洞府', next: 'inner_gate' },
    ],
  },

  inner_cultivate_2: {
    title: '再修一轮',
    text: '你继续沉浸在修炼之中。',
    onEnter: (s) => {
      const gain = 100 + Math.floor(Math.random() * 60);
      addXp(s, gain);
      setNodeText(`你周身灵气愈发醇厚。（+${gain}修为）`);
    },
    choices: [
      { label: '返回', next: 'inner_gate' },
    ],
  },

  inner_quest_hall: {
    title: '内门任务堂',
    text: `内门任务的难度与奖励都远超外门。你浏览墙上的告示。`,
    choices: [
      { label: '猎杀石猴（中阶）', next: 'quest_stone_monkey' },
      { label: '追查血教踪迹（高阶）', next: 'quest_blood_cult' },
      { label: '返回', next: 'inner_gate' },
    ],
  },

  quest_stone_monkey: {
    title: '猎杀石猴',
    text: '任务：石猴在黑风岭作祟，伤了不少采药弟子。你来到黑风岭。',
    battle: { enemy: 'stone_monkey', mult: 1.0 },
    winNext: 'stone_monkey_win',
    loseNext: 'wolf_defeat',
  },

  stone_monkey_win: {
    title: '击毙石猴',
    text: '你成功击杀石猴，从其身上找到了不少材料。',
    onEnter: (s) => {
      s.stone += 120;
      s.fame += 15;
    },
    choices: [
      { label: '再深入看看', next: 'stone_monkey_deep' },
      { label: '回宗复命', next: 'inner_quest_hall' },
    ],
  },

  stone_monkey_deep: {
    title: '黑风岭深处',
    text: '你顺着山径深入，竟然发现了一片烈阳石矿脉！',
    onEnter: (s) => { grantItem(s, 'lieyangshi', 3); },
    choices: [
      { label: '返回', next: 'inner_quest_hall' },
    ],
  },

  quest_blood_cult: {
    title: '血教踪迹',
    text: '近期有血教弟子在宗门附近出没，长老命你前往追查。你循着线索来到一处废弃矿洞。',
    choices: [
      { label: '进入矿洞', next: 'blood_cult_ambush' },
    ],
  },

  blood_cult_ambush: {
    title: '血教伏击',
    text: '刚入矿洞，一道血色爪影便扑面而来！',
    battle: { enemy: 'blood_cultist', mult: 1.0 },
    winNext: 'blood_cult_1_win',
    loseNext: 'wolf_defeat',
  },

  blood_cult_1_win: {
    title: '深入敌穴',
    text: '你解决掉一名血教弟子，矿洞深处似乎还有更多敌人。',
    choices: [
      { label: '继续深入', next: 'blood_cult_deep' },
      { label: '撤退', next: 'inner_quest_hall' },
    ],
  },

  blood_cult_deep: {
    title: '血祭坛',
    text: '矿洞深处，一座血红色的祭坛散发着诡异气息。两名血教弟子守在旁边。',
    battle: { enemy: 'blood_cultist', mult: 1.3 },
    winNext: 'blood_cult_deep_win',
    loseNext: 'wolf_defeat',
  },

  blood_cult_deep_win: {
    title: '捣毁祭坛',
    text: '你击溃守卫，一掌拍碎了血祭坛。祭坛下竟藏着一个储物袋，里面宝物颇丰。',
    onEnter: (s) => {
      s.stone += 200;
      grantItem(s, 'juqi_pill', 2);
      s.fame += 30;
      s.dao += 5;
    },
    choices: [
      { label: '回宗复命', next: 'inner_quest_hall' },
    ],
  },

  // ===== 历练：妖兽山脉 =====
  lianyu_entrance: {
    title: '妖兽山脉',
    text: '山脉绵延万里，深处传说有上古妖兽出没。是历练的好地方，也是危险之地。',
    choices: [
      { label: '在外围历练', next: 'mountain_outer' },
      { label: '深入山脉', next: 'mountain_deep' },
      { label: '前往青丘', next: 'nine_tails_entrance' },
      { label: '前往应龙渊', next: 'yinglong_pond' },
      { label: '探寻四凶禁地', next: 'taowu_entrance', req: (s) => getRealmIndex(s) >= 14 },
      { label: '探寻上古魔域', next: 'huashen_moyu', req: (s) => getRealmIndex(s) >= 22 },
      { label: '返回', next: 'inner_gate' },
    ],
  },

  mountain_outer: {
    title: '山脉外围',
    text: '山脉外围妖兽不强，正适合练手。你一路前行，遇到了不少低阶妖兽。',
    battle: { enemy: 'stone_monkey', mult: 0.8 },
    winNext: 'mountain_outer_win',
    loseNext: 'wolf_defeat',
  },

  mountain_outer_win: {
    title: '小有收获',
    text: '你斩杀妖兽，获得了一些材料。',
    onEnter: (s) => { s.stone += 60; },
    choices: [
      { label: '继续前行', next: 'bifuluan_encounter' },
      { label: '返回', next: 'lianyu_entrance' },
    ],
  },

  bifuluan_encounter: {
    title: '毕方',
    text: '天空中传来一声清越的鸟鸣，一只青色灵禽盘旋而下——竟是传说中的毕方！',
    battle: { enemy: 'bifuluan', mult: 1.0 },
    winNext: 'bifuluan_win',
    loseNext: 'wolf_defeat',
  },

  bifuluan_win: {
    title: '斩杀毕方',
    text: '你血战毕方，最终将其击毙。这只灵禽身上满是天材地宝。',
    onEnter: (s) => {
      s.dao += 10;
      s.fame += 40;
      grantItem(s, 'lieyangshi', 3);
    },
    choices: [
      { label: '返回', next: 'lianyu_entrance' },
    ],
  },

  mountain_deep: {
    title: '深入山脉',
    text: '你不顾劝阻，深入山脉深处。一股蛮荒古老的气息扑面而来。',
    choices: [
      { label: '继续深入', next: 'qiongqi_encounter' },
      { label: '感觉不对，撤退', next: 'lianyu_entrance' },
    ],
  },

  qiongqi_encounter: {
    title: '穷奇',
    text: '一头形似猛虎、背生双翼的巨兽挡在你面前——四凶之一的穷奇！',
    battle: { enemy: 'qiongqi', mult: 1.0 },
    winNext: 'qiongqi_win',
    loseNext: 'wolf_defeat',
  },

  qiongqi_win: {
    title: '诛杀穷奇',
    text: '你血战良久，终于斩下了穷奇的头颅。此等功绩，足以震惊一方。',
    onEnter: (s) => {
      s.dao += 20;
      s.fame += 80;
      s.stone += 300;
      grantItem(s, 'fengyuteng', 5);
    },
    choices: [
      { label: '继续深入', next: 'taotie_encounter' },
      { label: '见好就收', next: 'lianyu_entrance' },
    ],
  },

  taotie_encounter: {
    title: '饕餮',
    text: '前方是一片荒芜之地，地面上布满骸骨。一头形似巨羊、人面虎齿的怪物缓缓站起——饕餮！',
    battle: { enemy: 'taotie', mult: 1.0 },
    winNext: 'taotie_win',
    loseNext: 'wolf_defeat',
  },

  taotie_win: {
    title: '力战饕餮',
    text: '你以命相搏，最终将饕餮斩杀。你自己也伤势惨重，但收获同样惊人。',
    onEnter: (s) => {
      s.dao += 30;
      s.fame += 120;
      s.stone += 500;
      grantItem(s, 'hanbingxue', 5);
      grantItem(s, 'juqi_pill', 5);
    },
    choices: [
      { label: '回去修养', next: 'lianyu_entrance' },
    ],
  },

  // ===== 九尾天狐 =====
  nine_tails_entrance: {
    title: '青丘',
    text: '传闻青丘之地有九尾天狐出没，魅惑众生，亦有大神通。你来到这片迷雾笼罩的山林。',
    choices: [
      { label: '进入青丘', next: 'nine_tails_mist' },
      { label: '返回', next: 'lianyu_entrance' },
    ],
  },

  nine_tails_mist: {
    title: '幻雾',
    text: '你踏入迷雾，四周景色骤然变幻，竟出现了无数幻影。',
    onEnter: (s) => {
      const r = Math.random();
      if (r < 0.5) {
        setNodeText('你守住心神，破开幻雾。前方一座亭子中，坐着一位白衣女子。');
        goToNodeAfterDelay('nine_tails_meet', 1500);
      } else {
        setNodeText('你心神失守，幻象化作利箭刺来！');
        goToNodeAfterDelay('nine_tails_fight', 1500);
      }
    },
    choices: [
      { label: '继续', next: 'nine_tails_meet' },
    ],
  },

  nine_tails_meet: {
    title: '九尾天狐',
    text: '那女子转过头，身后九条狐尾轻轻摇曳——正是九尾天狐！"小友能破我幻雾，也算有缘。你想要什么？"',
    choices: [
      { label: '请教道法', next: 'nine_tails_dao' },
      { label: '求取宝物', next: 'nine_tails_treasure' },
      { label: '告辞', next: 'lianyu_entrance' },
    ],
  },

  nine_tails_dao: {
    title: '狐族道韵',
    text: '九尾天狐微微一笑，伸出一根手指轻点你眉心。一股玄妙的道韵涌入你的识海。',
    onEnter: (s) => { s.dao += 25; s.fame += 20; },
    choices: [
      { label: '谢过前辈', next: 'lianyu_entrance' },
    ],
  },

  nine_tails_treasure: {
    title: '罗盘',
    text: '九尾天狐取出一个古旧的罗盘，"这问道罗盘能感应机缘，便赠与你吧。"',
    onEnter: (s) => { grantItem(s, 'dao_compass'); },
    choices: [
      { label: '谢过前辈', next: 'lianyu_entrance' },
    ],
  },

  nine_tails_fight: {
    title: '九尾之怒',
    text: '你强行破幻，惊动了九尾天狐。她柳眉一竖，九条狐尾同时扬起！',
    battle: { enemy: 'nine_tails', mult: 1.0 },
    winNext: 'nine_tails_fight_win',
    loseNext: 'wolf_defeat',
  },

  nine_tails_fight_win: {
    title: '降服天狐',
    text: '你以力破巧，竟将九尾天狐击败。她化作一道白光逃走，却留下了一身宝物。',
    onEnter: (s) => {
      s.dao += 40;
      s.fame += 150;
      s.stone += 400;
      grantItem(s, 'dao_compass');
    },
    choices: [
      { label: '返回', next: 'lianyu_entrance' },
    ],
  },

  // ===== 应龙渊 =====
  yinglong_pond: {
    title: '应龙渊',
    text: '传闻应龙沉眠于万仞深渊。你站在悬崖边，下方云雾翻涌，隐约有龙吟之声。',
    choices: [
      { label: '下渊探龙', next: 'yinglong_fight' },
      { label: '退走', next: 'lianyu_entrance' },
    ],
  },

  yinglong_fight: {
    title: '应龙',
    text: '你纵身跃下深渊。云雾散开，一条金色巨龙睁开双眼——应龙！',
    battle: { enemy: 'yinglong', mult: 1.0 },
    winNext: 'yinglong_win',
    loseNext: 'wolf_defeat',
  },

  yinglong_win: {
    title: '屠龙之威',
    text: '你与应龙大战三百回合，最终斩下龙头。应龙之血洒落在你身上，淬炼你的肉身。',
    onEnter: (s) => {
      s.dao += 50;
      s.fame += 200;
      s.stone += 600;
      s.maxHp += 100;
      s.hp += 100;
      grantItem(s, 'tieyijia', 2);
    },
    choices: [
      { label: '返回', next: 'lianyu_entrance' },
    ],
  },

  // ===== 最终决战：魔尊 =====
  final_story: {
    title: '魔尊出世',
    text: '天地异变，魔气冲天。魔尊破封而出，正道凋零。你作为后起之秀，被寄予厚望。',
    choices: [
      { label: '迎战魔尊', next: 'demon_lord_fight', req: (s) => getRealmIndex(s) >= 14 },
      { label: '继续修炼', next: 'inner_gate' },
    ],
  },

  demon_lord_fight: {
    title: '决战魔尊',
    text: '魔尊立于虚空之上，周身魔气翻涌，有如实质。"区区小辈，也敢来送死？"',
    battle: { enemy: 'demon_lord', mult: 1.0 },
    winNext: 'ending_good',
    loseNext: 'ending_bad',
  },

  ending_good: {
    title: '大道可期',
    text: '你与魔尊大战，最终以一招之优势将其重创。魔尊逃入虚空裂缝，天地重归清明。\n你成为正道领袖，受万人敬仰。然而大道无止境——化神、飞升，才是修士的终极追求。',
    onEnter: (s) => {
      s.fame += 500;
      s.dao += 100;
    },
    choices: [
      { label: '再续仙缘', next: 'inner_gate' },
    ],
  },

  ending_bad: {
    title: '陨落',
    text: '魔尊的力量远超你的想象。你终究没能撑到最后……\n\n修仙一途，本就是逆天而行。败了，便是身死道消。\n\n（提示：手动存档不会被删除，可在下方「读取存档」中继续。）',
    choices: [
      { label: '重新来过', action: () => { restartGame(); } },
      { label: '读取存档', action: () => { UI.openSidePanel('save'); } },
    ],
  },

  // ===== 金丹天劫 =====
  jindan_prep: {
    title: '结丹在即',
    text: '你感到修为已至筑基大圆满的尽头,再进一步便是凝结金丹。然金丹一成,必降天劫。',
    choices: [
      { label: '渡劫结丹', next: 'jindan_tribulation', req: (s) => getRealmIndex(s) >= 13 },
      { label: '再等等', next: 'inner_gate' },
    ],
  },

  jindan_tribulation: {
    title: '金丹天劫',
    text: '你寻得一处灵脉汇聚之地,盘膝而坐。天空风起云涌,雷云压顶——金丹天劫,降下了!',
    battle: { enemy: 'lei_jie_2', mult: 1.0, tribulation: true, turns: 7 },
    winNext: 'jindan_success',
    loseNext: 'jindan_fail',
  },

  jindan_success: {
    title: '金丹大成',
    text: '你硬生生扛过了七重天雷,一颗金灿灿的金丹在丹田中缓缓凝结。金丹大道,自此而始!',
    onEnter: (s) => {
      passTribulation(s, 'jindan', 13);
      grantAchievement('trib_jindan');
      s.dao += 25;
      s.fame += 60;
    },
    choices: [
      { label: '返回宗门', next: 'inner_gate' },
    ],
  },

  jindan_fail: {
    title: '结丹失败',
    text: '最后一道天雷落下,你丹田一阵剧痛,金丹雏形轰然破碎。所幸道基未损,仍可重修。',
    onEnter: (s) => {
      s.xp = Math.floor(s.xp * 0.7);
      s.hp = Math.max(1, Math.floor(s.maxHp * 0.2));
    },
    choices: [
      { label: '返回修养', next: 'inner_gate' },
    ],
  },

  // ===== 元婴天劫 =====
  yuanying_prep: {
    title: '化婴在即',
    text: '金丹大圆满,你已触摸到元婴的门槛。元婴一成,天地变色,天劫亦将更加恐怖。',
    choices: [
      { label: '渡劫化婴', next: 'yuanying_tribulation', req: (s) => getRealmIndex(s) >= 17 },
      { label: '再等等', next: 'inner_gate' },
    ],
  },

  yuanying_tribulation: {
    title: '元婴天劫',
    text: '你身处虚空,引动天地之力。九重雷云层层压下,元婴天劫,已至!',
    battle: { enemy: 'lei_jie_3', mult: 1.0, tribulation: true, turns: 9 },
    winNext: 'yuanying_success',
    loseNext: 'yuanying_fail',
  },

  yuanying_success: {
    title: '元婴初成',
    text: '九重天雷过后,一个与你一般无二的元婴自天灵盖升起,俯瞰天地。元婴大道,成!',
    onEnter: (s) => {
      passTribulation(s, 'yuanying', 17);
      grantAchievement('trib_yuanying');
      s.dao += 50;
      s.fame += 150;
    },
    choices: [
      { label: '返回宗门', next: 'inner_gate' },
    ],
  },

  yuanying_fail: {
    title: '化婴失败',
    text: '天威之下,你的元婴尚未成形便已消散。你呕出一口精血,元气大伤。',
    onEnter: (s) => {
      s.xp = Math.floor(s.xp * 0.7);
      s.hp = Math.max(1, Math.floor(s.maxHp * 0.15));
    },
    choices: [
      { label: '返回修养', next: 'inner_gate' },
    ],
  },

  // ===== 四凶禁地（高难度挑战） =====
  taowu_entrance: {
    title: '四凶禁地',
    text: '妖兽山脉极深处,有一片被上古大能封印的禁地。传闻四凶中的梼杌、混沌仍盘踞于此,最深处更有烛龙沉眠。',
    choices: [
      { label: '踏入禁地', next: 'taowu_fight', req: (s) => getRealmIndex(s) >= 14 },
      { label: '返回', next: 'lianyu_entrance' },
    ],
  },

  taowu_fight: {
    title: '梼杌',
    text: '一头形似猛虎、人面猪口的凶兽挡住去路,凶威滔天——四凶之一的梼杌!',
    battle: { enemy: 'taowu', mult: 1.0 },
    winNext: 'taowu_win',
    loseNext: 'defeat_general',
  },

  taowu_win: {
    title: '诛梼杌',
    text: '你力战良久,终于斩杀了梼杌。禁地深处,还有更强大的气息在沉眠。',
    onEnter: (s) => { s.dao += 30; s.fame += 100; s.stone += 400; },
    choices: [
      { label: '继续深入', next: 'hundun_fight' },
      { label: '见好就收', next: 'lianyu_entrance' },
    ],
  },

  hundun_fight: {
    title: '混沌',
    text: '前方一片虚无,一尊没有七窍的庞然巨兽缓缓浮现,吞天噬地——四凶之一的混沌!',
    battle: { enemy: 'hundun', mult: 1.0 },
    winNext: 'hundun_win',
    loseNext: 'defeat_general',
  },

  hundun_win: {
    title: '灭混沌',
    text: '你以无上神通击溃了混沌。禁地最深处,龙吟之声隐隐传来。',
    onEnter: (s) => { s.dao += 50; s.fame += 180; s.stone += 800; },
    choices: [
      { label: '深入龙穴', next: 'zhulong_fight' },
      { label: '见好就收', next: 'lianyu_entrance' },
    ],
  },

  zhulong_fight: {
    title: '烛龙',
    text: '深渊之中,一条人面龙身的古龙睁开双眼,一闭一睁之间,昼夜交替——上古烛龙!',
    battle: { enemy: 'zhulong', mult: 1.0 },
    winNext: 'zhulong_win',
    loseNext: 'defeat_general',
  },

  zhulong_win: {
    title: '烛龙陨落',
    text: '你历经生死,终于斩落了上古烛龙。此等壮举,足以名动九州,载入仙史!',
    onEnter: (s) => {
      grantAchievement('boss_zhulong');
      s.dao += 100;
      s.fame += 500;
      s.stone += 2000;
      grantItem(s, 'tiebi');
      grantItem(s, 'juqi_pill', 5);
    },
    choices: [
      { label: '凯旋而归', next: 'inner_gate' },
    ],
  },

  // ===== 化神天劫 =====
  huashen_prep: {
    title: '化神在即',
    text: '元婴大圆满，你已触及化神的门槛。化神者，神游太虚，脱离肉胎桎梏。此劫凶险异常。',
    choices: [
      { label: '渡劫化神', next: 'huashen_tribulation', req: (s) => getRealmIndex(s) >= 21 },
      { label: '再等等', next: 'inner_gate' },
    ],
  },

  huashen_tribulation: {
    title: '化神天劫',
    text: '你于虚空之中引动天地法则。九重神雷接连劈下，每一道都足以让寻常元婴形神俱灭！',
    battle: { enemy: 'lei_jie_4', mult: 1.0, tribulation: true, turns: 9 },
    winNext: 'huashen_success',
    loseNext: 'huashen_fail',
  },

  huashen_success: {
    title: '化神初成',
    text: '九重神雷尽数扛下，你的神魂与元婴彻底相融，神念一动，便可遨游太虚。化神，成！',
    onEnter: (s) => {
      passTribulation(s, 'huashen', 21);
      grantAchievement('trib_huashen');
      s.dao += 80;
      s.fame += 300;
    },
    choices: [
      { label: '返回宗门', next: 'inner_gate' },
    ],
  },

  huashen_fail: {
    title: '化神失败',
    text: '神雷无情，你的神魂在雷劫中重创，境界动摇。所幸道基未毁，仍可休养重来。',
    onEnter: (s) => {
      s.xp = Math.floor(s.xp * 0.7);
      s.hp = Math.max(1, Math.floor(s.maxHp * 0.15));
    },
    choices: [
      { label: '返回修养', next: 'inner_gate' },
    ],
  },

  // ===== 飞升劫 =====
  feisheng_prep: {
    title: '飞升在即',
    text: '化神大圆满，天地法则加身。再进一步，便是羽化飞升，从此超脱凡尘，位列仙班。',
    choices: [
      { label: '渡飞升劫', next: 'feisheng_tribulation', req: (s) => getRealmIndex(s) >= 25 },
      { label: '再等等', next: 'inner_gate' },
    ],
  },

  feisheng_tribulation: {
    title: '飞升天劫',
    text: '你引动毕生修为，天地为之色变。十一道九天神雷破空而来，这是凡间修士的最后一关！',
    battle: { enemy: 'fei_sheng_jie', mult: 1.0, tribulation: true, turns: 11 },
    winNext: 'feisheng_success',
    loseNext: 'feisheng_fail',
  },

  feisheng_success: {
    title: '羽化飞升',
    text: '十一道神雷过后，天门大开，仙乐阵阵。你的肉身化作流光，直上九霄——飞升仙界，自此超脱轮回！\n\n—— 全书完 ——',
    onEnter: (s) => {
      grantAchievement('trib_feisheng');
      s.fame += 1000;
      s.dao += 200;
    },
    choices: [
      { label: '再续仙缘', next: 'inner_gate' },
    ],
  },

  feisheng_fail: {
    title: '飞升失败',
    text: '最后一道神雷落下，你终究功亏一篑，从云端跌落。飞升不成，但仙缘未断，来日再战！',
    onEnter: (s) => {
      s.xp = Math.floor(s.xp * 0.7);
      s.hp = Math.max(1, Math.floor(s.maxHp * 0.1));
    },
    choices: [
      { label: '返回修养', next: 'inner_gate' },
    ],
  },

  // ===== 上古魔域（化神期挑战） =====
  huashen_moyu: {
    title: '上古魔域',
    text: '妖兽山脉最深处，竟是一片上古战场遗迹。魔气滔天，传说域外天魔曾在此撕裂虚空而来。',
    choices: [
      { label: '踏入魔域', next: 'tianmo_fight', req: (s) => getRealmIndex(s) >= 22 },
      { label: '返回', next: 'lianyu_entrance' },
    ],
  },

  tianmo_fight: {
    title: '域外天魔',
    text: '一尊背生双翼、头生独角的魔物自虚空中踏出，周身魔气如渊如狱——域外天魔！',
    battle: { enemy: 'tianmo', mult: 1.0 },
    winNext: 'tianmo_win',
    loseNext: 'defeat_general',
  },

  tianmo_win: {
    title: '诛天魔',
    text: '你浴血奋战，终于斩落了域外天魔。魔域最深处，还有一尊更恐怖的存在在沉睡。',
    onEnter: (s) => { s.dao += 60; s.fame += 200; s.stone += 1500; },
    choices: [
      { label: '深入魔渊', next: 'mojun_fight' },
      { label: '见好就收', next: 'lianyu_entrance' },
    ],
  },

  mojun_fight: {
    title: '上古魔君',
    text: '深渊之底，一尊端坐于魔骨王座上的身影缓缓睁眼，魔威压得天地都仿佛凝滞——上古魔君！',
    battle: { enemy: 'mojun', mult: 1.0 },
    winNext: 'mojun_win',
    loseNext: 'defeat_general',
  },

  mojun_win: {
    title: '魔君伏诛',
    text: '你历经九死一生，终于将上古魔君斩于剑下。此战过后，天下魔族再也不敢踏足青云山！',
    onEnter: (s) => {
      s.dao += 120;
      s.fame += 600;
      s.stone += 4000;
      grantItem(s, 'juqi_pill', 5);
    },
    choices: [
      { label: '凯旋而归', next: 'inner_gate' },
    ],
  },

  defeat_general: {
    title: '重伤',
    text: '你力战不敌,身负重伤,拼尽全力才逃出生天。',
    onEnter: (s) => { s.hp = Math.max(1, Math.floor(s.maxHp * 0.3)); },
    choices: [
      { label: '返回修养', next: 'inner_gate' },
    ],
  },
};

// ========== 兑换码 ==========
// 在这里维护兑换码，玩家在游戏内「兑换」面板输入即可领取对应奖励。
// 每个兑换码每个存档只能领取一次（记录在 save.redeemed）。
//
// 奖励字段可任意组合：
//   stone : 灵石数量
//   xp    : 修为点数（会自动触发突破）
//   dao   : 道韵
//   fame  : 名望
//   item  : { id: '物品ID', count: 数量 }  物品ID见上方 ITEMS 定义
//
// 添加新码：复制一行，改 key（兑换码，建议纯大写字母+数字、不含空格）和奖励即可。
const REDEEM_CODES = {
  'FANTU666':    { stone: 666 },
  'XIUWEI888':   { xp: 888 },
  'DAOYUN88':    { dao: 88 },
  'MINGWANG88':  { fame: 88 },
  'HUIQI99':     { item: { id: 'huiqi_pill', count: 5 } },
  'FANTUXINREN': { stone: 500, xp: 300, item: { id: 'g_yanlingzhu', count: 1 } },
};

// ========== 签到与日常 ==========
// 连续签到奖励（7 天一个循环，越往后越丰厚）
const SIGNIN_REWARDS = [
  { stone: 50 },
  { stone: 80 },
  { stone: 120, item: { id: 'huiqi_pill', count: 1 } },
  { stone: 150 },
  { stone: 200, item: { id: 'juqi_pill', count: 1 } },
  { stone: 260 },
  { stone: 400, item: { id: 'dahuan_pill', count: 1 } },
];

// 每日任务（每天刷新，完成 1 次即可领取）
const DAILY_TASKS = [
  { key: 'battle',     name: '战斗胜利 1 次', reward: { stone: 40 } },
  { key: 'pill',       name: '服用丹药 1 次', reward: { stone: 30, xp: 20 } },
  { key: 'strengthen', name: '强化装备 1 次', reward: { stone: 60 } },
];
