# Batch Song Prototype Generation Plan

## 1. 目标

建立一条稳定的批量通路：

> 获取更多可播歌曲 → 为每首歌匹配 bot archetype / scene brief → 继续按“每页一首歌 + 对应动画 + 歌词 + 播放器”的形式批量生成 prototype pages。

重点不是一次性做大量漂亮 demo，而是建立一个：
- 可扩展
- 可筛选
- 不会把项目结构搞乱
的 prototype 生成带。

---

## 2. 产物形式

每首歌输出一个单独 prototype page，保持当前已经验证成功的结构：

- 一个歌曲对应的页面
- 一个主 bot / Clawd archetype
- 一个背景动画或氛围动画层
- 一个歌词 surface
- 一个歌曲播放器组件

这类页面仍然是：
> song scene prototype

而不是最终 shared room。

---

## 3. 输入来源

优先复用项目已有 bridge，而不是新开入口。

当前可直接利用：
- `/api/library/random-liked-playable?count=...`
- `/api/library/lyrics?songId=...`
- `/api/library/bot-song-map`
- `loadFavoritePlayableSongs()`（vite.config.ts 内）

### 实际意义
项目已经具备：
- 获取红心可播歌曲
- 获取歌词
- 获取 bot-song 映射

所以批量阶段真正要补的不是数据入口，而是：
- 筛选逻辑
- archetype 分配逻辑
- page 生成逻辑

---

## 4. 批量阶段推荐规模

### 第一批
建议先做：
- 6 首
或
- 9 首

### 原因
太少看不出系统性，太多则容易模板味太重。

---

## 5. 批量生成的核心原则

### 5.1 先做 archetype 复用，不追求每首歌都完全独创
批量阶段不应该为每首歌重新发明一整套视觉语言。

应先建立有限 archetype：
- `traveler`
- `rain-waiter`
- `lunar`
- `dreamer`
- `watcher`
- `dancer`
- `drifter`

然后让更多歌曲先落在这些 archetype 上。

### 5.2 歌词和播放器必须继续保留
这一批量化工作不能退化成“纯动画页面”。

因为当前 prototype 的价值正在于：
- 歌曲
- bot
- 歌词
- 播放器
- 小环境

这五者一起成立。

### 5.3 不要把批量变成换皮流水线
如果只是同一个页面换封面和文案，系统会失去意义。

因此至少应让下列变量可变化：
- background mood
- lyric surface type
- bot archetype
- accent color
- animation source / scene brief

---

## 6. 推荐的批量 pipeline

### Stage A：拿歌
从红心可播池中取更多样本。

### Stage B：初筛
过滤掉：
- 无歌词 / 纯音乐（如果本轮要保歌词层）
- 标题和整体意向太弱的
- 与已有 prototype mood 过于重复的

### Stage C：分 archetype
为每首歌分配：
- bot archetype
- lyric surface type
- environment mode
- accent palette

### Stage D：生成 song-scene spec
将每首歌写入统一 spec：
- song metadata
- bot role
- prompt
- phase hints
- playback binding
- lyric surface
- scene prototype

### Stage E：生成 prototype page
每首歌一个页面，继续沿用：
- Clawd / bot 动画层
- 歌词层
- 播放器层
- 背景环境层

### Stage F：人工复核
人工复核的重点不是 bug，而是：
- 有没有模板味
- 这首歌是否真的像它自己
- 哪些值得进入 shared room 候选池

---

## 7. 命名与存放建议

### 7.1 scene data
可放在：
- `notes/clawd-bot-song-map.json`（手工精选）
- 未来再拆出：`notes/batch-song-scene-map.json`

### 7.2 generated pages
建议统一落在：
- `public/song-prototypes/`

文件名建议：
- `spring-waiting-scene.html`
- `rain-waiting-scene.html`
- `lunar-altar-scene.html`
- `dream-window-scene.html`

### 7.3 visual archetype references
建议以后单独沉淀到：
- `notes/song-bot-archetypes.md`

---

## 8. 这条批量通路真正要验证什么

不是“能不能批量生成 HTML”，而是：

1. 更多可播歌曲能否稳定映射到有限 archetype
2. 每首歌是否能在同一套 page 结构下保留自己的气质
3. 哪些页面值得成为 future shared room 的 zone 候选

换句话说，批量工作的目的不是产量，而是：
> 建立未来 master room 的候选池和风格语言库。

---

## 9. 第一批建议 archetype 分配策略

建议优先覆盖差异较大的情绪谱系：
- 初春出发
- 雨夜等待
- 月光神性
- 梦游/发呆
- 轻快跳动
- 静观/凝视

这样第一批 page 不会全都长得太像。

---

## 10. 一句话结论

> 批量生成不是简单把更多歌变成更多 HTML，而是要建立一条 song → archetype → scene spec → prototype page 的稳定流水线，让更多可播歌曲先以“每页一首歌”的形式活起来，再从中挑选适合合并进 shared room 的角色与空间原型。
