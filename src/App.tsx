import { useEffect, useMemo, useRef, useState } from "react";
import {
  capabilities,
  certificates,
  EMAIL,
  experiences,
  projects,
  views,
} from "./data";
import type { Project } from "./types";

const Icon = ({ name }: { name: "arrow" | "download" | "mail" | "spark" }) => {
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    download: <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
    spark: <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Zm6 12 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
};

function TableScrollbar({
  targetRef,
  label,
  refreshKey,
}: {
  targetRef: React.RefObject<HTMLDivElement | null>;
  label: string;
  refreshKey?: string;
}) {
  const [maximum, setMaximum] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const update = () => {
      setMaximum(Math.max(0, target.scrollWidth - target.clientWidth));
      setPosition(target.scrollLeft);
    };
    update();
    target.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(target);
    return () => {
      target.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [targetRef, refreshKey]);

  return (
    <div className="table-scrollbar">
      <span>←</span>
      <input
        type="range"
        min="0"
        max={Math.max(maximum, 1)}
        value={Math.min(position, Math.max(maximum, 1))}
        disabled={maximum === 0}
        aria-label={label}
        onInput={(event) => {
          const nextPosition = Number(event.currentTarget.value);
          setPosition(nextPosition);
          targetRef.current?.scrollTo({ left: nextPosition });
        }}
      />
      <span>→</span>
      <small>{maximum > 0 ? "拖动查看完整字段" : "字段已完整显示"}</small>
    </div>
  );
}

type AiScenario = {
  keywords: string[];
  question: string;
  company: string;
  business: string;
  intent: string;
  records: number;
  confidence: number;
  route: string[];
  note: string;
  source: string;
  found: boolean;
  sourceFile: string;
  sourceVersion: string;
  sourceUpdated: string;
  sourceExcerpt: string;
};

const aiScenarios: AiScenario[] = [
  {
    keywords: ["开户", "基本户"],
    question: "星河科技有限公司开户业务审批链是什么？",
    company: "星河科技有限公司",
    business: "开户业务",
    intent: "公司实体 + 开户业务",
    records: 126,
    confidence: 96,
    route: ["林晓（经办）", "陈宁（复核）", "周然（财务）", "许言（负责人）", "顾清（合规）", "沈舟（财务负责人）", "唐悦（公司负责人）", "陆川（终审）"],
    note: "如涉及法审事项，请在顾清之后增加法审同事“韩一”。提交前需再次核对最新人员权限。",
    source: "命中该公司开户链路 1 条，关联同类主体历史记录 126 条",
    found: true,
    sourceFile: "对公账户审批链知识库（脱敏示例）.xlsx",
    sourceVersion: "v2026.02",
    sourceUpdated: "2026-02-18",
    sourceExcerpt: "星河科技有限公司｜开户业务｜林晓 → 陈宁 → 周然 → 许言 → 顾清 → 沈舟 → 唐悦 → 陆川",
  },
  {
    keywords: ["变更", "网银"],
    question: "云帆商贸有限公司变更业务审批链是什么？",
    company: "云帆商贸有限公司",
    business: "变更业务",
    intent: "公司实体 + 变更业务",
    records: 84,
    confidence: 93,
    route: ["苏禾（经办）", "林晓（复核）", "陈宁（账户管理）", "周然（财务）", "许言（负责人）", "沈舟（财务负责人）", "唐悦（公司负责人）"],
    note: "若同时变更印鉴或法人信息，需要补充合规审核节点“顾清”，并附最新工商材料。",
    source: "命中该公司变更链路 2 条，关联同类业务历史记录 84 条",
    found: true,
    sourceFile: "对公账户审批链知识库（脱敏示例）.xlsx",
    sourceVersion: "v2026.02",
    sourceUpdated: "2026-02-18",
    sourceExcerpt: "云帆商贸有限公司｜变更业务｜苏禾 → 林晓 → 陈宁 → 周然 → 许言 → 沈舟 → 唐悦",
  },
  {
    keywords: ["销户", "注销"],
    question: "晨曦服务有限公司销户业务审批链是什么？",
    company: "晨曦服务有限公司",
    business: "销户业务",
    intent: "公司实体 + 销户业务",
    records: 57,
    confidence: 91,
    route: ["叶青（经办）", "苏禾（复核）", "陈宁（账户管理）", "周然（财务）", "顾清（合规）", "许言（负责人）", "沈舟（财务负责人）", "唐悦（公司负责人）", "陆川（终审）"],
    note: "销户前需确认账户余额、未达账项和关联协议均已处理；涉及公司注销时增加法审节点。",
    source: "命中该公司销户链路 1 条，关联同类业务历史记录 57 条",
    found: true,
    sourceFile: "对公账户审批链知识库（脱敏示例）.xlsx",
    sourceVersion: "v2026.02",
    sourceUpdated: "2026-02-18",
    sourceExcerpt: "晨曦服务有限公司｜销户业务｜叶青 → 苏禾 → 陈宁 → 周然 → 顾清 → 许言 → 沈舟 → 唐悦 → 陆川",
  },
];

