import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Regex of known terminal scripts, unauthorized CLI crawlers & security scanners
const BAD_USER_AGENTS =
  /python-requests|python-httpx|aiohttp|python\/|wget|curl|lwspanel|siteradar|defaultsexposed|agenttrustbot|semrushbot|ahrefsbot|sqlmap|nikto|nmap|masscan|dirbuster|gobuster|censys|shodan|zgrab|acunetix|nuclei|whatweb|wprecon|wpscan|hydra|metasploit|netsparker|openvas|qualys/i;

// 2. Sensitive project files, hidden credentials, and framework internals
const FORBIDDEN_FILE_PATHS =
  /^\/(\.env.*|\.git.*|\.svn|\.hg|\.ssh|\.aws|id_rsa.*|id_dsa.*|id_ed25519.*|package\.json|package-lock\.json|bun\.lock|tsconfig\.json|firebase-applet-config\.json|firebase-blueprint\.json|next\.config\.js|server\.ts|server\.js)$/i;

// 3. Known exploit, traversal, CMS & vulnerability probes
const EXPLOIT_PATH_PATTERNS =
  /(\.\.|\/etc\/passwd|\/etc\/shadow|boot\.ini|win\.ini|\/bin\/sh|\/bin\/bash|cmd\.exe|powershell|wp-admin|wp-login|wp-content|wp-includes|xmlrpc\.php|setup\.php|install\.php|phpinfo|info\.php|test\.php|phpmyadmin|pma|adminer|\.(php|asp|aspx|jsp|cgi|pl|sql|bak|old|orig|swp|tar|gz|zip)($|\?))/i;

