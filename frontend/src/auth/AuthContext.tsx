import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  getProfile,
  login as apiLogin,
  logout as apiLogout,
  signup as apiSignup,
  type User,
} from '@/lib/api'

const TOKEN_STORAGE_KEY = 'flowsync_token'

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (
    fullName: string | null,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!storedToken) {
      setIsLoading(false)
      return
    }

    getProfile(storedToken)
      .then((profile) => {
        // A login/signup may have completed while this request was in
        // flight and already persisted a newer token — don't clobber it.
        if (localStorage.getItem(TOKEN_STORAGE_KEY) !== storedToken) return
        setToken(storedToken)
        setUser(profile)
      })
      .catch(() => {
        if (localStorage.getItem(TOKEN_STORAGE_KEY) !== storedToken) return
        localStorage.removeItem(TOKEN_STORAGE_KEY)
      })
      .finally(() => setIsLoading(false))
  }, [])

  function persistSession(nextUser: User, nextToken: string) {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
    setToken(nextToken)
    setUser(nextUser)
  }

  async function login(email: string, password: string) {
    const { user: loggedInUser, token: newToken } = await apiLogin({
      email,
      password,
    })
    persistSession(loggedInUser, newToken)
  }

  async function signup(
    fullName: string | null,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) {
    const { user: newUser, token: newToken } = await apiSignup({
      fullName,
      email,
      password,
      passwordConfirmation,
    })
    persistSession(newUser, newToken)
  }

  async function logout() {
    if (token) {
      try {
        await apiLogout(token)
      } catch {
        // best-effort: clear the local session even if the request fails
      }
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