const dashboardSets = {
  全部: {
    accounts: { 全币种: 1292, 人民币: 1277, 外币: 15 },
    rate: "1.42%", alerts: 12, suggestion: 8,
    institutions: [["国有银行", 682], ["股份银行", 388], ["其他银行", 222]],
    amountBands: [["10 万及以下", 44], ["10–50 万", 28], ["50–100 万", 18], ["100 万以上", 10]],
    currencies: [["人民币", 1277], ["美元", 12], ["港币", 2], ["欧元", 1]],
    rates: [["银行 A", 1.62], ["银行 B", 1.48], ["银行 C", 1.35], ["银行 D", 1.21], ["银行 E", 1.08]],
    expiry: [108, 103, 81, 73, 79, 83, 118, 119, 99, 150, 126, 36],
    upcoming: [["账户 A", "**** 1028", "3 天", "续签中"], ["账户 B", "**** 2631", "6 天", "待沟通"], ["账户 C", "**** 3875", "9 天", "待确认"], ["账户 D", "**** 4106", "12 天", "已确认"], ["账户 E", "**** 5290", "15 天", "续签中"], ["账户 F", "**** 6352", "18 天", "待沟通"], ["账户 G", "**** 7481", "20 天", "待确认"], ["账户 H", "**** 8164", "22 天", "续签中"], ["账户 I", "**** 9273", "24 天", "已确认"], ["账户 J", "**** 0358", "26 天", "待沟通"], ["账户 K", "**** 1469", "28 天", "待确认"], ["账户 L", "**** 2517", "30 天", "续签中"]],
    risks: ["先处理 12 笔临近到期账户，按倒计时和当前状态安排跟进顺序", "对 4 笔低于同类参考利率的账户发起询价，评估调整银行或重新议价", "结合未来资金用途，从中筛出 8 笔优先续签，避免闲置资金收益下滑"],
  },
  国有银行: {
    accounts: { 全币种: 682, 人民币: 676, 外币: 6 },
    rate: "1.36%", alerts: 4, suggestion: 3,
    institutions: [["银行 A", 220], ["银行 B", 160], ["银行 C", 120], ["银行 D", 102], ["银行 E", 80]],
    amountBands: [["10 万及以下", 39], ["10–50 万", 31], ["50–100 万", 20], ["100 万以上", 10]],
    currencies: [["人民币", 676], ["美元", 5], ["港币", 1], ["欧元", 0]],
    rates: [["银行 A", 1.52], ["银行 B", 1.44], ["银行 C", 1.31], ["银行 D", 1.18], ["银行 E", 1.02]],
    expiry: [54, 49, 43, 38, 41, 45, 61, 58, 47, 76, 63, 18],
    upcoming: [["账户 A", "**** 1028", "9 天", "续签中"], ["账户 B", "**** 2631", "16 天", "待沟通"], ["账户 C", "**** 3875", "23 天", "已确认"], ["账户 D", "**** 4106", "29 天", "待确认"]],
    risks: ["4 笔账户将在 30 天内到期，优先确认尚未沟通和待确认的账户", "整体利率较稳定，可重点复核低于同类银行水平的个别账户", "结合短期资金安排，建议优先推进其中 3 笔续签，保留必要流动性"],
  },
  股份银行: {
    accounts: { 全币种: 388, 人民币: 382, 外币: 6 },
    rate: "1.51%", alerts: 6, suggestion: 4,
    institutions: [["银行 F", 120], ["银行 G", 95], ["银行 H", 75], ["银行 I", 55], ["银行 J", 43]],
    amountBands: [["10 万及以下", 48], ["10–50 万", 25], ["50–100 万", 17], ["100 万以上", 10]],
    currencies: [["人民币", 382], ["美元", 5], ["港币", 1], ["欧元", 0]],
    rates: [["银行 F", 1.72], ["银行 G", 1.58], ["银行 H", 1.43], ["银行 I", 1.29], ["银行 J", 1.16]],
    expiry: [36, 40, 25, 22, 24, 26, 39, 43, 34, 51, 45, 12],
    upcoming: [["账户 A", "**** 5290", "6 天", "待确认"], ["账户 B", "**** 6352", "11 天", "待沟通"], ["账户 C", "**** 7481", "16 天", "续签中"], ["账户 D", "**** 8164", "20 天", "已确认"], ["账户 E", "**** 9273", "24 天", "待沟通"], ["账户 F", "**** 0358", "29 天", "待确认"]],
    risks: ["6 笔账户将在 30 天内到期，先处理倒计时不足 15 天的待确认账户", "股份银行利率相对较高，可优先保留高于同类参考水平的账户", "建议推进 4 笔续签，其余账户结合资金需求比较其他银行报价"],
  },
  其他银行: {
    accounts: { 全币种: 222, 人民币: 219, 外币: 3 },
    rate: "1.47%", alerts: 2, suggestion: 1,
    institutions: [["城商行 A", 70], ["农商行 A", 55], ["外资行 A", 42], ["城商行 B", 35], ["其他", 20]],
    amountBands: [["10 万及以下", 51], ["10–50 万", 27], ["50–100 万", 14], ["100 万以上", 8]],
    currencies: [["人民币", 219], ["美元", 2], ["港币", 0], ["欧元", 1]],
    rates: [["城商行 A", 1.69], ["农商行 A", 1.55], ["外资行 A", 1.38], ["城商行 B", 1.23], ["其他", 1.11]],
    expiry: [18, 14, 13, 13, 14, 12, 18, 18, 18, 23, 18, 6],
    upcoming: [["账户 A", "**** 1469", "14 天", "待沟通"], ["账户 B", "**** 2517", "26 天", "已确认"]],
    risks: ["2 笔账户将在 30 天内到期，优先完成尚未沟通账户的续签意向确认", "不同机构利率差异较明显，建议对低于同类水平的账户补充询价比较", "结合账户余额和近期支付计划，优先推进 1 笔续签，另一笔保留调整空间"],
  },
} as const;

const receiptSamples = [
  { dispatcher: "林晓", sequence: "081", task: "BG20260081", reported: "是，系统 A", product: "不涉及", billing: "华南主体 A", management: "管理主体 A", principal: "陈宁", urgent: "否", name: "星河科技有限公司", account: "**** 2841", ownership: "自有", region: "境内", purpose: "一般结算", bankType: "国有银行", bank: "银行 A 广州支行", remote: "否", business: "开立账户", detail: "开立一般结算户", headquarters: "是", approval: "许言", approvalRegion: "广州", counter: "周然", date: "2026-06-12", currency: "人民币" },
  { dispatcher: "陈宁", sequence: "082", task: "BG20260082", reported: "否", product: "不涉及", billing: "华南主体 B", management: "管理主体 B", principal: "苏禾", urgent: "是", name: "云帆商贸有限公司", account: "**** 5176", ownership: "客户", region: "境内", purpose: "日常经营", bankType: "股份银行", bank: "银行 B 深圳支行", remote: "是", business: "变更账户", detail: "变更工商及网银信息", headquarters: "否", approval: "顾清", approvalRegion: "深圳", counter: "林晓", date: "2026-06-12", currency: "人民币" },
  { dispatcher: "周然", sequence: "083", task: "BG20260083", reported: "是，系统 B", product: "不涉及", billing: "华南主体 C", management: "管理主体 C", principal: "叶青", urgent: "否", name: "晨曦服务有限公司", account: "**** 9032", ownership: "自有", region: "境内", purpose: "项目专户", bankType: "城商行", bank: "银行 C 佛山支行", remote: "否", business: "销户业务", detail: "账户销户及资料回收", headquarters: "否", approval: "沈舟", approvalRegion: "佛山", counter: "陈宁", date: "2026-06-13", currency: "人民币" },
] as const;

const receiptDocuments = [
  { id: "open", label: "开户申请书/表", full: "账户开户申请书/表（若有，请复制到下面）" },
  { id: "change", label: "变更申请书/表", full: "账户变更申请书/表（若有，请复制到下面）" },
  { id: "close", label: "销户申请书/表", full: "账户销户申请书/表（若有，请复制到下面）" },
  { id: "seal", label: "印鉴卡复印件", full: "印鉴卡复印件（若有，请复制到下面）" },
  { id: "agreement", label: "账户管理协议", full: "账户管理协议（若有，请复制到下面）" },
  { id: "direct", label: "银企直联申请表", full: "银企直联服务申请（变更）表（若有，请复制到下面）" },
  { id: "online", label: "企业网银申请表", full: "网上企业银行服务申请/变更表（若有，请复制到下面）" },
  { id: "deposit", label: "协定存款协议", full: "协定存款协议（若有，请复制到下面）" },
  { id: "other", label: "其他回执", full: "其他回执：请列明资料全称，中间用 / 隔开" },
] as const;

const namingRows = [
  ["业务回执", "_", "星河科技有限公司", "2841", "_", "银行A", "_", "20260612"],
  ["印鉴卡", "_", "云帆商贸有限公司", "5176", "_", "银行B", "_", "20260612"],
  ["账户协议", "_", "晨曦服务有限公司", "9032", "_", "银行C", "_", "20260612"],
] as const;

const namingFiles = ["扫描文件_001.pdf", "扫描文件_002.pdf", "扫描文件_003.pdf"] as const;

