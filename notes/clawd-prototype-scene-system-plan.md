# Clawd Prototype Scene System Plan

## 1. 当前结论

这一轮 prototype 已经验证了一件关键的事：

> 歌曲 → bot → 小场景 这条桥是成立的。

现在的重点不再是“能不能做出单个场景”，而是：

1. 如何把已有的 3 个 prototype scene 抽象成一个统一系统
2. 如何让后续新增歌曲不需要重复发明结构
3. 如何为最终“多个 bot 共处一个 shared room scene”保留清晰的合并路径

当前已有原型：
- `春を待って`
- `いつも雨`
- `La lune`

它们已经分别对应了不同空间原型：
- 门边 / 走道 / 出发区
- 雨幕 / 路灯 / 等待区
- 高位 / 月光 / 仪式区

这些 prototype 不应被视为一次性 demo，而应被视为未来 shared scene 的基础单元。

---

## 2. 下一步目标

下一步不是继续无节制地增加更多歌曲场景，而是先把现有 3 个 prototype 提炼成一套 **可扩展的 scene system**。

这个 system 应当做到：

- 同一套组件骨架可复用
- 每首歌只通过配置定义差异
- 场景结构仍然保留歌曲人格
- 后续可以自然迁移到 shared multi-bot room

---

## 3. 推荐系统结构

建议把每个 prototype scene 拆成四层：

```ts
PrototypeSongScene = {
  environmentLayer,
  botLayer,
  lyricLayer,
  playerLayer
}
```

### 3.1 environmentLayer
负责定义这首歌所在的小空间气候与气质。

包含：
- 背景色 / 光线主色
- 空间类型（entry / rain corner / lunar altar）
- 粒子或环境动态（雨、雾、月光、漂浮粒子）
- 地面/墙面/窗面等基础承载物

### 3.2 botLayer
负责承载 Clawd 作为这首歌化身的行为。

包含：
- bot sprite / billboard / texture
- 道具（包、小灯、月光冠、雨下站位等）
- phase-driven motion
- playback 状态下的 active / idle 变化

### 3.3 lyricLayer
负责将歌词作为“空间中的发声方式”而不是 overlay UI。

包含：
- lyric surface type
- placement
- reveal style
- 动态透明度 / 漂浮方式 / 投影方式

### 3.4 playerLayer
负责承载歌曲当前可交互的播放器装置。

包含：
- cover art
- play / pause controls
- 进度或状态反馈（如有）
- 与 local player bridge 的绑定

---

## 4. 统一组件建议

建议开始从现有 prototype 中抽出这些通用组件：

### 4.1 `PrototypeSongSceneFrame`
作用：
- 提供每个独立 prototype scene 的统一外壳
- 接收 song scene spec
- 装配 environment / bot / lyric / player 四层

建议接口：

```ts
type PrototypeSongSceneFrameProps = {
  spec: ClawdSongSceneSpec
  playerState: 'playing' | 'paused' | 'stopped'
  selected: boolean
}
```

### 4.2 `SceneEnvironmentLayer`
根据 spec.environment 渲染：
- 雨后门边
- 路灯雨幕
- 月光祭台

### 4.3 `SceneBotLayer`
根据 spec.bot 渲染：
- Clawd 主体
- 道具
- 基本 motion phases
- 可先用轻量 sprite/billboard 实现

### 4.4 `SceneLyricSurface`
根据 spec.lyricSurface 渲染：
- 雾窗文字
- 雨玻璃反光文字
- 月光铭文

### 4.5 `ScenePlayerObject`
根据 spec.playerPlacement 渲染：
- bench radio
- signal box
- altar console

该组件统一负责：
- cover art
- play / pause
- bridge 调用

---

## 5. 配置优先，而不是硬编码优先

后续不应为每首歌新写一套完全不同的 scene 组件。

更好的方向是：

```ts
ClawdSongSceneSpec = {
  id,
  songId,
  songTitle,
  artist,
  theme,
  prompt,
  lyricIntent,
  environment,
  bot,
  lyricSurface,
  playerPlacement,
  playbackBinding,
  phaseHints,
}
```

### 5.1 适合写进 spec 的内容
- 歌曲与 bot 对应关系
- 主色调
- 空间类型
- lyric surface 类型
- player object 类型
- playback state 文案与动画描述
- phase hints

### 5.2 不适合写进 spec 的内容
- 具体 three 组件细节
- 每一帧怎么动
- 过细的 geometry 实现

spec 要描述“是什么”，而不是“每行代码怎么写”。

---

## 6. 对现有 3 个 scene 的系统化理解

### 6.1 春を待って
#### 本质
- 初春旅人
- 雨后犹豫地出发

#### 系统标签
- environment: `rainy-early-spring-entry`
- bot mode: `traveler`
- lyric surface: `fog-window`
- player object: `bench-radio`

#### shared scene 中未来位置
- 门边 / 走道 / 靠窗入口区域

### 6.2 いつも雨
#### 本质
- 雨中等待
- 一直走，一直错过

#### 系统标签
- environment: `night-rain-lamp-corner`
- bot mode: `rain-waiter`
- lyric surface: `rain-glass-projection`
- player object: `signal-box-or-window-radio`

#### shared scene 中未来位置
- 路灯区 / 雨幕区 / 反光地面区域

### 6.3 La lune
#### 本质
- 月桂女神 / 高位夜之使者
- 不赶路，而是调场域

#### 系统标签
- environment: `upper-blue-night-altar`
- bot mode: `lunar-goddess`
- lyric surface: `moonlight-glyph`
- player object: `altar-console`

#### shared scene 中未来位置
- 高位平台 / 中庭上层 / 月光祭台区域

---

## 7. 从 prototype 到 shared room 的合并路径

最终 shared multi-bot room scene 不应推翻当前成果，而应：

### Phase A：保留独立 prototype scene
- 继续作为验证单元
- 继续可单独调试和观看

### Phase B：抽公共层
- 抽环境组件
- 抽 bot 组件
- 抽歌词组件
- 抽播放器对象组件

### Phase C：引入 `zone composition`
shared room 不是直接塞 3 个网页，而是把它们转成：
- entry zone
- rain zone
- lunar zone

### Phase D：统一共享播放器逻辑
从每个 prototype 各自一个 player object，逐步收束成：
- 一个全局音频系统
- 多个局部“播放装置”作为视觉化节点

### Phase E：bot 共处但不同活跃度
shared room 中：
- 当前歌曲对应 bot = fully active
- 非当前 bot = ambient idle
- 场域型 bot（如 La lune）可影响更大范围光效

---

## 8. 下一轮实现建议

下一轮 Claude Code 的任务重点应是：

1. 不再新增更多 prototype songs
2. 从现有 3 个 scene 中抽出统一结构
3. 建立一套可复用的 scene spec → component pipeline
4. 保持未来合并到 shared room 的清晰路径

建议下一轮的成功标准：

- 新增第 4 首歌时，主要改的是 JSON / spec，而不是重新写一套场景
- 现有 3 个 prototype 的结构更统一
- scene components 的职责清晰，不互相缠绕

---

## 9. 一句话北极星

> 现有的 Clawd prototype scenes 不应停留在“每首歌一个漂亮 demo”，而应被提炼成一套可扩展的 song-scene system：让每首歌通过配置驱动 bot、歌词表面、播放器物件和小环境，并最终自然合并进一个 shared multi-bot night room。
