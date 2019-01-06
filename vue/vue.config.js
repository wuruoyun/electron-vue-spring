module.exports = {
  devServer: {
    port: 9000,
    proxy: {
      '^/api': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      },
      '^/health': {
        target: 'http://localhost:8080'
      }
    }
  }
}