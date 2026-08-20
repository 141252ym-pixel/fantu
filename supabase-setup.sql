-- ============================================================================
-- 凡途修仙 · 全球排行榜 后端建表脚本
--
-- 用法：Supabase Dashboard → 左侧 SQL Editor → New query → 粘贴本文件全文 → Run
-- 本脚本可重复执行（幂等），改完再跑一遍即可。
--
-- 设计要点：
--   1. 一张表存全部玩家，三个榜只是同一份数据的三种 ORDER BY
--   2. 启用 RLS 且不建任何 policy ⇒ 前端拿着公开 key 也无法直连读写这张表
--   3. 前端只能调下面两个 SECURITY DEFINER 函数，所有规则由服务端掌握
--      （等价于 Edge Function 网关的效果，但不需要装 CLI 部署）
-- ============================================================================


-- ---------------------------------------------------------------------------
-- 1. 主表
-- ---------------------------------------------------------------------------
create table if not exists public.fantu_leaderboard (
  player_id     text primary key,                          -- 游戏内 getPlayerId()，形如 F7K2MX9
  secret        uuid not null default gen_random_uuid(),    -- 写入凭证，首次登榜时下发给前端
  nickname      text not null,
  realm_index   int    not null default 0,                  -- 境界索引
  xp            bigint not null default 0,                  -- 修为
  power         bigint not null default 0,                  -- 总战力
  mijing_best   int    not null default 0,                  -- 秘境最高层
  reincarnation int    not null default 0,                  -- 转世次数
  title         text,                                       -- 当前佩戴称号
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- 基础防作弊：超出理论范围的数值直接被数据库拒绝
  constraint ck_lb_pid   check (player_id ~ '^F[A-Z0-9]{6}$'),
  constraint ck_lb_nick  check (char_length(nickname) between 1 and 12),
  constraint ck_lb_realm check (realm_index   between 0 and 500),
  constraint ck_lb_xp    check (xp            between 0 and 1000000000000000),
  constraint ck_lb_power check (power         between 0 and 1000000000000),
  constraint ck_lb_mj    check (mijing_best   between 0 and 1000),
  constraint ck_lb_rein  check (reincarnation between 0 and 9999),
  constraint ck_lb_title check (title is null or char_length(title) <= 16)
);

-- 三个榜各一个覆盖索引
create index if not exists idx_lb_realm
  on public.fantu_leaderboard (reincarnation desc, realm_index desc, xp desc);
create index if not exists idx_lb_power
  on public.fantu_leaderboard (power desc, realm_index desc);
create index if not exists idx_lb_mijing
  on public.fantu_leaderboard (mijing_best desc, realm_index desc);


-- ---------------------------------------------------------------------------
-- 2. RLS：开启但不建 policy，等于对匿名客户端彻底关门
-- ---------------------------------------------------------------------------
alter table public.fantu_leaderboard enable row level security;
revoke all on public.fantu_leaderboard from anon, authenticated;


-- ---------------------------------------------------------------------------
-- 3. 昵称清洗
-- ---------------------------------------------------------------------------
create or replace function public.fantu_clean_nick(p_text text)
returns text
language plpgsql
immutable
as $$
declare
  v text;
begin
  v := coalesce(p_text, '');
  v := regexp_replace(v, '[[:cntrl:]]', '', 'g');  -- 去控制字符（换行/制表等）
  v := regexp_replace(v, '[<>]', '', 'g');         -- 去尖括号，前端渲染的第二道保险
  v := btrim(v);
  if char_length(v) > 12 then
    v := left(v, 12);
  end if;
  if char_length(v) = 0 then
    v := '无名道友';
  end if;
  return v;
end;
$$;


