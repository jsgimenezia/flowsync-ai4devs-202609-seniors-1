# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Vas a auditar las reglas de proceso de CLAUDE.md (sección "Reglas de proceso"),
contrastándolas con la evidencia del repositorio: los últimos 15 commits de la
rama actual y el estado actual de los archivos del proyecto. Es solo una
auditoría: no propongas ni hagas correcciones, aunque encuentres algo roto.

Reglas a auditar, una fila por cada una, con estos identificadores:
R1. Antes de tocar código, mirar en qué rama estás y seguir en ella si ya es
    una rama de trabajo, en vez de crear otra.
R2. Solo se crea rama nueva desde main o desde una sN/*.
R3. Nunca commitear directamente en main ni en una sN/*.
R4. El commit es por petición, usando la skill /commit.
R5. Un cambio que toque rutas, controladores, validadores o transformers de una
    capability se cierra en el mismo commit con el diff de .adonisjs/ y el
    README de esa capability (docs/capabilities/<nombre>/README.md) al día.
R6. gh pr create, con descripción completa en el cuerpo del PR, se hace una sola
    vez, al terminar la unidad de trabajo.
R7. El pase del subagente adversarial-reviewer sobre ese PR va una sola vez y es
    lo último antes de dar la unidad por terminada.
R8. Al abrir el PR, no repetir el resumen en el chat y responder solo con la URL.
La fuente de verdad de cada regla es el texto de CLAUDE.md, no mi resumen.

Fuentes permitidas: solo comandos de git de lectura (git log, git show, git diff,
git branch, git status...) y la lectura de archivos del repo. No uses gh ni red.
Si una regla no deja rastro en esas fuentes, el veredicto es que no se puede
comprobar; no lo deduzcas por ausencia de evidencia ni lo des por bueno.

Resultado: añade AL FINAL del archivo docs/auditoria/jsg.md, sin abrirlo ni
leerlo antes (usa un append con >> desde la terminal) y sin tocar lo que ya
contiene, una sección "## Auditoría" con:
- Una línea previa con el hash de HEAD y el comando exacto con el que obtuviste
  los 15 commits.
- Una tabla con una fila por regla (R1 a R8) y estas columnas:
  1. Regla: el identificador.
  2. Qué pide: una frase, con tus palabras.
  3. Qué se revisó: el comando exacto ejecutado o el archivo consultado.
  4. Veredicto: exactamente uno de "se cumple", "no se cumple" o
     "no se puede comprobar con la información disponible".
  5. Evidencia: una línea. Cita hashes cortos de commit. Si no se cumple, indica
     dónde; si no se puede comprobar, qué información falta.
  6. Qué haría con ella: exactamente una de "dejarla", "borrarla" o
     "convertirla en una comprobación automática".

Restricciones duras:
- No modifiques ningún archivo salvo docs/auditoria/jsg.md.
- No ejecutes git add, commit, checkout, switch, stash, reset ni nada que cambie
  el estado del repo.
- No inventes evidencia ni la completes de memoria: si no la has comprobado con
  un comando, no la escribas.
- Al terminar, responde solo con una línea: qué has escrito y dónde.

```

**Qué salió:** 

Primera versión de la tabla de auditoría del fichero jsg.md

---

## Prompt 2

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Hace un rato escribiste en docs/auditoria/jsg.md la sección "## Auditoría". Una
revisión independiente ha puesto en duda algunas afirmaciones de las filas R2,
R3, R4 y R5. Vuelve a comprobarlas con comandos y corrige solo lo que la
evidencia obligue a corregir. Sigue siendo una auditoría: no propongas ni hagas
correcciones del proyecto.

Ventana de commits: los mismos 15 de antes, del a3bb962 hacia atrás. Acótalos
con `git log a3bb962~15..a3bb962` (o `git log -15` sin filtros). No combines -15
con un filtro de ruta: eso devuelve los últimos 15 commits que tocan esa ruta,
no los últimos 15 del repo.

Afirmaciones a comprobar:

R3. Dijiste que "el historial lineal no dice en qué rama se hizo cada uno".
Revisa los mensajes completos (asunto y cuerpo) y los metadatos de los 15
commits y dime si alguno indica en qué rama se hizo. Para cada commit que lo
indique, averigua con git si es anterior o posterior al commit que introdujo la
redacción actual de esta regla en CLAUDE.md (por ejemplo con `git log -S` sobre
el texto de la regla). Decide el veredicto solo con lo que veas.

R4. Dijiste que "los 15 asuntos siguen `tipo(scope): descripción`". Cuéntalos
uno a uno y lista los que no cumplen. Contrasta además lo que exige exactamente
.claude/skills/commit/SKILL.md con lo que se puede observar en los commits, y
separa lo que es comprobable de lo que no.

R5. Dijiste que el commit cbe9617 "no lleva diff de .adonisjs/ porque solo se
añadieron decoradores", pero tú mismo anotaste que no se pudo confirmar.
Indica cuántos commits de la ventana son posteriores a la regla y tocan rutas,
controladores, validadores o transformers. Para cada uno, comprueba con git si
en el mismo commit hay diff de backend/.adonisjs/ y si se actualizó el README
de la capability (docs/capabilities/<nombre>/README.md). No afirmes que
.adonisjs/ no necesitaba cambiar a menos que lo puedas verificar con comandos
de solo lectura. Si solo se puede verificar regenerándolo (lo cual modificaría
archivos), dilo y refléjalo en el veredicto.

R2. Tu evidencia sale del reflog local, que no forma parte de los 15 commits ni
del estado de los archivos, y la única rama que juzgas es la de esta propia
auditoría. Separa en la columna de evidencia lo que sale del historial de
commits de lo que sale del reflog local, y reconsidera si el veredicto se
sostiene solo con lo primero.

Reglas para los veredictos: exactamente uno de "se cumple", "no se cumple" o
"no se puede comprobar con la información disponible". Los veredictos salen
solo de la evidencia que obtengas ahora; no tengas en cuenta ninguna otra parte
del archivo. Si la evidencia nueva no cambia un veredicto, déjalo igual.

Cómo escribirlo en docs/auditoria/jsg.md:
- Edita únicamente las filas R2, R3, R4 y R5 de la tabla de "## Auditoría"
  (columna de evidencia, y veredicto si cambia). No toques las demás filas ni
  nada anterior a la sección "## Auditoría".
- Debajo de la tabla añade una sección "## Cambios tras la primera pasada" con
  una línea por fila revisada: regla, veredicto antes -> después (o "sin
  cambio") y el comando que lo justifica.

Restricciones duras:
- Solo comandos de git de lectura y lectura de archivos. No uses gh ni red.
- No modifiques ningún archivo salvo docs/auditoria/jsg.md.
- No ejecutes git add, commit, checkout, switch, stash, reset ni nada que cambie
  el estado del repo.
- No inventes evidencia: si no la has comprobado con un comando, no la escribas.
- Al terminar, responde solo con una línea: qué filas has cambiado y cuáles no.

```

**Qué salió:** 

Actualización de la tabla de auditoría y apartado "Cambios tras la primera pasada" donde se documentan los cambios realizados en esta segunda pasada respecto a la primera.

---

## Prompt 3

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Comprobación manual de la regla "Nunca commitear directamente en main ni en una sN/*"

```

**Qué salió:** 
Comandos que ejecuté yo:

1. `git log -15 --format='%h %an | %s'`
   Para ver los 15 commits, quién los hizo y qué dice cada asunto, y buscar
   candidatos a "commit directo en una sN/*". Detecté que b955a72 y afc4b74
   (LIDR Academy) terminan en "en la rama de partida", y que afc4b74 aparece
   por encima de 0e56705 en el log, es decir, parece posterior al commit que
   fijó la redacción actual de la regla.

2. `git show --stat afc4b74`
   Para ver autor, fecha, mensaje completo y qué toca. Detecté: autor LIDR
   Academy, 2026-08-28, solo modifica README.md, y el asunto repite "en la
   rama de partida".

3. `git branch -a --contains afc4b74`
   Para ver en qué ramas está ese commit. Detecté: s5/start, origin/s5/start,
   upstream/s5/start, upstream/s4/end y auditoria-jsg. Limitación: esto solo
   dice que el commit forma parte del historial de esas ramas, no en cuál se
   creó, así que no prueba un commit directo por sí solo.

Lo que detecté: hay un commit posterior a la regla cuyo mensaje dice que se
hizo en la rama de partida de s5 (una sN/*), pero git no registra en qué rama
se creó un commit, así que la conclusión se apoya en el mensaje.

Contrastado después con ayuda de un agente (no lo ejecuté yo):
`git show -s --format=%B afc4b74` (sin cuerpo, solo el asunto),
`git log -S` sobre CLAUDE.md (la redacción actual la introdujo 0e56705),
`git merge-base --is-ancestor 0e56705 afc4b74` (la regla ya existía cuando se
hizo el commit) y `git merge-base --is-ancestor b955a72 0e56705` (b955a72 es
anterior a la regla actual, por eso no cuenta como evidencia).

Resultado: coincide con el veredicto del agente ("no se cumple"), con la
reserva de que son commits de mantenedores, no del flujo de un alumno.
---

## Prompt 4

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
---

## Prompt 2

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Hace un rato escribiste en docs/auditoria/jsg.md la sección "## Auditoría". Una
revisión independiente ha puesto en duda algunas afirmaciones de las filas R2,
R3, R4 y R5. Vuelve a comprobarlas con comandos y corrige solo lo que la
evidencia obligue a corregir. Sigue siendo una auditoría: no propongas ni hagas
correcciones del proyecto.

Ventana de commits: los mismos 15 de antes, del a3bb962 hacia atrás. Acótalos
con `git log a3bb962~15..a3bb962` (o `git log -15` sin filtros). No combines -15
con un filtro de ruta: eso devuelve los últimos 15 commits que tocan esa ruta,
no los últimos 15 del repo.

Afirmaciones a comprobar:

R3. Dijiste que "el historial lineal no dice en qué rama se hizo cada uno".
Revisa los mensajes completos (asunto y cuerpo) y los metadatos de los 15
commits y dime si alguno indica en qué rama se hizo. Para cada commit que lo
indique, averigua con git si es anterior o posterior al commit que introdujo la
redacción actual de esta regla en CLAUDE.md (por ejemplo con `git log -S` sobre
el texto de la regla). Decide el veredicto solo con lo que veas.

R4. Dijiste que "los 15 asuntos siguen `tipo(scope): descripción`". Cuéntalos
uno a uno y lista los que no cumplen. Contrasta además lo que exige exactamente
.claude/skills/commit/SKILL.md con lo que se puede observar en los commits, y
separa lo que es comprobable de lo que no.

R5. Dijiste que el commit cbe9617 "no lleva diff de .adonisjs/ porque solo se
añadieron decoradores", pero tú mismo anotaste que no se pudo confirmar.
Indica cuántos commits de la ventana son posteriores a la regla y tocan rutas,
controladores, validadores o transformers. Para cada uno, comprueba con git si
en el mismo commit hay diff de backend/.adonisjs/ y si se actualizó el README
de la capability (docs/capabilities/<nombre>/README.md). No afirmes que
.adonisjs/ no necesitaba cambiar a menos que lo puedas verificar con comandos
de solo lectura. Si solo se puede verificar regenerándolo (lo cual modificaría
archivos), dilo y refléjalo en el veredicto.

R2. Tu evidencia sale del reflog local, que no forma parte de los 15 commits ni
del estado de los archivos, y la única rama que juzgas es la de esta propia
auditoría. Separa en la columna de evidencia lo que sale del historial de
commits de lo que sale del reflog local, y reconsidera si el veredicto se
sostiene solo con lo primero.

Reglas para los veredictos: exactamente uno de "se cumple", "no se cumple" o
"no se puede comprobar con la información disponible". Los veredictos salen
solo de la evidencia que obtengas ahora; no tengas en cuenta ninguna otra parte
del archivo. Si la evidencia nueva no cambia un veredicto, déjalo igual.

Cómo escribirlo en docs/auditoria/jsg.md:
- Edita únicamente las filas R2, R3, R4 y R5 de la tabla de "## Auditoría"
  (columna de evidencia, y veredicto si cambia). No toques las demás filas ni
  nada anterior a la sección "## Auditoría".
- Debajo de la tabla añade una sección "## Cambios tras la primera pasada" con
  una línea por fila revisada: regla, veredicto antes -> después (o "sin
  cambio") y el comando que lo justifica.

Restricciones duras:
- Solo comandos de git de lectura y lectura de archivos. No uses gh ni red.
- No modifiques ningún archivo salvo docs/auditoria/jsg.md.
- No ejecutes git add, commit, checkout, switch, stash, reset ni nada que cambie
  el estado del repo.
- No inventes evidencia: si no la has comprobado con un comando, no la escribas.
- Al terminar, responde solo con una línea: qué filas has cambiado y cuáles no.

```

**Qué salió:** 

Actualización de la tabla de auditoría y apartado "Cambios tras la primera pasada" donde se documentan los cambios realizados en esta segunda pasada respecto a la primera.


```

**Qué salió:** 

Se acortan las filas R2, R3, R4 y R5 de la tabla de docs/auditoria/jsg.md, dejando sus veredictos y la columna "Qué haría con ella" como estaban, y se añade la línea de formato al final de "## Cambios tras la primera pasada".
