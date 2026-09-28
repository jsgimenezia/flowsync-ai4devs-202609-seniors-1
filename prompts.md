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

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Vas a escribir la spec de lo que el sistema hace HOY, ya construido y funcionando —
no propongas cambios ni mejoras, no toques ni una línea de código, solo documenta el
comportamiento actual.

Alcance: únicamente el vertical de cuentas y acceso, en sus dos capas completas:
- Backend: rutas, controladores, modelo de usuario, validadores y middlewares de auth.
- Frontend: pantallas de acceso (login/registro), estado de sesión, y protección de rutas.
Nada de ningún otro dominio (tareas, etc.), aunque te parezca relevante añadirlo.

Formato exacto, no lo cambies:

## Purpose
(1-2 frases: para qué existe esta capability)

## Requirements

### Requirement: <nombre>
El sistema SHALL <comportamiento>.

#### Scenario: <nombre>
- **WHEN** <acción, con la precondición incluida aquí dentro>
- **THEN** <resultado>

No hay GIVEN separado — la precondición va dentro del WHEN, no como viñeta aparte.

Reglas duras:
1. Nada de ADDED, MODIFIED ni REMOVED — esto no es un delta, es la verdad actual completa.
2. Solo comportamiento observable desde fuera: cero nombres de clase, archivo o ruta de
   código. En la API es la petición/respuesta; en pantalla, lo que una persona ve y puede
   hacer.
3. No toques el código, ni para arreglar nada raro que encuentres por el camino.

Todo en castellano, salvo las mayúsculas de la RFC (SHALL, WHEN, THEN).

Guarda el resultado en docs/spec-viva/jsg.md.

Esto no es una tarea de código: no uses la skill /commit ni abras un PR al
terminar de escribir el archivo. Solo escribe el archivo y para ahí — la
entrega la hago yo a mano después, junto con prompts.md.
```

**Qué salió:** 
Generado el documento con la spec. Respuesta: He escrito la spec en docs/spec-viva/jsg.md, cubriendo backend (registro, login, tokens, perfil, iniciales, logout) y frontend (pantallas de login/registro, persistencia de sesión, protección de rutas, logout desde la UI). No he tocado código ni abierto PR, como pediste.

---

## Prompt 2

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Revisa que el archivo quedó bien antes de cerrarlo y que sigue el formato exacto.
```

**Qué salió:** 
El archivo cumple el formato exacto: ## Purpose, ## Requirements, cada ### Requirement: con una única frase "El sistema SHALL...", y cada #### Scenario: con solo WHEN/THEN (sin GIVEN aparte, sin ADDED/MODIFIED/REMOVED, sin nombres de clase/archivo/ruta de código). Corregido el único desvío (doble SHALL en el requirement de persistencia de sesión).

---

## Prompt 3

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Muéstrame el código exacto (sin juzgar si es correcto) que implementa este requisito: 

### Requirement: Formato uniforme de las respuestas de la API
El sistema SHALL responder siempre en formato JSON, y en las respuestas correctas SHALL envolver los datos devueltos bajo una clave `data`.

#### Scenario: Respuesta correcta de un endpoint de este vertical
- **WHEN** una petición de registro, inicio de sesión, consulta de perfil o cierre de sesión se atiende correctamente
- **THEN** el cuerpo de la respuesta es JSON y los datos solicitados aparecen bajo la clave `data`

```

**Qué salió:** 
Muestra el código relacionado con todas las respuestas del API. Se detecta que el requisito tal y como está escrito es falso para uno de los casos. Cuando se hace un destroy en el logout no se llama a serialize y por tanto no se envuelve en data, por lo que el requisito no es correcto porque no siempre se devuelven los datos bajo una clave `data`

---

## Prompt 4

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Muéstrame el código exacto (sin juzgar si es correcto) que implementa este requisito: 

### Requirement: Registro de nuevas cuentas
El sistema SHALL permitir crear una cuenta nueva a partir de un nombre completo opcional, un email y una contraseña con su confirmación, e iniciar sesión automáticamente con la cuenta recién creada.

#### Scenario: Registro con datos válidos
- **WHEN** se envía una solicitud de registro con un email no usado antes, una contraseña de entre 8 y 32 caracteres, y la confirmación igual a la contraseña
- **THEN** el sistema crea la cuenta y devuelve los datos de la persona usuaria junto con un token de acceso, quedando la sesión iniciada

#### Scenario: Email ya registrado
- **WHEN** se envía una solicitud de registro con un email que ya pertenece a una cuenta existente
- **THEN** el sistema rechaza la solicitud sin crear la cuenta, señalando el campo email como duplicado

#### Scenario: Contraseña fuera de la longitud permitida
- **WHEN** se envía una solicitud de registro con una contraseña de menos de 8 o de más de 32 caracteres
- **THEN** el sistema rechaza la solicitud señalando el campo de la contraseña como inválido

#### Scenario: Confirmación de contraseña no coincide
- **WHEN** se envía una solicitud de registro donde la confirmación de la contraseña no es igual a la contraseña
- **THEN** el sistema rechaza la solicitud señalando el campo de confirmación como inválido

#### Scenario: Registro sin nombre completo
- **WHEN** se envía una solicitud de registro sin nombre completo
- **THEN** el sistema crea la cuenta igualmente, sin nombre asociado

```