// 4. SQL Injection, Code Execution & Exploit query strings
const MALICIOUS_QUERY_PATTERNS =
  /(union(\s+|\/\*.*\*\/)+(all\s+)?select|information_schema|concat\(|select\s+.*\s+from|drop\s+table|insert\s+into|or\s+1\s*=\s*1|'\s*or\s*'1'\s*=\s*'1|eval\(|base64_decode|passthru\(|shell_exec\(|system\(|\$\{jndi:|<script[\s>]|javascript:|onerror\s*=|onload\s*=)/i;

/**
 * Build a styled HTML denial page for browser requests
 */
function createRejectionHtml(reason: string, ua: string, path: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>403 — BRO ARRETE PARDON</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0a0a0d;
      color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: rgba(18, 18, 24, 0.95);
      border: 1px solid rgba(239, 68, 68, 0.35);
      box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.25);
      border-radius: 1rem;
      max-width: 600px;
      width: 100%;
      padding: 2.25rem;
      text-align: center;
    }
    .badge {
      display: inline-block;
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
    }
    h1 {
      color: #ef4444;
      font-size: 2.25rem;
      font-weight: 900;
      letter-spacing: -0.025em;
      margin-bottom: 0.75rem;
      line-height: 1.1;
      text-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
    }
    p.lead {
      color: #a1a1aa;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .terminal-box {
      background: #050507;
      border: 1px solid #27272a;
      border-radius: 0.5rem;
      padding: 1rem;
      text-align: left;
      font-size: 0.8rem;
      color: #71717a;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      margin-bottom: 1.75rem;
      overflow-x: auto;
    }
    .terminal-box .key { color: #ef4444; }
    .terminal-box .val { color: #e4e4e7; }
    .home-btn {
      display: inline-block;
      background: #ef4444;
      color: #0a0a0d;
      font-weight: 700;
      font-size: 0.875rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.2s;
    }
    .home-btn:hover {
      background: #f87171;
      transform: scale(1.02);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🛡️ Bouclier Sentinel Actif • 403 Forbidden</div>
    <h1>BRO ARRETE PARDON</h1>
    <p class="lead">
      Une tentative d'intrusion, de scan automatisé ou l'utilisation d'un script de terminal non autorisé a été détectée et immédiatement neutralisée.
    </p>

    <div class="terminal-box">
      <div><span class="key">Action:</span> <span class="val">Accès strictement rejeté (HTTP 403)</span></div>
      <div><span class="key">Message:</span> <span class="val">BRO ARRETE PARDON</span></div>
      <div><span class="key">Motif:</span> <span class="val">${reason}</span></div>
      <div><span class="key">Cible:</span> <span class="val">${path}</span></div>
      <div><span class="key">Agent:</span> <span class="val">${ua ? ua.substring(0, 80) : "Non renseigné"}</span></div>
      <div><span class="key">Protection:</span> <span class="val">Anti-Script / Anti-Hack Sentinel Shield</span></div>
    </div>

    <a href="/" class="home-btn">Retourner sur le site sécurisé</a>
  </div>
</body>
</html>`;
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const userAgent = request.headers.get("user-agent") || "";
  const acceptHeader = request.headers.get("accept") || "";
  const url = request.nextUrl.clone();
  const { pathname, search } = url;

  // =========================================================================
  // A. ANTI-HACK & TERMINAL SCRIPT DEFENSE SHIELD ("BRO ARRETE PARDON")
  // =========================================================================
  let isMalicious = false;
  let blockReason = "";

  // 1. Check for unauthorized terminal script or crawler user-agent
  if (userAgent && BAD_USER_AGENTS.test(userAgent)) {
    isMalicious = true;
    blockReason = "Script de terminal ou outil automatisé non autorisé (" + userAgent.split("/")[0] + ")";
  }
  // 2. Check for requests attempting to access sensitive project files or secrets
  else if (FORBIDDEN_FILE_PATHS.test(pathname)) {
    isMalicious = true;
    blockReason = "Tentative d'accès non autorisée à un fichier sensible du projet";
  }
  // 3. Check for path traversal or known vulnerability / CMS exploit probes
  else if (EXPLOIT_PATH_PATTERNS.test(pathname)) {
    isMalicious = true;
    blockReason = "Tentative d'exploration de vulnérabilité ou traversée de répertoire";
  }
  // 4. Check for SQL Injection or Code Execution payloads in query parameters
  else if (search && MALICIOUS_QUERY_PATTERNS.test(decodeURIComponent(search))) {
    isMalicious = true;
    blockReason = "Injection de code malveillant ou tentative d'exploitation SQL/XSS";
  }

  // IF AN ATTACK OR TERMINAL SCRIPT IS DETECTED -> REJECT WITH "BRO ARRETE PARDON"
  if (isMalicious) {
    const isJson = acceptHeader.includes("application/json") || pathname.startsWith("/api/");
    const isHtml = acceptHeader.includes("text/html");

    if (isJson) {
      return new NextResponse(
        JSON.stringify({
          error: "BRO ARRETE PARDON",
          status: 403,
          message: "Tentative d'intrusion ou script terminal neutralisé.",
          reason: blockReason,
          defense: "Sentinel Shield Actif",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "X-Shield-Status": "REJECTED",
            "X-Robots-Tag": "noindex, nofollow, noarchive",
          },
        }
      );
    }

    if (isHtml) {
      return new NextResponse(createRejectionHtml(blockReason, userAgent, pathname), {
        status: 403,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Shield-Status": "REJECTED",
          "X-Robots-Tag": "noindex, nofollow, noarchive",
        },
      });
    }

    // Default plain text response for terminal tools (curl, python, wget, etc.)
    const plainTextResponse = `HTTP 403 Forbidden
BRO ARRETE PARDON

[SYSTÈME DE SÉCURITÉ ACTIF]
Action   : Requête immédiatement neutralisée.
Message  : BRO ARRETE PARDON
Motif    : ${blockReason}
Cible    : ${pathname}
Timestamp: ${new Date().toISOString()}
`;

    return new NextResponse(plainTextResponse, {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Shield-Status": "REJECTED",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }

  // =========================================================================
  // B. SUBDOMAIN & ADMIN ROUTING
  // =========================================================================
  const isAdminSubdomain =
    hostname.startsWith("my.") ||
    hostname.startsWith("admin.") ||
    hostname.startsWith("cms.");

  const isLocalOrPreview =
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname.includes(".run.app") ||
    hostname.includes(".vercel.app");

  // 1. Subdomain Access (e.g. my.domainname.site)
  // Automatically rewrite root "/" on subdomain directly to the admin panel
  if (isAdminSubdomain) {
    if (url.pathname === "/") {
      url.pathname = "/admin";
      const response = NextResponse.rewrite(url);
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      response.headers.set("x-is-admin-subdomain", "true");
      return response;
    }
  }

  // 2. Direct "/admin" path on main public domain (not on subdomain and not local preview)
  // Hide and block direct access from main domain -> redirect to home page
  if (url.pathname.startsWith("/admin") && !isAdminSubdomain && !isLocalOrPreview) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next();

  // If visiting /admin routes, enforce strict no-indexing for privacy
  if (url.pathname.startsWith("/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

