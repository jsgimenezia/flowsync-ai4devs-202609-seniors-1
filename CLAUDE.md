# CLAUDE.md

Este archivo proporciona guía a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Qué es esto

FlowSync: ejercicio de práctica de un curso (ai4devs). API en AdonisJS 7 (`backend/`) + frontend en React 19 + Vite (`frontend/`). Las dos apps son proyectos npm independientes (no hay `package.json` compartido en la raíz) y corren en servidores de desarrollo distintos, en puertos distintos.

Este repo es la plantilla de partida del ejercicio del curso (rama `s1/start`). Los entregables del ejercicio van en `docs/harness/comparacion.md` y `prompts.md` en la raíz del repo — ver `README.md` para el enunciado completo. Las entregas van contra el repo del curso `LIDR-academy/flowsync-ai4devs-202609-seniors-1` (grupo seniors-1), no contra seniors-2, aunque algún documento mencione seniors-2.

## Comandos

### Backend (`backend/`)

```bash
cd backend
npm install
cp .env.example .env
node ace generate:key       # setup inicial, escribe APP_KEY en .env
node ace migration:run      # setup inicial / tras nuevas migraciones
npm run dev                 # arranca con HMR en http://localhost:3333
npm run build                # node ace build
npm run test                 # node ace test
npm run lint                 # eslint .
npm run format                # prettier --write .
npm run typecheck             # tsc --noEmit
```

Ejecutar un solo archivo de test: `node ace test --files "tests/functional/algun_archivo.spec.ts"` (runner Japa; ver `adonisrc.ts` para la definición de suites — `unit` y `functional`, tomadas de `tests/unit/**` y `tests/functional/**`).

### Frontend (`frontend/`)

Ejecútalo en una segunda terminal (el backend se queda corriendo en la primera):

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
npm run build      # tsc -b && vite build
npm run lint        # oxlint
npm run preview      # previsualiza el build de producción
```

No hay proxy configurado en el dev server (`vite.config.ts` no tiene `server.proxy`), así que el frontend debe llamar a la URL absoluta del backend (`http://localhost:3333`) directamente; CORS está abierto en dev (`backend/config/cors.ts`: `origin: app.inDev ? true : []`, `credentials: true`).

## Arquitectura

### Backend: AdonisJS 7, patrón controlador + transformer + schema

- **Rutas** (`backend/start/routes.ts`): todas las rutas de la API están bajo `/api/v1`, divididas en un grupo `auth` sin autenticar (`POST /api/v1/auth/signup`, `POST /api/v1/auth/login`) y un grupo `profile` autenticado (`GET /api/v1/account/profile`, `POST /api/v1/account/logout`) protegido por `middleware.auth()`. Las rutas referencian controladores indirectamente a través del registro generado `#generated/controllers` en vez de importar las clases de controlador directamente — esto viene de Tuyau (`@tuyau/core`), que también genera un cliente/registro tipado de la API bajo `backend/.adonisjs/` (no edites ese directorio a mano; se regenera a partir de rutas y schema).
- **Auth** (`backend/config/auth.ts`): hay dos guards configurados — `api` (por defecto), un guard stateless de token bearer vía `DbAccessTokensProvider` sobre el modelo `User`, y `web`, un guard de sesión. Los nuevos endpoints del backend que requieran auth deben usar por defecto el guard de token `api`, salvo razón concreta para usar sesiones.
- **Modelos y schema**: `backend/database/schema.ts` está **autogenerado** por `node ace migration:run` (según su propia cabecera) a partir de `backend/database/migrations/*` y `backend/database/schema_rules.ts` — nunca edites `schema.ts` a mano; edita una migración (o `schema_rules.ts` para las reglas de generación) y vuelve a correr las migraciones. Los modelos de la aplicación (`backend/app/models/user.ts`) extienden las clases base `*Schema` generadas vía `compose()`, añadiendo comportamiento (p. ej. `withAuthFinder` para verificar credenciales, getters calculados como `initials`).
- **Serialización**: los controladores nunca devuelven modelos en crudo. Llaman a `UserTransformer.transform(...)` (`backend/app/transformers/`, que extiende `BaseTransformer`) para filtrar los campos de salida, y luego devuelven a través de `ctx.serialize(...)`, un método propio de `HttpContext` añadido por `backend/providers/api_provider.ts`. Ese provider envuelve todas las respuestas en `{ data: ... }` (`ApiSerializer.wrap = 'data'`) y gestiona los metadatos de paginación de Lucid — usa `serialize.withoutWrapping(...)` cuando una ruta no deba envolver la respuesta. Sigue esta cadena controlador → transformer → serialize para cualquier endpoint nuevo, en vez de devolver modelos/objetos directamente.
- **Validación**: los cuerpos de las peticiones se validan con validadores VineJS en `backend/app/validators/`, invocados con `request.validateUsing(...)` dentro de los controladores. Las reglas de campo compartidas (p. ej. `email()`, `password()`) están definidas como pequeñas funciones factory al principio del archivo de validadores y se reutilizan entre validadores (signup vs. login) — sigue ese patrón en vez de duplicar reglas.
- **Alias de rutas**: el backend usa subpath imports de Node (ver `imports` en `backend/package.json`), p. ej. `#models/*`, `#controllers/*`, `#validators/*`, `#transformers/*`, `#database/*`, `#config/*`, `#generated/*`. Usa estos alias en vez de rutas relativas al añadir archivos al backend.

### Frontend: scaffold mínimo de Vite/React, la UI de login aún no existe

`frontend/src/App.tsx` sigue siendo el starter por defecto de Vite+React (botón contador, enlaces a Vite/React) — no hay routing, gestión de estado ni cliente de API todavía. Implementar la UI de login (llamando a `/api/v1/auth/login` del backend) sobre este scaffold es el propio ejercicio; no existen convenciones de auth en el frontend que seguir todavía, así que revisa `backend/start/routes.ts` y los controladores de arriba para conocer el contrato real (forma de la petición/respuesta, el envoltorio `{ data: ... }`, el token bearer en la respuesta de login) antes de conectarlo.

## Reglas de proceso
- Antes de tocar código: crear una rama nueva (`git checkout -b feat/<slug>`). Nunca
  commitear directo en `main`/`s1/start`.
- Al cerrar la tarea: usar la skill `/commit`, luego `gh pr create` con una descripción
  completa de los cambios en el cuerpo del PR.
- Después de abrir el PR: usar el subagente `adversarial-reviewer` sobre él, antes de
  darlo por terminado.
- No repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo
  con la URL del PR.