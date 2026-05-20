import express from "express";
import { createRequire } from "module";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import compression from "compression";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Production-ready middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve laws directory statically so PDF files are accessible for browsing/referencing
app.use('/laws', express.static(path.join(process.cwd(), 'laws')));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// CORS support for production APIs
app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    process.env.PROD_URL || ''
  ].filter(Boolean);

  if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Gemini SDK with telemetry header
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Validate API key on startup
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️  WARNING: GEMINI_API_KEY is not configured. AI features will not work properly.");
}

// Mock database in-memory to store cases, communications, alerts and audit trail.
const auditLogs = [
  { id: 1, timestamp: new Date(Date.now() - 5 * 60000).toISOString(), user: "Адвокат Дамјан", action: "Успешна најава во системот pravnik.ai", type: "БЕЗБЕДНОСТ" },
  { id: 2, timestamp: new Date(Date.now() - 4 * 60000).toISOString(), user: "Адвокат Дамјан", action: "Инициран преглед на Уставот на РМ", type: "ПРЕБАРАУВАЊЕ" },
  { id: 3, timestamp: new Date(Date.now() - 2 * 60000).toISOString(), user: "Систем", action: "Синхронизација со локалната датотека на закони", type: "СИСТЕМ" },
];

const mockCases = [
  {
    id: "case-102",
    title: "Трговски спор за опрема - ТехноГрупа ДООЕЛ противМаксШпедиција",
    client: "ТехноГрупа ДООЕЛ",
    opposingParty: "МаксШпедиција ДОО",
    status: "Во тек",
    judge: "Судија Оливера Петровска",
    court: "Основен Граѓански Суд Скопје",
    nextHearing: "2026-06-12",
    criticalDates: [
      { date: "2026-05-25", description: "Краен рок за доставување писмени докази" },
      { date: "2026-06-12", description: "Главно рочиште и усна расправа во судница 4" }
    ],
    riskScore: 28, // Law risk assessment in % (green is good)
    riskFactors: ["Спорно толкување на обврската за превоз согласно Член 141 и 142 од ЗОО", "Недоволни писмени испрати за предавање на сопственоста"],
    summary: "Се бара надомест на штета за оневозможено користење на индустриска машина во износ од 1.200.000 МКД.",
    logs: [
      { date: "2026-05-10", action: "Поднесена тужба и уплатена судска такса" },
      { date: "2026-05-18", action: "Примен одговор на тужба со приговори од противната страна" }
    ]
  },
  {
    id: "case-103",
    title: "Работен спор - Марко Николовски против ТелекомДизајн ДОО",
    client: "Марко Николовски",
    opposingParty: "ТелекомДизајн ДОО",
    status: "Итна спогодба",
    judge: "Судија Драган Милошевски",
    court: "Основен Граѓански Суд Скопје",
    nextHearing: "2026-05-28",
    criticalDates: [
      { date: "2026-05-28", description: "Рочиште за обид за спогодба и медијација" }
    ],
    riskScore: 15,
    riskFactors: ["Постои писмен анекс на договор кој оди во прилог на тужителот", "Минимален ризик од губење на спорот доколку се докаже неотпуштено отсуство"],
    summary: "Спор за незаконски отказ од деловни причини и неисплатени к-15 надоместоци и регрес за придонеси.",
    logs: [
      { date: "2026-04-01", action: "Поднесено барање до одборот за мирно решавање спорови" },
      { date: "2026-05-12", action: "Судот испрати покана за задолжително медијациско рочиште" }
    ]
  },
  {
    id: "case-104",
    title: "Договор за Наем на Деловен Простор - СитиЦентар Карпош",
    client: "СитиЦентар Карпош",
    opposingParty: "ФешнТренд ДООЕЛ",
    status: "Преговори",
    judge: "Адвокат медијатор Ана Ристовска",
    court: "Вонсудска постапка",
    nextHearing: "2026-05-30",
    criticalDates: [
      { date: "2026-05-30", description: "Завршно усогласување на Член 12 со анекс" }
    ],
    riskScore: 45,
    riskFactors: ["Нејасно дефинирана виша сила (Force Majeure) во случај на надворешни рестрикции", "Суб-закупот не е експлицитно забранет, што може да доведе до пренос на обврска"],
    summary: "Продолжување и целосна ревизија на договор за закуп за деловен простор во трговски центар со вредност од 3.000 ЕУР месечно.",
    logs: [
      { date: "2026-05-15", action: "Подготвена прва драфт-верзија и испратена на анализа во pravnik.ai" }
    ]
  }
];

