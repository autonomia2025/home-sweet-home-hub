
CREATE TABLE public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pregunta text NOT NULL,
  respuesta text NOT NULL,
  orden integer NOT NULL DEFAULT 0,
  activa boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active faqs" ON public.faqs
  FOR SELECT USING (activa = true);

CREATE POLICY "Auth can view all faqs" ON public.faqs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth can insert faqs" ON public.faqs
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth can update faqs" ON public.faqs
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Auth can delete faqs" ON public.faqs
  FOR DELETE TO authenticated USING (true);

INSERT INTO public.faqs (pregunta, respuesta, orden) VALUES
  ('¿Cobran comisión por sus servicios?', 'Nuestros honorarios dependen del tipo de operación. Te lo explicamos con transparencia desde la primera conversación, sin letra chica ni sorpresas.', 0),
  ('¿Puedo visitar una propiedad antes de decidir?', 'Por supuesto. Coordinamos visitas según tu disponibilidad. Escríbenos por WhatsApp y lo agendamos sin compromiso.', 1),
  ('¿Trabajan solo en Santiago o también en regiones?', 'Tenemos propiedades tanto en Santiago Centro como en la costa de la Región de O''Higgins, específicamente en Navidad y sus alrededores. Si tienes una propiedad en otra zona, igual contáctanos.', 2),
  ('¿Cuánto demora el proceso de arriendo o venta?', 'Depende de cada caso, pero nuestro foco es acompañarte en cada etapa para que el proceso sea lo más fluido posible. Algunos cierres se dan en semanas, otros toman más tiempo. Lo importante es que estés tranquilo en cada paso.', 3),
  ('¿Cómo puedo publicar mi propiedad con ustedes?', 'Escríbenos por WhatsApp contándonos sobre tu propiedad: ubicación, tipo y qué estás buscando (vender o arrendar). Nos ponemos en contacto para evaluarla y ver cómo podemos ayudarte.', 4);
