import * as THREE from "three";

const translations = {
  zh: {
    brand: {
      title: "Wafer Signal Exhibit",
      subtitle: "Process to Decision"
    },
    nav: {
      systems: "場景",
      archive: "索引"
    },
    opening: {
      kicker: "Wafer Signal Cinema",
      title:
        '<span class="headline-line">WAFER</span><span class="headline-line">SIGNAL</span>',
      accent:
        '<span class="headline-caption">從晶圓對位、圖形轉移、檢測、良率地圖，到 AI 決策回饋的抽象演示。</span>',
      summary:
        "這不是一片漂亮晶圓的裝飾，而是從單一製程訊號擴展成 die grid、良率地圖、批次比較與決策回饋的 3D 展場。"
    },
    chapters: {
      intro: {
        kicker: "Alignment",
        title: "先讓晶圓被定位，讓座標系統找到可以被閱讀的起點",
        body:
          "第一幕不是展示作品，而是建立 wafer notch、die grid、reference line 與量測基準，讓後續內容有一個可追蹤的訊號場。"
      },
      approach: {
        kicker: "Closed Loop",
        title: "資料不只被展示，它會回到製程與工具決策裡"
      }
    },
    approach: {
      items: [
        {
          title: "Abstract technical language",
          body:
            "半導體流程被轉成對位、曝光、檢測、分群與修正向量，而不是直接貼上工業素材。"
        },
        {
          title: "Product-level pacing",
          body:
            "重點不是畫面裝飾，而是訊號如何被建立、偏移如何被發現、結果如何被判讀。"
        },
        {
          title: "Exhibit over template",
          body:
            "內容先保持為展場框架，重點放在訊號如何被閱讀、校準與推進，而不是先排成作品卡片。"
        }
      ]
    },
    footer: {
      kicker: "Exhibit Index",
      title:
        "作品內容先留在後台，這裡暫時作為一個冷靜的 calibration bay：先把半導體訊號、資料判讀與 AI 回饋的觀看節奏調準。"
    }
  },
  en: {
    brand: {
      title: "Wafer Signal Exhibit",
      subtitle: "Process to Decision"
    },
    nav: {
      systems: "Scenes",
      archive: "Index"
    },
    opening: {
      kicker: "Wafer Signal Cinema",
      title:
        '<span class="headline-line">WAFER</span><span class="headline-line">SIGNAL</span>',
      accent:
        '<span class="headline-caption">An abstract progression from wafer alignment and pattern transfer to inspection, yield maps, and AI decision feedback.</span>',
      summary:
        "Not a decorative wafer, but a 3D exhibit where a single process signal expands into die grids, yield maps, lot comparison, and decision feedback."
    },
    chapters: {
      intro: {
        kicker: "Alignment",
        title: "The wafer is positioned first, so the signal has a readable coordinate system.",
        body:
          "The first frame establishes the notch, die grid, reference lines, and measurement baseline, so later material has a traceable signal field."
      },
      approach: {
        kicker: "Closed Loop",
        title: "The data is not only shown. It returns to process and tooling decisions."
      }
    },
    approach: {
      items: [
        {
          title: "Abstract technical language",
          body:
            "The semiconductor flow becomes alignment, exposure, inspection, clustering, and correction vectors rather than obvious industrial imagery."
        },
        {
          title: "Product-level pacing",
          body:
            "The focus is not decoration. It is how signals are established, how drift is detected, and how results become decisions."
        },
        {
          title: "Exhibit over template",
          body:
            "The content stays in an exhibit framework for now, focused on how signals are read, calibrated, and advanced before project cards appear."
        }
      ]
    },
    footer: {
      kicker: "Exhibit Index",
      title:
        "Project content stays backstage for now. This area works as a calm calibration bay, tuning the viewing rhythm for semiconductor signals, data interpretation, and AI feedback."
    }
  }
};

const visualDefaults = {
  waferOpacity: 0.72,
  waferGlow: 0.08,
  waferTopOpacity: 0.06,
  dieOpacity: 0.42,
  diePopulation: 1,
  dieSpreadX: 1,
  dieSpreadZ: 1,
  dieLift: 0,
  dieWave: 0.28,
  dieConstellation: 0,
  dieFabric: 0,
  defect: 0,
  constellation: 0,
  fabric: 0,
  ringScale: 1,
  ringOpacity: 0.22,
  traceOpacity: 0.18,
  traceLift: 1,
  particleOpacity: 0.7,
  particleSize: 0.034,
  particleRadius: 1,
  particleHeight: 1,
  particleSpeed: 0.42,
  scanScaleX: 1,
  scanScaleY: 1,
  scanTravel: 1.4,
  scanSpeed: 0.38,
  exposure: 1.06,
  ambientLight: 0.42,
  keyLight: 1.8,
  rimLight: 1.2,
  inspectionLight: 0.72,
  backLight: 0.88,
  haloOpacity: 0.24,
  haloScale: 1,
  innerGlowOpacity: 0.08,
  beamOpacity: 0.18,
  beamSpread: 1,
  beamSkew: 0,
  backgroundOpacity: 0.2,
  lensOpacity: 0.22,
  dieGlow: 0.18,
  edgeOpacity: 0.24,
  edgeSweep: 0.18,
  alignment: 0,
  exposureSlit: 0,
  yieldMap: 0,
  feedback: 0,
  gridReveal: 1,
  lotMultiplicity: 0,
  seedGlow: 0,
  focusOpacity: 0.26,
  focusScale: 1,
  focusRadius: 1.05
};

function visual(overrides) {
  return { ...visualDefaults, ...overrides };
}

const scenes = [
  {
    id: "intro",
    label: { zh: "Scene 00", en: "Scene 00" },
    title: { zh: "Alignment", en: "Alignment" },
    description: {
      zh: "先讓晶圓被定位，notch、die grid 與 reference line 逐步成形，建立所有訊號的座標基準。",
      en: "Position the wafer first. The notch, die grid, and reference lines form the coordinate baseline for every signal."
    },
    metrics: [
      { label: "Step", value: "Alignment" },
      { label: "Signal", value: "Reference grid" },
      { label: "Focus", value: "Coordinate baseline" }
    ],
    camera: { x: 0.28, y: 0.56, z: 5.95 },
    rootPosition: { x: 1.34, y: 0.14, z: -0.16 },
    rootRotation: { x: -0.12, y: 0.26, z: 0.04 },
    focusTarget: { x: 0, y: 0.58, z: 0 },
    scale: 1.28,
    scan: 0.06,
    visual: visual({
      dieOpacity: 0.26,
      diePopulation: 0.12,
      dieSpreadX: 0.86,
      dieSpreadZ: 0.82,
      dieWave: 0.05,
      ringScale: 1.05,
      ringOpacity: 0.18,
      traceOpacity: 0.06,
      particleOpacity: 0.2,
      particleRadius: 0.68,
      particleHeight: 0.58,
      particleSize: 0.022,
      scanScaleX: 0.72,
      scanScaleY: 0.64,
      scanTravel: 0.52,
      exposure: 0.96,
      ambientLight: 0.3,
      keyLight: 1.42,
      rimLight: 1.08,
      inspectionLight: 0.32,
      backLight: 0.82,
      haloOpacity: 0.18,
      haloScale: 1.06,
      innerGlowOpacity: 0.05,
      beamOpacity: 0.05,
      backgroundOpacity: 0.1,
      lensOpacity: 0.08,
      dieGlow: 0.08,
      edgeOpacity: 0.18,
      edgeSweep: 0.08,
      alignment: 1,
      exposureSlit: 0.03,
      yieldMap: 0,
      feedback: 0,
      gridReveal: 0.42,
      lotMultiplicity: 0,
      seedGlow: 1.08,
      focusOpacity: 0.66,
      focusScale: 0.64,
      focusRadius: 0.46
    })
  },
  {
    id: "wafer-drift",
    label: { zh: "Scene 01", en: "Scene 01" },
    title: { zh: "Pattern Transfer", en: "Pattern Transfer" },
    description: {
      zh: "曝光狹縫掃過晶圓，die blocks 像被顯影一樣逐步浮現；細微偏移開始形成可被追蹤的製程訊號。",
      en: "A lithography-like slit sweeps over the wafer. Die blocks surface as if developed, while tiny offsets become traceable process signals."
    },
    metrics: [
      { label: "Step", value: "Pattern transfer" },
      { label: "Signal", value: "Overlay drift" },
      { label: "Tool", value: "Process trace" }
    ],
    camera: { x: 0.46, y: 0.34, z: 4.9 },
    rootPosition: { x: 1.8, y: 0.24, z: 0.02 },
    rootRotation: { x: -0.08, y: 0.42, z: 0.13 },
    focusTarget: { x: 1.15, y: 0.52, z: -0.2 },
    scale: 1.72,
    scan: 0.48,
    visual: visual({
      waferOpacity: 0.88,
      waferGlow: 0.38,
      waferTopOpacity: 0.18,
      dieOpacity: 0.9,
      dieSpreadX: 1.02,
      dieSpreadZ: 0.92,
      dieLift: 0.08,
      dieWave: 0.86,
      defect: 1.45,
      ringScale: 0.88,
      ringOpacity: 0.46,
      traceOpacity: 0.3,
      particleOpacity: 0.76,
      particleSize: 0.04,
      particleRadius: 0.82,
      particleHeight: 0.72,
      particleSpeed: 0.46,
      scanScaleX: 1.8,
      scanScaleY: 2.8,
      scanTravel: 2.4,
      scanSpeed: 0.72,
      exposure: 1.18,
      ambientLight: 0.26,
      keyLight: 2.2,
      rimLight: 1.68,
      inspectionLight: 2.45,
      backLight: 1.18,
      haloOpacity: 0.5,
      haloScale: 0.92,
      innerGlowOpacity: 0.22,
      beamOpacity: 0.42,
      beamSpread: 0.92,
      beamSkew: -0.24,
      backgroundOpacity: 0.28,
      lensOpacity: 0.38,
      dieGlow: 0.5,
      edgeOpacity: 0.68,
      edgeSweep: 0.72,
      alignment: 0.54,
      exposureSlit: 1.25,
      yieldMap: 0.18,
      feedback: 0.08,
      gridReveal: 1,
      lotMultiplicity: 0.08,
      seedGlow: 0.42,
      focusOpacity: 0.82,
      focusScale: 1.08,
      focusRadius: 0.86
    })
  },
  {
    id: "yield-constellation",
    label: { zh: "Scene 02", en: "Scene 02" },
    title: { zh: "Inspection Map", en: "Inspection Map" },
    description: {
      zh: "檢測結果把局部缺陷、binning 與 confidence 分數拉成良率地圖，資料視覺化在這裡接手。",
      en: "Inspection results turn local defects, binning, and confidence into a yield map. This is where data visualization takes over."
    },
    metrics: [
      { label: "Step", value: "Inspection" },
      { label: "Signal", value: "Yield map" },
      { label: "Tool", value: "Data visualization" }
    ],
    camera: { x: 0.1, y: 0.76, z: 5.7 },
    rootPosition: { x: 1.34, y: 0.02, z: -0.2 },
    rootRotation: { x: -0.34, y: 0.06, z: 0.25 },
    focusTarget: { x: -0.42, y: 0.68, z: 0.42 },
    scale: 1.46,
      scan: 0.08,
    visual: visual({
      waferOpacity: 0.42,
      waferGlow: 0.04,
      waferTopOpacity: 0.03,
      dieOpacity: 0.62,
      dieSpreadX: 0.72,
      dieSpreadZ: 0.72,
      dieWave: 0.26,
      dieConstellation: 1.28,
      constellation: 1.42,
      ringScale: 1.84,
      ringOpacity: 0.64,
      traceOpacity: 0.9,
      traceLift: 2.1,
      particleOpacity: 1,
      particleSize: 0.05,
      particleRadius: 1.7,
      particleHeight: 2.18,
      particleSpeed: 0.28,
      scanScaleX: 0.64,
      scanScaleY: 0.42,
      scanTravel: 0.62,
      scanSpeed: 0.22,
      exposure: 1.08,
      ambientLight: 0.18,
      keyLight: 1.34,
      rimLight: 2.05,
      inspectionLight: 0.34,
      backLight: 1.74,
      haloOpacity: 0.36,
      haloScale: 1.62,
      innerGlowOpacity: 0.06,
      beamOpacity: 0.24,
      beamSpread: 1.56,
      beamSkew: 0.34,
      backgroundOpacity: 0.62,
      lensOpacity: 0.28,
      dieGlow: 0.3,
      edgeOpacity: 0.44,
      edgeSweep: 0.28,
      alignment: 0.2,
      exposureSlit: 0.24,
      yieldMap: 1.7,
      feedback: 0.34,
      gridReveal: 1,
      lotMultiplicity: 1.12,
      seedGlow: 0.08,
      focusOpacity: 0.9,
      focusScale: 1.22,
      focusRadius: 1.08
    })
  },
  {
    id: "prompt-fabric",
    label: { zh: "Scene 03", en: "Scene 03" },
    title: { zh: "Feedback Loop", en: "Feedback Loop" },
    description: {
      zh: "AI 工具把缺陷分群、閾值與人工判斷整理成 correction vector，讓資料重新回到 recipe 與決策層。",
      en: "AI tooling organizes defect clusters, thresholds, and human judgment into correction vectors that return to recipes and decisions."
    },
    metrics: [
      { label: "Step", value: "Feedback" },
      { label: "Signal", value: "Correction vector" },
      { label: "Tool", value: "AI decision layer" }
    ],
    camera: { x: 0.52, y: 0.22, z: 4.6 },
    rootPosition: { x: 1.68, y: 0.02, z: 0.12 },
    rootRotation: { x: -0.44, y: 0.46, z: -0.04 },
    focusTarget: { x: 0.76, y: 0.72, z: 0.18 },
    scale: 1.84,
    scan: 0.36,
    visual: visual({
      waferOpacity: 0.18,
      waferGlow: 0.12,
      waferTopOpacity: 0.04,
      dieOpacity: 0.64,
      dieSpreadX: 2.3,
      dieSpreadZ: 0.2,
      dieLift: -0.02,
      dieWave: 0.12,
      dieFabric: 1.28,
      fabric: 1.55,
      ringScale: 0.48,
      ringOpacity: 0.12,
      traceOpacity: 0.76,
      traceLift: 0.32,
      particleOpacity: 0.72,
      particleSize: 0.026,
      particleRadius: 1.12,
      particleHeight: 0.52,
      particleSpeed: 0.5,
      scanScaleX: 2.4,
      scanScaleY: 0.34,
      scanTravel: 2.8,
      scanSpeed: 0.82,
      exposure: 1.22,
      ambientLight: 0.24,
      keyLight: 1.92,
      rimLight: 1.32,
      inspectionLight: 1.18,
      backLight: 1.46,
      haloOpacity: 0.2,
      haloScale: 0.74,
      innerGlowOpacity: 0.14,
      beamOpacity: 0.5,
      beamSpread: 2.2,
      beamSkew: 0.5,
      backgroundOpacity: 0.42,
      lensOpacity: 0.32,
      dieGlow: 0.58,
      edgeOpacity: 0.36,
      edgeSweep: 0.38,
      alignment: 0.12,
      exposureSlit: 0.32,
      yieldMap: 0.82,
      feedback: 1.9,
      gridReveal: 1,
      lotMultiplicity: 1.55,
      seedGlow: 0.04,
      focusOpacity: 0.86,
      focusScale: 1.34,
      focusRadius: 1.22
    })
  },
  {
    id: "approach",
    label: { zh: "Scene 04", en: "Scene 04" },
    title: { zh: "Closed Loop", en: "Closed Loop" },
    description: {
      zh: "最後鏡頭抽離，讓 wafer、yield map、AI tool 與修正向量回到同一個閉環系統。",
      en: "The final shot pulls back so the wafer, yield map, AI tooling, and correction vectors read as one closed-loop system."
    },
    metrics: [
      { label: "Step", value: "Control loop" },
      { label: "Motion", value: "Signal return" },
      { label: "Focus", value: "System method" }
    ],
    camera: { x: 0.08, y: 0.56, z: 5.55 },
    rootPosition: { x: 1.36, y: 0.1, z: -0.12 },
    rootRotation: { x: -0.2, y: 0.12, z: 0.12 },
    focusTarget: { x: 0.08, y: 0.54, z: 0.02 },
    scale: 1.34,
    scan: 0.16,
    visual: visual({
      waferOpacity: 0.62,
      waferGlow: 0.1,
      dieOpacity: 0.5,
      dieSpreadX: 1.14,
      dieSpreadZ: 0.94,
      dieWave: 0.24,
      defect: 0.18,
      constellation: 0.22,
      fabric: 0.22,
      ringScale: 1.12,
      ringOpacity: 0.28,
      traceOpacity: 0.34,
      particleOpacity: 0.66,
      particleRadius: 1.1,
      particleHeight: 1.06,
      exposure: 1.04,
      ambientLight: 0.32,
      keyLight: 1.52,
      rimLight: 1.22,
      inspectionLight: 0.62,
      backLight: 0.96,
      haloOpacity: 0.3,
      haloScale: 1.18,
      innerGlowOpacity: 0.08,
      beamOpacity: 0.2,
      backgroundOpacity: 0.28,
      lensOpacity: 0.18,
      dieGlow: 0.2,
      edgeOpacity: 0.26,
      edgeSweep: 0.2,
      alignment: 0.44,
      exposureSlit: 0.16,
      yieldMap: 0.42,
      feedback: 0.74,
      gridReveal: 0.82,
      lotMultiplicity: 0.9,
      seedGlow: 0.26,
      focusOpacity: 0.42,
      focusScale: 1.06,
      focusRadius: 1.58
    })
  }
];