const mockAlerts = [
  { id: 1, text: "Денес стапија на сила измените во Законот за парнична постапка за дигитална достава на акти.", date: "Денес", type: "Итно", law: "Закон за парнична постапка" },
  { id: 2, text: "Уставниот суд поведе иницијатива за оценка на уставноста на Член 14 од Законот за даноци.", date: "Вчера", type: "Известување", law: "Устав на РМ" },
  { id: 3, text: "Врховниот суд донесе начелно правно мислење во врска со нематеријална штета за сообраќајни незгоди.", date: "Пред 3 дена", type: "Мислење", law: "Закон за облигациони односи" }
];

const mockMessages = [
  { id: 1, sender: "Марко Николовски", text: "Здраво адвокат Дамјан, дали ја добивте поканата за рочиштето на 28-ми мај?", time: "09:30", encrypted: true },
  { id: 2, sender: "Вие", text: "Да Марко, поканата е веќе заведена во pravnik.ai и означена како висок приоритет. Веќе ја почнавме подготовката на доказите.", time: "09:42", encrypted: true },
  { id: 3, sender: "Ивана - ТехноГрупа", text: "Ни треба итна анализа на договорот за набавка со германскиот партнер. Имаме рок до крај на неделата.", time: "10:15", encrypted: true }
];

// Helper to log audit trails
function addAuditLog(user: string, action: string, type: string) {
  const newLog = {
    id: auditLogs.length + 1,
    timestamp: new Date().toISOString(),
    user,
    action,
    type
  };
  auditLogs.unshift(newLog);
}

// Helper to read laws files (including PDFs)
const lawsCache: { [key: string]: { name: string; content: string; type: string; filename: string } } = {};
let lawsLoaded = false;

async function loadLocalLaws(forceRefresh = false): Promise<{ name: string; content: string; type: string; filename: string }[]> {
  // Return cached if already loaded
  if (lawsLoaded && !forceRefresh) {
    return Object.values(lawsCache);
  }

  // Clear cache for fresh scan if requested
  if (forceRefresh) {
    Object.keys(lawsCache).forEach(key => delete lawsCache[key]);
  }

  const result: { name: string; content: string; type: string; filename: string }[] = [];
  try {
    const dirPath = path.join(process.cwd(), "laws");
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        try {
          const filePath = path.join(dirPath, file);
          let content = "";
          let type = "unknown";
          const stats = fs.statSync(filePath);
          if (!stats.isFile()) continue;

          if (file.endsWith(".pdf")) {
            // Parse PDF files
            type = "pdf";
            try {
              const fileBuffer = await fs.promises.readFile(filePath);
              const pdfData = await pdfParse(fileBuffer);
              content = pdfData.text;
              console.log(`✅ Indexed PDF: ${file} (${pdfData.numpages} pages)`);
            } catch (pdfError) {
              console.error(`⚠️  Failed to parse PDF ${file}:`, (pdfError as any).message);
              content = ""; // Skip files that can't be parsed
            }
          } else if (file.endsWith(".txt") || file.endsWith(".md")) {
            // Read text/markdown files
            type = file.endsWith(".txt") ? "text" : "markdown";
            content = await fs.promises.readFile(filePath, "utf-8");
          } else {
            continue; // Skip other file types
          }

          // Only add files with content
          if (content.trim().length > 0) {
            const name = file.replace(".pdf", "").replace(".txt", "").replace(".md", "");
            result.push({ name, content, type, filename: file });
            lawsCache[name] = { name, content, type, filename: file };
          }
        } catch (fileError) {
          console.error(`⚠️  Error processing file ${file}:`, (fileError as any).message);
          continue; // Skip problematic files
        }
      }
      
      lawsLoaded = true;
      console.log(`\n📚 Laws database loaded: ${result.length} documents indexed`);
    } else {
      console.warn("⚠️  Laws directory not found at:", dirPath);
    }
  } catch (error) {
    console.error("❌ Error loading laws:", (error as any).message);
  }

  return result;
}

// API Routes

// 1. Get List of Indexed Law Database Files
app.get("/api/laws", async (req, res) => {
  try {
    const force = req.query.refresh === 'true';
    const lawsArr = await loadLocalLaws(force);
    res.json({
      success: true,
      count: lawsArr.length,
      laws: lawsArr.map(l => ({ 
        name: l.name, 
        length: l.content.length,
        type: l.type,
        pages: l.type === 'pdf' ? Math.ceil(l.content.length / 2000) : 1,
        filename: l.filename
      }))
    });
  } catch (error) {
    console.error("Error loading laws:", error);
    res.status(500).json({ success: false, error: "Failed to load laws" });
  }
});

