
ALTER TABLE public.propiedades
  ADD COLUMN IF NOT EXISTS imagenes text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS descripcion_larga text,
  ADD COLUMN IF NOT EXISTS caracteristicas jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ubicacion_referencia text;