function metric(labelZh, labelEn, valueZh, valueEn) {
  return {
    label: { zh: labelZh, en: labelEn },
    value: { zh: valueZh, en: valueEn }
  };
}

Object.assign(translations.zh.brand, {
  title: "Cheng Portfolio",
  subtitle: "Spatial systems and operator tools"
});
Object.assign(translations.en.brand, {
  title: "Cheng Portfolio",
  subtitle: "Spatial systems and operator tools"
});

translations.zh.nav.work = "作品";
translations.zh.nav.featured = "精選";
translations.en.nav.work = "Work";
translations.en.nav.featured = "Featured";

Object.assign(translations.zh.opening, {
  kicker: "Product Engineering Portfolio",
  title: '<span class="headline-line">CHENG</span><span class="headline-line">PORTFOLIO</span>',
  accent: '<span class="headline-caption">把空間、資料與工作流程做成真的能被使用的產品。</span>',
  summary:
    "我做 Web 3D、即時資料、桌面工具與 operator-facing interfaces。這個首頁先收斂成兩個代表作：半導體數位孿生與 TokenScope。"
});
Object.assign(translations.en.opening, {
  kicker: "Product Engineering Portfolio",
  title: '<span class="headline-line">CHENG</span><span class="headline-line">PORTFOLIO</span>',
  accent: '<span class="headline-caption">Building spatial systems, data-rich interfaces, and tools that are meant to be used in real workflows.</span>',
  summary:
    "I build Web 3D interfaces, real-time data surfaces, desktop utilities, and operator-facing tools. This homepage currently focuses on two representative projects: a semiconductor digital twin and TokenScope."
});

Object.assign(translations.zh.chapters.intro, {
  kicker: "Positioning",
  title: "我不是在堆技術展示，而是在把複雜系統做成可操作的產品介面",
  body:
    "六年軟體經驗，關注 spatial UI、real-time telemetry、桌面工具與 AI-assisted workflow。偏好的不是模板網站，而是有節奏、有系統感、可解釋的產品體驗。"
});
Object.assign(translations.en.chapters.intro, {
  kicker: "Positioning",
  title: "I am not stacking tech demos. I am turning complex systems into usable product interfaces.",
  body:
    "With six years of software experience, I focus on spatial UI, real-time telemetry, desktop utilities, and AI-assisted workflows. I care less about templates and more about deliberate, explainable product experiences."
});

Object.assign(translations.zh.chapters.approach, {
  kicker: "Build Method",
  title: "我喜歡把複雜領域壓成可理解、可維護、可交付的產品骨架"
});
Object.assign(translations.en.chapters.approach, {
  kicker: "Build Method",
  title: "I like compressing complex domains into product structures that are readable, maintainable, and shippable."
});

translations.zh.approach.items = [
  {
    title: "Product before demo",
    body: "我在意的是功能怎麼被長期擴充，而不是一次性的展示效果。"
  },
  {
    title: "Systems with real operators",
    body: "不只是把資料畫出來，而是讓人真的能沿著介面做判斷與操作。"
  },
  {
    title: "AI as leverage, not mystery",
    body: "我會用 AI 加速開發，但前提是每個架構取捨與程式碼結果都必須能被自己解釋。"
  }
];
translations.en.approach.items = [
  {
    title: "Product before demo",
    body: "I care about how a capability can grow over time, not just how impressive it looks in one moment."
  },
  {
    title: "Systems with real operators",
    body: "The goal is not only to visualize data, but to help someone make judgments and take action through the interface."
  },
  {
    title: "AI as leverage, not mystery",
    body: "I use AI to accelerate delivery, but every architecture choice and code path still needs to be understandable and explainable."
  }
];

Object.assign(translations.zh.footer, {
  kicker: "Featured Work",
  title:
    "目前先收斂成兩個代表作：一個是面向廠務與營運端的 Web 3D 數位孿生，一個是面向日常工作流的桌面監控工具。"
});
Object.assign(translations.en.footer, {
  kicker: "Featured Work",
  title:
    "For now the portfolio narrows down to two representative projects: a Web 3D operational digital twin and a desktop monitoring tool for day-to-day workflows."
});

translations.zh.buttons = {
  viewProjects: "看作品",
  githubProfile: "GitHub 個人頁",
  liveDemo: "線上展示",
  githubRepo: "GitHub Repo",
  privateRepo: "Private repo"
};
translations.en.buttons = {
  viewProjects: "View Projects",
  githubProfile: "GitHub Profile",
  liveDemo: "Live Demo",
  githubRepo: "GitHub Repo",
  privateRepo: "Private repo"
};

translations.zh.projects = {
  twin: {
    kicker: "Web 3D / Digital Twin",
    title: "Semiconductor Digital Twin",
    media: "Live IFC viewer",
    body:
      "IFC-first viewer，結合 federated models、spatial tree、category layer controls 與 telemetry-driven 3D state，朝 operator-facing 產品核心去做。",
    points: [
      "可載入 bundled/local IFC，並管理多模型與 category layers。",
      "Telemetry 會直接改變 3D 狀態、告警與 dashboard 指標。",
      "以可演進的產品核心設計，而不是一次性的 viewer 場景。"
    ]
  },
  token: {
    kicker: "Desktop Utility / Workflow Tool",
    title: "TokenScope",
    media: "Desktop utility window",
    body:
      "追蹤 Claude.ai 與 Codex 使用量的 macOS menubar 工具，包含本機 session parsing、threshold 通知、以及可分離的 utility window。",
    points: [
      "從本機 session 追蹤 Claude 與 Codex 的使用狀態。",
      "呈現 limits、reset window、趨勢與專案活動。",
      "以日常高頻使用為核心，放在 macOS menubar 工作流裡。"
    ]
  }
};
translations.en.projects = {
  twin: {
    kicker: "Web 3D / Digital Twin",
    title: "Semiconductor Digital Twin",
    media: "Live IFC viewer",
    body:
      "An IFC-first viewer that combines federated models, a spatial tree, category layer controls, and telemetry-driven 3D state into an operator-facing product core.",
    points: [
      "Loads bundled/local IFC while keeping models and category layers manageable.",
      "Telemetry directly changes 3D state, alerts, and dashboard metrics.",
      "Designed as an extensible product core, not a one-off viewer scene."
    ]
  },
  token: {
    kicker: "Desktop Utility / Workflow Tool",
    title: "TokenScope",
    media: "Desktop utility window",
    body:
      "A macOS menubar companion for Claude.ai and Codex usage tracking, with local session parsing, threshold notifications, and a detachable utility window.",
    points: [
      "Tracks Claude and Codex usage from local sessions.",
      "Surfaces limits, reset windows, trends, and project activity.",
      "Designed for repeated daily use from the macOS menubar."
    ]
  }
};

translations.zh.showcases = {
  twin: {
    eyebrow: "Digital Twin Viewer",
    label: "Project 01 / Web 3D",
    title: "IFC 到營運數位孿生",
    steps: [
      "IFC 模型載入",
      "模型與 category layer 狀態",
      "Telemetry 告警狀態",
      "Ops dashboard 即時讀值"
    ]
  },
  token: {
    eyebrow: "TokenScope Utility",
    label: "Project 02 / Desktop Tool",
    title: "一眼看懂使用量狀態",
    steps: [
      "Session usage ring",
      "Reset 與 remaining 狀態",
      "Claude / Codex 切換",
      "Menubar live 狀態"
    ]
  }
};

