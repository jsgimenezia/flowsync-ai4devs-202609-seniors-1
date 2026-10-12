# Auditoría de las reglas de proceso

## Expectativa inicial

Registrada el 2026-10-12 a las 18:26, antes de lanzar el primer prompt de la auditoría y sin haber comprobado el historial para este ejercicio. No se modifica después de ver el resultado.

| Regla | Qué pide (resumen) | Expectativa |
|---|---|---|
| R1 | Antes de tocar código, mirar en qué rama estás y seguir en ella si ya es una rama de trabajo | sí |
| R2 | Solo se crea rama nueva desde `main` o una `sN/*` | sí |
| R3 | Nunca commitear directamente en `main` ni en una `sN/*` | sí |
| R4 | Un commit por petición, usando la skill `/commit` | sí |
| R5 | Un cambio en rutas, controladores, validadores o transformers se cierra en el mismo commit con `.adonisjs/` y el README de la capability al día | ni idea |
| R6 | `gh pr create` con descripción completa, una sola vez, al terminar la unidad de trabajo | sí |
| R7 | El pase del `adversarial-reviewer` sobre el PR va una sola vez y es lo último antes de dar la unidad por terminada | sí |
| R8 | Al abrir el PR, no repetir el resumen en el chat y responder solo con la URL | no |


## Auditoría

HEAD `a3bb962b388fd143f1f0760fde9c32fdf31d46ae` (rama `auditoria-jsg`). Los 15 commits salen de `git log -15 --format='%h %an %ad %s' --date=short`.

| Regla | Qué pide | Qué se revisó | Veredicto | Evidencia | Qué haría con ella |
|---|---|---|---|---|---|
| R1 | Antes de empezar, mirar la rama actual y, si ya es de trabajo (ni `main` ni `sN/*`), seguir en ella en vez de abrir otra. | `git reflog --date=iso -n 60` y `git reflog show --date=iso auditoria-jsg` | no se puede comprobar con la información disponible | Mirar la rama no deja rastro en git; el reflog solo dice que `auditoria-jsg` salió de `s5/start` (a3bb962) y falta saber si había una unidad de trabajo abierta que debiera haberse continuado. | dejarla |
| R2 | Una rama nueva solo se crea desde `main` o desde una `sN/*`. | `git log s5/start..auditoria-jsg`; `git reflog show --date=iso auditoria-jsg` | no se puede comprobar con la información disponible | El historial de commits no registra la creación de ramas; el único dato es el reflog local (`auditoria-jsg` creada desde `s5/start`, a3bb962), que no es historial de commits ni estado de archivos. | dejarla |
| R3 | Nunca hacer un commit directamente sobre `main` ni sobre una `sN/*`. | `git log a3bb962~15..a3bb962` (mensajes completos); `git log -S` sobre CLAUDE.md; `git branch -a --contains afc4b74` | no se cumple | afc4b74 dice «en la rama de partida» de s5, posterior a 0e56705 (fijó la redacción actual); git no registra la rama de creación y la conclusión se apoya en el mensaje; son commits de mantenedores, no de un alumno. | convertirla en una comprobación automática |
| R4 | Cada petición se cierra con su propio commit, hecho con la skill `/commit`. | `git log a3bb962~15..a3bb962 --format='%h %s'`; `git log -1 --format=%B <hash>`; `.claude/skills/commit/SKILL.md` | no se puede comprobar con la información disponible | 14 de 15 asuntos cumplen `tipo(scope): descripción` (no cumple a3bb962) y 12 de 15 llevan Co-Authored-By, que la skill no exige; no se puede comprobar que se invocara la skill ni qué es «una petición». | dejarla |
| R5 | Si un cambio toca rutas, controladores, validadores o transformers de una capability, el mismo commit lleva el diff de `.adonisjs/` y el README `docs/capabilities/<nombre>/README.md` al día. | `git diff-tree --no-commit-id --name-only -r <hash>`; `git show cbe9617 -- backend/app/controllers`; código del generador (`@adonisjs/assembler`, `@tuyau/core`) | se cumple | De los commits posteriores a la regla solo cbe9617 toca controladores, con README de tasks y sin diff en `backend/.adonisjs/`; que no hacía falta se verificó leyendo, sin regenerar, con un solo commit aplicable. | convertirla en una comprobación automática |
| R6 | `gh pr create`, con la descripción completa en el cuerpo, se ejecuta una sola vez, al terminar la unidad de trabajo. | `git log -15 --format='%h %p %s'`; `git for-each-ref`; `git branch -a` | no se puede comprobar con la información disponible | Un PR vive en GitHub y no en git: los 15 commits tienen un solo padre (sin merges) y no hay refs de PR; sin `gh` no se sabe cuántos PR se abrieron ni qué decía su cuerpo. | dejarla |
| R7 | El pase de `adversarial-reviewer` sobre ese PR va una sola vez y es lo último antes de dar la unidad por terminada. | `.claude/agents/adversarial-reviewer.md`; `git show --stat 8f9e715`; búsqueda del texto "adversarial" en los archivos del repo | no se puede comprobar con la información disponible | 8f9e715 solo prueba que el subagente existe y qué contrasta; sus ejecuciones no dejan rastro en git ni en archivos, y falta el historial del PR y de la sesión para ver el orden respecto del cierre. | convertirla en una comprobación automática |
| R8 | Al abrir el PR no se repite el resumen en el chat: se responde solo con la URL. | Búsqueda del texto "gh pr" y "pull request" en los archivos del repo y en los mensajes de los 15 commits | no se puede comprobar con la información disponible | Es una norma sobre lo que se contesta en el chat y ni git ni los archivos guardan la conversación; falta la transcripción de la sesión en la que se abrió el PR. | borrarla |

