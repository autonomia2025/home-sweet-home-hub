import { useState } from "react";
import type { FAQ } from "@/lib/supabase-helpers";
import { upsertFAQ, deleteFAQ, toggleFAQ } from "@/lib/supabase-helpers";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Save, ChevronUp, ChevronDown } from "lucide-react";

interface AdminFAQsProps {
  faqs: FAQ[];
  onRefresh: () => void;
}

export function AdminFAQs({ faqs, onRefresh }: AdminFAQsProps) {
  const [editing, setEditing] = useState<Partial<FAQ> | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editing || !editing.pregunta || !editing.respuesta) {
      toast.error("Pregunta y respuesta son obligatorias");
      return;
    }
    setSaving(true);
    try {
      await upsertFAQ(editing);
      toast.success(editing.id ? "FAQ actualizada" : "FAQ creada");
      setEditing(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFAQ(id);
      toast.success("FAQ eliminada");
      setConfirmDelete(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await toggleFAQ(id, !current);
      toast.success(!current ? "FAQ activada" : "FAQ desactivada");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleMove = async (faq: FAQ, direction: "up" | "down") => {
    const idx = faqs.findIndex((f) => f.id === faq.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= faqs.length) return;
    try {
      await upsertFAQ({ id: faq.id, orden: faqs[swapIdx].orden });
      await upsertFAQ({ id: faqs[swapIdx].id, orden: faq.orden });
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl" style={{ color: "#0a0a0a", fontWeight: 300 }}>
          Preguntas Frecuentes
        </h2>
        <button
          onClick={() => setEditing({ pregunta: "", respuesta: "", orden: faqs.length, activa: true })}
          className="flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-body border transition-all duration-300 hover:bg-[#0a0a0a] hover:text-white"
          style={{ borderColor: "#0a0a0a", color: "#0a0a0a", fontWeight: 400 }}
        >
          <Plus className="h-3.5 w-3.5" /> Nueva FAQ
        </button>
      </div>

      {/* Modal */}
      {editing && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setEditing(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 border" style={{ backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.08)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl" style={{ color: "#0a0a0a", fontWeight: 300 }}>
                {editing.id ? "Editar FAQ" : "Nueva FAQ"}
              </h3>
              <button onClick={() => setEditing(null)} className="p-1" style={{ color: "#9a9a9a" }}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-body" style={{ color: "#9a9a9a", fontWeight: 400 }}>Pregunta</label>
                <input
                  type="text"
                  value={editing.pregunta || ""}
                  onChange={(e) => setEditing({ ...editing, pregunta: e.target.value })}
                  className="w-full h-10 px-3 text-sm font-body border outline-none"
                  style={{ borderColor: "rgba(0,0,0,0.1)", color: "#0a0a0a", fontWeight: 300 }}
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-body" style={{ color: "#9a9a9a", fontWeight: 400 }}>Respuesta</label>
                <textarea
                  value={editing.respuesta || ""}
                  onChange={(e) => setEditing({ ...editing, respuesta: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm font-body border outline-none resize-none"
                  style={{ borderColor: "rgba(0,0,0,0.1)", color: "#0a0a0a", fontWeight: 300 }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase font-body transition-all disabled:opacity-50" style={{ backgroundColor: "#0a0a0a", color: "#fff", fontWeight: 400 }}>
                <Save className="h-3.5 w-3.5" /> {saving ? "Guardando..." : "Guardar"}
              </button>
              <button onClick={() => setEditing(null)} className="px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase font-body border" style={{ borderColor: "rgba(0,0,0,0.15)", color: "#9a9a9a", fontWeight: 400 }}>Cancelar</button>
            </div>
          </div>
        </>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setConfirmDelete(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm p-8 border" style={{ backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.08)" }}>
            <h3 className="font-display text-lg mb-3" style={{ color: "#0a0a0a", fontWeight: 400 }}>¿Eliminar FAQ?</h3>
            <p className="text-sm font-body mb-6" style={{ color: "#9a9a9a", fontWeight: 300 }}>Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="px-5 py-2 text-[11px] tracking-[0.15em] uppercase font-body" style={{ backgroundColor: "#0a0a0a", color: "#fff", fontWeight: 400 }}>Eliminar</button>
              <button onClick={() => setConfirmDelete(null)} className="px-5 py-2 text-[11px] tracking-[0.15em] uppercase font-body border" style={{ borderColor: "rgba(0,0,0,0.15)", color: "#9a9a9a", fontWeight: 400 }}>Cancelar</button>
            </div>
          </div>
        </>
      )}

      {/* List */}
      <div className="border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        {faqs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-body" style={{ color: "#9a9a9a", fontWeight: 300 }}>No hay FAQs. Crea la primera.</p>
          </div>
        ) : (
          faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 hover:bg-gray-50/50 transition-colors"
              style={{ borderColor: "rgba(0,0,0,0.04)" }}
            >
              {/* Reorder */}
              <div className="flex flex-col gap-0.5">
                <button onClick={() => handleMove(faq, "up")} disabled={idx === 0} className="p-0.5 disabled:opacity-20" style={{ color: "#9a9a9a" }}>
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleMove(faq, "down")} disabled={idx === faqs.length - 1} className="p-0.5 disabled:opacity-20" style={{ color: "#9a9a9a" }}>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <span className="flex-1 text-sm font-body truncate" style={{ color: "#0a0a0a", fontWeight: 400 }}>{faq.pregunta}</span>

              {/* Toggle */}
              <button onClick={() => handleToggle(faq.id, faq.activa)} className="w-10 h-5 relative cursor-pointer shrink-0">
                <div className="w-10 h-5 transition-colors" style={{ backgroundColor: faq.activa ? "#0a0a0a" : "rgba(0,0,0,0.1)" }} />
                <div className="absolute top-0.5 w-4 h-4 transition-all" style={{ backgroundColor: "#fff", left: faq.activa ? "22px" : "2px" }} />
              </button>

              <button onClick={() => setEditing(faq)} className="p-1.5 transition-colors hover:bg-gray-100" style={{ color: "#9a9a9a" }}>
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setConfirmDelete(faq.id)} className="p-1.5 transition-colors hover:bg-red-50" style={{ color: "#ccc" }}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