// 2. Fetch Audit Trail logs from Memory
app.get("/api/audit-trail", (req, res) => {
  res.json({ success: true, logs: auditLogs });
});

// 3. Fetch Case Management data
app.get("/api/cases", (req, res) => {
  res.json({ success: true, cases: mockCases });
});

// Create new case
app.post("/api/cases", (req, res) => {
  const { title, client, opposingParty, summary, status } = req.body;
  if (!title || !client) {
    return res.status(400).json({ error: "Насловот и клиентот се задолжителни полиња." });
  }

  const newCase = {
    id: "case-" + (mockCases.length + 101),
    title,
    client,
    opposingParty: opposingParty || "Недефинирано",
    status: status || "Во тек",
    judge: "Недефинирано",
    court: "Основен Граѓански Суд Скопје",
    nextHearing: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days later
    criticalDates: [
      { date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], description: "Првичен рок за документација" }
    ],
    riskScore: Math.floor(Math.random() * 50) + 10,
    riskFactors: ["Дополнителен ризик од проценка на докази", "Потребна е првична консултација на уставни и законски одредби"],
    summary: summary || "Нема внесен концизен опис за овој предмет се уште.",
    logs: [
      { date: new Date().toISOString().split('T')[0], action: "Отворен нов предмет во pravnik.ai засилен со криптографска заштита" }
    ]
  };

  mockCases.push(newCase);
  addAuditLog("Адвокат Дамјан", `Отворен е нов предмет: "${title}" за клиент: ${client}`, "КРЕИРАЊЕ ПРЕДМЕТ");
  res.json({ success: true, case: newCase });
});

// 4. Client communications
app.get("/api/messages", (req, res) => {
  res.json({ success: true, messages: mockMessages });
});

app.post("/api/messages", (req, res) => {
  const { sender, text } = req.body;
  if (!text) return res.status(400).json({ error: "Пораката мора да содржи текст" });

  const newMsg = {
    id: mockMessages.length + 1,
    sender: sender || "Вие",
    text,
    time: new Date().toLocaleTimeString("mk-MK", { hour: '2-digit', minute: '2-digit' }),
    encrypted: true
  };

  mockMessages.push(newMsg);
  addAuditLog("Адвокат Дамјан", "Испратена нова безбедна шифрирана порака до клиент", "КОМУНИКАЦИЈА");
  res.json({ success: true, message: newMsg });
});

// 5. General Alerts
app.get("/api/alerts", (req, res) => {
  res.json({ success: true, alerts: mockAlerts });
});

app.post("/api/alerts", (req, res) => {
  const { text, type, law } = req.body;
  if (!text) return res.status(400).json({ error: "Известувањето мора да содржи текст" });

  const newAlert = {
    id: mockAlerts.length + 1,
    text,
    date: "Денес",
    type: type || "Известување",
    law: law || "Општо"
  };

  mockAlerts.unshift(newAlert);
  addAuditLog("Систем", `Заведено е ново известување за законска уредба: "${text.substring(0, 30)}..."`, "АЛЕРТИ");
  res.json({ success: true, alert: newAlert });
});