## Parte B

1. **La regla en la que más me equivoqué: R3.** Di por hecho que se cumplía y el historial muestra `afc4b74`, posterior a la regla y con «en la rama de partida» en el asunto; en R1, R2, R4, R6 y R7 también di un «sí» que la auditoría no pudo sostener ni refutar.
2. **Una regla que no se puede comprobar: R7.** Revisar o no revisar no deja rastro en git ni en archivos; para poder verificarla habría que convertirla en un job de CI que ejecute el revisor al abrir el PR y deje su informe en el propio PR.
3. **La regla que eliminaría: R8**, del caso de la regla que no aporta valor: ninguna herramienta la hace cumplir y el PR ya lleva el resumen, así que repetirlo en el chat no añade nada; no puedo probar que nadie la siga porque no se puede comprobar, pero incumplirla no tiene efecto.

## Cambios tras la primera pasada

- R2: "se cumple" -> "no se puede comprobar con la información disponible"; el historial de commits no registra la creación de ramas y solo el reflog local la muestra. Comandos: `git log s5/start..auditoria-jsg --format=%h` y `git reflog show --date=iso auditoria-jsg`.
- R3: "no se puede comprobar con la información disponible" -> "no se cumple"; afc4b74 dice "en la rama de partida" (s5) y es posterior a 0e56705. Comandos: `git log a3bb962~15..a3bb962 --format='=====%h%n%B'`, `git log -S'Nunca commitear directo en `main` ni en una `sN/*`' -- CLAUDE.md` y `git merge-base --is-ancestor 0e56705 afc4b74`.
- R4: sin cambio ("no se puede comprobar con la información disponible"); se acota la evidencia: 14 de 15 asuntos cumplen y a3bb962 no. Comando: `git log a3bb962~15..a3bb962 --format='%h %s' | grep -v -E '^[0-9a-f]+ (feat|fix|refactor|docs|test|chore)\([^)]+\): .+'`.
- R5: sin cambio ("se cumple"); la evidencia pasa a contar 5 commits posteriores a la regla, de los que solo cbe9617 toca rutas, controladores, validadores o transformers, y la ausencia de diff en `.adonisjs/` se verifica por lectura y no regenerando. Comandos: `git diff-tree --no-commit-id --name-only -r cbe9617` y `git show cbe9617 -- backend/app/controllers`.
- R2 a R5: se acortaron las celdas de "Qué se revisó" y "Evidencia" por formato, sin cambiar veredictos ni evidencia.
- Columna "Qué haría con ella": la decide el autor fila a fila, no el agente. Criterio: convertirla en comprobación automática si el fallo es silencioso y caro (R3, R5, R7); dejarla si el fallo se nota enseguida, casi nunca ocurre o cuesta poco (R1, R2, R4, R6); borrarla si incumplirla no tiene efecto (R8, porque el resumen ya está en el PR). Cambios respecto a la propuesta del agente: R7 "dejarla" -> "convertirla en una comprobación automática" y R8 "dejarla" -> "borrarla". R7 se convertiría con disparador solo al abrir el PR, para conservar una ejecución por unidad de trabajo.
