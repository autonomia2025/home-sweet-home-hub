import { useState } from "react";
import { updateConfiguracion } from "@/lib/supabase-helpers";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface AdminConfigProps {
  config: Record<string, string>;
  onRefresh: () => void;
}

export function AdminConfig({ config: initialConfig, onRefresh }: AdminConfigProps) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [clave, valor] of Object.entries(config)) {
        await updateConfiguracion(clave, valor);
      }
      toast.success("Configuración guardada");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
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