translations.en.showcases = {
  twin: {
    eyebrow: "Digital Twin Viewer",
    label: "Project 01 / Web 3D",
    title: "IFC to operational twin",
    steps: [
      "IFC model loaded",
      "Model and category layer state",
      "Telemetry alert state",
      "Ops dashboard readout"
    ]
  },
  token: {
    eyebrow: "TokenScope Utility",
    label: "Project 02 / Desktop Tool",
    title: "Usage state at a glance",
    steps: [
      "Session usage ring",
      "Reset and remaining state",
      "Claude / Codex switch",
      "Live menubar status"
    ]
  }
};

for (const scene of scenes) {
  if (scene.id === "intro") {
    Object.assign(scene, {
      rail: { zh: "Profile", en: "Profile" },
      label: { zh: "Profile 00", en: "Profile 00" },
      title: { zh: "Product Positioning", en: "Product Positioning" },
      description: {
        zh: "一個偏產品思維的軟體工程師，專注在 spatial UI、即時資料與工作流工具。",
        en: "A product-minded software engineer focused on spatial UI, real-time data, and workflow tooling."
      },
      metrics: [
        metric("Focus", "Focus", "Spatial / Data / Tools", "Spatial / Data / Tools"),
        metric("Mode", "Mode", "產品導向", "Product minded"),
        metric("Stack", "Stack", "Web / Desktop", "Web / Desktop")
      ]
    });
  }

  if (scene.id === "wafer-drift") {
    Object.assign(scene, {
      rail: { zh: "Twin", en: "Twin" },
      label: { zh: "Project 01", en: "Project 01" },
      chapterKicker: {
        zh: "Featured Project / Web 3D",
        en: "Featured Project / Web 3D"
      },
      title: { zh: "Semiconductor Digital Twin", en: "Semiconductor Digital Twin" },
      description: {
        zh: "以 IFC 為入口，結合 federated models、3D scene、tree 與 telemetry，做出面向營運端的產品原型。",
        en: "An IFC-first product prototype that combines federated models, 3D scene logic, spatial hierarchy, and telemetry for operations-facing use."
      },
      metrics: [
        metric("Role", "Role", "產品原型 / Web 3D", "Product prototype / Web 3D"),
        metric("Stack", "Stack", "Three.js / IFC / TS", "Three.js / IFC / TS"),
        metric("Output", "Output", "Operator-first viewer", "Operator-first viewer")
      ]
    });
  }

  if (scene.id === "yield-constellation") {
    Object.assign(scene, {
      rail: { zh: "Ops", en: "Ops" },
      label: { zh: "Project 01B", en: "Project 01B" },
      chapterKicker: {
        zh: "Realtime Ops / Product Layer",
        en: "Realtime Ops / Product Layer"
      },
      title: { zh: "Federated IFC + Telemetry", en: "Federated IFC + Telemetry" },
      description: {
        zh: "重點不只是幾何，而是把 BIM 匯出資料變成 layer、alerts、trends、selection sync 與決策節奏的一部分。",
        en: "The value is not geometry alone. It is turning BIM export data into layers, alerts, trends, selection sync, and operational decision flow."
      },
      metrics: [
        metric("Input", "Input", "IFC / local files", "IFC / local files"),
        metric("State", "State", "Telemetry-driven color", "Telemetry-driven color"),
        metric("UI", "UI", "Tree / layers / trends", "Tree / layers / trends")
      ]
    });
  }

  if (scene.id === "prompt-fabric") {
    Object.assign(scene, {
      rail: { zh: "Tool", en: "Tool" },
      label: { zh: "Project 02", en: "Project 02" },
      chapterKicker: {
        zh: "Desktop Utility / Workflow",
        en: "Desktop Utility / Workflow"
      },
      title: { zh: "TokenScope", en: "TokenScope" },
      description: {
        zh: "一個針對 Claude.ai 與 Codex 使用量的桌面工具，從本機 session log、提醒通知到 detachable utility window 都圍繞真實工作流設計。",
        en: "A desktop utility for Claude.ai and Codex usage tracking, designed around real workflows from local session logs to threshold notifications and a detachable utility window."
      },
      metrics: [
        metric("Platform", "Platform", "macOS menubar app", "macOS menubar app"),
        metric("Stack", "Stack", "Electron / Express", "Electron / Express"),
        metric("Use case", "Use case", "Usage monitoring", "Usage monitoring")
      ]
    });
  }

  if (scene.id === "approach") {
    Object.assign(scene, {
      rail: { zh: "Method", en: "Method" },
      label: { zh: "Method 04", en: "Method 04" },
      title: { zh: "Build Method", en: "Build Method" },
      description: {
        zh: "我偏好把複雜系統拆成可演進的產品能力，而不是只留一個漂亮但難維護的展示層。",
        en: "I prefer breaking complex systems into evolvable product capabilities instead of leaving them as beautiful but fragile presentation layers."
      },
      metrics: [
        metric("Bias", "Bias", "Ship, then refine", "Ship, then refine"),
        metric("Priority", "Priority", "Clarity / maintainability", "Clarity / maintainability"),
        metric("AI", "AI", "Leverage, not magic", "Leverage, not magic")
      ]
    });
  }
}

const state = {
  locale: window.localStorage.getItem("exhibit-locale") || "zh",
  activeSceneId: "intro",
  pointer: {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.45
  },
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  scrollProgress: 0,
  sceneProgress: 0,
  lockPulse: 0,
  snapTimer: null,
  lockTimer: null,
  jumpFrame: null,
  forcedSceneId: null,
  savedScrollBehavior: "",
  isSnapping: false,
  isJumping: false,
  three: null
};

const openingTitle = document.getElementById("opening-title");
const openingSummary = document.getElementById("opening-summary");
const localeButtons = Array.from(
  document.querySelectorAll("[data-locale-trigger]")
);
const hudKicker = document.getElementById("hud-kicker");
const hudTitle = document.getElementById("hud-title");
const hudDescription = document.getElementById("hud-description");
const hudMetrics = document.getElementById("hud-metrics");
const chapter1Kicker = document.getElementById("chapter-kicker-1");
const chapter1Title = document.getElementById("chapter-title-1");
const chapter1Body = document.getElementById("chapter-body-1");
const chapter2Kicker = document.getElementById("chapter-kicker-2");
const chapter2Title = document.getElementById("chapter-title-2");
const chapter2Body = document.getElementById("chapter-body-2");
const chapter3Kicker = document.getElementById("chapter-kicker-3");
const chapter3Title = document.getElementById("chapter-title-3");
const chapter3Body = document.getElementById("chapter-body-3");
const sceneNodes = Array.from(document.querySelectorAll(".film-chapter"));
const railItems = Array.from(document.querySelectorAll("[data-rail-scene]"));
const productShowcases = Array.from(document.querySelectorAll("[data-showcase]"));
const showcaseSceneIds = new Set(
  productShowcases.map((showcase) => showcase.dataset.showcase)
);
const sceneSwitchProgress = 0.34;
const sceneReleaseProgress = 0.08;
const showcaseStepCount = 4;

function t(path) {
  return path.split(".").reduce((current, key) => current?.[key], translations[state.locale]);
}

function getScene(id) {
  return scenes.find((scene) => scene.id === id) || scenes[0];
}

function setStaticTranslations() {
  document.documentElement.lang = state.locale === "zh" ? "zh-Hant" : "en";
  const opening = t("opening");
  openingTitle.innerHTML = `${opening.title}${opening.accent}`;
  openingSummary.textContent = opening.summary;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = t(node.dataset.i18n);
    if (value) {
      node.textContent = value;
    }
  });

  const chapterIntro = t("chapters.intro");
  const introNode = document.querySelector(".chapter-intro");
  introNode.querySelector(".chapter-kicker").textContent = chapterIntro.kicker;
  introNode.querySelector("h3").textContent = chapterIntro.title;
  introNode.querySelector("p:last-child").textContent = chapterIntro.body;

  const chapterApproach = t("chapters.approach");
  const approachNode = document.querySelector(".chapter-approach");
  approachNode.querySelector(".chapter-kicker").textContent = chapterApproach.kicker;
  approachNode.querySelector("h3").textContent = chapterApproach.title;

  const approachItems = t("approach.items");
  document.querySelectorAll(".approach-note").forEach((note, index) => {
    note.querySelector("strong").textContent = approachItems[index].title;
    note.querySelector("p").textContent = approachItems[index].body;
  });

  const scene1 = getScene("wafer-drift");
  const scene2 = getScene("yield-constellation");
  const scene3 = getScene("prompt-fabric");
  chapter1Kicker.textContent = scene1.chapterKicker[state.locale];
  chapter1Title.textContent = scene1.title[state.locale];
  chapter1Body.textContent = scene1.description[state.locale];
  chapter2Kicker.textContent = scene2.chapterKicker[state.locale];
  chapter2Title.textContent = scene2.title[state.locale];
  chapter2Body.textContent = scene2.description[state.locale];
  chapter3Kicker.textContent = scene3.chapterKicker[state.locale];
  chapter3Title.textContent = scene3.title[state.locale];
  chapter3Body.textContent = scene3.description[state.locale];

  localeButtons.forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.localeTrigger === state.locale
    );
  });

  railItems.forEach((item) => {
    const scene = getScene(item.dataset.railScene);
    const titleNode = item.querySelector("strong");
    if (titleNode && scene.rail) {
      titleNode.textContent = scene.rail[state.locale];
    }
  });

  updateHud(getScene(state.activeSceneId));
}

function updateHud(scene) {
  hudKicker.textContent = scene.label[state.locale];
  hudTitle.textContent = scene.title[state.locale];
  hudDescription.textContent = scene.description[state.locale];
  railItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.railScene === scene.id);
  });
  hudMetrics.innerHTML = scene.metrics
    .map(
      (metric) => `
        <div class="hud-metric">
          <p>${typeof metric.label === "string" ? metric.label : metric.label[state.locale]}</p>
          <strong>${typeof metric.value === "string" ? metric.value : metric.value[state.locale]}</strong>
        </div>
      `
    )
    .join("");
}

function setActiveScene(sceneId) {
  const scene = getScene(sceneId);
  if (scene.id !== state.activeSceneId) {
    state.activeSceneId = scene.id;
    updateHud(scene);
  }
  return scene;
}

function setLocale(locale) {
  state.locale = locale;
  window.localStorage.setItem("exhibit-locale", locale);
  setStaticTranslations();
}

function setupEventListeners() {
  localeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.localeTrigger !== state.locale) {
        setLocale(button.dataset.localeTrigger);
      }
    });
  });

  window.addEventListener("pointermove", (event) => {
    state.pointer.x = event.clientX;
    state.pointer.y = event.clientY;
  });

  railItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToScene(item.dataset.railScene);
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
}

function lerp(current, target, factor) {
  return current + (target - current) * factor;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function applyRootTransform(vector, rootPosition, rootRotation, scale) {
  return vector
    .clone()
    .multiplyScalar(scale)
    .applyEuler(new THREE.Euler(rootRotation.x, rootRotation.y, rootRotation.z))
    .add(new THREE.Vector3(rootPosition.x, rootPosition.y, rootPosition.z));
}

function easeInOut(value) {
  return value * value * (3 - 2 * value);
}

function easeCinematic(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) * 0.5;
}

function getChapterScrubProgress(node) {
  const rect = node.getBoundingClientRect();
  const startY = window.innerHeight * 0.82;
  const endY = -rect.height * 0.62;
  return clamp((startY - rect.top) / (startY - endY), 0, 1);
}

