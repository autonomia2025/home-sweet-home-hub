ALTER TABLE public.propiedades 
ADD COLUMN IF NOT EXISTS lat numeric,
ADD COLUMN IF NOT EXISTS lng numeric;