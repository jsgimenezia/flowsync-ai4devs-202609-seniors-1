## Purpose

Esta capability cubre la creación de cuentas y el acceso a la aplicación: permite a una persona registrarse, iniciar sesión, mantener su sesión entre visitas y cerrarla, y evita que se pueda ver u operar sobre la aplicación sin una sesión válida.

## Requirements

### Requirement: Formato uniforme de las respuestas de la API
El sistema SHALL responder siempre en formato JSON, y en las respuestas correctas SHALL envolver los datos devueltos bajo una clave `data`.

#### Scenario: Respuesta correcta de un endpoint de este vertical
- **WHEN** una petición de registro, inicio de sesión, consulta de perfil o cierre de sesión se atiende correctamente
- **THEN** el cuerpo de la respuesta es JSON y los datos solicitados aparecen bajo la clave `data`

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

### Requirement: Acceso a endpoints protegidos mediante token
El sistema SHALL exigir un token de acceso válido en cada petición a un endpoint de cuenta protegido, y rechazar toda petición que no lo incluya o que incluya uno inválido o ya revocado.

#### Scenario: Token válido
- **WHEN** una petición a un endpoint protegido incluye el token de acceso de una sesión vigente
- **THEN** el sistema identifica a la persona usuaria dueña del token y atiende la petición

#### Scenario: Token ausente, inválido o revocado
- **WHEN** una petición a un endpoint protegido no incluye ningún token, incluye uno que no existe, o incluye uno ya revocado
- **THEN** el sistema rechaza la petición sin atenderla

### Requirement: Consulta del perfil propio
El sistema SHALL permitir a una persona autenticada consultar los datos de su propia cuenta.

#### Scenario: Consulta con sesión válida
- **WHEN** una persona autenticada solicita los datos de su cuenta
- **THEN** el sistema devuelve su identificador, nombre completo, email, iniciales, y fechas de alta y de última actualización

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

### Requirement: Cierre de sesión (revocación del token)
El sistema SHALL permitir a una persona autenticada cerrar sesión, revocando el token de acceso usado en esa petición para que deje de ser válido.

#### Scenario: Cierre de sesión con sesión activa
- **WHEN** una persona autenticada solicita cerrar sesión
- **THEN** el sistema revoca el token usado en esa petición y confirma el cierre

#### Scenario: Reutilización del token tras cerrar sesión
- **WHEN** se repite una petición a un endpoint protegido usando un token que ya fue revocado por un cierre de sesión previo
- **THEN** el sistema la rechaza igual que si ese token nunca hubiera existido

### Requirement: Pantalla de inicio de sesión
El sistema SHALL ofrecer una pantalla de inicio de sesión con campos de email y contraseña que, al enviarse correctamente, deja a la persona con la sesión iniciada y la lleva a la pantalla de su perfil.

#### Scenario: Inicio de sesión correcto
- **WHEN** alguien rellena email y contraseña de una cuenta válida y envía el formulario de inicio de sesión
- **THEN** queda con la sesión iniciada y es llevado a la pantalla de perfil

#### Scenario: Credenciales incorrectas
- **WHEN** alguien envía el formulario de inicio de sesión con un email o una contraseña que el sistema rechaza
- **THEN** la pantalla muestra un aviso general indicando que el email o la contraseña no son correctos, sin iniciar sesión

#### Scenario: Error de validación en un campo concreto
- **WHEN** el envío del formulario de inicio de sesión se rechaza por un problema en un campo concreto (por ejemplo, un email con formato inválido)
- **THEN** la pantalla muestra el mensaje de error debajo de ese campo

#### Scenario: Envío en curso
- **WHEN** el formulario de inicio de sesión está enviándose
- **THEN** el botón de envío se deshabilita y muestra un texto de progreso, impidiendo un segundo envío

#### Scenario: Acceso a la pantalla de registro desde el inicio de sesión
- **WHEN** alguien en la pantalla de inicio de sesión pulsa el enlace para crear una cuenta
- **THEN** es llevado a la pantalla de registro

### Requirement: Pantalla de registro de cuenta
El sistema SHALL ofrecer una pantalla de registro con nombre completo opcional, email, contraseña y confirmación de contraseña que, al enviarse correctamente, crea la cuenta, inicia sesión con ella y lleva a la persona a la pantalla de su perfil.

#### Scenario: Registro correcto
- **WHEN** alguien rellena el formulario de registro con datos válidos y una confirmación de contraseña igual a la contraseña, y lo envía
- **THEN** la cuenta se crea, queda con la sesión iniciada y es llevado a la pantalla de perfil

#### Scenario: Confirmación de contraseña distinta detectada antes de enviar
- **WHEN** alguien rellena el formulario de registro con una confirmación de contraseña distinta a la contraseña y lo envía
- **THEN** la pantalla muestra el error debajo del campo de confirmación sin llegar a contactar con el servidor

