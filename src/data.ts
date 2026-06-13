import type { Project, ViewKey, ViewProfile } from "./types";

export const EMAIL = "wuzhengda_work@163.com";

export const views: Record<ViewKey, ViewProfile> = {
  digital: {
    label: "数字化",
    eyebrow: "BUSINESS × DATA × AUTOMATION",
    role: "业务数字化 / 流程产品化",
    title: "把复杂业务流程，转化为可复用的数字能力",
    summary:
      "经济统计学背景，并在金融业务现场积累了流程运营经验。我擅长从真实业务痛点出发，完成数据治理、工具设计与落地推广，让分散的信息成为可查询、可分析、可持续优化的业务资产；这套方法也可以迁移到其他行业的运营与数字化场景。",
    focusTitle: "业务问题如何变成数字产品？",
    focusText: "识别高频问题、治理底层数据、设计轻量工具，并通过反馈闭环推动团队真正使用。",
    workTitle: "三个从 0 到 1 落地的数字化方案。",
    workSummary: "重点查看产品思路、实现过程、使用反馈与效率提升。",
    strengths: ["业务流程数字化", "AI 辅助方案设计", "自动化工具落地"],
    highlights: [
      { value: "3000", suffix: "+条", label: "审批知识可直接查询" },
      { value: "4690", suffix: "次", label: "全年智能体实际使用" },
      { value: "20", suffix: "+名", label: "同事日常使用工具" },
      { value: "50", suffix: "%+", label: "重复处理效率提升" },
    ],
    projectOrder: ["agent", "automation", "dashboard"],
    capabilityOrder: ["数字化实现", "数据分析", "业务流程与运营"],
    evidenceOrder: [],
  },
  data: {
    label: "数据运营",
    eyebrow: "DATA × INSIGHT × DECISION",
    role: "数据运营 / 业务分析",
    title: "让业务数据从记录结果，走向辅助决策",
    summary:
      "我熟悉资金与账户业务数据，能够完成清洗、口径统一、指标设计和可视化分析，并把数据结论转化为续签优先级、流程异常识别和资金配置建议。",
    focusTitle: "数据如何真正支持业务动作？",
    focusText: "从清洗和口径统一开始，建立可追踪指标，把分析结论落实为预警、优先级和经营建议。",
    workTitle: "三个从数据走向业务决策的案例。",
    workSummary: "重点查看数据治理、指标设计、异常识别和业务结论输出。",
    strengths: ["数据清洗与治理", "指标体系设计", "BI 可视化分析"],
    highlights: [
      { value: "2000", suffix: "+", label: "账户数据清洗" },
      { value: "80", suffix: "%", label: "及时续签率提升" },
      { value: "3000", suffix: "+", label: "审批链数据治理" },
      { value: "12", suffix: "项", label: "项目账表核验" },
    ],
    projectOrder: ["dashboard", "agent", "automation"],
    capabilityOrder: ["数据分析", "业务流程与运营", "数字化实现"],
    evidenceOrder: [0, 2, 1, 3, 4, 5],
  },
  operations: {
    label: "业务运营",
    eyebrow: "OPERATION × STANDARD × GROWTH",
    role: "金融业务运营 / 流程优化",
    title: "用标准化与数据方法，推动金融业务高质量运转",
    summary:
      "我有对公账户开户、销户、变更、网银及协定存款等全流程经验，能协调银行、业务、审批与法审等多方角色，并通过模板、看板和工具持续降低差错与等待。",
    focusTitle: "复杂业务如何稳定、高效地运转？",
    focusText: "明确优先级、统一材料与字段标准、协调多方节点，并用模板和看板降低差错与等待。",
    workTitle: "三个改善业务质量与协同效率的案例。",
    workSummary: "重点查看业务场景理解、标准化运营、跨部门推进和结果交付。",
    strengths: ["账户全流程运营", "跨部门项目协同", "标准化体系建设"],
    highlights: [
      { value: "145", suffix: "个", label: "服务公司主体" },
      { value: "500", suffix: "+", label: "账户业务处理" },
      { value: "52", suffix: "个", label: "标准化模板" },
      { value: "90", suffix: "%+", label: "高频场景覆盖" },
    ],
    projectOrder: ["agent", "dashboard", "automation"],
    capabilityOrder: ["业务流程与运营", "数据分析", "数字化实现"],
    evidenceOrder: [3, 4, 5, 2, 0, 1],
  },
};

export const experiences = [
  {
    period: "2024.09 — 2026.03",
    organization: "深圳平安综合金融服务有限公司中心分公司",
    role: "资金财务专员｜账户运营、数据分析与流程优化",
    summary:
      "负责 145 个公司主体的对公账户全流程运营，累计处理 500+ 笔账户业务；推动审批链智能体、回执工具、标准化模板及协定存款看板落地。",
    type: "工作经历",
  },
  {
    period: "2020.09 — 2024.06",
    organization: "广东财经大学",
    role: "经济统计学｜本科",
    summary:
      "专业排名前 15%。系统学习统计学、计量经济学、金融学与会计学，形成数据分析与业务理解相结合的能力。",
    type: "教育经历",
  },
];

