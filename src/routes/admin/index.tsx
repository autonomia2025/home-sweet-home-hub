import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchAllPropiedades,
  fetchConfiguracion,
  upsertPropiedad,
  deletePropiedad,
  updateConfiguracion,
  uploadImage,
} from "@/lib/supabase-helpers";
import type { Propiedad } from "@/lib/supabase-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Settings,
  Home,
  Image,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminPanel,
});

function AdminPanel() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [editingProp, setEditingProp] = useState<Partial<Propiedad> | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/admin/login" });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [props, conf] = await Promise.all([fetchAllPropiedades(), fetchConfiguracion()]);
      setPropiedades(props);
      setConfig(conf);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProp = async () => {
    if (!editingProp) return;
    try {
      await upsertPropiedad(editingProp);
      setEditingProp(null);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteProp = async (id: string) => {
    if (!confirm("¿Eliminar esta propiedad?")) return;
    try {
      await deletePropiedad(id);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveConfig = async () => {
    try {
      for (const [clave, valor] of Object.entries(config)) {
        await updateConfiguracion(clave, valor);
      }
      setShowConfig(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProp) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditingProp({ ...editingProp, imagen_url: url });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-lg text-foreground">Panel Admin</h1>
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowConfig(!showConfig)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {showConfig && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="font-display text-xl mb-4">Configuración</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Nombre Inmobiliaria</label>
                <Input
                  value={config.nombre_inmobiliaria || ""}
                  onChange={(e) => setConfig({ ...config, nombre_inmobiliaria: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">WhatsApp</label>
                <Input
                  value={config.whatsapp || ""}
                  onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Presentación</label>
                <Textarea
                  value={config.presentacion || ""}
                  onChange={(e) => setConfig({ ...config, presentacion: e.target.value })}
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveConfig}>
                <Save className="h-4 w-4 mr-1" /> Guardar Configuración
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-foreground">Propiedades</h2>
          <Button
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
          >
            <Plus className="h-4 w-4 mr-1" /> Nueva
          </Button>
        </div>

        {editingProp && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg">{editingProp.id ? "Editar" : "Nueva"} Propiedad</h3>
              <Button variant="ghost" size="icon" onClick={() => setEditingProp(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={editingProp.titulo || ""}
                  onChange={(e) => setEditingProp({ ...editingProp, titulo: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Comuna</label>
                <Input
                  value={editingProp.comuna || ""}
                  onChange={(e) => setEditingProp({ ...editingProp, comuna: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Precio</label>
                <Input
                  value={editingProp.precio || ""}
                  onChange={(e) => setEditingProp({ ...editingProp, precio: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <select
                  value={editingProp.tipo || "venta"}
                  onChange={(e) => setEditingProp({ ...editingProp, tipo: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="venta">Venta</option>
                  <option value="arriendo">Arriendo</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  value={editingProp.descripcion || ""}
                  onChange={(e) => setEditingProp({ ...editingProp, descripcion: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Imagen</label>
                <div className="flex items-center gap-2 mt-1">
                  <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-md border border-input bg-background text-sm hover:bg-accent">
                    <Image className="h-4 w-4" />
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
                    <img src={editingProp.imagen_url} alt="" className="h-10 w-10 rounded object-cover" />
                  )}
                </div>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editingProp.activa ?? true}
                    onChange={(e) => setEditingProp({ ...editingProp, activa: e.target.checked })}
                  />
                  Activa (visible en el sitio)
                </label>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleSaveProp}>
                <Save className="h-4 w-4 mr-1" /> Guardar
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Cargando...</div>
        ) : (
          <div className="space-y-3">
            {propiedades.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 bg-card border border-border rounded-lg p-4"
              >
                {p.imagen_url ? (
                  <img src={p.imagen_url} alt="" className="h-14 w-14 rounded object-cover shrink-0" />
                ) : (
                  <div className="h-14 w-14 rounded bg-muted shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">{p.titulo}</span>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                      {p.tipo}
                    </span>
                    {!p.activa && (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                        Inactiva
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{p.comuna}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => setEditingProp(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteProp(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