**Qué salió:** 
Código relacionado con el registro. Para comprobar el scenario del requiremment Registro con datos válidos he tenido que ejecutar el frontend porque no he sido capaz de verificarlo viendo el código. El de Registro sin nombre completo es ambiguo porque si no se manda fullname el registro falla, pero si mandas el fullname a null si que funciona así que es cierto el scenario pero puede causar confusión por la ambiguedad.

---

## Prompt 5

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Muéstrame el código exacto (sin juzgar si es correcto) que implementa este requisito: 

### Requirement: Inicio de sesión con email y contraseña
El sistema SHALL permitir iniciar sesión verificando el email y la contraseña contra las credenciales almacenadas, y emitir un token de acceso cuando son correctas.

#### Scenario: Credenciales correctas
- **WHEN** se envían un email y una contraseña que coinciden con una cuenta existente
- **THEN** el sistema devuelve los datos de esa persona usuaria junto con un nuevo token de acceso

#### Scenario: Contraseña incorrecta
- **WHEN** se envía el email de una cuenta existente junto con una contraseña que no coincide
- **THEN** el sistema rechaza la solicitud, sin token, indicando que las credenciales no son válidas

#### Scenario: Email no registrado
- **WHEN** se envía un email que no corresponde a ninguna cuenta
- **THEN** el sistema rechaza la solicitud con el mismo tipo de error que usaría para una contraseña incorrecta, sin indicar cuál de los dos datos falló

```

**Qué salió:** 
Código relacionado con el registro, se comprueban todos los escenarios en el código y todo cumple.

---

## Prompt 6

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Muéstrame el código exacto (sin juzgar si es correcto) que implementa este requisito: 

### Requirement: Acceso a endpoints protegidos mediante token
El sistema SHALL exigir un token de acceso válido en cada petición a un endpoint de cuenta protegido, y rechazar toda petición que no lo incluya o que incluya uno inválido o ya revocado.

#### Scenario: Token válido
- **WHEN** una petición a un endpoint protegido incluye el token de acceso de una sesión vigente
- **THEN** el sistema identifica a la persona usuaria dueña del token y atiende la petición

#### Scenario: Token ausente, inválido o revocado
- **WHEN** una petición a un endpoint protegido no incluye ningún token, incluye uno que no existe, o incluye uno ya revocado
- **THEN** el sistema rechaza la petición sin atenderla
```

**Qué salió:** 
Código relacionado con los endpoints protegidos. Si no hay token bearer en la cabecera, hay un token que no existe o revocado o falla la verificación siempre salta la misma excepción E_UNAUTHORIZED_ACCESS así que los escenarios se cumplen. 

---

## Prompt 7

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Muéstrame el código exacto (sin juzgar si es correcto) que implementa este requisito: 

### Requirement: Consulta del perfil propio
El sistema SHALL permitir a una persona autenticada consultar los datos de su propia cuenta.

#### Scenario: Consulta con sesión válida
- **WHEN** una persona autenticada solicita los datos de su cuenta
- **THEN** el sistema devuelve su identificador, nombre completo, email, iniciales, y fechas de alta y de última actualización
```

**Qué salió:** 
Código del requirement. Este caso es bastante simple, si se autentica se devuelve una instancia de User de esa sesión con los datos. Si no se devuelve el E_UNAUTHORIZED_ACCESS

---

## Prompt 8

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Muéstrame el código exacto (sin juzgar si es correcto) que implementa este requisito: 

### Requirement: Cálculo de las iniciales visibles de la cuenta
El sistema SHALL calcular unas iniciales en mayúsculas para cada cuenta, a partir del nombre completo cuando existe y del email cuando no.

#### Scenario: Nombre completo con dos o más palabras
- **WHEN** la cuenta tiene un nombre completo compuesto por dos o más palabras
- **THEN** las iniciales son la primera letra de la primera palabra seguida de la primera letra de la segunda palabra, en mayúsculas

#### Scenario: Nombre completo de una sola palabra
- **WHEN** la cuenta tiene un nombre completo compuesto por una sola palabra
- **THEN** las iniciales son los dos primeros caracteres de esa palabra, en mayúsculas

#### Scenario: Cuenta sin nombre completo
- **WHEN** la cuenta no tiene nombre completo
- **THEN** las iniciales son la primera letra de la parte del email anterior a la arroba seguida de la primera letra de la parte posterior, en mayúsculas

```

**Qué salió:** 
Código del getter de user.ts. Se comprueba si hay dos palabras o si no se obtiene el email y se calculan las iniciales según el requisito.

---

## Prompt 9

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Muéstrame el código exacto (sin juzgar si es correcto) que implementa este requisito: 

### Requirement: Cierre de sesión (revocación del token)
El sistema SHALL permitir a una persona autenticada cerrar sesión, revocando el token de acceso usado en esa petición para que deje de ser válido.

#### Scenario: Cierre de sesión con sesión activa
- **WHEN** una persona autenticada solicita cerrar sesión
- **THEN** el sistema revoca el token usado en esa petición y confirma el cierre

#### Scenario: Reutilización del token tras cerrar sesión
- **WHEN** se repite una petición a un endpoint protegido usando un token que ya fue revocado por un cierre de sesión previo
- **THEN** el sistema la rechaza igual que si ese token nunca hubiera existido


```

**Qué salió:** 
Código del logout. Si el token es válido se hace un destroy que llama a un delete para borrar el token y se muestra Logged out successfully. Si el token ya no es válido falla el verify y salta la excepción de E_UNAUTHORIZED_ACCESS.
---
