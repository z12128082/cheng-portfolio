import { createStage } from "./src/three/stage.js";
import { runBoot } from "./src/three/boot.js";

// Hide chrome as early as possible so the boot reveal does not flash;
// runBoot() decides immediately whether to skip and re-show it.
document.body.classList.add("is-booting");

const translations = {
  zh: {
    brand: {
      title: "Wafer Signal Exhibit",
      subtitle: "Process to Decision"
    },
    nav: {},
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
    }
  },
  en: {
    brand: {
      title: "Wafer Signal Exhibit",
      subtitle: "Process to Decision"
    },
    nav: {},
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
    }
  }
};


const scenes = [
  { id: "intro", shape: "scatter" },
  { id: "wafer-drift", shape: "fab" },
  { id: "yield-constellation", shape: "floors" },
  { id: "prompt-fabric", shape: "ring" },
  { id: "approach", shape: "wave" }
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
translations.zh.nav.featured = "方法";
translations.en.nav.work = "Work";
translations.en.nav.featured = "Method";

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
  accent: '<span class="headline-caption">Spatial systems, data-rich interfaces, and tools for real workflows.</span>',
  summary:
    "I build Web 3D, real-time data surfaces, desktop utilities, and operator-facing tools, shown through two projects: a semiconductor digital twin and TokenScope."
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

translations.zh.buttons = {
  viewProjects: "看主展示",
  githubProfile: "GitHub 個人頁",
  liveDemo: "線上展示",
  githubRepo: "GitHub Repo",
  privateRepo: "Private repo",
  motionOn: "動態開啟",
  motionReduced: "降低動態"
};
translations.en.buttons = {
  viewProjects: "View Work",
  githubProfile: "GitHub Profile",
  liveDemo: "Live Demo",
  githubRepo: "GitHub Repo",
  privateRepo: "Private repo",
  motionOn: "Motion on",
  motionReduced: "Reduced motion"
};

translations.zh.stage = {
  modeLabel: "Stage mode",
  modeValue: "產品展示序列"
};
translations.en.stage = {
  modeLabel: "Stage mode",
  modeValue: "Product demo sequence"
};

translations.zh.showcases = {
  twin: {
    eyebrow: "Digital Twin Viewer",
    mode: "Operational stage",
    label: "Project 01 / Web 3D",
    title: "IFC 到營運數位孿生",
    meta: [
      { label: "Input", value: "Federated IFC" },
      { label: "State", value: "Live telemetry" },
      { label: "Surface", value: "Operator viewer" }
    ],
    steps: [
      "IFC 模型載入",
      "模型與 category layer 狀態",
      "Telemetry 告警狀態",
      "Ops dashboard 即時讀值"
    ]
  },
  token: {
    eyebrow: "TokenScope Utility",
    mode: "Workflow utility",
    label: "Project 02 / Desktop Tool",
    title: "一眼看懂使用量狀態",
    meta: [
      { label: "Source", value: "Local sessions" },
      { label: "Signal", value: "Usage threshold" },
      { label: "Output", value: "Menubar status" }
    ],
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
    mode: "Operational stage",
    label: "Project 01 / Web 3D",
    title: "IFC to operational twin",
    meta: [
      { label: "Input", value: "Federated IFC" },
      { label: "State", value: "Live telemetry" },
      { label: "Surface", value: "Operator viewer" }
    ],
    steps: [
      "IFC model loaded",
      "Model and category layer state",
      "Telemetry alert state",
      "Ops dashboard readout"
    ]
  },
  token: {
    eyebrow: "TokenScope Utility",
    mode: "Workflow utility",
    label: "Project 02 / Desktop Tool",
    title: "Usage state at a glance",
    meta: [
      { label: "Source", value: "Local sessions" },
      { label: "Signal", value: "Usage threshold" },
      { label: "Output", value: "Menubar status" }
    ],
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

const motionPreference = window.localStorage.getItem("portfolio-motion");
const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = {
  locale: window.localStorage.getItem("exhibit-locale") || "zh",
  activeSceneId: "intro",
  pointer: {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.45
  },
  reducedMotion:
    motionPreference === "reduced" ||
    (motionPreference !== "full" && reducedMotionMedia.matches),
  scrollProgress: 0,
  sceneProgress: 0,
  snapTimer: null,
  lockTimer: null,
  isSnapping: false,
  lastScrollY: window.scrollY,
  lastScrollDelta: 0
};

let stage = null;

const openingTitle = document.getElementById("opening-title");
const openingSummary = document.getElementById("opening-summary");
const localeButtons = Array.from(
  document.querySelectorAll("[data-locale-trigger]")
);
const motionToggle = document.querySelector("[data-motion-toggle]");
const motionToggleLabel = document.querySelector("[data-motion-label]");
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
const productShowcases = Array.from(document.querySelectorAll("[data-showcase]"));
const showcaseSceneIds = new Set(
  productShowcases.map((showcase) => showcase.dataset.showcase)
);
const sceneSwitchProgress = 0.34;
const sceneReleaseProgress = 0.08;
const showcaseStepCount = 4;
const showcaseRevealStart = 0.46;
const showcaseRevealEnd = 0.68;
const showcaseDemoStart = 0.56;
const showcaseSpotlightStart = 0.68;
const showcaseSpotlightEnd = 0.94;

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

  updateMotionToggle();
  updateHud(getScene(state.activeSceneId));
}

function updateMotionToggle() {
  document.documentElement.classList.toggle("is-reduced-motion", state.reducedMotion);

  if (!motionToggle || !motionToggleLabel) {
    return;
  }

  const label = state.reducedMotion
    ? t("buttons.motionReduced")
    : t("buttons.motionOn");
  motionToggleLabel.textContent = label;
  motionToggle.setAttribute("aria-pressed", String(!state.reducedMotion));
  motionToggle.setAttribute("aria-label", label);
}

function updateHud(scene) {
  hudKicker.textContent = scene.label[state.locale];
  hudTitle.textContent = scene.title[state.locale];
  hudDescription.textContent = scene.description[state.locale];
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

function setMotionPreference(reducedMotion) {
  state.reducedMotion = reducedMotion;
  window.localStorage.setItem("portfolio-motion", reducedMotion ? "reduced" : "full");
  updateMotionToggle();
  stage?.setReducedMotion(state.reducedMotion);
  onScroll();
}

function setupEventListeners() {
  localeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.localeTrigger !== state.locale) {
        setLocale(button.dataset.localeTrigger);
      }
    });
  });

  motionToggle?.addEventListener("click", () => {
    setMotionPreference(!state.reducedMotion);
  });

  const syncSystemMotionPreference = (event) => {
    if (!window.localStorage.getItem("portfolio-motion")) {
      state.reducedMotion = event.matches;
      updateMotionToggle();
      onScroll();
    }
  };

  if (reducedMotionMedia.addEventListener) {
    reducedMotionMedia.addEventListener("change", syncSystemMotionPreference);
  } else {
    reducedMotionMedia.addListener(syncSystemMotionPreference);
  }

  window.addEventListener("pointermove", (event) => {
    state.pointer.x = event.clientX;
    state.pointer.y = event.clientY;
    stage?.setPointer(
      event.clientX / window.innerWidth - 0.5,
      event.clientY / window.innerHeight - 0.5
    );
  });

  window.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    if (event.target.closest("a, button, input, .showcase-card")) return;
    stage?.beginDrag(event.clientX, event.clientY);
  });
  window.addEventListener("pointermove", (event) => {
    stage?.moveDrag(event.clientX, event.clientY);
  });
  window.addEventListener("pointerup", () => stage?.endDrag());
  window.addEventListener("pointercancel", () => stage?.endDrag());
}