function CapabilityLab() {
  const sourceTableRef = useRef<HTMLDivElement>(null);
  const outputTableRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<"ai" | "data" | "workflow">("ai");
  const [query, setQuery] = useState(aiScenarios[0].question);
  const [answer, setAnswer] = useState(aiScenarios[0]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackCompany, setFeedbackCompany] = useState("");
  const [feedbackBusiness, setFeedbackBusiness] = useState("");
  const [feedbackNote, setFeedbackNote] = useState("");
  const [bank, setBank] = useState<keyof typeof dashboardSets>("全部");
  const [dataView, setDataView] = useState<"overview" | "rate" | "expiry">("overview");
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [exported, setExported] = useState(false);
  const [toolDemo, setToolDemo] = useState<"receipt" | "naming">("receipt");
  const [receiptStep, setReceiptStep] = useState<1 | 2 | 3>(1);
  const [sourceExpanded, setSourceExpanded] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>(["open", "seal", "agreement"]);
  const [recordDocuments, setRecordDocuments] = useState<Record<string, string[]>>({
    BG20260081: ["open", "seal", "agreement"],
    BG20260082: ["change", "seal", "direct", "online"],
    BG20260083: ["close", "agreement", "other"],
  });
  const [namingColumns, setNamingColumns] = useState<5 | 8>(5);
  const data = dashboardSets[bank];
  const displayedDocumentIds = receiptDocuments
    .filter((document) => selectedDocuments.includes(document.id)
      || receiptSamples.some((item) => recordDocuments[item.task]?.includes(document.id)))
    .map((document) => document.id);
  const generatedNames = namingRows.map((row) => `${row.slice(0, namingColumns).join("").replace(/_+$/, "")}.pdf`);
  const institutionMax = Math.max(...data.institutions.map(([, value]) => value));
  const expiryMax = Math.ceil(Math.max(...data.expiry) / 50) * 50;
  const visibleUpcoming = showAllUpcoming ? data.upcoming : data.upcoming.slice(0, 3);
  const donutGradient = data.amountBands.reduce(
    (result, [, value], index) => {
      const start = result.total;
      const end = start + value;
      return {
        total: end,
        stops: [...result.stops, `var(--donut-${index}) ${start}% ${end}%`],
      };
    },
    { total: 0, stops: [] as string[] },
  ).stops.join(", ");

  function toggleRecordDocument(task: string, documentId: string) {
    setRecordDocuments((current) => {
      const documents = current[task] ?? [];
      return {
        ...current,
        [task]: documents.includes(documentId)
          ? documents.filter((item) => item !== documentId)
          : [...documents, documentId],
      };
    });
  }

  function syncDocumentsToAll() {
    setRecordDocuments(Object.fromEntries(receiptSamples.map((item) => [item.task, [...selectedDocuments]])));
  }

  function runAiSearch(nextQuery = query) {
    const normalized = nextQuery.trim();
    const baseMatch = aiScenarios.find((scenario) =>
      normalized.includes(scenario.company)
      && scenario.keywords.some((keyword) => normalized.includes(keyword)));
    const company = normalized.match(/[\u4e00-\u9fa5A-Za-z0-9]{2,18}(?:有限责任公司|有限公司|股份有限公司|公司)/)?.[0];
    const business = normalized.includes("开户") || normalized.includes("基本户")
      ? "开户业务"
      : normalized.includes("变更") || normalized.includes("网银")
        ? "变更业务"
        : normalized.includes("销户") || normalized.includes("注销")
          ? "销户业务"
          : "";
    const matched: AiScenario = baseMatch ? {
      ...baseMatch,
      company: company ?? baseMatch.company,
    } : company && business ? {
      ...aiScenarios[0],
      question: normalized,
      company,
      business,
      intent: `公司实体 + ${business}`,
      records: 0,
      confidence: 94,
      route: [],
      note: "知识库中无相关记录，请反馈知识库管理员“林老师”（化名）补充审批链。",
      source: "已完成实体与业务识别，但未检索到对应公司业务组合",
      found: false,
      sourceFile: "",
      sourceVersion: "",
      sourceUpdated: "",
      sourceExcerpt: "",
    } : {
      ...aiScenarios[0],
      question: normalized || aiScenarios[0].question,
      company: company ?? "待确认公司",
      business: "待确认业务",
      intent: "账户业务 / 待确认场景",
      records: 32,
      confidence: 78,
      route: [],
      note: "当前问题信息不足，请补充具体公司名称以及开户、变更或销户等业务类型。",
      source: "仅召回相似问法，尚未定位到唯一审批链",
      found: false,
      sourceFile: "",
      sourceVersion: "",
      sourceUpdated: "",
      sourceExcerpt: "",
    };
    setQuery(normalized || aiScenarios[0].question);
    setSourceOpen(false);
    setSearching(true);
    window.setTimeout(() => {
      setAnswer(matched);
      setSearching(false);
      setHasSearched(true);
    }, 450);
  }

  function chooseExample(nextQuery: string) {
    setQuery(nextQuery);
    setSearching(false);
    setHasSearched(false);
    setSourceOpen(false);
  }

  function openFeedback() {
    setFeedbackCompany(answer.company === "待确认公司" ? "" : answer.company);
    setFeedbackBusiness(answer.business === "待确认业务" ? "" : answer.business);
    setFeedbackNote("");
    setFeedbackSent(false);
    setFeedbackOpen(true);
  }

  function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedbackSent(true);
  }

  useEffect(() => {
    if (!feedbackOpen && !sourceOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFeedbackOpen(false);
        setSourceOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [feedbackOpen, sourceOpen]);

  function exportAnalysis() {
    const summary = [
      "协定存款经营分析摘要（脱敏样例）",
      `筛选范围：${bank}`,
      `账户数量：${data.accounts.全币种}`,
      `平均利率：${data.rate}`,
      `到期预警：${data.alerts} 笔`,
      `续签建议：${data.suggestion} 笔`,
      "",
      "业务洞察：",
      ...data.risks.map((risk, index) => `${index + 1}. ${risk}`),
      "",
      "说明：本摘要由网页本地样例数据生成，不包含真实客户或公司数据。",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([summary], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `协定存款分析摘要-${bank}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
    window.setTimeout(() => setExported(false), 1600);
  }

  return (
    <section className="lab-section" id="lab">
      <div className="section-title">
        <span>TRY IT YOURSELF</span>
        <h2>不只看我怎么说，直接操作一次。</h2>
        <p>以下演示使用脱敏样例数据，在浏览器本地运行，不连接公司系统，也不会上传输入内容。</p>
      </div>
      <div className="lab-shell">
        <div className="lab-tabs" role="tablist" aria-label="选择能力演示">
          <button type="button" role="tab" aria-selected={active === "ai"} className={active === "ai" ? "active" : ""} onClick={() => setActive("ai")}><i className="lab-icon ai">AI</i><span><b>AI 应用</b><small>意图识别与知识匹配</small></span></button>
          <button type="button" role="tab" aria-selected={active === "data"} className={active === "data" ? "active" : ""} onClick={() => setActive("data")}><i className="lab-icon data">▥</i><span><b>数据分析</b><small>筛选、指标与业务建议</small></span></button>
          <button type="button" role="tab" aria-selected={active === "workflow"} className={active === "workflow" ? "active" : ""} onClick={() => setActive("workflow")}><i className="lab-icon flow">↯</i><span><b>自动化工具</b><small>数据解析与模板生成</small></span></button>
        </div>

        <div className="lab-panel">
          {active === "ai" && (
            <div className="ai-playground">
              <div className="lab-input-side">
                <div className="lab-panel-title"><span>01</span><div><b>输入业务问题</b><small>试试自然语言查询</small></div></div>
                <div className="query-box">
                  <textarea value={query} onChange={(event) => { setQuery(event.target.value); setHasSearched(false); }} aria-label="业务问题" />
                  <button type="button" onClick={() => runAiSearch()} disabled={searching}>{searching ? "检索中…" : "运行匹配 →"}</button>
                </div>
                <div className="example-queries">
                  <small>示例问题</small>
                  {aiScenarios.map((scenario) => <button type="button" onClick={() => chooseExample(scenario.question)} key={scenario.question}>{scenario.question}</button>)}
                  <button className="missing-example" type="button" onClick={() => chooseExample("远山能源有限公司开户业务审批链是什么？")}>试试知识库未收录的公司 →</button>
                </div>
                <div className="logic-stack"><span>意图分类</span><i /> <span>规则过滤</span><i /> <span>知识检索</span><i /> <span>结果校验</span></div>
              </div>
              <div className={`ai-result ${searching ? "loading" : ""}`}>
                <div className="lab-panel-title light"><span>02</span><div><b>匹配结果</b><small>解释过程，而不只是给答案</small></div></div>
                {searching ? <div className="result-loading"><i /><i /><i /><p>正在检索脱敏知识样例…</p></div> : !hasSearched ? (
                  <div className="result-ready">
                    <div className="ready-orb"><Icon name="spark" /></div>
                    <h3>等待运行匹配</h3>
                    <p>选择示例问题只会填入输入框。点击左侧“运行匹配”，系统才会执行意图识别、规则过滤和知识检索。</p>
                    <div>{["识别公司与业务", "过滤有效记录", "返回审批链", "保留来源追溯"].map((item, index) => <span key={item}><i>{index + 1}</i>{item}</span>)}</div>
                  </div>
                ) : <>
                  <div className="intent-row"><span>识别意图</span><b>{answer.intent}</b><em>{answer.confidence}% 置信度</em></div>
                  <div className="retrieval-row"><span>知识检索</span><b>{answer.records}</b><small>条关联记录 · {answer.source}</small></div>
                  {answer.found && (
                    <button className="matched-record" type="button" onClick={() => setSourceOpen(true)}>
                      <span><i>✓</i><b>最终命中记录</b><small>{answer.company} · {answer.business}</small></span>
                      <em>查看来源文件 →</em>
                    </button>
                  )}
                  <div className="route-output">
                    <small>{answer.found ? `${answer.company}${answer.business}审批链如下` : "知识库检索结果"}</small>
                    {answer.route.length > 0
                      ? <div className="route-people">{answer.route.map((item, index) => <span key={`${item}-${index}`}><i>{index + 1}</i><b>{item}</b></span>)}</div>
                      : <div className="no-record">
                          <strong>{answer.records === 0 ? "知识库中无相关记录" : "暂时无法生成审批链"}</strong>
                          <p>{answer.records === 0 ? "该公司与业务已识别，但当前知识库尚未维护对应链路。" : "需要补充业务信息后才能生成具体人员链路。"}</p>
                          {answer.records === 0 && <button type="button" onClick={openFeedback}>反馈管理员 →</button>}
                        </div>}
                  </div>
                  <p className="result-note"><Icon name="spark" /><span><b>条件备注</b>{answer.note}</span></p>
                  <small className="demo-disclaimer">演示中的公司及人员均为化名，链路结构依据项目逻辑脱敏重构。</small>
                </>}
              </div>
            </div>
          )}

          {active === "data" && (
            <div className="data-playground">
              <div className="data-toolbar">
                <div><b>协定存款业务数据看板</b><small>依据原项目结构脱敏重绘 · 数值与名称均为演示数据</small></div>
                <div className="data-filters">
                  <label>全局联动筛选<select value={bank} onChange={(event) => { setBank(event.target.value as keyof typeof dashboardSets); setShowAllUpcoming(false); }}>{Object.keys(dashboardSets).map((item) => <option key={item}>{item}</option>)}</select></label>
                </div>
              </div>
              <div className="data-view-tabs" role="tablist" aria-label="选择看板视图">
                <button type="button" role="tab" aria-selected={dataView === "overview"} className={dataView === "overview" ? "active" : ""} onClick={() => setDataView("overview")}>业务概览</button>
                <button type="button" role="tab" aria-selected={dataView === "rate"} className={dataView === "rate" ? "active" : ""} onClick={() => setDataView("rate")}>利率分析</button>
                <button type="button" role="tab" aria-selected={dataView === "expiry"} className={dataView === "expiry" ? "active" : ""} onClick={() => setDataView("expiry")}>到期预警</button>
                <span>公开演示新增筛选交互</span>
              </div>
              <div className="analytics-grid">
                <div className="analytics-main">
                  <div className="analytics-kpis"><div><span>账户数量</span><b>{data.accounts.全币种}</b></div><div><span>平均协议利率</span><b>{data.rate}</b></div><div className="warning"><span>30 天内到期</span><b>{data.alerts}</b></div><div className="success"><span>优先跟进建议</span><b>{data.suggestion}</b></div></div>
                  {dataView === "overview" && <div className="overview-charts">
                    <div className="distribution-card"><div className="chart-head"><b>存款机构构成</b><span>账户数量 · 合计 {data.accounts.全币种}</span></div>{data.institutions.map(([name, value]) => <div className="rank-bar" key={name}><span>{name}</span><i><b style={{ width: `${value / institutionMax * 100}%` }} /></i><em>{value}</em></div>)}</div>
                    <div className="distribution-card"><div className="chart-head"><b>存款金额区间</b><span>账户占比</span></div><div className="donut-layout"><div className="amount-donut" style={{ background: `conic-gradient(${donutGradient})` }} aria-label="存款金额区间圆环图" /><div className="donut-legend">{data.amountBands.map(([name, value], index) => <div key={name}><i className={`legend-${index}`} /><span>{name}</span><b>{value}%</b></div>)}</div></div><div className="currency-row">{data.currencies.map(([name, value]) => <span key={name}><b>{value}</b>{name}</span>)}</div></div>
                  </div>}
                  {dataView === "rate" && <div className="rate-analysis-card"><div className="chart-head"><b>协议利率竞争力</b><span>银行名称已用代号替换</span></div><div className="rate-bars">{data.rates.map(([name, value]) => <div key={name}><span>{name}</span><i><b style={{ width: `${value / 1.8 * 100}%` }} /></i><em>{value.toFixed(2)}%</em></div>)}</div><div className="benchmark-callout"><span>分析逻辑</span><p>以同类型银行的较高协议利率作为参考，识别低于参考水平的账户，再结合资金需求判断是否调整。</p></div></div>}
                  {dataView === "expiry" && <div className="expiry-layout"><div className="interactive-chart expiry-chart"><div className="chart-head"><b>未来 12 个月到期分布</b></div><div className="expiry-chart-body"><div className="bar-field">{data.expiry.map((value, index) => <div key={`${bank}-${index}`}><div className="bar-column" style={{ height: `${Math.max(6, value / expiryMax * 100)}%` }}><b>{value}</b><i /></div><span>{index + 1}月</span></div>)}</div></div></div><div className="upcoming-table"><div className="upcoming-title"><b>30 天内到期账户</b><span>展示 {visibleUpcoming.length} / 共 {data.alerts} 笔</span></div><div className="upcoming-head"><span>账户名称</span><span>账号</span><span>到期倒计时</span><span>当前状态</span></div>{visibleUpcoming.map(([accountName, accountNo, days, status]) => <p key={accountNo}><b>{accountName}</b><span>{accountNo}</span><strong>{days}</strong><em>{status}</em></p>)}{data.upcoming.length > 3 && <button type="button" onClick={() => setShowAllUpcoming((value) => !value)}>{showAllUpcoming ? "收起明细" : `查看全部 ${data.alerts} 笔 →`}</button>}<small>账户名称与账号均为脱敏示例，公开版仅演示跟进逻辑。</small></div></div>}
                </div>
                <aside className="insight-panel"><span>业务洞察</span><h3>{bank === "全部" ? "需要优先处理的事项" : `${bank}分析建议`}</h3>{data.risks.map((risk, index) => <div key={risk}><i>{index + 1}</i><p>{risk}</p></div>)}<button type="button" onClick={exportAnalysis}>{exported ? "摘要已生成 ✓" : "导出分析摘要"}</button></aside>
              </div>
            </div>
          )}

          {active === "workflow" && (
            <div className="tool-lab">
              <div className="tool-demo-tabs" role="tablist" aria-label="选择自动化工具">
                <button type="button" role="tab" aria-selected={toolDemo === "receipt"} className={toolDemo === "receipt" ? "active" : ""} onClick={() => setToolDemo("receipt")}><b>回执交接工具</b><span>字段转换与材料列控制</span></button>
                <button type="button" role="tab" aria-selected={toolDemo === "naming"} className={toolDemo === "naming" ? "active" : ""} onClick={() => setToolDemo("naming")}><b>批量文件命名</b><span>文件包与 Excel 清单自动匹配</span></button>
              </div>

              {toolDemo === "receipt" ? (
                <div className="receipt-demo">
                  <div className="receipt-progress">
                    {["导入待办数据", "筛选、重排与补充", "生成交接表"].map((item, index) => <div className={receiptStep >= index + 1 ? "active" : ""} key={item}><span>{receiptStep > index + 1 ? "✓" : index + 1}</span><b>{item}</b></div>)}
                  </div>

                  {receiptStep === 1 && <div className="receipt-source">
                    <div className="tool-panel-head"><div><small>INPUT</small><h3>临柜待办表</h3><p>支持导入 Excel 或粘贴整批待办数据。原表字段多、顺序固定，但交接表只需要其中一部分。</p></div><span>本批次 48 条 · 展示 3 条</span></div>
                    <div className="table-view-toolbar"><div><b>{sourceExpanded ? "完整字段视图" : "关键字段视图"}</b><span>源表实际包含 46 个字段，默认只展示理解流程所需的 8 个</span></div><button type="button" onClick={() => setSourceExpanded((value) => !value)}>{sourceExpanded ? "收起完整字段" : "查看完整字段"}</button></div>
                    <div className={`source-sheet-preview ${sourceExpanded ? "is-expanded" : "is-summary"}`} ref={sourceTableRef}>
                      {sourceExpanded ? <>
                        <div className="sheet-row sheet-head"><span>派工人</span><span>序号</span><span>业务编号</span><span>是否报备</span><span>产品名称</span><span>计费主体</span><span>管理主体</span><span>委托人</span><span>是否紧急</span><span>户名</span><span>账号</span><span>自有/客户</span><span>境内/境外</span><span>账户用途</span><span>银行大类</span><span>银行名称</span><span>是否异地</span><span>业务类型</span><span>具体事项描述</span><span>是否总部账户</span><span>签报人</span><span>签报所属地</span><span>临柜人员</span><span>委托日期</span></div>
                        {receiptSamples.map((item) => <div className="sheet-row" key={item.task}><span>{item.dispatcher}</span><span>{item.sequence}</span><span>{item.task}</span><span>{item.reported}</span><span>{item.product}</span><span>{item.billing}</span><span>{item.management}</span><span>{item.principal}</span><span>{item.urgent}</span><span>{item.name}</span><span>{item.account}</span><span>{item.ownership}</span><span>{item.region}</span><span>{item.purpose}</span><span>{item.bankType}</span><span>{item.bank}</span><span>{item.remote}</span><span>{item.business}</span><span>{item.detail}</span><span>{item.headquarters}</span><span>{item.approval}</span><span>{item.approvalRegion}</span><span>{item.counter}</span><span>{item.date}</span></div>)}
                      </> : <>
                        <div className="sheet-summary-row sheet-head"><span>业务编号</span><span>户名</span><span>账号</span><span>业务类型</span><span>银行名称</span><span>具体事项</span><span>临柜人员</span><span>委托日期</span></div>
                        {receiptSamples.map((item) => <div className="sheet-summary-row" key={item.task}><span>{item.task}</span><span>{item.name}</span><span>{item.account}</span><span>{item.business}</span><span>{item.bank}</span><span>{item.detail}</span><span>{item.counter}</span><span>{item.date}</span></div>)}
                      </>}
                    </div>
                    {sourceExpanded && <TableScrollbar targetRef={sourceTableRef} label="临柜待办表横向滚动" refreshKey="expanded" />}
                    <div className="batch-footnote"><span>{sourceExpanded ? "按原临柜表顺序展示 24 个主要字段" : "默认提炼 8 个关键字段，降低阅读负担"}</span><b>仅展示 3 条待办记录，另有 45 条已折叠</b></div>
                    <button className="tool-primary-action" type="button" onClick={() => setReceiptStep(2)}>解析 48 条待办数据 →</button>
                  </div>}

                  {receiptStep === 2 && <div className="receipt-editor">
                    <div className="tool-panel-head"><div><small>FIELD TRANSFORM</small><h3>不是复制，而是筛选并重组</h3><p>工具从待办表中只提取交接所需字段，按目标模板重新排序，再补充本批次实际收到的材料。</p></div><span>48 条记录一次处理</span></div>
                    <div className="transform-summary"><div><b>46</b><span>源表字段</span></div><i>→</i><div><b>13</b><span>提取并重排</span></div><i>+</i><div><b>9</b><span>可选材料列</span></div></div>
                    <div className="field-transform">
                      <div><small>保留并重排（展示部分映射）</small><p>{["任务编号 → AMS任务编号", "计费主体 → 计费主体", "管理主体 → 管理主体", "委托人 → 委托人", "业务类型 → 业务类型", "委托日期 → 业务日期", "银行名称 → 开户行名称", "账号 → 账号", "临柜人员 → 资料移交人"].map((item) => <span key={item}>✓ {item}</span>)}</p></div>
                      <div className="discarded"><small>不进入交接表</small><p>{["是否报备", "产品名称", "是否紧急", "账户用途", "业务说明", "签报所属地"].map((item) => <span key={item}>− {item}</span>)}</p></div>
                    </div>
                    <div className="document-selector batch-selector"><div className="selector-head"><div><b>批量设置公共材料</b><small>先选择多数账号都有的材料，再同步至全部记录</small></div><button type="button" onClick={syncDocumentsToAll}>同步至全部账号</button></div><div>{receiptDocuments.map((document) => <label title={document.full} key={document.id}><input type="checkbox" checked={selectedDocuments.includes(document.id)} onChange={() => setSelectedDocuments((current) => current.includes(document.id) ? current.filter((item) => item !== document.id) : [...current, document.id])} /><span>{document.label}</span></label>)}</div></div>
                    <div className="record-material-editor"><div className="record-editor-head"><b>逐条调整材料</b><span>某个账号缺少或多出材料时，可单独修改，不影响其他记录</span></div>{receiptSamples.map((item) => <div className="record-material-row" key={item.task}><div><b>{item.name}</b><small>{item.account} · {item.business}</small></div><section>{receiptDocuments.map((document) => <label title={document.full} key={document.id}><input type="checkbox" checked={recordDocuments[item.task]?.includes(document.id) ?? false} onChange={() => toggleRecordDocument(item.task, document.id)} /><span>{document.label}</span></label>)}</section></div>)}</div>
                    <div className="tool-actions"><button type="button" onClick={() => setReceiptStep(1)}>返回</button><button className="primary" type="button" onClick={() => setReceiptStep(3)}>生成交接表预览 →</button></div>
                  </div>}

                  {receiptStep === 3 && <div className="receipt-output">
                    <div className="tool-panel-head"><div><small>OUTPUT</small><h3>回执交接表预览</h3><p>待办表与交接表逐行对应：导入 48 条待办记录，生成 48 条交接记录。13 个固定基础字段已按模板顺序重排。</p></div><span>48 条记录 · 13 个基础字段 + {displayedDocumentIds.length} 个材料列</span></div>
                    <div className="record-reconcile"><div><b>48</b><span>待办表输入</span></div><i>逐行解析与重排</i><div><b>48</b><span>交接表输出</span></div><em>✓ 数量校验一致</em></div>
                    <div className="column-rule"><span>基础字段固定保留</span><i /><span className="active">已收到材料列显示</span><i /><span className="muted">未收到材料列隐藏</span></div>
                    <div className="table-view-toolbar"><div><b>{outputExpanded ? "完整交接模板" : "结果摘要视图"}</b><span>完整结果包含 13 个基础字段和动态材料列，默认只展示关键结果</span></div><button type="button" onClick={() => setOutputExpanded((value) => !value)}>{outputExpanded ? "收起完整字段" : "查看完整字段"}</button></div>
                    <div className={`output-table material-output ${outputExpanded ? "is-expanded" : "is-summary"}`} ref={outputTableRef}>
                      {outputExpanded ? <>
                        <div className="output-row output-head" style={{ gridTemplateColumns: `42px 92px 96px 96px 70px 82px 86px 120px 90px 120px 82px 82px 82px repeat(${Math.max(displayedDocumentIds.length, 1)}, 104px)` }}><span>序号</span><span>AMS任务编号</span><span>计费主体</span><span>管理主体</span><span>委托人</span><span>业务类型</span><span>业务日期</span><span>开户行名称</span><span>账号</span><span>账户名称</span><span>币种</span><span>资料移交人</span><span>资料归档人</span>{displayedDocumentIds.length > 0 ? receiptDocuments.filter((document) => displayedDocumentIds.includes(document.id)).map((document) => <span title={document.full} key={document.id}>{document.label}</span>) : <span>暂无材料列</span>}</div>
                        {receiptSamples.map((item, index) => <div className="output-row" style={{ gridTemplateColumns: `42px 92px 96px 96px 70px 82px 86px 120px 90px 120px 82px 82px 82px repeat(${Math.max(displayedDocumentIds.length, 1)}, 104px)` }} key={item.task}><span>{index + 1}</span><span>{item.task}</span><span>{item.billing}</span><span>{item.management}</span><span>{item.principal}</span><span>{item.business}</span><span>{item.date}</span><span>{item.bank}</span><span>{item.account}</span><span>{item.name}</span><span>{item.currency}</span><span>{item.counter}</span><span>许宁（化名）</span>{displayedDocumentIds.length > 0 ? receiptDocuments.filter((document) => displayedDocumentIds.includes(document.id)).map((document) => recordDocuments[item.task]?.includes(document.id) ? <span className="material-cell" key={document.id}>✓ 1 份</span> : <span className="material-cell missing" key={document.id}>—</span>) : <span className="empty-cell">待选择材料</span>}</div>)}
                      </> : <>
                        <div className="output-summary-row output-head"><span>序号</span><span>AMS任务编号</span><span>账户名称</span><span>业务类型</span><span>业务日期</span><span>资料移交人</span><span>材料状态</span></div>
                        {receiptSamples.map((item, index) => <div className="output-summary-row" key={item.task}><span>{index + 1}</span><span>{item.task}</span><span>{item.name}</span><span>{item.business}</span><span>{item.date}</span><span>{item.counter}</span><span className="material-summary">{recordDocuments[item.task]?.length ?? 0} / 9 类已收</span></div>)}
                      </>}
                    </div>
                    {outputExpanded && <TableScrollbar targetRef={outputTableRef} label="回执交接表横向滚动" refreshKey={displayedDocumentIds.join(",")} />}
                    <div className="batch-footnote"><span>仅预览 3 / 48 条交接记录</span><b>其余 45 条已按相同规则生成</b></div>
                    <div className="hidden-columns">{receiptDocuments.filter((document) => !displayedDocumentIds.includes(document.id)).map((document) => <span title={document.full} key={document.id}>整批隐藏：{document.label}</span>)}</div>
                    <div className="automation-impact"><span>48 条数据完成 13 个字段取数、重排与逐条材料控制</span><b>15 min → 3–5 min</b><em>减少错列、漏填和逐列隐藏操作</em></div>
                    <div className="workflow-value"><b>这个工具解决什么？</b><span>把人工复制、改列顺序、逐条核对材料和隐藏空列，合并成一次批量生成。</span></div>
                    <div className="tool-actions"><button type="button" onClick={() => setReceiptStep(2)}>修改资料</button><button className="primary" type="button" onClick={() => setReceiptStep(1)}>重新演示</button></div>
                  </div>}
                </div>
              ) : (
                <div className="naming-demo">
                  <div className="tool-panel-head"><div><small>BATCH RENAME</small><h3>文件包与命名清单按顺序匹配</h3><p>一次导入待命名文件和 Excel 清单，工具按文件顺序读取清单字段、拼接名称，并在执行前预览对应关系。</p></div><span>3 个文件 · 3 条清单 · 数量一致</span></div>
                  <div className="naming-inputs">
                    <div><span className="input-icon">ZIP</span><section><b>待命名文件包</b><small>{namingFiles.join(" · ")}</small></section><em>3 个文件</em></div>
                    <div><span className="input-icon excel">XLS</span><section><b>批量命名清单.xlsx</b><small>回执类型 / 分隔符 / 账户名称 / 账号 / 分隔符 / 银行 / 分隔符 / 日期</small></section><em>8 列字段</em></div>
                  </div>
                  <div className="naming-rule-bar"><div><b>组合前几列作为文件名？</b><span>默认取前 5 列，也可按业务模板扩展到前 8 列</span></div><div>{([5, 8] as const).map((count) => <button type="button" className={namingColumns === count ? "active" : ""} onClick={() => setNamingColumns(count)} key={count}>前 {count} 列</button>)}</div></div>
                  <div className="excel-rule-preview"><div className="rule-row rule-head">{["A 回执类型", "B", "C 账户名称", "D 账号", "E", "F 银行", "G", "H 日期"].map((item, index) => <span className={index < namingColumns ? "used" : ""} key={item}>{item}</span>)}</div><div className="rule-row">{namingRows[0].map((item, index) => <span className={index < namingColumns ? "used" : ""} key={`${item}-${index}`}>{item}</span>)}</div></div>
                  <div className="rename-preview"><div className="rename-head"><span>原文件</span><i>顺序匹配</i><b>生成文件名</b></div>{generatedNames.map((name, index) => <div key={name}><span>{namingFiles[index]}</span><i>#{index + 1} → #{index + 1}</i><b>{name}</b></div>)}</div>
                  <div className="rebuild-note"><Icon name="spark" /><p><b>执行前先校验，再批量改名</b>文件数与清单行数不一致时停止执行；预览可以及时发现顺序错位、空字段和重名，避免批量改错后再逐个返工。</p></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {feedbackOpen && (
        <div className="feedback-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setFeedbackOpen(false); }}>
          <div className="feedback-dialog" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
            <button className="dialog-close" type="button" aria-label="关闭反馈窗口" onClick={() => setFeedbackOpen(false)}>×</button>
            {feedbackSent ? (
              <div className="feedback-success">
                <span>✓</span>
                <h3 id="feedback-title">反馈已记录</h3>
                <p>演示环境不会真实发送数据。实际产品会将这条记录进入管理员待办，并在补录后通知反馈人。</p>
                <button type="button" onClick={() => setFeedbackOpen(false)}>完成</button>
              </div>
            ) : (
              <form onSubmit={submitFeedback}>
                <small>KNOWLEDGE FEEDBACK</small>
                <h3 id="feedback-title">反馈缺失的审批链</h3>
                <p>系统已自动带入识别结果，请确认后提交给知识库管理员。</p>
                <label>公司名称<input required value={feedbackCompany} onChange={(event) => setFeedbackCompany(event.target.value)} /></label>
                <label>业务类型<input required value={feedbackBusiness} onChange={(event) => setFeedbackBusiness(event.target.value)} /></label>
                <label>补充说明<textarea placeholder="例如：联系人、已知审批节点或材料来源" value={feedbackNote} onChange={(event) => setFeedbackNote(event.target.value)} /></label>
                <div className="feedback-owner"><span>接收人</span><b>知识库管理员 · 林老师（化名）</b></div>
                <button className="submit-feedback" type="submit">提交反馈</button>
                <em>本演示仅在浏览器本地模拟，不会上传或保存填写内容。</em>
              </form>
            )}
          </div>
        </div>
      )}
      {sourceOpen && (
        <div className="source-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSourceOpen(false); }}>
          <div className="source-dialog" role="dialog" aria-modal="true" aria-labelledby="source-title">
            <button className="dialog-close" type="button" aria-label="关闭来源文件" onClick={() => setSourceOpen(false)}>×</button>
            <div className="source-dialog-head">
              <span>READ-ONLY SOURCE</span>
              <h3 id="source-title">知识来源追溯</h3>
              <p>这是脱敏重构的只读文件预览，用于展示回答如何追溯到知识库记录。</p>
            </div>
            <div className="source-meta">
              <div><span>来源文件</span><b>{answer.sourceFile}</b></div>
              <div><span>版本</span><b>{answer.sourceVersion}</b></div>
              <div><span>更新时间</span><b>{answer.sourceUpdated}</b></div>
              <div><span>访问权限</span><b>只读 · 禁止编辑</b></div>
            </div>
            <div className="source-document">
              <div className="document-toolbar"><span>匹配行预览</span><em>已脱敏</em></div>
              <div className="document-columns"><span>公司主体</span><span>业务类型</span><span>审批链</span></div>
              <div className="document-match">
                <b>{answer.company}</b>
                <b>{answer.business}</b>
                <p>{answer.sourceExcerpt.split("｜").at(-1)}</p>
              </div>
              <div className="document-note"><b>条件备注</b><p>{answer.note}</p></div>
            </div>
            <div className="readonly-notice"><span>🔒</span><p><b>只读预览</b>公开演示不连接源文件，也不提供修改、下载或回写能力。</p></div>
          </div>
        </div>
      )}
    </section>
  );
}

function ProjectVisual({ type }: { type: Project["visual"] }) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const controls = (
    <div className="motion-controls">
      <span><i /> 流程动画</span>
      <button type="button" onClick={() => setPaused((value) => !value)}>{paused ? "继续" : "暂停"}</button>
      <button type="button" onClick={() => { setPaused(false); setRun((value) => value + 1); }}>重播</button>
    </div>
  );

  if (type === "agent") {
    return (
      <div className={`motion-demo ${paused ? "is-paused" : ""}`} key={`agent-${run}`}>
      <div className="product-mock agent-mock" aria-label="审批链智能体流程动画">
        <div className="mock-toolbar"><i /><i /><i /><span>审批链助手</span></div>
        <div className="chat-request"><span>星河科技有限公司开户业务审批链是什么？</span><i /></div>
        <div className="thinking"><span /><span /><span />正在匹配 3,000+ 条知识记录</div>
        <div className="route-card">
          <small>开户业务审批链如下</small>
          <div><b>林晓</b><i /><b>陈宁</b><i /><b>周然</b><i /><b>许言</b><i /><b>顾清</b><i /><b>沈舟</b><i /><b>唐悦</b><i /><b>陆川</b></div>
          <span>备注：涉及法审时，增加法审同事“韩一”（姓名均为化名）</span>
        </div>
      </div>
      {controls}
      </div>
    );
  }

  if (type === "automation") {
    return (
      <div className={`motion-demo ${paused ? "is-paused" : ""}`} key={`tool-${run}`}>
      <div className="product-mock tool-mock" aria-label="回执自动化工具流程动画">
        <div className="mock-toolbar"><i /><i /><i /><span>EasyReceipt</span></div>
        <div className="tool-progress"><b>1</b><i /><b>2</b><i /><b>3</b></div>
        <div className="drop-zone"><span>↑</span><b>导入 3 份回执文件</b><small>读取 Excel 模板与业务字段</small></div>
        <div className="parsed-row"><span>回执文件_01.pdf</span><b><i /> 已解析</b></div>
        <button type="button" tabIndex={-1}><span>生成交接单</span><b>✓ 已完成</b></button>
      </div>
      {controls}
      </div>
    );
  }

  return (
    <div className={`motion-demo ${paused ? "is-paused" : ""}`} key={`dashboard-${run}`}>
    <div className="product-mock dashboard-mock" aria-label="协定存款业务数据看板流程动画">
      <div className="mock-toolbar"><i /><i /><i /><span>协定存款业务数据看板</span></div>
      <div className="mini-kpis"><div><small>监控记录</small><b>2,000+</b></div><div><small>到期预警</small><b>12</b></div><div><small>续签建议</small><b>8</b></div></div>
      <div className="line-chart">
        <svg viewBox="0 0 500 180" preserveAspectRatio="none">
          <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#0a84ff" stopOpacity=".3"/><stop offset="1" stopColor="#0a84ff" stopOpacity="0"/></linearGradient></defs>
          <path className="area" d="M0 145 C55 130 70 150 120 112 S185 118 225 80 S300 100 345 54 S420 78 500 22 L500 180 L0 180Z" />
          <path className="line" d="M0 145 C55 130 70 150 120 112 S185 118 225 80 S300 100 345 54 S420 78 500 22" />
        </svg>
      </div>
      <div className="chart-foot"><span>资金规模趋势</span><b>及时续签率 +80%</b></div>
    </div>
    {controls}
    </div>
  );
}

function ProjectBrowser({ orderedProjects }: { orderedProjects: Project[] }) {
  const [activeId, setActiveId] = useState(orderedProjects[0].id);
  useEffect(() => setActiveId(orderedProjects[0].id), [orderedProjects]);
  const active = orderedProjects.find((project) => project.id === activeId) ?? orderedProjects[0];

  return (
    <div className="project-browser">
      {orderedProjects.length > 1 && (
        <div className="project-tabs" role="tablist" aria-label="选择项目">
          {orderedProjects.map((project) => (
            <button
              type="button"
              role="tab"
              aria-selected={active.id === project.id}
              className={active.id === project.id ? "active" : ""}
              onClick={() => setActiveId(project.id)}
              key={project.id}
            >
              <span>{project.index}</span>{project.title}
            </button>
          ))}
        </div>
      )}

      <article className="case-study" key={active.id}>
        <div className="case-copy">
          <div className="case-label"><Icon name="spark" /> SELECTED CASE</div>
          <h2>{active.title}</h2>
          <p className="case-subtitle">{active.subtitle}</p>
          <div className="case-metrics">
            {active.metrics.slice(0, 3).map((metric) => (
              <div key={metric.label}><b>{metric.value}</b><span>{metric.label}</span></div>
            ))}
          </div>
          <div className="case-journey">
            <div><span>01</span><section><b>业务问题</b><p>{active.problem}</p></section></div>
            <div><span>02</span><section><b>我的动作</b><p>{active.actions.join(" ")}</p></section></div>
            <div className="outcome"><span>03</span><section><b>最终结果</b><p>{active.result}</p></section></div>
          </div>
        </div>
        <div className="case-demo">
          <ProjectVisual type={active.visual} />
          <div className="demo-caption">
            <span>业务流程演示</span>
            <p>用动画还原任务如何完成，不展示真实系统与内部数据。</p>
          </div>
        </div>
      </article>
    </div>
  );
}

function SecondaryProjectCard({ project }: { project: Project }) {
  return (
    <article className="secondary-project">
      <div className={`secondary-visual ${project.visual}`}>
        <ProjectVisual type={project.visual} />
      </div>
      <div className="secondary-copy">
        <span>{project.index} · {project.tags.slice(0, 2).join(" / ")}</span>
        <h3>{project.title}</h3>
        <p>{project.problem}</p>
        <div className="secondary-result"><small>RESULT</small><b>{project.result}</b></div>
      </div>
    </article>
  );
}

export default function App() {
  const [copied, setCopied] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const profile = views.digital;
  const orderedProjects = useMemo(
    () => profile.projectOrder.map((id) => projects.find((project) => project.id === id)!),
    [profile],
  );
  const orderedCapabilities = useMemo(
    () => profile.capabilityOrder.map((title) => capabilities.find((item) => item.title === title)!),
    [profile],
  );

  useEffect(() => {
    document.title = "吴政达｜业务数字化作品集";
  }, []);

  useEffect(() => {
    if (!contactOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContactOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [contactOpen]);

  async function copyEmail() {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = EMAIL;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand("copy");
    temporaryInput.remove();
    try {
      await navigator.clipboard?.writeText(EMAIL);
    } catch {
      // The synchronous fallback above covers restricted in-app browsers.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="app-shell">
      <header className="floating-nav">
        <a className="identity" href="#top" aria-label="返回首页">
          <img src="/portrait.png" alt="" />
          <span><b>吴政达</b><small>{profile.role}</small></span>
        </a>
        <nav aria-label="页面导航">
          <a href="#work">案例</a>
          <a href="#lab">体验</a>
          <a href="#proof">证据</a>
          <a href="#about">关于</a>
        </nav>
        <button className="nav-action" type="button" onClick={() => setContactOpen(true)}>
          联系 <Icon name="arrow" />
        </button>
      </header>

      <main>
        <section className="workspace" id="top">
          <div className="ambient ambient-a" />
          <div className="ambient ambient-b" />
          <div className="workspace-inner">
            <div className="intro">
              <p>你好，我是吴政达。</p>
              <h1>{profile.title}</h1>
              <p className="intro-summary">{profile.summary}</p>
              <div className="intro-actions">
                <a className="ios-button primary" href="#work">浏览我的工作 <Icon name="arrow" /></a>
                <a className="ios-button ghost" href="#lab">查看互动演示 <Icon name="arrow" /></a>
                <a className="ios-button ghost" href="/resume.pdf" download><Icon name="download" /> PDF 简历</a>
              </div>
            </div>

            <div className="bento-grid">
              <article className="bento-card focus-card">
                <div className="card-top"><span className="app-icon blue"><Icon name="spark" /></span><small>当前关注</small></div>
                <h2>{profile.focusTitle}</h2>
                <p>{profile.focusText}</p>
                <div className="skill-pills">{profile.strengths.map((item) => <span key={item}>{item}</span>)}</div>
              </article>

              <article className="bento-card impact-card">
                <div className="card-top"><span className="app-icon green">↗</span><small>工作影响</small></div>
                <div className="impact-list">
                  {profile.highlights.map((item) => <div key={item.label}><b>{item.value}<em>{item.suffix}</em></b><span>{item.label}</span></div>)}
                </div>
              </article>

              <article className="bento-card preview-card">
                <div className="card-top"><span className="app-icon violet">AI</span><small>最近项目</small></div>
                <div className="preview-copy"><h3>{orderedProjects[0].title}</h3><p>{orderedProjects[0].subtitle}</p></div>
                <div className="preview-orb"><i /><i /><i /></div>
                <a href="#work">打开案例 <Icon name="arrow" /></a>
              </article>

              <article className="bento-card quote-card">
                <div className="quote-mark">“</div>
                <p>{orderedProjects[0].reflection}</p>
                <span>我的项目方法</span>
              </article>
            </div>
          </div>
        </section>

        <section className="work-section" id="work">
          <div className="section-title">
            <span>FLAGSHIP PROJECT</span>
            <h2>先看最能代表我的项目。</h2>
            <p>审批链智能体把业务经验、数据治理、AI 应用和持续运营连成了完整闭环。</p>
          </div>
          <ProjectBrowser orderedProjects={[orderedProjects[0]]} />
        </section>

        <section className="more-work-section">
          <div className="section-title compact">
            <span>MORE WORK</span>
            <h2>另外两个问题，我这样解决。</h2>
            <p>主案例讲方法，次案例证明同一套能力可以迁移到工具自动化与数据决策。</p>
          </div>
          <div className="secondary-grid">
            {orderedProjects.slice(1).map((project) => <SecondaryProjectCard project={project} key={project.id} />)}
          </div>
        </section>

        <CapabilityLab />

        <section className="proof-section" id="proof">
          <div className="section-title compact">
            <span>OUTCOME PROOF</span>
            <h2>结果，也被团队看见。</h2>
            <p>前面的案例记录项目过程，这里保留两项来自团队的真实反馈，作为成果落地后的补充佐证。</p>
          </div>
          <div className="recognition-grid">
            <article className="recognition-card landscape">
              <div className="recognition-image">
                <img src="/evidence/digital-brainstorm-award.jpg" alt="财服数字化头脑风暴活动一等奖荣誉证书，激励金额已遮挡" loading="lazy" />
                <span>企业内部活动 · 金额已脱敏</span>
              </div>
              <div className="recognition-copy">
                <small>01 · 方案认可</small>
                <h3>财服数字化头脑风暴活动 团队一等奖</h3>
                <p>结合早期AI实操应用趋势，针对内部系统分散、跨页面操作与数据汇总工作量大的痛点，提出智能化协同优化构想。</p>
                <div><b>对应能力</b><span>业务痛点梳理、行业趋势研判，以及结合实际场景设计数字化优化方案的能力。</span></div>
              </div>
            </article>
            <article className="recognition-card portrait">
              <div className="recognition-image">
                <img src="/evidence/digital-builder-award-blurred.jpg" alt="2025年度数字化筑梦师企业内部荣誉奖杯，企业标识已适度虚化" loading="lazy" />
                <span>2025 年度内部荣誉</span>
              </div>
              <div className="recognition-copy">
                <small>02 · 持续贡献</small>
                <h3>2025 年度“数字化筑梦师”</h3>
                <p>年度荣誉对应持续推动智能体、自动化工具和数据看板进入实际工作流程。</p>
                <div><b>对应能力</b><span>持续推进项目、收集使用反馈，并根据实际问题完成迭代。</span></div>
              </div>
            </article>
          </div>
          <div className="proof-note"><b>公开说明</b><p>以上均为企业内部认可，不作为外部职业资格或行业奖项使用。激励金额已遮挡，企业标识已适度虚化。</p></div>
        </section>

        <section className="about-section" id="about">
          <div className="about-lead">
            <span>BACKGROUND</span>
            <h2>我如何走到这里</h2>
            <p>业务现场提供问题，统计学提供方法，数字工具把方法变成可复用的解决方案。</p>
          </div>
          <div className="background-grid">
            {experiences.map((item, index) => (
              <article className={index === 0 ? "career-card" : "education-card"} key={item.organization}>
                <div className="background-card-head"><small>{item.type}</small><time>{item.period}</time></div>
                <h3>{item.organization}</h3>
                <b>{item.role}</b>
                <p>{item.summary}</p>
                {index === 0
                  ? <div className="career-facts"><span><strong>145</strong>公司主体</span><span><strong>500+</strong>账户业务</span><span><strong>3</strong>数字化项目</span></div>
                  : <div className="education-tags"><span>统计学</span><span>计量经济学</span><span>金融学</span><span>数据分析</span></div>}
              </article>
            ))}
          </div>
          <div className="capability-strip">
            {orderedCapabilities.map((capability) => (
              <article key={capability.title}><small>{capability.level}</small><h3>{capability.title}</h3><p>{capability.items.join(" · ")}</p></article>
            ))}
          </div>
          <div className="certificate-row"><span>公开认证</span>{certificates.map((item) => <b key={item}>{item}</b>)}</div>
        </section>

        <section className="contact-card">
          <div><span>LET'S TALK</span><h2>期待与您进一步交流岗位机会。</h2></div>
          <div className="contact-buttons">
            <a className="ios-button white" href={`mailto:${EMAIL}`}><Icon name="mail" /> 发送邮件</a>
            <button className="ios-button translucent" type="button" onClick={copyEmail}>{copied ? "已复制" : "复制邮箱"}</button>
          </div>
        </section>
      </main>

      <footer><span>© 2026 吴政达</span><span>公开版本不包含客户、账户及内部审批信息</span></footer>

      {contactOpen && (
        <div className="contact-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setContactOpen(false); }}>
          <div className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-title">
            <button className="dialog-close" type="button" aria-label="关闭联系窗口" onClick={() => setContactOpen(false)}>×</button>
            <small>CONTACT</small>
            <h2 id="contact-title">聊聊岗位或业务问题</h2>
            <p>这是我的公开联系邮箱。页面不会自动发送任何内容，你可以复制后在招聘平台或常用邮箱中联系我。</p>
            <div className="email-display"><span>邮箱</span><b>{EMAIL}</b></div>
            <div className="contact-dialog-actions">
              <button type="button" onClick={copyEmail}>{copied ? "已复制 ✓" : "复制邮箱"}</button>
              <a href={`mailto:${EMAIL}`}>打开邮件应用</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
