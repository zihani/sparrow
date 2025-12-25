import { defineStore } from 'pinia'

interface IUser {
  id: string | number
  username: string
  nickname?: string
  email?: string
  avatar?: string
  [key: string]: any
}

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as IUser | null,
    token: '' as string,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setCurrentUser(user: IUser) {
      this.currentUser = user
    },
    setToken(token: string) {
      this.token = token
    },
    updateCurrentUser(patch: Partial<IUser>) {
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...patch }
      }
    },
    logout() {
      this.token = ''
      this.currentUser = null
    },
  },
  persist: {
    paths: ['currentUser', 'token'],
  },
})
