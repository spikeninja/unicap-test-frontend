import { create } from "zustand";


interface User {
  id: number
  email: string
}

interface AuthStore {
  isLoggedIn: boolean
  token: string | null
  user: User | null

  setLogin: (token: string, user: User) => void
  setLogout: () => void

  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  setLogin: (token: string, user: User) => set({ token: token, user: user, isLoggedIn: true }),
  setLogout: () => set({token: null, user: null, isLoggedIn: false }),

  login: (token: string, user: User) => {
    const { setLogin } = get()
    setLogin(token, user)
  },

  logout: () => {
    const { setLogout } = get()
    setLogout()
    localStorage.removeItem("@token")
  },

}))