#### Scenario: Email ya registrado
- **WHEN** alguien envía el formulario de registro con un email que el sistema indica que ya existe
- **THEN** la pantalla muestra debajo del campo de email un aviso invitando a iniciar sesión en su lugar

#### Scenario: Registro sin nombre completo
- **WHEN** alguien envía el formulario de registro sin escribir un nombre completo
- **THEN** la cuenta se crea sin nombre asociado

#### Scenario: Acceso a la pantalla de inicio de sesión desde el registro
- **WHEN** alguien en la pantalla de registro pulsa el enlace para iniciar sesión
- **THEN** es llevado a la pantalla de inicio de sesión

### Requirement: Persistencia y restauración de la sesión en el navegador
El sistema SHALL recordar la sesión entre recargas de página guardando el token en el navegador, validándolo contra el servidor antes de dar la sesión por iniciada.

#### Scenario: Recarga con sesión válida
- **WHEN** se recarga la página con un token guardado que el servidor todavía reconoce
- **THEN** la sesión se restaura automáticamente, sin pedir las credenciales de nuevo

#### Scenario: Recarga con token caducado o revocado
- **WHEN** se recarga la página con un token guardado que el servidor ya no reconoce
- **THEN** el sistema descarta el token guardado, deja a la persona sin sesión y, si llega a la pantalla de inicio de sesión, le muestra un aviso de que su sesión caducó

#### Scenario: Recarga sin poder contactar con el servidor
- **WHEN** se recarga la página con un token guardado y el servidor no responde
- **THEN** el sistema deja a la persona sin sesión de forma temporal, sin borrar el token guardado, y le muestra un aviso de que no se ha podido restaurar la sesión

#### Scenario: Validación del token guardado en curso
- **WHEN** la sesión todavía se está validando contra el servidor justo después de cargar la página
- **THEN** el sistema muestra un indicador de carga en lugar de la pantalla de inicio de sesión o de la pantalla protegida

### Requirement: Protección de pantallas según el estado de la sesión
El sistema SHALL restringir el acceso a las pantallas según haya o no una sesión iniciada, redirigiendo automáticamente cuando el acceso no corresponda.

#### Scenario: Acceso a una pantalla protegida sin sesión
- **WHEN** alguien sin sesión iniciada intenta entrar a la pantalla de perfil
- **THEN** es redirigido a la pantalla de inicio de sesión

#### Scenario: Acceso a inicio de sesión o registro con sesión ya iniciada
- **WHEN** alguien con sesión iniciada intenta entrar a la pantalla de inicio de sesión o a la de registro
- **THEN** es redirigido a la pantalla de perfil

#### Scenario: Dirección desconocida
- **WHEN** alguien navega a una dirección que no corresponde a ninguna de las pantallas de la aplicación
- **THEN** el sistema lo dirige hacia la pantalla de perfil, que a su vez lo redirige a inicio de sesión si no tiene una sesión iniciada

### Requirement: Cierre de sesión desde la interfaz
El sistema SHALL permitir cerrar sesión desde la pantalla de perfil, terminando la sesión local de inmediato con independencia de la respuesta del servidor.

#### Scenario: Cierre de sesión desde el perfil
- **WHEN** una persona con sesión iniciada pulsa el botón de cerrar sesión en su pantalla de perfil
- **THEN** el sistema borra la sesión guardada en el navegador, la lleva a la pantalla de inicio de sesión, y avisa al servidor para revocar el token

#### Scenario: Cierre de sesión sin conexión con el servidor
- **WHEN** se pulsa el botón de cerrar sesión y la petición de revocación al servidor falla
- **THEN** la sesión local se cierra igualmente y la persona termina en la pantalla de inicio de sesión

## Parte B

1. **Los dos números.** El agente escribió 12 requisitos. Comprobé de verdad 7. Los 5 restantes quedaron sin comprobar porque acabó el tiempo.

2. **Incoherencias que aparecieron al escribirla:**
   - El Requirement "Formato uniforme de las respuestas de la API" dice que el cierre de sesión también envuelve su respuesta en `data`, pero `AccessTokensController.destroy()` devuelve `{ message: ... }` sin pasar por `serialize()`. Se ve comparando ese Requirement con `backend/app/controllers/access_tokens_controller.ts` (método `destroy`), confirmado con `curl`.
   - El escenario "Registro sin nombre completo" solo es cierto si se manda `fullName: null` explícito; omitir la clave por completo lo rechaza con un 422 ("The fullName field must be defined"). Se ve en `backend/app/validators/user.ts` (`fullName: vine.string().nullable()`, sin `.optional()`), confirmado ejecutando la petición.

3. **Lo que no supe decidir si era bug o contrato:** que el logout no envuelva su respuesta en `data` — ¿es un descuido (se olvidaron de llamar a `serialize()`) o es intencional (el logout no devuelve un recurso, solo confirma, así que no necesita el envoltorio)? El código ni siquiera usa la vía explícita que existe para saltárselo (`serialize.withoutWrapping()`), lo que apunta más a descuido que a decisión — pero no es concluyente solo con el código delante.