function updateProductShowcases(chapterStates) {
  let productPresence = 0;

  productShowcases.forEach((showcase) => {
    const sceneId = showcase.dataset.showcase;
    const chapterState = chapterStates.find(
      (item) => item.node.dataset.scene === sceneId
    );

    if (!chapterState) {
      return;
    }

    const visibility = easeInOut(clamp(chapterState.progress * 1.16, 0, 1));
    const scrubProgress = state.reducedMotion
      ? 0.58
      : getChapterScrubProgress(chapterState.node);
    const stepProgress = clamp((scrubProgress - 0.32) / 0.58, 0, 1);
    const stepIndex = Math.min(
      showcaseStepCount - 1,
      Math.floor(stepProgress * showcaseStepCount)
    );
    const introOffset = (1 - visibility) * 52 * chapterState.direction;
    const isTokenScope = sceneId === "prompt-fabric";
    const mediaScale = isTokenScope
      ? 1 + scrubProgress * 0.035
      : 1.02 + scrubProgress * 0.11;
    const mediaX = isTokenScope
      ? lerp(0, 0.8, scrubProgress)
      : lerp(0, -5.8, scrubProgress);
    const mediaY = isTokenScope
      ? lerp(0, -1.6, scrubProgress)
      : lerp(0, -4.2, scrubProgress);

    showcase.classList.toggle("is-visible", visibility > 0.08);
    showcase.style.setProperty("--showcase-opacity", String(visibility));
    showcase.style.setProperty("--showcase-y", `${introOffset}px`);
    showcase.style.setProperty("--showcase-scale", String(0.94 + visibility * 0.06));
    showcase.style.setProperty("--showcase-progress", String(scrubProgress));
    showcase.style.setProperty("--showcase-media-scale", String(mediaScale));
    showcase.style.setProperty("--showcase-media-x", `${mediaX}%`);
    showcase.style.setProperty("--showcase-media-y", `${mediaY}%`);
    showcase.dataset.activeStep = String(stepIndex);

    showcase.querySelectorAll("[data-step]").forEach((item) => {
      item.classList.toggle("is-active", Number(item.dataset.step) === stepIndex);
      item.classList.toggle("is-complete", Number(item.dataset.step) < stepIndex);
    });
    showcase.querySelectorAll("[data-focus-step]").forEach((item) => {
      item.classList.toggle(
        "is-active",
        Number(item.dataset.focusStep) === stepIndex
      );
    });

    productPresence = Math.max(productPresence, visibility);
  });

  document.documentElement.style.setProperty(
    "--product-presence",
    String(productPresence)
  );
}

function getSceneSnapY(node) {
  const rect = node.getBoundingClientRect();
  return Math.max(
    0,
    Math.round(
      window.scrollY +
        rect.top +
        rect.height * 0.5 -
        window.innerHeight * 0.42
    )
  );
}

function finishSceneJump(sceneId) {
  window.cancelAnimationFrame(state.jumpFrame);
  state.jumpFrame = null;

  const targetNode =
    sceneNodes.find((node) => node.dataset.scene === sceneId) || sceneNodes[0];
  window.scrollTo(0, getSceneSnapY(targetNode));

  state.forcedSceneId = null;
  state.isJumping = false;
  state.isSnapping = false;
  document.documentElement.classList.remove("is-scene-jumping", "is-scene-snapping");
  setActiveScene(sceneId);
  onScroll();
  document.documentElement.style.scrollBehavior = state.savedScrollBehavior;
  state.savedScrollBehavior = "";
  window.clearTimeout(state.snapTimer);
  pulseSceneLock();
}

function navigateToScene(sceneId) {
  const targetNode =
    sceneNodes.find((node) => node.dataset.scene === sceneId) || sceneNodes[0];
  const targetY = getSceneSnapY(targetNode);
  const startY = window.scrollY;
  const distance = targetY - startY;

  window.clearTimeout(state.snapTimer);
  window.cancelAnimationFrame(state.jumpFrame);
  if (!state.isJumping) {
    state.savedScrollBehavior = document.documentElement.style.scrollBehavior;
  }
  document.documentElement.style.scrollBehavior = "auto";
  state.forcedSceneId = sceneId;
  state.isJumping = true;
  state.isSnapping = true;
  document.documentElement.classList.add("is-scene-jumping", "is-scene-snapping");
  setActiveScene(sceneId);
  onScroll();
  pulseSceneLock();

  if (state.reducedMotion || Math.abs(distance) < 4) {
    finishSceneJump(sceneId);
    return;
  }

  const duration = clamp(Math.abs(distance) * 0.26, 560, 920);
  const startTime = window.performance.now();

  function step(now) {
    const progress = clamp((now - startTime) / duration, 0, 1);
    const eased = easeCinematic(progress);
    window.scrollTo(0, Math.round(startY + distance * eased));

    if (progress < 1) {
      state.jumpFrame = window.requestAnimationFrame(step);
      return;
    }

    finishSceneJump(sceneId);
  }

  state.jumpFrame = window.requestAnimationFrame(step);
}

function pulseSceneLock() {
  document.documentElement.classList.add("is-scene-locked");
  state.lockPulse = 1;
  window.clearTimeout(state.lockTimer);
  state.lockTimer = window.setTimeout(() => {
    document.documentElement.classList.remove("is-scene-locked");
  }, 420);
}

function scheduleSceneSnap() {
  if (
    state.reducedMotion ||
    state.isSnapping ||
    window.innerWidth < 760 ||
    showcaseSceneIds.has(state.activeSceneId)
  ) {
    return;
  }

  window.clearTimeout(state.snapTimer);
  state.snapTimer = window.setTimeout(() => {
    const activeNode =
      sceneNodes.find((node) => node.dataset.scene === state.activeSceneId) ||
      sceneNodes[0];
    const targetY = getSceneSnapY(activeNode);
    const delta = Math.abs(window.scrollY - targetY);

    if (delta < window.innerHeight * 0.34 && delta > 8) {
      state.isSnapping = true;
      document.documentElement.classList.add("is-scene-snapping");
      window.scrollTo({ top: targetY, behavior: "smooth" });
      window.setTimeout(() => {
        state.isSnapping = false;
        document.documentElement.classList.remove("is-scene-snapping");
        pulseSceneLock();
      }, 520);
      return;
    }

    if (delta <= 8) {
      pulseSceneLock();
    }
  }, 120);
}

function getChapterMotion(sceneId, progress, direction) {
  const eased = easeInOut(progress);
  const hidden = 1 - eased;
  const exitBias = direction < 0 ? -1 : 1;
  const motion = {
    opacity: eased,
    x: 0,
    y: exitBias * hidden * 46,
    rotate: 0,
    scale: 0.98 + eased * 0.02,
    blur: hidden * 7,
    clipTop: 0,
    clipRight: 0,
    clipBottom: hidden * 18,
    clipLeft: 0,
    lineOpacity: eased * 0.86,
    lineX: hidden * -26,
    lineScale: 0.18 + eased * 0.92,
    indexX: hidden * -12,
    indexY: hidden * 8,
    kickerX: hidden * -10,
    kickerY: hidden * 10,
    titleX: hidden * -18,
    titleY: hidden * 14,
    bodyX: hidden * -10,
    bodyY: hidden * 20,
    origin: "left center",
    lineOrigin: "left center"
  };

  if (sceneId === "intro") {
    return {
      ...motion,
      lineOpacity: eased * 0.56,
      lineScale: 0.18 + eased * 0.72
    };
  }

  if (sceneId === "wafer-drift") {
    return {
      ...motion,
      lineScale: 0.28 + eased * 0.94
    };
  }

  if (sceneId === "yield-constellation") {
    return {
      ...motion,
      lineScale: 0.2 + eased * 1.08
    };
  }

  if (sceneId === "prompt-fabric") {
    return {
      ...motion,
      lineScale: 0.34 + eased * 1.08
    };
  }

  if (sceneId === "approach") {
    return {
      ...motion,
      lineOpacity: eased * 0.5,
      lineScale: 0.72 + eased * 0.22
    };
  }

  return motion;
}

