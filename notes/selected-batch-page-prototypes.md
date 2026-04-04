# Selected Batch Page Prototypes

## 1. 目的

把第二批里选中的 3 首歌，进一步推进成 **page-level prototype structure**。

这一步的目标不是直接写最终代码，而是把每首歌在页面层面的：
- 动画背景
- 歌词载体
- 播放器物件
- bot 动势
- archetype 视觉重点

整理清楚，确保它们已经足够接近可批量生成页面的输入。

选中歌曲：
- `Submarine`
- `夜车`
- `踊り子`

---

## 2. `Submarine`

### 基本定位
- archetype: `drifter`
- bot role: `潜航漂流 bot`
- 核心关键词：水下、缓慢漂浮、微霓虹、夜色、巡游

### page-level structure

#### Background animation
- 主背景是深蓝绿的水下空间
- 有轻微流动的光线条纹
- 气泡或漂浮粒子缓慢上升
- 背景不需要强叙事，重点是“漂浮中的夜色”

#### Bot motion
- bot 不是走路，而是缓慢漂移
- 每隔一段时间轻微调整方向
- body 可以有很轻的上下浮动
- 不要大幅旋转，避免卡通感过强

#### Lyric surface
- type: `floating-subtitle-strip`
- placement: 中层偏中间，如水中的漂浮字幕带
- style: 柔和 aqua glow，文字像在水里被折射

#### Player object
- placement: `bubble-console`
- 形式不要像普通卡片，可像一个气泡控制台 / 舷窗式小面板
- cover art 与播放按钮仍保留，但外观更圆润、半透明一点

#### Accent / palette
- teal / aqua / muted cyan
- 点少量 neon light，不要变成夜店

#### 批量生成时最重要的检查点
- 背景是否真的有“漂浮空间”感
- 歌词是否像水中的语言，而不是普通字幕
- bot 是否像漂流，而不是站在水下

---

## 3. `夜车`

### 基本定位
- archetype: `watcher`
- bot role: `夜车凝望 bot`
- 核心关键词：车窗、掠过灯光、移动中的静止、远方、孤独

### page-level structure

#### Background animation
- 主背景应是一节深夜车厢或靠窗位置
- 窗外持续有横向掠过的灯带/光斑
- 车厢内部不能太亮，应偏暗，突出窗边视线
- 背景运动的关键不是复杂，而是“稳定地向后掠去”

#### Bot motion
- bot 以坐姿/靠窗姿态为主
- 动作不多，重点是：
  - 轻微摇晃
  - 偶尔抬眼或偏头
- 它本身不主动移动，而是被列车带着移动

#### Lyric surface
- type: `wall-projection`
- placement: 窗面反射 / 车窗附近
- style: passing light text bands
- 文本可以像被窗外光切过一样一段段变亮

#### Player object
- placement: `seat-side-cassette`
- 最适合做成座位边的小磁带机 / 小播放器
- 应该像是旅途中的私人播放设备，不要太现代

#### Accent / palette
- dark navy / muted amber / faint tungsten
- 主体偏暗，亮点来自车窗外流动光线

#### 批量生成时最重要的检查点
- 页面是否成立“移动中的凝望”
- 窗外灯光是否真的承担了节奏
- 歌词是否和车窗/反光绑定，而不是浮在正中央

---

## 4. `踊り子`

### 基本定位
- archetype: `dancer`
- bot role: `黄昏舞者 bot`
- 核心关键词：暖光、轻舞、亲密、小幅度旋转、沉浸

### page-level structure

#### Background animation
- 主背景是暖色黄昏灯影
- 不需要复杂建筑，更像一个小舞台角落 / 柔和灯池
- 应有轻轻晃动的暖色光斑
- 整体要柔，不要舞台 show 感太强

#### Bot motion
- 动作应是：
  - 侧步
  - 小幅旋转
  - 停顿后继续保持节奏
- 重点是“投入但不张扬”
- 不能做成欢快蹦跳，会丢掉这首歌的暧昧感

#### Lyric surface
- type: `wall-projection`
- placement: 背景光幕 / 软焦墙面
- style: warm blurred lyric glow
- 歌词更适合作为暖色光影里的句子，而不是锐利字形

#### Player object
- placement: `floor-monitor-console`
- 应像舞台边缘的小监听设备或低矮控制台
- 要嵌入场景，不要悬浮成卡片

#### Accent / palette
- amber / peach / dusty gold
- 允许少量玫瑰粉，但不要变得太甜

#### 批量生成时最重要的检查点
- 动势是不是“轻舞”而不是“表演”
- 光是不是暖而克制
- 页面是否有亲密感，而不是炫目感

---

## 5. 三首歌一起看时的批量价值

### `Submarine`
验证：
- 漂浮 / 水下 / 低重力页面是否成立

### `夜车`
验证：
- 移动中的静止与窗外节奏是否成立

### `踊り子`
验证：
- 暖光与小幅度舞动是否成立

这三首组合在一起的意义是：
- 不共享同一种背景逻辑
- 不共享同一种动势逻辑
- 不共享同一种歌词表面逻辑

如果这三页都能成立，就说明：
> 批量 prototype page 不是简单换皮，而是真的开始形成 archetype 分化。

---

## 6. 下一步建议

下一步可直接进入：

1. 为这三首补一版更明确的 visual preset
2. 将它们映射到当前 `botSceneMap.ts` 可消费的配置结构
3. 优先生成或复用对应 archetype 的动画背景文件
4. 跑出第二批 prototype pages

---

## 7. 一句话结论

> `Submarine`、`夜车`、`踊り子` 是非常适合继续推进的第二批 prototype pages，因为它们分别代表漂浮、凝望、轻舞三种不同 archetype；只要把它们的背景动势、歌词载体和播放器物件绑定清楚，就足以验证“批量单歌页面”这条通路是否真的成立。
