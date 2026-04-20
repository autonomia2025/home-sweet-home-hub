

## Plan: Botones a Google Maps + indicador de scroll

### 1. Botón "Ver en Google Maps" en cada item de la lista

En `LandingMap.tsx`, junto al link "Ver detalle →", agregar un segundo link:

```tsx
<a
  href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`}
  target="_blank"
  rel="noopener noreferrer"
>
  Abrir en Google Maps ↗
</a>
```

- Usa lat/lng que ya se carga desde Supabase (campos existentes en la tabla `propiedades`)
- Cuando el admin edite lat/lng en el panel, el link se actualiza automáticamente (ya hay realtime + el link se construye en cada render)
- Aplica tanto en desktop como mobile, con el mismo estilo verde editorial que "Ver detalle"

### 2. Affordance visual de scroll en la lista

Hoy la lista tiene `max-h-[520px] overflow-y-auto` pero no se nota que hay más abajo. Agregar:

- **Contador con indicación**: cambiar el header de la lista a algo como `"3 PROPIEDADES · DESLIZA PARA VER TODAS"` solo cuando hay más de 3
- **Gradiente fade en el borde inferior**: un overlay sutil de `#f0ebe3 → transparent` en el bottom del contenedor scrolleable, indicando que hay contenido oculto
- **Scrollbar estilizada**: un scrollbar fino en color verde editorial (`#5a7a5a`) en vez del default del navegador, vía CSS inline con `scrollbar-width: thin` y `scrollbar-color`

En mobile: como ya es un scroll vertical natural de la página, no aplica fade — pero sí actualizar el contador.

### 3. Verificación de actualización en tiempo real

Esto **ya funciona** (no hace falta tocar nada):
- `src/routes/index.tsx` se suscribe a cambios vía `subscribeToPropiedades()`
- Cuando el admin guarda una propiedad con lat/lng nuevos, refetch automático
- `LandingMap` recibe el array actualizado por props → marker nuevo en el mapa + item nuevo en la lista + link a Google Maps con las coords nuevas

### Archivos afectados

- `src/components/landing/LandingMap.tsx` — único archivo a modificar

### Lo que NO toco

- `LeafletMap.tsx`, schema DB, panel admin, resto de la landing
- El comportamiento de click en la lista (sigue haciendo flyTo + zoom 12 como acordamos antes)

