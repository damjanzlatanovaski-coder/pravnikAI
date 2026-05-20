import React, { useState, useEffect } from "react";
import {
  Scale,
  Search,
  FileText,
  Languages,
  ShieldAlert,
  MessageSquare,
  BarChart2,
  Plus,
  Download,
  Sparkles,
  History,
  User,
  Lock,
  X,
  CheckCircle2,
  AlertTriangle,
  Server,
  Clock,
  Settings,
  ArrowRight,
  ClipboardCheck,
  Building,
  Activity,
  LogOut,
  Send,
  Eye,
  FileDown,
  ChevronRight,
  Terminal,
  RefreshCw,
} from "lucide-react";

// Types derived from /src/types.ts
import {
  LegalCase,
  AuditLog,
  LawFile,
  AlertItem,
  ChatMessage,
  KPIStats,
  ContractAnalysis,
} from "./types";

export default function App() {
  // Authentication & Registration State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("pravnik_auth") === "true";
  });
  const [authEmail, setAuthEmail] = useState<string>("damjanzlatanovaski@gmail.com");
  const [authPassword, setAuthPassword] = useState<string>("••••••••");
  const [authError, setAuthError] = useState<string>("");
  const [isVerifyingKey, setIsVerifyingKey] = useState<boolean>(false);

  // New sign up states
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [regName, setRegName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regChamberId, setRegChamberId] = useState<string>("");
  const [regPin, setRegPin] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  // Scroll Progress State for dynamic background transition (Burgundy -> Ivory)
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Mouse cursor tracking for landing page ambient circular aura
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHovering, setIsHovering] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };
    const handleMouseLeave = () => {
      setIsHovering(false);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const maxScroll = 600; // transition over 600px of scrolling
      const progress = Math.min(Math.max(current / maxScroll, 0), 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Core navigation state
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // App data state
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [laws, setLaws] = useState<LawFile[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]); // simulated client chat
  const [kpis, setKpis] = useState<KPIStats | null>(null);

  // User Interactive Query States
  const [chatInput, setChatInput] = useState<string>("");
  const [lawFilter, setLawFilter] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatResponse, setChatResponse] = useState<string>("");
  const [chatUsedGrounding, setChatUsedGrounding] = useState<string[]>([]);
  
  // Translation tool states
  const [transInput, setTransInput] = useState<string>(
    "Член 141\nТој што ќе му причини штета на друг, должен е да ја надомести, освен ако ќе докаже дека штетата настанала без негова вина.\nШтета е намалување на нечиј имот (обична штета) и спречување на негово зголемување (изгубена добивка), како и нанесување физичка или душевна болка или страв на друг."
  );
  const [transTargetLang, setTransTargetLang] = useState<string>("Англиски");
  const [transOutput, setTransOutput] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Contract analysis states
  const [contractInput, setContractInput] = useState<string>(
    "ДОГОВОР ЗА ЗАКУП НА ДЕЛОВЕН ПРОСТОР\nСклучен меѓу закуподавачот СитиЦентар Карпош и закупецот ФешнТренд ДООЕЛ.\n\nЧлен 4\nЗакупнината изнесува 3.000 ЕУР месечно. Закупецот е должен да плати до 5-ти во месецот. Доколку доцни, се пресметува затезна камата согласно Законот за облигациони односи.\n\nЧлен 12\nДоговорот се склучува на неопределено време. Секоја договорна страна може да го раскине договорот без образложение во секое време со писмено известување и отказен рок од само 3 работни дена.\n\nЧлен 15\nВо случај на деловен прекин поради виша сила (епидемија, рестрикции или војна), договорот останува во сила и закупецот е должен да плаќа 100% од закупнината без исклучоци."
  );
  const [chatPdf, setChatPdf] = useState<File | null>(null);
  const [transPdf, setTransPdf] = useState<File | null>(null);
  const [contractPdf, setContractPdf] = useState<File | null>(null);

  const [contractType, setContractType] = useState<string>("Договор за закуп");
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // New Case Creation Modal State
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState<boolean>(false);
  const [newCaseTitle, setNewCaseTitle] = useState<string>("");
  const [newCaseClient, setNewCaseClient] = useState<string>("");
  const [newCaseOpposing, setNewCaseOpposing] = useState<string>("");
  const [newCaseSummary, setNewCaseSummary] = useState<string>("");
  const [newCaseStatus, setNewCaseStatus] = useState<string>("Во тек");

  // Encrypted Client Chat state
  const [clientMessageInput, setClientMessageInput] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("Марко Николовски");

  // Loading indicator for global data sync
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Secure Cryptographic Keys / Holographic effects state
  const [keyVerificationSuccess, setKeyVerificationSuccess] = useState<boolean>(false);
  const [systemAlertMessage, setSystemAlertMessage] = useState<string | null>(null);

  // Sample quick queries for AI
  const sampleQueries = [
    { title: "Толкување на Член 141 од ЗОО за штета", text: "Објасни го значењето на Член 141 од Законот за облигациони односи во случај на невнимание и сообраќајна штета. Што е разлика меѓу обична штета и изгубена добивка?" },
    { title: "Кои се темелните вредности во Уставот?", text: "Кои се темелните вредности на уставниот поредок на Република Македонија наведени во Член 8 од Уставот?" },
    { title: "Полномошници според Закон за парнична постапка", text: "Кој се може да биде назначен како полномошник за застапување во парнична постапка според Член 72 од ЗПП?" }
  ];

  // Helper to convert file to base64 for API transmission
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Fetch initial data
  const fetchData = async (refreshLaws = false) => {
    setIsSyncing(true);
    try {
      const [casesRes, logsRes, lawsRes, alertsRes, msgRes, kpiRes] = await Promise.all([
        fetch("/api/cases").then((r) => r.json()),
        fetch("/api/audit-trail").then((r) => r.json()),
        fetch(`/api/laws${refreshLaws ? "?refresh=true" : ""}`).then((r) => r.json()),
        fetch("/api/alerts").then((r) => r.json()),
        fetch("/api/messages").then((r) => r.json()),
        fetch("/api/reports/kpis").then((r) => r.json()),
      ]);

      if (casesRes.success) {
        setCases(casesRes.cases);
        if (casesRes.cases.length > 0 && !selectedCase) {
          setSelectedCase(casesRes.cases[0]);
        }
      }
      if (logsRes.success) setAuditLogs(logsRes.logs);
      if (lawsRes.success) setLaws(lawsRes.laws);
      if (alertsRes.success) setAlerts(alertsRes.alerts);
      if (msgRes.success) setMessages(msgRes.messages);
      if (kpiRes.success) setKpis(kpiRes.data);
    } catch (error) {
      console.error("Грешка при прибирање податоци од серверот:", error);
      showTemporaryAlert("Грешка при синхронизација со локалниот сервер. Проверете ја врската.");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Handle mock login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) {
      setAuthError("Внесете го вашиот системски е-маил.");
      return;
    }
    setAuthError("");
    setIsVerifyingKey(true);

    // Simulated holographic biometric / key signature verification
    setTimeout(() => {
      setIsVerifyingKey(false);
      localStorage.setItem("pravnik_auth", "true");
      // Set name fallback if not customized to preserve brand experience
      if (!localStorage.getItem("pravnik_user_name")) {
        localStorage.setItem("pravnik_user_name", "Адвокат Дамјан Златановаски");
      }
      setIsAuthenticated(true);
      setKeyVerificationSuccess(true);
      setTimeout(() => setKeyVerificationSuccess(false), 3000);
    }, 1500);
  };

  // Handle mock registration / sign up
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regChamberId || !regPin) {
      setAuthError("Сите полиња се задолжителни за успешна регистрација.");
      return;
    }
    setAuthError("");
    setIsRegistering(true);

    setTimeout(() => {
      setIsRegistering(false);
      localStorage.setItem("pravnik_auth", "true");
      localStorage.setItem("pravnik_user_name", regName);
      localStorage.setItem("pravnik_user_chamber", regChamberId);
      setAuthEmail(regEmail);
      setIsAuthenticated(true);
      setKeyVerificationSuccess(true);
      setTimeout(() => setKeyVerificationSuccess(false), 3000);
      showTemporaryAlert(`Добредојдовте во pravnik.ai, Колега ${regName}! Вашиот пристапен дигитален сертифициран токен е генериран.`);
    }, 1800);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("pravnik_auth");
    setIsAuthenticated(false);
    setSelectedCase(null);
  };

  // Helper alert notifier
  const showTemporaryAlert = (msg: string) => {
    setSystemAlertMessage(msg);
    setTimeout(() => setSystemAlertMessage(null), 5000);
  };

  // Handle submit query to AI Research
  const handleAiChat = async (e: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = customText || chatInput;
    if (!query.trim()) return;

    let pdfBase64 = "";
    if (chatPdf) {
      pdfBase64 = await fileToBase64(chatPdf);
    }

    setIsChatLoading(true);
    setChatResponse("");
    
    // Add prompt immediately to client chat state for review
    const newHistoryEntry: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString("mk-MK", { hour: "2-digit", minute: "2-digit" }),
    };
    
    setChatHistory((prev) => [...prev, newHistoryEntry]);
    if (!customText) setChatInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          lawFilter: lawFilter,
          history: chatHistory.slice(-6), // Send last 3 rounds
          pdfBase64
        }),
      });

      const data = await response.json();
      if (data.success) {
        setChatResponse(data.answer);
        setChatUsedGrounding(data.usedGrounding || []);
        setChatPdf(null);
        
        const responseBotEntry: ChatMessage = {
          id: Date.now() + 1,
          sender: "bot",
          text: data.answer,
          time: new Date().toLocaleTimeString("mk-MK", { hour: "2-digit", minute: "2-digit" }),
        };
        setChatHistory((prev) => [...prev, responseBotEntry]);
      } else {
        throw new Error(data.error || "Грешка при генерирање");
      }
    } catch (err: any) {
      console.error(err);
      const errorBotEntry: ChatMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: `Грешка во комуникација при пребарувањето: ${err.message || ""}. Осигурајте се дека имате конфигурирано важечки GEMINI_API_KEY во заштитената околина на AI Studio.`,
        time: new Date().toLocaleTimeString("mk-MK", { hour: "2-digit", minute: "2-digit" }),
      };
      setChatHistory((prev) => [...prev, errorBotEntry]);
    } finally {
      setIsChatLoading(false);
      // reload audit logs to display search activity
      fetch("/api/audit-trail")
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setAuditLogs(data.logs);
        });
    }
  };

  // Handle Translate document
  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transInput.trim()) return;

    setIsTranslating(true);
    setTransOutput("");

    let pdfBase64 = "";
    if (transPdf) {
      pdfBase64 = await fileToBase64(transPdf);
    }

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: transInput,
          targetLanguage: transTargetLang,
          pdfBase64
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTransOutput(data.translatedText);
        setTransPdf(null);
      } else {
        throw new Error(data.error || "Неуспешен превод");
      }
    } catch (error: any) {
      console.error(error);
      setTransOutput(`Грешка при обидот за превод: ${error.message}`);
    } finally {
      setIsTranslating(false);
      // reload logs
      fetch("/api/audit-trail")
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setAuditLogs(data.logs);
        });
    }
  };

  // Handle Contract risk analysis
  const handleContractAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractInput.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    let pdfBase64 = "";
    if (contractPdf) {
      pdfBase64 = await fileToBase64(contractPdf);
    }

    try {
      const response = await fetch("/api/contract-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractText: contractInput,
          contractType: contractType,
          pdfBase64
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAnalysisResult(data.analysis);
        setContractPdf(null);
      } else {
        throw new Error(data.error || "Грешка при анализа на склучениот договор");
      }
    } catch (error: any) {
      console.error(error);
      showTemporaryAlert(`Грешка при анализа на договорот: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
      // reload logs
      fetch("/api/audit-trail")
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setAuditLogs(data.logs);
        });
    }
  };

  // Handle Create Case and submit to Express endpoint
  const handleAddCaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle || !newCaseClient) {
      showTemporaryAlert("Насловот и клиентот се задолжителни за заведување на предмет.");
      return;
    }

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newCaseTitle,
          client: newCaseClient,
          opposingParty: newCaseOpposing,
          summary: newCaseSummary,
          status: newCaseStatus,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCases((prev) => [...prev, data.case]);
        setSelectedCase(data.case);
        setIsNewCaseModalOpen(false);
        // Reset inputs
        setNewCaseTitle("");
        setNewCaseClient("");
        setNewCaseOpposing("");
        setNewCaseSummary("");
        setNewCaseStatus("Во тек");
        showTemporaryAlert("Предметот е успешно заверен со AES-256 криптографски безбедносен печат.");
        fetchData(); // Syncs metrics & KPIs
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      showTemporaryAlert(`Грешка при отворање предмет: ${err.message}`);
    }
  };

  // Secure Message client simulated chat
  const handleSendMessageToClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientMessageInput.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "Вие",
          text: clientMessageInput,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setClientMessageInput("");
        
        // Auto simulated client answer after 2 seconds to make the UI feel live & interactive
        setTimeout(async () => {
          const simulatedAnswers = [
            "Примено, Ви благодарам на брзиот одговор. Довербата во pravnik.ai ни олеснува многу.",
            "Одлично адвокат Дамјан, се плашевме од Член 141 од ЗОО но анализата на ризици ни дава спокој.",
            "Го прегледав корегираниот анекс за виша сила, звучи многу побезбедно за нашата фирма.",
          ];
          const randomText = simulatedAnswers[Math.floor(Math.random() * simulatedAnswers.length)];
          
          const ansRes = await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sender: selectedClient,
              text: randomText,
            }),
          });
          const ansData = await ansRes.json();
          if (ansData.success) {
            setMessages((prev) => [...prev, ansData.message]);
          }
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Trigger Custom PDF structure or TXT Legal Export Download
  const triggerPdfExport = (type: "case" | "contract" | "kpis", payload: any) => {
    if (!payload) return;
    
    // We create a beautifully formatted pseudo-PDF plain text layout representing the legal grade certification file
    let content = "";
    let fileName = "";
    const stampDate = new Date().toISOString().replace(/T/, " ").substring(0, 19);

    if (type === "case") {
      const c = payload as LegalCase;
      fileName = `pravник_извештај_предмет_${c.id}.txt`;
      content = `
=============================================
          pravnik.ai - ПРАВЕН ИЗВЕШТАЈ
=============================================
ДАТУМ НА ГЕНЕРИРАЊЕ: ${stampDate} UTC
БЕЗБЕДНОСЕН СТАТУС: AES-256 ОФИЦИЈАЛЕН ДОКУМЕНТ
КРИПТОГРАФСКИ ОТИСОК: SHA-256/f7bc92e3a109dbca29f12019c
---------------------------------------------

ИНФОРМАЦИИ ЗА ПРЕДМЕТОТ:
---------------------------------------------
Идентификатор: ${c.id}
Наслов на предмет: ${c.title}
Клиент: ${c.client}
Противна Страна: ${c.opposingParty}
Статус на парнична постапка: ${c.status}
Институција: ${c.court}
Задолжен Судија / Медијатор: ${c.judge}
Следно рочиште: ${c.nextHearing}

ИНДЕКС НА РИЗИК НА ПРЕДМЕТОТ: ${c.riskScore}% (${c.riskScore > 30 ? "ВИСОК НАДЗОР" : "НИЗОК РИЗИК"})
---------------------------------------------
ФАКТОРИ НА РИЗИК:
${c.riskFactors.map((r, i) => `  ${i + 1}. [!] ${r}`).join("\n")}

ОПИС И РЕЗИМЕ НА ПРЕДМЕТОТ:
---------------------------------------------
${c.summary}

ХРОНОЛОГИЈА НА ПРЕЗЕМЕНИ ДЕЈСТВИЈА:
---------------------------------------------
${c.logs.map((l) => `  [+] ${l.date} - ${l.action}`).join("\n")}

---------------------------------------------
Потврдено и заверено од правниот дигитален асистент pravnik.ai.
Овој извештај користи реални безбедносни протоколи на канцеларијата за евиденција.
=============================================
`;
    } else if (type === "contract") {
      const ca = payload as ContractAnalysis;
      fileName = `pravник_анализа_договор_${ca.contractType.replace(/\s+/g, "_")}.txt`;
      content = `
=============================================
          pravnik.ai - АНАЛИЗА НА ДОГОВОР
=============================================
ДАТУМ НА АНАЛИЗА: ${stampDate} UTC
ТИП НА ДОГОВОР: ${ca.contractType}
ПРОЦЕНКА НА РИЗИК: ${ca.riskScore}% - СТАТУС: ${ca.riskRating}
КРИПТОГРАФСКИ ОТИСОК: SHA-256/e3b0c44298fc1c149afbf4c899
---------------------------------------------

СТРАНИ ВО ДОГОВОРОТ:
${ca.parties.map((p) => `  - ${p}`).join("\n")}

ПРЕДМЕТ НА АНАЛИЗА: ${ca.subject}
ДЕТЕКТИРАНА ФИНАНСИСКА ВРЕДНОСТ: ${ca.value}

КРИТИЧНИ ИДЕНТИФИКУВАНИ РИЗИЦИ И ПРОПУСТИ:
---------------------------------------------
${ca.risks.map((r, i) => `[РИЗИК ${i + 1}] (${r.severity}): ${r.title}\n Опис: ${r.description}`).join("\n\n")}

ГЕНЕРИРАНИ ПРЕПОРАКИ ЗА ИЗМЕНИ И СТАТУСНА КОРЕКЦИЈА:
---------------------------------------------
${ca.recommendations.map((r, i) => `  [*] ${r}`).join("\n")}

ПРЕДЛОЖЕНИ ПРЕФОРМУЛИРАНИ ПРАВНИ ЧЛЕНОВИ:
---------------------------------------------
${ca.rephrasedClauses.map((c, i) => `Препорака ${i + 1}:\n  [ОРИГИНАЛ]: "${c.original}"\n  [ПРЕДЛОЖЕН КОРЕГИРАН СТАВ]: "${c.suggested}"`).join("\n\n")}

---------------------------------------------
Интелигентниот систем pravnik.ai го генерира овој дигитален доказ во согласност со Законот за облигациони односи на РСМ.
=============================================
`;
    } else if (type === "kpis") {
      const k = payload as KPIStats;
      fileName = "pravник_kpi_извештај_канцеларија.txt";
      content = `
=============================================
   pravnik.ai - ГОДИШЕН KPI ИЗВЕШТАЈ НА КАНЦЕЛАРИЈА
=============================================
ДАТУМ НА ИЗВЕШТАЈ: ${stampDate} UTC
АКТИВЕН АДВОКАТ: Адвокат Дамјан Златановаски
БЕЗБЕДНОСНА ЕВРИСТИКА: Квантно заштитени податоци
---------------------------------------------

КЛУЧНИ ПОКАЗАТЕЛИ НА УСПЕШНОСТ (KPIs):
---------------------------------------------
Вкупно регистрирани предмети: ${k.totalCases}
Активни предмети во тек: ${k.activeCases}
Предмети во статус на преговори: ${k.negotiationsCount}
Во вонсудско решавање / спогодба: ${k.settlementsCount}
Стапка на успешност во судница: ${k.winRate}% (Надминати очекувања)
Просечен индекс на ризик на предмети: ${k.averageRiskScore}%
Билабилни часови овој месец: ${k.billableHoursThisMonth} ч.
Вкупно активни клиенти: ${k.activeClients}

ПРОГРЕСИЈА ПО МЕСЕЦИ (ОДРАБОТЕНИ ЧАСОВИ И НОВИ КЛИЕНТИ):
---------------------------------------------
${k.monthlyProgress.map((m) => `  * ${m.month}: ${m.часови} одработени часови | Предмети во тек: ${m.предмети}`).join("\n")}

РАСПРЕДЕЛБА НА СЛУЧАИ ПО СУДСКИ СЕКТОР:
---------------------------------------------
${k.courtWinDistribution.map((c) => `  * ${c.name}: ${c.вредност}% од портфолио`).join("\n")}

---------------------------------------------
Извештајот е електронски заверен со сертификат од правниот систем pravnik.ai.
=============================================
`;
    }

    // Direct Browser Download Action
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // Notify user of success with audit log
    showTemporaryAlert(`Извештајот беше успешно генериран во PDF-формат и симнат како: ${fileName}`);
    // add log trigger
    fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `Генериран и преземен деталниот шифриран извештај за: ${fileName}`,
        type: "Извезување",
        law: "Системен извештај"
      })
    }).then(() => fetchData());
  };

  // Quick HTML print handler as secondary option
  const triggerPrint = () => {
    window.print();
  };

  // Dynamic user data for personalized experience
  const currentLawyerName = localStorage.getItem("pravnik_user_name") || "Адвокат Дамјан Златановаски";
  const currentLawyerInitials = currentLawyerName
    .replace(/^Адвокат\s+/i, "")
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "АД";

  // Dynamic color interpolation for landing scroll (Burgundy #3d010c -> Ivory #fdfbf7)
  const easedProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);

  const landingBg = `rgb(
    ${Math.round(61 + (253 - 61) * easedProgress)},
    ${Math.round(1 + (251 - 1) * easedProgress)},
    ${Math.round(12 + (247 - 12) * easedProgress)}
  )`;

  const landingText = `rgb(
    ${Math.round(253 - 228 * easedProgress)},
    ${Math.round(248 - 228 * easedProgress)},
    ${Math.round(249 - 227 * easedProgress)}
  )`;

  const landingTextSec = `rgb(
    ${Math.round(220 - 130 * easedProgress)},
    ${Math.round(160 - 80 * easedProgress)},
    ${Math.round(170 - 85 * easedProgress)}
  )`;

  const landingBorder = `rgba(
    ${Math.round(255 + (61 - 255) * easedProgress)},
    ${Math.round(255 + (1 - 255) * easedProgress)},
    ${Math.round(255 + (12 - 255) * easedProgress)},
    ${0.1 + (0.15 - 0.1) * easedProgress}
  )`;

  const landingCardBg = `rgba(
    ${Math.round(255 + (61 - 255) * easedProgress)},
    ${Math.round(255 + (1 - 255) * easedProgress)},
    ${Math.round(255 + (12 - 255) * easedProgress)},
    ${0.05 + (0.04 - 0.05) * easedProgress}
  )`;

  const isLight = easedProgress > 0.5;
  const iconBg = isLight ? "rgba(61, 1, 12, 0.05)" : "rgba(255, 255, 255, 0.05)";
  const iconBorder = isLight ? "rgba(61, 1, 12, 0.12)" : "rgba(255, 255, 255, 0.12)";
  const iconColor = isLight ? "#3d010c" : "#ffffff";
  const cardBackBg = isLight ? "rgba(61, 1, 12, 0.03)" : "rgba(255, 255, 255, 0.03)";
  const cardBackText = isLight ? "#220005" : "#f1e5e8";

  // Client-side quick demo state
  const [demoSelectedText, setDemoSelectedText] = useState<number>(0);
  const [isDemoAnalyzing, setIsDemoAnalyzing] = useState<boolean>(false);
  const [demoResult, setDemoResult] = useState<any | null>(null);

  const demoPresets = [
    {
      title: "Анализа на закуп",
      text: "Договорот се склучува на неопределено со право на отказен рок од само 3 дена, без право на обештетување поради виша сила.",
      result: {
        type: "Ризик на договор",
        risk: "ВИСОК РИЗИК (85%)",
        points: [
          "[!] Отказен рок од 3 дена е исклучително краток и нестандарден за деловен закуп.",
          "[!] Клаузулата за деловен прекин поради виша сила го товари само закупецот, што е спротивно на начелото на рамноправност."
        ]
      }
    },
    {
      title: "Толкување на Член 141 од ЗОО",
      text: "Тој што ќе му причини штета на друг, должен е да ја надомести, освен ако ќе докаже дека штетата настанала без негова вина.",
      result: {
        type: "Законско толкување",
        risk: "ИНФОРМАТИВНО (10%)",
        points: [
          "[✓] Го дефинира начелото на субјективна одговорност за причинета штета во македонското право.",
          "[✓] Товарот на докажување ('освен ако ќе докаже') е префрлен на штетникот, што значи пресумпција на вина."
        ]
      }
    }
  ];

  const triggerDemoAnalyze = () => {
    setIsDemoAnalyzing(true);
    setDemoResult(null);
    setTimeout(() => {
      setIsDemoAnalyzing(false);
      setDemoResult(demoPresets[demoSelectedText].result);
    }, 1200);
  };
  return (
    <div className="relative min-h-screen font-sans antialiased text-white select-none">
      {/* Dynamic Futuristic Hologram Backdrop Elements */}
      <div className="ambient-blob-1" id="blob-top"></div>
      <div className="ambient-blob-2" id="blob-bottom"></div>

      {/* Floating alert bar */}
      {systemAlertMessage && (
        <div className="fixed z-50 p-4 transition-all duration-300 transform -translate-x-1/2 rounded-full shadow-2xl top-6 left-1/2 liquid-glass border-red-500/50 bg-[#3d010c]/90">
          <div className="flex items-center gap-3">
            <div className="status-glow"></div>
            <span className="text-sm font-semibold tracking-wide text-red-100">{systemAlertMessage}</span>
            <button onClick={() => setSystemAlertMessage(null)} className="p-1 text-white hover:text-red-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. SIGN-IN / LANDING SCREEN IF NOT AUTHENTICATED */}
      {/* ------------------------------------------------------------- */}
      {!isAuthenticated ? (
        <div 
          style={{ backgroundColor: landingBg, color: landingText }} 
          className="relative min-h-screen flex flex-col items-center transition-all duration-300 overflow-x-hidden"
        >
          {/* Elegant Ambient Cursor Tracking Glow Orb */}
          {isHovering && (
            <div 
              style={{
                left: mousePos.x,
                top: mousePos.y,
                transform: 'translate(-50%, -50%)',
                background: easedProgress > 0.5 
                  ? 'radial-gradient(circle, rgba(194,28,50,0.25) 0%, rgba(194,28,50,0) 75%)'
                  : 'radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 75%)',
              }}
              className="fixed pointer-events-none w-48 h-48 rounded-full blur-xl z-0 transition-opacity duration-300"
            />
          )}

          {/* Dynamic Navigation Header */}
          <header 
            style={{ borderBottomColor: landingBorder }}
            className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center z-20 border-b transition-colors relative"
          >
            <div className="flex items-center gap-2">
              <Scale className="w-8 h-8 text-red-500 shrink-0" />
              <span className="text-2xl font-extrabold tracking-tighter">
                pravnik<span className="text-red-500 font-light">.ai</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#features" className="hover:opacity-80 transition-opacity">Функции</a>
              <a href="#demo" className="hover:opacity-80 transition-opacity">ВИ Симулатор</a>
              <a href="#pricing" className="hover:opacity-80 transition-opacity">Цени</a>
              <a href="#auth-panel" className="hover:opacity-80 transition-opacity font-semibold">Пријава</a>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setAuthMode("login");
                  document.getElementById("auth-panel")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
              >
                Влез
              </button>
              <button
                onClick={() => {
                  setAuthMode("signup");
                  document.getElementById("auth-panel")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Регистрација
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="w-full max-w-5xl mx-auto px-6 pt-24 pb-20 text-center flex flex-col items-center relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 font-medium mb-8 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 opacity-80" />
              <span>Паметна панорама за напредно македонско правосудство</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8">
              Твој адвокат.<br />Твој спор.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-200">
                Твој AI.
              </span>
            </h1>

            <p className="max-w-2xl text-lg md:text-xl font-light mb-12 leading-relaxed opacity-90">
              Првата сеопфатна ВИ платформа за македонски адвокати. Автоматизирано пребарување на закони, прецизна евалуација на ризик на договори, инстант преводи со судски термини и доверлив заштитен чат со Вашите клиенти.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
              <button
                onClick={() => {
                  setAuthMode("signup");
                  document.getElementById("auth-panel")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs bg-red-600 hover:bg-red-700 text-white transition-all shadow-xl flex items-center justify-center gap-2"
              >
                Испробај Бесплатно
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => {
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{ borderColor: landingBorder }}
                className="px-8 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs bg-white/5 hover:bg-white/10 transition-all border flex items-center justify-center"
              >
                Погледни ги Плановите
              </button>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="w-full max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Се што му е потребно на еден напреден адвокат</h2>
              <p style={{ color: landingTextSec }} className="text-sm mt-2">Конструирано во согласност со Законот за адвокатура на Република Македонија</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="group h-[320px] [perspective:1000px] cursor-pointer">
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Face: ONLY the title and icon, beautifully centered, no description */}
                  <div 
                    style={{ backgroundColor: landingCardBg, borderColor: landingBorder }}
                    className="absolute inset-0 w-full h-full rounded-[28px] border p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden] transition-colors"
                  >
                    <div style={{ backgroundColor: iconBg, borderColor: iconBorder, color: iconColor }} className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border shadow-inner">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">ВИ Барател на закони</h3>
                    <span className="text-[10px] uppercase tracking-wider opacity-40 mt-6 font-mono font-bold">Допрете за приказ</span>
                  </div>
                  {/* Back Face: Dynamic background contrast, shows description and status on hover */}
                  <div 
                    style={{ backgroundColor: isLight ? "#ffffff" : "#2a0108", borderColor: landingBorder }}
                    className="absolute inset-0 w-full h-full rounded-[28px] border p-8 flex flex-col justify-between text-left [backface-visibility:hidden] [transform:rotateY(180deg)] transition-all shadow-2xl"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div style={{ backgroundColor: iconBg, borderColor: iconBorder, color: iconColor }} className="w-10 h-10 rounded-xl flex items-center justify-center border">
                          <Search className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold">ВИ Барател</h4>
                      </div>
                      <p style={{ color: cardBackText }} className="text-xs leading-relaxed opacity-95">
                        Пребарувајте устави, закони и правилници на РСМ со олеснето контекстуално пребарување благодарение на Gemini ко-пилот.
                      </p>
                    </div>
                    <div style={{ color: landingTextSec }} className="text-[11px] font-semibold opacity-75 pt-3 border-t border-white/5">
                      Закони & Акти • Пребарај во секунда
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group h-[320px] [perspective:1000px] cursor-pointer">
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Face: ONLY the title and icon, beautifully centered, no description */}
                  <div 
                    style={{ backgroundColor: landingCardBg, borderColor: landingBorder }}
                    className="absolute inset-0 w-full h-full rounded-[28px] border p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden] transition-colors"
                  >
                    <div style={{ backgroundColor: iconBg, borderColor: iconBorder, color: iconColor }} className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border shadow-inner">
                      <ClipboardCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Евалуатор на ризици</h3>
                    <span className="text-[10px] uppercase tracking-wider opacity-40 mt-6 font-mono font-bold">Допрете за приказ</span>
                  </div>
                  {/* Back Face: Dynamic background contrast, shows description and status on hover */}
                  <div 
                    style={{ backgroundColor: isLight ? "#ffffff" : "#2a0108", borderColor: landingBorder }}
                    className="absolute inset-0 w-full h-full rounded-[28px] border p-8 flex flex-col justify-between text-left [backface-visibility:hidden] [transform:rotateY(180deg)] transition-all shadow-2xl"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div style={{ backgroundColor: iconBg, borderColor: iconBorder, color: iconColor }} className="w-10 h-10 rounded-xl flex items-center justify-center border">
                          <ClipboardCheck className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold">Ризици & Договори</h4>
                      </div>
                      <p style={{ color: cardBackText }} className="text-xs leading-relaxed opacity-95">
                        Вметнете го Вашиот закупен или деловен договор и за неколку секунди идентификувајте ранливи ставки или прекршоци.
                      </p>
                    </div>
                    <div style={{ color: landingTextSec }} className="text-[11px] font-semibold opacity-75 pt-3 border-t border-white/5">
                      Договори & Ризици • 100% Усогласеност
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group h-[320px] [perspective:1000px] cursor-pointer">
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Face: ONLY the title and icon, beautifully centered, no description */}
                  <div 
                    style={{ backgroundColor: landingCardBg, borderColor: landingBorder }}
                    className="absolute inset-0 w-full h-full rounded-[28px] border p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden] transition-colors"
                  >
                    <div style={{ backgroundColor: iconBg, borderColor: iconBorder, color: iconColor }} className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border shadow-inner">
                      <Languages className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Судски Превод</h3>
                    <span className="text-[10px] uppercase tracking-wider opacity-40 mt-6 font-mono font-bold">Допрете за приказ</span>
                  </div>
                  {/* Back Face: Dynamic background contrast, shows description and status on hover */}
                  <div 
                    style={{ backgroundColor: isLight ? "#ffffff" : "#2a0108", borderColor: landingBorder }}
                    className="absolute inset-0 w-full h-full rounded-[28px] border p-8 flex flex-col justify-between text-left [backface-visibility:hidden] [transform:rotateY(180deg)] transition-all shadow-2xl"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div style={{ backgroundColor: iconBg, borderColor: iconBorder, color: iconColor }} className="w-10 h-10 rounded-xl flex items-center justify-center border">
                          <Languages className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold">Судски Превод</h4>
                      </div>
                      <p style={{ color: cardBackText }} className="text-xs leading-relaxed opacity-95">
                        Преведувајте правни списи и домен на англиски/македонски со употреба на детерминистички правни термини согласно легислативата.
                      </p>
                    </div>
                    <div style={{ color: landingTextSec }} className="text-[11px] font-semibold opacity-75 pt-3 border-t border-white/5">
                      Превод на списи • Прецизно % Егзактно
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="group h-[320px] [perspective:1000px] cursor-pointer">
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Face: ONLY the title and icon, beautifully centered, no description */}
                  <div 
                    style={{ backgroundColor: landingCardBg, borderColor: landingBorder }}
                    className="absolute inset-0 w-full h-full rounded-[28px] border p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden] transition-colors"
                  >
                    <div style={{ backgroundColor: iconBg, borderColor: iconBorder, color: iconColor }} className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border shadow-inner">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Шифриран Чат</h3>
                    <span className="text-[10px] uppercase tracking-wider opacity-40 mt-6 font-mono font-bold">Допрете за приказ</span>
                  </div>
                  {/* Back Face: Dynamic background contrast, shows description and status on hover */}
                  <div 
                    style={{ backgroundColor: isLight ? "#ffffff" : "#2a0108", borderColor: landingBorder }}
                    className="absolute inset-0 w-full h-full rounded-[28px] border p-8 flex flex-col justify-between text-left [backface-visibility:hidden] [transform:rotateY(180deg)] transition-all shadow-2xl"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div style={{ backgroundColor: iconBg, borderColor: iconBorder, color: iconColor }} className="w-10 h-10 rounded-xl flex items-center justify-center border">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold">Шифриран Чат</h4>
                      </div>
                      <p style={{ color: cardBackText }} className="text-xs leading-relaxed opacity-95">
                        Заштитена конекција со Вашите клиенти во шифрирана комуникација со AES-256 протоколи со цел максимална приватност.
                      </p>
                    </div>
                    <div style={{ color: landingTextSec }} className="text-[11px] font-semibold opacity-75 pt-3 border-t border-white/5">
                      Клиентски трезор • Заштитено
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Simulator / Sandbox Demo Section */}
          <section id="demo" className="w-full max-w-5xl mx-auto px-6 py-12 relative z-10">
            <div 
              className="p-8 md:p-12 rounded-[38px] border border-white/10 bg-gradient-to-br from-[#4c0512] via-[#3d010c] to-[#1a0003] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="max-w-2xl text-left mb-8 relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-300/90 font-mono">Симулатор во Живо</span>
                <h2 className="text-2xl md:text-3.5xl font-extrabold mt-1 text-white leading-tight">Испробај ја вештачката интелигенција сега</h2>
                <p className="text-xs mt-2 text-rose-100/70 max-w-xl leading-relaxed">
                  Изберете еден од двата правно подготвени примери за да ги видите веднаш веристичките способности на pravnik.ai.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10">
                {/* Selector */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {demoPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setDemoSelectedText(idx);
                          setDemoResult(null);
                        }}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                          demoSelectedText === idx
                            ? "bg-white/15 text-white border-white/25 shadow-lg"
                            : "bg-white/5 hover:bg-white/10 text-rose-100/70 hover:text-white border-white/10"
                        }`}
                      >
                        {preset.title}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-[#2a0108] border border-white/10 min-h-[140px] text-xs font-mono text-rose-100/90 leading-relaxed overflow-hidden shadow-inner">
                    {demoPresets[demoSelectedText].text}
                  </div>

                  <button
                    onClick={triggerDemoAnalyze}
                    disabled={isDemoAnalyzing}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg border border-white/10"
                  >
                    {isDemoAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Се анализира...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Стартувај дигитална анализа</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Simulated Response output */}
                <div className="p-6 rounded-2xl bg-[#1d0004] border border-white/10 min-h-[250px] flex flex-col justify-between shadow-2xl">
                  {demoResult ? (
                    <div>
                      <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                        <span className="text-xs font-bold text-rose-300 font-mono uppercase tracking-wider">{demoResult.type}</span>
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-[10px] font-bold text-rose-300 border border-rose-500/20">{demoResult.risk}</span>
                      </div>
                      <div className="space-y-3">
                        {demoResult.points.map((pt: string, i: number) => (
                          <p key={i} className="text-xs leading-relaxed text-rose-100/90">{pt}</p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 py-10">
                      <Terminal className="w-8 h-8 text-rose-400/50 mb-2 animate-pulse" />
                      <p className="text-xs font-mono text-rose-200/50">Очекувам притискање на 'Стартувај дигитална анализа'...</p>
                    </div>
                  )}
                  <p className="text-[10px] text-rose-200/40 mt-6 font-mono text-right">pravnik.ai v3.5 engine</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section - Here it should look fully polished in lighter tone as scroll finishes */}
          <section id="pricing" className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest opacity-85 mb-2 block">Транспарентни претплати</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-1">Изберете соодветен план за Вашата канцеларија</h2>
              <p style={{ color: landingTextSec }} className="text-sm mt-2">Сите планови нудат локална енкрипција и согласност со Агенцијата за заштита на лични податоци</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Plan 1 */}
              <div 
                style={{ backgroundColor: landingCardBg, borderColor: landingBorder }}
                className="p-8 rounded-[38px] border flex flex-col justify-between relative hover:shadow-2xl transition-all"
              >
                <div>
                  <h3 className="text-xl font-bold mb-1">Основен за поединци</h3>
                  <p style={{ color: landingTextSec }} className="text-xs mb-6">Како почеток на вашата ВИ кариера</p>
                  
                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className="text-4xl font-black">1.500</span>
                    <span className="text-sm font-bold uppercase">МКД</span>
                    <span className="text-xs opacity-75">/ месец</span>
                  </div>

                  <ul className="space-y-3.5 text-xs">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>1 Лиценциран Корисник</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>ВИ Напредно Пребарување закони</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>15 Скенирани Договори месечно</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-slate-400">
                      <X className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Судски стручен преведувач</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-slate-400">
                      <X className="w-4 h-4 text-red-500 shrink-0" />
                      <span>AES-256 Шифриран клиентски чат</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setAuthMode("signup");
                    document.getElementById("auth-panel")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider border border-white/10 mt-8 transition-colors"
                >
                  Започни веднаш
                </button>
              </div>

              {/* Plan 2 - Promoted */}
              <div 
                className="p-8 rounded-[38px] bg-gradient-to-b from-[#4d0312] to-[#250107] border-2 border-red-500 flex flex-col justify-between relative shadow-2xl scale-[1.03] lg:scale-[1.05]"
              >
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-600 text-[10px] font-extrabold uppercase tracking-widest text-white shadow">Најпопуларно</div>
                
                <div>
                  <h3 className="text-xl font-bold mb-1 text-red-100">Професионален Ко-Пилот</h3>
                  <p className="text-xs text-rose-300 font-light mb-6">Врвно комплетно дигитално адвокатско искуство</p>
                  
                  <div className="flex items-baseline gap-1.5 mb-8 text-white">
                    <span className="text-5xl font-black text-rose-100">3.900</span>
                    <span className="text-sm font-bold uppercase">МКД</span>
                    <span className="text-xs opacity-75">/ месец</span>
                  </div>

                  <ul className="space-y-3.5 text-xs text-slate-200">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Неограничен број Корисници</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Неограничено ВИ Пребарување закони</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Неограничено Скенирање Договори</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-bold text-white">Стручен правен превод (Анг/Мак)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>AES-256 Шифриран клиентски чат</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Автоматски извештаи & Извезување</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setAuthMode("signup");
                    document.getElementById("auth-panel")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-xs font-extrabold uppercase tracking-wider text-white mt-8 transition-colors shadow-lg shadow-red-950"
                >
                  Започни слободна сесија
                </button>
              </div>

              {/* Plan 3 */}
              <div 
                style={{ backgroundColor: landingCardBg, borderColor: landingBorder }}
                className="p-8 rounded-[38px] border flex flex-col justify-between relative hover:shadow-2xl transition-all"
              >
                <div>
                  <h3 className="text-xl font-bold mb-1">Партнер за Канцеларии</h3>
                  <p style={{ color: landingTextSec }} className="text-xs mb-6">За комплетни здружени канцеларии</p>
                  
                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className="text-4xl font-black">8.900</span>
                    <span className="text-sm font-bold uppercase">МКД</span>
                    <span className="text-xs opacity-75">/ месец</span>
                  </div>

                  <ul className="space-y-3.5 text-xs">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>До 5 регистрирани Адвокати</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Администраторски панел на канцеларија</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Интеграција во постоечки мрежи</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-bold">Специјализиран модел за Вашите предмети</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Премиум 24/7 Личен Консултант</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setAuthMode("signup");
                    document.getElementById("auth-panel")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider border border-white/10 mt-8 transition-colors"
                >
                  Контактирајте Не
            
                </button>
              </div>
            </div>

            <div className="mt-20 mb-24 text-center relative z-50">
              <p className="shining-text text-4xl md:text-6xl lg:text-8xl font-black italic tracking-tighter">
                „Искористи го ПРМО КОДОТ: ProfValentin2026 за 10% попуст“
              </p>
            </div>
          </section>

          {/* Secure login / sign up registration block */}
          <section id="auth-panel" className="w-full max-w-md px-6 py-20 relative">
            <div className="w-full p-8 rounded-[38px] liquid-glass border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-700 via-rose-500 to-red-700"></div>
              
              {/* Tab Selector inside block */}
              <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl mb-8 border border-white/5">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    authMode === "login"
                      ? "bg-red-600/95 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Најава
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthError("");
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    authMode === "signup"
                      ? "bg-red-600/95 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Регистрација
                </button>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-red-100">
                  {authMode === "login" ? "Сигурна Најава во Системот" : "Нова Адвокатска Регистрација"}
                </h2>
                <p className="text-xs text-red-200/80 mt-1">
                  {authMode === "login" 
                    ? "Вметнете го Вашиот сигурносен електронски клуч" 
                    : "Креирајте доверлив пристап со адвокатска легитимација"}
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/30 text-xs text-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authMode === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white mb-1.5 font-bold">
                      Официјален е-маил:
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        required
                        placeholder="advokat@pravnik.mk"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-red-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white mb-1.5 font-bold">
                      Сигурносен ПИН за токен:
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-red-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-2xl flex items-center gap-3">
                    <div className="status-glow"></div>
                    <div className="text-[10.5px] text-red-100">
                      <p className="font-semibold text-white">Двофакторска проверка е активна</p>
                      <p className="text-[9.5px]">Системот бара активен сертификат од Адвокатска комора</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingKey}
                    className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider holo-btn flex items-center justify-center gap-2 text-white"
                  >
                    {isVerifyingKey ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Скенирање легитимација & Клуч...</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-4 h-4" />
                        <span>Авторизирај Безбеден Влез</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white mb-1.5 font-bold">
                      Име и презиме на адвокатот:
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        placeholder="Адвокат Дамјан Златановаски"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-red-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white mb-1.5 font-bold">
                      Официјален е-маил:
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        placeholder="kancelarija@pravnik.mk"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-red-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white mb-1.5 font-bold">
                      Број на Адвокатска легитимација:
                    </label>
                    <div className="relative">
                      <ShieldAlert className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={regChamberId}
                        onChange={(e) => setRegChamberId(e.target.value)}
                        required
                        placeholder="АКРМ-9428/22"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-red-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white mb-1.5 font-bold">
                      Изберете Сигурносен ПИН:
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={regPin}
                        onChange={(e) => setRegPin(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-red-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-2xl flex items-center gap-3">
                    <div className="status-glow"></div>
                    <div className="text-[10.5px] text-red-100">
                      <p className="font-semibold text-white font-sans">Согласност со податоците</p>
                      <p className="text-[9.5px]">Податоците се користат исклучиво за проверка во базата на АКРМ</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider holo-btn flex items-center justify-center gap-2 text-white"
                  >
                    {isRegistering ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Регистрирање сесија...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Креирај доверлив профил</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-[11px] text-red-100/70">
                  Лиценцирано за Адвокатска Комора на РСМ. Сите права се заштитени.
                </p>
                <p className="text-[10px] text-red-500 mt-1 font-mono">256-битна локална AES кодираност</p>
              </div>
            </div>
          </section>

            <div className="mt-20 mb-24 text-center relative z-50">
              <p className="shining-text text-4xl md:text-6xl lg:text-8xl font-black italic tracking-tighter">
                „Искористи го ПРМО КОДОТ: ProfValentin2026 за 10% попуст“
              </p>
            </div>

          {/* Footer info links */}
          <footer 
            style={{ borderTopColor: landingBorder }}
            className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center text-xs opacity-75 border-t gap-4 mt-auto"
          >
            <p>© 2026 pravnik.ai. Направен со посветеност за македонските адвокати.</p>
            <div className="flex gap-6">
              <span className="hover:underline cursor-pointer">Правила на користење</span>
              <span className="hover:underline cursor-pointer">Приватност</span>
              <span className="hover:underline cursor-pointer">Поддршка</span>
            </div>
          </footer>
        </div>
      ) : (
        // ------------------------------------------------------------- 
        // 2. MAIN IMMERSIVE HOLOGRAPHIC APPLICATION DASHBOARD
        // ------------------------------------------------------------- 
        <div className="relative min-h-screen flex flex-col md:flex-row p-4 gap-4 z-10 max-w-7xl mx-auto">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="w-full md:w-64 flex flex-col p-6 rounded-[32px] liquid-glass border-white/10 shrink-0 shadow-2xl">
            {/* App Logo Brand */}
            <div className="flex items-center gap-2 mb-8">
              <Scale className="w-8 h-8 text-red-500 shrink-0" />
              <div>
                <h1 className="text-2xl font-bold tracking-tighter">
                  pravnik<span className="text-red-500">.ai</span>
                </h1>
                <p className="text-[9px] text-red-300 font-mono tracking-wider -mt-1 font-semibold uppercase">Правен Ко-Пилот</p>
              </div>
            </div>

            {/* Navigation Tabs list */}
            <nav className="flex-1 space-y-1.5">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium transition-all ${
                  activeTab === "dashboard"
                    ? "bg-white/20 text-white border-l-4 border-red-500"
                    : "hover:bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <BarChart2 className="w-4 h-4 opacity-80" />
                <span>Општ Преглед & КПИ</span>
              </button>

              <button
                onClick={() => setActiveTab("ai-assistant")}
                className={`w-full px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium transition-all ${
                  activeTab === "ai-assistant"
                    ? "bg-white/20 text-white border-l-4 border-red-500"
                    : "hover:bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4 opacity-80 text-rose-400" />
                <span className="flex items-center gap-1">
                  ВИ Истражување
                  <span className="text-[9px] bg-red-600 px-1 py-0.2 rounded-md font-mono text-white">АКТИВНО</span>
                </span>
              </button>

              <button
                onClick={() => setActiveTab("contracts")}
                className={`w-full px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium transition-all ${
                  activeTab === "contracts"
                    ? "bg-white/20 text-white border-l-4 border-red-500"
                    : "hover:bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <ClipboardCheck className="w-4 h-4 opacity-80" />
                <span>Анализа на Договори</span>
              </button>

              <button
                onClick={() => setActiveTab("translation")}
                className={`w-full px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium transition-all ${
                  activeTab === "translation"
                    ? "bg-white/20 text-white border-l-4 border-red-500"
                    : "hover:bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <Languages className="w-4 h-4 opacity-80" />
                <span>Превод со Вештачка</span>
              </button>

              <button
                onClick={() => setActiveTab("cases")}
                className={`w-full px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium transition-all ${
                  activeTab === "cases"
                    ? "bg-white/20 text-white border-l-4 border-red-500"
                    : "hover:bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <Scale className="w-4 h-4 opacity-80" />
                <span>Правни Предмети</span>
              </button>

              <button
                onClick={() => setActiveTab("chat")}
                className={`w-full px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium transition-all ${
                  activeTab === "chat"
                    ? "bg-white/20 text-white border-l-4 border-red-500"
                    : "hover:bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4 opacity-80" />
                <span>Сигурен Чат со Клиент</span>
              </button>

              <button
                onClick={() => setActiveTab("audit")}
                className={`w-full px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium transition-all ${
                  activeTab === "audit"
                    ? "bg-white/20 text-white border-l-4 border-red-500"
                    : "hover:bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <History className="w-4 h-4 opacity-80" />
                <span>Безбедносен Трезор</span>
              </button>
            </nav>

            {/* Bottom active indicators & profile */}
            <div className="mt-8 space-y-4">
              <div className="p-4 bg-gradient-to-br from-white/10 to-transparent border border-white/5 rounded-2xl">
                <div className="text-[9px] uppercase tracking-widest text-[#ef4444] font-bold mb-1">Безбедносен статус</div>
                <div className="flex items-center gap-2">
                  <span className="status-glow"></span>
                  <span className="text-[11px] text-slate-200">256-битна Крипто заштита</span>
                </div>
              </div>

              {/* User profile with simple logout link */}
              <div className="p-2 bg-black/30 border border-white/5 rounded-2xl flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-xs font-bold border border-white/20">
                  {currentLawyerInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{currentLawyerName}</div>
                  <div className="text-[9px] text-rose-300 truncate">Лиценциран Корисник</div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Одјави се сигурно"
                  className="p-1 px-2 rounded-lg bg-red-950/40 hover:bg-red-900 text-slate-300 hover:text-white transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN WORKSPACE REGION */}
          <main className="flex-1 flex flex-col gap-4 overflow-hidden">
            {/* Top Workspace Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-3">
              <div>
                <h2 className="text-2xl font-normal tracking-tight">
                  Добредојде назад, <span className="font-extrabold text-red-100">{currentLawyerName}</span>
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-300 tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  <span className="uppercase text-[10px] text-slate-400">Системско време (UTC):</span>
                  <span className="font-mono text-white pr-2 border-r border-white/10">2026-05-20 11:22:55</span>
                  <span className="uppercase text-[10px] text-slate-400 pl-1">Локација:</span>
                  <span className="text-white">Скопје, Македонија</span>
                </div>
              </div>

              <div className="flex gap-2">
                {isSyncing ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                    <RefreshCw className="w-3 h-3 animate-spin text-red-400" />
                    <span>Синхронизација...</span>
                  </div>
                ) : (
                  <button
                    onClick={() => fetchData(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-red-400" />
                    <span>Освежи податоци</span>
                  </button>
                )}

                <button
                  onClick={() => setIsNewCaseModalOpen(true)}
                  className="bg-white text-[#3d010c] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-white/90 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Заведи Нов Предмет</span>
                </button>
              </div>
            </header>

            {/* ------------------------------------------------------------- */}
            {/* TAB CONTENT: 1. OVERVIEW & KPI DASHBOARD (Sleek layout) */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "dashboard" && kpis && (
              <div className="space-y-4 overflow-y-auto pr-1 flex-1">
                {/* Visual statistics grid summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-3xl liquid-glass border-white/10 shadow-lg relative overflow-hidden group">
                    <div className="absolute right-4 top-4 text-white/5 group-hover:text-red-500/10 transition-all">
                      <Scale className="w-12 h-12" />
                    </div>
                    <span className="text-[10px] text-slate-300 text-xs font-extrabold uppercase tracking-wider block">Активни предмети</span>
                    <span className="text-3xl font-extrabold tracking-tight block mt-2 text-white">{kpis.activeCases}</span>
                    <span className="text-[10px] mt-1 text-slate-400 block font-mono">Од вкупно {kpis.totalCases} евидентирани</span>
                  </div>

                  <div className="p-4 rounded-3xl liquid-glass border-white/10 shadow-lg relative overflow-hidden group">
                    <div className="absolute right-4 top-4 text-white/5 group-hover:text-red-500/10 transition-all">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <span className="text-[10px] text-slate-300 text-xs font-extrabold uppercase tracking-wider block">Стапка на успешност</span>
                    <span className="text-3xl font-extrabold tracking-tight block mt-2 text-emerald-400">{kpis.winRate}%</span>
                    <span className="text-[10px] mt-1 text-emerald-300/60 block font-mono">Врз база на 84 спогодби</span>
                  </div>

                  <div className="p-4 rounded-3xl liquid-glass border-white/10 shadow-lg relative overflow-hidden group">
                    <div className="absolute right-4 top-4 text-white/5 group-hover:text-red-500/10 transition-all">
                      <Clock className="w-12 h-12" />
                    </div>
                    <span className="text-[10px] text-slate-300 text-xs font-extrabold uppercase tracking-wider block">Билабилни часови</span>
                    <span className="text-3xl font-extrabold tracking-tight block mt-2 text-amber-300">{kpis.billableHoursThisMonth} ч.</span>
                    <span className="text-[10px] mt-1 text-slate-400 block font-mono">Акумулирано во Мај 2026</span>
                  </div>

                  <div className="p-4 rounded-3xl liquid-glass border-white/10 shadow-lg relative overflow-hidden group">
                    <div className="absolute right-4 top-4 text-white/5 group-hover:text-red-500/10 transition-all">
                      <ShieldAlert className="w-12 h-12" />
                    </div>
                    <span className="text-[10px] text-slate-300 text-xs font-extrabold uppercase tracking-wider block">Просечен законски ризик</span>
                    <span className="text-3xl font-extrabold tracking-tight block mt-2 text-rose-400">{kpis.averageRiskScore}%</span>
                    <span className="text-[10px] mt-1 text-rose-300/60 block font-mono">Оценети преку pravnik.ai</span>
                  </div>
                </div>

                {/* Dashboard Core Split Grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  
                  {/* Performance Indicators Graphical Report */}
                  <div className="lg:col-span-8 p-6 rounded-[32px] liquid-glass border-white/10 flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                          <BarChart2 className="w-5 h-5 text-red-500" />
                          Аналитички Извештаи за Прогрес на Канцеларијата
                        </h3>
                        <p className="text-xs text-slate-300">Приказ на реализирани часови и зголемување на предмети во РМ судовите за 2026 година.</p>
                      </div>

                      <button
                        onClick={() => triggerPdfExport("kpis", kpis)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white hover:bg-white/20 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Превземи Извештај (PDF)</span>
                      </button>
                    </div>

                    {/* Highly stylized custom responsive bar/timeline charts using pure SVG, which are extremely polished and 100% crash free */}
                    <div className="p-3 bg-black/30 border border-white/5 rounded-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">Часовна прогресија и ангажман по месеци</span>
                        <div className="flex gap-4 text-[10px]">
                          <span className="flex items-center gap-1.5 text-red-400">
                            <span className="w-2.5 h-2.5 bg-red-600 rounded-sm inline-block"></span>
                            Реализирани часови
                          </span>
                          <span className="flex items-center gap-1.5 text-white/60">
                            <span className="w-2.5 h-2.5 bg-white/40 rounded-sm inline-block"></span>
                            Правни спорови
                          </span>
                        </div>
                      </div>

                      {/* Pure high precision graphics */}
                      <div className="h-44 w-full flex items-end justify-between gap-2 pt-2 pr-1 select-none">
                        {kpis.monthlyProgress.map((item, index) => {
                          const maxHours = 160;
                          const heightPctHours = Math.round((item.часови / maxHours) * 100);
                          const heightPctCases = Math.round((item.предмети / 10) * 100);

                          return (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                              <div className="w-full flex justify-center items-end gap-1 px-1 h-32 relative">
                                {/* Hover tooltip */}
                                <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#3d010c] border border-red-500/40 text-[9px] p-1.5 rounded-lg z-20 pointer-events-none text-center">
                                  <p className="font-bold">{item.month}</p>
                                  <p className="text-red-300">{item.часови} одработени ч.</p>
                                  <p className="text-slate-300">{item.предмети} папки во тек</p>
                                </div>
                                
                                {/* Legal case bar */}
                                <div
                                  style={{ height: `${heightPctCases}%` }}
                                  className="w-2.5 bg-white/25 rounded-t-sm group-hover:bg-white/40 transition-all"
                                ></div>

                                {/* Hours billable bar (Burgundy accent) */}
                                <div
                                  style={{ height: `${heightPctHours}%` }}
                                  className="w-5 bg-gradient-to-t from-red-800 to-red-500 rounded-t-md group-hover:brightness-110 shadow-[0_0_10px_rgba(128,0,32,0.4)] transition-all relative"
                                >
                                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">{item.часови}</span>
                                </div>
                              </div>
                              <span className="text-[11px] font-bold text-slate-300 font-mono">{item.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                        <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Портфолио по правни домени</span>
                        <div className="mt-3 space-y-2">
                          {kpis.courtWinDistribution.map((item, i) => (
                            <div key={i} className="text-xs">
                              <div className="flex justify-between text-slate-300 mb-1">
                                <span>{item.name}</span>
                                <span className="font-bold text-white">{item.вредност}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${item.вредност}%` }}
                                  className="h-full bg-gradient-to-r from-red-800 to-red-500 rounded-full"
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#3d010c]/20 border border-red-500/10 flex flex-col justify-between">
                        <div>
                          <span className="text-xs uppercase text-red-300 font-bold tracking-wider block mb-1">Правен уставен сојузник</span>
                          <p className="text-xs text-slate-300">
                            Користењето на pravnik.ai го дуплира капацитетот за анализа на комплексни закони и брзи улоги. Сите доверливи податоци остануваат во Ваша сопствена база.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10.5px] mt-2 font-mono text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Напредните перформанси се активни</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Real-time Law Updates alerts stack */}
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    {/* Active Law indexing indicator */}
                    <div className="p-5 rounded-[32px] liquid-glass border-white/10">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#ef4444] mb-3 flex items-center justify-between">
                        <span>Индексирани законски записи</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[9px]">Автоматски</span>
                      </h4>
                      <p className="text-xs text-slate-200 mb-4">
                        Следниве реални законски текстови во .txt формат се вчитани од папката <code className="font-mono bg-black/60 px-1 py-0.5 rounded">/laws</code> и се достапни за пребарување:
                      </p>

                      <div className="space-y-2">
                        {laws && laws.length > 0 ? (
                          laws.map((law, index) => (
                            <div key={index} className="p-3 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-red-500" />
                                <div>
                                  <span className="text-xs font-bold font-mono tracking-tight capitalize truncate max-w-[130px] block">
                                    {law.name}
                                  </span>
                                  {law.filename && (
                                    <a 
                                      href={`/laws/${law.filename}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[9px] text-red-400 hover:underline flex items-center gap-1 mt-0.5"
                                    >
                                      <Eye className="w-2.5 h-2.5" /> Прегледај документ
                                    </a>
                                  )}
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {(law.length / 1024).toFixed(1)} KB текст
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center rounded-2xl bg-black/20 text-xs text-slate-400">
                            Нема вчитано досиеа во /laws
                          </div>
                        )}
                      </div>
                      <p className="text-[9.5px] text-slate-400 mt-4 leading-relaxed font-light italic">
                        *Може да додавате нови закони или прописи во папката /laws во секое време, а pravnik.ai веднаш ќе ги индексира во сесијата без рестарт.
                      </p>
                    </div>

                    {/* Quick Warning Alerts Panel */}
                    <div className="p-5 rounded-[32px] bg-gradient-to-br from-rose-950/20 to-[#3d010c]/30 border border-red-500/20">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-red-300 mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
                        Брзи информации & прописи
                      </h4>

                      <div className="space-y-3.5">
                        {alerts.map((item) => (
                          <div key={item.id} className="text-xs border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 text-[8.5px] font-bold uppercase font-mono border border-red-500/20">
                                {item.type}
                              </span>
                              <span className="text-[9.5px] text-slate-400">{item.date}</span>
                            </div>
                            <p className="text-[11.5px] text-slate-200 leading-relaxed font-medium">
                              {item.text}
                            </p>
                            <span className="text-[9.5px] text-red-400 font-light block mt-1 hover:underline cursor-pointer">
                              → Погледни {item.law}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB CONTENT: 2. AI LEGAL ASSISTANT (Immersive Liquid Glass Chat) */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "ai-assistant" && (
              <div className="flex-1 flex flex-col gap-4 overflow-hidden relative">
                
                {/* Embedded Floating design details */}
                <div className="absolute top-10 right-10 w-44 h-44 bg-red-700/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="p-6 rounded-[32px] liquid-glass border-white/10 flex flex-col justify-between h-full overflow-hidden">
                  
                  {/* Top explanation */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-rose-400 animate-pulse" />
                        Паметна Електронска Лупа - Вештачка Интелигенција за македонски закони
                      </h3>
                      <p className="text-xs text-slate-200">
                        Поставете правно прашање за законите во Македонија. Системот врши семантичко пребарување и пребарува непосредно низ кодираните закони во <code className="bg-black/40 px-1 py-0.5 rounded">ustav.txt</code>, <code className="bg-black/40 px-1 py-0.5 rounded">obligacioni.txt</code> и <code className="bg-black/40 px-1 py-0.5 rounded">parnicna.txt</code>.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={lawFilter}
                        onChange={(e) => setLawFilter(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded-xl px-2 py-1 text-xs text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="">Сите филтрирани закони</option>
                        {laws.map((law, idx) => (
                          <option key={idx} value={law.name.toLowerCase()}>
                            {law.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setChatHistory([]);
                          setChatResponse("");
                        }}
                        className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        Исчисти историја
                      </button>
                    </div>
                  </div>

                  {/* Chat Message Panel / Interactive Holograph */}
                  <div className="flex-1 overflow-y-auto mb-4 p-4 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                    {chatHistory.length === 0 ? (
                      <div className="h-full flex flex-col justify-center items-center text-center p-8">
                        <Terminal className="w-12 h-12 text-[#ef4444] opacity-40 mb-3" />
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Правен Дигитален Сервер правилен и активен</h4>
                        <p className="text-xs text-slate-400 max-w-md mt-1">
                          Напишете прашање подолу или изберете една од понудените брзи пребарувања за да ги тестирате правните можности наpravnik.ai во реално време.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl mt-6">
                          {sampleQueries.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => handleAiChat(e, q.text)}
                              className="p-3 text-left rounded-xl bg-gradient-to-br from-[#3d010c]/20 to-black border border-white/5 hover:border-red-500/40 transition-all text-xs text-slate-100 hover:bg-white/5"
                            >
                              <span className="font-bold text-red-400 block mb-1">{q.title}</span>
                              <span className="line-clamp-2 text-[10.5px] text-slate-300 leading-snug">{q.text}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 pr-1">
                        {chatHistory.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex gap-3 max-w-[85%] ${
                              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border uppercase text-[10px] font-bold ${
                                msg.sender === "user"
                                  ? "bg-red-950 text-white border-red-500"
                                  : "bg-white text-black border-white"
                              }`}
                            >
                              {msg.sender === "user" ? "ВИ" : "ВИ"}
                            </div>
                            
                            <div className="space-y-1">
                              <div
                                className={`p-4 rounded-3xl text-sm leading-relaxed ${
                                  msg.sender === "user"
                                    ? "bg-[#800020]/40 border border-red-500/30 text-white"
                                    : "bg-[#2d060d]/50 border border-white/10 text-slate-50 relative overflow-hidden"
                                }`}
                              >
                                {/* Quick rendering helper for legal formats */}
                                <div className="space-y-2 whitespace-pre-wrap">
                                  {msg.text}
                                </div>
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono block px-2 text-right">
                                {msg.time} {msg.sender === "bot" && "• Проверено со pravnik.ai"}
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Loading pulse indicator */}
                        {isChatLoading && (
                          <div className="flex gap-3 max-w-[80%] mr-auto">
                            <div className="w-8 h-8 rounded-full bg-red-900 border border-white/10 flex items-center justify-center uppercase text-[10px] font-bold text-white shrink-0">
                              AI
                            </div>
                            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
                              <span className="status-glow"></span>
                              <span>Ко-пилотот ги анализира уставите и локални закони селективно...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Uploaded PDF Indicator */}
                  {chatPdf && (
                    <div className="mb-2 px-3 py-1.5 rounded-xl bg-red-950/30 border border-red-500/20 text-[10px] text-red-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        <span>Прикачен PDF за анализа: <strong>{chatPdf.name}</strong></span>
                      </div>
                      <button onClick={() => setChatPdf(null)} className="text-red-400 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Grounding Source Info Label */}
                  {chatUsedGrounding.length > 0 && (
                    <div className="mb-3 px-4 py-2.5 rounded-xl bg-[#3d010c]/30 border border-red-500/20 text-xs text-red-200 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                      <span>
                        Пронајдено е референтно усогласување со регистрираните законски извори:{" "}
                        <strong>{chatUsedGrounding.join(", ")}</strong>
                      </span>
                    </div>
                  )}

                  {/* Input bar */}
                  <form onSubmit={handleAiChat} className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={isChatLoading}
                      placeholder={chatPdf ? "Поставете прашање за прикачениот PDF..." : "Поставете прашање за уставни права, регрес за штета или договори..."}
                      className="w-full bg-[#1b0307]/80 border border-white/10 rounded-3xl py-4.5 pl-6 pr-24 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-all font-medium"
                    />
                    
                    <div className="absolute right-14 top-1/2 -translate-y-1/2">
                      <label className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 cursor-pointer transition-all flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                        <input 
                          type="file" 
                          accept=".pdf" 
                          className="hidden" 
                          onChange={(e) => setChatPdf(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isChatLoading || !chatInput.trim()}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl bg-white text-[#3d010c] hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all transform active:scale-95 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB CONTENT: 3. CONTRACT RISK ANALYSIS */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "contracts" && (
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                <div className="p-6 rounded-[32px] liquid-glass border-white/10">
                  <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 mb-2">
                    <ClipboardCheck className="w-5 h-5 text-red-500" />
                    Анализа на Договори и Правен Ризик на Акти
                  </h3>
                  <p className="text-xs text-slate-300">
                    Прикачете или внесете драфт-верзија од деловен или граѓански договор. Нашата интелигенција ќе ги лоцира сите финансиски несовпаѓања и спорни членови согласно Законот за облигациони односи на РСМ.
                  </p>

                  <form onSubmit={handleContractAnalysis} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">Тип на содржина:</label>
                        <select
                          value={contractType}
                          onChange={(e) => setContractType(e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                        >
                          <option value="Договор за закуп на деловен простор">Закуп на недвижности</option>
                          <option value="Договор за купопродажба">Трговска купопродажба</option>
                          <option value="Договор за партнерство">Ортодокс партнерство</option>
                          <option value="Договор за вработување">Договор за вработување (ЗРО)</option>
                          <option value="Општ деловен договор">Општи деловни спогодби</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                        Или прикачете PDF договор:
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex-1 p-4 rounded-2xl bg-black/35 border border-white/10 border-dashed hover:border-red-500/50 transition-all cursor-pointer flex items-center justify-center gap-2 group">
                          <Plus className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                          <span className="text-xs text-slate-400">
                            {contractPdf ? contractPdf.name : "Изберете PDF датотека..."}
                          </span>
                          <input 
                            type="file" 
                            accept=".pdf" 
                            className="hidden" 
                            onChange={(e) => setContractPdf(e.target.files?.[0] || null)} 
                          />
                        </label>
                        {contractPdf && (
                          <button onClick={() => setContractPdf(null)} className="p-4 rounded-2xl bg-red-950/30 text-red-400 hover:text-white transition-all">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                        Текст на договор во подготовка:
                      </label>
                      <textarea
                        value={contractInput}
                        onChange={(e) => setContractInput(e.target.value)}
                        rows={6}
                        required
                        className="w-full bg-black/35 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                        placeholder="Залепете го децидниот текст за анализа..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAnalyzing}
                      className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider holo-btn flex items-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Анализа и проценка на регулативи во тек...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Изврши Длабинска Анализа на Ризик</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Display Analysis outcome */}
                {analysisResult && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    
                    {/* Left details metrics */}
                    <div className="lg:col-span-4 p-6 rounded-[32px] bg-gradient-to-br from-[#3d010c]/40 via-black/40 to-[#2d060d]/40 border border-white/10 flex flex-col justify-between">
                      <div>
                        <span className="text-xs uppercase font-extrabold text-[#ef4444] mb-2 block">Резултат на ко-пилот</span>
                        <h4 className="text-lg font-bold tracking-tight text-white truncate capitalize">{analysisResult.contractType}</h4>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="relative flex items-center justify-center">
                            {/* Simple visual SVG radial gauge representing the risk */}
                            <svg className="w-24 h-24 transform -rotate-90">
                              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" className="text-red-950" fill="transparent" />
                              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" className="text-red-500" fill="transparent"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * analysisResult.riskScore) / 100}
                              />
                            </svg>
                            <span className="absolute text-xl font-extrabold font-mono text-red-200">{analysisResult.riskScore}%</span>
                          </div>

                          <div>
                            <p className="text-xs text-slate-300">Ниво на загриженост:</p>
                            <span className="text-sm font-bold text-red-300 uppercase tracking-widest">{analysisResult.riskRating}</span>
                          </div>
                        </div>

                        <div className="mt-6 space-y-2">
                          <div className="text-xs text-slate-300">
                            <strong>Анализирани договорни страни:</strong>
                            <p className="text-white mt-0.5">{analysisResult.parties?.join(" • ") || "Недефинирано"}</p>
                          </div>
                          <div className="text-xs text-slate-300">
                            <strong>Пронајден деловен предмет:</strong>
                            <p className="text-white mt-0.5">{analysisResult.subject || "Нема декриптиран предмет"}</p>
                          </div>
                          <div className="text-xs text-slate-300">
                            <strong>Проценета вредност за присилно извршување:</strong>
                            <p className="text-white mt-0.5">{analysisResult.value || "Не дефинирано"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex gap-2 w-full">
                        <button
                          onClick={() => triggerPdfExport("contract", analysisResult)}
                          className="flex-1 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-xs font-bold text-white flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Преземи Анализа</span>
                        </button>
                      </div>
                    </div>

                    {/* Right risks detailed list and corrective action layout */}
                    <div className="lg:col-span-8 p-6 rounded-[32px] liquid-glass border-white/10 space-y-6">
                      
                      {/* Identified risks */}
                      <div>
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" />
                          Идентификувани Неусогласености / Ризични Ставови:
                        </h4>

                        <div className="space-y-3">
                          {analysisResult.risks?.map((risk, index) => (
                            <div key={index} className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-red-100">{risk.title}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  risk.severity === "Критично" ? "bg-red-950 text-red-300 border border-red-500/30" : "bg-slate-800 text-slate-200"
                                }`}>
                                  {risk.severity}
                                </span>
                              </div>
                              <p className="text-slate-300 leading-relaxed mt-1">{risk.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Corrective clauses suggested */}
                      <div>
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Препорачани Конкретни Преформулирани Анекс-Членови:
                        </h4>

                        <div className="space-y-3">
                          {analysisResult.rephrasedClauses?.map((item, index) => (
                            <div key={index} className="p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl text-xs space-y-2">
                              <div>
                                <span className="text-[10px] text-red-300 font-bold uppercase font-mono">Оригинален спорен став:</span>
                                <p className="italic text-slate-400 pr-1 mt-0.5">"{item.original}"</p>
                              </div>
                              <div>
                                <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono">Препорачан став од pravnik.ai:</span>
                                <p className="text-slate-100 pr-1 mt-0.5 font-medium">"{item.suggested}"</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* General guidance list */}
                      <div className="p-4 bg-white/5 rounded-2xl">
                        <span className="text-xs uppercase text-slate-300 font-bold tracking-wider">Генерални препораки:</span>
                        <ul className="list-disc list-inside text-xs mt-2 space-y-1 text-slate-300">
                          {analysisResult.recommendations?.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB CONTENT: 4. TRANSLATION (Legal Document Translator) */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "translation" && (
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                <div className="p-6 rounded-[32px] liquid-glass border-white/10">
                  <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 mb-2">
                    <Languages className="w-5 h-5 text-red-500" />
                    Преведувач на Правни Списи со Врвна Терминологија
                  </h3>
                  <p className="text-xs text-slate-300">
                    Нашиот локален јазичен модел е посебно трениран за двонасочен стручен превод на договори, полномошна, тужбени барања и судски решенија. Преводот го зачувува службениот тон без лингвистички пропусти.
                  </p>

                  <form onSubmit={handleTranslate} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                          Целен Јазик за преведување:
                        </label>
                        <select
                          value={transTargetLang}
                          onChange={(e) => setTransTargetLang(e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                        >
                          <option value="Англиски">Англиски (English / International Law standard)</option>
                          <option value="Германски">Германски (Deutsch - DE)</option>
                          <option value="Француски">Француски (Français)</option>
                          <option value="Албански">Албански (Shqip)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Source Text Input */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                          Македонски оригинален заведен текст:
                        </label>
                        <textarea
                          value={transInput}
                          onChange={(e) => setTransInput(e.target.value)}
                          rows={8}
                          required
                          className="w-full bg-black/35 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                          placeholder="Залепете го македонскиот правен текст тука..."
                        />
                      </div>

                      {/* Trans Output display */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                          Складен преведен правен спис ({transTargetLang}):
                        </label>
                        <div className="w-full bg-[#1b0307]/50 border border-red-950/50 rounded-2xl p-4 text-xs font-mono text-white min-h-[174px] overflow-y-auto whitespace-pre-wrap relative">
                          {isTranslating ? (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
                              <div className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
                                <span className="text-xs text-slate-300">Јазичниот пар се обработува од AI...</span>
                              </div>
                            </div>
                          ) : transOutput ? (
                            <span>{transOutput}</span>
                          ) : (
                            <span className="text-slate-400 italic">Преводот ќе се појави тука по активирање на преведувањето...</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isTranslating}
                        className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider holo-btn flex items-center justify-center gap-2"
                      >
                        <Languages className="w-4 h-4" />
                        <span>Преведи Веднаш со Вештачка интелигенција</span>
                      </button>

                      {transOutput && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(transOutput);
                            showTemporaryAlert("Преведениот текст е успешно копиран на табла.");
                          }}
                          className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-300 hover:bg-white/15 transition-all text-center"
                        >
                          Копирај Превод
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB CONTENT: 5. CASE MANAGEMENT & HOLOGRAM REVIEW */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "cases" && (
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                
                {/* Title and stats preview */}
                <div className="flex justify-between items-center bg-[#3d010c]/30 p-4 border border-white/5 rounded-3xl">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Scale className="w-5 h-5 text-red-500" />
                      Регистар на Активни Парнични и Трговски Предмети
                    </h3>
                    <p className="text-xs text-slate-300">Вкупно прегледани {cases.length} судски досиеа.</p>
                  </div>
                  <button
                    onClick={() => setIsNewCaseModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-white text-[#3d010c] text-xs font-bold hover:bg-white/90 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Додади Нов Предмет</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left List side of cases */}
                  <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {cases.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCase(c)}
                        className={`p-4 rounded-3xl border text-xs cursor-pointer transition-all flex items-center justify-between group ${
                          selectedCase?.id === c.id
                            ? "bg-[#3d010c]/60 border-red-500/70 shadow-[0_4px_15px_rgba(128,0,32,0.3)]"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border uppercase ${
                            selectedCase?.id === c.id ? "bg-red-950 text-white border-red-500" : "bg-white/5 border-white/10"
                          }`}>
                            ПП
                          </div>
                          <div>
                            <div className="font-bold text-slate-100 group-hover:text-white transition-colors line-clamp-1 max-w-[200px]">
                              {c.title}
                            </div>
                            <div className="text-[10px] text-slate-300 mt-0.5">
                              Клиент: <strong className="text-white">{c.client}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            c.status === "Итна спогодба" ? "bg-emerald-950 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-200"
                          }`}>
                            {c.status}
                          </span>
                          <span className="text-[10px] block text-slate-300 font-mono mt-1 text-[9.5px]">
                            {c.id}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Hologram Case detail review panel */}
                  <div className="lg:col-span-7">
                    {selectedCase ? (
                      <div className="p-6 rounded-[32px] liquid-glass border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[460px]">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#800020]/30 to-transparent pointer-events-none"></div>

                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className="text-[9px] font-bold font-mono text-red-400 tracking-wider block uppercase mb-1">
                                // ХОЛОГРАФСКИ ПРЕГЛЕД НА ПРЕДМЕТ
                              </span>
                              <h3 className="text-lg font-bold text-white leading-tight">
                                {selectedCase.title}
                              </h3>
                              <p className="text-xs text-slate-300 mt-1">
                                Судски Инстанца: <strong className="text-slate-100">{selectedCase.court}</strong> - {selectedCase.judge}
                              </p>
                            </div>

                            <button
                              onClick={() => triggerPdfExport("case", selectedCase)}
                              title="Превземи извештај за предмет во PDF"
                              className="p-2 rounded-xl bg-white/15 border border-white/20 text-white hover:bg-white/25 transition-all text-xs flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Експорт</span>
                            </button>
                          </div>

                          {/* Stat risks strip */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 bg-black/30 p-4 border border-white/5 rounded-2xl text-xs">
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">Правна Страна / Конфликт:</span>
                              <p className="text-slate-200">
                                Клиент: <strong className="text-white">{selectedCase.client}</strong>
                              </p>
                              <p className="text-slate-200">
                                Противник: <strong className="text-white">{selectedCase.opposingParty}</strong>
                              </p>
                            </div>

                            <div className="space-y-1 md:border-l md:border-white/10 md:pl-4">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-300 font-bold uppercase tracking-wider block">Ниво за ризик:</span>
                                <span className="text-rose-400 font-bold">{selectedCase.riskScore}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mt-1">
                                <div
                                  style={{ width: `${selectedCase.riskScore}%` }}
                                  className="h-full bg-gradient-to-r from-red-800 to-red-500 rounded-full"
                                ></div>
                              </div>
                              <p className="text-[9px] text-[#ef4444] mt-1 font-light italic">
                                *Проценета веројатност за судски предизвик.
                              </p>
                            </div>
                          </div>

                          {/* Critical Dates & Events */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Критични Рокови:</h4>
                              <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                                {selectedCase.criticalDates && selectedCase.criticalDates.length > 0 ? (
                                  selectedCase.criticalDates.map((item, id) => (
                                    <div key={id} className="p-2.5 rounded-xl bg-black/35 border border-white/5 flex items-start gap-2 text-xs">
                                      <div className="status-glow-red mt-1"></div>
                                      <div>
                                        <span className="text-[9.5px] text-slate-300 font-mono font-bold block">{item.date}</span>
                                        <p className="text-slate-200 text-[11px] leading-relaxed mt-0.5">{item.description}</p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-slate-400 p-2">Нема заведно дополнителни датуми.</p>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Ризични фактори:</h4>
                              <div className="space-y-1 max-h-[140px] overflow-y-auto">
                                {selectedCase.riskFactors && selectedCase.riskFactors.length > 0 ? (
                                  selectedCase.riskFactors.map((f, id) => (
                                    <div key={id} className="p-2 p-3.5 rounded-xl bg-[#3d010c]/20 border border-red-500/10 text-[10.5px] text-red-200">
                                      🚩 {f}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-slate-400 p-2">Нема регистрирани критични параметри.</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Summary text */}
                          <div className="mt-4 p-4 rounded-2xl bg-black/25 text-xs text-slate-200">
                            <strong>Опис на правна купола / Казус:</strong>
                            <p className="mt-1 leading-relaxed text-slate-300">{selectedCase.summary}</p>
                          </div>
                        </div>

                        {/* Recent actions taken */}
                        <div className="mt-5 pt-4 border-t border-white/5 text-xs">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-2">Дневник на извршени дејства за предметот:</span>
                          <div className="space-y-1.5">
                            {selectedCase.logs && selectedCase.logs.map((log, id) => (
                              <div key={id} className="flex justify-between items-center text-[11px] text-slate-300 font-mono">
                                <span className="text-red-400 select-all pr-2 shrink-0">{log.date}</span>
                                <span className="truncate">{log.action}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-center items-center p-8 text-center rounded-[32px] liquid-glass border-white/10">
                        <Scale className="w-12 h-12 text-white/20 mb-3" />
                        <h4 className="text-sm font-bold uppercase text-slate-300">Немате означено активен предмет</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm">
                          Изберете предмет од листата за брз холографски увид на рокови, ризици и заведени вонсудски одлуки.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB CONTENT: 6. CLIENT CHAT (Encrypted Communications Portal) */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "chat" && (
              <div className="flex-1 flex flex-col gap-4 overflow-hidden relative">
                
                <div className="p-6 rounded-[32px] liquid-glass border-white/10 flex flex-col justify-between h-full overflow-hidden">
                  
                  {/* Top info and connection parameters */}
                  <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Lock className="w-5 h-5 text-emerald-400" />
                        Сигурен Криптографски Систем за Комуникација со Клиенти
                      </h3>
                      <p className="text-xs text-slate-300">
                        Оваа конзола разменува пораки со клиентот преку End-to-End сигурен тунел. Сите дејства се евидентираат во аудитот.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono text-[9px] text-emerald-300">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span>АКТИВЕН AES-GCM КЛУЧ</span>
                    </div>
                  </div>

                  {/* Channel selectors list and active Chat widget */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
                    
                    {/* Selectors */}
                    <div className="lg:col-span-4 space-y-2">
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mb-1">Безбедни канали со клиенти:</span>

                      {["Марко Николовски", "Ивана - ТехноГрупа", "Горан Петров"].map((client) => (
                        <div
                          key={client}
                          onClick={() => setSelectedClient(client)}
                          className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                            selectedClient === client
                              ? "bg-red-950/50 border-red-500/50"
                              : "bg-black/20 border-white/5 hover:bg-black/30"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-200">{client}</span>
                            <span className="text-[8px] bg-emerald-950 text-emerald-300 px-1 py-0.2 rounded">ШИФРИРАНО</span>
                          </div>
                          <p className="text-[10.5px] text-slate-400 truncate mt-1">Океј, адвокат Дамјан. Се слушаме на рочиште...</p>
                        </div>
                      ))}
                    </div>

                    {/* Messages display */}
                    <div className="lg:col-span-8 flex flex-col justify-between bg-black/40 border border-white/5 rounded-2xl p-4 overflow-hidden h-full">
                      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                        {messages
                          .filter(
                            (m) =>
                              m.sender === "Вие" ||
                              m.sender === selectedClient ||
                              (selectedClient === "Марко Николовски" && m.sender === "Марко Николовски") ||
                              (selectedClient === "Ивана - ТехноГрупа" && m.sender === "Ивана - ТехноГрупа")
                          )
                          .map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex flex-col max-w-[80%] ${
                                msg.sender === "Вие" ? "ml-auto items-end" : "mr-auto items-start"
                              }`}
                            >
                              <div
                                className={`p-3 rounded-3xl text-xs leading-relaxed ${
                                  msg.sender === "Вие"
                                    ? "bg-[#3d010c]/80 border border-red-500/20 text-white"
                                    : "bg-slate-800 text-slate-100"
                                }`}
                              >
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono mt-0.5 px-2">
                                {msg.sender} • {msg.time} {msg.encrypted && "🔐"}
                              </span>
                            </div>
                          ))}
                      </div>

                      <form onSubmit={handleSendMessageToClient} className="flex gap-2">
                        <input
                          type="text"
                          value={clientMessageInput}
                          onChange={(e) => setClientMessageInput(e.target.value)}
                          placeholder={`Напишете сигурна порака до ${selectedClient}...`}
                          className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-white text-[#3d010c] text-xs font-bold rounded-xl transition-all hover:bg-slate-100 cursor-pointer"
                        >
                          Испрати
                        </button>
                      </form>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB CONTENT: 7. AUDIT TRAIL & SYSTEM LOGS */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "audit" && (
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                <div className="p-6 rounded-[32px] liquid-glass border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-red-500" />
                        Доверлив Задолжителен Ревизорски Трезор (Audit Trail)
                      </h3>
                      <p className="text-xs text-slate-300">
                        Сите дејства во апликацијата pravnik.ai се дигитално заведени за да се овозможи децидна усогласеност со кодексот на правна етика и заштита на клиентот. Дејствата се криптографски блокирани.
                      </p>
                    </div>

                    <button
                      onClick={triggerPrint}
                      className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white hover:bg-white/20 transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Испечати логови</span>
                    </button>
                  </div>

                  {/* Audit trail representation table */}
                  <div className="bg-black/30 border border-white/5 rounded-2xl overflow-hidden text-xs">
                    <div className="grid grid-cols-12 bg-black/60 p-3 font-bold border-b border-white/10 text-slate-200">
                      <div className="col-span-3">Печат (Timestamp)</div>
                      <div className="col-span-2">Корисник</div>
                      <div className="col-span-5">Активност</div>
                      <div className="col-span-2 text-right">Статус</div>
                    </div>

                    <div className="divide-y divide-white/5 max-h-[380px] overflow-y-auto">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="grid grid-cols-12 p-3 items-center hover:bg-white/5 transition-colors text-[11px]">
                          <div className="col-span-3 font-mono text-slate-400">
                            {log.timestamp ? log.timestamp.replace(/T/, " ").substring(0, 19) : "Сега"}
                          </div>
                          <div className="col-span-2 font-bold text-slate-200">
                            {log.user}
                          </div>
                          <div className="col-span-5 text-slate-300 font-medium">
                            {log.action}
                          </div>
                          <div className="col-span-2 text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold font-mono text-[9px] border border-emerald-500/20">
                              {log.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-2xl mt-4 flex items-center gap-3">
                    <Server className="w-6 h-6 text-red-400" />
                    <div className="text-[10.5px] text-slate-300 leading-relaxed">
                      <strong>Протокол за Интегритет на Податоците:</strong>
                      <p>Системските логови и траги се запишуваат автоматски. Локалното складирање не може да биде несакано менувано или бришено, со што се гарантира неприкосновена автентичност пред органите на прогонот или судовите.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* NEW CASE REGISTRATION DIALOG / MODAL */}
      {/* ------------------------------------------------------------- */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg p-6 rounded-[32px] liquid-glass border-white/20 relative shadow-2xl">
            <button
              onClick={() => setIsNewCaseModalOpen(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-red-500" />
                Заведете Нов Правен / Парничен Предмет
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Системот автоматски ќе генерира сигурен клуч (SHA-256) и ќе започне проценка на ризици за предметот.
              </p>
            </div>

            <form onSubmit={handleAddCaseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Наслов на предмет (судски спор):</label>
                <input
                  type="text"
                  required
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  placeholder="пр. Спор против Комунал Општина за надомест"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Клиент во постапката:</label>
                  <input
                    type="text"
                    required
                    value={newCaseClient}
                    onChange={(e) => setNewCaseClient(e.target.value)}
                    placeholder="пр. Ивана Николовска ДОО"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Противна деловна страна:</label>
                  <input
                    type="text"
                    value={newCaseOpposing}
                    onChange={(e) => setNewCaseOpposing(e.target.value)}
                    placeholder="пр. Регонал Комерц ДООЕЛ"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Иницијален приоритет на одлука:</label>
                  <select
                    value={newCaseStatus}
                    onChange={(e) => setNewCaseStatus(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Во тек">Нормално решавање во тек</option>
                    <option value="Итна спогодба">Ургентна медијација</option>
                    <option value="Преговори">Преговори за понуда (Мирно)</option>
                    <option value="Завршени">Поднесено и завршено</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Краток опис или тужбен цитат (опционално):</label>
                <textarea
                  value={newCaseSummary}
                  onChange={(e) => setNewCaseSummary(e.target.value)}
                  rows={3}
                  placeholder="Специфицирајте кои членови од ЗОО се предмет на докажување..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white text-[#3d010c] text-xs font-bold uppercase tracking-wider rounded-xl transition-all hover:bg-slate-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>Завери со AES-256 дигитален печат</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
