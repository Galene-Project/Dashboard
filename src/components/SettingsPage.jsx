import React, { useState } from "react";
import CONFIG from "../config";

const Section = ({ title, icon, children, status }) => {
  const [open, setOpen] = useState(true);
  const colors = {
    ok:      { bg:"rgba(52,211,153,0.1)",  border:"rgba(52,211,153,0.3)",  dot:"#34d399", label:"Conectado"    },
    pending: { bg:"rgba(251,146,60,0.08)", border:"rgba(251,146,60,0.25)", dot:"#fb923c", label:"Configurar"   },
    error:   { bg:"rgba(239,68,68,0.08)",  border:"rgba(239,68,68,0.25)",  dot:"#ef4444", label:"Erro"         },
  };
  const c = colors[status] || colors.pending;
  return (
    <div style={{ marginBottom:16, borderRadius:16, overflow:"hidden", border:`1px solid rgba(255,255,255,0.07)` }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"16px 22px", cursor:"pointer",
          background:"rgba(255,255,255,0.03)",
          transition:"background 0.15s",
        }}
      >
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:18 }}>{icon}</span>
          <span style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>{title}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{
            fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20,
            background:c.bg, border:`1px solid ${c.border}`, color:c.dot,
          }}>{c.label}</span>
          <span style={{ color:"#475569", fontSize:12, transition:"transform 0.2s", display:"inline-block", transform:open?"rotate(90deg)":"" }}>▶</span>
        </div>
      </div>
      {open && (
        <div style={{ padding:"20px 22px 22px", background:"rgba(0,0,0,0.2)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          {children}
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value, placeholder, hint, mono }) => (
  <div style={{ marginBottom:16 }}>
    <div style={{ fontSize:11, fontWeight:600, color:"#94a3b8", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</div>
    <div style={{
      padding:"11px 14px", borderRadius:10,
      background: value && !value.includes("AQUI") ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.04)",
      border:`1.5px solid ${value && !value.includes("AQUI") ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.08)"}`,
      fontSize:12, color: value && !value.includes("AQUI") ? "#34d399" : "#475569",
      fontFamily: mono ? "'DM Mono',monospace" : "inherit",
      wordBreak:"break-all",
    }}>
      {value && !value.includes("AQUI") ? value : placeholder}
      {value && !value.includes("AQUI") && <span style={{ marginLeft:8, fontSize:10 }}>✅</span>}
    </div>
    {hint && <div style={{ fontSize:11, color:"#475569", marginTop:5, lineHeight:1.5 }}>{hint}</div>}
  </div>
);

const Step = ({ n, text }) => (
  <div style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
    <div style={{
      minWidth:22, height:22, borderRadius:"50%",
      background:"linear-gradient(135deg,#c084fc,#818cf8)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:10, fontWeight:800, color:"white", marginTop:1,
    }}>{n}</div>
    <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.6 }}>{text}</div>
  </div>
);

function isConfigured(val) { return val && !val.includes("AQUI"); }

export default function SettingsPage() {
  const gs = CONFIG.googleSheets;
  const ev = CONFIG.evolutionApi;
  const n8 = CONFIG.n8n;
  const st = CONFIG.store;

  const gsOk = isConfigured(gs.sheetId) && isConfigured(gs.apiKey);
  const evOk = isConfigured(ev.baseUrl) && isConfigured(ev.apiKey);
  const n8Ok = isConfigured(n8.baseUrl);

  // Progress
  const done  = [gsOk, evOk, n8Ok].filter(Boolean).length;
  const total = 3;
  const pct   = Math.round((done / total) * 100);

  return (
    <div style={{ maxWidth:860, margin:"0 auto" }}>
      {/* Progress header */}
      <div style={{
        background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"24px 28px", marginBottom:24,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#e2e8f0" }}>Progresso da Configuração</div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{done} de {total} integrações conectadas</div>
          </div>
          <div style={{ fontSize:28, fontWeight:800, color: pct===100?"#34d399":"#c084fc", fontFamily:"'DM Mono',monospace" }}>{pct}%</div>
        </div>
        <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden" }}>
          <div style={{
            height:"100%", width:`${pct}%`, borderRadius:4,
            background: pct===100 ? "linear-gradient(90deg,#34d399,#059669)" : "linear-gradient(90deg,#c084fc,#818cf8)",
            transition:"width 0.8s ease",
          }} />
        </div>
        {pct < 100 && (
          <div style={{ marginTop:12, fontSize:12, color:"#64748b" }}>
            📋 Abra o arquivo <code style={{ background:"rgba(255,255,255,0.07)", padding:"1px 6px", borderRadius:4, color:"#c084fc" }}>src/config.js</code> e preencha os campos marcados com <code style={{ background:"rgba(255,255,255,0.07)", padding:"1px 6px", borderRadius:4, color:"#fb923c" }}>AQUI</code>
          </div>
        )}
        {pct === 100 && (
          <div style={{ marginTop:12, fontSize:12, color:"#34d399", fontWeight:600 }}>
            🎉 Todas as integrações configuradas! Seu sistema está pronto.
          </div>
        )}
      </div>

      {/* Google Sheets */}
      <Section title="Google Sheets" icon="📊" status={gsOk ? "ok" : "pending"}>
        <Field label="Sheet ID" value={gs.sheetId} placeholder="Cole o ID da planilha aqui"
          mono hint="Encontre na URL da planilha: docs.google.com/spreadsheets/d/ [ID] /edit" />
        <Field label="API Key (leitura)" value={gs.apiKey} placeholder="Cole sua chave de API aqui"
          mono hint="Gerada no Google Cloud Console → APIs & Services → Credentials" />
        <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#64748b", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.05em" }}>Como configurar</div>
          <Step n={1} text="Abra a planilha Catalogo_Galene_v2.xlsx no Google Sheets" />
          <Step n={2} text="Arquivo → Compartilhar → Publicar na web → Publicar" />
          <Step n={3} text="Copie o ID da URL da planilha (entre /d/ e /edit)" />
          <Step n={4} text="Acesse console.cloud.google.com → ative Google Sheets API" />
          <Step n={5} text="Credentials → Create API Key → copie a chave" />
          <Step n={6} text='Cole ambos no arquivo src/config.js e faça commit no GitHub' />
        </div>
      </Section>

      {/* Evolution API */}
      <Section title="Evolution API (WhatsApp)" icon="💬" status={evOk ? "ok" : "pending"}>
        <Field label="URL da Evolution API" value={ev.baseUrl} placeholder="https://evolution-api-xxxx.up.railway.app"
          mono hint="Gerada pelo Railway após o deploy — Settings → Networking → Domain" />
        <Field label="API Key" value={ev.apiKey} placeholder="Cole a chave da Evolution API"
          mono hint="Encontrada nas configurações da Evolution API → Global Settings" />
        <Field label="Instance Name" value={ev.instanceName} placeholder="galene"
          hint="Nome da instância criada na Evolution API (padrão: galene)" />
        <Field label="Webhook URL (n8n)" value={ev.webhookUrl} placeholder="https://xxx.app.n8n.cloud/webhook/whatsapp"
          mono hint="URL gerada pelo nó Webhook no n8n — copie após criar o workflow" />
        <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#64748b", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.05em" }}>Como configurar</div>
          <Step n={1} text="Crie conta em railway.app → New Project → Deploy from GitHub" />
          <Step n={2} text="Pesquise e selecione EvolutionAPI/evolution-api → Deploy Now" />
          <Step n={3} text="Aguarde ~3 min → Settings → Networking → Generate Domain" />
          <Step n={4} text="Acesse SUA_URL/manager → Create Instance → nome: galene" />
          <Step n={5} text="Clique em Connect → QR Code → escaneie com o WhatsApp" />
          <Step n={6} text="Em Webhook, cole a URL do n8n e ative o evento messages.upsert" />
        </div>
      </Section>

      {/* n8n */}
      <Section title="n8n (Automações)" icon="⚙️" status={n8Ok ? "ok" : "pending"}>
        <Field label="URL do n8n" value={n8.baseUrl} placeholder="https://seu-nome.app.n8n.cloud"
          mono hint="URL do seu workspace no n8n Cloud" />
        <Field label="Webhook Path" value={n8.webhookPath} placeholder="/webhook/whatsapp"
          hint="Caminho padrão — não altere" />
        <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#64748b", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.05em" }}>Como configurar</div>
          <Step n={1} text="Crie conta em n8n.io → Get Started for Free" />
          <Step n={2} text="Anote sua URL (ex: nome.app.n8n.cloud) e cole acima" />
          <Step n={3} text="Em Credentials: adicione OpenAI com sua API Key" />
          <Step n={4} text="Em Credentials: adicione Google Sheets com o JSON da conta de serviço" />
          <Step n={5} text="Crie o workflow seguindo o GUIA_COMPLETO.md (8 nós)" />
          <Step n={6} text="Copie a URL do nó Webhook → cole no campo Webhook URL acima" />
        </div>
      </Section>

      {/* Loja */}
      <Section title="Dados da Loja" icon="🏪" status="ok">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="Nome da loja"      value={st.name}      placeholder="Galene" />
          <Field label="Nome do agente IA" value={st.agentName} placeholder="Gabi" />
          <Field label="WhatsApp"          value={st.whatsapp}  placeholder="55XXXXXXXXXXX" mono />
          <Field label="Instagram"         value={st.instagram} placeholder="@galene" />
          <Field label="Pedido mínimo"     value={`${st.minOrder} peças`} placeholder="6 peças" />
          <Field label="Pagamento"         value={st.payment.join(", ")} placeholder="PIX, Cartão" />
        </div>
        <div style={{ marginTop:12, fontSize:12, color:"#64748b" }}>
          ✏️ Para alterar, edite o objeto <code style={{ background:"rgba(255,255,255,0.07)", padding:"1px 6px", borderRadius:4, color:"#c084fc" }}>store</code> em <code style={{ background:"rgba(255,255,255,0.07)", padding:"1px 6px", borderRadius:4, color:"#c084fc" }}>src/config.js</code>
        </div>
      </Section>

      {/* Links úteis */}
      <div style={{
        background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"20px 22px",
      }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0", marginBottom:16 }}>🔗 Links Úteis</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {[
            { label:"Google Cloud Console", url:"https://console.cloud.google.com",       icon:"☁️" },
            { label:"Railway (Evolution)",  url:"https://railway.app",                    icon:"🚂" },
            { label:"n8n Cloud",            url:"https://n8n.io",                         icon:"⚙️" },
            { label:"OpenAI Platform",      url:"https://platform.openai.com",            icon:"🤖" },
            { label:"Vercel",               url:"https://vercel.com",                     icon:"▲" },
            { label:"GitHub",               url:"https://github.com",                     icon:"🐙" },
          ].map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"10px 14px", borderRadius:10,
              background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
              color:"#94a3b8", fontSize:12, textDecoration:"none",
              transition:"all 0.2s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(192,132,252,0.08)"; e.currentTarget.style.color="#c084fc";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.color="#94a3b8";}}>
              <span>{l.icon}</span> {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
