module.exports = {
  devServer: {
    port: 8080,   // default frontend port
    proxy: {
      '/api':{
        target: 'http://localhost:5000',    // backend url
        changeOrigin: true,
        secure: true,
        pathRewrite: {
          '^/api': 'api',
        }
      }
    },
  },
}
