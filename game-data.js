// ========== 更新公告 ==========
// 每次更新在此追加一条（放在数组最前面），游戏内「📢 公告」与自动弹窗会展示最新内容
const UPDATE_LOG = [
  {
    version: 'v36',
    date: '2026-08-20',
    title: '囤囤鼠神藏限定中后期Boss · Boss伤害加强',
    items: [
      '囤囤鼠偷神藏限定中后期 Boss（梼杌/混沌/禁地穷奇/烛龙/魔尊/域外天魔/上古魔君/洪荒祖兽/天道化身/混沌元灵），早期与秘境 Boss 不再掉落',
      'Boss 普通攻击伤害加强 30%，中后期战斗更具挑战',
    ],
  },
  {
    version: 'v35',
    date: '2026-08-20',
    title: '灵宠升星重构 · 重复全保留 · 消耗分档',
    items: [
      '重复灵宠不再自动转灵石，全部保留入包，由玩家手动放生',
      '升星新增灵石消耗，按品质分档：低阶便宜、高阶昂贵（废品20 → 神品1500）',
    ],
  },
  {
    version: 'v34',
    date: '2026-08-20',
    title: '灵宠升星修复 · 重复灵宠保留',
    items: [
      '修复：低阶灵宠抽到重复也会保留入包，不再直接放生，可攒齐 3 只同名升星',
      '非神品同名灵宠最多保留 6 只，超过后再抽到才自动转灵石；神品仍不设上限',
    ],
  },
  {
    version: 'v33',
    date: '2026-08-20',
    title: '囤囤鼠成就 · 妙手神偷称号',
    items: [
      '囤囤鼠偷到Boss私藏神装时，解锁成就「鼠鼠立大功」并获得称号「妙手神偷」',
      '称号展示于顶栏道号旁与修为面板，彰显你的神偷之名',
    ],
  },
  {
    version: 'v32',
    date: '2026-08-20',
    title: '新神品灵宠 · 囤囤鼠',
    items: [
      '新增神品灵宠「囤囤鼠」：战斗中概率带主人闪避，战后顺手偷灵石/材料，极低概率(0.001%)偷走Boss私藏神装（专属掉落，仅囤囤鼠能偷）',
      '囤囤鼠专注闪避与搜刮，靠「囤粮」慢慢变富，不参与普通技能追击',
    ],
  },
  {
    version: 'v31',
    date: '2026-08-20',
    title: '灵宠好感度 · 零食转盘 · 独立界面',
    items: [
      '灵宠新增好感度系统：送零食/装饰品投其所好，好感提升战斗放技能概率（0好感×0.5 → 满20级×1.5）',
      '新增「灵宠零食/装饰」转盘，分凡品/精制/仙品三档，零食3口味+装饰3风格',
      '灵宠界面改为顶栏🐾独立全屏界面，从侧边栏拆出，可送礼培养好感',
    ],
  },
  {
    version: 'v30',
    date: '2026-08-20',
    title: '功法图鉴 · 宗门绝学总览',
    items: [
      '功法图鉴新增「宗门绝学」总览，按青云宗 / 丹霞谷 / 天魔教分组展示各派独门技能',
      '每个宗门标注宗门加成，战斗技能归宗门、被动功法按品阶，查阅更清晰',
    ],
  },
  {
    version: 'v29',
    date: '2026-08-19',
    title: '灵宠百连抽 · 八折',
    items: [
      '灵兽谷抽灵宠新增「百连抽」，一次 100 抽打八折（16000 灵石）',
      '百连结果按灵宠/道具合并显示，重复或自动放生灵宠自动折算灵石',
    ],
  },
  {
    version: 'v28',
    date: '2026-08-19',
    title: '藏宝阁 · 回蓝药补全',
    items: [
      '极品、仙品档新增「九转回灵丹」（回复65%灵力），与回血药九转还魂丹对称',
      '此前高稀有度只出回血药、不出回蓝药，现在两档都能抽到回蓝药',
    ],
  },
  {
    version: 'v27',
    date: '2026-08-19',
    title: '藏宝阁百连抽 · 八折',
    items: [
      '藏宝阁新增「百连抽」，一次 100 抽打八折（16000 灵石）',
      '百连结果按物品合并显示，并汇总各稀有度出货数量，一目了然',
    ],
  },
  {
    version: 'v26',
    date: '2026-08-19',
    title: '功法图鉴',
    items: [
      '修为面板新增「📖 功法图鉴」，一键查看全部功法',
      '按品阶（黄/玄/地/天/仙/神级）分组展示，标注被动/主动、宗门专属与习得状态',
    ],
  },
  {
    version: 'v25',
    date: '2026-08-19',
    title: '藏宝阁图鉴',
    items: [
      '藏宝阁新增「📖 图鉴」按钮，一键查看全部可抽取物品',
      '按稀有度分组展示武器、防具、鞋履、法宝与丹药，附概率与属性',
    ],
  },
  {
    version: 'v24',
    date: '2026-08-19',
    title: '鞋履装备 · 独立装备栏',
    items: [
      '新增第 4 个装备栏「鞋履」：鞋子可与武器、防具、法宝同时穿戴',
      '藏宝阁新增 6 双鞋：粗布鞋/牛皮靴/鹿皮靴/流云靴/风行靴/神行靴',
      '低阶鞋加物抗护足，高阶鞋加穿透显灵动，数值比同品级主装备更温和',
      '原有「粗布鞋」自动迁入鞋履栏，老档无缝衔接',
    ],
  },
  {
    version: 'v23',
    date: '2026-08-19',
    title: '战斗彩蛋 · 搞笑独白',
    items: [
      '小怪战斗随机触发搞笑独白：开场、出手、挨打三类，每场约 1~2 条',
      '致敬修仙流行梗：「莫欺少年穷」「此子恐怖如斯」「反派死于话多」等',
      'Boss、天劫、竞技斗法、心魔试炼不加彩蛋，保持原有氛围',
    ],
  },
  {
    version: 'v22',
    date: '2026-08-19',
    title: '战斗平衡调整',
    items: [
      '后期无限境界成长放缓：每层攻击增幅由 1.18 降为 1.10，境界越高越平缓',
      '转世加成减半：每次转世全属性 +10% 调整为 +5%',
      '玩家攻击系数整体下调 25%，打怪不再一招秒',
      '普通小怪血量对齐玩家攻击，至少需要数刀才能击杀',
    ],
  },
  {
    version: 'v21',
    date: '2026-08-19',
    title: '灵宠数值平衡',
    items: [
      '灵宠属性百分比加成整体下调约 1/3，后期不再过度放大',
      '灵宠升星加成由每星 +5% 调整为 +3%',
    ],
  },
  {
    version: 'v16',
    date: '2026-08-19',
    title: '灵宠经验系统',
    items: [
      '灵宠升级改为经验条：灵石/兽粮/灵兽丹喂食后积累经验，攒满自动升级',
      '升级经验按「100 × 等级²」递增，越往后越难，高等级更显珍贵',
      '灵石喂养：1 灵石 = 1 经验，点「升1级」自动补满当前所需',
      '兽粮 +40 经验、灵兽丹 +200 经验（老档已有等级自动保留转换）',
    ],
  },
  {
    version: 'v14',
    date: '2026-08-19',
    title: '灵宠机制调整',
    items: [
      '灵石喂养降价：由「等级×100」改为「100 + 等级×10」，高级不再昂贵',
      '灵兽丹效果由 +3 级下调为 +2 级，灵石喂养成为稳定升级手段',
      '新增宠物等级上限：按品质分档（废品30~神品100级），升星每星 +10 级上限',
      '到顶后灵宠无法继续喂食，需升星突破上限',
    ],
  },
  {
    version: 'v12',
    date: '2026-08-19',
    title: '灵宠升星 · 批量喂丹',
    items: [
      '灵宠升星：3 只同名同星灵宠合成 1 只更高星，每星全属性 +5%',
      '批量喂养：灵兽丹 / 兽粮可一次喂多颗，无需逐颗点击',
      '药王谷拜师改为一生一次，堵住重复刷丹药的漏洞',
      '修复渡劫界面玩家血条被文字遮挡的问题',
      '修复试炼秘境 19→20 层妖兽实力断层',
    ],
  },
  {
    version: 'v11',
    date: '2026-08-18',
    title: '宗门 · 竞技 · 心魔试炼',
    items: [
      '新增宗门系统：拜师入宗、宗门任务、狩猎历练',
      '新增竞技斗法：与诸修士切磋论道、一较高下',
      '新增心魔试炼：直面心魔、磨砺道心',
      '境界拓展：仙帝之后循环生成更高尊号',
      '新增转世重修、音效系统与玩法成就',
    ],
  },
];

