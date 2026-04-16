import { createFileRoute, Link, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
  head: () => ({
    meta: [
      { title: "Login — Panel Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AdminLogin() {
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect
  if (!authLoading && user) {
    return <Navigate to="/admin" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ backgroundColor: "#2c3e2c" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 mx-auto flex items-center justify-center border mb-6"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            <span className="font-display text-2xl tracking-widest" style={{ color: "#fff", fontWeight: 300 }}>
              PC
            </span>
          </div>
          <h1
            className="font-display text-2xl mb-2"
            style={{ color: "#fff", fontWeight: 300 }}
          >
            Panel de Administración
          </h1>
          <p
            className="text-[13px] font-body"
            style={{ color: "#8a7a6a", fontWeight: 300 }}
          >
            Inicia sesión para gestionar propiedades
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="text-sm p-3 border font-body"
              style={{
                borderColor: "rgba(255,80,80,0.3)",
                backgroundColor: "rgba(255,80,80,0.05)",
                color: "#ff6b6b",
              }}
            >
              {error}
            </div>
          )}
          <div>
            <label
              className="block text-[11px] tracking-[0.15em] uppercase mb-2 font-body"
              style={{ color: "#8a7a6a", fontWeight: 400 }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 px-4 text-sm font-body border outline-none focus:border-white/30 transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontWeight: 300,
              }}
            />
          </div>
          <div>
            <label
              className="block text-[11px] tracking-[0.15em] uppercase mb-2 font-body"
              style={{ color: "#8a7a6a", fontWeight: 400 }}
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-4 text-sm font-body border outline-none focus:border-white/30 transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontWeight: 300,
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-[11px] tracking-[0.2em] uppercase border font-body transition-all duration-300 disabled:opacity-50"
            style={{
              borderColor: "rgba(255,255,255,0.3)",
              color: "#fff",
              backgroundColor: "transparent",
              fontWeight: 400,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.color = "#2c3e2c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#fff";
            }}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-[12px] font-body underline-anim"
            style={{ color: "#8a7a6a", fontWeight: 300 }}
          >
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
