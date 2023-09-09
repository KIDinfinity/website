module.exports = {
    configureWebpack: config => {
      return {
        /**
         * 添加自己写的模块loader
         * */
        module: {
          rules: [
            /**
             * 对.vue和.js文件生效，不包含node_modules大文件夹，加载器的位置在
             * 当前目录下的./src/myLoader/removeConsole.js
             * */
            // {
            //   test: /\.vue$/,
            //   exclude: /node_modules/,
            //   loader: path.resolve(__dirname, "./src/myLoader/removeConsole.js")
            // },
            // shader
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                type: 'asset/source',
                generator:
                {
                    filename: 'assets/images/[hash][ext]'
                }
            },
          ],
        }
      }
    },
  }