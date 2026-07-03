# Holographic Command Deck — 3D 與演示全面升級設計

日期：2026-07-03
狀態：已核准（使用者於對話中確認）

## 目標

把 Cheng Portfolio 首頁的 3D 視覺與演示方式全面升級為「全息科幻 HUD + GPU 粒子 morph」風格，涵蓋四個方向：3D 視覺質感、運鏡與轉場、互動性、開場震撼感。視覺基調大膽重設計，但保留現有的 scroll 章節架構、i18n、showcase 卡片與 motion toggle。

## 不變的約束

- 技術棧不變：Vite + vanilla JS + three（`three/examples` 的 postprocessing passes 可用，不新增 npm 依賴）。
- 現有 scroll 章節結構（intro / wafer-drift / yield-constellation / prompt-fabric / approach）、場景 snap、HUD 文案、showcase 卡片、雙語 i18n 全部保留，只重寫 3D 模組與其銜接層。
- Motion toggle 與 `prefers-reduced-motion` 完全尊重：關閉動態時停用 composer 重效果與粒子動畫，直接呈現各場景的靜態完成幀。
- 效能底線：自適應 pixel ratio、頁面不可見時暫停 render loop、手機降規格（粒子 ~25k、關閉部分 pass）。

## 1. 開場 Boot Sequence（約 2 秒，可跳過）

- 暗場 → 發光網格從地平線掃出 → 掃描線橫掃 → `CHENG PORTFOLIO` 標題由粒子聚合成形（粒子從散逸狀態收斂到文字取樣點位；文字點位以離屏 canvas 取樣產生）。
- 完成後 HUD 框架（四角括號、數據讀出、座標軸標籤）淡入常駐。
- Reduced motion：跳過序列，直接顯示完成狀態。
- 任何滾動或點擊立即快轉到完成狀態（不鎖住使用者）。

## 2. 三幕全息場景重設計

核心是一套中央 GPU 粒子系統（桌機 ~80k、手機 ~25k，BufferGeometry attribute morph：每個場景一組目標點位，scroll 進度驅動插值）+ 各場景的全息線框結構。

- **Scene 01 數位孿生**：全息晶圓廠 — 線框建築體積、掃描光束由下而上掃過、樓層逐層點亮、遙測數據流沿建築邊緣流動。
- **Scene 02 Federated IFC + Telemetry**：建築體積垂直炸開成分層樓板（exploded view），警報點位紅色脈衝，資料連線在層間跳動。
- **Scene 03 TokenScope**：粒子重組成環形用量儀表，環上有流動計數刻度，用量超標時色彩由青轉橘的警示波。
- 場景切換：粒子解體 → 飛散 → 重組成下一幕形體，morph 由 scroll 進度驅動、雙向可逆。
- 配色重設計：深空底 + 全息青 / 冰白主色 + 警示橘紅點綴（延續 operator 語彙但整體更冷冽、對比更強）。

## 3. 後製特效管線

- `EffectComposer`：`RenderPass` + `UnrealBloomPass` + 自訂 `ShaderPass`（合併：色差、膠片顆粒、暗角、細掃描線紋理）。
- Bloom 閾值調高，只讓 HUD 線條與粒子發光，背景保持深邃。
- 色差強度隨場景轉場短暫增強，平時收斂。
- Reduced motion 或手機低階裝置：退回單純 `renderer.render`。

## 4. 運鏡升級

- 每幕定義攝影機 keyframe（位置 + 注視點 + FOV），scroll scrub 沿 Catmull-Rom / 貝茲路徑飛行。
- 路徑設計：俯瞰廠區俯衝進樓層 → 側移穿過分層樓板 → 環繞儀表環半圈。
- 轉場時輕微 FOV 擴張 + camera roll，營造慣性感。
- 攝影機插值用臨界阻尼平滑（沿用現有 lerp 架構），避免暈眩。

## 5. 互動性

- 滑鼠視差加深：攝影機偏移增幅 + 粒子場受滑鼠位置斥力擾動（粒子尾流跟隨游標）。
- Showcase 卡片 hover → 對應場景的 3D 物件高亮脈衝（卡片與 3D 的雙向呼應）。
- 按住拖曳可在 ±15° 內環視當前場景，放開後回彈到運鏡路徑。
- 觸控裝置：拖曳環視停用（避免與滾動衝突），視差改用 gyro-free 的滾動視差。

## 6. 驗收標準

- 開場序列在 3 秒內完成且可被滾動中斷。
- 三幕場景各自形體可辨識，morph 轉場雙向流暢（60fps 桌機 / 30fps+ 手機，M 系列 MacBook 與中階手機實測）。
- Motion toggle 關閉時無持續動畫、無 composer 重效果，內容完整可讀。
- Lighthouse performance 不低於改版前基準 10 分以上差距。
- 既有 i18n 切換、scroll snap、showcase 步驟 rail 行為不回歸。

## 架構切分

- `app.js` 目前 ~2900 行已過大。3D 部分拆出為模組：
  - `src/three/stage.js` — renderer、composer、resize、render loop、品質分級
  - `src/three/particles.js` — 粒子系統與 morph 目標（文字、廠房、樓板、儀表環）
  - `src/three/scenes.js` — 各幕線框結構、掃描光束、數據流
  - `src/three/camera-rig.js` — keyframe 路徑、scroll scrub、拖曳環視、視差
  - `src/three/boot.js` — 開場序列狀態機
- `app.js` 保留：i18n、scroll 章節、showcase、HUD 文案、事件銜接，透過小介面（`setSceneProgress(sceneId, progress)`、`setPointer(x, y)` 等）驅動 3D 模組。