-- ---------------------------------------------------------------------------
-- 4. 上传成绩（前端唯一写入口）
--
--    首次调用   → insert，返回 secret 让前端存好
--    后续调用   → secret 必须匹配，否则拒绝（别人无法覆盖你的成绩）
--    20 秒内重复 → 静默跳过，返回 ok 但不写库
-- ---------------------------------------------------------------------------
create or replace function public.fantu_submit(
  p_pid    text,
  p_secret text,
  p_nick   text,
  p_realm  int,
  p_xp     bigint,
  p_power  bigint,
  p_mijing int,
  p_rein   int,
  p_title  text default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row   public.fantu_leaderboard%rowtype;
  v_nick  text;
  v_title text;
  v_sec   uuid;
begin
  if p_pid is null or p_pid !~ '^F[A-Z0-9]{6}$' then
    return json_build_object('ok', false, 'error', 'bad_player_id');
  end if;

  v_nick  := public.fantu_clean_nick(p_nick);
  v_title := nullif(left(regexp_replace(coalesce(p_title, ''), '[[:cntrl:]<>]', '', 'g'), 16), '');

  select * into v_row from public.fantu_leaderboard where player_id = p_pid;

  -- 首次登榜
  if not found then
    insert into public.fantu_leaderboard
      (player_id, nickname, realm_index, xp, power, mijing_best, reincarnation, title)
    values (
      p_pid,
      v_nick,
      least(greatest(coalesce(p_realm,  0), 0), 500),
      least(greatest(coalesce(p_xp,     0), 0), 1000000000000000),
      least(greatest(coalesce(p_power,  0), 0), 1000000000000),
      least(greatest(coalesce(p_mijing, 0), 0), 1000),
      least(greatest(coalesce(p_rein,   0), 0), 9999),
      v_title
    )
    returning secret into v_sec;
    return json_build_object('ok', true, 'created', true, 'secret', v_sec);
  end if;

  -- 老玩家必须持有正确凭证
  if p_secret is null or p_secret = '' or v_row.secret::text <> p_secret then
    return json_build_object('ok', false, 'error', 'bad_secret');
  end if;

  -- 写入频率限制
  if now() - v_row.updated_at < interval '20 seconds' then
    return json_build_object('ok', true, 'throttled', true, 'secret', v_row.secret);
  end if;

  update public.fantu_leaderboard set
    nickname      = v_nick,
    realm_index   = least(greatest(coalesce(p_realm,  0), 0), 500),
    xp            = least(greatest(coalesce(p_xp,     0), 0), 1000000000000000),
    power         = least(greatest(coalesce(p_power,  0), 0), 1000000000000),
    mijing_best   = least(greatest(coalesce(p_mijing, 0), 0), 1000),
    reincarnation = least(greatest(coalesce(p_rein,   0), 0), 9999),
    title         = v_title,
    updated_at    = now()
  where player_id = p_pid;

  return json_build_object('ok', true, 'secret', v_row.secret);
end;
$$;


-- ---------------------------------------------------------------------------
-- 5. 拉榜单（前端唯一读入口）
--
--    一次请求同时返回：前 100 名 + 自己的排名 + 总人数
--    返回内容不含 secret 列
-- ---------------------------------------------------------------------------
create or replace function public.fantu_board(
  p_board text default 'realm',
  p_pid   text default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order text;
  v_json  json;
begin
  -- 白名单，p_board 只用来选排序表达式，无注入面
  v_order := case p_board
    when 'realm'  then 'reincarnation desc, realm_index desc, xp desc, updated_at asc'
    when 'power'  then 'power desc, realm_index desc, updated_at asc'
    when 'mijing' then 'mijing_best desc, realm_index desc, updated_at asc'
    else null
  end;

  if v_order is null then
    return json_build_object('ok', false, 'error', 'bad_board');
  end if;

  execute format($f$
    with ranked as (
      select player_id, nickname, realm_index, xp, power, mijing_best,
             reincarnation, title,
             row_number() over (order by %s) as rank
      from public.fantu_leaderboard
    )
    select json_build_object(
      'ok',    true,
      'board', %L,
      'total', (select count(*) from ranked),
      'top',   (select coalesce(json_agg(t order by t.rank), '[]'::json)
                from (select * from ranked where rank <= 100) t),
      'me',    (select row_to_json(m)
                from (select * from ranked where player_id = %L) m)
    )
  $f$, v_order, p_board, coalesce(p_pid, '')) into v_json;

  return v_json;
end;
$$;


-- ---------------------------------------------------------------------------
-- 6. 只把这两个函数的执行权限开给匿名客户端
-- ---------------------------------------------------------------------------
revoke all on function public.fantu_submit(text,text,text,int,bigint,bigint,int,int,text) from public;
revoke all on function public.fantu_board(text,text) from public;

grant execute on function public.fantu_submit(text,text,text,int,bigint,bigint,int,int,text) to anon, authenticated;
grant execute on function public.fantu_board(text,text) to anon, authenticated;


-- ---------------------------------------------------------------------------
-- 跑完可以用这句自测（应返回 {"ok":true,"board":"realm","total":0,"top":[],"me":null}）
--   select public.fantu_board('realm', null);
-- ---------------------------------------------------------------------------
