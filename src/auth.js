// ─── Galene Auth ──────────────────────────────────────────────────────────────
// Autenticação simples via senha local.
// Para produção: substitua por Firebase Auth, Supabase ou Clerk.

const AUTH_KEY   = "galene_auth";
const EXPIRY_KEY = "galene_auth_expiry";
const SESSION_HOURS = 12;

// Credenciais padrão — altere antes de fazer deploy!
export const CREDENTIALS = {
  username: "galene",
  // Senha em texto simples para facilitar configuração inicial.
  // Troque para algo seguro antes de publicar.
  password: "galene2025",
};

export function login(username, password) {
  if (
    username.trim().toLowerCase() === CREDENTIALS.username &&
    password === CREDENTIALS.password
  ) {
    const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
    localStorage.setItem(AUTH_KEY, "true");
    localStorage.setItem(EXPIRY_KEY, String(expiry));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

export function isAuthenticated() {
  const auth   = localStorage.getItem(AUTH_KEY);
  const expiry = Number(localStorage.getItem(EXPIRY_KEY) || 0);
  if (auth !== "true" || Date.now() > expiry) {
    logout();
    return false;
  }
  return true;
}
