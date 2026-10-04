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
Busca en toda la suite de tests del backend (backend/tests/) cualquier test que
toque, de cualquier forma, el responsable (assignee) de una tarea: su nombre,
sus iniciales, o qué datos de su cuenta se exponen o no se exponen junto a la
tarea.

Para cada test que encuentres, dime:
- Ruta del fichero.
- Nombre exacto del test tal como aparece en la suite.
- Una línea de qué comprueba exactamente (qué hace y qué afirma), sin juzgar
  si cubre o no ningún escenario concreto.

No valores si algo está "cubierto" o no, no me digas si falta algo, y no
toques ni un archivo. Es solo una búsqueda y un listado.

```

**Qué salió:** 

Ningún test de backend/tests/ toca el responsable (assignee) de una tarea. No hay ninguna referencia a tareas, assignee, responsable ni asignad* en la suite. Solo hay cuatro ficheros de test, todos de auth (tests/functional/auth/), más tests/bootstrap.ts.

Lo más cercano son tests que tocan el nombre o las iniciales de la cuenta de usuario, o los datos de cuenta que se devuelven. Ninguno relaciona esos datos con una tarea.

Nombre e iniciales de la cuenta

Fichero: tests/functional/auth/initials.spec.ts
Nombre exacto del test: un nombre de dos palabras da la inicial de cada una
Qué hace y afirma: Crea un User con fullName "Ada Lovelace", hace login y afirma que data.user.initials es 'AL'.
────────────────────────────────────────
Fichero: tests/functional/auth/initials.spec.ts
Nombre exacto del test: un nombre de una palabra da sus dos primeras letras
Qué hace y afirma: Crea un User con fullName "Ada", hace login y afirma que data.user.initials es 'AD'.
────────────────────────────────────────
Fichero: tests/functional/auth/initials.spec.ts
Nombre exacto del test: sin nombre, las iniciales salen del email
Qué hace y afirma: Crea un User con fullName nulo y email ada@example.com, hace login y afirma que data.user.initials es
'AE'.
────────────────────────────────────────
Fichero: tests/functional/auth/signup.spec.ts
Nombre exacto del test: registrarse devuelve la cuenta y un token que ya sirve
Qué hace y afirma: Hace signup con "Ada Lovelace". Afirma que la respuesta trae email, fullName e initials ('AL') y un
token string. Luego usa el token en GET /account/profile y afirma un 200 con el email correcto.
────────────────────────────────────────
Fichero: tests/functional/auth/signup.spec.ts
Nombre exacto del test: una cuenta puede quedarse sin nombre
Qué hace y afirma: Hace signup con fullName: null. Afirma un 200 y que data.user.fullName es nulo.

Datos de cuenta que se exponen o no

Fichero: tests/functional/auth/signup.spec.ts
Nombre exacto del test: la contraseña nunca sale en la respuesta
Qué hace y afirma: Hace signup y serializa data.user a JSON. Afirma que no contiene el texto secreto123 ni la palabra
password.
────────────────────────────────────────
Fichero: tests/functional/auth/session.spec.ts
Nombre exacto del test: el perfil devuelve la cuenta del token presentado
Qué hace y afirma: Hace login y GET /account/profile con el token. Afirma un 200, que el perfil tiene las propiedades
id, fullName, email, initials, createdAt y updatedAt, y que email es ada@example.com.
────────────────────────────────────────
Fichero: tests/functional/auth/session.spec.ts
Nombre exacto del test: sin cabecera de autorización no se devuelve nada de la cuenta
Qué hace y afirma: Llama a GET /account/profile sin Authorization y afirma un 401.
────────────────────────────────────────
Fichero: tests/functional/auth/login.spec.ts
Nombre exacto del test: con las credenciales correctas se emite un token que autentica
Qué hace y afirma: Hace login válido. Afirma que data.user.email es ada@example.com y que el token da un 200 en GET
/account/profile.

No he modificado ningún fichero.

---

## Prompt 2

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Efectivamente parece que no hay ningún test que llegue a crear o utilizar una tarea. Muéstrame el código exacto y completo del test "un nombre de dos palabras da la inicial de cada una" en tests/functional/auth/initials.spec.ts, sin resumir ni juzgar nada. Quiero ver línea por línea qué crea (qué modelos, qué peticiones) y qué afirma (sobre qué dato exactamente), para confirmar yo mismo si en algún punto llega a crear o tocar una tarea.

```

