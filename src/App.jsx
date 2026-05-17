import React, { useState, useEffect, useCallback } from "react";
import Overview     from "./components/tabs/Overview";
import Vendas       from "./components/tabs/Vendas";
import Estoque      from "./components/tabs/Estoque";
import Pedidos      from "./components/tabs/Pedidos";
import LoginPage    from "./components/LoginPage";
import SettingsPage from "./components/SettingsPage";
import { MOCK, fetchSheetRange, parsePedidos, parseAlertas } from "./data/mockData";
import { isAuthenticated, logout } from "./auth";
import CONFIG from "./config";

const TABS = [
  { id:"overview",  label:"Visão Geral",  icon:"📊" },
  { id:"vendas",    label:"Vendas",       icon:"💰" },
  { id:"estoque",   label:"Estoque",      icon:"📦" },
  { id:"pedidos",   label:"Pedidos",      icon:"🛒" },
  { id:"settings",  label:"Integrações",  icon:"⚙️" },
];

export default function App() {
  const [authed,      setAuthed]      = useState(isAuthenticated());
  const [activeTab,   setActiveTab]   = useState("overview");
  const [data,        setData]        = useState(MOCK);
  const [lastUpdate,  setLastUpdate]  = useState(new Date());
  const [isLive,      setIsLive]      = useState(false);
  const [showLogout,  setShowLogout]  = useState(false);

  const gs = CONFIG.googleSheets;

  const loadLiveData = useCallback(async () => {
    if (!gs.sheetId || gs.sheetId.includes("AQUI")) return;
    try {
      const [estRows, pedRows] = await Promise.all([
        fetchSheetRange(gs.ranges.estoque),
        fetchSheetRange(gs.ranges.pedidos),
      ]);
      if (pedRows || estRows) {
        setData(prev => ({
          ...prev,
          ultimosPedidos: parsePedidos(pedRows),
          estoqueAlertas: parseAlertas(estRows),
        }));
        setIsLive(true);
        setLastUpdate(new Date());
      }
    } catch (e) {
      console.warn("Live data fetch failed");
    }
  }, [gs.sheetId, gs.ranges]);

  useEffect(() => {
    if (!authed) return;
    loadLiveData();
    const id = setInterval(loadLiveData, gs.refreshIntervalMs);
    return () => clearInterval(id);
  }, [authed, loadLiveData, gs.refreshIntervalMs]);

  function handleLogout() { logout(); setAuthed(false); }

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#0f0c1a 0%,#130f23 50%,#0a0f1a 100%)",
      fontFamily:"'DM Sans','Segoe UI',sans-serif",
      color:"#f1f5f9",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-thumb { background:rgba(192,132,252,0.3); border-radius:3px; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background:"rgba(255,255,255,0.02)",
        borderBottom:"1px solid rgba(255,255,255,0.06)",
        padding:"14px 32px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        backdropFilter:"blur(12px)",
        position:"sticky", top:0, zIndex:100,
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:"linear-gradient(135deg,#c084fc,#818cf8)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:16, fontWeight:800, color:"white",
          }}>G</div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, letterSpacing:-0.3 }}>Galene</div>
            <div style={{ fontSize:10, color:"#475569" }}>Dashboard de Vendas & Estoque</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding:"7px 16px", borderRadius:8, border:"none", cursor:"pointer",
              fontSize:12, fontWeight:600,
              background: activeTab===t.id
                ? (t.id==="settings" ? "rgba(251,146,60,0.15)" : "linear-gradient(135deg,#c084fc,#818cf8)")
                : "rgba(255,255,255,0.04)",
              color: activeTab===t.id
                ? (t.id==="settings" ? "#fb923c" : "white")
                : "#64748b",
              border: activeTab===t.id && t.id==="settings" ? "1px solid rgba(251,146,60,0.3)" : "1px solid transparent",
              transition:"all 0.2s",
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Right: status + user */}
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{
              width:7, height:7, borderRadius:"50%",
              background: isLive ? "#34d399" : "#475569",
              animation: isLive ? "pulse 2s infinite" : "none",
            }} />
            <span style={{ fontSize:11, color:"#475569" }}>
              {isLive ? "Ao vivo" : "Demo"} · {lastUpdate.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}
            </span>
          </div>

          {/* User menu */}
          <div style={{ position:"relative" }}>
            <button
              onClick={() => setShowLogout(s => !s)}
              style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"6px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.08)",
                background:"rgba(255,255,255,0.04)", cursor:"pointer", color:"#94a3b8", fontSize:12,
              }}>
              <div style={{
                width:24, height:24, borderRadius:6,
                background:"linear-gradient(135deg,#c084fc,#818cf8)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:700, color:"white",
              }}>G</div>
              galene ▾
            </button>
            {showLogout && (
              <div style={{
                position:"absolute", right:0, top:"calc(100% + 6px)",
                background:"#1a1625", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, overflow:"hidden", minWidth:140, zIndex:200,
                boxShadow:"0 16px 40px rgba(0,0,0,0.5)",
              }}>
                <button
                  onClick={() => { setActiveTab("settings"); setShowLogout(false); }}
                  style={{ width:"100%", padding:"10px 16px", background:"none", border:"none", color:"#94a3b8", fontSize:12, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:8 }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                  onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  ⚙️ Integrações
                </button>
                <div style={{ height:1, background:"rgba(255,255,255,0.07)" }} />
                <button
                  onClick={handleLogout}
                  style={{ width:"100%", padding:"10px 16px", background:"none", border:"none", color:"#f87171", fontSize:12, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:8 }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.08)"}
                  onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  🚪 Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding:"28px 32px", maxWidth:1400, margin:"0 auto" }} key={activeTab}>
        {activeTab==="overview" && <Overview data={data} />}
        {activeTab==="vendas"   && <Vendas   data={data} />}
        {activeTab==="estoque"  && <Estoque  data={data} />}
        {activeTab==="pedidos"  && <Pedidos  data={data} />}
        {activeTab==="settings" && <SettingsPage />}
      </div>

      {/* Click-outside to close user menu */}
      {showLogout && (
        <div style={{ position:"fixed", inset:0, zIndex:150 }} onClick={() => setShowLogout(false)} />
      )}
    </div>
  );
}
