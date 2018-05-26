<template>
  <div>
    <h1>Items from Server</h1>
    <ul>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      count: 0
    }
  },
  created() {
    this.$http.get('/api/items')
      .then(response => {
        this.items = response.data;
      });
  },
  methods: {
    increase() {
      this.count++;
      if (this.$interop) {
        this.$interop.setBadgeCount(this.count);
      }
    },
    decrease() {
      if (this.count > 0) {
        this.count--;
        if (this.$interop) {
          this.$interop.setBadgeCount(this.count);
        }      
      }
    }
  }
}
</script>