**Qué salió:** 

Muestra el código donde se hace el test, efectivamente el único modelo que tiene un import es user, no hay nada de Task.

---

## Prompt 3

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Confirmado, ese test no toca ninguna tarea y los demás por lo que he podido ver en los tests tampoco lo hacen

```

**Qué salió:** 

Confirmado. Ningún test de backend/tests/ crea ni usa una tarea, ni su responsable. No he modificado nada en el repo. Si quieres que haga algo con esto, dime qué.

---

## Prompt 4

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Vamos a crear los tests que faltan. En primer lugar muéstrame el código exacto (sin juzgar si es correcto ni completarlo) de todo lo que participa en construir el campo `assignee` de una tarea: el modelo Task, su relación con el responsable, el transformer o serializer que se usa al devolver una tarea, y la ruta/controlador que expone las tareas. Si algo de esto no existe todavía, dime que no existe en vez de proponerlo o escribirlo. No hagas nada todavía, solo muéstrame el código.

```

**Qué salió:** 
Devuelve todo el código que afecta a las tareas:Modelo Task y relación con el responsable, User, de donde salen las iniciales, Transformers, Rutas y Controladores

---

## Prompt 5

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```

Escribe un test en backend/tests/functional/tasks/assignee.spec.ts (créalo
si no existe) que compruebe exactamente este escenario:

#### Scenario: Responsable identificable
- **WHEN** se obtiene una tarea cuyo responsable se llama "Ada Lovelace"
- **THEN** su `assignee` trae el nombre "Ada Lovelace" y sus iniciales, y
  esos datos bastan para saber quién la lleva

Sigue el estilo de los tests que ya existen en backend/tests/functional/auth/
(testUtils.db().withGlobalTransaction(), creación de modelos directamente,
peticiones y aserciones con el apiClient, nombre del test en castellano
describiendo el caso).

No toques ningún archivo fuera de backend/tests/. No arregles ni ajustes
código de la aplicación bajo ningún concepto, pase lo que pase. Cuando lo
tengas, ejecútalo y dime el resultado exacto tal como salga — verde o rojo,
sin maquillarlo.

```

**Qué salió:** 

He creado backend/tests/functional/tasks/assignee.spec.ts con un test, una tarea trae el nombre y las iniciales de su responsable. Esto es lo que hace:
- Crea un User "Ada Lovelace" y una Task con assigneeId apuntando a ese usuario.
- Hace login por POST /api/v1/auth/login para obtener el token.
- Pide la tarea con GET /api/v1/tasks/:id?today=2026-10-04, con ese token.
- Afirma un 200, assignee.fullName === 'Ada Lovelace' y assignee.initials === 'AL'.

Elegí la ruta GET /tasks/:id para el "se obtiene una tarea" del escenario. Hay dos formas de obtener una tarea: la lista y el detalle. Lo que afirmé es el nombre y las iniciales y nada más. No comprobé que assignee.id coincida con el usuario, porque el escenario no lo pide.

El único cambio en el repo es el fichero nuevo (git status solo muestra backend/tests/functional/tasks/). No he tocado código de la aplicación. El mensaje codegen: created 5 file(s) no ha dejado cambios visibles en git status.

CLAUDE.md pide crear una rama antes de tocar código, y tu memoria indica no ejecutar acciones de git sin confirmarlo. No he creado rama ni he commiteado nada. El fichero está sin trackear en trazabilidad-jsg.

---

