/**
 * SoloOS Modal: Model Context Protocol (MCP) Integration Modal
 * Stdio JSON-RPC configuration, Claude Desktop & Cursor IDE snippets, tool execution tests
 */

    // --- MCP Modal Handlers ---
    let mcpStatusCache = null;

    function openMcpModal(tab = 'config') {
      const modal = document.getElementById('mcpModal');
      if (modal) modal.classList.remove('hidden');
      switchMcpTab(tab);
      loadMcpStatus();
    }

    function closeMcpModal() {
      const modal = document.getElementById('mcpModal');
      if (modal) modal.classList.add('hidden');
    }

    function switchMcpTab(tab) {
      const tabConfig = document.getElementById('mcpTabConfig');
      const tabTools = document.getElementById('mcpTabTools');
      const tabPrompts = document.getElementById('mcpTabPrompts');
      const btnConfig = document.getElementById('mcpTabBtnConfig');
      const btnTools = document.getElementById('mcpTabBtnTools');
      const btnPrompts = document.getElementById('mcpTabBtnPrompts');

      if (tabConfig) tabConfig.classList.toggle('hidden', tab !== 'config');
      if (tabTools) tabTools.classList.toggle('hidden', tab !== 'tools');
      if (tabPrompts) tabPrompts.classList.toggle('hidden', tab !== 'prompts');

      if (btnConfig) btnConfig.className = tab === 'config' ? 'px-4 py-2.5 text-purple-600 border-b-2 border-purple-600 flex items-center gap-1.5' : 'px-4 py-2.5 text-slate-500 hover:text-slate-900 flex items-center gap-1.5';
      if (btnTools) btnTools.className = tab === 'tools' ? 'px-4 py-2.5 text-purple-600 border-b-2 border-purple-600 flex items-center gap-1.5' : 'px-4 py-2.5 text-slate-500 hover:text-slate-900 flex items-center gap-1.5';
      if (btnPrompts) btnPrompts.className = tab === 'prompts' ? 'px-4 py-2.5 text-purple-600 border-b-2 border-purple-600 flex items-center gap-1.5' : 'px-4 py-2.5 text-slate-500 hover:text-slate-900 flex items-center gap-1.5';

      if (window.lucide) lucide.createIcons();
    }

    async function loadMcpStatus() {
      const pathDisplay = document.getElementById('mcpScriptPathDisplay');
      const claudeBlock = document.getElementById('mcpClaudeConfigBlock');
      const genericBlock = document.getElementById('mcpGenericConfigBlock');

      try {
        const res = await fetch('/api/mcp/status');
        const data = await res.json();
        mcpStatusCache = data;

        if (pathDisplay) pathDisplay.textContent = data.serverScript || '/Users/ssohy/Desktop/Project/DAY22-27/solo-os/mcp/server.js';
        if (claudeBlock) claudeBlock.textContent = JSON.stringify(data.claudeDesktopConfig, null, 2);
        if (genericBlock) genericBlock.textContent = JSON.stringify(data.configSnippet, null, 2);
      } catch (err) {
        const fallbackConfig = {
          mcpServers: {
            "soloos-erp": {
              command: "node",
              args: ["/Users/ssohy/Desktop/Project/DAY22-27/solo-os/mcp/server.js"],
              env: {
                SOLOOS_API_URL: "http://localhost:3000",
                NODE_ENV: "development"
              }
            }
          }
        };
        if (claudeBlock) claudeBlock.textContent = JSON.stringify(fallbackConfig, null, 2);
        if (genericBlock) genericBlock.textContent = JSON.stringify(fallbackConfig, null, 2);
      }
    }

    function copyMcpClaudeConfig() {
      const block = document.getElementById('mcpClaudeConfigBlock');
      const btn = document.getElementById('copyClaudeBtnText');
      if (block) {
        navigator.clipboard.writeText(block.textContent).then(() => {
          if (btn) btn.textContent = '복사 완료!';
          setTimeout(() => { if (btn) btn.textContent = '설정 복사'; }, 2000);
        });
      }
    }

    function copyMcpGenericConfig() {
      const block = document.getElementById('mcpGenericConfigBlock');
      const btn = document.getElementById('copyGenericBtnText');
      if (block) {
        navigator.clipboard.writeText(block.textContent).then(() => {
          if (btn) btn.textContent = '복사 완료!';
          setTimeout(() => { if (btn) btn.textContent = '설정 복사'; }, 2000);
        });
      }
    }

    async function testMcpTool(toolName, args = {}) {
      const statusSpan = document.getElementById('mcpLiveStatus');
      const consoleBlock = document.getElementById('mcpLiveOutputConsole');

      if (statusSpan) statusSpan.textContent = `도구 실행 중... [${toolName}]`;
      if (consoleBlock) consoleBlock.textContent = `// MCP 도구 '${toolName}' 실행을 서버로 전송 중...`;

      try {
        const res = await fetch('/api/mcp/test-tool', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool: toolName, args })
        });
        const data = await res.json();
        if (data.success) {
          if (statusSpan) statusSpan.textContent = `✅ 실행 성공 (200 OK) · ${toolName}`;
          if (consoleBlock) consoleBlock.textContent = JSON.stringify(data.result, null, 2);
        } else {
          if (statusSpan) statusSpan.textContent = `❌ 실행 실패 · ${data.error || '오류'}`;
          if (consoleBlock) consoleBlock.textContent = JSON.stringify(data, null, 2);
        }
      } catch (err) {
        if (statusSpan) statusSpan.textContent = `❌ 네트워크/통신 오류`;
        if (consoleBlock) consoleBlock.textContent = `오류: ${err.message}`;
      }
    }

    



// Expose mcp modal functions to global window
window.openMcpModal = openMcpModal;
window.closeMcpModal = closeMcpModal;
window.switchMcpTab = switchMcpTab;
window.loadMcpStatus = loadMcpStatus;
window.copyMcpClaudeConfig = copyMcpClaudeConfig;
window.copyMcpGenericConfig = copyMcpGenericConfig;
window.testMcpTool = testMcpTool;
