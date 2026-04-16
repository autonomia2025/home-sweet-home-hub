import { useState, useRef } from "react";
import { updateConfiguracion, uploadImage } from "@/lib/supabase-helpers";
import { toast } from "sonner";
import { Save, Upload, X } from "lucide-react";

interface AdminConfigProps {
  config: Record<string, string>;
  onRefresh: () => void;
}

export function AdminConfig({ config: initialConfig, onRefresh }: AdminConfigProps) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      const keys = [
        "nombre_inmobiliaria",
        "whatsapp",
        "presentacion",
        "hero_titulo",
        "hero_subtitulo",
        "hero_imagen_url",
      ];
      for (const k of keys) {
        await updateConfiguracion(k, config[k] ?? "");
      }
      toast.success("Configuración guardada");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setConfig({ ...config, hero_imagen_url: url });
      toast.success("Imagen subida. No olvides guardar.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <h2
        className="font-display text-2xl mb-8"
        style={{ color: "#2c3e2c", fontWeight: 300 }}
      >
        Configuración
      </h2>

      <div
        className="border p-8 space-y-6 max-w-2xl"
        style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "#fff" }}
      >
        <ConfigField
          label="Nombre inmobiliaria"
          value={config.nombre_inmobiliaria || ""}
          onChange={(v) => setConfig({ ...config, nombre_inmobiliaria: v })}
        />
        <ConfigField
          label="Número WhatsApp"
          value={config.whatsapp || ""}
          onChange={(v) => setConfig({ ...config, whatsapp: v })}
          placeholder="+56912345678"
        />
        <div>
          <label
            className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-body"
            style={{ color: "#8a7a6a", fontWeight: 400 }}
          >
            Texto de presentación
          </label>
          <textarea
            value={config.presentacion || ""}
            onChange={(e) => setConfig({ ...config, presentacion: e.target.value })}
            rows={4}
            className="w-full px-3 py-2.5 text-sm font-body border outline-none resize-none focus:border-black/20 transition-colors"
            style={{
              borderColor: "rgba(0,0,0,0.1)",
              color: "#2c3e2c",
              fontWeight: 300,
            }}
            placeholder="Descripción de la inmobiliaria..."
          />
        </div>

        {/* Sección Hero */}
        <div className="pt-4 border-t" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <h3
            className="text-[11px] tracking-[0.15em] uppercase mb-4 font-body"
            style={{ color: "#2c3e2c", fontWeight: 500 }}
          >
            Sección Hero (Portada)
          </h3>

          <div className="space-y-6">
            <div>
              <label
                className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-body"
                style={{ color: "#8a7a6a", fontWeight: 400 }}
              >
                Título principal (usa Enter para salto de línea)
              </label>
              <textarea
                value={config.hero_titulo || ""}
                onChange={(e) => setConfig({ ...config, hero_titulo: e.target.value })}
                rows={2}
                className="w-full px-3 py-2.5 text-sm font-body border outline-none resize-none focus:border-black/20 transition-colors"
                style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2c3e2c", fontWeight: 300 }}
                placeholder={"Propiedades\ncon carácter"}
              />
            </div>

            <ConfigField
              label="Subtítulo"
              value={config.hero_subtitulo || ""}
              onChange={(v) => setConfig({ ...config, hero_subtitulo: v })}
              placeholder="Inmuebles únicos en ubicaciones que importan."
            />

            <div>
              <label
                className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-body"
                style={{ color: "#8a7a6a", fontWeight: 400 }}
              >
                Imagen de fondo
              </label>

              {config.hero_imagen_url ? (
                <div className="relative w-full mb-3" style={{ aspectRatio: "16/9" }}>
                  <img
                    src={config.hero_imagen_url}
                    alt="Hero preview"
                    className="w-full h-full object-cover border"
                    style={{ borderColor: "rgba(0,0,0,0.1)" }}
                  />
                  <button
                    onClick={() => setConfig({ ...config, hero_imagen_url: "" })}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/70 text-white hover:bg-black"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  className="w-full mb-3 flex items-center justify-center border border-dashed text-xs font-body"
                  style={{
                    aspectRatio: "16/9",
                    borderColor: "rgba(0,0,0,0.15)",
                    color: "#8a7a6a",
                  }}
                >
                  Sin imagen — se usará la imagen por defecto
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-body border transition-colors disabled:opacity-50 hover:bg-black/5"
                style={{ borderColor: "rgba(0,0,0,0.2)", color: "#2c3e2c", fontWeight: 400 }}
              >
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Subiendo..." : "Subir imagen"}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase font-body transition-all duration-300 disabled:opacity-50"
            style={{
              backgroundColor: "#2c3e2c",
              color: "#fff",
              fontWeight: 400,
            }}
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Guardando..." : "Guardar configuración"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfigField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-body"
        style={{ color: "#8a7a6a", fontWeight: 400 }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 text-sm font-body border outline-none focus:border-black/20 transition-colors"
        style={{
          borderColor: "rgba(0,0,0,0.1)",
          color: "#2c3e2c",
          fontWeight: 300,
        }}
      />
    </div>
  );
}
