import { supabase } from "@/integrations/supabase/client";

export type Propiedad = {
  id: string;
  titulo: string;
  descripcion: string | null;
  precio: string | null;
  tipo: string;
  comuna: string | null;
  imagen_url: string | null;
  activa: boolean;
  orden: number;
  created_at: string;
};

export type Configuracion = {
  id: string;
  clave: string;
  valor: string | null;
};

export async function fetchPropiedadesActivas() {
  const { data, error } = await supabase
    .from("propiedades")
    .select("*")
    .eq("activa", true)
    .order("orden", { ascending: true });
  if (error) throw error;
  return data as Propiedad[];
}

export async function fetchAllPropiedades() {
  const { data, error } = await supabase
    .from("propiedades")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data as Propiedad[];
}

export async function fetchConfiguracion() {
  const { data, error } = await supabase.from("configuracion").select("*");
  if (error) throw error;
  const map: Record<string, string> = {};
  (data as Configuracion[]).forEach((c) => {
    map[c.clave] = c.valor || "";
  });
  return map;
}

export async function upsertPropiedad(propiedad: Partial<Propiedad>) {
  if (propiedad.id) {
    const { id, ...rest } = propiedad;
    const { error } = await supabase
      .from("propiedades")
      .update(rest as Record<string, unknown>)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("propiedades")
      .insert(propiedad as Record<string, unknown>);
    if (error) throw error;
  }
}

export async function deletePropiedad(id: string) {
  const { error } = await supabase.from("propiedades").delete().eq("id", id);
  if (error) throw error;
}

export async function updateConfiguracion(clave: string, valor: string) {
  const { error } = await supabase
    .from("configuracion")
    .update({ valor })
    .eq("clave", clave);
  if (error) throw error;
}

export async function uploadImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from("propiedades-imgs")
    .upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage
    .from("propiedades-imgs")
    .getPublicUrl(fileName);
  return data.publicUrl;
}