// ========== 灵根设定 ==========
const LINGGEN = {
  metal:   { name: '金灵根', color: '#b8b8b8', skill: '金刃斩', manaPct: 0.20, desc: '破甲反伤：削弱敌方防御，并反震下一次伤害',
              skillText: '你催动金灵根，指尖凝聚出一道金芒，化作一柄无形利刃，破空而出！' },
  wood:    { name: '木灵根', color: '#5d8a4a', skill: '缠藤术', manaPct: 0.18, desc: '治疗控制：回复气血，并以藤蔓压制敌人攻势',
              skillText: '你脚下木灵气涌动，数道藤蔓自地面暴起，如毒蛇般缠向敌人！' },
  water:   { name: '水灵根', color: '#4a7a9a', skill: '水幕术', manaPct: 0.16, desc: '减伤治疗：回复气血，并凝聚水幕抵挡下一击',
              skillText: '你双手结印，水汽在身周汇聚成一道洪流，顺势席卷而去！' },
  fire:    { name: '火灵根', color: '#c25a2a', skill: '烈焰术', manaPct: 0.22, desc: '灼烧爆发：高额法术伤害，并令敌人持续燃烧',
              skillText: '你催动火灵根，一团灼热烈焰从掌心喷涌而出，所过之处空气都在扭曲！' },
  thunder: { name: '雷灵根', color: '#8a6ab8', skill: '天雷诀', manaPct: 0.25, desc: '暴击麻痹：高爆发雷击，有概率令敌人麻痹一回合',
              skillText: '你引动雷灵根，一道紫色雷光从天而降，劈在敌人身上，电弧四下炸开！' },
  sword:   { name: '剑灵根', color: '#c9a962', skill: '御剑术', manaPct: 0.22, desc: '连击穿透：剑气无视部分防御，并有概率追击',
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
  // ===== 飞升之后：仙域诸境（游戏不结束，战力持续增长） =====
  { name: '人仙',     max: 150000, atk: 3400, def: 660 },
  { name: '地仙',     max: 200000, atk: 4100, def: 780 },
  { name: '天仙',     max: 270000, atk: 4900, def: 920 },
  { name: '真仙',     max: 360000, atk: 5800, def: 1080 },
  { name: '金仙',     max: 480000, atk: 6900, def: 1260 },
  { name: '太乙金仙', max: 630000, atk: 8200, def: 1460 },
  { name: '大罗金仙', max: 820000, atk: 9600, def: 1690 },
  { name: '混元金仙', max: 1050000, atk: 11200, def: 1950 },
  { name: '仙王',     max: 1350000, atk: 13000, def: 2240 },
  { name: '仙帝',     max: 1750000, atk: 15000, def: 2560 },
];

// ========== 物品设定 ==========
const ITEMS = {
  zhixie_san:   { id: 'zhixie_san',   name: '止血散',     type: 'pill',     icon: '🌿', desc: '回复3%气血',     healPct: 0.03, sell: 10 },
  huiqi_pill:   { id: 'huiqi_pill',   name: '回气丹',     type: 'pill',     icon: '💊', desc: '回复5%气血',     healPct: 0.05, sell: 100 },
  huichun_pill: { id: 'huichun_pill', name: '回春丹',     type: 'pill',     icon: '💚', desc: '回复20%气血',    healPct: 0.20, sell: 400 },
  dahuan_pill:  { id: 'dahuan_pill',  name: '大还丹',     type: 'pill',     icon: '💛', desc: '回复45%气血',    healPct: 0.45, sell: 1600 },
  jiuzhuan_pill:{ id: 'jiuzhuan_pill',name: '九转还魂丹', type: 'pill',     icon: '✨', desc: '回复65%气血',    healPct: 0.65, sell: 5000 },
  ningling_san:  { id: 'ningling_san',  name: '凝灵散',     type: 'pill',     icon: '💠', desc: '回复3%灵力',     manaPct: 0.03, sell: 10 },
  huiling_pill:  { id: 'huiling_pill',  name: '回灵丹',     type: 'pill',     icon: '🔹', desc: '回复5%灵力',     manaPct: 0.05, sell: 100 },
  yuling_pill:   { id: 'yuling_pill',   name: '蕴灵丹',     type: 'pill',     icon: '🔷', desc: '回复20%灵力',    manaPct: 0.20, sell: 400 },
  dahuiling_pill:{ id: 'dahuiling_pill',name: '大回灵丹',   type: 'pill',     icon: '💎', desc: '回复45%灵力',    manaPct: 0.45, sell: 1600 },
  jiuzhuanling_pill:{ id: 'jiuzhuanling_pill', name: '九转回灵丹', type: 'pill', icon: '🌌', desc: '回复65%灵力', manaPct: 0.65, sell: 5000 },
  juqi_pill:    { id: 'juqi_pill',    name: '聚气丹',     type: 'pill',     icon: '🧪', desc: '获得50修为',      effect: 'xp50',   sell: 40 },
  tieyijia:     { id: 'tieyijia',     name: '铁衣甲',     type: 'armor', slot: 'armor', icon: '🛡️', desc: '防御+5',         effect: 'def5',   sell: 60 },
  mujian:       { id: 'mujian',       name: '木剑',       type: 'weapon',   icon: '🗡️', desc: '攻击+3',         effect: 'atk3',   sell: 15 },
  tiebi:        { id: 'tiebi',        name: '铁笔',       type: 'weapon',   icon: '✍️',  desc: '攻击+8',         effect: 'atk8',   sell: 75 },
  fengyuteng:   { id: 'fengyuteng',   name: '风语藤',     type: 'material', icon: '🌿', desc: '炼器材料',       effect: 'xp30',   sell: 8 },
  lieyangshi:   { id: 'lieyangshi',   name: '烈阳石',     type: 'material', icon: '🔶', desc: '炼器材料',       effect: 'xp80',   sell: 30 },
  hanbingxue:   { id: 'hanbingxue',   name: '寒冰雪',     type: 'material', icon: '❄️', desc: '炼丹材料',       effect: 'heal50', sell: 25 },
  yaowanggu_lingzhi:{ id:'yaowanggu_lingzhi',name:'药王谷灵草',type:'material',icon:'🌱', desc:'药草', effect:'heal80', sell: 20 },
  shanzhifu:    { id: 'shanzhifu',    name: '山贼符',     type: 'misc',     icon: '📜', desc: '似乎没什么用',   effect: null,    sell: 10 },
  dao_compass:  { id: 'dao_compass',  name: '问道罗盘',   type: 'misc',     icon: '🧭', desc: '感应机缘',       effect: 'dao10', sell: 100 },
  lianhua_meng: { id: 'lianhua_meng', name: '莲花盟令',   type: 'misc',     icon: '🌸', desc: '莲花盟信物',     effect: null,    sell: 50 },
  shouliang:    { id: 'shouliang',    name: '兽粮',       type: 'misc',     icon: '🥩', desc: '灵宠的口粮，使用可为出战灵宠增加40经验', effect: 'pet_food1', sell: 40 },
  lingshou_dan: { id: 'lingshou_dan', name: '灵兽丹',     type: 'misc',     icon: '💊', desc: '蕴含灵气的丹药，使用可为出战灵宠增加200经验', effect: 'pet_food3', sell: 200 },

  // ===== 灵宠零食（投其所好送对口味好感加倍） =====
  rougan:      { id: 'rougan',      name: '肉干',     type: 'misc', icon: '🍖', desc: '灵宠零食·肉食，投其所好好感加倍', favor: 6,  cat: 'food', taste: 'meat',  sell: 20 },
  xiangrou:    { id: 'xiangrou',    name: '香肉',     type: 'misc', icon: '🍗', desc: '灵宠零食·肉食，投其所好好感加倍', favor: 14, cat: 'food', taste: 'meat',  sell: 60 },
  longgan:     { id: 'longgan',     name: '龙肝凤髓', type: 'misc', icon: '🥩', desc: '灵宠零食·肉食，投其所好好感加倍', favor: 32, cat: 'food', taste: 'meat',  sell: 200 },
  yeguo:       { id: 'yeguo',       name: '野果',     type: 'misc', icon: '🍎', desc: '灵宠零食·果食，投其所好好感加倍', favor: 6,  cat: 'food', taste: 'fruit', sell: 20 },
  lingguo:     { id: 'lingguo',     name: '灵果',     type: 'misc', icon: '🍑', desc: '灵宠零食·果食，投其所好好感加倍', favor: 14, cat: 'food', taste: 'fruit', sell: 60 },
  zhuguo:      { id: 'zhuguo',      name: '朱果',     type: 'misc', icon: '🍒', desc: '灵宠零食·果食，投其所好好感加倍', favor: 32, cat: 'food', taste: 'fruit', sell: 200 },
  nencao:      { id: 'nencao',      name: '嫩草',     type: 'misc', icon: '🌿', desc: '灵宠零食·草食，投其所好好感加倍', favor: 6,  cat: 'food', taste: 'grass', sell: 20 },
  lingcao:     { id: 'lingcao',     name: '灵草',     type: 'misc', icon: '🌱', desc: '灵宠零食·草食，投其所好好感加倍', favor: 14, cat: 'food', taste: 'grass', sell: 60 },
  xianzhicao:  { id: 'xianzhicao',  name: '仙芝草',   type: 'misc', icon: '🍀', desc: '灵宠零食·草食，投其所好好感加倍', favor: 32, cat: 'food', taste: 'grass', sell: 200 },

  // ===== 灵宠装饰（投其所好送对风格好感加倍） =====
  tongling:    { id: 'tongling',    name: '铜铃',     type: 'misc', icon: '🔔', desc: '灵宠饰品·铃铛，投其所好好感加倍', favor: 7,  cat: 'decor', style: 'bell',   sell: 25 },
  yinling:     { id: 'yinling',     name: '银铃',     type: 'misc', icon: '🎐', desc: '灵宠饰品·铃铛，投其所好好感加倍', favor: 16, cat: 'decor', style: 'bell',   sell: 75 },
  xianyinling: { id: 'xianyinling', name: '仙音铃',   type: 'misc', icon: '🎼', desc: '灵宠饰品·铃铛，投其所好好感加倍', favor: 36, cat: 'decor', style: 'bell',   sell: 250 },
  cuchou:      { id: 'cuchou',      name: '粗绸',     type: 'misc', icon: '🎀', desc: '灵宠饰品·绸带，投其所好好感加倍', favor: 7,  cat: 'decor', style: 'ribbon', sell: 25 },
  jinduan:     { id: 'jinduan',     name: '锦缎',     type: 'misc', icon: '🎗️', desc: '灵宠饰品·绸带，投其所好好感加倍', favor: 16, cat: 'decor', style: 'ribbon', sell: 75 },
  yunxiaduan:  { id: 'yunxiaduan',  name: '云霞缎',   type: 'misc', icon: '🧣', desc: '灵宠饰品·绸带，投其所好好感加倍', favor: 36, cat: 'decor', style: 'ribbon', sell: 250 },
  muzhu:       { id: 'muzhu',       name: '木珠',     type: 'misc', icon: '📿', desc: '灵宠饰品·宝珠，投其所好好感加倍', favor: 7,  cat: 'decor', style: 'gem',    sell: 25 },
  yuzhu:       { id: 'yuzhu',       name: '玉珠',     type: 'misc', icon: '💍', desc: '灵宠饰品·宝珠，投其所好好感加倍', favor: 16, cat: 'decor', style: 'gem',    sell: 75 },
  yemingzhu:   { id: 'yemingzhu',   name: '夜明珠',   type: 'misc', icon: '💠', desc: '灵宠饰品·宝珠，投其所好好感加倍', favor: 36, cat: 'decor', style: 'gem',    sell: 250 },

  // ===== 抽卡装备（稀有度分层，越高越稀有） =====
  g_qingfeng:  { id: 'g_qingfeng',   name: '青锋剑',    type: 'weapon', icon: '🗡️', desc: '凡品·攻击+15',  effect: 'atk15',   sell: 30,   rarity: '凡品' },
  g_qingbu:    { id: 'g_qingbu',     name: '青布衣',    type: 'armor', slot: 'armor', icon: '🛡️', desc: '凡品·防御+10',  effect: 'def10',   sell: 30,   rarity: '凡品' },
  g_jinggang:  { id: 'g_jinggang',   name: '精钢剑',    type: 'weapon', icon: '🗡️', desc: '良品·攻击+30',  effect: 'atk30',   sell: 70,   rarity: '良品' },
  g_suozijia:  { id: 'g_suozijia',   name: '锁子甲',    type: 'armor', slot: 'armor', icon: '🛡️', desc: '良品·防御+20',  effect: 'def20',   sell: 70,   rarity: '良品' },
  g_lingwen:   { id: 'g_lingwen',    name: '灵纹剑',    type: 'weapon', icon: '🗡️', desc: '中品·攻击+60',  effect: 'atk60',   sell: 180,  rarity: '中品' },
  g_lingwenjia:{ id: 'g_lingwenjia', name: '灵纹甲',    type: 'armor', slot: 'armor', icon: '🛡️', desc: '中品·防御+40',  effect: 'def40',   sell: 180,  rarity: '中品' },
  g_xuantie:   { id: 'g_xuantie',    name: '玄铁重剑',  type: 'weapon', icon: '⚔️', desc: '上品·攻击+120', effect: 'atk120',  sell: 450,  rarity: '上品' },
  g_xuantiejia:{ id: 'g_xuantiejia', name: '玄铁甲',    type: 'armor', slot: 'armor', icon: '🛡️', desc: '上品·防御+80',  effect: 'def80',   sell: 450,  rarity: '上品' },
  g_chixiao:   { id: 'g_chixiao',    name: '赤霄剑',    type: 'weapon', icon: '⚔️', desc: '极品·攻击+240', effect: 'atk240',  sell: 1100, rarity: '极品' },
  g_chiyanjia: { id: 'g_chiyanjia',  name: '赤焰甲',    type: 'armor', slot: 'armor', icon: '🛡️', desc: '极品·防御+150', effect: 'def150',  sell: 1100, rarity: '极品' },
  g_zhuxian:   { id: 'g_zhuxian',    name: '诛仙剑',    type: 'weapon', icon: '🗡️', desc: '仙品·攻击+500', effect: 'atk500',  sell: 2500, rarity: '仙品' },
  g_xianlingjia:{id: 'g_xianlingjia',name: '仙灵甲',    type: 'armor', slot: 'armor', icon: '🛡️', desc: '仙品·防御+300', effect: 'def300',  sell: 2500, rarity: '仙品' },

  // ===== 抽卡装备（第二批：更多武器/防具） =====
  g_taomu:     { id: 'g_taomu',      name: '桃木剑',    type: 'weapon', icon: '🗡️', desc: '凡品·攻击+12',  effect: 'atk12',   sell: 30,   rarity: '凡品' },
  g_cubu:      { id: 'g_cubu',       name: '粗布鞋',    type: 'armor', slot: 'shoes', icon: '👟', desc: '凡品·防御+8',   effect: 'def8',    sell: 30,   rarity: '凡品' },
  g_tiejidao:  { id: 'g_tiejidao',   name: '铁脊刀',    type: 'weapon', icon: '🔪', desc: '良品·攻击+28',  effect: 'atk28',   sell: 70,   rarity: '良品' },
  g_niupijia:  { id: 'g_niupijia',   name: '牛皮甲',    type: 'armor', slot: 'armor', icon: '🛡️', desc: '良品·防御+18',  effect: 'def18',   sell: 70,   rarity: '良品' },
  g_hantieqiang:{id: 'g_hantieqiang',name: '寒铁枪',    type: 'weapon', icon: '🔱', desc: '中品·攻击+55',  effect: 'atk55',   sell: 180,  rarity: '中品' },
  g_jinsijia:  { id: 'g_jinsijia',   name: '金丝甲',    type: 'armor', slot: 'armor', icon: '🛡️', desc: '中品·防御+35',  effect: 'def35',   sell: 180,  rarity: '中品' },
  g_zixiaodao: { id: 'g_zixiaodao',  name: '紫霄刀',    type: 'weapon', icon: '🔪', desc: '上品·攻击+110', effect: 'atk110',  sell: 450,  rarity: '上品' },
  g_yudaijia:  { id: 'g_yudaijia',   name: '玉带甲',    type: 'armor', slot: 'armor', icon: '🛡️', desc: '上品·防御+75',  effect: 'def75',   sell: 450,  rarity: '上品' },
  g_longyuanqiang:{id:'g_longyuanqiang',name:'龙渊枪',  type: 'weapon', icon: '🔱', desc: '极品·攻击+220', effect: 'atk220',  sell: 1100, rarity: '极品' },
  g_tiancanjia:{ id: 'g_tiancanjia', name: '天蚕甲',    type: 'armor', slot: 'armor', icon: '🛡️', desc: '极品·防御+140', effect: 'def140',  sell: 1100, rarity: '极品' },
  g_xuanyuan:  { id: 'g_xuanyuan',   name: '轩辕剑',    type: 'weapon', icon: '⚔️', desc: '仙品·攻击+480', effect: 'atk480',  sell: 2500, rarity: '仙品' },
  g_hundunjia: { id: 'g_hundunjia',  name: '混沌甲',    type: 'armor', slot: 'armor', icon: '🛡️', desc: '仙品·防御+280', effect: 'def280',  sell: 2500, rarity: '仙品' },

  // ===== 抽卡装备（第三批：更多仙品类型） =====
  g_zhanxiandao: { id: 'g_zhanxiandao', name: '斩仙刀',  type: 'weapon', icon: '🔪', desc: '仙品·攻击+495', effect: 'atk495', sell: 2500, rarity: '仙品' },
  g_shishenqiang:{ id: 'g_shishenqiang',name: '弑神枪',  type: 'weapon', icon: '🔱', desc: '仙品·攻击+515', effect: 'atk515', sell: 2500, rarity: '仙品' },
  g_dashenbian: { id: 'g_dashenbian',  name: '打神鞭',  type: 'weapon', icon: '⚡', desc: '仙品·法攻+505', effect: 'matk505', sell: 2500, rarity: '仙品' },
  g_taijitu:    { id: 'g_taijitu',     name: '太极图',  type: 'armor', slot: 'armor', icon: '☯️', desc: '仙品·法抗+320', effect: 'mdef320', sell: 2500, rarity: '仙品' },
  g_zishou:     { id: 'g_zishou',      name: '紫绶仙衣',type: 'armor', slot: 'armor', icon: '👘', desc: '仙品·法抗+305', effect: 'mdef305', sell: 2500, rarity: '仙品' },
  // ===== 神品法宝：装备于独立法宝栏，可从藏宝阁神品档抽取 =====
  g_hundunzhong:{ id: 'g_hundunzhong', name: '混沌钟',  type: 'artifact', slot: 'artifact', icon: '🔔', desc: '神品·定身一回合（冷却10回合）', effect: null, special: 'stun', specialCd: 10, sell: 8000, rarity: '神品' },
  g_qiankunding: { id: 'g_qiankunding', name: '乾坤鼎', type: 'artifact', slot: 'artifact', icon: '🏺', desc: '神品·回复30%气血与30%灵力（冷却8回合）', effect: null, special: 'heal_mana', specialCd: 8, sell: 8000, rarity: '神品' },
  g_fuxiqin:     { id: 'g_fuxiqin', name: '伏羲琴', type: 'artifact', slot: 'artifact', icon: '🎼', desc: '神品·令敌方下次攻击失效（冷却8回合）', effect: null, special: 'weaken', specialCd: 8, sell: 8000, rarity: '神品' },
  g_shennongding:{ id: 'g_shennongding', name: '神农鼎', type: 'artifact', slot: 'artifact', icon: '⚗️', desc: '神品·回复50%气血（冷却10回合）', effect: null, special: 'heal', specialCd: 10, sell: 8000, rarity: '神品' },

  // ===== 抽卡装备（第四批：法攻/法抗/穿透） =====
  g_xuanmuzhang: { id: 'g_xuanmuzhang', name: '玄木杖',  type: 'weapon', icon: '🪄', desc: '中品·法攻+58',   effect: 'matk58',  sell: 180,  rarity: '中品' },
  g_yanlingzhu:  { id: 'g_yanlingzhu',  name: '炎灵珠',  type: 'weapon', icon: '🔮', desc: '上品·法攻+115',  effect: 'matk115', sell: 450,  rarity: '上品' },
  g_wuleizhu:    { id: 'g_wuleizhu',    name: '五雷珠',  type: 'weapon', icon: '⚡', desc: '极品·法攻+225',  effect: 'matk225', sell: 1100, rarity: '极品' },
  g_susefapao:   { id: 'g_susefapao',   name: '素色法袍',type: 'armor', slot: 'armor', icon: '🥼', desc: '中品·法抗+38',   effect: 'mdef38',  sell: 180,  rarity: '中品' },
  g_yunwenfapao: { id: 'g_yunwenfapao', name: '云纹法袍',type: 'armor', slot: 'armor', icon: '👘', desc: '上品·法抗+78',   effect: 'mdef78',  sell: 450,  rarity: '上品' },
  g_tianluofapao:{ id: 'g_tianluofapao',name: '天罗法袍',type: 'armor', slot: 'armor', icon: '🧥', desc: '极品·法抗+145',  effect: 'mdef145', sell: 1100, rarity: '极品' },
  g_pojiazhui:   { id: 'g_pojiazhui',   name: '破甲锥',  type: 'weapon', icon: '🗡️', desc: '中品·穿透+25',  effect: 'pen25',   sell: 180,  rarity: '中品' },
  g_chuanxinci:  { id: 'g_chuanxinci',  name: '穿心刺',  type: 'weapon', icon: '💉', desc: '上品·穿透+55',  effect: 'pen55',   sell: 450,  rarity: '上品' },
  g_pojunzhui:   { id: 'g_pojunzhui',   name: '破军锥',  type: 'weapon', icon: '🔱', desc: '极品·穿透+110', effect: 'pen110',  sell: 1100, rarity: '极品' },
  g_zhuxianzhui: { id: 'g_zhuxianzhui', name: '诛仙锥',  type: 'weapon', icon: '💠', desc: '仙品·穿透+150', effect: 'pen150',  sell: 2500, rarity: '仙品' },

  // ===== 抽卡装备（鞋子：独立装备栏「鞋履」，与衣服可同时穿戴） =====
  g_niupixue:   { id: 'g_niupixue',    name: '牛皮靴',  type: 'armor', slot: 'shoes', icon: '👢', desc: '良品·防御+16',  effect: 'def16',   sell: 70,   rarity: '良品' },
  g_lupixue:    { id: 'g_lupixue',     name: '鹿皮靴',  type: 'armor', slot: 'shoes', icon: '🥾', desc: '中品·防御+32',  effect: 'def32',   sell: 180,  rarity: '中品' },
  g_liuyunxue:  { id: 'g_liuyunxue',   name: '流云靴',  type: 'armor', slot: 'shoes', icon: '👞', desc: '上品·穿透+50',  effect: 'pen50',   sell: 450,  rarity: '上品' },
  g_fengxingxue:{ id: 'g_fengxingxue', name: '风行靴',  type: 'armor', slot: 'shoes', icon: '🥿', desc: '极品·穿透+95',  effect: 'pen95',   sell: 1100, rarity: '极品' },
  g_shenxingxue:{ id: 'g_shenxingxue', name: '神行靴',  type: 'armor', slot: 'shoes', icon: '👟', desc: '仙品·穿透+130', effect: 'pen130',  sell: 2500, rarity: '仙品' },

  // ===== 囤囤鼠私藏（仅能由囤囤鼠 0.001% 概率偷 Boss 获得，无其他获取途径） =====
  tun_tushenjian: { id: 'tun_tushenjian', name: '屠神剑', type: 'weapon', icon: '⚔️', desc: '神藏·攻击+600（囤囤鼠偷自Boss的私藏，仅此途径）', effect: 'atk600', sell: 8000, rarity: '神品' },
  tun_canglongqiang:{ id: 'tun_canglongqiang', name: '苍龙枪', type: 'weapon', icon: '🐉', desc: '神藏·法攻+600（囤囤鼠偷自Boss的私藏，仅此途径）', effect: 'matk600', sell: 8000, rarity: '神品' },
  tun_hunyuanjia: { id: 'tun_hunyuanjia', name: '混元圣甲', type: 'armor', slot: 'armor', icon: '🛡️', desc: '神藏·物抗+360（囤囤鼠偷自Boss的私藏，仅此途径）', effect: 'def360', sell: 8000, rarity: '神品' },
  tun_tianxuanjia: { id: 'tun_tianxuanjia', name: '天玄法衣', type: 'armor', slot: 'armor', icon: '👘', desc: '神藏·法抗+360（囤囤鼠偷自Boss的私藏，仅此途径）', effect: 'mdef360', sell: 8000, rarity: '神品' },
  tun_xinglongxue: { id: 'tun_xinglongxue', name: '星龙靴', type: 'armor', slot: 'shoes', icon: '👢', desc: '神藏·穿透+250（囤囤鼠偷自Boss的私藏，仅此途径）', effect: 'pen250', sell: 8000, rarity: '神品' },

  // ===== 抽卡废品（抽空产物，只能卖几灵石） =====
  shuzhi:  { id: 'shuzhi',  name: '枯树枝', type: 'misc', icon: '🌿', desc: '路边捡的，没什么用', effect: null, sell: 3 },
  shitou:  { id: 'shitou',  name: '碎石子', type: 'misc', icon: '🪨', desc: '随处可见的石头',     effect: null, sell: 5 },
  pobu:    { id: 'pobu',    name: '破布片', type: 'misc', icon: '🧵', desc: '破破烂烂的布',       effect: null, sell: 4 },
  lanyez:  { id: 'lanyez',  name: '烂叶子', type: 'misc', icon: '🍂', desc: '已经枯萎发黄',       effect: null, sell: 2 },
  powan:   { id: 'powan',   name: '破陶碗', type: 'misc', icon: '🥣', desc: '缺了个口',           effect: null, sell: 3 },
};

// ========== 抽卡池（藏宝阁） ==========
const GACHA_COST = 200;
const GACHA_PITY = 100; // 仙品保底：每100抽必出一次
const GACHA_POOL = [
  { rarity: '废品', weight: 36, color: '#7a7a7a', items: [
    'shuzhi', 'shitou', 'pobu', 'lanyez', 'powan',
  ]},
  { rarity: '凡品', weight: 30, color: '#c9c9c9', items: [
    'g_qingfeng', 'g_taomu', 'g_qingbu', 'g_cubu',
    { id: 'huiqi_pill', count: 3 }, { id: 'huiling_pill', count: 3 }, { id: 'juqi_pill', count: 2 },
  ]},
  { rarity: '良品', weight: 17, color: '#4caf50', items: [
    'g_jinggang', 'g_tiejidao', 'g_suozijia', 'g_niupijia', 'g_niupixue',
    { id: 'huichun_pill', count: 2 }, { id: 'yuling_pill', count: 2 }, { id: 'juqi_pill', count: 4 },
  ]},
  { rarity: '中品', weight: 10, color: '#4a90d9', items: [
    'g_lingwen', 'g_hantieqiang', 'g_lingwenjia', 'g_jinsijia',
    'g_xuanmuzhang', 'g_susefapao', 'g_pojiazhui', 'g_lupixue',
    { id: 'dahuan_pill', count: 1 }, { id: 'dahuiling_pill', count: 1 }, { id: 'juqi_pill', count: 6 },
  ]},
  { rarity: '上品', weight: 5, color: '#9b59b6', items: [
    'g_xuantie', 'g_zixiaodao', 'g_xuantiejia', 'g_yudaijia',
    'g_yanlingzhu', 'g_yunwenfapao', 'g_chuanxinci', 'g_liuyunxue',
    { id: 'jiuzhuan_pill', count: 1 }, { id: 'jiuzhuanling_pill', count: 1 },
  ]},
  { rarity: '极品', weight: 1.5, color: '#e6a23c', items: [
    'g_chixiao', 'g_longyuanqiang', 'g_chiyanjia', 'g_tiancanjia',
    'g_wuleizhu', 'g_tianluofapao', 'g_pojunzhui', 'g_fengxingxue',
    { id: 'jiuzhuan_pill', count: 2 }, { id: 'jiuzhuanling_pill', count: 2 },
  ]},
  { rarity: '仙品', weight: 0.45, color: '#e0473c', items: [
    'g_zhuxian', 'g_xuanyuan', 'g_zhanxiandao', 'g_shishenqiang', 'g_dashenbian',
    'g_xianlingjia', 'g_hundunjia', 'g_taijitu', 'g_zishou',
    'g_zhuxianzhui', 'g_shenxingxue',
    { id: 'jiuzhuan_pill', count: 3 }, { id: 'jiuzhuanling_pill', count: 3 },
  ]},
  { rarity: '神品', weight: 0.05, color: '#ffd54f', items: [
    'g_hundunzhong', 'g_qiankunding', 'g_fuxiqin', 'g_shennongding',
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
  { id: 'boss_honghuang', name: '洪荒祖兽',   desc: '斩杀洪荒祖兽',           icon: '🦁' },
  { id: 'boss_tiandao',   name: '天道化身',   desc: '击败天道化身',           icon: '☁️' },
  { id: 'boss_chaos',     name: '混沌元灵',   desc: '斩灭混沌元灵',           icon: '🌀' },
  // ===== 洞府 / 宗门 / 竞技 / 心魔玩法成就 =====
  { id: 'cave_harvest', name: '春华秋实',   desc: '首次收获洞府灵药',         icon: '🌿' },
  { id: 'cave_lv3',     name: '初具规模',   desc: '洞府升到 3 级',             icon: '🏠' },
  { id: 'cave_lv7',     name: '仙府落成',   desc: '洞府升到满级 7 级',         icon: '🏯' },
  { id: 'sect_join',    name: '拜入山门',   desc: '加入一个宗门',               icon: '🏛️' },
  { id: 'sect_contrib', name: '中流砥柱',   desc: '宗门贡献达到 300',           icon: '🎖️' },
  { id: 'arena_win10',  name: '斗法新秀',   desc: '竞技斗法获胜 10 场',         icon: '⚔️' },
  { id: 'arena_tier',   name: '斗法扬名',   desc: '斗法段位达到金丹斗尊',       icon: '🏆' },
  { id: 'xinmo_win',    name: '斩却心魔',   desc: '首次斩灭心魔化身',           icon: '🖤' },
  { id: 'xinjing_100',  name: '心如止水',   desc: '心境达到 100',               icon: '🧘' },
  { id: 'tuntun_theft', name: '鼠鼠立大功', desc: '囤囤鼠偷走Boss的私藏神装',   icon: '🐹', title: '妙手神偷' },
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
    desc: '山林间最不起眼的小灵兽。', likes: { food: 'fruit', decor: 'bell' } },
  huitu: { id: 'huitu', name: '灰兔', icon: '🐰', quality: '废品', qc: '#7a7a7a',
    base: { atk: 1, matk: 1, def: 1, mdef: 1, pen: 0 },
    growth: { atk: 1, matk: 1, def: 1, mdef: 1, pen: 0 },
    skill: '蹬腿', skillChance: 0.10, skillMult: 1.1,
    desc: '机警的小灰兔，速度飞快。', likes: { food: 'grass', decor: 'bell' } },
  // 凡品
  xiaobaihu: { id: 'xiaobaihu', name: '小白狐', icon: '🦊', quality: '凡品', qc: '#c9c9c9',
    base: { atk: 4, matk: 4, def: 2, mdef: 2, pen: 0 },
    growth: { atk: 2, matk: 2, def: 1, mdef: 1, pen: 0 },
    skill: '狐火', skillChance: 0.18, skillMult: 1.3,
    desc: '通体雪白的小狐狸，性情温顺，口吐狐火。', likes: { food: 'fruit', decor: 'ribbon' } },
  qingshe: { id: 'qingshe', name: '青蛇', icon: '🐍', quality: '凡品', qc: '#c9c9c9',
    base: { atk: 5, matk: 3, def: 2, mdef: 2, pen: 0 },
    growth: { atk: 2, matk: 2, def: 1, mdef: 1, pen: 0 },
    skill: '毒牙', skillChance: 0.15, skillMult: 1.3,
    desc: '通体青碧的灵蛇，毒牙锋利。', likes: { food: 'meat', decor: 'gem' } },
  // 良品
  xuanwu: { id: 'xuanwu', name: '玄龟', icon: '🐢', quality: '良品', qc: '#4caf50',
    base: { atk: 3, matk: 3, def: 10, mdef: 7, pen: 0 },
    growth: { atk: 1, matk: 1, def: 4, mdef: 3, pen: 0 },
    skill: '玄龟冲撞', skillChance: 0.15, skillMult: 1.5,
    desc: '背负玄甲的灵龟，防御无双，坚不可摧。', likes: { food: 'grass', decor: 'gem' } },
  linglu: { id: 'linglu', name: '灵鹿', icon: '🦌', quality: '良品', qc: '#4caf50',
    base: { atk: 4, matk: 7, def: 4, mdef: 4, pen: 0 },
    growth: { atk: 2, matk: 3, def: 2, mdef: 2, pen: 0 },
    skill: '灵角', skillChance: 0.18, skillMult: 1.4,
    desc: '头顶灵角的灵鹿，通体灵光。', likes: { food: 'grass', decor: 'ribbon' } },
  // 中品
  huoya: { id: 'huoya', name: '火鸦', icon: '🦅', quality: '中品', qc: '#4a90d9',
    base: { atk: 8, matk: 10, def: 4, mdef: 4, pen: 1 },
    growth: { atk: 3, matk: 4, def: 2, mdef: 2, pen: 0 },
    skill: '火羽', skillChance: 0.20, skillMult: 1.5,
    desc: '浑身燃着赤焰的火鸦，鸣声如雷。', likes: { food: 'meat', decor: 'bell' } },
  baiyuan: { id: 'baiyuan', name: '白猿', icon: '🐒', quality: '中品', qc: '#4a90d9',
    base: { atk: 10, matk: 6, def: 7, mdef: 5, pen: 1 },
    growth: { atk: 4, matk: 3, def: 3, mdef: 2, pen: 0 },
    skill: '猿啸', skillChance: 0.18, skillMult: 1.5,
    desc: '通臂白猿，力大无穷。', likes: { food: 'fruit', decor: 'bell' } },
  // 上品
  baihu: { id: 'baihu', name: '白虎', icon: '🐯', quality: '上品', qc: '#9b59b6',
    base: { atk: 15, matk: 10, def: 8, mdef: 7, pen: 3 },
    growth: { atk: 5, matk: 4, def: 3, mdef: 3, pen: 1 },
    skill: '虎啸', skillChance: 0.20, skillMult: 1.6,
    desc: '西方庚金白虎，主杀伐，威震山野。', likes: { food: 'meat', decor: 'bell' } },
  jinpeng: { id: 'jinpeng', name: '金鹏', icon: '🦜', quality: '上品', qc: '#9b59b6',
    base: { atk: 13, matk: 15, def: 7, mdef: 8, pen: 3 },
    growth: { atk: 5, matk: 5, def: 3, mdef: 3, pen: 1 },
    skill: '金翅', skillChance: 0.20, skillMult: 1.6,
    desc: '展翅千里的大鹏，金羽遮天。', likes: { food: 'meat', decor: 'ribbon' } },
  // 极品
  qinglong: { id: 'qinglong', name: '青龙', icon: '🐉', quality: '极品', qc: '#e6a23c',
    base: { atk: 22, matk: 17, def: 11, mdef: 10, pen: 6 },
    growth: { atk: 7, matk: 6, def: 4, mdef: 4, pen: 2 },
    skill: '龙息', skillChance: 0.22, skillMult: 1.8,
    desc: '东方苍龙，龙威浩荡，睥睨天下。', likes: { food: 'meat', decor: 'gem' } },
  huofeng: { id: 'huofeng', name: '火凤', icon: '🦚', quality: '极品', qc: '#e6a23c',
    base: { atk: 18, matk: 24, def: 9, mdef: 11, pen: 6 },
    growth: { atk: 6, matk: 8, def: 3, mdef: 4, pen: 2 },
    skill: '凤炎', skillChance: 0.22, skillMult: 1.8,
    desc: '浴火而生的火凤，烈焰滔天。', likes: { food: 'fruit', decor: 'ribbon' } },
  // 神品（最高，龙与凤凰）
  shenlong: { id: 'shenlong', name: '神龙', icon: '🐲', quality: '神品', qc: '#e0473c', affinity: 'attack',
    base: { atk: 32, matk: 28, def: 16, mdef: 15, pen: 10 },
    growth: { atk: 10, matk: 9, def: 5, mdef: 5, pen: 3 },
    skill: '神龙吐息', skillChance: 0.25, skillMult: 2.2,
    desc: '九天之上的神龙，俯瞰众生，威压万物。', likes: { food: 'meat', decor: 'gem' } },
  fenghuang: { id: 'fenghuang', name: '凤凰', icon: '🦩', quality: '神品', qc: '#e0473c', affinity: 'guard',
    base: { atk: 28, matk: 32, def: 14, mdef: 17, pen: 10 },
    growth: { atk: 9, matk: 10, def: 5, mdef: 6, pen: 3 },
    skill: '涅槃', skillChance: 0.25, skillMult: 2.2,
    desc: '百鸟之王的凤凰，浴火涅槃，不死不灭。', likes: { food: 'fruit', decor: 'ribbon' } },
  tuntunshu: { id: 'tuntunshu', name: '囤囤鼠', icon: '🐹', quality: '神品', qc: '#e0473c', affinity: 'guard',
    base: { atk: 20, matk: 20, def: 18, mdef: 16, pen: 8 },
    growth: { atk: 6, matk: 6, def: 6, mdef: 5, pen: 2 },
    skill: '囤粮遁', skillChance: 0.20, skillMult: 1.0,
    desc: '神品灵兽，天生敛财囤粮。战斗中能叼着主人躲开攻击，战后顺手牵羊偷灵石材料，极低概率连Boss的掉落都能顺走。', likes: { food: 'fruit', decor: 'gem' } },
};

// 灵宠抽奖池（爆率参照藏宝阁：weight 为概率权重）
const PET_GACHA_COST = 200;
const PET_GACHA_PITY = 300; // 神品保底：每300抽必出一次
const PET_GACHA_POOL = [
  { rarity: '废品',   weight: 26,  color: '#7a7a7a', items: ['lingshu', 'huitu'] },
  { rarity: '凡品',   weight: 21,  color: '#c9c9c9', items: ['xiaobaihu', 'qingshe'] },
  { rarity: '良品',   weight: 13,  color: '#4caf50', items: ['xuanwu', 'linglu'] },
  { rarity: '中品',   weight: 8.5, color: '#4a90d9', items: ['huoya', 'baiyuan'] },
  { rarity: '上品',   weight: 4,   color: '#9b59b6', items: ['baihu', 'jinpeng'] },
  { rarity: '极品',   weight: 1.2, color: '#e6a23c', items: ['qinglong', 'huofeng'] },
  { rarity: '神品',   weight: 0.5, color: '#e0473c', items: ['shenlong', 'fenghuang', 'tuntunshu'] },
  { rarity: '兽粮',   weight: 17,  color: '#d4a76a', items: ['shouliang'], type: 'item' },
  { rarity: '灵兽丹', weight: 8.8, color: '#ffd54f', items: ['lingshou_dan'], type: 'item' },
];
// 灵宠好感度：送零食/装饰品投其所好叠加好感，好感提升灵宠放技能概率
const PET_FAVOR_MAX = 20;             // 好感等级上限
const PET_FAVOR_EXP_PER_LEVEL = 100;  // 每级所需好感进度（进度满 +1 级）
// 囤囤鼠专属被动：闪避 + 战后偷取
const TUNTUNSHU_DODGE_BASE = 0.06;        // 基础闪避率
const TUNTUNSHU_DODGE_PER_STAGE = 0.02;   // 每阶 +2%
const TUNTUNSHU_DODGE_FAVOR_MAX = 0.10;   // 满好感额外 +10%
const TUNTUNSHU_DODGE_CAP = 0.30;         // 闪避率封顶
const TUNTUNSHU_STEAL_CHANCE = 0.40;      // 战后偷灵石/材料的概率
const TUNTUNSHU_STEAL_STONE_PCT = 0.30;   // 偷取本场灵石的 30%
const TUNTUNSHU_BOSS_STEAL_CHANCE = 0.00001; // 偷 Boss 掉落装备的概率（0.001%，极稀有）
// 囤囤鼠专属 Boss 遗宝（唯一获取途径 = 囤囤鼠偷 Boss，不进入任何转盘/掉落/商店）
const TUNTUNSHU_BOSS_LOOT = ['tun_tushenjian', 'tun_canglongqiang', 'tun_hunyuanjia', 'tun_tianxuanjia', 'tun_xinglongxue'];
// 可偷神藏的中后期 Boss（仅这些 Boss 能被囤囤鼠偷走神藏，早期/秘境 Boss 不在此列）
const TUNTUNSHU_STEAL_BOSSES = ['taowu', 'hundun', 'qiongchi_fiend', 'zhulong', 'demon_lord', 'tianmo', 'mojun', 'honghuang_shou', 'tian_dao', 'chaos_yuanling'];
// 灵宠零食/装饰转盘（分稀有度档，送对口味/风格好感加倍）
const PET_TREAT_COST = 100;
const PET_TREAT_POOL = [
  { rarity: '凡品', weight: 40, color: '#c9c9c9', items: ['rougan', 'yeguo', 'nencao', 'tongling', 'cuchou', 'muzhu'] },
  { rarity: '精制', weight: 28, color: '#4a90d9', items: ['xiangrou', 'lingguo', 'lingcao', 'yinling', 'jinduan', 'yuzhu'] },
  { rarity: '仙品', weight: 10, color: '#e0473c', items: ['longgan', 'zhuguo', 'xianzhicao', 'xianyinling', 'yunxiaduan', 'yemingzhu'] },
  { rarity: '兽粮', weight: 14, color: '#d4a76a', items: ['shouliang'], type: 'item' },
  { rarity: '灵兽丹', weight: 8, color: '#ffd54f', items: ['lingshou_dan'], type: 'item' },
];
// 品质档位（用于比较强弱）与重复抽到的灵石补偿
const PET_QUALITY_RANK = { '废品': 0, '凡品': 1, '良品': 2, '中品': 3, '上品': 4, '极品': 5, '神品': 6 };
const PET_REFUND = { '废品': 10, '凡品': 30, '良品': 60, '中品': 120, '上品': 250, '极品': 600, '神品': 1500 };
// 灵宠升星消耗（每次升星消耗的灵石，按品质分档：低阶便宜、高阶昂贵）
const PET_STAR_COST = { '废品': 20, '凡品': 50, '良品': 100, '中品': 200, '上品': 400, '极品': 800, '神品': 1500 };
// 宠物等级上限（按品质分档），升星每 +1 星额外 +10 级上限
const PET_MAX_LEVEL = { '废品': 30, '凡品': 40, '良品': 50, '中品': 60, '上品': 70, '极品': 80, '神品': 100 };
// 双轨成长：固定属性照常随等级增长，百分比属性取决于主人基础属性；品质越高，系数与技能强度越高。
const PET_QUALITY_GROWTH = {
  '废品': { pct: 0.002, skillChance: 0.70, skillPower: 0.72 },
  '凡品': { pct: 0.004, skillChance: 0.82, skillPower: 0.82 },
  '良品': { pct: 0.007, skillChance: 0.94, skillPower: 0.94 },
  '中品': { pct: 0.010, skillChance: 1.06, skillPower: 1.06 },
  '上品': { pct: 0.015, skillChance: 1.18, skillPower: 1.18 },
  '极品': { pct: 0.021, skillChance: 1.32, skillPower: 1.32 },
  '神品': { pct: 0.030, skillChance: 1.48, skillPower: 1.48 },
};
// 神品灵宠出生时随机获得一个天赋；天赋数值仅在每十级进阶时提高。
const DIVINE_PET_TRAITS = {
  shield: { id: 'shield', name: '护主灵盾', desc: '战斗开始时为主人施加护盾' },
  mana: { id: 'mana', name: '灵息回潮', desc: '战斗开始时为主人回复灵力' },
  follow: { id: 'follow', name: '神兽协攻', desc: '主人攻击后有概率追加一击' },
  resist: { id: 'resist', name: '神佑护体', desc: '主人受到的伤害降低' },
};

// ========== 功法设定 ==========
// 功法分两类：type 被动属性加成（atk/matk/def/mdef/pen/hp），combat 战斗主动技能（mult 倍率/cd 冷却）
const GONGFA = {
  // ---- 被动功法 ----
  gong_tiebushan:  { id: 'gong_tiebushan',  name: '铁布衫',     grade: '黄级', icon: '🛡️', color: '#9aa0a6', desc: '被动·物抗+30',   type: 'def',  value: 30 },
  gong_hunyuan:    { id: 'gong_hunyuan',    name: '混元功',     grade: '黄级', icon: '🌀', color: '#9aa0a6', desc: '被动·物攻+25',   type: 'atk',  value: 25 },
  gong_qingsong:   { id: 'gong_qingsong',   name: '青松诀',     grade: '玄级', icon: '🌲', color: '#4caf50', desc: '被动·气血+600',  type: 'hp',   value: 600 },
  gong_lingxi:     { id: 'gong_lingxi',     name: '灵犀指',     grade: '玄级', icon: '☝️', color: '#4caf50', desc: '被动·穿透+40',   type: 'pen',  value: 40 },
  gong_jingang:    { id: 'gong_jingang',    name: '金刚不坏',   grade: '地级', icon: '💪', color: '#4a90d9', desc: '被动·物抗+80',   type: 'def',  value: 80 },
  gong_lieyang:    { id: 'gong_lieyang',    name: '烈阳心法',   grade: '地级', icon: '🔥', color: '#4a90d9', desc: '被动·物攻+70',   type: 'atk',  value: 70 },
  gong_hanbing:    { id: 'gong_hanbing',    name: '寒冰真解',   grade: '地级', icon: '❄️', color: '#4a90d9', desc: '被动·法攻+70',   type: 'matk', value: 70 },
  gong_xuanwu:     { id: 'gong_xuanwu',     name: '玄武真身',   grade: '地级', icon: '🐢', color: '#4a90d9', desc: '被动·法抗+80',   type: 'mdef', value: 80 },
  gong_longxiang:  { id: 'gong_longxiang',  name: '龙象般若功', grade: '天级', icon: '🐘', color: '#9b59b6', desc: '被动·物攻+160',  type: 'atk',  value: 160 },
  gong_taiyi:      { id: 'gong_taiyi',      name: '太乙归元诀', grade: '天级', icon: '☯️', color: '#9b59b6', desc: '被动·法攻+160',  type: 'matk', value: 160 },
  gong_budong:     { id: 'gong_budong',     name: '不动明王',   grade: '仙级', icon: '🗿', color: '#e6a23c', desc: '被动·物抗+220',  type: 'def',  value: 220 },
  gong_xianling:   { id: 'gong_xianling',   name: '仙灵护体',   grade: '仙级', icon: '✨', color: '#e6a23c', desc: '被动·气血+4000', type: 'hp',   value: 4000 },
  // ---- 战斗技能功法 ----
  gong_yujian:     { id: 'gong_yujian',     name: '御剑诀',     grade: '天级', icon: '⚔️', color: '#9b59b6', sect: 'qingyun', desc: '主动·御剑攻敌（法攻2.0倍，灵力25%，冷却3回合）', combat: { name: '御剑诀', mult: 2.0, manaPct: 0.25, cd: 3 } },
  gong_jiumiao:    { id: 'gong_jiumiao',    name: '九霄神雷',   grade: '仙级', icon: '🌩️', color: '#e6a23c', sect: 'qingyun', desc: '主动·神雷天降（法攻3.0倍，灵力35%，冷却5回合）', combat: { name: '九霄神雷', mult: 3.0, manaPct: 0.35, cd: 5 } },
  gong_wanjian:    { id: 'gong_wanjian',    name: '万剑归宗',   grade: '神级', icon: '🗡️', color: '#e0473c', sect: 'qingyun', desc: '主动·万剑齐发（法攻4.5倍，灵力45%，冷却8回合）', combat: { name: '万剑归宗', mult: 4.5, manaPct: 0.45, cd: 8 } },
  gong_xingyun:    { id: 'gong_xingyun',    name: '星陨术',     grade: '神级', icon: '☄️', color: '#e0473c', sect: 'qingyun', desc: '主动·星辰坠落（法攻5.5倍，灵力55%，冷却10回合）', combat: { name: '星陨术', mult: 5.5, manaPct: 0.55, cd: 10 } },
  gong_danxia_chunfeng: { id: 'gong_danxia_chunfeng', name: '春风化雨诀', grade: '天级', icon: '🌿', color: '#e6a23c', sect: 'danxia', desc: '主动·回复30%气血（灵力25%，冷却4回合）', combat: { kind: 'heal', healPct: 0.30, manaPct: 0.25, cd: 4 } },
  gong_danxia_fuhua: { id: 'gong_danxia_fuhua', name: '扶华增元诀', grade: '仙级', icon: '✨', color: '#e6a23c', sect: 'danxia', desc: '主动·攻击提高70%，持续3回合（灵力30%，冷却6回合）', combat: { kind: 'buff', boost: 0.70, turns: 3, manaPct: 0.30, cd: 6 } },
  gong_danxia_lingbi: { id: 'gong_danxia_lingbi', name: '丹霞灵壁', grade: '仙级', icon: '🛡️', color: '#e6a23c', sect: 'danxia', desc: '主动·下一次受击减伤65%，并反弹敌方来袭伤害的150%（灵力25%，冷却5回合）', combat: { kind: 'guard', guard: 0.65, reflect: 1.5, manaPct: 0.25, cd: 5 } },
  gong_tianmo_bloodsacrifice: { id: 'gong_tianmo_bloodsacrifice', name: '血煞燃元术', grade: '仙级', icon: '🩸', color: '#e0473c', sect: 'tianmo', desc: '主动·消耗8%气血，攻击提高100%，持续3回合（灵力20%，冷却6回合）', combat: { kind: 'blood_rage', hpPct: 0.08, boost: 1.00, turns: 3, manaPct: 0.20, cd: 6 } },
  gong_tianmo_bloodflame: { id: 'gong_tianmo_bloodflame', name: '血焰焚天诀', grade: '仙级', icon: '🔥', color: '#e0473c', sect: 'tianmo', desc: '主动·燃烧15%气血，轰出血焰重击（物攻3.6倍，灵力15%，冷却5回合）', combat: { kind: 'blood_strike', hpPct: 0.15, mult: 3.6, manaPct: 0.15, cd: 5 } },
  gong_tianmo_bloodescape: { id: 'gong_tianmo_bloodescape', name: '血遁大法', grade: '天级', icon: '💨', color: '#e0473c', sect: 'tianmo', desc: '主动·燃烧20%气血血遁逃离（95%成功；失败则爆体战败，不耗灵力）', combat: { kind: 'blood_escape', hpPct: 0.20, manaPct: 0, cd: 0 } },
  gong_tianmo_bloodplunder: { id: 'gong_tianmo_bloodplunder', name: '燃血夺宝诀', grade: '仙级', icon: '💰', color: '#e0473c', sect: 'tianmo', desc: '主动·燃烧20%气血，本场经验、灵石、名望及掉落概率提高20%（每场一次，不耗灵力）', combat: { kind: 'reward_boost', hpPct: 0.20, rewardBoost: 0.20, onceBattle: true, manaPct: 0, cd: 0 } },
};
// 重复获得同一本功法时的灵石补偿
const GONGFA_REFUND = { '黄级': 100, '玄级': 300, '地级': 800, '天级': 2000, '仙级': 5000, '神级': 12000 };

// ========== 奇遇设定 ==========
// reward 类型：gongfa 学功法 / stone 灵石 / item 道具 / dao 道韵 / xp 修为
const QYU_POOL = [
  { id: 'qyu_tiebushan', title: '古洞遗珍', text: '你在山间偶然坠入一座上古修士坐化的洞府，石壁上刻着一门护体功法。', weight: 12, reward: { type: 'gongfa', id: 'gong_tiebushan' } },
  { id: 'qyu_hunyuan',   title: '溪边悟道', text: '你于溪边静坐，见水波流转、阴阳相济，忽有所悟，创出一门混元功法。', weight: 12, reward: { type: 'gongfa', id: 'gong_hunyuan' } },
  { id: 'qyu_qingsong',  title: '松涛问心', text: '古松之下，你聆听松涛，心静如水，悟得一门养气延寿的功法。', weight: 10, reward: { type: 'gongfa', id: 'gong_qingsong' } },
  { id: 'qyu_lingxi',    title: '石中藏经', text: '你见一块顽石中隐有光华，一掌劈开，竟藏着一卷指法残篇。', weight: 10, reward: { type: 'gongfa', id: 'gong_lingxi' } },
  { id: 'qyu_jingang',   title: '怒目金刚', text: '古寺遗址中，一尊怒目金刚像前，你静坐三日，悟得金刚不坏之身。', weight: 8, reward: { type: 'gongfa', id: 'gong_jingang' } },
  { id: 'qyu_lieyang',   title: '大日临空', text: '正午时分，你遥望大日，火灵气入体，炼成烈阳心法。', weight: 8, reward: { type: 'gongfa', id: 'gong_lieyang' } },
  { id: 'qyu_hanbing',   title: '寒潭冰髓', text: '你潜入万年寒潭，得到一株冰髓，炼成寒冰真解。', weight: 8, reward: { type: 'gongfa', id: 'gong_hanbing' } },
  { id: 'qyu_xuanwu',    title: '龟蛇相守', text: '你见龟蛇相斗相生，悟得玄武真身，法抗大增。', weight: 8, reward: { type: 'gongfa', id: 'gong_xuanwu' } },
  { id: 'qyu_longxiang', title: '龙象神功', text: '上古龙象的骸骨前，你感受到苍茫之力，龙象般若功印入识海。', weight: 5, reward: { type: 'gongfa', id: 'gong_longxiang' } },
  { id: 'qyu_taiyi',     title: '太乙传承', text: '太乙真人残存的一缕神念，将太乙归元诀传授于你。', weight: 5, reward: { type: 'gongfa', id: 'gong_taiyi' } },
  { id: 'qyu_budong',    title: '不动明王', text: '面对滔天魔气，你岿然不动，心如磐石，悟得不动明王真意。', weight: 3, reward: { type: 'gongfa', id: 'gong_budong' } },
  { id: 'qyu_xianling',  title: '仙灵护体', text: '一道仙灵之气融入你身，四肢百骸仿佛重获新生。', weight: 3, reward: { type: 'gongfa', id: 'gong_xianling' } },
  { id: 'qyu_yujian',    title: '剑冢悟剑', text: '万剑剑冢之中，剑意冲霄，你悟得御剑诀。', weight: 5, sect: 'qingyun', reward: { type: 'gongfa', id: 'gong_yujian' } },
  { id: 'qyu_jiumiao',   title: '雷池淬体', text: '你闯入九霄雷池，以神雷淬体，炼成九霄神雷。', weight: 3, sect: 'qingyun', reward: { type: 'gongfa', id: 'gong_jiumiao' } },
  { id: 'qyu_wanjian',   title: '剑仙遗赠', text: '剑仙坐化之地，万剑齐鸣，将万剑归宗馈赠于你。', weight: 1.5, sect: 'qingyun', reward: { type: 'gongfa', id: 'gong_wanjian' } },
  { id: 'qyu_xingyun',   title: '天外星辰', text: '一颗流星划破长空，你从中参悟了星陨术。', weight: 1.5, sect: 'qingyun', reward: { type: 'gongfa', id: 'gong_xingyun' } },
  { id: 'qyu_danxia_chunfeng', title: '药谷春雨', text: '丹霞药谷的灵雨洒落识海，你悟得春风化雨诀。', weight: 4, sect: 'danxia', reward: { type: 'gongfa', id: 'gong_danxia_chunfeng' } },
  { id: 'qyu_danxia_fuhua', title: '丹火蕴元', text: '一炉丹火映照经脉，你悟得扶华增元诀。', weight: 2.5, sect: 'danxia', reward: { type: 'gongfa', id: 'gong_danxia_fuhua' } },
  { id: 'qyu_danxia_lingbi', title: '霞光护身', text: '丹霞铺开如幕，你领悟丹霞灵壁。', weight: 2.5, sect: 'danxia', reward: { type: 'gongfa', id: 'gong_danxia_lingbi' } },
  { id: 'qyu_tianmo_blood', title: '血池残卷', text: '魔教血池中浮出一卷残经，你悟得血煞燃元术。', weight: 3, sect: 'tianmo', reward: { type: 'gongfa', id: 'gong_tianmo_bloodsacrifice' } },
  { id: 'qyu_tianmo_bloodflame', title: '血焰魔窟', text: '你在魔窟深处见血焰焚空，参悟血焰焚天诀。', weight: 2, sect: 'tianmo', reward: { type: 'gongfa', id: 'gong_tianmo_bloodflame' } },
  { id: 'qyu_tianmo_bloodescape', title: '血影秘遁', text: '残碑上留有一道血影遁法，你悟得血遁大法。', weight: 2, sect: 'tianmo', reward: { type: 'gongfa', id: 'gong_tianmo_bloodescape' } },
  { id: 'qyu_tianmo_bloodplunder', title: '魔君宝录', text: '一册以精血书就的魔君宝录，记载着燃血夺宝之法。', weight: 1.5, sect: 'tianmo', reward: { type: 'gongfa', id: 'gong_tianmo_bloodplunder' } },
  { id: 'qyu_lingkuang', title: '灵脉矿脉', text: '你发现一处裸露的灵脉，采得不少灵石。', weight: 14, reward: { type: 'stone', value: 500 } },
  { id: 'qyu_yaoyuan',   title: '药香引路', text: '一阵异香引你来到一株灵药前，你小心采下。', weight: 10, reward: { type: 'item', id: 'lingshou_dan', count: 2 } },
  { id: 'qyu_daoyun',    title: '天道垂青', text: '你抬头望天，忽觉天道运转自有其理，道韵顿生。', weight: 10, reward: { type: 'dao', value: 20 } },
  { id: 'qyu_dunwu',     title: '顿悟', text: '行走间，你忽然福至心灵，对修行有了更深的理解。', weight: 12, reward: { type: 'xp', value: 300 } },
];

// ========== 洞府经营 ==========
// 灵药：种下后按真实时间挂机成长，成熟后可收获奖励
// yield 类型：stone 灵石 / item 道具 / xp 修为 / dao 道韵
const HERBS = {
  lingzhi:   { id: 'lingzhi',   name: '灵芝',     icon: '🌿', growMs: 60000,     seed: 10,  yield: { stone: 28 } },
  renshen:   { id: 'renshen',   name: '人参',     icon: '🥕', growMs: 300000,    seed: 30,  yield: { stone: 75 } },
  xuelian:   { id: 'xuelian',   name: '雪莲',     icon: '❄️', growMs: 1800000,   seed: 120, yield: { item: 'lingshou_dan', count: 1 } },
  longyan:   { id: 'longyan',   name: '龙涎草',   icon: '🌱', growMs: 7200000,   seed: 300, yield: { xp: 600 } },
  jiuhua:    { id: 'jiuhua',    name: '九华仙莲', icon: '🪷', growMs: 21600000,  seed: 800, yield: { dao: 10 } },
};

// 洞府等级：等级越高，灵田越多、修炼加成越高
const CAVE_LEVELS = [
  { level: 1, plots: 1, cost: 0,     xpBonus: 0.00 },
  { level: 2, plots: 2, cost: 300,   xpBonus: 0.05 },
  { level: 3, plots: 3, cost: 800,   xpBonus: 0.10 },
  { level: 4, plots: 4, cost: 2000,  xpBonus: 0.15 },
  { level: 5, plots: 5, cost: 5000,  xpBonus: 0.22 },
  { level: 6, plots: 6, cost: 12000, xpBonus: 0.30 },
  { level: 7, plots: 7, cost: 30000, xpBonus: 0.40 },
];

// ========== 宗门系统 ==========
// 宗门：加入后获得被动加成，可接宗门任务赚贡献、在贡献商店兑换
const SECTS = {
  qingyun: { id: 'qingyun', name: '青云宗', icon: '☁️', color: '#4a90d9',
    desc: '名门正派，剑修云集。宗门加成：物攻+25、物抗+15。',
    bonus: { atk: 25, def: 15 } },
  danxia: { id: 'danxia', name: '丹霞谷', icon: '🌅', color: '#e6a23c',
    desc: '炼丹圣地，富甲一方。宗门加成：法攻+25、法抗+15。',
    bonus: { matk: 25, mdef: 15 } },
  tianmo: { id: 'tianmo', name: '天魔教', icon: '🩸', color: '#e0473c',
    desc: '魔道宗门，速成霸道。宗门加成：物攻+40、穿透+20。',
    bonus: { atk: 40, pen: 20 } },
};

// 宗门任务：完成后获得贡献（cost 为 null 表示点击即完成；item 需交付材料；battle 需战斗）
const SECT_TASKS = [
  { id: 'sect_patrol', name: '巡守山门', icon: '🚶', desc: '巡视外门山道，驱赶宵小。', tier: 'outer', minRealm: 0, reward: 15, cost: null },
  { id: 'sect_gather', name: '采集灵草', icon: '🌿', desc: '上交药王谷灵草。', tier: 'outer', minRealm: 0, reward: 30, cost: { item: 'yaowanggu_lingzhi', count: 1 } },
  { id: 'sect_wolf', name: '清剿狼患', icon: '🐺', desc: '讨伐炼气期野狼。', tier: 'outer', minRealm: 0, reward: 25, cost: { battle: true, enemy: 'wolf' } },
  { id: 'sect_bandit', name: '缉拿山贼', icon: '⚔️', desc: '讨伐炼气后期山贼。', tier: 'outer', minRealm: 4, reward: 40, cost: { battle: true, enemy: 'bandit' } },
  { id: 'sect_snake', name: '蛇窟除妖', icon: '🐍', desc: '讨伐筑基期蛇妖。', tier: 'outer', minRealm: 8, reward: 55, cost: { battle: true, enemy: 'snake_demon' } },
  { id: 'sect_monkey', name: '黑岭镇乱', icon: '🐒', desc: '讨伐筑基期石猴。', tier: 'outer', minRealm: 10, reward: 70, cost: { battle: true, enemy: 'stone_monkey' } },
  { id: 'sect_blood', name: '血教缉凶', icon: '🩸', desc: '讨伐金丹期血教弟子。', tier: 'inner', minRealm: 14, reward: 100, cost: { battle: true, enemy: 'blood_cultist' } },
  { id: 'sect_bifang', name: '镇压毕方', icon: '🦅', desc: '讨伐金丹期灵禽毕方。', tier: 'inner', minRealm: 14, reward: 125, cost: { battle: true, enemy: 'bifuluan' } },
  { id: 'sect_qiongqi', name: '巡猎穷奇', icon: '🐯', desc: '讨伐元婴期凶兽穷奇。', tier: 'inner', minRealm: 18, reward: 170, cost: { battle: true, enemy: 'qiongqi' } },
  { id: 'sect_taotie', name: '荒原诛饕餮', icon: '👹', desc: '讨伐元婴后期饕餮。', tier: 'inner', minRealm: 20, reward: 210, cost: { battle: true, enemy: 'taotie' } },
  { id: 'sect_taowu', name: '禁地战梼杌', icon: '🦴', desc: '讨伐化神期梼杌。', tier: 'inner', minRealm: 22, reward: 280, cost: { battle: true, enemy: 'taowu' } },
  { id: 'sect_hundun', name: '混沌镇封', icon: '🌑', desc: '讨伐化神后期混沌。', tier: 'inner', minRealm: 24, reward: 350, cost: { battle: true, enemy: 'hundun' } },
];

// 宗门贡献商店
const SECT_SHOP = [
  { id: 'ss_stone',  name: '灵石礼包',     icon: '💰', cost: 50,  reward: { stone: 200 } },
  { id: 'ss_juqi',   name: '聚气丹',       icon: '🧪', cost: 80,  reward: { item: 'juqi_pill', count: 2 } },
  { id: 'ss_huiqi',  name: '回气丹',       icon: '💊', cost: 40,  reward: { item: 'huiqi_pill', count: 1 } },
  { id: 'ss_gongfa', name: '功法·金刚不坏', icon: '💪', cost: 300, reward: { gongfa: 'gong_jingang' } },
  { id: 'ss_dao',    name: '道韵玉牌',     icon: '☯️', cost: 200, reward: { dao: 15 } },
];

// ========== 竞技斗法 ==========
// 段位：按积分划分
const ARENA_TIERS = [
  { tier: '炼气斗者', min: 0 },
  { tier: '筑基斗士', min: 100 },
  { tier: '金丹斗尊', min: 300 },
  { tier: '元婴斗皇', min: 800 },
  { tier: '化神斗帝', min: 2000 },
  { tier: '仙域斗仙', min: 5000 },
];

// 天梯假名（本地模拟排行榜，用于显示玩家排名）
const ARENA_LADDER = [
  { name: '剑痴·慕容',  score: 5200 },
  { name: '丹霞仙子',   score: 4600 },
  { name: '血手人屠',   score: 3900 },
  { name: '青莲剑客',   score: 3100 },
  { name: '白眉老道',   score: 2400 },
  { name: '黑风双煞',   score: 1800 },
  { name: '黄雀道人',   score: 1200 },
  { name: '快剑阿七',   score: 650 },
  { name: '铁掌水上漂', score: 320 },
  { name: '无名散修',   score: 80 },
];

// 斗法对手名池
const ARENA_NAMES = ['张铁牛', '李青', '王道人', '赵飞', '孙胜', '周玄', '吴风', '郑烈', '冯霜', '陈冲', '楚狂', '苏小小'];

// ========== 心魔试炼 ==========
// 心魔事件：选择题，选对加心境，选错减心境（xinjing 可为负）
const XINMO_EVENTS = [
  { id: 'xm_greed', title: '贪婪心魔',
    text: '幻境之中，满山灵石铺就，一株仙药摇曳。心魔低语："尽取之，方不负此生。"',
    choices: [
      { label: '只取所需，留有余地', xinjing: 10 },
      { label: '尽数搜刮，不落分毫', xinjing: -8 },
    ] },
  { id: 'xm_anger', title: '嗔怒心魔',
    text: '你见旧日仇敌当众羞辱于你，杀意顿起。心魔狂笑："杀了他！"',
    choices: [
      { label: '忍一时，风平浪静', xinjing: 10 },
      { label: '怒而出手，血溅当场', xinjing: -10 },
    ] },
  { id: 'xm_doubt', title: '道心之惑',
    text: '你仰望仙路茫茫，忽觉万般皆是虚妄，萌生退意。',
    choices: [
      { label: '守本心，道在脚下', xinjing: 12 },
      { label: '动摇怀疑，心乱如麻', xinjing: -10 },
    ] },
  { id: 'xm_fear', title: '恐惧心魔',
    text: '无边的黑暗吞没天地，你只觉渺小如尘，双腿发软。',
    choices: [
      { label: '直面恐惧，逆流而上', xinjing: 12 },
      { label: '退缩逃避，寻求庇护', xinjing: -8 },
    ] },
  { id: 'xm_lust', title: '色欲心魔',
    text: '绝世仙子含笑相邀，红粉骷髅，不过一念之间。',
    choices: [
      { label: '心如止水，不动如山', xinjing: 10 },
      { label: '心神摇曳，坠入温柔', xinjing: -8 },
    ] },
];

// ========== 敌人设定 ==========
const ENEMIES = {
  // 新手区
  wolf:       { id: 'wolf',       name: '野狼',       hp: 30,  atk: 6,  def: 1,  xp: 12,  stone: [3, 8],   drops: [] },
  wolf_alpha: { id: 'wolf_alpha', name: '狼群首领',   hp: 130, atk: 15, def: 4,  xp: 60,  stone: [20, 40], drops: [{id:'tieyijia', chance:0.3}], boss: true },
  bandit:     { id: 'bandit',     name: '山贼',       hp: 50,  atk: 9,  def: 2,  xp: 20,  stone: [10, 20], drops: [{id:'shanzhifu',chance:0.5}] },
  bandit_chief:{id: 'bandit_chief',name:'清风寨寨主', hp: 300, atk: 24, def: 7,  xp: 150, stone: [80, 150],drops: [{id:'tiebi',chance:0.5},{id:'juqi_pill',chance:1}], boss: true },
  snake_demon:{ id: 'snake_demon',name: '蛇妖',       hp: 70,  atk: 14, def: 2,  matk: 18, mdef: 4, xp: 40,  stone: [15, 30], drops: [{id:'hanbingxue',chance:0.4}] },
  low_monk:   { id: 'low_monk',   name: '低阶修士',   hp: 80,  atk: 13, def: 4,  matk: 18, mdef: 6, xp: 35,  stone: [20, 40], drops: [{id:'huiqi_pill',chance:0.6},{id:'huiling_pill',chance:0.25}] },

  // 中段
  stone_monkey:{id: 'stone_monkey',name:'石猴',      hp: 150, atk: 22, def: 10, xp: 80,  stone: [30, 60], drops: [{id:'lieyangshi',chance:0.5}] },
  blood_cultist:{id:'blood_cultist',name:'血教弟子', hp: 180, atk: 28, def: 8,  matk: 38, mdef: 12, xp: 100, stone: [40, 80], drops: [{id:'juqi_pill',chance:0.4},{id:'yuling_pill',chance:0.25}] },
  bifuluan:    { id: 'bifuluan',   name: '毕方（灵禽）', hp: 500, atk: 52, def: 15, matk: 70, mdef: 20, xp: 220, stone: [100,180], drops: [{id:'lieyangshi',chance:1},{id:'dahuiling_pill',chance:0.2}], boss: true },

  // 高阶
  qiongqi:     { id: 'qiongqi',    name: '穷奇',      hp: 2400, atk: 280, def: 40, xp: 650, stone: [300,450], drops: [{id:'fengyuteng',chance:1},{id:'yuling_pill',chance:0.5}], boss: true, special: { name: '裂风蚀骨', type: 'poison', pct: 0.025, turns: 2, chance: 0.24, cd: 3 } },
  taotie:      { id: 'taotie',     name: '饕餮',      hp: 4500, atk: 380, def: 52, xp: 1100, stone: [500,750], drops: [{id:'hanbingxue',chance:1},{id:'dahuiling_pill',chance:0.5}], boss: true, special: { name: '吞天噬元', type: 'percent', pct: 0.07, chance: 0.24, cd: 3 } },
  nine_tails:  { id: 'nine_tails', name: '九尾天狐',  hp: 3200, atk: 330, def: 48, matk: 460, mdef: 60, xp: 950, stone: [400,700], drops: [{id:'dao_compass',chance:1}], boss: true, special: { name: '魅影摄魂', type: 'weaken', rate: 0.30, turns: 2, chance: 0.24, cd: 3 } },
  yinglong:    { id: 'yinglong',   name: '应龙',      hp: 6400, atk: 470, def: 72, xp: 1600, stone: [750,1100], drops: [{id:'tieyijia',chance:0.5}], boss: true, special: { name: '雷云震魄', type: 'stun', chance: 0.20, cd: 4 } },

  // 论道
  dao_competitor:{ id:'dao_competitor',name:'论道对手',hp: 250, atk: 30, def: 10, xp: 150, stone: [60,100], drops: [{id:'daopei',chance:0.3}], untouchable: false },
  dao_elder:   { id: 'dao_elder',  name: '宗门长老',  hp: 850, atk: 74, def: 22, matk: 105, mdef: 30, xp: 400, stone: [150,250],drops: [{id:'daopei',chance:1}], boss: true },

  // 天劫
  lei_jie_unified:{ id: 'lei_jie_unified', name: '天劫', hp: 1, atk: 0, def: 0, xp: 0, stone: [0,0], drops: [], untouchable: true, boss: true, tribDmg: 0.10 },
  lei_jie_1:   { id: 'lei_jie_1',  name: '筑基天劫·一重', hp: 1, atk: 0, def: 0, xp: 500, stone: [100,100], drops: [], untouchable: true, boss: true, tribDmg: 0.15 },

  // 魔尊：化神大圆满前不可力敌的终局强敌
  demon_lord:  { id: 'demon_lord', name: '魔尊',       hp: 230000, atk: 5600, def: 1200, matk: 7800, mdef: 1500, xp: 22000, stone: [12000,18000], drops: [], boss: true, special: { name: '魔神叩关', type: 'percent', pct: 0.10, chance: 0.24, cd: 4 } },

  // 秘境过渡敌人（20~29层爬塔用，填平 6400→75000 的数值断层）
  mijing_yuling:   { id: 'mijing_yuling',   name: '秘境妖灵', hp: 9000,  atk: 620,  def: 140, matk: 760,  mdef: 180, xp: 2800,  stone: [1400, 2000], drops: [{id:'juqi_pill',chance:0.5}], boss: true },
  mijing_yaoshuai: { id: 'mijing_yaoshuai', name: '秘境妖帅', hp: 22000, atk: 1250, def: 260, matk: 1550, mdef: 330, xp: 5500,  stone: [3400, 4800], drops: [{id:'juqi_pill',chance:1},{id:'huichun_pill',chance:0.4}], boss: true },
  mijing_yaozun:   { id: 'mijing_yaozun',   name: '秘境妖尊', hp: 52000, atk: 2100, def: 420, matk: 2600, mdef: 530, xp: 9800,  stone: [6200, 9000], drops: [{id:'juqi_pill',chance:1},{id:'dahuan_pill',chance:0.5}], boss: true },

  // 四凶禁地（高难度挑战，强度递增；魔尊仍为此阶段最强）
  taowu:       { id: 'taowu',    name: '梼杌',       hp: 75000, atk: 2500, def: 480, matk: 2900, mdef: 560, xp: 8000,  stone: [3500,5000],  drops: [{id:'lieyangshi',chance:1},{id:'tiebi',chance:0.5}], boss: true, special: { name: '凶煞裂地', type: 'weaken', rate: 0.35, turns: 2, chance: 0.24, cd: 3 } },
  hundun:      { id: 'hundun',   name: '混沌',       hp: 120000, atk: 3300, def: 650, matk: 3900, mdef: 760, xp: 12000, stone: [5500,8000], drops: [{id:'hanbingxue',chance:1},{id:'juqi_pill',chance:1}], boss: true, special: { name: '混沌侵蚀', type: 'poison', pct: 0.035, turns: 2, chance: 0.24, cd: 3 } },
  qiongchi_fiend:{ id: 'qiongchi_fiend', name: '禁地穷奇', hp: 150000, atk: 3900, def: 780, matk: 4700, mdef: 920, xp: 16000, stone: [8000,11000], drops: [{id:'fengyuteng',chance:1},{id:'dahuan_pill',chance:0.5}], boss: true, special: { name: '裂天妖羽', type: 'percent', pct: 0.08, chance: 0.24, cd: 3 } },
  zhulong:     { id: 'zhulong',  name: '烛龙',       hp: 175000, atk: 4600, def: 950, matk: 5500, mdef: 1120, xp: 20000, stone: [10000,14000], drops: [{id:'lieyangshi',chance:1},{id:'tiebi',chance:1},{id:'juqi_pill',chance:1},{id:'dahuan_pill',chance:0.5}], boss: true, special: { name: '烛阴凝视', type: 'stun', chance: 0.20, cd: 4 } },

  // 天劫
  lei_jie_2:   { id: 'lei_jie_2',  name: '金丹天劫·二重', hp: 1, atk: 0, def: 0, xp: 1500, stone: [300,300], drops: [], untouchable: true, boss: true, tribDmg: 0.20 },
  lei_jie_3:   { id: 'lei_jie_3',  name: '元婴天劫·三重', hp: 1, atk: 0, def: 0, xp: 3000, stone: [600,600], drops: [], untouchable: true, boss: true, tribDmg: 0.22 },

  // 化神期：天劫与魔域
  lei_jie_4:   { id: 'lei_jie_4',   name: '化神天劫·四重', hp: 1, atk: 0, def: 0, xp: 4000, stone: [800,800], drops: [], untouchable: true, boss: true, tribDmg: 0.24 },
  fei_sheng_jie:{ id:'fei_sheng_jie',name:'飞升天劫·九重',hp: 1, atk: 0, def: 0, xp: 8000, stone: [2000,2000], drops: [], untouchable: true, boss: true, tribDmg: 0.22 },
  // 仙人级强敌：基础数值覆盖人仙期，仙帝后继续按动态 Boss 规则增长
  tianmo:          { id:'tianmo',          name:'域外天魔',   hp: 450000, atk: 8500,  def: 1800, matk: 11500, mdef: 2300, xp: 50000,  stone: [30000,45000], drops: [{id:'juqi_pill',chance:1},{id:'lieyangshi',chance:1},{id:'dahuan_pill',chance:1}], boss: true, power: 1.1, special: { name: '蚀魂魔焰', type: 'poison', pct: 0.04, turns: 2, chance: 0.24, cd: 3 } },
  mojun:           { id:'mojun',           name:'上古魔君',   hp: 750000, atk: 12500, def: 2700, matk: 17000, mdef: 3400, xp: 80000,  stone: [50000,70000], drops: [{id:'juqi_pill',chance:1},{id:'lieyangshi',chance:1},{id:'tiebi',chance:1},{id:'jiuzhuan_pill',chance:1}], boss: true, power: 1.3, special: { name: '魔君威压', type: 'weaken', rate: 0.40, turns: 2, chance: 0.24, cd: 3 } },
  honghuang_shou:  { id:'honghuang_shou',  name:'洪荒祖兽',   hp: 1200000,atk: 16500, def: 3600, matk: 22000, mdef: 4500, xp: 120000, stone: [90000,130000], drops: [{id:'lieyangshi',chance:1},{id:'juqi_pill',chance:1},{id:'dahuan_pill',chance:1}], boss: true, power: 1.5, special: { name: '荒兽践踏', type: 'percent', pct: 0.08, chance: 0.24, cd: 3 } },
  tian_dao:        { id:'tian_dao',        name:'天道化身',   hp: 1800000,atk: 22000, def: 4800, matk: 30000, mdef: 6000, xp: 180000, stone: [140000,200000], drops: [{id:'hanbingxue',chance:1},{id:'jiuzhuan_pill',chance:1},{id:'tiebi',chance:1}], boss: true, power: 1.8, special: { name: '天罚枷锁', type: 'stun', chance: 0.20, cd: 4 } },
  chaos_yuanling:  { id:'chaos_yuanling',  name:'混沌元灵',   hp: 2600000,atk: 30000, def: 6500, matk: 41000, mdef: 8200, xp: 260000, stone: [210000,300000], drops: [{id:'lieyangshi',chance:1},{id:'jiuzhuan_pill',chance:1},{id:'tiebi',chance:1},{id:'dahuan_pill',chance:1}], boss: true, power: 2.1, special: { name: '归墟湮灭', type: 'percent', pct: 0.10, chance: 0.24, cd: 4 } },
};

// ========== 秘境爬塔 ==========
// 按层数分段随机敌人池
const MIJING_POOLS = [
  { minFloor: 1,  enemies: ['wolf', 'bandit', 'snake_demon', 'low_monk'] },
  { minFloor: 5,  enemies: ['stone_monkey', 'blood_cultist'] },
  { minFloor: 10, enemies: ['bifuluan', 'qiongqi', 'nine_tails'] },
  { minFloor: 15, enemies: ['taotie', 'yinglong'] },
  { minFloor: 20, enemies: ['mijing_yuling'] },
  { minFloor: 24, enemies: ['mijing_yaoshuai'] },
  { minFloor: 27, enemies: ['mijing_yaozun'] },
  { minFloor: 30, enemies: ['taowu', 'hundun', 'qiongchi_fiend', 'zhulong'] },
  { minFloor: 35, enemies: ['tianmo', 'mojun'] },
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
      { label: '前往渡劫台', next: 'tribulation_hall' },
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
        { id: 'ningling_san', price: 50 },
        { id: 'huiling_pill', price: 500 },
        { id: 'yuling_pill', price: 2000 },
        { id: 'dahuiling_pill', price: 8000 },
        { id: 'jiuzhuanling_pill', price: 25000 },
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
      { label: '从最高层继续挑战', action: (s) => { s.mijing.floor = Math.max(0, (s.mijing.best || 1) - 1); s.mijing.active = true; }, next: 'mijing_fight', req: (s) => (s.mijing && s.mijing.best > 0) },
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
      { label: '愿意拜师', next: 'yaowang_disciple', req: (s) => !s.yaowangDisciple },
      { label: '婉拒，告辞', next: 'qingyun_gate' },
    ],
  },

  yaowang_disciple: {
    title: '药王弟子',
    text: '药王满意地点点头，传授你基础丹道知识，并赠你一瓶丹药。',
    onEnter: (s) => {
      if (s.yaowangDisciple) return;
      s.yaowangDisciple = true;
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

  // ===== 统一渡劫台 =====
  tribulation_hall: {
    title: '渡劫台',
    dynamicText: (s) => {
      const gate = getCurrentTribulationGate(s);
      if (!gate) return '此处天机平静。你尚未到达需要渡劫的境界大圆满。';
      const ready = isTribulationReady(s, gate);
      return `你当前需渡【${gate.name}天劫】。${ready ? '修为已至大圆满，可引动天劫。' : '修为尚未圆满，继续修炼后再来。'}\n天劫不可被伤害；凝神防御或及时治疗，可安然扛过。`;
    },
    choices: [
      { label: '引动天劫', action: () => startUnifiedTribulation(), req: (s) => isTribulationReady(s) },
      { label: '暂且离开', action: (s) => goToNode(getTribulationReturnNode(s)) },
    ],
  },

  tribulation_battle: {
    title: '天劫降临',
    dynamicText: (s) => {
      const p = s.pendingTribulation;
      const gate = p && getTribulationGateForIndex(p.gateIdx);
      return gate ? `${getRealm(gate.gateIdx).name}圆满，劫云压顶。此劫不可伤害，唯有守住道心，扛过天雷。` : '劫云已散。';
    },
    battle: { enemy: 'lei_jie_unified', mult: 1.0, tribulation: true, turns: 5, dynamicTribulation: true },
    winNext: 'tribulation_success',
    loseNext: 'tribulation_fail',
  },

  tribulation_success: {
    title: '天劫已过',
    text: '劫云散去，天地灵气灌入体内。你的道基经受住了天雷淬炼，境界壁垒应声而破！',
    onEnter: (s) => { completePendingTribulation(s); },
    choices: [
      { label: '继续修行', action: (s) => goToNode(getTribulationReturnNode(s)) },
    ],
  },

  tribulation_blessed: {
    title: '天道庇佑',
    text: '天道垂青，劫云尚未凝聚便自行散去。无需渡劫，你已顺利跨过境界壁垒！',
    onEnter: (s) => { completePendingTribulation(s); },
    choices: [
      { label: '继续修行', action: (s) => goToNode(getTribulationReturnNode(s)) },
    ],
  },

  tribulation_fail: {
    title: '渡劫受挫',
    text: '天雷震散了你的护体灵光。所幸根基未毁，静养后仍可再次引动天劫。',
    onEnter: (s) => { s.pendingTribulation = null; s.hp = Math.max(1, Math.floor(s.maxHp * 0.30)); },
    choices: [
      { label: '返回修行', action: (s) => goToNode(getTribulationReturnNode(s)) },
    ],
  },

  // ===== 旧版天劫节点（仅用于兼容停留在旧节点的存档） =====
  zhuji_prep: {
    title: '筑基在即',
    text: '你感到自身修为已达炼气大圆满的顶点，再进一步便是筑基。但筑基必渡天劫，失败则形神俱灭。',
    choices: [
      { label: '前往渡劫台', next: 'tribulation_hall' },
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
      { label: '回洞府', next: 'cave_home' },
      { label: '返回外门', next: 'qingyun_gate' },
      { label: '云游寻缘（奇遇）', next: 'qiyu_wander' },
      { label: '去内门任务堂', next: 'inner_quest_hall' },
      { label: '离开宗门历练', next: 'lianyu_entrance' },
      { label: '前往渡劫台', next: 'tribulation_hall' },
      { label: '迎战魔尊（终局）', next: 'final_story' },
    ],
  },

  // ===== 奇遇 =====
  qiyu_wander: {
    title: '云游寻缘',
    dynamicText: () => {
      const last = Game.lastQiyu;
      const result = last && last.result ? `\n\n最近机缘：${last.q.title}——${last.result.text}` : '';
      const ten = last && last.draws ? `\n\n本次十连共获得 ${last.draws.length} 份机缘。` : '';
      return `你欲云游四方，寻找属于自己的仙缘。天机渺渺，有缘者自会遇见奇遇。\n单次消耗 10 道韵，十连消耗 100 道韵；获得机缘后可继续云游。${result}${ten}`;
    },
    choices: [
      { label: '开始云游（消耗 10 道韵）', action: (s) => { triggerQiyu(s, true); } },
      { label: '云游十连（消耗 100 道韵）', action: (s) => { triggerQiyuTen(s); } },
      { label: '再想想', next: 'inner_gate' },
    ],
  },

  qiyu_result: {
    title: '仙缘际会',
    dynamicText: (s) => {
      const ly = Game.lastQiyu;
      if (!ly) return '奇遇已散，如梦幻泡影。';
      const gong = ly.result && ly.result.gongfa;
      let extra = '';
      if (gong) extra = `\n\n【${gong.name}】${gong.grade} · ${gong.desc}`;
      return `【${ly.q.title}】\n${ly.q.text}\n\n${ly.result.text}${extra}`;
    },
    choices: [
      { label: '继续云游', next: 'qiyu_wander' },
      { label: '返回内门', next: 'inner_gate' },
    ],
  },

  inner_cultivate: {
    title: '内门修炼',
    text: '内门洞府灵气浓度远胜外门，你修炼起来事半功倍。',
    onEnter: (s) => {
      const base = 80 + Math.floor(Math.random() * 40);
      const gain = Math.floor(base * (1 + getCaveXpBonus(s)));
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
      const base = 100 + Math.floor(Math.random() * 60);
      const gain = Math.floor(base * (1 + getCaveXpBonus(s)));
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
    explore: true,
    choices: [
      { label: '在外围历练', next: 'mountain_outer' },
      { label: '深入山脉', next: 'mountain_deep' },
      { label: '前往青丘', next: 'nine_tails_entrance' },
      { label: '前往应龙渊', next: 'yinglong_pond' },
      { label: '探寻四凶禁地', next: 'taowu_entrance', req: (s) => getRealmIndex(s) >= 14 },
      { label: '探寻上古魔域', next: 'huashen_moyu', req: (s) => getRealmIndex(s) >= 22 },
      { label: '探寻洪荒禁地', next: 'honghuang_entrance', req: (s) => getRealmIndex(s) >= 36 },
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
      { label: '迎战魔尊', next: 'demon_lord_fight', req: (s) => getRealmIndex(s) >= 25 },
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
    text: '魔尊的力量远超你的想象。你终究没能撑到最后……\n\n修仙一途，本就是逆天而行。败了，便是身死道消。\n\n然而道心不灭，一缕真灵不散——转世重修，来世再战！',
    choices: [
      { label: '转世重修', action: () => { reincarnate(Game.state); } },
      { label: '读取存档', action: () => { UI.openSidePanel('save'); } },
    ],
  },

  // ===== 金丹天劫 =====
  jindan_prep: {
    title: '结丹在即',
    text: '你感到修为已至筑基大圆满的尽头,再进一步便是凝结金丹。然金丹一成,必降天劫。',
    choices: [
      { label: '前往渡劫台', next: 'tribulation_hall' },
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
      { label: '前往渡劫台', next: 'tribulation_hall' },
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
    text: '妖兽山脉极深处,有一片被上古大能封印的禁地。传闻四凶中的梼杌、混沌、穷奇、饕餮皆有残魂盘踞，最深处更有烛龙沉眠。',
    choices: [
      { label: '踏入禁地', next: 'taowu_fight', req: (s) => getRealmIndex(s) >= 24 },
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
    text: '你以无上神通击溃了混沌。前方腥风骤起，另一尊凶兽的双翼遮蔽了天空。',
    onEnter: (s) => { s.dao += 50; s.fame += 180; s.stone += 800; },
    choices: [
      { label: '迎战穷奇', next: 'qiongchi_fiend_fight' },
      { label: '见好就收', next: 'lianyu_entrance' },
    ],
  },

  qiongchi_fiend_fight: {
    title: '禁地穷奇',
    text: '双翼掀起滔天腥风，禁地中的穷奇比外界传闻更为凶残。它张口咆哮，整片山谷都在震颤！',
    battle: { enemy: 'qiongchi_fiend', mult: 1.0 },
    winNext: 'qiongchi_fiend_win',
    loseNext: 'defeat_general',
  },

  qiongchi_fiend_win: {
    title: '斩穷奇',
    text: '穷奇坠入深渊，禁地最后的封印随之松动。幽暗龙穴中，烛龙缓缓睁开了双眼。',
    onEnter: (s) => { s.dao += 70; s.fame += 250; s.stone += 1200; },
    choices: [
      { label: '深入龙穴', next: 'zhulong_fight' },
      { label: '见好就收', next: 'lianyu_entrance' },
    ],
  },

  zhulong_fight: {
    title: '烛龙',
    text: '连斩三凶后，深渊之中一条人面龙身的古龙睁开双眼。一闭一睁之间，昼夜交替——上古烛龙！',
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

  // ===== 洪荒禁地（无限境界挑战） =====
  honghuang_entrance: {
    title: '洪荒禁地',
    text: '妖兽山脉之外，有一处被混沌之力笼罩的太古禁地，传说其中沉睡着开天辟地前的洪荒凶灵。唯有证道成圣者，方有一线生机踏入其中。',
    choices: [
      { label: '踏入禁地', next: 'honghuang_fight_1', req: (s) => getRealmIndex(s) >= 36 },
      { label: '返回', next: 'lianyu_entrance' },
    ],
  },

  honghuang_fight_1: {
    title: '洪荒祖兽',
    text: '禁地之中，一尊盘踞了无数纪元的洪荒祖兽缓缓苏醒，其势如山岳，威压如天倾——洪荒祖兽！',
    battle: { enemy: 'honghuang_shou', mult: 1.0 },
    winNext: 'honghuang_win_1',
    loseNext: 'defeat_general',
  },

  honghuang_win_1: {
    title: '斩祖兽',
    text: '你以无上神通斩落了洪荒祖兽。然而禁地更深处，一道更加缥缈浩瀚的气息正在凝聚。',
    onEnter: (s) => { grantAchievement('boss_honghuang'); s.dao += 150; s.fame += 800; s.stone += 5000; },
    choices: [
      { label: '继续深入', next: 'honghuang_fight_2' },
      { label: '见好就收', next: 'lianyu_entrance' },
    ],
  },

  honghuang_fight_2: {
    title: '天道化身',
    text: '苍穹之上，一道由大道法则凝聚而成的人形浮现，目光淡漠，俯瞰众生——天道化身！',
    battle: { enemy: 'tian_dao', mult: 1.0 },
    winNext: 'honghuang_win_2',
    loseNext: 'defeat_general',
  },

  honghuang_win_2: {
    title: '破天道',
    text: '你竟以凡人之躯击溃了天道化身！禁地最深处，一股混沌未分的气息终于苏醒。',
    onEnter: (s) => { grantAchievement('boss_tiandao'); s.dao += 250; s.fame += 1500; s.stone += 10000; },
    choices: [
      { label: '深入混沌', next: 'honghuang_fight_3' },
      { label: '见好就收', next: 'lianyu_entrance' },
    ],
  },

  honghuang_fight_3: {
    title: '混沌元灵',
    text: '万物之始，混沌之中孕育出一缕先天元灵。它无善无恶，无始无终，唯有毁灭与归墟——混沌元灵！',
    battle: { enemy: 'chaos_yuanling', mult: 1.0 },
    winNext: 'honghuang_win_3',
    loseNext: 'defeat_general',
  },

  honghuang_win_3: {
    title: '混沌归墟',
    text: '你终于斩灭了混沌元灵。此等壮举，已超越了凡尘所能想象——从今往后，仙途无尽，你的传说将万古流传！',
    onEnter: (s) => {
      grantAchievement('boss_chaos');
      s.dao += 400;
      s.fame += 3000;
      s.stone += 20000;
      grantItem(s, 'jiuzhuan_pill', 3);
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
      { label: '前往渡劫台', next: 'tribulation_hall' },
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
      { label: '前往渡劫台', next: 'tribulation_hall' },
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
    text: '十一道神雷过后，天门大开，仙乐阵阵。你的肉身化作流光，直上九霄——飞升仙界，位列人仙！\n\n凡间，只是仙途的起点。更辽阔的仙域、更强的对手，正等着你继续探索。',
    onEnter: (s) => {
      grantAchievement('trib_feisheng');
      s.fame += 1000;
      s.dao += 200;
      passTribulation(s, 'feisheng', 25); // 飞升成功，跨入人仙境界，游戏继续
    },
    choices: [
      { label: '踏入仙域', next: 'inner_gate' },
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
      { label: '踏入魔域', next: 'tianmo_fight', req: (s) => getRealmIndex(s) >= 26 },
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

  // ===== 洞府经营 =====
  cave_home: {
    title: '洞府',
    dynamicText: (s) => {
      const c = getCaveInfo(s);
      return `这是你的修行洞府（${c.level}级）。灵田 ${c.plots.length}/${c.plots} 块，修炼加成 +${Math.round(c.xpBonus * 100)}%。\n洞府等级越高，灵田越多、修炼越快。`;
    },
    choices: [
      { label: '闭关修炼', next: 'inner_cultivate' },
      { label: '管理灵田与洞府', next: 'cave_manage' },
      { label: '静心打坐（心魔试炼）', next: 'xinmo_enter' },
      { label: '前往宗门', next: 'sect_home' },
      { label: '前往斗法台', next: 'arena_hall' },
      { label: '离开洞府', next: 'inner_gate' },
    ],
  },

  cave_manage: {
    title: '灵田管理',
    text: '灵田之中灵气充沛，正是种植灵药、升级洞府的好地方。',
    cave: true,
  },

  // ===== 宗门系统 =====
  sect_home: {
    title: '宗门',
    dynamicText: (s) => {
      if (!s.sect) return '你还未加入任何宗门。拜入一方势力，可获得宗门加成、接任务赚贡献、兑换资源。';
      const sect = SECTS[s.sect];
      return `你现属【${sect.icon} ${sect.name}】，贡献 ${s.contribution} 点。\n${sect.desc}`;
    },
    choices: [
      { label: '加入青云宗', action: (s) => joinSect(s, 'qingyun'), next: 'sect_home', req: (s) => !s.sect },
      { label: '加入丹霞谷', action: (s) => joinSect(s, 'danxia'), next: 'sect_home', req: (s) => !s.sect },
      { label: '加入天魔教', action: (s) => joinSect(s, 'tianmo'), next: 'sect_home', req: (s) => !s.sect },
      { label: '宗门任务', next: 'sect_tasks', req: (s) => !!s.sect },
      { label: '贡献商店', next: 'sect_shop', req: (s) => !!s.sect },
      { label: '转换门派 / 成为散修（1000贡献）', next: 'sect_transfer', req: (s) => !!s.sect },
      { label: '返回洞府', next: 'cave_home' },
    ],
  },

  sect_tasks: {
    title: '宗门任务',
    text: '宗门发布的任务，完成后可获得贡献值。',
    sectTasks: true,
  },

  sect_shop: {
    title: '贡献商店',
    text: '用宗门贡献兑换珍稀资源。',
    sectShop: true,
  },

  sect_transfer: {
    title: '转换门派',
    text: '消耗 1000 宗门贡献可改投其他宗门，或脱离宗门成为散修。旧宗门绝学将保留但被封禁，改投后将获得新宗门绝学。',
    sectTransfer: true,
  },

  sect_leave: {
    title: '离开宗门',
    text: '你决定离开宗门，从此云游四方。',
    onEnter: (s) => {
      s.sect = null;
      s.contribution = 0;
    },
    choices: [
      { label: '返回洞府', next: 'cave_home' },
    ],
  },

  // ===== 竞技斗法 =====
  arena_hall: {
    title: '斗法台',
    dynamicText: (s) => {
      const a = s.arena || {};
      const tier = getArenaTier(a.score || 0);
      return `斗法台上，众修士各显神通。你当前积分 ${a.score || 0}，段位【${tier.tier}】，胜 ${a.wins || 0} 负 ${a.losses || 0}。`;
    },
    choices: [
      { label: '挑战同阶修士', next: 'arena_challenge' },
      { label: '查看天梯', next: 'arena_ladder' },
      { label: '返回洞府', next: 'cave_home' },
    ],
  },

  arena_challenge: {
    title: '斗法开始',
    text: '你登上斗法台，一位同阶修士也缓缓走出。',
    arena: true,
  },

  arena_win: {
    title: '斗法得胜',
    text: '你技高一筹，将对手击落台下，赢得满堂喝彩。',
    onEnter: (s) => {
      s.arena = s.arena || { score: 0, wins: 0, losses: 0 };
      const gain = 15 + Math.floor(Math.random() * 16);
      s.arena.score = (s.arena.score || 0) + gain;
      s.arena.wins = (s.arena.wins || 0) + 1;
      const stone = 50 + Math.floor(Math.random() * 50);
      s.stone += stone;
      s.fame += 10;
      s.hp = s.maxHp;
      if (s.arena.wins >= 10) grantAchievement('arena_win10');
      if (s.arena.score >= 300) grantAchievement('arena_tier');
      setNodeText(`你赢得胜利！斗法积分 +${gain}，灵石 +${stone}，名望 +10。`);
    },
    choices: [
      { label: '继续挑战', next: 'arena_challenge' },
      { label: '返回斗法台', next: 'arena_hall' },
    ],
  },

  arena_lose: {
    title: '斗法落败',
    text: '你一招不慎，被对手击退。斗法点到为止，未曾受重伤。',
    onEnter: (s) => {
      s.arena = s.arena || { score: 0, wins: 0, losses: 0 };
      s.arena.score = Math.max(0, (s.arena.score || 0) - 5);
      s.arena.losses = (s.arena.losses || 0) + 1;
      s.hp = s.maxHp;
      setNodeText(`你落败了。斗法积分 -5，好在点到为止。`);
    },
    choices: [
      { label: '再战一场', next: 'arena_challenge' },
      { label: '返回斗法台', next: 'arena_hall' },
    ],
  },

  arena_ladder: {
    title: '天梯榜',
    dynamicText: (s) => getArenaLadderText(s),
    choices: [
      { label: '返回斗法台', next: 'arena_hall' },
    ],
  },

  // ===== 心魔试炼 =====
  xinmo_enter: {
    title: '静心打坐',
    dynamicText: (s) => {
      const m = getMindInfo(s);
      return `你欲静心凝神，斩却心中杂念。\n（当前心境 ${m.xinjing}，全属性 +${m.bonus}，气血 +${m.hpBonus}）`;
    },
    choices: [
      { label: '开始静心（随机遭遇心魔）', action: (s) => { triggerXinmo(s); } },
      { label: '返回洞府', next: 'cave_home' },
    ],
  },

  xinmo_event: {
    title: '心魔作祟',
    dynamicText: (s) => {
      const ev = Game.currentXinmo;
      return ev ? `【${ev.title}】\n${ev.text}` : '心魔已散，如梦幻泡影。';
    },
    xinmo: true,
  },

  xinmo_result: {
    title: '心境之悟',
    dynamicText: (s) => {
      const r = Game.xinmoResult;
      return r ? r : '你心境已有所变化。';
    },
    choices: [
      { label: '继续静心', next: 'xinmo_enter' },
      { label: '返回洞府', next: 'cave_home' },
    ],
  },

  xinmo_battle: {
    title: '心魔劫',
    text: '刹那间，你心中的执念化作一个与你一模一样的黑影，狰狞地扑了过来！',
    xinmoBattle: true,
  },

  xinmo_battle_win: {
    title: '斩却心魔',
    text: '你一剑斩灭心魔，道心愈发澄澈。',
    onEnter: (s) => {
      s.mind = s.mind || { xinjing: 0 };
      s.mind.xinjing += 30;
      s.hp = s.maxHp;
      realignRealm(s);
      grantAchievement('xinmo_win');
      if (s.mind.xinjing >= 100) grantAchievement('xinjing_100');
      setNodeText(`你斩灭心魔，道心澄澈！心境 +30（当前 ${s.mind.xinjing}）。`);
    },
    choices: [
      { label: '继续静心', next: 'xinmo_enter' },
      { label: '返回洞府', next: 'cave_home' },
    ],
  },

  xinmo_battle_lose: {
    title: '心魔反噬',
    text: '你心神失守，被心魔压制，好在及时稳住了道心。',
    onEnter: (s) => {
      s.mind = s.mind || { xinjing: 0 };
      s.mind.xinjing = Math.max(0, (s.mind.xinjing || 0) - 5);
      s.hp = s.maxHp;
      realignRealm(s);
      setNodeText('你被心魔反噬，心境 -5。稳住道心，方能再战。');
    },
    choices: [
      { label: '继续静心', next: 'xinmo_enter' },
      { label: '返回洞府', next: 'cave_home' },
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
  'Q7K2MX9T': { stone: 100000 },
  'JZYHQQS4': { stone: 1000000 },
  'SOMETHINGFORNOTHING': { tribulationBlessing: true },
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