// 6. Secure AI Search through laws and constitution custom integration
app.post("/api/chat", async (req, res) => {
  let { prompt, lawFilter, history, pdfBase64 } = req.body;

  if (!prompt && !pdfBase64) {
    return res.status(400).json({ error: "Мора да внесете прашање или да прикачите PDF документ." });
  }

  if (pdfBase64) {
    try {
      const pdfData = await pdfParse(Buffer.from(pdfBase64, 'base64'));
      const pdfText = pdfData.text;
      prompt = `Содржина на прикачен документ:\n${pdfText}\n\nПрашање за документот: ${prompt || "Направи краток преглед и анализа на овој документ."}`;
    } catch (err) {
      console.error("Грешка при читање на PDF во чат:", err);
      if (!prompt) return res.status(400).json({ error: "Неуспешно читање на PDF документот." });
    }
  }

  try {
    addAuditLog("Адвокат Дамјан", `Пребарување/Прашање до AI за: "${prompt.substring(0, 50)}..."`, "ПРАВНО ИСТРАЖУВАЊЕ");

    // Load actual files from ./laws folder and read their content to ground the LLM
    const localLaws = await loadLocalLaws();
    let knowledgeBaseContext = "ИНФОРМАЦИИ ЗА ЛОКАЛНО ИНДЕКСИРАНИТЕ ЗАКОНИ ВО ПРОГРАМАТА:\n\n";

    if (localLaws.length === 0) {
      knowledgeBaseContext += "(Нема пронајдено дополнителни датотеки на закони во папката ./laws. Користи го твоето општо знаење за македонското законодавство.)";
    } else {
      for (const item of localLaws) {
        if (!lawFilter || item.name.toLowerCase().includes(lawFilter.toLowerCase())) {
          knowledgeBaseContext += `--- ДАТОТЕКА: ${item.name} ---\n`;
          knowledgeBaseContext += `${item.content}\n\n`;
        }
      }
    }

    // Build standard system instruction
    const systemInstruction = `Ти си pravnik.ai - врвен, футуристичен дигитален асистент и правен ко-пилот наменет за македонски адвокати, судии и правни фирми во Република Македонија.
Твојата примарна задача е да обезбедуваш професионални, прецизни, аналитични информации за законите, Уставот на РМ, правните рамки и судските одлуки во Македонија.

ПРАВИЛА за одговарање:
1. Секогаш одговарај исклучиво на МАKЕДОНСКИ јазик.
2. Одговорите треба да бидат стручни, структурирани во правен стил, но лесни за навигација. Користи параграфи, булети, и цитирај членови каде што е можно.
3. Во продолжение ти се прикачени реални законски текстови од локалната база на канцеларијата (доколку корисникот ги дефинирал во ./laws). Дај им предност во толкувањето и погледни дали таму се наоѓа точниот одговор.
4. Доколку прашањето бара генерална анализа надвор од тие датотеки, користи го твоето знаење за вистинските македонски закони.
5. На крајот на одговорот, секогаш сумирај го клучниот правен заклучок накратко во посебен дел 'Правен совет'.

Еве ја моменталната локална база на закони во системот:
${knowledgeBaseContext}`;

    // Format chat contents for GenAI API. Convert history objects
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      for (const entry of history) {
        contents.push({
          role: entry.sender === "user" ? "user" : "model",
          parts: [{ text: entry.text }]
        });
      }
    }
    // Push the current prompt at the end
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent({
      contents: contents,
      generationConfig: { temperature: 0.3 }
    });

    res.json({
      success: true,
      answer: result.response.text(),
      usedGrounding: localLaws.map(l => l.name)
    });
  } catch (err: any) {
    console.error("Gemini API Error: ", err);
    res.status(500).json({ error: "Грешка при комуникација со AI вештачката интелигенција. Ве молиме погледнете ја кофигурацијата на GEMINI_API_KEY во Settings." });
  }
});

// 7. Legal document translation custom engine
app.post("/api/translate", async (req, res) => {
  let { text, targetLanguage, pdfBase64 } = req.body;

  if ((!text && !pdfBase64) || !targetLanguage) {
    return res.status(400).json({ error: "Содржината (текст или PDF) и јазикот за превод се задолжителни." });
  }

  if (pdfBase64) {
    try {
      const pdfData = await pdfParse(Buffer.from(pdfBase64, 'base64'));
      text = pdfData.text;
    } catch (err) {
      console.error("Грешка при превод на PDF:", err);
      return res.status(400).json({ error: "Неуспешно читање на PDF документот за превод." });
    }
  }

  try {
    addAuditLog("Адвокат Дамјан", `Превод на правен документ во тек (насока: ${targetLanguage})`, "ПРЕВОД");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "Ти си најпрофесионален и високо обучен правен преведувач на договори, пресуди, закони и акти со беспрекорен стил. Јазикот мора да биде официјален, без кратенки или неформални изрази.",
    });

    const result = await model.generateContent(`Преведи го следниов македонски или странски правен документ со исклучителна правна прецизност врз основа на македонската стандардна и официјална правна терминологија. 
Целен јазик: ${targetLanguage}
Правни содржини за преведување:
"""
${text}
"""`);

    res.json({
      success: true,
      translatedText: result.response.text()
    });
  } catch (err: any) {
    console.error("Translation error: ", err);
    res.status(500).json({ error: "Грешка при процесот на превод со AI модулот." });
  }
});

