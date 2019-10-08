<template>
  <div>
    <h1>Items from Server</h1>
    <p v-if="error">Failed to receive items. {{ error }}</p>
    <ul v-else>
      <li v-for="item in items" :key="item.id">{{item.name}}</li>
    </ul>
    <h1>Set badge count</h1>
    <p>Click buttons below to set app badge count (calling Electron via preload script)</p>
    <button @click="increase">
      Increase
    </button>
    <button @click="decrease" :disabled="count <= 0">
      Decrease
    </button>
    <h1>File dialog</h1>
    <button @click="open">Show Open Dialog</button>
    <button @click="save">Show Save Dialog</button>
    <p><strong>Selected File(s)</strong>: {{selectedFile}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: null,
      items: [],
      count: 0,
      selectedFile: 'None'
    }
  },
  created() {
    this.$http.get('/api/items')
      .then(response => {
        this.items = response.data;
        this.$log.info('Received items from server.')
      })
      .catch(error => {
        this.error = error 
      })
  },
  methods: {
    increase() {
      this.count++;
      this.$interop.setBadgeCount(this.count);
    },
    decrease() {
      if (this.count > 0) {
        this.count--;
        this.$interop.setBadgeCount(this.count);      
      }
    },
    open() {
      this.$interop.showOpenDialog({
        properties: ['openFile', 'multiSelections']
      }, filePaths => this.selectedFile = filePaths);
    },
    save() {
      this.$interop.showSaveDialog({},
        filename => this.selectedFile = filename);
    }
  }
}
</script>