## Prompt 6

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Ha faltado la parte de ejecutar el test que te he pedido. Ejecútalo y dime el resultado exacto tal como salga — verde o rojo, sin maquillarlo.

```

**Qué salió:** 

Lo he vuelto a ejecutar y sale en verde. El código de salida es 0:

[ info ] loading hooks...
[ info ] generating indexes...
[ info ] codegen: created 5 file(s)
[ info ] booting application to run tests...
✔

 PASSED

Tests  1 passed (1)
 Time  297ms
exit code: 0

Ya lo había ejecutado en mi respuesta anterior, con el mismo resultado (Tests 1 passed (1), 304 ms). La salida que te pegué entonces era esa ejecución. Por eso esta segunda salida es igual, salvo el tiempo y el código de salida, que antes no mostré.

El resultado es verde. No he cambiado nada en el repo desde entonces.

---

## Prompt 7

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```

Añade a backend/tests/functional/tasks/assignee.spec.ts un test que
compruebe exactamente este escenario:

#### Scenario: La tarea no filtra datos de cuenta
- **WHEN** se obtiene cualquier tarea, suelta o dentro de la lista
- **THEN** su `assignee` no incluye el email de esa cuenta ni ningún otro
  dato de acceso

El escenario dice "suelta o dentro de la lista" explícitamente: el test
tiene que comprobar las dos vías, es decir, tanto obtener una tarea
individual como obtenerla dentro del listado de tareas. No te limites a una
sola.

Mismo estilo que los tests de backend/tests/functional/auth/. No toques
nada fuera de backend/tests/. No arregles ni ajustes código de la
aplicación bajo ningún concepto, aunque el test se quede en rojo — si se
queda en rojo, se entrega en rojo. Ejecútalo y dime el resultado exacto tal
como salga.

```

**Qué salió:** 
El test nuevo se queda en rojo, y se entrega así. El primero sigue en verde. Salida tal como salió (los códigos de color ANSI los he quitado):

✔✖
 ERRORS

❯ Tareas | responsable / el responsable no trae el email ni datos de acceso, ni suelta ni en la lista

ℹ AssertionError: la tarea dentro de la lista: el assignee trae el email: expected { id: 10, …(5) } to not have nested property 'email'

 ⁃ at Assert.notProperty (node_modules/@japa/assert/build/index.js:261:19)
 ⁃ at Object.executor (tests/functional/tasks/assignee.spec.ts:86:14)

   86 ┃  assert.notProperty(assignee, 'email', `${via}: el assignee trae el email`)

 FAILED

Tests  1 passed, 1 failed (2)
 Time  466ms
exit code: 1

El fallo es de la vía «dentro de la lista». La tarea suelta (GET /tasks/:id) pasó sus comprobaciones, porque el bucle llegó a la lista sin fallar antes. Se corresponde con el código que te mostré antes: GET /tasks usa TaskTransformer, que serializa el assignee con UserTransformer, y ese incluye email, createdAt y updatedAt. El detalle usa TaskAssigneeTransformer, que solo saca id, fullName e initials.

Como assert.notProperty aborta en la primera aserción que falla, no sé qué más fallaría en la lista. Es un hecho de cómo funciona la aserción y no he comprobado nada más.

Todo cambio ha sido en backend/tests/functional/tasks/assignee.spec.ts: el test nuevo y la cabecera, que ahora menciona los dos escenarios. No he tocado código de la aplicación. El test comprueba, en las dos vías:
- Que assignee no tenga la propiedad email.
- Que no tenga la propiedad password.
- Que el JSON del assignee no contenga ada@example.com, secreto123 ni la palabra password.

Para la vía de la lista, localiza la tarea por id en GET /api/v1/tasks.
---

## Prompt 8

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```

Añade a backend/tests/functional/tasks/assignee.spec.ts un test que
compruebe exactamente este escenario:

#### Scenario: Responsable sin nombre
- **WHEN** el responsable de una tarea es una cuenta que se registró sin
  nombre
