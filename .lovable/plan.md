

## Diagnóstico

El crash de `/admin` ("Something went wrong") es un error de runtime de React:
```
TypeError: Cannot read properties of null (reading 'removeChild')
```

**Causa raíz:** doble manipulación del `<head>`:
- TanStack Router controla los meta tags vía `head()` + `<HeadContent />` en `__root.tsx`.
- El hook `useSEO` (usado en `/admin` y `/propiedad/$id`) inserta y luego **remueve** manualmente meta/canonical del DOM en su cleanup.

Cuando navegas o React re-renderiza, el cleanup de `useSEO` borra nodos que React ya tiene referenciados → `removeChild` sobre un padre `null` → error fatal que el ErrorBoundary muestra como "Something went wrong".

Las columnas `lat`/`lng` ya existen en DB (verificado en el schema), así que ese ya **no** es el problema.

## Plan de fix

1. **Eliminar `useSEO` de las rutas** (`src/routes/admin/index.tsx` y `src/routes/propiedad.$id.tsx`). Reemplazar por la API nativa `head()` de TanStack Router que ya está parcialmente en uso. Para `/propiedad/$id` el título se setea con un `head()` estático simple (el dinámico por loader vendría después si lo querés).

2. **Borrar el archivo `src/hooks/useSEO.ts`** (ya no se usa en ningún lado) para evitar que vuelva a usarse por error.

3. **Hacer `loadData` robusto** en `src/routes/admin/index.tsx` con `Promise.allSettled`, así un fallo parcial (ej. una tabla vacía) no rompe todo el panel.

4. **Quitar `useSEO` del helper de detalle de propiedad** y mantener un `head()` con título genérico "Propiedad — Pérez-Campos".

## Archivos afectados

- `src/routes/admin/index.tsx` — quitar useSEO + Promise.allSettled
- `src/routes/propiedad.$id.tsx` — quitar useSEO, agregar `head()` estático
- `src/hooks/useSEO.ts` — eliminar

## Lo que NO toco

- `LandingHero`, `AdminConfig`, `ConfigContext` — ya funcionan bien
- DB schema — `lat`/`lng` ya existen
- Toaster — ya está en `__root.tsx`