export const projects: Project[] = [
  {
    id: "agent",
    index: "01",
    title: "审批链智能体",
    subtitle: "从分散资料到可查询、可迭代的业务知识库",
    tags: ["数据治理", "AI 应用", "知识库", "持续运营"],
    metrics: [
      { value: "3000+", label: "审批链记录" },
      { value: "4690", label: "年度对话" },
      { value: "80%+", label: "部门覆盖" },
      { value: "-20%", label: "签报退回率" },
    ],
    problem:
      "145 个主体、18 类业务的审批路径散落在邮件与 Excel 中。人工查找慢、容易选错，且人员经验无法稳定复用。",
    analysis:
      "先统一主体、业务类型、审批角色和路径口径，将非结构化信息转成可检索记录；再分析高频问题与未命中原因，确定匹配规则和补录机制。",
    actions: [
      "治理并沉淀 3000+ 条审批链记录，建立统一字段与检索规则。",
      "基于知识库和大语言模型实现自动匹配与问答，持续优化提示词。",
      "设计“未找到自动录入”闭环，让用户补充的信息自动解析入库。",
    ],
    result:
      "2025 年累计支撑 4690 次对话，覆盖部门 80% 以上同事；单次签报编辑时间平均缩短 7.5 分钟，签报退回率降低 20%。",
    reflection:
      "AI 项目的核心不是模型本身，而是稳定的数据口径、明确的使用场景和可持续迭代的反馈闭环。",
    visual: "agent",
  },
  {
    id: "automation",
    index: "02",
    title: "回执处理自动化工具",
    subtitle: "把重复办公动作封装为可配置的网页工具",
    tags: ["流程优化", "Python", "Flask", "自动化"],
    metrics: [
      { value: "20+", label: "日常用户" },
      { value: "3–5min", label: "处理耗时" },
      { value: "50%+", label: "效率提升" },
    ],
    problem:
      "回执处理存在文件命名混乱、字段重复复制和交接单填写繁琐等问题，单次处理约需 15 分钟。",
    analysis:
      "拆解操作步骤后发现，规则明确但重复频繁的命名与字段映射最适合自动化；同时必须保留预览和配置能力，避免工具变成新的黑箱。",
    actions: [
      "支持 Excel 模板导入，按日期、客户名称与业务类型组合批量命名。",
      "支持批量导入或单条粘贴，自动解析字段并生成个性化交接单。",
      "采用 Python Flask、HTML、CSS 与 JavaScript 实现上传、预览和下载。",
    ],
    result:
      "推广至 20+ 名同事日常使用，将重复操作从约 15 分钟缩短至 3–5 分钟，整体效率提升 50% 以上。",
    reflection:
      "内部工具不需要堆功能。把高频步骤做短、把结果做可预览、把规则做可配置，才更容易真正被团队采用。",
    visual: "automation",
  },
  {
    id: "dashboard",
    index: "03",
    title: "协定存款业务数据看板",
    subtitle: "从 2000+ 条账户数据中识别续签优先级",
    tags: ["数据清洗", "指标设计", "BI 看板", "业务分析"],
    metrics: [
      { value: "2000+", label: "账户数据" },
      { value: "80%", label: "及时续签率提升" },
      { value: "5维", label: "核心指标" },
    ],
    problem:
      "业务缺少统一监控工具，难以及时掌握银行类型分布、利率水平、到期情况和续签优先级，存在资金收益下滑风险。",
    analysis:
      "围绕资金规模、银行类型、利率水平、到期时间与续签建议建立指标体系，并明确异常值与关键字段处理规则。",
    actions: [
      "清洗 2000+ 条账户协定存款数据，完成去重、标准化和异常处理。",
      "搭建 BI 看板，支持按银行类型、银行及利率水平进行对比分析。",
      "识别即将到期业务，结合利率表现输出续签优先级建议。",
    ],
    result:
      "实现业务数据的可视化和动态监控，及时续签率提升 80%，帮助业务侧优化资金配置并降低利率下滑风险。",
    reflection:
      "看板价值不在图表数量，而在指标是否对应实际决策动作。每一个预警都应能导向清晰的处理优先级。",
    visual: "dashboard",
  },
];

export const capabilities = [
  {
    title: "业务流程与运营",
    level: "实践能力",
    items: ["流程梳理", "规则标准化", "跨部门协同", "风险与质量控制"],
  },
  {
    title: "数据分析",
    level: "分析闭环",
    items: ["Excel / SQL", "数据清洗", "指标体系", "BI 可视化"],
  },
  {
    title: "数字化实现",
    level: "方案落地",
    items: ["Python / Pandas", "AI 辅助开发", "自动化工具", "知识库运营"],
  },
];

export const certificates = [
  "CDA 数据分析师中级",
  "初级会计资格证",
  "全国计算机二级",
  "CET-4",
];
