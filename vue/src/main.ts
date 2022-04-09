import { createApp } from 'vue'
import App from './App.vue'
import { KEY_INTEROP, KEY_LOG } from './keys'
import interopFallback from './interop-fallback'

const app = createApp(App)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore the unknown interop on window object
const interop = window.interop || interopFallback
app.provide(KEY_INTEROP, interop)
app.provide(KEY_LOG, interop.log)

app.mount('#app')
