// ─── Galene — Configurações de Integração ────────────────────────────────────
// Este arquivo centraliza TODOS os links e chaves do sistema.
// Preencha cada campo conforme o passo a passo do GUIA_COMPLETO.md

const CONFIG = {

  // ── 1. GOOGLE SHEETS ──────────────────────────────────────────────────────
  // Após subir a planilha no Google Sheets, cole o ID da URL aqui.
  // URL exemplo: https://docs.google.com/spreadsheets/d/ ESTE_TRECHO /edit
  googleSheets: {
    sheetId:  "SEU_GOOGLE_SHEET_ID_AQUI",
    apiKey:   "SUA_GOOGLE_API_KEY_AQUI",      // somente leitura (dashboard)
    ranges: {
      estoque:  "Estoque!A3:P2000",
      pedidos:  "Pedidos!A3:L2000",
      catalogo: "Catalogo!A3:J200",
    },
    refreshIntervalMs: 30000,                  // atualiza a cada 30 segundos
  },

  // ── 2. EVOLUTION API (WhatsApp) ───────────────────────────────────────────
  // URL gerada pelo Railway após o deploy da Evolution API.
  // Exemplo: https://evolution-api-production.up.railway.app
  evolutionApi: {
    baseUrl:      "SUA_URL_EVOLUTION_API_AQUI",
    instanceName: "galene",                    // nome da instância criada
    apiKey:       "SUA_EVOLUTION_API_KEY_AQUI",
    // Webhook que a Evolution vai chamar ao receber mensagem
    // (esta URL é gerada automaticamente pelo n8n)
    webhookUrl:   "SUA_URL_N8N_WEBHOOK_AQUI",
  },

  // ── 3. N8N ────────────────────────────────────────────────────────────────
  // URL do seu workspace n8n.
  // Exemplo: https://seu-nome.app.n8n.cloud
  n8n: {
    baseUrl:    "SUA_URL_N8N_AQUI",
    webhookPath: "/webhook/whatsapp",          // não altere
  },

  // ── 4. OPENAI ─────────────────────────────────────────────────────────────
  // Chave gerada em https://platform.openai.com/api-keys
  // ATENÇÃO: nunca exponha esta chave no frontend em produção.
  // Ela deve ficar apenas no n8n (backend).
  openai: {
    model: "gpt-4o-mini",                      // modelo recomendado (custo-benefício)
    // apiKey fica APENAS no n8n — não coloque aqui
  },

  // ── 5. LOJA ───────────────────────────────────────────────────────────────
  store: {
    name:       "Galene",
    agentName:  "Gabi",                        // nome da assistente virtual
    whatsapp:   "55XXXXXXXXXXX",               // número com DDI+DDD (sem espaços)
    instagram:  "@galene",
    minOrder:   6,                             // mínimo de peças por pedido
    payment:    ["PIX", "Cartão de Crédito"],
  },
};

export default CONFIG;
