

## Plan: Reemplazar mapa SVG por Leaflet real + mejoras mobile

### Lo que voy a hacer

**1. Instalar dependencias**
- `leaflet`, `react-leaflet`, `@types/leaflet`

**2. Refactor `LandingMap.tsx`**

Eliminar: SVG completo, `BBOX`, `MAP_W`, `MAP_H`, `project()`, import de `MapPin` si ya no se usa.

Mantener: header de sección, lista derecha (desktop), colores/tipografía, tooltip card.

Agregar mapa Leaflet (desktop):
- `MapContainer` centro `[-33.8, -71.2]`, zoom 8, altura 520px
- Tiles **CartoDB Voyager** (estética limpia, coherente con paleta cálida)
- Sin `zoomControl` ni `attributionControl` visibles → atribución como texto chico al pie del mapa (requerimiento legal de las tiles, no se puede omitir)
- `dragging` desactivado en mobile, activo en desktop
- Markers custom con `divIcon` (círculo verde oscuro `#2c3e2c` con halo `rgba(90,122,90,0.25)`), tamaño según `activeId`
- Click en marker → `setActiveId(p.id)` (resalta item en lista)
- Hover en item lista → marker correspondiente se agranda (vía `activeId` ya existente)
- Click en item lista → `map.flyTo([lat, lng], 12)` usando `useRef` al map instance + abrir tooltip
- Fix CSS Leaflet (`import "leaflet/dist/leaflet.css"`) + fix iconos default

### Mejora mobile (mi propuesta)

Hoy en mobile solo ves la lista — sin contexto geográfico. Propongo **mapa también en mobile, compacto y ligado a la lista**:

**Layout mobile:**
- Mapa arriba: 280px de alto, **sticky** cuando scrolleas la lista (se queda fijo arriba)
- `dragging={false}`, `scrollWheelZoom={false}`, `touchZoom={false}` → no interfiere con scroll vertical de la página
- Lista debajo: cards horizontales como ya están
- Al tocar una card → mapa hace `flyTo` suave + marker se resalta + card activa con borde verde más grueso

Beneficios:
- Usuario ve dónde queda cada propiedad sin abrir nada
- Mapa "sigue" la exploración sin pelearse con el scroll touch
- Touch-friendly (no requiere gestos de mapa)

**Alternativa más simple:** mapa estático arriba (280px) sin sticky, lista debajo. Más predecible, menos código.

### Preguntas / decisiones abiertas

Antes de codear necesito que confirmes dos cosas:

1. **Mobile UX:**
   a) Mapa sticky arriba + lista scrolleable (mi recomendación)
   b) Mapa estático arriba + lista debajo (más simple)
   c) Solo lista, sin mapa en mobile (ahorra peso de Leaflet ~40KB gzip)

2. **Click en item de lista (desktop):**
   a) `flyTo` + zoom 12 + abrir tooltip de la card sobre el mapa
   b) Solo `flyTo` + zoom 12, sin tooltip (más limpio)
   c) Ir directo a `/propiedad/$id` como hoy (más conversión, ignora el mapa)

### Archivos afectados

- `src/components/landing/LandingMap.tsx` — reescritura del bloque del mapa
- `package.json` — 3 deps nuevas (`leaflet`, `react-leaflet`, `@types/leaflet`)

### Lo que NO toco

- Header de sección, lista derecha, versión de tipografía/colores
- Schema DB (`lat`/`lng` ya existen)
- Resto de la landing

Decime qué opción elegís en cada pregunta y arranco.