function makeRadialTexture(stops) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  stops.forEach((stop) => {
    gradient.addColorStop(stop.offset, stop.color);
  });
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function setupThreeScene() {
  const canvas = document.getElementById("hero-webgl");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = scenes[0].visual.exposure;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(new THREE.Color("#071017"), 0.045);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.6, 7.6);

  const ambient = new THREE.AmbientLight(0xc7f2f4, scenes[0].visual.ambientLight);
  scene.add(ambient);

  const key = new THREE.SpotLight(0xe8ffff, scenes[0].visual.keyLight, 30, Math.PI * 0.26, 0.42, 1.1);
  key.position.set(4.2, 4.9, 6.2);
  key.target.position.set(0.4, 0, -0.2);
  scene.add(key.target);
  scene.add(key);

  const rim = new THREE.PointLight(0x8cd4d8, scenes[0].visual.rimLight, 22);
  rim.position.set(-4.6, -1.8, 4.2);
  scene.add(rim);

  const inspection = new THREE.SpotLight(0xd7a07c, scenes[0].visual.inspectionLight, 20, Math.PI * 0.18, 0.34, 1.2);
  inspection.position.set(-2.2, 2.4, 3.6);
  inspection.target.position.set(0.2, 0, 0.1);
  scene.add(inspection.target);
  scene.add(inspection);

  const back = new THREE.PointLight(0xb2d585, scenes[0].visual.backLight, 26);
  back.position.set(0.6, 2.8, -5.4);
  scene.add(back);

  const root = new THREE.Group();
  root.position.set(0.2, 0.35, -0.2);
  root.rotation.set(-0.08, 0.12, 0.08);
  scene.add(root);

  const waferMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#8cd4d8"),
    emissive: new THREE.Color("#8cd4d8"),
    emissiveIntensity: 0.12,
    roughness: 0.18,
    metalness: 0.34,
    clearcoat: 0.72,
    clearcoatRoughness: 0.22,
    reflectivity: 0.58,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.92
  });

  const wafer = new THREE.Mesh(
    new THREE.CylinderGeometry(2.46, 2.46, 0.24, 72, 1, true),
    waferMaterial
  );
  wafer.rotation.x = Math.PI * 0.54;
  wafer.rotation.z = -0.18;
  root.add(wafer);

  const waferTop = new THREE.Mesh(
    new THREE.CircleGeometry(2.46, 72),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color("#8cd4d8"),
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
  );
  waferTop.position.y = 0.122;
  waferTop.rotation.x = -Math.PI / 2;
  root.add(waferTop);

  const alignmentGroup = new THREE.Group();
  root.add(alignmentGroup);
  const alignmentMaterials = [];
  const alignmentLines = [
    [new THREE.Vector3(-2.72, 0, 0), new THREE.Vector3(2.72, 0, 0)],
    [new THREE.Vector3(0, 0, -1.96), new THREE.Vector3(0, 0, 1.96)],
    [new THREE.Vector3(-1.42, 0, -1.42), new THREE.Vector3(1.42, 0, 1.42)],
    [new THREE.Vector3(-1.42, 0, 1.42), new THREE.Vector3(1.42, 0, -1.42)]
  ].map((points, index) => {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(index < 2 ? "#8cd4d8" : "#d7a07c"),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      material
    );
    line.rotation.x = 1.14;
    line.position.y = 0.36 + index * 0.012;
    alignmentGroup.add(line);
    alignmentMaterials.push(material);
    return line;
  });

  const notchMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color("#e8ffff"),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const notchMarker = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.18, 0, 0),
      new THREE.Vector3(0, 0.1, 0),
      new THREE.Vector3(0.18, 0, 0)
    ]),
    notchMaterial
  );
  notchMarker.rotation.x = 1.14;
  notchMarker.position.set(0, 0.5, -1.86);
  alignmentGroup.add(notchMarker);
  alignmentMaterials.push(notchMaterial);

  const glowTexture = makeRadialTexture([
    { offset: 0, color: "rgba(255,255,255,0.72)" },
    { offset: 0.18, color: "rgba(140,212,216,0.52)" },
    { offset: 0.52, color: "rgba(140,212,216,0.16)" },
    { offset: 1, color: "rgba(140,212,216,0)" }
  ]);
  const warmGlowTexture = makeRadialTexture([
    { offset: 0, color: "rgba(255,244,215,0.82)" },
    { offset: 0.2, color: "rgba(215,160,124,0.44)" },
    { offset: 0.58, color: "rgba(215,160,124,0.1)" },
    { offset: 1, color: "rgba(215,160,124,0)" }
  ]);

  const haloMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    color: new THREE.Color("#8cd4d8"),
    transparent: true,
    opacity: scenes[0].visual.haloOpacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const waferHalo = new THREE.Sprite(haloMaterial);
  waferHalo.position.set(0, 0.18, 0);
  waferHalo.scale.set(6.2, 4.2, 1);
  root.add(waferHalo);

  const innerGlowMaterial = new THREE.MeshBasicMaterial({
    map: glowTexture,
    color: new THREE.Color("#8cd4d8"),
    transparent: true,
    opacity: scenes[0].visual.innerGlowOpacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const innerGlow = new THREE.Mesh(new THREE.CircleGeometry(2.32, 72), innerGlowMaterial);
  innerGlow.position.y = 0.135;
  innerGlow.rotation.x = -Math.PI / 2;
  root.add(innerGlow);

  const lensFlareMaterial = new THREE.SpriteMaterial({
    map: warmGlowTexture,
    color: new THREE.Color("#d7a07c"),
    transparent: true,
    opacity: scenes[0].visual.lensOpacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const lensFlare = new THREE.Sprite(lensFlareMaterial);
  lensFlare.position.set(-2.3, 1.18, 1.5);
  lensFlare.scale.set(1.7, 1.7, 1);
  root.add(lensFlare);

  const seedMaterial = new THREE.SpriteMaterial({
    map: warmGlowTexture,
    color: new THREE.Color("#e8ffff"),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const seedSignal = new THREE.Sprite(seedMaterial);
  seedSignal.position.set(0, 0.72, 0);
  seedSignal.scale.set(1.15, 1.15, 1);
  root.add(seedSignal);

  const focusGroup = new THREE.Group();
  root.add(focusGroup);
  const focusMaterials = [];
  [0.42, 0.62, 0.9].forEach((radius, index) => {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(index === 0 ? "#e8ffff" : index === 1 ? "#d7a07c" : "#8cd4d8"),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 64 }, (_, pointIndex) => {
        const angle = (Math.PI * 2 * pointIndex) / 64;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.62,
          0
        );
      })
    );
    const ring = new THREE.LineLoop(geometry, material);
    ring.rotation.x = 1.14;
    ring.position.y = index * 0.026;
    focusGroup.add(ring);
    focusMaterials.push(material);
  });

  const focusGlowMaterial = new THREE.MeshBasicMaterial({
    map: glowTexture,
    color: new THREE.Color("#e8ffff"),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const focusGlow = new THREE.Mesh(
    new THREE.CircleGeometry(0.92, 72),
    focusGlowMaterial
  );
  focusGlow.rotation.x = -Math.PI / 2;
  focusGlow.position.y = -0.012;
  focusGroup.add(focusGlow);

  const focusScanMaterial = new THREE.MeshBasicMaterial({
    map: glowTexture,
    color: new THREE.Color("#d7a07c"),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const focusScan = new THREE.Mesh(
    new THREE.PlaneGeometry(1.72, 0.12),
    focusScanMaterial
  );
  focusScan.rotation.set(1.12, 0, -0.18);
  focusScan.position.y = 0.12;
  focusGroup.add(focusScan);

  const focusPins = [];
  [-0.34, 0, 0.34].forEach((offset, index) => {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(index === 1 ? "#e8ffff" : "#b2d585"),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const pin = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(offset, 0, -0.18),
        new THREE.Vector3(offset, 0.18, 0),
        new THREE.Vector3(offset, 0, 0.18)
      ]),
      material
    );
    pin.rotation.x = 1.14;
    pin.position.y = 0.08 + index * 0.018;
    focusGroup.add(pin);
    focusMaterials.push(material);
    focusPins.push(pin);
  });

  const ringGroup = new THREE.Group();
  root.add(ringGroup);
  const ringMaterials = [];
  [2.72, 3.54, 4.6].forEach((radius, index) => {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(index === 0 ? "#8cd4d8" : index === 1 ? "#b2d585" : "#d7a07c"),
      transparent: true,
      opacity: index === 1 ? 0.18 : 0.26,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 140 }, (_, pointIndex) => {
        const angle = (Math.PI * 2 * pointIndex) / 140;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.7,
          0
        );
      })
    );
    const ring = new THREE.LineLoop(geometry, material);
    ring.rotation.x = 1.14;
    ring.rotation.z = index * 0.24;
    ringGroup.add(ring);
    ringMaterials.push(material);
  });

  const edgeGroup = new THREE.Group();
  root.add(edgeGroup);
  const edgeMaterials = [];
  const edgeSweeps = [
    { radius: 2.5, start: -0.22, length: 0.9, color: "#e8ffff" },
    { radius: 2.52, start: 2.15, length: 0.72, color: "#d7a07c" },
    { radius: 2.58, start: 4.05, length: 0.66, color: "#b2d585" }
  ].map((arc, index) => {
    const points = Array.from({ length: 40 }, (_, pointIndex) => {
      const t = pointIndex / 39;
      const angle = arc.start + t * arc.length;
      return new THREE.Vector3(
        Math.cos(angle) * arc.radius,
        Math.sin(t * Math.PI) * (0.03 + index * 0.012),
        Math.sin(angle) * arc.radius * 0.72
      );
    });
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(arc.color),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      material
    );
    line.rotation.x = 1.14;
    line.position.y = 0.42 + index * 0.03;
    edgeGroup.add(line);
    edgeMaterials.push(material);
    return line;
  });

  const dieGeometry = new THREE.BoxGeometry(0.21, 0.04, 0.21);
  const dieMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#b2d585"),
    emissive: new THREE.Color("#b2d585"),
    emissiveIntensity: scenes[0].visual.dieGlow,
    roughness: 0.34,
    metalness: 0.16,
    transparent: true,
    opacity: 0.46
  });
  const dieMesh = new THREE.InstancedMesh(dieGeometry, dieMaterial, 100);
  dieMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  dieMesh.instanceColor = new THREE.InstancedBufferAttribute(
    new Float32Array(100 * 3),
    3
  );
  root.add(dieMesh);

  const dieDummy = new THREE.Object3D();
  const dieColor = new THREE.Color();
  const baseDieColor = new THREE.Color("#b2d585");
  const failDieColor = new THREE.Color("#d7a07c");
  const passDieColor = new THREE.Color("#8cd4d8");
  const focusDieColor = new THREE.Color("#e8ffff");
  const quietDieColor = new THREE.Color("#5f7972");
  const dieData = [];
  for (let x = -5; x < 5; x += 1) {
    for (let z = -5; z < 5; z += 1) {
      const index = dieData.length;
      const gridX = x + 4.5;
      const gridZ = z + 4.5;
      const normalizedX = gridX / 9 - 0.5;
      const normalizedZ = gridZ / 9 - 0.5;
      const clusterA = Math.hypot(normalizedX + 0.2, normalizedZ - 0.16);
      const clusterB = Math.hypot(normalizedX - 0.22, normalizedZ + 0.08);
      dieData.push({
        x: x * 0.36,
        z: z * 0.36,
        baseX: x * 0.36,
        baseZ: z * 0.36,
        constellationX: Math.cos(index * 1.87) * (1.15 + (index % 7) * 0.13),
        constellationZ: Math.sin(index * 1.39) * (0.9 + (index % 6) * 0.12),
        fabricX: (gridX - 4.5) * 0.48,
        fabricZ: (Math.sin(gridX * 0.9) * 0.28) + (gridZ - 4.5) * 0.06,
        cluster: Math.max(0, 1 - Math.min(clusterA, clusterB) * 4.6),
        signal: ((x + z + 10) % 5) / 4,
        lift: ((x + z + 10) % 5) * 0.012,
        revealRank:
          (x === 0 && (z + 5) % 2 === 0) ||
          (z === 0 && (x + 5) % 2 === 0) ||
          (x === -4 && z === -3) ||
          (x === 3 && z === 2)
            ? 0
            : 0.18 + (((index * 37) % 83) / 82) * 0.72
      });
    }
  }

  const traceGroup = new THREE.Group();
  root.add(traceGroup);
  const traceMaterials = [];
  const traceLines = [];
  [0, 1, 2].forEach((index) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 60 }, (_, pointIndex) => {
        const t = pointIndex / 59;
        return new THREE.Vector3(
          -3.4 + t * 6.8,
          Math.sin(t * Math.PI * (index + 1)) * (0.34 + index * 0.14),
          -0.55 + index * 0.55
        );
      })
    );
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(index === 0 ? "#d7a07c" : index === 1 ? "#8cd4d8" : "#b2d585"),
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geometry, material);
    line.rotation.x = 1.14;
    line.position.y = 0.54 + index * 0.18;
    traceGroup.add(line);
    traceMaterials.push(material);
    traceLines.push(line);
  });

  const beamTexture = makeRadialTexture([
    { offset: 0, color: "rgba(255,255,255,0.46)" },
    { offset: 0.2, color: "rgba(140,212,216,0.3)" },
    { offset: 0.62, color: "rgba(140,212,216,0.08)" },
    { offset: 1, color: "rgba(140,212,216,0)" }
  ]);
  const beamGroup = new THREE.Group();
  root.add(beamGroup);
  const beamMaterials = [];
  const beams = [
    { x: -1.8, y: 1.05, z: 0.5, width: 7.4, height: 0.34, color: "#8cd4d8", rotate: -0.2 },
    { x: 0.4, y: 0.72, z: -0.18, width: 6.4, height: 0.22, color: "#d7a07c", rotate: 0.12 },
    { x: 1.2, y: 1.36, z: -0.9, width: 5.8, height: 0.18, color: "#b2d585", rotate: 0.36 }
  ].map((beam) => {
    const material = new THREE.MeshBasicMaterial({
      map: beamTexture,
      color: new THREE.Color(beam.color),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(beam.width, beam.height), material);
    mesh.position.set(beam.x, beam.y, beam.z);
    mesh.rotation.set(1.1, 0.1, beam.rotate);
    beamGroup.add(mesh);
    beamMaterials.push(material);
    return mesh;
  });

  const slitMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#e8ffff"),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const exposureSlit = new THREE.Mesh(
    new THREE.PlaneGeometry(0.34, 5.4),
    slitMaterial
  );
  exposureSlit.rotation.set(1.12, 0.02, -0.18);
  exposureSlit.position.set(-1.6, 0.92, 0.04);
  root.add(exposureSlit);

  const lotGroup = new THREE.Group();
  root.add(lotGroup);
  const lotMaterials = [];
  const lotMaps = [
    { x: -1.18, y: 0.22, z: -0.72, scale: 0.42, color: "#8cd4d8" },
    { x: 1.12, y: 0.28, z: 0.72, scale: 0.36, color: "#d7a07c" },
    { x: 0.18, y: 0.42, z: -1.28, scale: 0.3, color: "#b2d585" }
  ].map((lot, index) => {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(lot.color),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 96 }, (_, pointIndex) => {
        const angle = (Math.PI * 2 * pointIndex) / 96;
        return new THREE.Vector3(
          Math.cos(angle) * lot.scale * 2.4,
          Math.sin(angle) * lot.scale * 1.55,
          0
        );
      })
    );
    const line = new THREE.LineLoop(geometry, material);
    line.rotation.x = 1.14;
    line.rotation.z = index * 0.28;
    line.position.set(lot.x, lot.y, lot.z);
    lotGroup.add(line);
    lotMaterials.push(material);
    return line;
  });

  const constellationGroup = new THREE.Group();
  root.add(constellationGroup);
  const constellationMaterials = [];
  const constellationLines = [];
  [0, 1, 2, 3].forEach((index) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 18 }, (_, pointIndex) => {
        const angle = pointIndex * 0.8 + index * 1.3;
        const radius = 0.7 + pointIndex * 0.12 + index * 0.18;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(pointIndex * 0.54 + index) * 0.18,
          Math.sin(angle) * radius * 0.72
        );
      })
    );
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(index % 2 ? "#b2d585" : "#8cd4d8"),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geometry, material);
    line.rotation.x = 1.16;
    line.position.y = 0.88 + index * 0.12;
    constellationGroup.add(line);
    constellationMaterials.push(material);
    constellationLines.push(line);
  });

  const defectGroup = new THREE.Group();
  root.add(defectGroup);
  const defectMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color("#d7a07c"),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const defectMeshes = [
    { x: -0.68, z: 0.46, radius: 0.42 },
    { x: 0.68, z: -0.24, radius: 0.32 },
    { x: 0.16, z: 0.78, radius: 0.24 },
    { x: -0.08, z: -0.64, radius: 0.2 }
  ].map((item, index) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 54 }, (_, pointIndex) => {
        const angle = (Math.PI * 2 * pointIndex) / 54;
        return new THREE.Vector3(
          Math.cos(angle) * item.radius,
          Math.sin(angle) * item.radius * 0.7,
          0
        );
      })
    );
    const ring = new THREE.LineLoop(geometry, defectMaterial);
    ring.position.set(item.x, 0.3 + index * 0.035, item.z);
    ring.rotation.x = 1.14;
    defectGroup.add(ring);
    return ring;
  });

  const scanBracketMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color("#d7a07c"),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const scanBracket = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.6, 0, -0.62),
      new THREE.Vector3(-0.95, 0, -0.62),
      new THREE.Vector3(-1.6, 0, -0.62),
      new THREE.Vector3(-1.6, 0, -0.2),
      new THREE.Vector3(1.6, 0, 0.62),
      new THREE.Vector3(0.95, 0, 0.62),
      new THREE.Vector3(1.6, 0, 0.62),
      new THREE.Vector3(1.6, 0, 0.2)
    ]),
    scanBracketMaterial
  );
  scanBracket.rotation.x = 1.14;
  scanBracket.position.y = 0.76;
  defectGroup.add(scanBracket);

  const fabricGroup = new THREE.Group();
  root.add(fabricGroup);
  const fabricMaterials = [];
  const fabricLines = [];
  [-0.54, -0.27, 0, 0.27, 0.54].forEach((zOffset, index) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 80 }, (_, pointIndex) => {
        const t = pointIndex / 79;
        return new THREE.Vector3(
          -3.2 + t * 6.4,
          Math.sin(t * Math.PI * 6 + index) * 0.035,
          zOffset + Math.sin(t * Math.PI * 2 + index) * 0.06
        );
      })
    );
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(index % 2 ? "#8cd4d8" : "#b2d585"),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geometry, material);
    line.rotation.x = 1.14;
    line.position.y = 0.62 + index * 0.04;
    fabricGroup.add(line);
    fabricMaterials.push(material);
    fabricLines.push(line);
  });

  const feedbackGroup = new THREE.Group();
  root.add(feedbackGroup);
  const feedbackMaterials = [];
  const feedbackLines = [
    { from: [-2.2, 0.2, -0.9], to: [-0.62, 0.72, -0.22], color: "#d7a07c" },
    { from: [1.88, 0.14, 0.82], to: [0.48, 0.82, 0.18], color: "#8cd4d8" },
    { from: [-1.42, 0.18, 1.1], to: [0.1, 0.68, 0.42], color: "#b2d585" },
    { from: [1.2, 0.16, -1.1], to: [-0.18, 0.76, -0.4], color: "#e8ffff" }
  ].map((vector, index) => {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(vector.color),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const points = [
      new THREE.Vector3(...vector.from),
      new THREE.Vector3(
        (vector.from[0] + vector.to[0]) * 0.5,
        1.05 + index * 0.04,
        (vector.from[2] + vector.to[2]) * 0.5
      ),
      new THREE.Vector3(...vector.to)
    ];
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      material
    );
    line.rotation.x = 1.14;
    feedbackGroup.add(line);
    feedbackMaterials.push(material);
    return line;
  });

  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 180;
  const positions = new Float32Array(particleCount * 3);
  const particleSeeds = [];
  for (let index = 0; index < particleCount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3.1 + Math.random() * 4.4;
    const height = (Math.random() - 0.5) * 4.8;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = height;
    positions[index * 3 + 2] = Math.sin(angle) * radius;
    particleSeeds.push({
      angle,
      radius,
      speed: 0.16 + Math.random() * 0.26
    });
  }
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: new THREE.Color("#8cd4d8"),
      size: 0.036,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.82
    })
  );
  scene.add(particles);

  const backgroundGroup = new THREE.Group();
  scene.add(backgroundGroup);
  const backgroundMaterials = [];
  const backgroundLines = [];
  for (let layer = 0; layer < 5; layer += 1) {
    const z = -8.8 - layer * 1.45;
    const y = -1.8 + layer * 0.72;
    const width = 8.2 + layer * 1.1;
    const points = [];
    for (let index = 0; index < 54; index += 1) {
      const t = index / 53;
      points.push(
        new THREE.Vector3(
          -width * 0.5 + t * width,
          y + Math.sin(t * Math.PI * 3 + layer) * 0.18,
          z + Math.cos(t * Math.PI * 2 + layer) * 0.18
        )
      );
    }
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(layer % 2 ? "#8cd4d8" : "#b2d585"),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      material
    );
    line.position.x = layer % 2 ? -1.1 : 1.3;
    backgroundGroup.add(line);
    backgroundMaterials.push(material);
    backgroundLines.push(line);
  }

  const scanPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(8.2, 0.16),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color("#d7a07c"),
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
  );
  scanPlane.rotation.x = 1.2;
  scanPlane.position.y = 0.4;
  root.add(scanPlane);

  state.three = {
    renderer,
    scene,
    camera,
    ambient,
    key,
    rim,
    inspection,
    back,
    root,
    waferMaterial,
    waferTop,
    alignmentGroup,
    alignmentMaterials,
    notchMarker,
    waferHalo,
    innerGlow,
    lensFlare,
    seedSignal,
    seedMaterial,
    focusGroup,
    focusMaterials,
    focusGlow,
    focusGlowMaterial,
    focusScan,
    focusScanMaterial,
    focusPins,
    ringMaterials,
    ringGroup,
    edgeGroup,
    edgeMaterials,
    edgeSweeps,
    dieMesh,
    dieMaterial,
    dieDummy,
    dieColor,
    baseDieColor,
    failDieColor,
    passDieColor,
    focusDieColor,
    quietDieColor,
    dieData,
    traceGroup,
    traceLines,
    beamGroup,
    beamMaterials,
    beams,
    exposureSlit,
    slitMaterial,
    lotGroup,
    lotMaterials,
    lotMaps,
    particles,
    particleSeeds,
    backgroundGroup,
    backgroundMaterials,
    backgroundLines,
    scanPlane,
    traceMaterials,
    constellationGroup,
    constellationMaterials,
    constellationLines,
    defectGroup,
    defectMaterial,
    defectMeshes,
    scanBracket,
    scanBracketMaterial,
    fabricGroup,
    fabricMaterials,
    fabricLines,
    feedbackGroup,
    feedbackMaterials,
    feedbackLines,
    baseCamera: { ...scenes[0].camera },
    currentCamera: { ...scenes[0].camera },
    currentRootPosition: { ...scenes[0].rootPosition },
    currentRootRotation: { ...scenes[0].rootRotation },
    currentFocusTarget: { ...scenes[0].focusTarget },
    currentScale: scenes[0].scale,
    currentScan: scenes[0].scan,
    currentVisual: { ...scenes[0].visual }
  };

  resizeThreeScene();
  renderer.setAnimationLoop(animateThreeScene);
}

