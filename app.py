#!/usr/bin/env python3
"""
SoloOS Progressive Web Service (PWS) & API Server (Python Edition)
Compatible with Python 3.8+ (Zero external dependencies required)
Supports REST API endpoints, static file serving, and .env configuration
"""

import http.server
import json
import mimetypes
import os
import pathlib
import sys
import urllib.parse
from datetime import datetime

# ------------------------------------------------------------------------------
# 1. Native .env Loader
# ------------------------------------------------------------------------------
def load_env(env_path=".env"):
    path = pathlib.Path(env_path)
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k not in os.environ:
                    os.environ[k] = v
        print(f"[SoloOS Python] Loaded environment from {env_path}")

load_env()

PORT = int(os.environ.get("PORT", 3000))
HOST = os.environ.get("HOST", "0.0.0.0")
BASE_DIR = pathlib.Path(__file__).parent.resolve()

# ------------------------------------------------------------------------------
# 2. Python Tax & Financial Engine (Backend parity with JS TaxEngine)
# ------------------------------------------------------------------------------
class TaxEngine:
    @staticmethod
    def calc_vat(gross):
        g = round(float(gross or 0))
        tax = round(g * 0.1)
        return {"gross": g, "tax": tax, "net": g + tax, "rate": 0.10, "type": "VAT"}

    @staticmethod
    def reverse_vat(total):
        t = round(float(total or 0))
        gross = round(t / 1.1)
        tax = t - gross
        return {"gross": gross, "tax": tax, "net": t, "rate": 0.10, "type": "VAT"}

    @staticmethod
    def calc_withholding33(gross):
        g = round(float(gross or 0))
        income_tax = int(g * 0.03)
        local_tax = int(income_tax * 0.1)
        total_tax = income_tax + local_tax
        return {
            "gross": g,
            "incomeTax": income_tax,
            "localTax": local_tax,
            "tax": total_tax,
            "net": g - total_tax,
            "effectiveRate": 0.033,
            "type": "3.3%"
        }

    @staticmethod
    def reverse_withholding33(net_amount):
        net = round(float(net_amount or 0))
        if net <= 0:
            return {"gross": 0, "incomeTax": 0, "localTax": 0, "tax": 0, "net": 0}
        gross = round(net / 0.967)
        income_tax = int(gross * 0.03)
        local_tax = int(income_tax * 0.1)
        total_tax = income_tax + local_tax
        return {
            "gross": gross,
            "incomeTax": income_tax,
            "localTax": local_tax,
            "tax": total_tax,
            "net": gross - total_tax,
            "effectiveRate": 0.033,
            "type": "3.3%"
        }

    @staticmethod
    def calc_other_income(gross, expense_ratio=0.60):
        g = round(float(gross or 0))
        recognized_exp = int(g * expense_ratio)
        taxable = g - recognized_exp
        income_tax = int(taxable * 0.20)
        local_tax = int(income_tax * 0.10)
        total_tax = income_tax + local_tax
        eff_rate = round((total_tax / g * 100), 2) if g > 0 else 0
        return {
            "gross": g,
            "recognizedExpense": recognized_exp,
            "taxableIncome": taxable,
            "incomeTax": income_tax,
            "localTax": local_tax,
            "tax": total_tax,
            "net": g - total_tax,
            "expenseRatio": expense_ratio,
            "effectiveRate": eff_rate
        }

    @staticmethod
    def calc_runway(working_capital, monthly_expense):
        wc = float(working_capital or 0)
        me = float(monthly_expense or 1)
        months = round(wc / me, 1)
        return {
            "workingCapital": wc,
            "monthlyFixedExpense": me,
            "runwayMonths": months,
            "isSafe": months >= 6.0,
            "isWarning": months < 3.0
        }

