import { useState } from "react";
import type { Propiedad, Caracteristicas } from "@/lib/supabase-helpers";
import {
  upsertPropiedad,
  deletePropiedad,
  togglePropiedad,
  uploadImage,
  deleteStorageImage,
} from "@/lib/supabase-helpers";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Save, Upload, ChevronDown, ChevronUp, ImageIcon } from "lucide-react";

interface AdminPropertiesProps {
  propiedades: Propiedad[];
  onRefresh: () => void;
}

type TabKey = "general" | "fotos" | "detalles";

export function AdminProperties({ propiedades, onRefresh }: AdminPropertiesProps) {
  const [editingProp, setEditingProp] = useState<Partial<Propiedad> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("general");

  const openNew = () => {
    setActiveTab("general");
    setEditingProp({
      titulo: "",
      descripcion: "",
      descripcion_larga: "",
      precio: "",
      tipo: "venta",
      comuna: "",
      activa: true,
      orden: propiedades.length,
      imagenes: [],
      caracteristicas: {},
      ubicacion_referencia: "",
    });
  };

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
    const prop = propiedades.find((p) => p.id === id);
    try {
      // Delete images from storage
      if (prop?.imagen_url) await deleteStorageImage(prop.imagen_url).catch(() => {});
      if (prop?.imagenes?.length) {
        await Promise.all(prop.imagenes.map((u) => deleteStorageImage(u).catch(() => {})));
      }
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

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editingProp) return;
    const current = editingProp.imagenes || [];
    if (current.length + files.length > 10) {
      toast.error("Máximo 10 fotos adicionales");
      return;
    }
    setUploadingGallery(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        urls.push(url);
      }
      setEditingProp({ ...editingProp, imagenes: [...current, ...urls] });
      toast.success(`${urls.length} foto(s) subida(s)`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = async (index: number) => {
    if (!editingProp) return;
    const imgs = [...(editingProp.imagenes || [])];
    const removed = imgs.splice(index, 1)[0];
    await deleteStorageImage(removed).catch(() => {});
    setEditingProp({ ...editingProp, imagenes: imgs });
    toast.success("Foto eliminada");
  };

  const chars = (editingProp?.caracteristicas || {}) as Caracteristicas;
  const setChar = (key: keyof Caracteristicas, value: any) => {
    setEditingProp({
      ...editingProp,
      caracteristicas: { ...chars, [key]: value === "" ? undefined : value },
    });
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "general", label: "General" },
    { key: "fotos", label: "Fotos" },
    { key: "detalles", label: "Detalles" },
  ];

  const totalPhotos = (p: Propiedad) => (p.imagen_url ? 1 : 0) + (p.imagenes?.length || 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl" style={{ color: "#2c3e2c", fontWeight: 300 }}>
          Propiedades
        </h2>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-body border transition-all duration-300 hover:bg-[#2c3e2c] hover:text-white"
          style={{ borderColor: "#2c3e2c", color: "#2c3e2c", fontWeight: 400 }}
        >
          <Plus className="h-3.5 w-3.5" /> Nueva propiedad
        </button>
      </div>

      {/* Modal */}
      {editingProp && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setEditingProp(null)} />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 border"
            style={{ backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.08)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl" style={{ color: "#2c3e2c", fontWeight: 300 }}>
                {editingProp.id ? "Editar propiedad" : "Nueva propiedad"}
              </h3>
              <button onClick={() => setEditingProp(null)} className="p-1" style={{ color: "#8a7a6a" }}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mb-6 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className="text-[11px] tracking-[0.15em] uppercase font-body pb-3 transition-all"
                  style={{
                    color: activeTab === t.key ? "#2c3e2c" : "#8a7a6a",
                    fontWeight: 400,
                    borderBottom: activeTab === t.key ? "2px solid #5a7a5a" : "2px solid transparent",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab: General */}
            {activeTab === "general" && (
              <div className="space-y-5">
                <FieldGroup label="Título">
                  <AdminInput value={editingProp.titulo || ""} onChange={(v) => setEditingProp({ ...editingProp, titulo: v })} placeholder="Ej: Casa en Navidad" />
                </FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Precio">
                    <AdminInput value={editingProp.precio || ""} onChange={(v) => setEditingProp({ ...editingProp, precio: v })} placeholder="Ej: $120.000.000" />
                  </FieldGroup>
                  <FieldGroup label="Tipo">
                    <select
                      value={editingProp.tipo || "venta"}
                      onChange={(e) => setEditingProp({ ...editingProp, tipo: e.target.value })}
                      className="w-full h-10 px-3 text-sm font-body border outline-none"
                      style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", backgroundColor: "#fff", fontWeight: 300 }}
                    >
                      <option value="venta">Venta</option>
                      <option value="arriendo">Arriendo</option>
                    </select>
                  </FieldGroup>
                </div>
                <FieldGroup label="Comuna">
                  <AdminInput value={editingProp.comuna || ""} onChange={(v) => setEditingProp({ ...editingProp, comuna: v })} placeholder="Ej: Santiago Centro" />
                </FieldGroup>
                <FieldGroup label="Descripción corta">
                  <textarea
                    value={editingProp.descripcion || ""}
                    onChange={(e) => setEditingProp({ ...editingProp, descripcion: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm font-body border outline-none resize-none"
                    style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 300 }}
                    placeholder="Resumen breve para las cards..."
                  />
                </FieldGroup>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-5 relative cursor-pointer" onClick={() => setEditingProp({ ...editingProp, activa: !editingProp.activa })}>
                    <div className="w-10 h-5 transition-colors" style={{ backgroundColor: editingProp.activa ? "#2c3e2c" : "rgba(0,0,0,0.1)" }} />
                    <div className="absolute top-0.5 w-4 h-4 transition-all" style={{ backgroundColor: "#fff", left: editingProp.activa ? "22px" : "2px" }} />
                  </div>
                  <span className="text-sm font-body" style={{ color: "#2c3e2c", fontWeight: 300 }}>Visible en el sitio</span>
                </label>
              </div>
            )}

            {/* Tab: Fotos */}
            {activeTab === "fotos" && (
              <div className="space-y-6">
                <FieldGroup label="Foto principal">
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.1em] uppercase font-body border transition-colors hover:bg-gray-50" style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 400 }}>
                      <Upload className="h-3.5 w-3.5" />
                      {uploading ? "Subiendo..." : "Subir imagen"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    {editingProp.imagen_url && (
                      <img src={editingProp.imagen_url} alt="" className="h-16 w-16 object-cover border" style={{ borderColor: "rgba(0,0,0,0.08)" }} />
                    )}
                  </div>
                </FieldGroup>

                <FieldGroup label={`Fotos adicionales (${(editingProp.imagenes || []).length}/10)`}>
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.1em] uppercase font-body border transition-colors hover:bg-gray-50 w-fit" style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 400 }}>
                    <Upload className="h-3.5 w-3.5" />
                    {uploadingGallery ? "Subiendo..." : "Agregar fotos"}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                  </label>
                  {(editingProp.imagenes || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(editingProp.imagenes || []).map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt="" className="h-20 w-20 object-cover border" style={{ borderColor: "rgba(0,0,0,0.08)" }} />
                          <button
                            onClick={() => removeGalleryImage(i)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-white text-xs"
                            style={{ backgroundColor: "#2c3e2c" }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </FieldGroup>
              </div>
            )}

            {/* Tab: Detalles */}
            {activeTab === "detalles" && (
              <div className="space-y-5">
                <FieldGroup label="Descripción completa">
                  <textarea
                    value={editingProp.descripcion_larga || ""}
                    onChange={(e) => setEditingProp({ ...editingProp, descripcion_larga: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2.5 text-sm font-body border outline-none resize-none"
                    style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 300 }}
                    placeholder="Descripción extendida para la página de detalle..."
                  />
                </FieldGroup>

                <FieldGroup label="Ubicación de referencia">
                  <AdminInput
                    value={editingProp.ubicacion_referencia || ""}
                    onChange={(v) => setEditingProp({ ...editingProp, ubicacion_referencia: v })}
                    placeholder="Ej: A 5 minutos de la playa"
                  />
                </FieldGroup>

                <div>
                  <span className="block text-[11px] tracking-[0.1em] uppercase mb-1 font-body" style={{ color: "#8a7a6a", fontWeight: 400 }}>
                    Coordenadas para el mapa (opcional)
                  </span>
                  <p className="text-[11px] font-body mb-3" style={{ color: "#8a7a6a", fontWeight: 300 }}>
                    Puedes obtenerlas desde Google Maps haciendo clic derecho en la ubicación.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label="Latitud">
                      <input
                        type="number"
                        step="any"
                        value={editingProp.lat ?? ""}
                        onChange={(e) => setEditingProp({ ...editingProp, lat: e.target.value === "" ? null : Number(e.target.value) })}
                        placeholder="-33.4489"
                        className="w-full h-10 px-3 text-sm font-body border outline-none"
                        style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 300 }}
                      />
                    </FieldGroup>
                    <FieldGroup label="Longitud">
                      <input
                        type="number"
                        step="any"
                        value={editingProp.lng ?? ""}
                        onChange={(e) => setEditingProp({ ...editingProp, lng: e.target.value === "" ? null : Number(e.target.value) })}
                        placeholder="-70.6693"
                        className="w-full h-10 px-3 text-sm font-body border outline-none"
                        style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 300 }}
                      />
                    </FieldGroup>
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] tracking-[0.1em] uppercase mb-3 font-body" style={{ color: "#8a7a6a", fontWeight: 400 }}>
                    Características opcionales
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label="Superficie m²">
                      <input
                        type="number"
                        value={chars.superficie_m2 ?? ""}
                        onChange={(e) => setChar("superficie_m2", e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full h-10 px-3 text-sm font-body border outline-none"
                        style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 300 }}
                      />
                    </FieldGroup>
                    <FieldGroup label="Dormitorios">
                      <input
                        type="number"
                        value={chars.dormitorios ?? ""}
                        onChange={(e) => setChar("dormitorios", e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full h-10 px-3 text-sm font-body border outline-none"
                        style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 300 }}
                      />
                    </FieldGroup>
                    <FieldGroup label="Baños">
                      <input
                        type="number"
                        value={chars.banos ?? ""}
                        onChange={(e) => setChar("banos", e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full h-10 px-3 text-sm font-body border outline-none"
                        style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 300 }}
                      />
                    </FieldGroup>
                    <FieldGroup label="Estacionamiento">
                      <select
                        value={chars.estacionamiento === true ? "si" : chars.estacionamiento === false ? "no" : ""}
                        onChange={(e) => setChar("estacionamiento", e.target.value === "" ? undefined : e.target.value === "si")}
                        className="w-full h-10 px-3 text-sm font-body border outline-none"
                        style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", backgroundColor: "#fff", fontWeight: 300 }}
                      >
                        <option value="">—</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                      </select>
                    </FieldGroup>
                    <FieldGroup label="Bodega">
                      <select
                        value={chars.bodega === true ? "si" : chars.bodega === false ? "no" : ""}
                        onChange={(e) => setChar("bodega", e.target.value === "" ? undefined : e.target.value === "si")}
                        className="w-full h-10 px-3 text-sm font-body border outline-none"
                        style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", backgroundColor: "#fff", fontWeight: 300 }}
                      >
                        <option value="">—</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                      </select>
                    </FieldGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Save */}
            <div className="flex gap-3 mt-8 pt-6" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase font-body transition-all duration-300 disabled:opacity-50"
                style={{ backgroundColor: "#2c3e2c", color: "#fff", fontWeight: 400 }}
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button
                onClick={() => setEditingProp(null)}
                className="px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase font-body border transition-all hover:bg-gray-50"
                style={{ borderColor: "rgba(0,0,0,0.15)", color: "#8a7a6a", fontWeight: 400 }}
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
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setConfirmDelete(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm p-8 border" style={{ backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.08)" }}>
            <h3 className="font-display text-lg mb-3" style={{ color: "#2c3e2c", fontWeight: 400 }}>¿Eliminar propiedad?</h3>
            <p className="text-sm font-body mb-6" style={{ color: "#8a7a6a", fontWeight: 300 }}>Esta acción no se puede deshacer. La propiedad y sus imágenes serán eliminadas permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="px-5 py-2 text-[11px] tracking-[0.15em] uppercase font-body" style={{ backgroundColor: "#2c3e2c", color: "#fff", fontWeight: 400 }}>Eliminar</button>
              <button onClick={() => setConfirmDelete(null)} className="px-5 py-2 text-[11px] tracking-[0.15em] uppercase font-body border" style={{ borderColor: "rgba(0,0,0,0.15)", color: "#8a7a6a", fontWeight: 400 }}>Cancelar</button>
            </div>
          </div>
        </>
      )}

      {/* Properties table */}
      <div className="border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        <div
          className="hidden md:grid grid-cols-[60px_1fr_120px_100px_120px_60px_80px_80px_60px] gap-4 px-4 py-3 text-[10px] tracking-[0.15em] uppercase font-body border-b"
          style={{ borderColor: "rgba(0,0,0,0.06)", color: "#8a7a6a", fontWeight: 400 }}
        >
          <span />
          <span>Título</span>
          <span>Precio</span>
          <span>Tipo</span>
          <span>Comuna</span>
          <span>Fotos</span>
          <span>Activa</span>
          <span>Editar</span>
          <span>Eliminar</span>
        </div>

        {propiedades.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-body" style={{ color: "#8a7a6a", fontWeight: 300 }}>No hay propiedades. Crea la primera.</p>
          </div>
        ) : (
          propiedades.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-1 md:grid-cols-[60px_1fr_120px_100px_120px_60px_80px_80px_60px] gap-2 md:gap-4 items-center px-4 py-3 border-b last:border-b-0 hover:bg-gray-50/50 transition-colors"
              style={{ borderColor: "rgba(0,0,0,0.04)" }}
            >
              <div className="relative group">
                {p.imagen_url ? (
                  <>
                    <img src={p.imagen_url} alt="" className="w-10 h-10 object-cover" style={{ border: "1px solid rgba(0,0,0,0.06)" }} />
                    <div className="hidden group-hover:block absolute z-10 left-12 top-0 border shadow-lg" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                      <img src={p.imagen_url} alt="" className="w-48 h-36 object-cover" />
                    </div>
                  </>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.03)" }}>
                    <span className="text-[9px]" style={{ color: "#ccc" }}>—</span>
                  </div>
                )}
              </div>
              <span className="text-sm font-body truncate" style={{ color: "#2c3e2c", fontWeight: 400 }}>{p.titulo}</span>
              <span className="text-xs font-body" style={{ color: "#8a7a6a", fontWeight: 300 }}>{p.precio || "—"}</span>
              <span className="text-[10px] tracking-[0.1em] uppercase font-body px-2 py-0.5 inline-block w-fit" style={{ backgroundColor: p.tipo === "venta" ? "rgba(0,0,0,0.04)" : "rgba(200,184,162,0.15)", color: "#2c3e2c", fontWeight: 400 }}>{p.tipo}</span>
              <span className="text-xs font-body" style={{ color: "#8a7a6a", fontWeight: 300 }}>{p.comuna || "—"}</span>
              <span className="text-xs font-body flex items-center gap-1" style={{ color: "#8a7a6a", fontWeight: 300 }}>
                <ImageIcon className="h-3 w-3" /> {totalPhotos(p)}
              </span>
              <div>
                <button onClick={() => handleToggle(p.id, p.activa)} className="w-10 h-5 relative cursor-pointer">
                  <div className="w-10 h-5 transition-colors" style={{ backgroundColor: p.activa ? "#2c3e2c" : "rgba(0,0,0,0.1)" }} />
                  <div className="absolute top-0.5 w-4 h-4 transition-all" style={{ backgroundColor: "#fff", left: p.activa ? "22px" : "2px" }} />
                </button>
              </div>
              <button onClick={() => { setActiveTab("general"); setEditingProp(p); }} className="p-1.5 transition-colors hover:bg-gray-100 w-fit" style={{ color: "#8a7a6a" }}>
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setConfirmDelete(p.id)} className="p-1.5 transition-colors hover:bg-red-50 w-fit" style={{ color: "#ccc" }}>
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
      <label className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-body" style={{ color: "#8a7a6a", fontWeight: 400 }}>{label}</label>
      {children}
    </div>
  );
}

function AdminInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-10 px-3 text-sm font-body border outline-none focus:border-black/20 transition-colors"
      style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 300 }}
    />
  );
}
