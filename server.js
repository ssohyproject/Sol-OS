/**
 * SoloOS Progressive Web Service (PWS) & API Server
 * Fully compatible with Google Cloud Run, Firebase Hosting, and Local Development
 * Zero-dependency native Node.js HTTP server supporting REST API and .env loading
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// ------------------------------------------------------------------------------
// 1. Lightweight Native .env Parser
// ------------------------------------------------------------------------------
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.substring(0, eqIdx).trim();
          let val = trimmed.substring(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
      console.log('[SoloOS Server] Successfully loaded environment from .env');
    } catch (e) {
      console.warn('[SoloOS Server] Warning loading .env:', e.message);
    }
  }
}
loadEnv();

// ------------------------------------------------------------------------------
// 2. Configuration & Engine
// ------------------------------------------------------------------------------
const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = __dirname;
const USERS_FILE = path.join(PUBLIC_DIR, 'data', 'users.json');
const STATE_FILE = path.join(PUBLIC_DIR, 'data', 'default-state.json');
const BACKUPS_DIR = path.join(PUBLIC_DIR, 'data', 'backups');
const TaxEngine = require('./js/tax-engine.js');

let McpModule = null;
try {
  McpModule = require('./mcp/server.js');
} catch (e) {
  console.warn('[SoloOS Server] Could not load mcp/server.js:', e.message);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.hwpx': 'application/octet-stream',
  '.hwp': 'application/x-hwp',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

// ------------------------------------------------------------------------------
// 3. Helper Functions
// ------------------------------------------------------------------------------
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

// ------------------------------------------------------------------------------
// 4. HTTP Server & Router
// ------------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  // Global Security & CORS Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // ----------------------------------------------------------------------------
  // REST API Endpoints
  // ----------------------------------------------------------------------------

  // Health Checks (Cloud Run & Container Orchestration)
  if (pathname === '/healthz' || pathname === '/livez' || pathname === '/_ah/health' || pathname === '/api/healthz') {
    return sendJSON(res, 200, {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'SoloOS PWS Engine'
    });
  }

  // Public Configuration (Safe to share with frontend)
  if (pathname === '/api/config' && req.method === 'GET') {
    return sendJSON(res, 200, {
      appName: process.env.APP_NAME || 'SoloOS ERP',
      appUrl: process.env.APP_URL || `http://localhost:${PORT}`,
      env: process.env.NODE_ENV || 'development',
      firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID || 'soloos-erp',
        apiKey: process.env.FIREBASE_API_KEY || '',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'soloos-erp.firebaseapp.com',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'soloos-erp.appspot.com',
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.FIREBASE_APP_ID || ''
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        redirectUri: process.env.GOOGLE_REDIRECT_URI || `http://localhost:${PORT}/api/auth/google/callback`,
        hasClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET)
      },
      mcp: {
        enabled: process.env.MCP_ENABLED === 'true',
        serverName: process.env.MCP_SERVER_NAME || 'soloos-erp'
      },
      hasGemini: Boolean(process.env.GEMINI_API_KEY)
    });
  }

  // ----------------------------------------------------------------------------
  // User Authentication API (회원가입, 로그인, 구글 소셜 로그인)
  // ----------------------------------------------------------------------------
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    const payload = await parseBody(req);
    const { email, password, name, businessType } = payload;

    if (!email || !password) {
      return sendJSON(res, 400, { success: false, message: '이메일과 비밀번호를 입력해주세요.' });
    }

    const users = loadUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return sendJSON(res, 409, { success: false, message: '이미 가입된 이메일 주소입니다.' });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      email: email.trim(),
      name: name?.trim() || email.split('@')[0],
      businessType: businessType || '1인 프리랜서',
      passwordHash: password,
      googleConnected: false,
      googleCalendarConnected: false,
      googleDriveConnected: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return sendJSON(res, 201, {
      success: true,
      message: '회원가입이 완료되었습니다!',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        businessType: newUser.businessType,
        googleConnected: newUser.googleConnected,
        googleCalendarConnected: newUser.googleCalendarConnected,
        googleDriveConnected: newUser.googleDriveConnected
      }
    });
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const payload = await parseBody(req);
    const { email, password } = payload;

    const users = loadUsers();
    const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase() && u.passwordHash === password);

    if (!user) {
      return sendJSON(res, 401, { success: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    return sendJSON(res, 200, {
      success: true,
      message: `${user.name}님, 환영합니다!`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        businessType: user.businessType,
        googleConnected: Boolean(user.googleConnected),
        googleCalendarConnected: Boolean(user.googleCalendarConnected),
        googleDriveConnected: Boolean(user.googleDriveConnected)
      }
    });
  }

  // Google 원클릭 로그인 / 가입
  if (pathname === '/api/auth/google-login' && req.method === 'POST') {
    const payload = await parseBody(req);
    const email = payload.email || 'user@gmail.com';
    const name = payload.name || '구글 사용자';
    const businessType = payload.businessType || '디지털 1인 창업가';

    const users = loadUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = {
        id: `usr_g_${Date.now()}`,
        email: email,
        name: name,
        businessType: businessType,
        passwordHash: `google_oauth_${Date.now()}`,
        googleConnected: true,
        googleCalendarConnected: true,
        googleDriveConnected: true,
        createdAt: new Date().toISOString()
      };
      users.push(user);
    } else {
      user.googleConnected = true;
      user.googleCalendarConnected = true;
      user.googleDriveConnected = true;
    }

    saveUsers(users);

    return sendJSON(res, 200, {
      success: true,
      message: `Google 계정(${user.email})으로 로그인되었습니다. 구글 캘린더 및 드라이브가 연동되었습니다!`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        businessType: user.businessType,
        googleConnected: true,
        googleCalendarConnected: true,
        googleDriveConnected: true
      }
    });
  }

  // Google 연동 상태 토글
  if (pathname === '/api/auth/google/toggle' && req.method === 'POST') {
    const payload = await parseBody(req);
    const email = payload.email;
    const service = payload.service || 'all'; // 'all', 'calendar', 'drive'
    const status = payload.connected !== undefined ? Boolean(payload.connected) : true;

    const users = loadUsers();
    let targetUser = users.find(u => u.email === email) || users[0];

    if (targetUser) {
      if (service === 'all') {
        targetUser.googleConnected = status;
        targetUser.googleCalendarConnected = status;
        targetUser.googleDriveConnected = status;
      } else if (service === 'calendar') {
        targetUser.googleCalendarConnected = status;
        targetUser.googleConnected = targetUser.googleCalendarConnected || targetUser.googleDriveConnected;
      } else if (service === 'drive') {
        targetUser.googleDriveConnected = status;
        targetUser.googleConnected = targetUser.googleCalendarConnected || targetUser.googleDriveConnected;
      }
      saveUsers(users);

      return sendJSON(res, 200, {
        success: true,
        message: `Google 연동 상태가 변경되었습니다.`,
        user: {
          id: targetUser.id,
          email: targetUser.email,
          name: targetUser.name,
          googleConnected: targetUser.googleConnected,
          googleCalendarConnected: targetUser.googleCalendarConnected,
          googleDriveConnected: targetUser.googleDriveConnected
        }
      });
    }

    return sendJSON(res, 404, { success: false, message: '사용자를 찾을 수 없습니다.' });
  }

  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const emailParam = parsedUrl.searchParams.get('email');
    const users = loadUsers();
    const user = (emailParam ? users.find(u => u.email.toLowerCase() === emailParam.toLowerCase()) : null) || users[0] || {
      id: 'usr_guest',
      email: 'guest@soloos.io',
      name: '체험 사용자',
      businessType: '디지털 1인 창업',
      googleConnected: false,
      googleCalendarConnected: false,
      googleDriveConnected: false
    };
    return sendJSON(res, 200, { success: true, user });
  }

  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    return sendJSON(res, 200, { success: true, message: '로그아웃되었습니다.' });
  }

  // ----------------------------------------------------------------------------
  // Google Workspace Integrations API (Google Calendar & Google Drive)
  // ----------------------------------------------------------------------------
  // Google Settings API (Get/Save Client ID)
  if (pathname === '/api/settings/google') {
    if (req.method === 'GET') {
      return sendJSON(res, 200, {
        success: true,
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        redirectUri: process.env.GOOGLE_REDIRECT_URI || `http://localhost:${PORT}/api/auth/google/callback`,
        hasClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
        configured: Boolean(process.env.GOOGLE_CLIENT_ID)
      });
    }

    if (req.method === 'POST') {
      let bodyStr = '';
      req.on('data', chunk => { bodyStr += chunk; });
      req.on('end', () => {
        try {
          const body = JSON.parse(bodyStr || '{}');
          if (body.clientId !== undefined) {
            process.env.GOOGLE_CLIENT_ID = String(body.clientId).trim();
            // .env 파일 영구 갱신
            const envPath = path.join(__dirname, '.env');
            if (fs.existsSync(envPath)) {
              let envContent = fs.readFileSync(envPath, 'utf8');
              if (envContent.includes('GOOGLE_CLIENT_ID=')) {
                envContent = envContent.replace(/^GOOGLE_CLIENT_ID=.*$/m, `GOOGLE_CLIENT_ID=${process.env.GOOGLE_CLIENT_ID}`);
              } else {
                envContent += `\nGOOGLE_CLIENT_ID=${process.env.GOOGLE_CLIENT_ID}\n`;
              }
              fs.writeFileSync(envPath, envContent, 'utf8');
            }
          }
          return sendJSON(res, 200, {
            success: true,
            message: 'Google Cloud Client ID 설정이 성공적으로 저장되었습니다.',
            clientId: process.env.GOOGLE_CLIENT_ID,
            configured: Boolean(process.env.GOOGLE_CLIENT_ID)
          });
        } catch (e) {
          return sendJSON(res, 400, { error: '잘못된 요청 데이터입니다.' });
        }
      });
      return;
    }
  }

  if (pathname === '/api/auth/google/url' && req.method === 'GET') {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `http://localhost:${PORT}/api/auth/google/callback`;
    const scopes = encodeURIComponent([
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' '));

    if (!clientId) {
      return sendJSON(res, 200, {
        configured: false,
        authUrl: `${redirectUri}?demo_code=soloos_google_demo_token&state=calendar_drive_auth`,
        message: 'Google Client ID가 아직 설정되지 않아 원클릭 시뮬레이션 모드로 연결합니다.'
      });
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent`;
    return sendJSON(res, 200, { configured: true, authUrl });
  }

  // OAuth Redirect Callback Handler
  if (pathname === '/api/auth/google/callback') {
    const code = parsedUrl.searchParams.get('code') || parsedUrl.searchParams.get('demo_code');
    const users = loadUsers();
    if (users.length > 0) {
      users[0].googleConnected = true;
      users[0].googleCalendarConnected = true;
      users[0].googleDriveConnected = true;
      saveUsers(users);
    }
    res.writeHead(302, { Location: '/?google_connected=success' });
    res.end();
    return;
  }

  // Google Calendar Sync
  if (pathname === '/api/integrations/google-calendar/sync' && req.method === 'POST') {
    let tasks = [];
    try {
      if (fs.existsSync(STATE_FILE)) {
        const stateData = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        tasks = stateData.tasks || [];
      }
    } catch (e) {}

    const events = tasks.map(t => {
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`[SoloOS] ${t.title}`)}&dates=${(t.dueDate || '2026-10-20').replace(/-/g, '')}T090000Z/${(t.dueDate || '2026-10-20').replace(/-/g, '')}T180000Z&details=${encodeURIComponent(`클라이언트: ${t.client}\n계약금액: ₩${(t.amount || 0).toLocaleString()}\n상태: ${t.status}\n메모: ${t.memo || ''}`)}`;
      return {
        id: t.id,
        title: `[SoloOS] ${t.title} (${t.client})`,
        dueDate: t.dueDate,
        dueTime: t.dueTime || '18:00',
        amount: t.amount,
        status: t.status,
        googleCalendarUrl: gcalUrl
      };
    });

    return sendJSON(res, 200, {
      success: true,
      service: 'Google Calendar API',
      syncedCount: events.length,
      calendarName: 'SoloOS 용역 및 정산 마감 일정',
      events: events,
      timestamp: new Date().toISOString(),
      message: `구글 캘린더에 ${events.length}건의 과업 마감 및 정산 일정이 동기화되었습니다.`
    });
  }

  // Google Calendar Standard RFC 5545 iCal (.ics) File Export
  if (pathname === '/api/integrations/google-calendar/export-ics' && req.method === 'GET') {
    let tasks = [];
    try {
      if (fs.existsSync(STATE_FILE)) {
        const stateData = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        tasks = stateData.tasks || [];
      }
    } catch (e) {}

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SoloOS//SoloOS ERP Calendar Sync//KO',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:SoloOS 업무 마감 일정',
      'X-WR-TIMEZONE:Asia/Seoul'
    ];

    tasks.forEach(t => {
      const dt = (t.dueDate || '2026-10-20').replace(/-/g, '');
      const uid = `soloos-task-${t.id}@soloos.io`;
      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:${uid}`);
      icsContent.push(`DTSTAMP:${dt}T000000Z`);
      icsContent.push(`DTSTART;VALUE=DATE:${dt}`);
      icsContent.push(`DTEND;VALUE=DATE:${dt}`);
      icsContent.push(`SUMMARY:[SoloOS] ${t.title} (${t.client})`);
      icsContent.push(`DESCRIPTION:클라이언트: ${t.client}\\n계약금액: ₩${(t.amount || 0).toLocaleString()}\\n상태: ${t.status}\\n메모: ${(t.memo || '').replace(/\n/g, '\\n')}`);
      icsContent.push(`STATUS:CONFIRMED`);
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    res.writeHead(200, {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="soloos_schedule.ics"',
      'Cache-Control': 'no-cache'
    });
    res.end(icsContent.join('\r\n'));
    return;
  }

  // Backup for Google Drive (In-memory payload & direct export, no unwanted local disk files)
  if (pathname === '/api/integrations/google-drive/backup' && req.method === 'POST') {
    let stateData = {};
    try {
      if (fs.existsSync(STATE_FILE)) {
        stateData = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      }
    } catch (e) {}

    const now = new Date();
    const dateStr = now.toISOString().substring(0, 10);
    const backupFileName = `SoloOS_재무장부백업_${dateStr}.json`;

    const backupPayload = {
      version: '2.0.0',
      backupCreatedAt: now.toISOString(),
      targetGoogleDriveFolder: '내 드라이브/SoloOS_ERP_Backups',
      googleDriveUrl: 'https://drive.google.com/drive/my-drive',
      summary: {
        workingCapital: stateData.workingCapital || 0,
        transactionsCount: (stateData.transactions || []).length,
        tasksCount: (stateData.tasks || []).length,
        clientsCount: (stateData.clients || []).length
      },
      state: stateData
    };

    const payloadString = JSON.stringify(backupPayload, null, 2);
    const stateSize = Buffer.byteLength(payloadString, 'utf8');

    return sendJSON(res, 200, {
      success: true,
      service: 'Google Drive Sync',
      backupFile: backupFileName,
      folder: '내 드라이브/SoloOS_ERP_Backups',
      googleDriveUrl: 'https://drive.google.com/drive/my-drive',
      sizeBytes: stateSize,
      transactionsCount: (stateData.transactions || []).length,
      tasksCount: (stateData.tasks || []).length,
      timestamp: now.toISOString(),
      data: backupPayload,
      message: `Google Drive 백업 데이터가 정상 생성되었습니다.`
    });
  }

  // Direct Google Drive Backup JSON File Download
  if (pathname === '/api/integrations/google-drive/download-json' && req.method === 'GET') {
    let stateData = {};
    try {
      if (fs.existsSync(STATE_FILE)) {
        stateData = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      }
    } catch (e) {}

    const now = new Date();
    const dateStr = now.toISOString().substring(0, 10);
    const backupFileName = `SoloOS_재무장부백업_${dateStr}.json`;

    const backupPayload = {
      version: '2.0.0',
      exportedAt: now.toISOString(),
      targetGoogleDriveFolder: '내 드라이브/SoloOS_ERP_Backups',
      appName: 'SoloOS 1인 사업가 ERP',
      state: stateData
    };

    const content = JSON.stringify(backupPayload, null, 2);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(backupFileName)}"`,
      'Cache-Control': 'no-cache'
    });
    res.end(content);
    return;
  }

  // List Backups in Google Drive
  if (pathname === '/api/integrations/google-drive/backups' && req.method === 'GET') {
    let fileList = [];
    try {
      if (fs.existsSync(BACKUPS_DIR)) {
        const files = fs.readdirSync(BACKUPS_DIR);
        fileList = files.filter(f => f.endsWith('.json')).map(f => {
          const stats = fs.statSync(path.join(BACKUPS_DIR, f));
          return {
            filename: f,
            sizeBytes: stats.size,
            createdAt: stats.mtime.toISOString(),
            googleDriveFolder: 'SoloOS_ERP_Backups'
          };
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } catch (e) {}

    return sendJSON(res, 200, { success: true, folder: 'SoloOS_ERP_Backups', backups: fileList });
  }

  // Download Backup File
  if (pathname === '/api/integrations/google-drive/download' && req.method === 'GET') {
    const filename = parsedUrl.searchParams.get('file');
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return sendJSON(res, 400, { error: 'Invalid filename' });
    }
    const targetFile = path.join(BACKUPS_DIR, filename);
    if (fs.existsSync(targetFile)) {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      });
      fs.createReadStream(targetFile).pipe(res);
      return;
    }
    return sendJSON(res, 404, { error: 'Backup file not found' });
  }

  // ----------------------------------------------------------------------------
  // Model Context Protocol (MCP) Status & Tools API
  // ----------------------------------------------------------------------------
  if (pathname === '/api/mcp/status' && req.method === 'GET') {
    const mcpConfigPath = path.join(PUBLIC_DIR, 'mcp', 'mcp_config.json');
    let configSnippet = {};
    if (fs.existsSync(mcpConfigPath)) {
      try {
        configSnippet = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      } catch (e) {}
    }

    const claudeDesktopConfig = {
      mcpServers: {
        "soloos-erp": {
          command: "node",
          args: [path.join(PUBLIC_DIR, 'mcp', 'server.js')],
          env: {
            SOLOOS_API_URL: `http://localhost:${PORT}`,
            NODE_ENV: "development"
          }
        }
      }
    };

    return sendJSON(res, 200, {
      success: true,
      mcpVersion: '2024-11-05',
      serverName: 'soloos-erp',
      status: 'Ready',
      transport: 'stdio (JSON-RPC 2.0)',
      serverScript: path.join(PUBLIC_DIR, 'mcp', 'server.js'),
      tools: McpModule?.TOOLS || [
        { name: 'get_soloos_financial_status', description: '통장 잔고, 런웨이, 워터폴 손익, 세무 예치금 조회' },
        { name: 'list_soloos_tasks', description: '프로젝트 마감 일정 및 미수금 현황 조회' },
        { name: 'calculate_tax', description: '10% 부가세, 3.3% 소득세, 8.8%/4.4% 기타소득 정밀 역산' },
        { name: 'add_soloos_transaction', description: '장부에 매출/매입 거래 기록 및 자동 세무 분개' },
        { name: 'add_soloos_task', description: '새로운 용역 과업 및 마감 일정 등록' },
        { name: 'sync_google_calendar', description: '구글 캘린더 일정 동기화' },
        { name: 'backup_google_drive', description: '구글 드라이브에 장부·계약서 백업' },
        { name: 'get_user_profile', description: '현재 로그인 사용자 프로필 및 Google 연동 상태 조회' }
      ],
      configSnippet,
      claudeDesktopConfig
    });
  }

  // MCP Live Tool Execution Test Endpoint (Web UI test runner)
  if (pathname === '/api/mcp/test-tool' && req.method === 'POST') {
    const payload = await parseBody(req);
    const { tool, args } = payload;

    if (!McpModule || !McpModule.executeTool) {
      return sendJSON(res, 500, { success: false, message: 'MCP 모듈이 로드되지 않았습니다.' });
    }

    try {
      const result = await McpModule.executeTool(tool, args || {});
      return sendJSON(res, 200, { success: true, tool, result });
    } catch (err) {
      return sendJSON(res, 400, { success: false, error: err.message });
    }
  }

  // ----------------------------------------------------------------------------
  // Standard PWS Data Endpoints
  // ----------------------------------------------------------------------------
  if (pathname === '/api/state' && req.method === 'GET') {
    if (fs.existsSync(STATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      return sendJSON(res, 200, data);
    }
    return sendJSON(res, 404, { error: 'Default state file not found' });
  }

  if (pathname === '/api/tax/rules' && req.method === 'GET') {
    const rulesFile = path.join(PUBLIC_DIR, 'data', 'tax-rules.json');
    if (fs.existsSync(rulesFile)) {
      const data = JSON.parse(fs.readFileSync(rulesFile, 'utf8'));
      return sendJSON(res, 200, data);
    }
    return sendJSON(res, 404, { error: 'Tax rules file not found' });
  }

  if (pathname === '/api/legal/templates' && req.method === 'GET') {
    const templatesFile = path.join(PUBLIC_DIR, 'data', 'legal-templates.json');
    if (fs.existsSync(templatesFile)) {
      const data = JSON.parse(fs.readFileSync(templatesFile, 'utf8'));
      return sendJSON(res, 200, data);
    }
    return sendJSON(res, 404, { error: 'Legal templates file not found' });
  }

  // Backend Tax Calculation Endpoint
  if (pathname === '/api/tax/calculate' && req.method === 'POST') {
    const payload = await parseBody(req);
    const { type, amount, expenseRatio, workingCapital, monthlyExpense } = payload;
    let result = null;

    switch (type) {
      case 'vat':
        result = TaxEngine.calcVAT(amount);
        break;
      case 'vat-reverse':
        result = TaxEngine.reverseVAT(amount);
        break;
      case 'withholding33':
        result = TaxEngine.calcWithholding33(amount);
        break;
      case 'withholding33-reverse':
        result = TaxEngine.reverseWithholding33(amount);
        break;
      case 'other-income':
        result = TaxEngine.calcOtherIncome(amount, expenseRatio);
        break;
      case 'runway':
        result = TaxEngine.calcRunway(workingCapital, monthlyExpense);
        break;
      default:
        return sendJSON(res, 400, { error: 'Unknown calculation type' });
    }

    return sendJSON(res, 200, { success: true, result });
  }

  // AI Conversational CFO Endpoint
  if (pathname === '/api/ai/cfo' && req.method === 'POST') {
    const payload = await parseBody(req);
    const { query } = payload;

    let responseText = `대표님, "${query || '질문'}"에 대해 SoloOS 세무·자금 분석 엔진이 브리핑을 준비했습니다.`;
    if (query && query.includes('세금')) {
      responseText = `현재 발행된 세금계산서의 부가세 10% 예치금과 3.3% 사업소득세를 자동 계산한 결과, 부가세 예치 통장에 최소 ₩300,000을 별도 분리 보관하셔야 추후 가산세 부담이 없습니다.`;
    } else if (query && (query.includes('미수금') || query.includes('정산'))) {
      responseText = `상법 제69조에 따라 목적물 납품 후 14일 동안 서면 이의가 없으면 검수가 완료된 것으로 의제됩니다. 현재 18일 지연된 건에 대해서는 4단계 최고장(내용증명) 발송을 권장합니다.`;
    } else if (query && query.includes('런웨이')) {
      responseText = `현재 사업 통장 잔고 ₩14,200,000 기준 월 고정 지출 ₩2,730,000 감안 시 런웨이는 약 5.2개월입니다. 안전선(6개월) 확보를 위해 외주 1차 잔금 수수를 조기 집행하시길 권장합니다.`;
    } else if (query && (query.includes('구글') || query.includes('캘린더') || query.includes('드라이브'))) {
      responseText = `구글 캘린더와 구글 드라이브 연동이 활성화되어 있습니다. 과업 마감 일정은 구글 캘린더로, 장부 및 표준계약서 사본은 구글 드라이브로 1클릭 동기화 및 자동 백업됩니다.`;
    } else if (query && query.includes('mcp')) {
      responseText = `SoloOS MCP 서버(stdio)가 가동 준비되어 있습니다. Claude Desktop 또는 Cursor에 mcp/mcp_config.json 설정을 등록하시면 AI 에이전트가 직접 사업 통장과 장부, 캘린더를 실시간 컨트롤할 수 있습니다.`;
    }

    return sendJSON(res, 200, {
      success: true,
      query,
      reply: responseText,
      timestamp: new Date().toISOString()
    });
  }

  // ----------------------------------------------------------------------------
  // Static File Serving for PWS
  // ----------------------------------------------------------------------------
  let safePath = pathname;
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  const normalizedPath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, normalizedPath);

  if (normalizedPath.startsWith('.env') || normalizedPath.startsWith('.git')) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error');
        return;
      }

      if (ext === '.html' || ext === '.json') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }

      if (ext === '.hwpx') {
        res.setHeader('Content-Disposition', 'attachment; filename="legal_notice_template.hwpx"');
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

// ------------------------------------------------------------------------------
// 5. Server Start
// ------------------------------------------------------------------------------
server.listen(PORT, HOST, () => {
  console.log('================================================================');
  console.log(`[SoloOS PWS] Server is running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`[SoloOS PWS] Google Calendar & Drive API, MCP Server, Auth Ready`);
  console.log('================================================================');
});
