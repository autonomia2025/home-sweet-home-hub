import { useState } from "react";
import type { Propiedad } from "@/lib/supabase-helpers";
import {
  upsertPropiedad,
  deletePropiedad,
  togglePropiedad,
  uploadImage,
} from "@/lib/supabase-helpers";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Save, Upload } from "lucide-react";

interface AdminPropertiesProps {
  propiedades: Propiedad[];
  onRefresh: () => void;
}

export function AdminProperties({ propiedades, onRefresh }: AdminPropertiesProps) {
  const [editingProp, setEditingProp] = useState<Partial<Propiedad> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editingProp || !editingProp.titulo) {
      toast.error("El título es obligatorio");
      return;
    }
    setSaving(true);
    try {
      await upsertPropiedad(editingProp);
      toast.success(editingProp.id ? "Propiedad actualizada" : "Propiedad creada");
      setEditingProp(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePropiedad(id);
      toast.success("Propiedad eliminada");
      setConfirmDelete(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggle = async (id: string, currentValue: boolean) => {
    try {
      await togglePropiedad(id, !currentValue);
      toast.success(!currentValue ? "Propiedad activada" : "Propiedad desactivada");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProp) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditingProp({ ...editingProp, imagen_url: url });
      toast.success("Imagen subida");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2
          className="font-display text-2xl"
          style={{ color: "#0a0a0a", fontWeight: 300 }}
        >
          Propiedades
        </h2>
        <button
          onClick={() =>
            setEditingProp({
              titulo: "",
              descripcion: "",
              precio: "",
              tipo: "venta",
              comuna: "",
              activa: true,
              orden: propiedades.length,
            })
          }
          className="flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-body border transition-all duration-300 hover:bg-[#0a0a0a] hover:text-white"
          style={{
            borderColor: "#0a0a0a",
            color: "#0a0a0a",
            fontWeight: 400,
          }}
        >
          <Plus className="h-3.5 w-3.5" /> Nueva propiedad
        </button>
      </div>

      {/* Modal / Form */}
      {editingProp && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={() => setEditingProp(null)}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 border"
            style={{ backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.08)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl" style={{ color: "#0a0a0a", fontWeight: 300 }}>
                {editingProp.id ? "Editar propiedad" : "Nueva propiedad"}
              </h3>
              <button onClick={() => setEditingProp(null)} className="p-1" style={{ color: "#9a9a9a" }}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <FieldGroup label="Título">
                <AdminInput
                  value={editingProp.titulo || ""}
                  onChange={(v) => setEditingProp({ ...editingProp, titulo: v })}
                  placeholder="Ej: Casa en Navidad"
                />
              </FieldGroup>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="Precio">
                  <AdminInput
                    value={editingProp.precio || ""}
                    onChange={(v) => setEditingProp({ ...editingProp, precio: v })}
                    placeholder="Ej: $120.000.000"
                  />
                </FieldGroup>
                <FieldGroup label="Tipo">
                  <select
                    value={editingProp.tipo || "venta"}
                    onChange={(e) => setEditingProp({ ...editingProp, tipo: e.target.value })}
                    className="w-full h-10 px-3 text-sm font-body border outline-none"
                    style={{
                      borderColor: "rgba(0,0,0,0.1)",
                      color: "#0a0a0a",
                      backgroundColor: "#fff",
                      fontWeight: 300,
                    }}
                  >
                    <option value="venta">Venta</option>
                    <option value="arriendo">Arriendo</option>
                  </select>
                </FieldGroup>
              </div>

              <FieldGroup label="Comuna">
                <AdminInput
                  value={editingProp.comuna || ""}
                  onChange={(v) => setEditingProp({ ...editingProp, comuna: v })}
                  placeholder="Ej: Santiago Centro"
                />
              </FieldGroup>

              <FieldGroup label="Descripción">
                <textarea
                  value={editingProp.descripcion || ""}
                  onChange={(e) => setEditingProp({ ...editingProp, descripcion: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm font-body border outline-none resize-none"
                  style={{
                    borderColor: "rgba(0,0,0,0.1)",
                    color: "#0a0a0a",
                    fontWeight: 300,
                  }}
                  placeholder="Descripción de la propiedad..."
                />
              </FieldGroup>

              <FieldGroup label="Imagen">
                <div className="flex items-center gap-3">
                  <label
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.1em] uppercase font-body border transition-colors hover:bg-gray-50"
                    style={{ borderColor: "rgba(0,0,0,0.1)", color: "#0a0a0a", fontWeight: 400 }}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {uploading ? "Subiendo..." : "Subir imagen"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                  {editingProp.imagen_url && (
                    <img
                      src={editingProp.imagen_url}
                      alt=""
                      className="h-12 w-12 object-cover border"
                      style={{ borderColor: "rgba(0,0,0,0.08)" }}
                    />
                  )}
                </div>
              </FieldGroup>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className="w-10 h-5 relative cursor-pointer"
                  onClick={() => setEditingProp({ ...editingProp, activa: !editingProp.activa })}
                >
                  <div
                    className="w-10 h-5 transition-colors"
                    style={{
                      backgroundColor: editingProp.activa ? "#0a0a0a" : "rgba(0,0,0,0.1)",
                    }}
                  />
                  <div
                    className="absolute top-0.5 w-4 h-4 transition-all"
                    style={{
                      backgroundColor: "#fff",
                      left: editingProp.activa ? "22px" : "2px",
                    }}
                  />
                </div>
                <span className="text-sm font-body" style={{ color: "#0a0a0a", fontWeight: 300 }}>
                  Visible en el sitio
                </span>
              </label>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase font-body transition-all duration-300 disabled:opacity-50"
                style={{
                  backgroundColor: "#0a0a0a",
                  color: "#fff",
                  fontWeight: 400,
                }}
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button
                onClick={() => setEditingProp(null)}
                className="px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase font-body border transition-all hover:bg-gray-50"
                style={{ borderColor: "rgba(0,0,0,0.15)", color: "#9a9a9a", fontWeight: 400 }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={() => setConfirmDelete(null)}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm p-8 border"
            style={{ backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.08)" }}
          >
            <h3 className="font-display text-lg mb-3" style={{ color: "#0a0a0a", fontWeight: 400 }}>
              ¿Eliminar propiedad?
            </h3>
            <p className="text-sm font-body mb-6" style={{ color: "#9a9a9a", fontWeight: 300 }}>
              Esta acción no se puede deshacer. La propiedad será eliminada permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-5 py-2 text-[11px] tracking-[0.15em] uppercase font-body"
                style={{ backgroundColor: "#0a0a0a", color: "#fff", fontWeight: 400 }}
              >
                Eliminar
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2 text-[11px] tracking-[0.15em] uppercase font-body border"
                style={{ borderColor: "rgba(0,0,0,0.15)", color: "#9a9a9a", fontWeight: 400 }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}

      {/* Properties table */}
      <div className="border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        {/* Table header */}
        <div
          className="hidden md:grid grid-cols-[60px_1fr_120px_100px_120px_80px_80px_60px] gap-4 px-4 py-3 text-[10px] tracking-[0.15em] uppercase font-body border-b"
          style={{ borderColor: "rgba(0,0,0,0.06)", color: "#9a9a9a", fontWeight: 400 }}
        >
          <span />
          <span>Título</span>
          <span>Precio</span>
          <span>Tipo</span>
          <span>Comuna</span>
          <span>Activa</span>
          <span>Editar</span>
          <span>Eliminar</span>
        </div>

        {/* Rows */}
        {propiedades.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-body" style={{ color: "#9a9a9a", fontWeight: 300 }}>
              No hay propiedades. Crea la primera.
            </p>
          </div>
        ) : (
          propiedades.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-1 md:grid-cols-[60px_1fr_120px_100px_120px_80px_80px_60px] gap-2 md:gap-4 items-center px-4 py-3 border-b last:border-b-0 hover:bg-gray-50/50 transition-colors"
              style={{ borderColor: "rgba(0,0,0,0.04)" }}
            >
              {/* Thumbnail */}
              <div>
                {p.imagen_url ? (
                  <img
                    src={p.imagen_url}
                    alt=""
                    className="w-10 h-10 object-cover"
                    style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                  />
                ) : (
                  <div
                    className="w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                  >
                    <span className="text-[9px]" style={{ color: "#ccc" }}>—</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <span
                className="text-sm font-body truncate"
                style={{ color: "#0a0a0a", fontWeight: 400 }}
              >
                {p.titulo}
              </span>

              {/* Price */}
              <span className="text-xs font-body" style={{ color: "#9a9a9a", fontWeight: 300 }}>
                {p.precio || "—"}
              </span>

              {/* Type */}
              <span
                className="text-[10px] tracking-[0.1em] uppercase font-body px-2 py-0.5 inline-block w-fit"
                style={{
                  backgroundColor: p.tipo === "venta" ? "rgba(0,0,0,0.04)" : "rgba(200,184,162,0.15)",
                  color: "#0a0a0a",
                  fontWeight: 400,
                }}
              >
                {p.tipo}
              </span>

              {/* Comuna */}
              <span className="text-xs font-body" style={{ color: "#9a9a9a", fontWeight: 300 }}>
                {p.comuna || "—"}
              </span>

              {/* Toggle */}
              <div>
                <button
                  onClick={() => handleToggle(p.id, p.activa)}
                  className="w-10 h-5 relative cursor-pointer"
                >
                  <div
                    className="w-10 h-5 transition-colors"
                    style={{
                      backgroundColor: p.activa ? "#0a0a0a" : "rgba(0,0,0,0.1)",
                    }}
                  />
                  <div
                    className="absolute top-0.5 w-4 h-4 transition-all"
                    style={{
                      backgroundColor: "#fff",
                      left: p.activa ? "22px" : "2px",
                    }}
                  />
                </button>
              </div>

              {/* Edit */}
              <button
                onClick={() => setEditingProp(p)}
                className="p-1.5 transition-colors hover:bg-gray-100 w-fit"
                style={{ color: "#9a9a9a" }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              {/* Delete */}
              <button
                onClick={() => setConfirmDelete(p.id)}
                className="p-1.5 transition-colors hover:bg-red-50 w-fit"
                style={{ color: "#ccc" }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-body"
        style={{ color: "#9a9a9a", fontWeight: 400 }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function AdminInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-10 px-3 text-sm font-body border outline-none focus:border-black/20 transition-colors"
      style={{
        borderColor: "rgba(0,0,0,0.1)",
        color: "#0a0a0a",
        fontWeight: 300,
      }}
    />
  );
}
