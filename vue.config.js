module.exports = {
  transpileDependencies: [
    'vue-router'
  ],
  devServer: {
    watchOptions: {
      ignored: [
        /node_modules/
      ]
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "@/assets/variables";
        `
      }
    }
  }
}

