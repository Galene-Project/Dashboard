import React, { useState, useEffect } from "react";
import { login } from "../auth";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  async function handleSubmit() {
    if (!username || !password) { setError("Preencha usuário e senha."); return; }
    setLoading(true);
    setError("");
    // Simula delay de rede
    await new Promise(r => setTimeout(r, 700));
    if (login(username, password)) {
      onLogin();
    } else {
      setError("Usuário ou senha incorretos.");
      setLoading(false);
    }
  }

  function handleKey(e) { if (e.key === "Enter") handleSubmit(); }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080612",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Outfit', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes fadeIn   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes blob1    { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-20px) scale(1.1)} 66%{transform:translate(-20px,30px) scale(0.95)} }
        @keyframes blob2    { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,25px) scale(1.05)} 66%{transform:translate(35px,-15px) scale(0.9)} }
        @keyframes shimmer  { from{background-position:-200% 0} to{background-position:200% 0} }
        .login-input {
          width:100%; padding:14px 18px; border-radius:12px;
          background:rgba(255,255,255,0.05);
          border:1.5px solid rgba(255,255,255,0.1);
          color:#f1f5f9; font-size:14px; font-family:'Outfit',sans-serif;
          outline:none; transition:border-color 0.2s, background 0.2s;
        }
        .login-input:focus { border-color:rgba(192,132,252,0.7); background:rgba(192,132,252,0.06); }
        .login-input::placeholder { color:#475569; }
        .login-btn {
          width:100%; padding:15px; border-radius:12px; border:none;
          font-size:15px; font-weight:700; font-family:'Outfit',sans-serif;
          cursor:pointer; transition:all 0.25s; letter-spacing:0.03em;
        }
        .login-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 40px rgba(192,132,252,0.4); }
        .login-btn:active:not(:disabled) { transform:translateY(0); }
      `}</style>

      {/* Animated background blobs */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{
          position:"absolute", top:"15%", left:"10%",
          width:500, height:500, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(139,58,139,0.18) 0%,transparent 70%)",
          animation:"blob1 14s ease-in-out infinite",
        }} />
        <div style={{
          position:"absolute", bottom:"20%", right:"8%",
          width:420, height:420, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)",
          animation:"blob2 18s ease-in-out infinite",
        }} />
        <div style={{
          position:"absolute", top:"50%", left:"50%",
          width:600, height:2,
          background:"linear-gradient(90deg,transparent,rgba(192,132,252,0.08),transparent)",
          transform:"translateX(-50%)",
        }} />
        {/* Grid texture */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize:"40px 40px",
        }} />
      </div>

      {/* Card */}
      <div style={{
        position:"relative", zIndex:10,
        width:"100%", maxWidth:420,
        padding:"0 24px",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "none" : "translateY(24px)",
        transition:"opacity 0.6s ease, transform 0.6s ease",
      }}>
        {/* Logo mark */}
        <div style={{ textAlign:"center", marginBottom:36, animation:"float 4s ease-in-out infinite" }}>
          <div style={{
            display:"inline-flex", alignItems:"center", justifyContent:"center",
            width:64, height:64, borderRadius:20,
            background:"linear-gradient(135deg,#c084fc 0%,#818cf8 100%)",
            boxShadow:"0 0 40px rgba(192,132,252,0.4), 0 0 80px rgba(192,132,252,0.15)",
            fontSize:28, fontWeight:900, color:"white",
            marginBottom:16,
          }}>G</div>
          <div style={{ fontSize:26, fontWeight:800, color:"#f1f5f9", letterSpacing:-0.5 }}>Galene</div>
          <div style={{ fontSize:13, color:"#64748b", marginTop:4, fontWeight:400 }}>
            Dashboard de Vendas & Estoque
          </div>
        </div>

        {/* Form card */}
        <div style={{
          background:"rgba(255,255,255,0.03)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:24,
          padding:"36px 32px",
          backdropFilter:"blur(20px)",
          boxShadow:"0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}>
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:18, fontWeight:700, color:"#f1f5f9", marginBottom:4 }}>Bem-vinda de volta 👋</div>
            <div style={{ fontSize:13, color:"#64748b" }}>Entre para acessar o painel</div>
          </div>

          {/* Username */}
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"#94a3b8", display:"block", marginBottom:8, letterSpacing:"0.04em", textTransform:"uppercase" }}>
              Usuário
            </label>
            <input
              className="login-input"
              type="text"
              placeholder="seu usuário"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(""); }}
              onKeyDown={handleKey}
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"#94a3b8", display:"block", marginBottom:8, letterSpacing:"0.04em", textTransform:"uppercase" }}>
              Senha
            </label>
            <div style={{ position:"relative" }}>
              <input
                className="login-input"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={handleKey}
                autoComplete="current-password"
                style={{ paddingRight:48 }}
              />
              <button onClick={() => setShowPass(s => !s)} style={{
                position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer",
                color:"#64748b", fontSize:16, padding:4,
              }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom:16, padding:"10px 14px", borderRadius:10,
              background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)",
              color:"#fca5a5", fontSize:13, display:"flex", alignItems:"center", gap:8,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Button */}
          <button className="login-btn" onClick={handleSubmit} disabled={loading} style={{
            background: loading
              ? "rgba(255,255,255,0.1)"
              : "linear-gradient(135deg,#c084fc 0%,#818cf8 100%)",
            color: loading ? "#64748b" : "white",
          }}>
            {loading ? (
              <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <span style={{ width:16, height:16, border:"2px solid #64748b", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />
                Entrando...
              </span>
            ) : "Entrar →"}
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:20, fontSize:11, color:"#334155" }}>
          Galene © 2025 · Acesso restrito
        </div>
      </div>
    </div>
  );
}
