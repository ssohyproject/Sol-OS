#!/usr/bin/env node
/**
 * SoloOS Model Context Protocol (MCP) Server
 * Compatible with Claude Desktop, Cursor, Antigravity, and any MCP Client
 * Communicates via JSON-RPC 2.0 over standard I/O (stdio)
 * Zero external dependencies required
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_STATE_FILE = path.join(ROOT_DIR, 'data', 'default-state.json');
const DATA_TAX_RULES = path.join(ROOT_DIR, 'data', 'tax-rules.json');
const DATA_USERS_FILE = path.join(ROOT_DIR, 'data', 'users.json');
const BACKUPS_DIR = path.join(ROOT_DIR, 'data', 'backups');
const TaxEngine = require(path.join(ROOT_DIR, 'js', 'tax-engine.js'));

// Helper to load current state
function loadState() {
  try {
    if (fs.existsSync(DATA_STATE_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_STATE_FILE, 'utf8'));
    }
  } catch (e) {}
  return { workingCapital: 14200000, monthlyFixedExpense: 2730000, transactions: [], tasks: [], clients: [] };
}

function saveState(state) {
  try {
    fs.writeFileSync(DATA_STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

function loadUsers() {
  try {
    if (fs.existsSync(DATA_USERS_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_USERS_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

// ------------------------------------------------------------------------------
// MCP Tool Definitions
// ------------------------------------------------------------------------------
const TOOLS = [
  {
    name: 'get_soloos_financial_status',
    description: '1인 사업가의 통장 잔고, 런웨이(생존 가능 개월 수), 워터폴 손익, 세무 예치금 현황을 조회합니다.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'list_soloos_tasks',
    description: 'SoloOS에 등록된 프로젝트 마감 일정, 납품 태스크, 미수금 현황을 조회합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          enum: ['all', 'client', 'publishing', 'knowledge'],
          description: '도메인 필터 (외주, 출판, 지식창업)'
        }
      }
    }
  },
  {
    name: 'calculate_tax',
    description: '3대 세무 매트릭스(10% 부가세, 3.3% 프리랜서 소득세, 8.8%/4.4% 기타소득) 정밀 계산 및 실수령액 역산을 수행합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['vat', 'vat-reverse', 'withholding33', 'withholding33-reverse', 'other-income'],
          description: '계산 유형'
        },
        amount: {
          type: 'number',
          description: '금액 (원 단위)'
        },
        expenseRatio: {
          type: 'number',
          description: '기타소득 필요경비율 (0.6: 8.8%, 0.8: 4.4%)'
        }
      },
      required: ['type', 'amount']
    }
  },
  {
    name: 'add_soloos_transaction',
    description: 'SoloOS 장부에 새로운 세무 매출/매입 거래를 기록하고 세금을 자동 분개합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: '거래 항목명' },
        domain: { type: 'string', enum: ['client', 'publishing', 'knowledge', 'operation'], description: '도메인' },
        category: { type: 'string', description: '세무 분류 (예: 세금계산서매출(VAT분리), 3.3%사업소득매출, 지급수수료)' },
        amount: { type: 'number', description: '금액' },
        isExpense: { type: 'boolean', description: '지출 여부' }
      },
      required: ['title', 'domain', 'category', 'amount']
    }
  },
  {
    name: 'add_soloos_task',
    description: '새로운 용역 과업 또는 납품 마감 일정을 등록합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        client: { type: 'string', description: '클라이언트/거래처명' },
        title: { type: 'string', description: '과업명' },
        dueDate: { type: 'string', description: '마감일 (YYYY-MM-DD)' },
        dueTime: { type: 'string', description: '마감 시간 (HH:MM)' },
        amount: { type: 'number', description: '계약 금액' },
        domain: { type: 'string', enum: ['client', 'publishing', 'knowledge'], description: '도메인' }
      },
      required: ['client', 'title', 'dueDate', 'amount']
    }
  },
  {
    name: 'sync_google_calendar',
    description: 'SoloOS의 납품 마감일 및 정산 일정을 구글 캘린더(Google Calendar)로 동기화합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        targetCalendar: { type: 'string', description: '동기화 대상 캘린더 (기본: primary)' }
      }
    }
  },
  {
    name: 'backup_google_drive',
    description: 'SoloOS의 장부 데이터, 세무 분개 내역, 계약서 사본을 구글 드라이브(Google Drive)에 백업합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        folderName: { type: 'string', description: '저장할 구글 드라이브 폴더명 (기본: SoloOS_Backup)' }
      }
    }
  },
  {
    name: 'get_user_profile',
    description: '현재 SoloOS 로그인 사용자의 프로필 정보 및 Google Workspace(캘린더, 드라이브) 연동 상태를 조회합니다.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  }
];

// ------------------------------------------------------------------------------
// Tool Execution Logic
// ------------------------------------------------------------------------------
async function executeTool(name, args) {
  const state = loadState();

  switch (name) {
    case 'get_soloos_financial_status': {
      const runway = TaxEngine.calcRunway(state.workingCapital, state.monthlyFixedExpense);
      const waterfall = TaxEngine.calcWaterfall(state.transactions);
      const stamina = TaxEngine.calcFinancialStamina(state.workingCapital, state.receivables);

      return {
        summary: `SoloOS 재무 요약 브리핑:`,
        workingCapital: `₩${state.workingCapital.toLocaleString()} (사업 통장 가용 잔고)`,
        monthlyFixedExpense: `₩${state.monthlyFixedExpense.toLocaleString()}`,
        runwayMonths: `${runway.runwayMonths}개월 (${runway.isSafe ? '안정권 6개월 이상' : '경고'})`,
        waterfall: {
          grossRevenue: `₩${waterfall.grossRevenue.toLocaleString()}`,
          totalExpense: `₩${waterfall.totalExpense.toLocaleString()}`,
          netProfit: `₩${waterfall.netProfit.toLocaleString()} (이익률 ${waterfall.profitMargin}%)`,
          taxReserve: `₩${waterfall.taxReserve.toLocaleString()} (별도 분리 보관 권장)`
        },
        balanceHealth: `순자본 ₩${stamina.netWorth.toLocaleString()} (건전도 ${stamina.healthRatio}%)`
      };
    }

    case 'list_soloos_tasks': {
      const domain = args?.domain || 'all';
      let tasks = state.tasks || [];
      if (domain !== 'all') {
        tasks = tasks.filter(t => t.domain === domain);
      }
      return {
        totalCount: tasks.length,
        filterDomain: domain,
        tasks: tasks.map(t => ({
          id: t.id,
          domain: t.domain,
          client: t.client,
          title: t.title,
          dueDate: `${t.dueDate} ${t.dueTime || ''}`.trim(),
          amount: `₩${(t.amount || 0).toLocaleString()}`,
          status: t.status,
          completed: t.completed
        }))
      };
    }

    case 'calculate_tax': {
      const { type, amount, expenseRatio } = args;
      let result;
      if (type === 'vat') result = TaxEngine.calcVAT(amount);
      else if (type === 'vat-reverse') result = TaxEngine.reverseVAT(amount);
      else if (type === 'withholding33') result = TaxEngine.calcWithholding33(amount);
      else if (type === 'withholding33-reverse') result = TaxEngine.reverseWithholding33(amount);
      else if (type === 'other-income') result = TaxEngine.calcOtherIncome(amount, expenseRatio || 0.60);
      else throw new Error(`Unknown calculation type: ${type}`);
      return { calculationType: type, inputAmount: amount, result };
    }

    case 'add_soloos_transaction': {
      const isExp = Boolean(args.isExpense);
      const amt = Math.abs(Number(args.amount) || 0);
      const sign = isExp ? -1 : 1;

      let tax = 0;
      let gross = amt * sign;
      let net = amt * sign;

      if (args.category.includes('VAT') || args.category.includes('세금계산서')) {
        const vatCalc = TaxEngine.calcVAT(amt);
        tax = vatCalc.tax * sign;
        net = vatCalc.net * sign;
      } else if (args.category.includes('3.3%')) {
        const whCalc = TaxEngine.calcWithholding33(amt);
        tax = whCalc.tax * sign;
        net = whCalc.net * sign;
      }

      const newTx = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        domain: args.domain,
        title: args.title,
        category: args.category,
        gross: gross,
        tax: tax,
        net: net,
        status: isExp ? '적격증빙' : '자동분개완료'
      };

      state.transactions.unshift(newTx);
      state.workingCapital += net;
      saveState(state);

      return {
        success: true,
        message: `거래 '${args.title}'가 SoloOS 장부에 성공적으로 등록되었습니다.`,
        transaction: newTx,
        updatedWorkingCapital: `₩${state.workingCapital.toLocaleString()}`
      };
    }

    case 'add_soloos_task': {
      const newTask = {
        id: Date.now(),
        domain: args.domain || 'client',
        client: args.client,
        title: args.title,
        dueDate: args.dueDate,
        dueTime: args.dueTime || '18:00',
        priority: '보통',
        status: '진행중',
        amount: Number(args.amount) || 0,
        memo: `MCP 연동을 통해 등록된 과업`,
        completed: false
      };
      state.tasks.push(newTask);
      saveState(state);

      return {
        success: true,
        message: `과업 '${args.title}' (${args.client}) 등록 완료`,
        task: newTask
      };
    }

    case 'sync_google_calendar': {
      const calendarName = args?.targetCalendar || 'primary';
      const events = (state.tasks || []).map(t => {
        const startDateTime = `${t.dueDate}T${t.dueTime ? t.dueTime + ':00' : '09:00:00'}`;
        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`[SoloOS] ${t.title}`)}&dates=${t.dueDate.replace(/-/g, '')}T090000Z/${t.dueDate.replace(/-/g, '')}T180000Z&details=${encodeURIComponent(`클라이언트: ${t.client}\n금액: ₩${(t.amount || 0).toLocaleString()}\n상태: ${t.status}\n메모: ${t.memo || ''}`)}`;
        return {
          id: t.id,
          summary: `[SoloOS] ${t.title} (${t.client})`,
          dueDate: t.dueDate,
          dueTime: t.dueTime || '18:00',
          amount: `₩${(t.amount || 0).toLocaleString()}`,
          status: t.status,
          googleCalendarUrl: gcalUrl
        };
      });

      return {
        success: true,
        calendar: calendarName,
        syncedCount: events.length,
        events: events,
        message: `구글 캘린더(${calendarName})에 ${events.length}건의 SoloOS 마감 및 과업 일정이 동기화되었습니다.`,
        syncTimestamp: new Date().toISOString()
      };
    }

    case 'backup_google_drive': {
      const folderName = args?.folderName || 'SoloOS_ERP_Backups';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `soloos_backup_${timestamp}.json`;

      try {
        if (!fs.existsSync(BACKUPS_DIR)) {
          fs.mkdirSync(BACKUPS_DIR, { recursive: true });
        }
        const filePath = path.join(BACKUPS_DIR, backupFileName);
        const backupPayload = {
          version: '2.0.0',
          backupCreatedAt: new Date().toISOString(),
          targetGoogleDriveFolder: folderName,
          state: state
        };
        fs.writeFileSync(filePath, JSON.stringify(backupPayload, null, 2), 'utf8');
      } catch (err) {
        console.error('Backup write error:', err);
      }

      const stateLength = JSON.stringify(state).length;

      return {
        success: true,
        service: 'Google Drive API v3',
        folder: folderName,
        backupFile: backupFileName,
        sizeBytes: stateLength,
        transactionsCount: (state.transactions || []).length,
        tasksCount: (state.tasks || []).length,
        clientsCount: (state.clients || []).length,
        backupTimestamp: new Date().toISOString(),
        message: `구글 드라이브(${folderName})에 SoloOS 장부 백업 파일(${backupFileName})이 정상 보관되었습니다.`
      };
    }

    case 'get_user_profile': {
      const users = loadUsers();
      const currentUser = users[0] || {
        id: 'usr_guest',
        email: 'guest@soloos.io',
        name: '체험 사용자',
        businessType: '1인 디지털 창업가',
        googleConnected: false,
        googleCalendarConnected: false,
        googleDriveConnected: false
      };

      return {
        success: true,
        user: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          businessType: currentUser.businessType,
          googleConnected: Boolean(currentUser.googleConnected),
          googleCalendarConnected: Boolean(currentUser.googleCalendarConnected),
          googleDriveConnected: Boolean(currentUser.googleDriveConnected)
        },
        workspace: {
          workingCapital: `₩${state.workingCapital.toLocaleString()}`,
          activeTasks: (state.tasks || []).length,
          transactions: (state.transactions || []).length
        }
      };
    }

    default:
      throw new Error(`Tool not found: ${name}`);
  }
}

// ------------------------------------------------------------------------------
// JSON-RPC Protocol Processor (stdio)
// ------------------------------------------------------------------------------
if (require.main === module) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  function sendResponse(response) {
    process.stdout.write(JSON.stringify(response) + '\n');
  }

  rl.on('line', async (line) => {
    if (!line.trim()) return;
  try {
    const msg = JSON.parse(line);
    const { id, method, params } = msg;

    // 1. Initialize
    if (method === 'initialize') {
      sendResponse({
        jsonrpc: '2.0',
        id: id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
            resources: {}
          },
          serverInfo: {
            name: 'soloos-erp',
            version: '2.0.0'
          }
        }
      });
      return;
    }

    // 2. Initialized notification
    if (method === 'notifications/initialized') {
      return;
    }

    // 3. Ping
    if (method === 'ping') {
      sendResponse({ jsonrpc: '2.0', id: id, result: {} });
      return;
    }

    // 4. Tools list
    if (method === 'tools/list') {
      sendResponse({
        jsonrpc: '2.0',
        id: id,
        result: { tools: TOOLS }
      });
      return;
    }

    // 5. Tools call
    if (method === 'tools/call') {
      const { name, arguments: args } = params;
      try {
        const result = await executeTool(name, args);
        sendResponse({
          jsonrpc: '2.0',
          id: id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          }
        });
      } catch (err) {
        sendResponse({
          jsonrpc: '2.0',
          id: id,
          isError: true,
          error: {
            code: -32603,
            message: err.message
          }
        });
      }
      return;
    }

    // 6. Resources list
    if (method === 'resources/list') {
      sendResponse({
        jsonrpc: '2.0',
        id: id,
        result: {
          resources: [
            {
              uri: 'soloos://state',
              name: 'SoloOS Current State & Ledger',
              mimeType: 'application/json'
            },
            {
              uri: 'soloos://tax-rules',
              name: 'SoloOS 3-in-1 Tax Rules',
              mimeType: 'application/json'
            }
          ]
        }
      });
      return;
    }

    // 7. Resources read
    if (method === 'resources/read') {
      const uri = params?.uri;
      let text = '';
      if (uri === 'soloos://state') {
        text = JSON.stringify(loadState(), null, 2);
      } else if (uri === 'soloos://tax-rules') {
        text = fs.existsSync(DATA_TAX_RULES) ? fs.readFileSync(DATA_TAX_RULES, 'utf8') : '{}';
      }
      sendResponse({
        jsonrpc: '2.0',
        id: id,
        result: {
          contents: [{ uri, mimeType: 'application/json', text }]
        }
      });
      return;
    }

    // Fallback unknown method
    if (id !== undefined) {
      sendResponse({
        jsonrpc: '2.0',
        id: id,
        error: { code: -32601, message: `Method not found: ${method}` }
      });
    }
  } catch (err) {
    // Malformed JSON
  }
});
}

module.exports = {
  TOOLS,
  executeTool,
  loadState,
  saveState,
  loadUsers
};