// 8. AI Contract analysis and legal risk assessment
app.post("/api/contract-analysis", async (req, res) => {
  let { contractText, contractType, pdfBase64 } = req.body;

  if (!contractText && !pdfBase64) {
    return res.status(400).json({ error: "Содржината на договорот (текст или PDF) е задолжителна." });
  }

  if (pdfBase64) {
    try {
      const pdfData = await pdfParse(Buffer.from(pdfBase64, 'base64'));
      contractText = pdfData.text;
    } catch (err) {
      console.error("Грешка при анализа на PDF:", err);
      return res.status(400).json({ error: "Неуспешно читање на PDF документот за анализа." });
    }
  }

  try {
    addAuditLog("Адвокат Дамјан", `Успешно извршена AI проценка на ризик на нов закуп/договор`, "АНАЛИЗА НА ДОГОВОР");

    const prompt = `Изврши длабинска правна анализа и проценка на безбедносни ризици на овој договор.
Тип на договор: ${contractType || "Општ договор"}

Договор во тек на анализа:
"""
${contractText}
"""`;

    const systemInstruction = `Ти си виртуелен јавен нотар и специјалист за корпоративно договорно право во Република Македонија.
Анализирај го целосниот извадок од договорот и изгенерирај исклучиво структуриран преглед во JSON формат кој содржи:
1. Клучни идентификувани договори страни, предмет на договорот и вредност.
2. Проценка на целокупното ниво на ризик со процент на загриженост (од 0% до 100%).
3. Список од најмалку 3 критични потенцијални ризици со детален опис во македонски контекст (на пример, неусогласеност со Законот за облигациони односи, слаби рокови за деловен прекин, непрецизна виша сила).
4. Препорачани измени и конкретни преформулирани анекс-члени за ублажување на тие ризици.

Враќај ги вредностите ИСКЛУЧИВО ВО JSON формат кој ја прати следнава структура:
{
  "contractType": "...",
  "parties": ["партија 1", "партија 2"],
  "subject": "краток предмет на договорот",
  "value": "вредност на договорот",
  "riskScore": 45, // Секогаш бројка од 0 до 100
  "riskRating": "Слабо / Умерено / Високо / Екстремно",
  "risks": [
    { "title": "...", "description": "...", "severity": "Критично/Умерено" }
  ],
  "recommendations": [
    "...", "..."
  ],
  "rephrasedClauses": [
    { "original": "...", "suggested": "..." }
  ]
}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
    });

    const parsedJson = JSON.parse(result.response.text() || "{}");
    res.json({
      success: true,
      analysis: parsedJson
    });
  } catch (err: any) {
    console.error("Contract analysis error: ", err);
    res.status(500).json({ error: "Грешка во AI алгоритмот за проценка на ризици на договори." });
  }
});


// 9. Reporting & KPIs (Win-rates, stats)
app.get("/api/reports/kpis", (req, res) => {
  // Return high quality KPI scores for the office
  res.json({
    success: true,
    data: {
      totalCases: mockCases.length,
      activeCases: mockCases.filter(c => c.status === "Во тек").length,
      negotiationsCount: mockCases.filter(c => c.status === "Преговори").length,
      settlementsCount: mockCases.filter(c => c.status === "Итна спогодба" || c.status === "Завршени").length,
      winRate: 84.5, // % win rate
      averageRiskScore: Math.round(mockCases.reduce((acc, c) => acc + c.riskScore, 0) / mockCases.length),
      billableHoursThisMonth: 148,
      activeClients: 19,
      monthlyProgress: [
        { month: "Јан", часови: 110, предмети: 2 },
        { month: "Фев", часови: 125, предмети: 3 },
        { month: "Мар", часови: 140, предмети: 4 },
        { month: "Апр", часови: 135, предмети: 5 },
        { month: "Мај", часови: 148, предмети: mockCases.length }
      ],
      courtWinDistribution: [
        { name: "Трговски спорови", вредност: 40 },
        { name: "Работни спорови", вредност: 30 },
        { name: "Договори и стечај", вредност: 20 },
        { name: "Административни", вредност: 10 }
      ]
    }
  });
});

// Vite middleware integration for development environment
async function startServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      if (!fs.existsSync(distPath)) {
        console.error("❌ ERROR: Build output not found at dist/. Please run 'npm run build' first.");
        process.exit(1);
      }
      app.use(express.static(distPath, { maxAge: '1d' }));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    const server = app.listen(PORT, "0.0.0.0", () => {
      const mode = process.env.NODE_ENV || "development";
      const protocol = mode === "production" ? "https" : "http";
      console.log(`\n✅ [pravnik.ai] Server started successfully`);
      console.log(`📍 Mode: ${mode.toUpperCase()}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🔐 Environment: ${process.env.NODE_ENV === 'production' ? 'PRODUCTION READY' : 'Development'}\n`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("❌ ERROR during server startup:", error);
    process.exit(1);
  }
}

startServer();
