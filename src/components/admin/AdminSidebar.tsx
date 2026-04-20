import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  Home,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  HelpCircle,
  KeyRound,
} from "lucide-react";

interface AdminSidebarProps {
  activeSection: "propiedades" | "configuracion" | "faqs";
  onChangeSection: (section: "propiedades" | "configuracion" | "faqs") => void;
}

export function AdminSidebar({ activeSection, onChangeSection }: AdminSidebarProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/admin/login" });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (newPw.length < 6) {
      setPwMsg({ type: "err", text: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ type: "err", text: "Las contraseñas no coinciden." });
      return;
    }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwLoading(false);
    if (error) {
      setPwMsg({ type: "err", text: error.message });
      return;
    }
    setPwMsg({ type: "ok", text: "Contraseña actualizada correctamente." });
    setNewPw("");
    setConfirmPw("");
    setTimeout(() => { setPwOpen(false); setPwMsg(null); }, 1500);
  };

  const navItems = [
    { id: "propiedades" as const, label: "Propiedades", icon: Building2 },
    { id: "faqs" as const, label: "FAQs", icon: HelpCircle },
    { id: "configuracion" as const, label: "Configuración", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center border" style={{ borderColor: "rgba(0,0,0,0.15)" }}>
            <span className="font-display text-sm tracking-widest" style={{ color: "#2c3e2c", fontWeight: 300 }}>PC</span>
          </div>
          <span className="text-[10px] tracking-[0.15em] uppercase font-body" style={{ color: "#2c3e2c", fontWeight: 400 }}>Admin</span>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onChangeSection(item.id); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 mb-1 text-left transition-colors"
              style={{ backgroundColor: isActive ? "rgba(0,0,0,0.04)" : "transparent", color: isActive ? "#2c3e2c" : "#8a7a6a" }}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-[13px] font-body" style={{ fontWeight: isActive ? 500 : 300 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 mb-1 transition-colors" style={{ color: "#8a7a6a" }}>
          <Home className="h-4 w-4" />
          <span className="text-[13px] font-body" style={{ fontWeight: 300 }}>Ver sitio</span>
        </Link>
        <button onClick={() => { setPwOpen(true); setMobileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 mb-1 text-left transition-colors" style={{ color: "#8a7a6a" }}>
          <KeyRound className="h-4 w-4" />
          <span className="text-[13px] font-body" style={{ fontWeight: 300 }}>Cambiar contraseña</span>
        </button>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors" style={{ color: "#8a7a6a" }}>
          <LogOut className="h-4 w-4" />
          <span className="text-[13px] font-body" style={{ fontWeight: 300 }}>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 border"
        style={{ borderColor: "rgba(0,0,0,0.1)", backgroundColor: "#faf8f5" }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ backgroundColor: "rgba(0,0,0,0.3)" }} onClick={() => setMobileOpen(false)} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 md:hidden transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backgroundColor: "#faf8f5" }}
      >
        {sidebarContent}
      </div>

      <aside className="hidden md:block w-56 shrink-0 border-r h-screen sticky top-0" style={{ backgroundColor: "#faf8f5", borderColor: "rgba(0,0,0,0.08)" }}>
        {sidebarContent}
      </aside>

      {pwOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => !pwLoading && setPwOpen(false)}>
          <div className="w-full max-w-md p-8" style={{ backgroundColor: "#faf8f5" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl" style={{ color: "#2c3e2c", fontWeight: 300 }}>Cambiar contraseña</h2>
              <button onClick={() => !pwLoading && setPwOpen(false)} style={{ color: "#8a7a6a" }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase mb-2 font-body" style={{ color: "#8a7a6a", fontWeight: 400 }}>Nueva contraseña</label>
                <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} required minLength={6}
                  className="w-full h-11 px-4 text-sm font-body border outline-none focus:border-[#2c3e2c] transition-colors"
                  style={{ backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 300 }} />
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase mb-2 font-body" style={{ color: "#8a7a6a", fontWeight: 400 }}>Confirmar contraseña</label>
                <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required minLength={6}
                  className="w-full h-11 px-4 text-sm font-body border outline-none focus:border-[#2c3e2c] transition-colors"
                  style={{ backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 300 }} />
              </div>
              {pwMsg && (
                <div className="text-sm p-3 border font-body" style={{
                  borderColor: pwMsg.type === "ok" ? "rgba(44,62,44,0.3)" : "rgba(255,80,80,0.3)",
                  backgroundColor: pwMsg.type === "ok" ? "rgba(44,62,44,0.05)" : "rgba(255,80,80,0.05)",
                  color: pwMsg.type === "ok" ? "#2c3e2c" : "#c0392b",
                }}>{pwMsg.text}</div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setPwOpen(false)} disabled={pwLoading}
                  className="flex-1 h-11 text-[11px] tracking-[0.2em] uppercase border font-body transition-all duration-300 disabled:opacity-50"
                  style={{ borderColor: "rgba(0,0,0,0.15)", color: "#8a7a6a", backgroundColor: "transparent", fontWeight: 400 }}>
                  Cancelar
                </button>
                <button type="submit" disabled={pwLoading}
                  className="flex-1 h-11 text-[11px] tracking-[0.2em] uppercase font-body transition-all duration-300 disabled:opacity-50"
                  style={{ backgroundColor: "#2c3e2c", color: "#fff", fontWeight: 400 }}>
                  {pwLoading ? "Guardando..." : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