function resizeThreeScene() {
  if (!state.three) {
    return;
  }

  const { renderer, camera } = state.three;
  const width = renderer.domElement.clientWidth;
  const height = renderer.domElement.clientHeight;
  if (width === 0 || height === 0) {
    return;
  }
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function onScroll() {
  let bestScene = state.forcedSceneId ? getScene(state.forcedSceneId) : scenes[0];
  let bestProgress = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  let activeChapterState = null;
  const chapterFocusLine = window.innerHeight * 0.42;
  const chapterRange = window.innerHeight * 0.78;
  const openingProgress = clamp(window.scrollY / (window.innerHeight * 0.72), 0, 1);
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight || 1;
  state.scrollProgress = clamp(window.scrollY / maxScroll, 0, 1);
  document.documentElement.style.setProperty(
    "--stage-progress",
    String(state.scrollProgress)
  );

  document.documentElement.style.setProperty(
    "--opening-opacity",
    String(1 - openingProgress * 1.05)
  );
  document.documentElement.style.setProperty(
    "--opening-y",
    `${openingProgress * -72}px`
  );
  document.documentElement.style.setProperty(
    "--opening-blur",
    `${openingProgress * 12}px`
  );

  const chapterStates = sceneNodes.map((node) => {
    const rect = node.getBoundingClientRect();
    const center = rect.top + rect.height * 0.5;
    const distance = Math.abs(chapterFocusLine - center);
    const progress = clamp(1 - distance / chapterRange, 0, 1);
    return {
      node,
      center,
      distance,
      progress,
      direction: center < chapterFocusLine ? -1 : 1
    };
  });

  if (!state.forcedSceneId) {
    const currentChapterState =
      chapterStates.find(
        (chapterState) => chapterState.node.dataset.scene === state.activeSceneId
      ) || chapterStates[0];

    chapterStates.forEach((chapterState) => {
      if (
        chapterState.progress > bestProgress ||
        (chapterState.progress === bestProgress &&
          chapterState.distance < bestDistance)
      ) {
        bestProgress = chapterState.progress;
        bestDistance = chapterState.distance;
        bestScene = getScene(chapterState.node.dataset.scene);
        activeChapterState = chapterState;
      }
    });

    if (
      activeChapterState.progress < sceneSwitchProgress &&
      currentChapterState.progress > sceneReleaseProgress
    ) {
      bestScene = getScene(state.activeSceneId);
      activeChapterState = currentChapterState;
    }
  } else {
    activeChapterState =
      chapterStates.find(
        (chapterState) => chapterState.node.dataset.scene === state.forcedSceneId
      ) || chapterStates[0];
  }

  setActiveScene(bestScene.id);
  state.sceneProgress = activeChapterState?.progress || 0;

  chapterStates.forEach(({ node, progress, direction }) => {
    node.classList.toggle("is-active", node.dataset.scene === state.activeSceneId);
    const motion = getChapterMotion(node.dataset.scene, progress, direction);

    node.style.setProperty("--chapter-opacity", String(motion.opacity));
    node.style.setProperty("--chapter-x", `${motion.x}px`);
    node.style.setProperty("--chapter-y", `${motion.y}px`);
    node.style.setProperty("--chapter-rotate", `${motion.rotate}deg`);
    node.style.setProperty("--chapter-scale", String(motion.scale));
    node.style.setProperty("--chapter-blur", `${motion.blur}px`);
    node.style.setProperty("--chapter-clip-top", `${motion.clipTop}%`);
    node.style.setProperty("--chapter-clip-right", `${motion.clipRight}%`);
    node.style.setProperty("--chapter-clip-bottom", `${motion.clipBottom}%`);
    node.style.setProperty("--chapter-clip-left", `${motion.clipLeft}%`);
    node.style.setProperty("--chapter-line-opacity", String(motion.lineOpacity));
    node.style.setProperty("--chapter-line-x", `${motion.lineX}px`);
    node.style.setProperty("--chapter-line-scale", String(motion.lineScale));
    node.style.setProperty("--chapter-index-x", `${motion.indexX}px`);
    node.style.setProperty("--chapter-index-y", `${motion.indexY}px`);
    node.style.setProperty("--chapter-kicker-x", `${motion.kickerX}px`);
    node.style.setProperty("--chapter-kicker-y", `${motion.kickerY}px`);
    node.style.setProperty("--chapter-title-x", `${motion.titleX}px`);
    node.style.setProperty("--chapter-title-y", `${motion.titleY}px`);
    node.style.setProperty("--chapter-body-x", `${motion.bodyX}px`);
    node.style.setProperty("--chapter-body-y", `${motion.bodyY}px`);
    node.style.setProperty("--chapter-origin", motion.origin);
    node.style.setProperty("--chapter-line-origin", motion.lineOrigin);
  });

  updateProductShowcases(chapterStates);
  scheduleSceneSnap();
}

function animateThreeScene(timeMs) {
  if (!state.three) {
    return;
  }

  const {
    renderer,
    scene,
    camera,
    ambient,
    key,
    rim,
    inspection,
    back,
    root,
    waferMaterial,
    waferTop,
    alignmentGroup,
    alignmentMaterials,
    notchMarker,
    waferHalo,
    innerGlow,
    lensFlare,
    seedSignal,
    seedMaterial,
    focusGroup,
    focusMaterials,
    focusGlow,
    focusGlowMaterial,
    focusScan,
    focusScanMaterial,
    focusPins,
    ringGroup,
    ringMaterials,
    edgeGroup,
    edgeMaterials,
    edgeSweeps,
    dieMesh,
    dieMaterial,
    dieDummy,
    dieColor,
    baseDieColor,
    failDieColor,
    passDieColor,
    focusDieColor,
    quietDieColor,
    dieData,
    traceGroup,
    traceLines,
    beamGroup,
    beamMaterials,
    beams,
    exposureSlit,
    slitMaterial,
    lotGroup,
    lotMaterials,
    lotMaps,
    traceMaterials,
    particles,
    particleSeeds,
    backgroundGroup,
    backgroundMaterials,
    backgroundLines,
    scanPlane,
    constellationGroup,
    constellationMaterials,
    constellationLines,
    defectGroup,
    defectMaterial,
    defectMeshes,
    scanBracket,
    scanBracketMaterial,
    fabricGroup,
    fabricMaterials,
    fabricLines,
    feedbackGroup,
    feedbackMaterials,
    feedbackLines,
    currentCamera,
    currentRootPosition,
    currentRootRotation,
    currentFocusTarget,
    currentVisual
  } = state.three;

  const time = timeMs * 0.001;
  const targetScene = getScene(state.activeSceneId);
  const xRatio = state.pointer.x / window.innerWidth - 0.5;
  const yRatio = state.pointer.y / window.innerHeight - 0.5;
  state.lockPulse = lerp(state.lockPulse, 0, 0.095);
  const lockPulse = state.lockPulse;
  const sceneEase = state.isJumping ? 0.12 : 0.072;
  const visualEase = state.isJumping ? 0.12 : 0.078;

  currentCamera.x = lerp(currentCamera.x, targetScene.camera.x, sceneEase);
  currentCamera.y = lerp(currentCamera.y, targetScene.camera.y, sceneEase);
  currentCamera.z = lerp(currentCamera.z, targetScene.camera.z, sceneEase);

  currentRootPosition.x = lerp(currentRootPosition.x, targetScene.rootPosition.x, sceneEase);
  currentRootPosition.y = lerp(currentRootPosition.y, targetScene.rootPosition.y, sceneEase);
  currentRootPosition.z = lerp(currentRootPosition.z, targetScene.rootPosition.z, sceneEase);

  currentRootRotation.x = lerp(currentRootRotation.x, targetScene.rootRotation.x, sceneEase);
  currentRootRotation.y = lerp(currentRootRotation.y, targetScene.rootRotation.y, sceneEase);
  currentRootRotation.z = lerp(currentRootRotation.z, targetScene.rootRotation.z, sceneEase);
  currentFocusTarget.x = lerp(currentFocusTarget.x, targetScene.focusTarget.x, sceneEase);
  currentFocusTarget.y = lerp(currentFocusTarget.y, targetScene.focusTarget.y, sceneEase);
  currentFocusTarget.z = lerp(currentFocusTarget.z, targetScene.focusTarget.z, sceneEase);

  state.three.currentScale = lerp(state.three.currentScale, targetScene.scale, sceneEase);
  state.three.currentScan = lerp(state.three.currentScan, targetScene.scan, sceneEase);

  Object.keys(currentVisual).forEach((key) => {
    currentVisual[key] = lerp(currentVisual[key], targetScene.visual[key], visualEase);
  });

  const focusLocal = new THREE.Vector3(
    currentFocusTarget.x,
    currentFocusTarget.y,
    currentFocusTarget.z
  );
  const focusWorld = applyRootTransform(
    focusLocal,
    currentRootPosition,
    currentRootRotation,
    state.three.currentScale
  );

  camera.position.set(
    currentCamera.x + focusWorld.x * 0.08 + xRatio * 0.14,
    currentCamera.y + focusWorld.y * 0.08 + yRatio * -0.09,
    currentCamera.z
  );
  camera.lookAt(
    focusWorld.x * 0.82 + xRatio * 0.08,
    focusWorld.y * 0.86 + yRatio * -0.04,
    focusWorld.z - 0.2
  );

  renderer.toneMappingExposure = currentVisual.exposure;
  ambient.intensity = currentVisual.ambientLight;
  key.intensity =
    currentVisual.keyLight *
    (0.92 + Math.sin(time * 0.42) * 0.08) *
    (1 + lockPulse * 0.16);
  rim.intensity =
    currentVisual.rimLight * (0.88 + Math.sin(time * 0.34 + 1.2) * 0.1);
  inspection.intensity =
    currentVisual.inspectionLight *
    (0.82 + (Math.sin(time * 1.8) + 1) * 0.16) *
    (1 + lockPulse * 0.24);
  back.intensity =
    currentVisual.backLight * (0.88 + Math.sin(time * 0.28 + 2.4) * 0.08);

  key.position.set(
    3.4 + focusWorld.x * 0.38 + xRatio * 0.5 + Math.sin(time * 0.24) * 0.32,
    4.4 + focusWorld.y * 0.26 + Math.cos(time * 0.18) * 0.26,
    5.7 + focusWorld.z * 0.12
  );
  key.target.position.set(focusWorld.x, focusWorld.y, focusWorld.z - 0.18);
  inspection.position.set(
    focusWorld.x - 1.8 + Math.sin(time * 0.68) * 0.46,
    focusWorld.y + 1.9 + Math.cos(time * 0.52) * 0.18,
    3.4 + focusWorld.z * 0.18 + currentVisual.defect * 0.5
  );
  inspection.target.position.set(focusWorld.x, focusWorld.y, focusWorld.z);
  rim.position.x = -4.6 + Math.sin(time * 0.22) * 0.4;
  back.position.z = -5.4 - currentVisual.constellation * 1.2;

  root.position.set(
    currentRootPosition.x + xRatio * 0.22,
    currentRootPosition.y + yRatio * -0.1,
    currentRootPosition.z
  );
  root.rotation.set(
    currentRootRotation.x + yRatio * -0.05,
    currentRootRotation.y + xRatio * 0.08,
    currentRootRotation.z + xRatio * 0.025
  );
  root.scale.setScalar(state.three.currentScale * (1 + lockPulse * 0.022));

  waferMaterial.opacity = currentVisual.waferOpacity;
  waferMaterial.emissiveIntensity = currentVisual.waferGlow + lockPulse * 0.18;
  waferTop.material.opacity = currentVisual.waferTopOpacity;
  waferTop.material.blending = THREE.AdditiveBlending;
  waferHalo.material.opacity =
    currentVisual.haloOpacity * (0.82 + Math.sin(time * 0.72) * 0.12) +
    lockPulse * 0.06;
  waferHalo.scale.setScalar(5.2 * currentVisual.haloScale * (1 + lockPulse * 0.025));
  waferHalo.scale.y *= 0.68;
  innerGlow.material.opacity =
    currentVisual.innerGlowOpacity *
    (0.8 + (Math.sin(time * 1.7 + currentVisual.defect) + 1) * 0.16);
  lensFlare.material.opacity =
    currentVisual.lensOpacity *
    (0.72 + (Math.sin(time * 1.2 + 0.8) + 1) * 0.18);
  lensFlare.position.x = -2.3 + Math.sin(time * 0.72) * currentVisual.beamSpread * 0.28;
  lensFlare.position.y = 1.18 + Math.cos(time * 0.54) * 0.12;
  seedMaterial.opacity =
    currentVisual.seedGlow *
    (0.22 + (Math.sin(time * 1.8) + 1) * 0.16);
  seedSignal.scale.setScalar(0.78 + currentVisual.seedGlow * 0.56);
  seedSignal.position.y = 0.68 + Math.sin(time * 0.8) * currentVisual.seedGlow * 0.08;
  focusGroup.position.set(
    currentFocusTarget.x,
    currentFocusTarget.y + Math.sin(time * 0.7) * 0.035,
    currentFocusTarget.z
  );
  focusGroup.rotation.z = Math.sin(time * 0.42) * 0.1 + currentVisual.feedback * 0.04;
  focusGroup.scale.setScalar(
    currentVisual.focusScale *
      (0.96 + Math.sin(time * 0.9) * 0.025 + lockPulse * 0.085)
  );
  focusGlowMaterial.opacity =
    currentVisual.focusOpacity *
    (0.18 + currentVisual.seedGlow * 0.05) *
    (0.74 + Math.sin(time * 1.4) * 0.12) +
    lockPulse * 0.16;
  focusGlow.scale.setScalar(1 + currentVisual.focusRadius * 0.34 + lockPulse * 0.16);
  focusScan.position.x =
    Math.sin(time * (1.2 + currentVisual.exposureSlit * 0.32)) *
    currentVisual.focusRadius *
    0.72;
  focusScan.position.y = 0.16 + Math.sin(time * 1.6) * 0.035;
  focusScan.rotation.z = -0.16 + currentVisual.beamSkew * 0.18;
  focusScan.scale.set(
    0.72 + currentVisual.focusRadius * 0.48 + lockPulse * 0.24,
    0.92 + currentVisual.focusOpacity * 0.38 + lockPulse * 0.12,
    1
  );
  focusScanMaterial.opacity =
    currentVisual.focusOpacity *
    (0.16 + currentVisual.exposureSlit * 0.06 + currentVisual.feedback * 0.035) *
    (0.7 + Math.sin(time * 2.4) * 0.16) +
    lockPulse * 0.22;
  focusMaterials.forEach((material, index) => {
    material.opacity =
      currentVisual.focusOpacity *
      (index < 3 ? 0.24 + index * 0.11 : 0.18) *
        (0.72 + Math.sin(time * (1.2 + index * 0.2) + index) * 0.16) +
      lockPulse * (index < 3 ? 0.14 : 0.09);
  });
  focusPins.forEach((pin, index) => {
    pin.position.y = 0.09 + Math.sin(time * 1.7 + index) * 0.026;
    pin.scale.y = 0.76 + currentVisual.focusOpacity * 0.42;
  });
  dieMaterial.opacity = currentVisual.dieOpacity;
  dieMaterial.emissiveIntensity = currentVisual.dieGlow;
  particles.material.opacity = currentVisual.particleOpacity;
  particles.material.size = currentVisual.particleSize;
  alignmentGroup.rotation.z = Math.sin(time * 0.18) * currentVisual.alignment * 0.08;
  alignmentGroup.scale.setScalar(0.92 + currentVisual.alignment * 0.08);
  alignmentMaterials.forEach((material, index) => {
    material.opacity =
      currentVisual.alignment *
      (0.28 + index * 0.08) *
      (0.82 + Math.sin(time * 1.1 + index) * 0.12);
  });
  notchMarker.position.z = -1.86 + Math.sin(time * 0.7) * currentVisual.alignment * 0.05;
  exposureSlit.position.x =
    -2.2 + ((Math.sin(time * currentVisual.scanSpeed * 0.78) + 1) * 2.2);
  exposureSlit.position.z = Math.sin(time * 0.42) * 0.18;
  exposureSlit.scale.x = 0.86 + currentVisual.exposureSlit * 0.34;
  exposureSlit.scale.y = 0.78 + currentVisual.exposureSlit * 0.22;
  slitMaterial.opacity =
    currentVisual.exposureSlit *
    (0.18 + (Math.sin(time * currentVisual.scanSpeed * 0.5) + 1) * 0.12);
  ringGroup.scale.setScalar(currentVisual.ringScale);
  edgeGroup.rotation.z =
    Math.sin(time * 0.32) * currentVisual.edgeSweep * 0.28;
  edgeGroup.position.y = Math.sin(time * 0.62) * currentVisual.edgeSweep * 0.035;
  traceGroup.position.y = currentVisual.traceLift * 0.1;
  beamGroup.rotation.z = currentVisual.beamSkew + Math.sin(time * 0.22) * 0.04;
  constellationGroup.rotation.z = time * 0.06;
  constellationGroup.scale.setScalar(0.78 + currentVisual.constellation * 0.42);
  defectGroup.rotation.z = Math.sin(time * 0.22) * 0.08;
  fabricGroup.position.z = Math.sin(time * 0.32) * currentVisual.fabric * 0.08;
  feedbackGroup.rotation.z = Math.sin(time * 0.26) * currentVisual.feedback * 0.12;
  feedbackGroup.position.y = Math.sin(time * 0.54) * currentVisual.feedback * 0.08;
  lotGroup.rotation.z = Math.sin(time * 0.12) * currentVisual.lotMultiplicity * 0.18;
  lotGroup.position.y = Math.sin(time * 0.3) * currentVisual.lotMultiplicity * 0.08;
  backgroundGroup.rotation.y = xRatio * 0.08 + Math.sin(time * 0.05) * 0.02;
  backgroundGroup.position.x = xRatio * -0.48;
  backgroundGroup.position.y = yRatio * 0.16;

  ringMaterials.forEach((material, index) => {
    material.opacity = currentVisual.ringOpacity * (index === 1 ? 0.74 : 1);
  });
  traceMaterials.forEach((material, index) => {
    material.opacity = currentVisual.traceOpacity * (0.68 + index * 0.18);
  });
  beamMaterials.forEach((material, index) => {
    material.opacity =
      currentVisual.beamOpacity *
      (0.2 + index * 0.11) *
      (0.74 + (Math.sin(time * (0.8 + index * 0.22) + index) + 1) * 0.16);
  });
  beams.forEach((beam, index) => {
    beam.position.x =
      [-1.8, 0.4, 1.2][index] +
      Math.sin(time * (0.34 + index * 0.08) + index) *
        currentVisual.beamSpread *
        0.32;
    beam.scale.x = currentVisual.beamSpread * (1 + currentVisual.fabric * 0.28);
    beam.scale.y =
      0.78 + currentVisual.defect * 0.22 + currentVisual.constellation * 0.14;
  });
  edgeMaterials.forEach((material, index) => {
    material.opacity =
      currentVisual.edgeOpacity *
      (0.44 + index * 0.16) *
      (0.72 + (Math.sin(time * (1.3 + index * 0.28) + index * 1.7) + 1) * 0.2);
  });
  edgeSweeps.forEach((line, index) => {
    line.rotation.z =
      Math.sin(time * (0.58 + index * 0.12) + index) *
      currentVisual.edgeSweep *
      0.38;
    line.scale.x = 0.86 + currentVisual.edgeSweep * 0.34;
    line.scale.y = 1 + currentVisual.defect * 0.2;
  });
  backgroundMaterials.forEach((material, index) => {
    material.opacity =
      currentVisual.backgroundOpacity *
      (0.11 + index * 0.026) *
      (0.78 + Math.sin(time * 0.4 + index) * 0.18);
  });
  lotMaterials.forEach((material, index) => {
    material.opacity =
      currentVisual.lotMultiplicity *
      (0.32 + index * 0.11) *
      (0.72 + Math.sin(time * 0.8 + index) * 0.16);
  });
  lotMaps.forEach((lot, index) => {
    lot.scale.setScalar(
      0.88 + currentVisual.lotMultiplicity * 0.48 + Math.sin(time * 0.5 + index) * currentVisual.lotMultiplicity * 0.04
    );
    const focusDistance = Math.hypot(
      lot.position.x - currentFocusTarget.x,
      lot.position.z - currentFocusTarget.z
    );
    lot.position.y =
      0.22 +
      index * 0.075 +
      currentVisual.lotMultiplicity * 0.12 +
      clamp(1 - focusDistance / 2.2, 0, 1) * currentVisual.focusOpacity * 0.12;
  });
  constellationMaterials.forEach((material, index) => {
    material.opacity = currentVisual.constellation * (0.18 + index * 0.08);
  });
  defectMaterial.opacity =
    Math.min(0.86, currentVisual.defect * (0.34 + (Math.sin(time * 2.4) + 1) * 0.18));
  scanBracketMaterial.opacity =
    Math.min(0.74, currentVisual.defect * (0.28 + (Math.sin(time * 3.2) + 1) * 0.14));
  defectMeshes.forEach((ring, index) => {
    const focusDistance = Math.hypot(
      ring.position.x - currentFocusTarget.x,
      ring.position.z - currentFocusTarget.z
    );
    const focusWeight = clamp(1 - focusDistance / 1.9, 0, 1);
    ring.scale.setScalar(
      0.88 + currentVisual.defect * 0.22 + focusWeight * currentVisual.focusOpacity * 0.22
    );
    ring.position.y =
      0.3 +
      index * 0.035 +
      focusWeight * currentVisual.focusOpacity * 0.1 +
      Math.sin(time * 1.1 + index) * currentVisual.defect * 0.018;
  });
  fabricMaterials.forEach((material, index) => {
    material.opacity = currentVisual.fabric * (0.2 + index * 0.055);
  });
  feedbackMaterials.forEach((material, index) => {
    material.opacity =
      currentVisual.feedback *
      (0.32 + index * 0.085) *
      (0.66 + (Math.sin(time * (1.3 + index * 0.2) + index) + 1) * 0.17);
  });
  feedbackLines.forEach((line, index) => {
    line.scale.setScalar(
      0.82 + currentVisual.feedback * 0.26 + Math.sin(time * 1.1 + index) * currentVisual.feedback * 0.04
    );
    line.position.x = currentFocusTarget.x * currentVisual.feedback * 0.08;
    line.position.z = currentFocusTarget.z * currentVisual.feedback * 0.06;
  });

  dieData.forEach((item, index) => {
    const constellationMix = currentVisual.dieConstellation;
    const fabricMix = currentVisual.dieFabric;
    const baseX = item.baseX * currentVisual.dieSpreadX;
    const baseZ = item.baseZ * currentVisual.dieSpreadZ;
    const seedX = Math.sin(index * 1.7) * 0.08;
    const seedZ = Math.cos(index * 1.31) * 0.08;
    const revealedX = lerp(seedX, baseX, currentVisual.gridReveal);
    const revealedZ = lerp(seedZ, baseZ, currentVisual.gridReveal);
    let targetX = lerp(revealedX, item.constellationX, constellationMix);
    let targetZ = lerp(revealedZ, item.constellationZ, constellationMix);
    targetX = lerp(targetX, item.fabricX, fabricMix);
    targetZ = lerp(targetZ, item.fabricZ, fabricMix);
    const defectLift =
      currentVisual.defect * item.cluster * (0.22 + Math.sin(time * 3.1 + index) * 0.04);
    const constellationLift =
      currentVisual.dieConstellation *
      (0.12 + Math.sin(time * 0.9 + index * 0.23) * 0.12);
    const fabricLift =
      currentVisual.dieFabric *
      Math.sin(time * 3.4 + item.signal * Math.PI * 2) *
      0.035;
    const waveLift =
      Math.sin(time * (1.1 + currentVisual.dieWave) + index * 0.12) *
      item.lift *
      currentVisual.dieWave;
    const yieldLift =
      currentVisual.yieldMap *
      (item.signal * 0.12 + item.cluster * 0.24);
    const revealLift =
      (1 - currentVisual.gridReveal) *
      Math.sin(time * 1.4 + index * 0.27) *
      0.12;
    const focusDistance = Math.hypot(
      targetX - currentFocusTarget.x,
      targetZ - currentFocusTarget.z
    );
    const focusRadius = currentVisual.focusRadius + currentVisual.focusScale * 0.28;
    const focusWeight = easeInOut(clamp(1 - focusDistance / focusRadius, 0, 1));
    const focusPulse = 0.78 + Math.sin(time * 2.2 + focusDistance * 2.8) * 0.12;
    const focusLift = focusWeight * currentVisual.focusOpacity * focusPulse * 0.22;
    const unfocusDip =
      currentVisual.focusOpacity *
      (1 - focusWeight) *
      (1 - currentVisual.gridReveal * 0.18) *
      0.035;
    dieDummy.position.set(
      targetX,
      0.15 + waveLift + currentVisual.dieLift + defectLift + constellationLift + fabricLift + yieldLift + revealLift + focusLift - unfocusDip,
      targetZ
    );
    dieDummy.rotation.y =
      Math.sin(time * 0.2 + index * 0.02) * 0.02 +
      currentVisual.dieConstellation * 0.45 +
      currentVisual.dieFabric * Math.sin(index * 0.18) * 0.16;
    dieDummy.rotation.z =
      currentVisual.dieFabric * Math.sin(time * 0.9 + index * 0.1) * 0.06;
    const dieScale =
      1 +
      currentVisual.defect * item.cluster * 1.7 +
      currentVisual.dieConstellation * ((index % 5) * 0.06) +
      currentVisual.dieFabric * 0.12 +
      currentVisual.yieldMap * (item.signal * 0.22 + item.cluster * 0.26);
    const revealScale = 0.18 + currentVisual.gridReveal * 0.82;
    const focusScaleBoost = 1 + focusWeight * currentVisual.focusOpacity * 0.34;
    const quietScale = 1 - currentVisual.focusOpacity * (1 - focusWeight) * 0.08;
    const populationReveal = easeInOut(
      clamp((currentVisual.diePopulation - item.revealRank) / 0.16, 0, 1)
    );
    dieDummy.scale.set(
      dieScale * revealScale * focusScaleBoost * quietScale * populationReveal * (1 + currentVisual.dieFabric * 0.9),
      revealScale * focusScaleBoost * populationReveal * (1 + currentVisual.defect * item.cluster * 0.8),
      dieScale * revealScale * focusScaleBoost * quietScale * populationReveal * (1 - currentVisual.dieFabric * 0.36)
    );
    dieDummy.updateMatrix();
    dieMesh.setMatrixAt(index, dieDummy.matrix);
    dieColor.copy(baseDieColor);
    dieColor.lerp(quietDieColor, currentVisual.focusOpacity * (1 - focusWeight) * 0.36);
    dieColor.lerp(passDieColor, clamp(currentVisual.yieldMap * item.signal * 0.95, 0, 1));
    dieColor.lerp(failDieColor, clamp(currentVisual.yieldMap * item.cluster * 1.25, 0, 1));
    dieColor.lerp(focusDieColor, focusWeight * currentVisual.focusOpacity * 0.72);
    dieMesh.setColorAt(index, dieColor);
  });
  dieMesh.instanceMatrix.needsUpdate = true;
  if (dieMesh.instanceColor) {
    dieMesh.instanceColor.needsUpdate = true;
  }
  dieDummy.scale.set(1, 1, 1);

  const particlePositions = particles.geometry.attributes.position.array;
  particleSeeds.forEach((seed, index) => {
    const angle = seed.angle + time * seed.speed * currentVisual.particleSpeed * 0.42;
    const radius = seed.radius * currentVisual.particleRadius;
    const constellationPull = currentVisual.constellation;
    const fabricPull = currentVisual.fabric;
    const orbitX = Math.cos(angle) * radius;
    const orbitY =
      Math.sin(time * 0.18 + index * 0.11) * 1.6 * currentVisual.particleHeight;
    const orbitZ = Math.sin(angle) * radius;
    const seedParticleX = Math.cos(index * 2.4) * 0.18;
    const seedParticleY = Math.sin(time * 0.28 + index) * 0.22;
    const seedParticleZ = Math.sin(index * 1.9) * 0.18;
    const constellationX = Math.cos(index * 2.17) * (2.2 + (index % 9) * 0.16);
    const constellationY = Math.sin(index * 1.41 + time * 0.14) * 1.2;
    const constellationZ = Math.sin(index * 1.73) * (1.4 + (index % 7) * 0.18);
    const fabricX = -4.2 + (index % 48) * 0.18;
    const fabricY = Math.sin(time * 0.42 + index * 0.2) * 0.16;
    const fabricZ = ((Math.floor(index / 48) % 4) - 1.5) * 0.48;
    const revealedOrbitX = lerp(seedParticleX, orbitX, currentVisual.gridReveal);
    const revealedOrbitY = lerp(seedParticleY, orbitY, currentVisual.gridReveal);
    const revealedOrbitZ = lerp(seedParticleZ, orbitZ, currentVisual.gridReveal);
    let x = lerp(revealedOrbitX, constellationX, constellationPull);
    let y = lerp(revealedOrbitY, constellationY, constellationPull);
    let z = lerp(revealedOrbitZ, constellationZ, constellationPull);
    x = lerp(x, fabricX, fabricPull);
    y = lerp(y, fabricY, fabricPull);
    z = lerp(z, fabricZ, fabricPull);
    particlePositions[index * 3] = x;
    particlePositions[index * 3 + 1] = y;
    particlePositions[index * 3 + 2] = z;
  });
  particles.geometry.attributes.position.needsUpdate = true;
  particles.rotation.y = time * 0.012 * currentVisual.particleSpeed;

  traceLines.forEach((line, index) => {
    line.position.x = Math.sin(time * (0.18 + index * 0.06)) * currentVisual.constellation * 0.32;
    line.scale.x = 1 + currentVisual.fabric * 0.54;
    line.scale.y = 1 + currentVisual.constellation * 0.35;
  });
  constellationLines.forEach((line, index) => {
    line.rotation.z = time * (0.08 + index * 0.02);
    line.scale.setScalar(1 + Math.sin(time * 0.7 + index) * 0.06 * currentVisual.constellation);
  });
  defectMeshes.forEach((mesh, index) => {
    const pulse = 1 + Math.sin(time * 2.8 + index * 1.4) * 0.16;
    mesh.scale.setScalar((0.84 + currentVisual.defect * 0.52) * pulse);
  });
  scanBracket.scale.set(
    1 + currentVisual.defect * 0.22 + Math.sin(time * 2.2) * currentVisual.defect * 0.035,
    1,
    1 + currentVisual.defect * 0.12
  );
  fabricLines.forEach((line, index) => {
    line.position.x = Math.sin(time * 0.42 + index) * currentVisual.fabric * 0.22;
    line.scale.x = 0.7 + currentVisual.fabric * 0.9;
  });

  scanPlane.position.z =
    Math.sin(time * 0.18 * currentVisual.scanSpeed) * currentVisual.scanTravel;
  scanPlane.scale.set(currentVisual.scanScaleX, currentVisual.scanScaleY, 1);
  scanPlane.material.opacity =
    state.three.currentScan + (Math.sin(time * 0.24) + 1) * 0.024 + lockPulse * 0.14;

  renderer.render(scene, camera);
}

window.addEventListener("resize", resizeThreeScene);

setupEventListeners();
setStaticTranslations();
setupThreeScene();
onScroll();
