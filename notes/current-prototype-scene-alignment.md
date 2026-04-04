# Current Prototype Scene Alignment

## 1. 目的

这份文档用于回答一个很实际的问题：

> 当前 `musik-nacht` 已实现的 bot prototype scenes，如何对齐到新的 `musik-nacht-scene-bridge` skill 所定义的结构？

重点不是推翻现有实现，而是看清：
- 当前已经具备哪些结构
- 哪些地方还是写死的
- 下一步如何往 spec-driven scene system 迁移

---

## 2. 当前已存在的实现骨架

从现有代码看，prototype scene 这条线已经有了三块基础：

### 2.1 `src/data/botSceneMap.ts`
当前承担的角色：
- 保存 song ↔ bot 的映射
- 保存 lyric surface 的基础信息
- 保存不同 bot 的视觉配置
- 产出 `BotSceneConfig`

可以理解为：
> 当前的一版轻量 scene spec 层

但它目前的问题是：
- 仍然偏前端实现配置
- `visual` 与 `spec` 混在一起
- 缺少更明确的 `environment / player / sharedRoomHint` 结构

### 2.2 `src/prototypes/BotPrototypesPage.tsx`
当前承担的角色：
- 读取 `bot-song-map`
- 切换不同 prototype scene
- 提供 prototype 浏览壳

可以理解为：
> 当前的一版 prototype scene gallery / shell

这已经很接近 `PrototypeSongSceneFrame` 的上层容器思路了。

### 2.3 `BotScenePrototype`（未在本次阅读中展开）
从 `BotPrototypesPage` 可以推断，当前应承担：
- 单个 prototype scene 的实际渲染
- bot 动画 / 歌词 / 播放器的局部组织

它很可能是当前最接近“多职责混在一起”的地方。

---

## 3. 和新 skill 结构的对应关系

根据新 skill 的推荐模型：

```ts
PrototypeSongScene = {
  environmentLayer,
  botLayer,
  lyricLayer,
  playerLayer
}
```

当前实现可大致映射为：

### 3.1 当前已有的
- `BotPrototypesPage` ≈ prototype scene 外层浏览容器
- `botSceneMap.ts` ≈ 一版轻量 spec/config 层
- `BotScenePrototype` ≈ 把 4 层都揉在一起的单文件实现

### 3.2 当前缺少的明确分层
- `SceneEnvironmentLayer`
- `SceneBotLayer`
- `SceneLyricSurface`
- `ScenePlayerObject`
- `PrototypeSongSceneFrame`

也就是说：

> 当前不是没有结构，而是结构还没有被拆出来。

---

## 4. 当前实现里最值得保留的部分

### 4.1 `botSceneMap.ts` 里的 song ↔ bot 基础映射
这些字段已经很有价值：
- `songId`
- `songTitle`
- `artist`
- `botId`
- `botRole`
- `lyricSurface`

它们可以继续保留，但后续应该逐步和 `notes/clawd-bot-song-map.json` / scene spec 对齐。

### 4.2 `BOT_SCENE_VISUALS`
这块虽然当前偏硬编码，但并不是废的。
它其实相当于：
- 第一版视觉模式配置
- 每个 bot 的 prototype visual preset

后面可以拆分为：
- visual presets
- palette hints
- default layer placement hints

### 4.3 `BotPrototypesPage`
这个容器也值得保留。
未来它可以继续作为：
- prototype song scene 浏览入口
- song prototype QA 页面
- shared room 出现前的验证场

---

## 5. 当前最明显的问题

### 5.1 spec 与 implementation config 混在一起
例如：
- `animationFile`
- `colorAccent`
- `playerPosition`
- `lyricPosition`

这些更像前端实现细节，不应该和 song-scene identity 长期混放在同一层。

### 5.2 `lyricSurface` 已有，但缺少独立组件语义
现在它更像“给一些位置信息”，
还没真正变成：
- 一种 surface type
- 一套 reveal behavior
- 一个独立可替换的 scene layer

### 5.3 player / lyric / bot / environment 还没有显式分层
这会导致：
- 新增歌曲时容易复制粘贴
- 后面合并成 shared room 时难以拆卸

---

## 6. 推荐的下一步对齐方式

### 6.1 保留现有页面入口
保留：
- `BotPrototypesPage`

### 6.2 把 `BotScenePrototype` 逐步拆成 4 层
目标组件：
- `PrototypeSongSceneFrame`
- `SceneEnvironmentLayer`
- `SceneBotLayer`
- `SceneLyricSurface`
- `ScenePlayerObject`

### 6.3 让 `botSceneMap.ts` 逐步从“硬编码 config”转向“scene spec adapter”
也就是说，它未来不一定要继续手写所有值，而可以变成：
- 读取 `clawd-bot-song-map.json`
- 归一化为前端可消费结构
- 补默认 visual preset

### 6.4 把当前 3 个 prototype 理解为未来 shared room zones
- `春を待って` → `entry-window-lane`
- `いつも雨` → `rain-lamp-corner`
- `La lune` → `upper-lunar-platform`

这样现在的工作就不是“临时 demo”，而是 shared room 的前置分区开发。

---

## 7. 和新 skill 的实际关系

新建的 `musik-nacht-scene-bridge` skill 不应该直接替代当前代码，
而应该提供：

1. scene spec schema
2. merge path
3. component patterns
4. example spec

然后反过来指导当前代码继续重构。

换句话说：

> skill 负责定义系统语言，项目代码负责把它实现出来。

---

## 8. 一句话结论

当前 `musik-nacht` 的 prototype 实现已经隐含了一版 scene system，只是它还停留在“配置 + 单组件实现”的阶段。下一步最合理的方向不是推翻，而是用 `musik-nacht-scene-bridge` skill 提供的 schema 和 component patterns，把现有原型逐步拆成 `environment / bot / lyric / player` 四层，并为 shared multi-bot room 做准备。