# ------------------------------------------------------------------------------
# 3. HTTP Request Handler
# ------------------------------------------------------------------------------
class SoloOSRequestHandler(http.server.BaseHTTPRequestHandler):
    server_version = "SoloOS-PWS/2.0.0"

    def _set_headers(self, status=200, content_type="application/json; charset=utf-8"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def _send_json(self, status, data):
        self._set_headers(status, "application/json; charset=utf-8")
        self.wfile.write(json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8"))

    def _read_body(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length > 0:
            body_bytes = self.rfile.read(content_length)
            try:
                return json.loads(body_bytes.decode("utf-8"))
            except Exception:
                return {}
        return {}

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        pathname = parsed.path

        # Health Checks
        if pathname in ["/healthz", "/livez", "/_ah/health", "/api/healthz"]:
            return self._send_json(200, {
                "status": "UP",
                "service": "SoloOS Python PWS Engine",
                "timestamp": datetime.now().isoformat()
            })

        # Public Configuration
        if pathname == "/api/config":
            return self._send_json(200, {
                "appName": os.environ.get("APP_NAME", "SoloOS ERP"),
                "appUrl": os.environ.get("APP_URL", f"http://localhost:{PORT}"),
                "env": os.environ.get("NODE_ENV", "development"),
                "firebase": {
                    "projectId": os.environ.get("FIREBASE_PROJECT_ID", "soloos-erp"),
                    "apiKey": os.environ.get("FIREBASE_API_KEY", ""),
                    "authDomain": os.environ.get("FIREBASE_AUTH_DOMAIN", "soloos-erp.firebaseapp.com"),
                    "storageBucket": os.environ.get("FIREBASE_STORAGE_BUCKET", "soloos-erp.appspot.com"),
                    "messagingSenderId": os.environ.get("FIREBASE_MESSAGING_SENDER_ID", ""),
                    "appId": os.environ.get("FIREBASE_APP_ID", "")
                },
                "hasGemini": bool(os.environ.get("GEMINI_API_KEY"))
            })

        # Default State JSON
        if pathname == "/api/state":
            file_path = BASE_DIR / "data" / "default-state.json"
            if file_path.exists():
                with open(file_path, "r", encoding="utf-8") as f:
                    return self._send_json(200, json.load(f))
            return self._send_json(404, {"error": "State file not found"})

        # Tax Rules JSON
        if pathname == "/api/tax/rules":
            file_path = BASE_DIR / "data" / "tax-rules.json"
            if file_path.exists():
                with open(file_path, "r", encoding="utf-8") as f:
                    return self._send_json(200, json.load(f))
            return self._send_json(404, {"error": "Tax rules file not found"})

        # Legal Templates JSON
        if pathname == "/api/legal/templates":
            file_path = BASE_DIR / "data" / "legal-templates.json"
            if file_path.exists():
                with open(file_path, "r", encoding="utf-8") as f:
                    return self._send_json(200, json.load(f))
            return self._send_json(404, {"error": "Legal templates file not found"})

        # Static File Serving
        self._serve_static(pathname)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        pathname = parsed.path
        body = self._read_body()

        # Backend Tax Calculation
        if pathname == "/api/tax/calculate":
            calc_type = body.get("type")
            amount = body.get("amount", 0)
            res = None

            if calc_type == "vat":
                res = TaxEngine.calc_vat(amount)
            elif calc_type == "vat-reverse":
                res = TaxEngine.reverse_vat(amount)
            elif calc_type == "withholding33":
                res = TaxEngine.calc_withholding33(amount)
            elif calc_type == "withholding33-reverse":
                res = TaxEngine.reverse_withholding33(amount)
            elif calc_type == "other-income":
                res = TaxEngine.calc_other_income(amount, body.get("expenseRatio", 0.60))
            elif calc_type == "runway":
                res = TaxEngine.calc_runway(body.get("workingCapital", 0), body.get("monthlyExpense", 1))
            else:
                return self._send_json(400, {"error": "Unknown calculation type"})

            return self._send_json(200, {"success": True, "result": res})

        # Conversational CFO AI
        if pathname == "/api/ai/cfo":
            query = body.get("query", "")
            reply = f"대표님, '{query}' 문의에 대한 SoloOS 분석 브리핑입니다."
            if "세금" in query:
                reply = "10% 부가세 및 3.3% 사업소득세 원천징수분을 감안하여 최소 ₩300,000을 세무 분리 통장에 예치하시기를 권장합니다."
            elif "미수금" in query or "정산" in query:
                reply = "상법 제69조에 따라 14일 검수 의제 기한이 경과한 미수금 건은 4단계 내용증명 우편 통보를 진행할 수 있습니다."
            elif "런웨이" in query:
                reply = "현재 잔고 ₩14,200,000 기준 런웨이는 5.2개월입니다. 안정적인 6개월 이상 유지를 위해 외주 잔금 청구를 진행하세요."

            return self._send_json(200, {
                "success": True,
                "query": query,
                "reply": reply,
                "timestamp": datetime.now().isoformat()
            })

        return self._send_json(404, {"error": "API route not found"})

    def _serve_static(self, pathname):
        if pathname in ["/", ""]:
            pathname = "/index.html"

        # Sanitize path
        rel_path = pathname.lstrip("/")
        file_path = (BASE_DIR / rel_path).resolve()

        # Security check: prevent directory traversal or accessing hidden/env files
        if not str(file_path).startswith(str(BASE_DIR)) or any(p.startswith(".") for p in file_path.parts[len(BASE_DIR.parts):]):
            self._set_headers(403, "text/plain; charset=utf-8")
            self.wfile.write(b"403 Forbidden")
            return

        if not file_path.exists() or not file_path.is_file():
            # SPA Fallback
            file_path = BASE_DIR / "index.html"

        mime_type, _ = mimetypes.guess_type(str(file_path))
        if not mime_type:
            if file_path.suffix == ".hwpx":
                mime_type = "application/octet-stream"
            elif file_path.suffix == ".json":
                mime_type = "application/json"
            else:
                mime_type = "application/octet-stream"

        try:
            with open(file_path, "rb") as f:
                content = f.read()

            self.send_response(200)
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_header("X-Content-Type-Options", "nosniff")
            if file_path.suffix in [".html", ".json"]:
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            else:
                self.send_header("Cache-Control", "public, max-age=86400")

            if file_path.suffix == ".hwpx":
                self.send_header("Content-Disposition", 'attachment; filename="legal_notice_template.hwpx"')

            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self._set_headers(500, "text/plain; charset=utf-8")
            self.wfile.write(f"500 Internal Error: {e}".encode("utf-8"))

# ------------------------------------------------------------------------------
# 4. Main Entry Point
# ------------------------------------------------------------------------------
def run():
    server_address = (HOST, PORT)
    httpd = http.server.ThreadingHTTPServer(server_address, SoloOSRequestHandler)
    print("=" * 64)
    print(f"[SoloOS Python PWS] Server is running at http://{'localhost' if HOST == '0.0.0.0' else HOST}:{PORT}")
    print(f"[SoloOS Python PWS] Environment: {os.environ.get('NODE_ENV', 'development')}")
    print(f"[SoloOS Python PWS] REST API & Firebase PWS Ready")
    print("=" * 64)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[SoloOS Python PWS] Stopping server...")
        httpd.server_close()

if __name__ == "__main__":
    run()
