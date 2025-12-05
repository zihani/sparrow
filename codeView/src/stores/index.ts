import { createPinia } from 'pinia'
// import { createPersistedState } from 'pinia-plugin-persistedstate'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
// const pinia = createPinia()

// pinia.use(createPersistedState({
//     storage: sessionStorage
// }))

export default pinia