function lerp(current, target, factor) {
  return current + (target - current) * factor;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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
  const endY = -rect.height * 0.82;
  return clamp((startY - rect.top) / (startY - endY), 0, 1);
}

function getShowcaseLayoutMetrics(isTokenScope, spotlightWidth) {
  const viewportWidth = window.innerWidth;
  const isCompactStage = viewportWidth <= 1100;
  const rightBase = isCompactStage
    ? isTokenScope
      ? 60
      : 52
    : isTokenScope
      ? clamp(viewportWidth * 0.08, 72, 112)
      : clamp(viewportWidth * 0.07, 64, 104);
  const baseWidth = isCompactStage
    ? isTokenScope
      ? 480
      : 600
    : isTokenScope
      ? 520
      : 650;
  const maxWidth =
    viewportWidth *
    (isCompactStage ? (isTokenScope ? 0.64 : 0.72) : isTokenScope ? 0.64 : 0.72);
  const width = Math.min(baseWidth + spotlightWidth, maxWidth);
  const currentCenter = viewportWidth - rightBase - width / 2;
  const targetCenter = currentCenter;

  return { currentCenter, targetCenter };
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

    const scrubProgress = state.reducedMotion
      ? 0.58
      : getChapterScrubProgress(chapterState.node);
    const revealProgress = state.reducedMotion
      ? 1
      : easeCinematic(
          clamp(
            (scrubProgress - showcaseRevealStart) /
              (showcaseRevealEnd - showcaseRevealStart),
            0,
            1
          )
        );
    const exitProgress = easeInOut(clamp((scrubProgress - 0.97) / 0.03, 0, 1));
    const visibility = revealProgress * (1 - exitProgress);
    const stepProgress = clamp(
      (scrubProgress - showcaseDemoStart) / (1 - showcaseDemoStart),
      0,
      1
    );
    const spotlightProgress = state.reducedMotion
      ? 0.72
      : easeInOut(
          clamp(
            (scrubProgress - showcaseSpotlightStart) /
              (showcaseSpotlightEnd - showcaseSpotlightStart),
            0,
            1
          )
        );
    const stepIndex = Math.min(
      showcaseStepCount - 1,
      Math.floor(stepProgress * showcaseStepCount)
    );
    const introOffset = (1 - revealProgress) * 28;
    const horizontalOffset = (1 - revealProgress) * 180;
    const isTokenScope = sceneId === "prompt-fabric";
    const mediaScale = isTokenScope
      ? 1 + stepProgress * 0.035
      : 1.02 + stepProgress * 0.11;
    const mediaX = isTokenScope
      ? lerp(0, 0.8, stepProgress)
      : lerp(0, -5.8, stepProgress);
    const mediaY = isTokenScope
      ? lerp(0, -1.6, stepProgress)
      : lerp(0, -4.2, stepProgress);
    const spotlightWidth = isTokenScope
      ? spotlightProgress * 90
      : spotlightProgress * 132;
    const panelSize = 1;
    const panelOpacity = 1;

    showcase.classList.toggle("is-visible", visibility > 0.08);
    showcase.classList.toggle("is-spotlight", spotlightProgress > 0.64);
    showcase.style.setProperty("--showcase-opacity", String(visibility));
    showcase.style.setProperty("--showcase-y", `${introOffset}px`);
    showcase.style.setProperty("--showcase-expand", `${spotlightWidth}px`);
    showcase.style.setProperty("--showcase-center-shift", "0px");
    showcase.style.setProperty("--showcase-panel-size", String(panelSize));
    showcase.style.setProperty("--showcase-panel-opacity", String(panelOpacity));
    showcase.style.setProperty(
      "--showcase-panel-y",
      `${spotlightProgress * 6}px`
    );
    showcase.style.setProperty(
      "--showcase-scale",
      String(0.78 + revealProgress * 0.22)
    );

    const { currentCenter, targetCenter } = getShowcaseLayoutMetrics(
      isTokenScope,
      spotlightWidth
    );
    const stageMoveStart = isTokenScope ? 0.6 : 0.62;
    const stageMoveEnd = isTokenScope ? 0.78 : 0.8;
    const stageShiftProgress = state.reducedMotion
      ? 1
      : easeInOut(
          clamp(
            (scrubProgress - stageMoveStart) /
              (stageMoveEnd - stageMoveStart),
            0,
            1
          )
        );
    const stageShift = (targetCenter - currentCenter) * stageShiftProgress;

    showcase.style.setProperty(
      "--showcase-x",
      `${horizontalOffset + stageShift}px`
    );
    showcase.style.setProperty("--showcase-progress", String(stepProgress));
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

function pulseSceneLock() {
  document.documentElement.classList.add("is-scene-locked");
  stage?.pulse();
  window.clearTimeout(state.lockTimer);
  state.lockTimer = window.setTimeout(() => {
    document.documentElement.classList.remove("is-scene-locked");
  }, 420);
}

function scheduleSceneSnap() {
  const isLargeScrollJump = state.lastScrollDelta > window.innerHeight * 0.58;

  if (
    state.reducedMotion ||
    state.isSnapping ||
    isLargeScrollJump ||
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

  if (state.reducedMotion) {
    return {
      ...motion,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      blur: 0,
      clipTop: 0,
      clipRight: 0,
      clipBottom: 0,
      clipLeft: 0,
      lineX: 0,
      indexX: 0,
      indexY: 0,
      kickerX: 0,
      kickerY: 0,
      titleX: 0,
      titleY: 0,
      bodyX: 0,
      bodyY: 0
    };
  }

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




function onScroll() {
  const scrollY = window.scrollY;
  state.lastScrollDelta = Math.abs(scrollY - state.lastScrollY);
  state.lastScrollY = scrollY;

  let bestScene = scenes[0];
  let bestProgress = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  let activeChapterState = null;
  const chapterFocusLine = window.innerHeight * 0.42;
  const chapterRange = window.innerHeight * 0.78;
  const openingProgress = clamp(scrollY / (window.innerHeight * 0.72), 0, 1);
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight || 1;
  state.scrollProgress = clamp(scrollY / maxScroll, 0, 1);
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

  stage?.setScene(state.activeSceneId, state.sceneProgress);
  updateProductShowcases(chapterStates);
  scheduleSceneSnap();
}



stage = createStage({
  canvas: document.getElementById("hero-webgl"),
  reducedMotion: state.reducedMotion,
  sceneShapes: Object.fromEntries(scenes.map((s) => [s.id, s.shape]))
});
setupEventListeners();
setStaticTranslations();
stage.start();
onScroll();
runBoot({ stage, reducedMotion: state.reducedMotion });
window.__stage = stage;
