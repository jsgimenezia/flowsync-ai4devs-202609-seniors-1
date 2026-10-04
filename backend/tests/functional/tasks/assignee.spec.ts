import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Responsable de una tarea. Cubre los scenarios «Responsable identificable»
 * (al obtener una tarea, su `assignee` trae el nombre y las iniciales de quien
 * la lleva), «La tarea no filtra datos de cuenta» (el `assignee` no trae el
 * email ni datos de acceso, ni en la tarea suelta ni dentro de la lista) y
 * «Responsable sin nombre» (el nombre llega nulo y las iniciales siguen
 * llegando).
 */
test.group('Tareas | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('una tarea trae el nombre y las iniciales de su responsable', async ({ client, assert }) => {
    const ada = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const tarea = await Task.create({
      title: 'Escribir el primer algoritmo',
      status: 'pending',
      assigneeId: ada.id,
    })

    const login = await client
      .post('/api/v1/auth/login')
      .json({ email: 'ada@example.com', password: 'secreto123' })
    const token = login.body().data.token

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: '2026-10-04' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  test('el responsable no trae el email ni datos de acceso, ni suelta ni en la lista', async ({
    client,
    assert,
  }) => {
    const ada = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const tarea = await Task.create({
      title: 'Escribir el primer algoritmo',
      status: 'pending',
      assigneeId: ada.id,
    })

    const login = await client
      .post('/api/v1/auth/login')
      .json({ email: 'ada@example.com', password: 'secreto123' })
    const token = login.body().data.token

    const suelta = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: '2026-10-04' })
      .header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    lista.assertStatus(200)

    const enLista = lista.body().data.find((t: { id: number }) => t.id === tarea.id)
    assert.exists(enLista)

    const responsables = {
      'la tarea suelta': suelta.body().data.assignee,
      'la tarea dentro de la lista': enLista.assignee,
    }

    for (const [via, assignee] of Object.entries(responsables)) {
      const serialized = JSON.stringify(assignee)

      assert.notProperty(assignee, 'email', `${via}: el assignee trae el email`)
      assert.notProperty(assignee, 'password', `${via}: el assignee trae la contraseña`)
      assert.notInclude(serialized, 'ada@example.com', `${via}: el email aparece en el assignee`)
      assert.notInclude(serialized, 'secreto123', `${via}: la contraseña aparece en el assignee`)
      assert.notInclude(serialized, 'password', `${via}: hay un campo de contraseña en el assignee`)
    }
  })

  test('un responsable sin nombre llega con el nombre nulo y con sus iniciales', async ({
    client,
    assert,
  }) => {
    const sinNombre = await User.create({
      fullName: null,
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const tarea = await Task.create({
      title: 'Escribir el primer algoritmo',
      status: 'pending',
      assigneeId: sinNombre.id,
    })

    const login = await client
      .post('/api/v1/auth/login')
      .json({ email: 'ada@example.com', password: 'secreto123' })
    const token = login.body().data.token

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: '2026-10-04' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.isNull(assignee.fullName)
    assert.equal(assignee.initials, 'AE')
  })
})
