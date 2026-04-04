# Second Batch Integration Plan

## 1. 目的

把第二批选中的 3 个 bot：
- `clawd-submarine-drifter`
- `clawd-night-train-watcher`
- `clawd-dusk-dancer`

从“文档候选”推进到“当前项目里可接入的对象”。

这份方案只追求：
- 最小改动
- 先跑起来
- 不破坏现有 prototype page 结构

而不是一次性做完所有专属动画和 shared room 逻辑。

---

## 2. 当前最小接入点

当前最自然的接入点仍然是：
- `src/data/botSceneMap.ts`

因为它已经承担：
- `song ↔ bot` 映射
- `BOT_SCENE_VISUALS`
- `buildBotSceneConfigs()`

所以第二批最小接入并不需要重写页面，
而只需要把新歌先接进这层 config。

---

## 3. 需要新增的两块内容

### 3.1 新增 `FALLBACK_BOT_SCENE_ENTRIES` 条目
新增：
- `Submarine`
- `夜车`
- `踊り子`

每个条目至少包含：
- `songId`
- `songTitle`
- `artist`
- `botId`
- `botRole`
- `lyricSurface`
- `resolvedSong: null`

### 3.2 新增 `BOT_SCENE_VISUALS` preset
新增 key：
- `clawd-submarine-drifter`
- `clawd-night-train-watcher`
- `clawd-dusk-dancer`

每个 preset 至少包含：
- `animationFile`
- `colorAccent`
- `colorBg`
- `lyricStyle`
- `lyricPosition`
- `playerPosition`

---

## 4. animationFile 的最小策略

这里不要一上来就卡死在“必须先做三支全新动画”。

### 建议策略
先允许 animationFile 分两档：

#### 档 A：专属动画已存在
直接指向：
- `/clawd-animations/clawd-submarine-drifter.html`
- `/clawd-animations/clawd-night-train-watcher.html`
- `/clawd-animations/clawd-dusk-dancer.html`

#### 档 B：专属动画未存在时
允许临时复用 archetype 接近的旧动画：
- `Submarine` 可先借用 `clawd-lunar-goddess` 的慢显现/漂浮气质，后续替换
- `夜车` 可先借用 `clawd-rain-waiter` 的慢动作/等待气质，后续替换
- `踊り子` 可先借用 `clawd-spring-traveler` 的移动感占位，后续替换

### 意义
先把 page-level prototype 跑起来，
再逐步替换为专属背景动画。

---

## 5. 推荐的具体占位映射

### `clawd-submarine-drifter`
#### 推荐先接
```ts
animationFile: '/clawd-animations/clawd-submarine-drifter.html'
```

#### 如果文件暂时不存在
先临时指向：
```ts
animationFile: '/clawd-animations/clawd-lunar-goddess.html'
```

原因：
- 都偏缓慢、非地面移动
- 都更适合漂浮/显现型气质

---

### `clawd-night-train-watcher`
#### 推荐先接
```ts
animationFile: '/clawd-animations/clawd-night-train-watcher.html'
```

#### 如果文件暂时不存在
先临时指向：
```ts
animationFile: '/clawd-animations/clawd-rain-waiter.html'
```

原因：
- 都偏等待/凝望/克制
- 雨中停顿的节奏比其他 archetype 更接近夜车的被动前行感

---

### `clawd-dusk-dancer`
#### 推荐先接
```ts
animationFile: '/clawd-animations/clawd-dusk-dancer.html'
```

#### 如果文件暂时不存在
先临时指向：
```ts
animationFile: '/clawd-animations/clawd-spring-traveler.html'
```

原因：
- 先借一点位移动势
- 后续再替换成更轻舞的小幅旋转 archetype

---

## 6. lyrics / player 层为什么现在就能复用

当前这两个组件已经足够承接第二批：
- `BotLyricsLayer.tsx`
- `BotPlayerPanel.tsx`

### 原因
它们依赖的已经是 config：
- `lyricStyle`
- `lyricPosition`
- `playerPosition`
- `colorAccent`

所以第二批要做的不是重写组件，
而是给它们更多配置输入。

换句话说：
> 当前最小接入的关键，是补 config，不是改组件。

---

## 7. 推荐的接入顺序

### Step 1
先在 `botSceneMap.ts` 里加 3 个新 `botId` 的 visual preset

### Step 2
加 3 条 fallback scene entries

### Step 3
让 `BotPrototypesPage` 能切到这 3 页

### Step 4
如果对应动画文件不存在，先允许临时复用旧 archetype 文件

### Step 5
等页面能跑之后，再补专属动画文件

---

## 8. 成功标准

第二批接入成功，不等于三页已经完美。

成功标准应该是：
- 三首歌可以进入当前 prototype page 系统
- 页面 mood 已经明显不同
- 歌词和 player 能正常挂上
- 没有为了第二批重写整套结构

---

## 9. 一句话结论

> 第二批最合理的接入方式，不是先把 `Submarine`、`夜车`、`踊り子` 的所有专属动画和场景都做完，而是先把它们作为新的 `botSceneMap.ts` config 对象接进现有 prototype page 骨架：visual preset 先补齐，animationFile 允许临时复用相近 archetype，先让页面系统扩容，再逐步替换成专属动画。
