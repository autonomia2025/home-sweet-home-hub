import { supabase } from "@/integrations/supabase/client";

export type Caracteristicas = {
  superficie_m2?: number;
  dormitorios?: number;
  banos?: number;
  estacionamiento?: boolean;
  bodega?: boolean;
  conexion_lavadora?: boolean;
  closet?: boolean;
  terraza_propia?: boolean;
};

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
  imagenes: string[];
  descripcion_larga: string | null;
  caracteristicas: Caracteristicas;
  ubicacion_referencia: string | null;
  lat?: number | null;
  lng?: number | null;
  // Nuevos campos
  piso?: number | null;
  gastos_comunes?: string | null;
  contribuciones?: boolean | null;
  permite_mascotas?: boolean | null;
  amoblado?: boolean | null;
  actualmente_ocupado?: boolean | null;
  ano_construccion?: number | null;
  orientacion?: string | null;
  estado_propiedad?: string | null;
  amenidades?: string[] | null;
  condiciones_adicionales?: string | null;
};

export type Configuracion = {
  id: string;
  clave: string;
  valor: string | null;
};

export type FAQ = {
  id: string;
  pregunta: string;
  respuesta: string;
  orden: number;
  activa: boolean;
  created_at: string;
};

// ── Propiedades ──

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

export async function fetchPropiedadById(id: string) {
  const { data, error } = await supabase
    .from("propiedades")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Propiedad;
}

export async function upsertPropiedad(propiedad: Partial<Propiedad>) {
  if (propiedad.id) {
    const { id, ...rest } = propiedad;
    const { error } = await (supabase
      .from("propiedades")
      .update(rest as any)
      .eq("id", id) as any);
    if (error) throw error;
  } else {
    const { error } = await (supabase
      .from("propiedades")
      .insert(propiedad as any) as any);
    if (error) throw error;
  }
}

export async function deletePropiedad(id: string) {
  const { error } = await supabase.from("propiedades").delete().eq("id", id);
  if (error) throw error;
}

export async function togglePropiedad(id: string, activa: boolean) {
  const { error } = await (supabase
    .from("propiedades")
    .update({ activa } as any)
    .eq("id", id) as any);
  if (error) throw error;
}

export function subscribeToPropiedades(callback: () => void) {
  const channel = supabase
    .channel(`propiedades-changes-${crypto.randomUUID()}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "propiedades" }, callback)
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}

// ── Configuracion ──

export async function fetchConfiguracion() {
  const { data, error } = await supabase.from("configuracion").select("*");
  if (error) throw error;
  const map: Record<string, string> = {};
  (data as Configuracion[]).forEach((c) => {
    map[c.clave] = c.valor || "";
  });
  return map;
}

export function subscribeToConfiguracion(callback: () => void) {
  const channel = supabase
    .channel(`configuracion-changes-${crypto.randomUUID()}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "configuracion" }, callback)
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}

export async function updateConfiguracion(clave: string, valor: string) {
  // Upsert: update if exists, insert otherwise
  const { data: existing } = await supabase
    .from("configuracion")
    .select("id")
    .eq("clave", clave)
    .maybeSingle();
  if (existing) {
    const { error } = await (supabase
      .from("configuracion")
      .update({ valor } as any)
      .eq("clave", clave) as any);
    if (error) throw error;
  } else {
    const { error } = await (supabase
      .from("configuracion")
      .insert({ clave, valor } as any) as any);
    if (error) throw error;
  }
}

// ── FAQs ──

export async function fetchFAQsActivas() {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("activa", true)
    .order("orden", { ascending: true });
  if (error) throw error;
  return data as FAQ[];
}

export async function fetchAllFAQs() {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data as FAQ[];
}

export async function upsertFAQ(faq: Partial<FAQ>) {
  if (faq.id) {
    const { id, ...rest } = faq;
    const { error } = await (supabase
      .from("faqs")
      .update(rest as any)
      .eq("id", id) as any);
    if (error) throw error;
  } else {
    const { error } = await (supabase
      .from("faqs")
      .insert(faq as any) as any);
    if (error) throw error;
  }
}

export async function deleteFAQ(id: string) {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleFAQ(id: string, activa: boolean) {
  const { error } = await (supabase
    .from("faqs")
    .update({ activa } as any)
    .eq("id", id) as any);
  if (error) throw error;
}

// ── Storage ──

export async function uploadImage(file: File): Promise<string> {
  const fileName = `${crypto.randomUUID()}-${Date.now()}.${file.name.split('.').pop()}`;
  const { error } = await supabase.storage
    .from("propiedades-imgs")
    .upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage
    .from("propiedades-imgs")
    .getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteStorageImage(url: string) {
  const parts = url.split("/propiedades-imgs/");
  if (parts.length < 2) return;
  const path = decodeURIComponent(parts[1]);
  await supabase.storage.from("propiedades-imgs").remove([path]);
}
