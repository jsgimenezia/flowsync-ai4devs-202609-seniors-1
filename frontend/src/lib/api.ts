const API_BASE_URL = 'http://localhost:3333/api/v1'

export type User = {
  id: number
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string | null
  initials: string
}

type AuthResponse = {
  user: User
  token: string
}

type FieldError = {
  field: string
  message: string
}

/**
 * The backend returns { errors: [...] } for every failure case (422
 * validation, 400 invalid credentials, 401 unauthenticated). Entries with a
 * `field` become fieldErrors; the rest become generalMessage.
 */
export class ApiError extends Error {
  fieldErrors: FieldError[]
  generalMessage?: string

  constructor(errors: Array<{ message: string; field?: string }>) {
    const fieldErrors = errors.filter((error): error is FieldError => Boolean(error.field))
    const generalMessage = errors.find((error) => !error.field)?.message

    super(generalMessage ?? fieldErrors[0]?.message ?? 'Request failed')
    this.fieldErrors = fieldErrors
    this.generalMessage = generalMessage
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError([{ message: 'No se pudo conectar con el servidor. Inténtalo de nuevo.' }])
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(body?.errors ?? [{ message: 'Request failed' }])
  }

  return body as T
}

function withAuth(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

export function signup(payload: {
  fullName: string | null
  email: string
  password: string
  passwordConfirmation: string
}) {
  return request<{ data: AuthResponse }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((res) => res.data)
}

export function login(payload: { email: string; password: string }) {
  return request<{ data: AuthResponse }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((res) => res.data)
}

/**
 * Unlike signup/login, the profile endpoint returns the user object
 * directly under `data` (no nested `user` field).
 */
export function getProfile(token: string) {
  return request<{ data: User }>('/account/profile', {
    headers: withAuth(token),
  }).then((res) => res.data)
}

/**
 * Unlike every other endpoint, logout's response is a plain
 * { message } object, not wrapped in { data }.
 */
export function logout(token: string) {
  return request<{ message: string }>('/account/logout', {
    method: 'POST',
    headers: withAuth(token),
  })
}
