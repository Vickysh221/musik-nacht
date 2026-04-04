# Batch Song Prototype Pipeline Design

## 1. 目的

基于 `musik-nacht` 当前已经存在的 bridge 和 prototype 结构，设计一条：

- 输入：更多可播歌曲
- 输出：一批单歌 HTML / prototype pages

的实际 pipeline。

这份文档只基于当前项目现状来设计，不假设全新架构。

---

## 2. 当前项目已经具备的关键能力

### 2.1 可播歌曲获取
在 `vite.config.ts` 中，已经有：

- `loadFavoritePlayableSongs()`
- `/api/library/random-liked-playable`

这意味着项目已经能稳定从红心池中取出：
- liked
- playFlag = true
- 可直接用于当前播放器 bridge 的歌曲

### 2.2 歌词获取
已经有：
- `loadSongLyrics(songId)`
- `/api/library/lyrics?songId=...`

这意味着 prototype page 不需要自己重新发明歌词入口。

### 2.3 bot-song map
已经有：
- `notes/clawd-bot-song-map.json`
- `/api/library/bot-song-map`
- `src/data/botSceneMap.ts`

这已经是一版可运行的 song ↔ bot config 层。

### 2.4 页面结构
已经有：
- `BotPrototypesPage.tsx`
- `BotScenePrototype.tsx`
- `BotLyricsLayer.tsx`
- `BotPlayerPanel.tsx`
- `ClawtAnimationLayer`

这意味着当前系统已经具备：
> 单歌 prototype page 的基础页面骨架。

---

## 3. 当前最适合复用的 pipeline 骨架

推荐骨架：

```text
可播歌池
→ 初筛
→ archetype 分配
→ bot scene map 生成
→ buildBotSceneConfigs
→ BotPrototypesPage / 单歌入口
→ 每首歌一个 prototype page
```

---

## 4. 推荐新增的数据层

当前 `clawd-bot-song-map.json` 更偏精选手工数据。

如果要批量，建议新增一层：
- `notes/batch-song-scene-map.json`

作用：
- 存批量选中的更多歌曲
- 每首歌写入最小 scene spec
- 不污染手工精选的第一批 archetype 文件

### 建议字段

```json
[
  {
    "songId": "...",
    "songTitle": "...",
    "artist": "...",
    "botId": "...",
    "botRole": "...",
    "archetype": "traveler",
    "prompt": "...",
    "lyricIntent": "...",
    "sceneZone": "...",
    "phaseHints": ["..."],
    "lyricSurface": { "type": "...", "placement": "...", "style": "..." },
    "scenePrototype": { "sceneId": "...", "environment": "...", "playerPlacement": "...", "visualMood": "..." }
  }
]
```

---

## 5. archetype 分配层

批量阶段最关键的新增层是：
- `song -> archetype`

建议先手工/半手工建立少量 archetype：
- `traveler`
- `rain-waiter`
- `lunar`
- `dreamer`
- `watcher`
- `dancer`
- `drifter`

然后再给每首歌分配：
- archetype
- visual preset
- lyric surface type
- environment mode

### 这样做的原因
当前页面骨架是通的，
真正要变化的是：
- bot 身份
- 动画源
- 颜色与气氛
- 歌词 surface 类型

---

## 6. 当前代码上的最小改造路径

### 6.1 继续保留 `BotPrototypesPage`
作用：
- 浏览一批 prototype pages
- 左右切换
- 作为批量生成页面的 QA 入口

### 6.2 扩展 `botSceneMap.ts`
当前它只覆盖 3 首精选歌。

最小改造方向：
- 支持读取新的 `batch-song-scene-map.json`
- 将更多歌曲映射成 `BotSceneConfig`
- 把 visual presets 做成 archetype 驱动，而不是只写死 3 个 bot

### 6.3 继续复用 `BotScenePrototype`
短期内不需要立即推翻。

它现在可以继续承担：
- 一个单歌 scene 页面壳
- 组合动画层、歌词层、播放器层

批量阶段先要的是“更多歌能跑起来”，
不是先把内部全部重构完。

### 6.4 动画文件层
当前 `animationFile` 指向：
- `/clawd-animations/clawd-spring-traveler.html`
- `/clawd-animations/clawd-rain-waiter.html`
- `/clawd-animations/clawd-lunar-goddess.html`

批量阶段建议：
- 先允许多个歌曲复用同一 archetype 动画文件
- 后续再为高价值歌曲补专属动画

这样能快速扩大 prototype 数量。

---

## 7. 推荐的最小批量实现方案

### 第一步：先拿 6 首可播歌
来源：
- 红心可播池
- 最好歌词可用
- 情绪谱系尽量分散

### 第二步：为每首歌填最小 scene spec
只填：
- songId / title / artist
- archetype
- prompt
- lyricSurface
- environment
- playerPlacement

### 第三步：把 archetype 映射到 visual preset
例如：
- `traveler` -> warm dim / entry-walkway / lamp
- `rain-waiter` -> cool blue / wet reflection / lamp cone
- `lunar` -> silver blue / upper glow / glyph text

### 第四步：让 `BotPrototypesPage` 直接读这一批数据
此时你就得到：
- 一组可切换的单歌 prototype pages

---

## 8. 输出形式建议

### 方案 A：继续作为 app 内 prototype route
优点：
- 已经有现成页面壳
- 与 local player bridge、歌词 bridge 天然相连
- 更适合持续迭代

### 方案 B：每首歌再导出为独立 HTML
优点：
- 可单独分享和测试

但以当前项目状态看，
更适合优先做的是：
> 先在 app 内形成批量 prototype 集合

因为 bridge、歌词、播放器都已经在 app 内。

---

## 9. 当前最值得新增的文件/层

### 建议新增
- `notes/batch-song-scene-map.json`
- 一份 archetype 说明文档（后续可加）

### 暂时不用马上新增
- 全新播放器系统
- 全新歌词系统
- 全新 route 体系

因为现有结构足以承接第一批批量实验。

---

## 10. 一句话结论

> 以当前 `musik-nacht` 的实现状态，最合理的批量通路不是重新搭一套系统，而是复用现有的可播歌 bridge、歌词 bridge 和 prototype 页面骨架，新增一个批量 song-scene map 层，并通过 archetype 驱动 visual preset，让更多可播歌曲先以单歌 prototype pages 的形式成批跑起来。
