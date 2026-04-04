# Selected Batch Visual Presets

## 1. 目的

把第二批选中的 3 首歌，再推进到一层更接近当前 `src/data/botSceneMap.ts` 的配置形式。

目标不是直接改代码，而是先把：
- animationFile
- colorAccent
- colorBg
- lyricStyle
- lyricPosition
- playerPosition

这些当前前端真正消费的字段，先用文档方式起草出来。

选中歌曲：
- `Submarine`
- `夜车`
- `踊り子`

---

## 2. `Submarine`

### scene identity
- botId: `clawd-submarine-drifter`
- archetype: `drifter`
- visual note: 水下夜色中的缓慢漂流，不是深海恐惧，而是低重力的微霓虹巡游。

### suggested visual preset

```ts
'clawd-submarine-drifter': {
  animationFile: '/clawd-animations/clawd-submarine-drifter.html',
  colorAccent: '#67C7C9',
  colorBg: '#07141A',
  lyricStyle: {
    color: '#B9F0EC',
    textShadow: '0 2px 14px rgba(103,199,201,0.38), 0 4px 28px rgba(0,0,0,0.78)',
    fontSize: 24,
    fontWeight: 400,
    letterSpacing: '0.05em',
  },
  lyricPosition: {
    top: '34%',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    maxWidth: 420,
  },
  playerPosition: {
    bottom: '36px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
}
```

### why this works
- `colorBg` 用深蓝绿，先把“潜航感”立住
- `colorAccent` 用 aqua，不做过亮 neon，避免夜店感
- 歌词层偏柔和发光字幕带
- player 仍放底部中央，保持现有页面骨架兼容

### implementation caution
- 背景动画要优先体现漂浮和气泡/流光，而不是“角色在走路”
- 如果 animation file 不可用，可先复用轻微漂浮 archetype 占位动画

---

## 3. `夜车`

### scene identity
- botId: `clawd-night-train-watcher`
- archetype: `watcher`
- visual note: 重点不是列车本体，而是车窗外掠过的灯和被带着前进的凝望。

### suggested visual preset

```ts
'clawd-night-train-watcher': {
  animationFile: '/clawd-animations/clawd-night-train-watcher.html',
  colorAccent: '#D3A86B',
  colorBg: '#060A10',
  lyricStyle: {
    color: '#E2C69A',
    textShadow: '0 2px 10px rgba(211,168,107,0.32), 0 4px 24px rgba(0,0,0,0.86)',
    fontSize: 23,
    fontWeight: 400,
    letterSpacing: '0.06em',
  },
  lyricPosition: {
    top: '30%',
    left: '54%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    maxWidth: 380,
  },
  playerPosition: {
    bottom: '36px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
}
```

### why this works
- `colorBg` 几乎接近黑夜车厢
- `colorAccent` 用 muted amber，像窗外掠过的钨丝灯光
- 歌词位置略偏中右，更像被窗边视线牵引，而不是页面正中宣告
- player 可以仍保留底中结构，但视觉上应更像座位边私人播放器

### implementation caution
- 如果后面把歌词做成窗面反光，`lyricPosition` 可能要再往侧边偏
- 动画不应太活跃；“被列车带动”比“角色主动表演”更重要

---

## 4. `踊り子`

### scene identity
- botId: `clawd-dusk-dancer`
- archetype: `dancer`
- visual note: 暖光中的亲密舞动，不是 show，而是沉浸式的小幅旋转与侧步。

### suggested visual preset

```ts
'clawd-dusk-dancer': {
  animationFile: '/clawd-animations/clawd-dusk-dancer.html',
  colorAccent: '#F0B27A',
  colorBg: '#140C0B',
  lyricStyle: {
    color: '#FFD9B8',
    textShadow: '0 2px 12px rgba(240,178,122,0.34), 0 4px 24px rgba(0,0,0,0.72)',
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: '0.04em',
  },
  lyricPosition: {
    top: '32%',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    maxWidth: 400,
  },
  playerPosition: {
    bottom: '36px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
}
```

### why this works
- `colorBg` 是暖暗背景，不要太亮，给黄昏灯影留空间
- `colorAccent` 偏 dusty amber / peach gold
- 歌词层要柔，不适合太锐利或太冷
- 保持现有页面骨架的同时，用色彩先把它与 `Submarine` / `夜车` 拉开

### implementation caution
- 动作要是小幅旋转、侧步、节奏停顿
- 一旦做成高能蹦跳，就会破坏这首歌的暧昧与克制

---

## 5. 三首歌对当前 `botSceneMap.ts` 的意义

当前 `botSceneMap.ts` 只有 3 首：
- `clawd-spring-traveler`
- `clawd-rain-waiter`
- `clawd-lunar-goddess`

这份文档补出的 3 个 preset 可以视作第二批新增候选：
- `clawd-submarine-drifter`
- `clawd-night-train-watcher`
- `clawd-dusk-dancer`

也就是说，如果要继续往代码层推进，第二批最自然的扩展不是再重新想命名，而是直接把这三套 preset 作为新增 key 接到 `BOT_SCENE_VISUALS`。

---

## 6. 推荐的最小落地顺序

### Step 1
先在数据层接受这三个新 `botId`

### Step 2
给它们预留 animationFile 路径
- 即使暂时还是占位或复用 archetype 动画，也先把 path 结构定下来

### Step 3
先用现有 `BotScenePrototype` 跑页面
- 验证颜色、歌词位置、player 位置、整体 page mood

### Step 4
再决定哪些值得补专属动画背景

---

## 7. 一句话结论

> `Submarine`、`夜车`、`踊り子` 已经可以被推进到接近 `botSceneMap.ts` 的 visual preset 层：只要为它们补齐 animationFile、color preset、lyric style 与 player placement，就能进入当前 prototype page 骨架，开始验证第二批页面是否成立。