- **THEN** su nombre llega nulo y sus iniciales siguen llegando, para que
  la interfaz pueda representarlo sin recurrir a su email

Mismo estilo que los tests de backend/tests/functional/auth/. No toques
nada fuera de backend/tests/. No arregles ni ajustes código de la
aplicación bajo ningún concepto, pase lo que pase. Ejecútalo y dime el
resultado exacto tal como salga, verde o rojo.

```

**Qué salió:** 
El test nuevo, un responsable sin nombre llega con el nombre nulo y con sus iniciales, pasa en verde. Los tres tests de assignee.spec.ts dan 2 en verde y 1 en rojo:

✔✖✔
...
FAILED

Tests  2 passed, 1 failed (3)
Time  563ms
exit code: 1

El rojo es el mismo de antes y no tiene que ver con el test nuevo. Es el test de «La tarea no filtra datos de cuenta», que falla con la tarea dentro de la lista: el assignee trae el email. El de «Responsable identificable» sigue en verde.

El test nuevo hace esto:
- Crea una cuenta con fullName: null y email ada@example.com, y una tarea asignada a ella.
- Hace login, pide GET /api/v1/tasks/:id?today=2026-10-04 y afirma un 200.
- Afirma que assignee.fullName es nulo y que assignee.initials es 'AE'.

El escenario no dice si la tarea se obtiene suelta o en la lista, así que usé la tarea suelta, como en el primer test. No he comprobado este caso por la lista. Allí el assignee pasa por UserTransformer, que también devuelve fullName e initials, pero no lo he ejecutado.

Solo he tocado backend/tests/functional/tasks/assignee.spec.ts: el test nuevo y la cabecera, que ahora menciona los tres escenarios. No he cambiado código de la aplicación.
---

## Prompt 9

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Con todo lo que hemos hecho en esta sesión (la búsqueda inicial de tests
existentes, la revisión de cada uno de los tres escenarios, y los tres
tests que escribiste en backend/tests/functional/tasks/assignee.spec.ts),
genera una matriz de trazabilidad del requisito "Lo que cada tarea muestra
de su responsable" en docs/verificacion/jsg.md (créalo).

Formato exacto, no lo cambies:

1. Encima de la tabla, esta línea literal:
   "Scenarios en el requisito: 3 · Cubiertos: 0"
   (el segundo número son los que ya estaban cubiertos por tests que
   existían ANTES de que escribieras ninguno — no cuentes ahí los tests
   que tú escribiste, eso va en otra sección).

2. Una tabla con una fila por scenario y exactamente estas 4 columnas:
   - El scenario en una línea (qué se espera y en qué situación).
   - Qué test lo cubre, con el nombre exacto de la suite — vacío si no
     existía ninguno antes de que tú escribieras uno.
   - Estado: Cubierto / No cubierto / No lo sé.
   - Si el estado es "No lo sé", qué faltó para decidirlo (media línea).
     Si no, un guion.

3. Los tres escenarios van con Estado "No cubierto" — así los encontraste
   en la búsqueda inicial, antes de escribir nada.

4. Debajo de la tabla, añade una sección corta con los tres tests que
   escribiste en backend/tests/functional/tasks/assignee.spec.ts: su
   nombre exacto y si quedaron en verde o en rojo.

No añadas ninguna otra sección, ni comentarios de cierre, ni nada más
aparte de lo descrito en los puntos 1 a 4. No toques ningún archivo fuera
de docs/verificacion/.

```

**Qué salió:** 
He creado docs/verificacion/jsg.md con el formato que pedías. Los tres escenarios están como "No cubierto", con "Cubiertos: 0" y el nombre de test vacío en la tabla. Debajo van los tres tests de assignee.spec.ts: dos en verde y el de "La tarea no filtra datos de cuenta" en rojo.

Los resultados vienen de la última ejecución (2 en verde y 1 en rojo). No volví a lanzar la suite al escribir el documento. No he tocado nada fuera de docs/verificacion/.
