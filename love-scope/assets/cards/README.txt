本目录用于存放塔罗牌面插画（assets/cards/）

塔罗牌面由插画师原创绘制，命名规则（放在本目录下）：
  card_0_愚者.png
  card_1_魔术师.png
  card_2_女祭司.png
  ...（编号与 data/tarot.js 中的 id 对应）

牌面建议尺寸：750 × 1050 px（竖版，3:4 比例）
绘制完成后，在 pages/tarot-result/tarot-result.wxml 中把牌面区域
替换为 <image> 标签引用即可（当前为占位渐变卡片）。

建议先画 3 张样张确认风格（恋人、命运之轮、太阳），再批量绘制 22 张。
