import { defineStore } from 'pinia'
import type { RequestConfig } from '@/interface/interface-apiPost'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT'

interface LastRequest {
  method: HttpMethod
  url: string
  config: RequestConfig
  savedAt: string
}

export const useApiPostStore = defineStore('apiPost', {
  state: () => ({
    lastRequest: null as LastRequest | null,
    history: [] as LastRequest[],
  }),
  actions: {
    setLastRequest(payload: LastRequest) {
      this.lastRequest = payload
    },
    pushHistory(payload: LastRequest) {
      this.history.unshift(payload)
      if (this.history.length > 50) this.history.pop()
    },
    clearHistory() {
      this.history = []
    },
  },
})
