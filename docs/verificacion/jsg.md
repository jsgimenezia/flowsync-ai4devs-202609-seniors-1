Scenarios en el requisito: 3 · Cubiertos: 0

| Scenario | Test que lo cubre | Estado | Qué faltó para decidirlo |
|---|---|---|---|
| Responsable identificable: al obtener una tarea cuyo responsable se llama "Ada Lovelace", su `assignee` trae el nombre y las iniciales, y bastan para saber quién la lleva. |  | No cubierto | - |
| La tarea no filtra datos de cuenta: al obtener cualquier tarea, suelta o dentro de la lista, su `assignee` no incluye el email de esa cuenta ni ningún otro dato de acceso. |  | No cubierto | - |
| Responsable sin nombre: si el responsable es una cuenta registrada sin nombre, su nombre llega nulo y sus iniciales siguen llegando, para representarlo sin recurrir a su email. |  | No cubierto | - |

## Tests escritos en `backend/tests/functional/tasks/assignee.spec.ts`

- `una tarea trae el nombre y las iniciales de su responsable`: verde.
- `el responsable no trae el email ni datos de acceso, ni suelta ni en la lista`: rojo.
- `un responsable sin nombre llega con el nombre nulo y con sus iniciales`: verde.

## Parte B

1. Antes de mirar: 1 de 3 (solo "Responsable sin nombre"). Al terminar: 0 de 3 estaban realmente cubiertos — ningún test tocaba el `assignee` de una tarea.
2. No tuve un caso claro de "no lo sé" en los tres escenarios — en los tres la regla estaba escrita sin ambigüedad en la spec, y lo único que faltaba era el test. Lo más parecido a esa duda fue decidir si la regla general del requisito ("ningún otro dato... en particular su email") también debía comprobarse en las respuestas de crear tarea y cambiar su estado — que usan el mismo transformer con la fuga — o si el scenario, al decir solo "suelta o en la lista", marcaba la frontera real de lo exigible; no lo comprobé, así que no lo sé.
3. En los Escenarios 1 y 3 el scenario no decía si la tarea se obtiene suelta o desde la lista (solo el Escenario 2 lo exige explícitamente) — decidí usar siempre la tarea suelta (`GET /tasks/:id`) por simplicidad, sin comprobar si el mismo comportamiento se sostiene también en la lista.
