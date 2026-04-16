import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";

interface AdminSidebarProps {
  activeSection: "propiedades" | "configuracion" | "faqs";
  onChangeSection: (section: "propiedades" | "configuracion" | "faqs") => void;
}

export function AdminSidebar({ activeSection, onChangeSection }: AdminSidebarProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/admin/login" });
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
    </>
  );
}
