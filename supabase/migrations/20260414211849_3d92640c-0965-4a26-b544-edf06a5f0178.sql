
-- Create propiedades table
CREATE TABLE public.propiedades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  precio TEXT,
  tipo TEXT NOT NULL DEFAULT 'venta',
  comuna TEXT,
  imagen_url TEXT,
  activa BOOLEAN NOT NULL DEFAULT true,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create configuracion table
CREATE TABLE public.configuracion (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clave TEXT NOT NULL UNIQUE,
  valor TEXT
);

-- Enable RLS
ALTER TABLE public.propiedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

-- Propiedades: public read for active ones
CREATE POLICY "Public can view active propiedades"
  ON public.propiedades FOR SELECT
  USING (activa = true);

-- Propiedades: auth can do everything
CREATE POLICY "Auth can insert propiedades"
  ON public.propiedades FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth can update propiedades"
  ON public.propiedades FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Auth can delete propiedades"
  ON public.propiedades FOR DELETE
  TO authenticated
  USING (true);

-- Auth can also read inactive propiedades
CREATE POLICY "Auth can view all propiedades"
  ON public.propiedades FOR SELECT
  TO authenticated
  USING (true);

-- Configuracion: public read
CREATE POLICY "Public can view configuracion"
  ON public.configuracion FOR SELECT
  USING (true);

-- Configuracion: auth can update
CREATE POLICY "Auth can update configuracion"
  ON public.configuracion FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Auth can insert configuracion"
  ON public.configuracion FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('propiedades-imgs', 'propiedades-imgs', true);

-- Storage policies
CREATE POLICY "Public can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'propiedades-imgs');

CREATE POLICY "Auth can upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'propiedades-imgs');

CREATE POLICY "Auth can update property images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'propiedades-imgs');

CREATE POLICY "Auth can delete property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'propiedades-imgs');
