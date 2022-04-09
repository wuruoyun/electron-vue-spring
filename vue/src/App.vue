<script setup lang="ts">
import { inject, ref } from 'vue'
import { useFetch } from '@vueuse/core'

import { KEY_INTEROP, KEY_LOG } from './keys'
import type { Item } from './types/Item'

const $interop = inject(KEY_INTEROP)
const $log = inject(KEY_LOG)

const {
  isFetching,
  error,
  data: items,
  onFetchResponse,
  onFetchError
} = useFetch('/api/items', { timeout: 1000 }).get().json<Item[]>()

onFetchResponse((response) => {
  $log?.info('Received items from server.')
})

onFetchError((error) => {
  $log?.error('Failed to fetech items from server.')
})

const count = ref(0)
const selectedFile = ref<string | string[] | undefined>()

function increase() {
  count.value++
  $interop?.setBadgeCount(count.value)
}

function decrease() {
  if (count.value > 0) {
    count.value--
    $interop?.setBadgeCount(count.value)
  }
}

function open() {
  $interop?.showOpenDialog()
    .then(result => selectedFile.value = result)
}

function save() {
  $interop?.showSaveDialog()
    .then(result => selectedFile.value = result)
}
</script>

<template>
  <div>
    <h1>Items from Server</h1>
    <p v-if="isFetching">Fetching items...</p>
    <template v-else>
      <p v-if="error">Failed to receive items. {{ error }}</p>
      <ul v-else>
        <li v-for="item in items" :key="item.id">{{ item.name }}</li>
      </ul>
    </template>

    <h1>Set badge count (Mac Only)</h1>
    <p>Click buttons below to set app badge count (calling Electron via preload script)</p>
    <button @click="increase">Increase</button>
    <button @click="decrease" :disabled="count <= 0">Decrease</button>

    <h1>File dialog</h1>
    <button @click="open">Show Open Dialog</button>
    <button @click="save">Show Save Dialog</button>
    <p>
      <strong>Selected File(s)</strong>
      : {{ selectedFile }}
    </p>
  </div>
</template>
