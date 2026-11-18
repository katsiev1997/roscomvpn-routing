// Clash Verge Rev: Extend Script (Расширенный скрипт)
// Схема: все по умолчанию DIRECT, через прокси только AI-сервисы.
// Узлы берутся из вашей подписки, правила подписки заменяются.

const AI_GROUP = "🤖 AI";
const SOCIAL_GROUP = "📱 Соцсети";

// Домены соцсетей (суффиксы). Лишнее удалите, нужное добавьте.
const SOCIAL_DOMAINS = [
  // YouTube
  "youtube.com", "youtu.be", "ytimg.com", "googlevideo.com", "ggpht.com",
  "youtube-nocookie.com", "youtubei.googleapis.com", "yt.be",
  // TikTok
  "tiktok.com", "tiktokv.com", "tiktokcdn.com", "tiktokcdn-us.com",
  "byteoversea.com", "ibytedtos.com", "ibyteimg.com", "muscdn.com",
  "musical.ly", "ttwstatic.com", "tiktokw.us",
  // Instagram / Facebook / Meta / Threads / WhatsApp
  "instagram.com", "cdninstagram.com", "facebook.com", "facebook.net",
  "fbcdn.net", "fb.com", "fb.me", "fbsbx.com", "meta.com",
  "threads.net", "threads.com", "whatsapp.com", "whatsapp.net",
  // X / Twitter
  "twitter.com", "x.com", "twimg.com", "t.co",
  // Telegram
  "telegram.org", "t.me", "telegra.ph", "telesco.pe", "tdesktop.com",
  // Discord, Reddit, LinkedIn
  "discord.com", "discord.gg", "discordapp.com", "discordapp.net", "discord.media",
  "reddit.com", "redd.it", "redditmedia.com", "redditstatic.com",
  "linkedin.com", "licdn.com",
];

// IP-сети Telegram (нужны для приложения, оно ходит по IP)
const SOCIAL_CIDR = [
  "91.108.4.0/22", "91.108.8.0/22", "91.108.12.0/22", "91.108.16.0/22",
  "91.108.56.0/22", "149.154.160.0/20",
];
const RAW = "https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Clash/";

function main(config) {
  // 1. Группа AI: только узлы, БЕЗ DIRECT, чтобы не было утечки реального IP.
  //    Если нужна страна/узел, замените include-all на proxies: ["имя узла"].
  const groups = (config["proxy-groups"] || []).filter(g => g.name !== AI_GROUP && g.name !== SOCIAL_GROUP);
  groups.unshift({
    name: AI_GROUP,
    type: "select",
    "include-all": true,
  });
  groups.splice(1, 0, {
    name: SOCIAL_GROUP,
    type: "select",
    "include-all": true,
  });
  config["proxy-groups"] = groups;

  // 2. Готовый набор правил OpenAI + Claude (скачивается через группу AI).
  config["rule-providers"] = Object.assign({}, config["rule-providers"], {
    "ai-proxy": {
      type: "http",
      behavior: "classical",
      format: "yaml",
      interval: 86400,
      url: RAW + "ai-proxy.yaml",
      path: "./ruleset/ai-proxy.yaml",
      proxy: AI_GROUP,
    },
  });

  // 3. Правила: AI -> прокси, локальное и всё остальное -> DIRECT.
  config["rules"] = [
    `RULE-SET,ai-proxy,${AI_GROUP}`,
    // Явно (дублирует набор ai-proxy)
    `DOMAIN,openaicom-api-bdcpf8c6d2e9atf6.z01.azurefd.net,${AI_GROUP}`,
    `DOMAIN,production-openaicom-storage.azureedge.net,${AI_GROUP}`,
    `DOMAIN,openaicomproductionae4b.blob.core.windows.net,${AI_GROUP}`,
    `DOMAIN,cdn.auth0.com,${AI_GROUP}`,
    `DOMAIN,client-api.arkoselabs.com,${AI_GROUP}`,
    `DOMAIN,openai-api.arkoselabs.com,${AI_GROUP}`,
    `DOMAIN,api.anthropic.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,openai.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,chatgpt.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,oaistatic.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,oaiusercontent.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,sora.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,openai.com.cdn.cloudflare.net,${AI_GROUP}`,
    `DOMAIN-SUFFIX,openaiapi-site.azureedge.net,${AI_GROUP}`,
    `DOMAIN-SUFFIX,openaicom.imgix.net,${AI_GROUP}`,
    `DOMAIN-SUFFIX,livekit.cloud,${AI_GROUP}`,
    `DOMAIN-SUFFIX,anthropic.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,claude.ai,${AI_GROUP}`,
    `DOMAIN-SUFFIX,claude.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,claudeusercontent.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,claudemcpcontent.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,clau.de,${AI_GROUP}`,
    `DOMAIN-SUFFIX,claude.dev,${AI_GROUP}`,
    `DOMAIN-SUFFIX,segment.io,${AI_GROUP}`,
    `DOMAIN-SUFFIX,segment.com,${AI_GROUP}`,
    `IP-CIDR,160.79.104.0/21,${AI_GROUP},no-resolve`,
    `IP-CIDR6,2607:6bc0::/32,${AI_GROUP},no-resolve`,

    // Cursor
    `DOMAIN-SUFFIX,cursor.sh,${AI_GROUP}`,
    `DOMAIN-SUFFIX,cursor.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,cursorapi.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,cursor-cdn.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,cursorvm.com,${AI_GROUP}`,
    `DOMAIN-SUFFIX,x.ai,${AI_GROUP}`,
    `DOMAIN-SUFFIX,spacex.ai,${AI_GROUP}`,
    `DOMAIN-SUFFIX,grok.com,${AI_GROUP}`,
    // GitHub Copilot
    `DOMAIN-SUFFIX,githubcopilot.com,${AI_GROUP}`,
    // Gemini
    `DOMAIN,gemini.google.com,${AI_GROUP}`,
    `DOMAIN,aistudio.google.com,${AI_GROUP}`,
    `DOMAIN,generativelanguage.googleapis.com,${AI_GROUP}`,

    // Соцсети
    ...SOCIAL_DOMAINS.map(d => `DOMAIN-SUFFIX,${d},${SOCIAL_GROUP}`),
    ...SOCIAL_CIDR.map(c => `IP-CIDR,${c},${SOCIAL_GROUP},no-resolve`),

    "GEOIP,LAN,DIRECT,no-resolve",
    "MATCH,DIRECT",
  ];

  return config;
}
