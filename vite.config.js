import { defineConfig } from "vite";
import tailwindcss from 'tailwindcss';
import uni from "@dcloudio/vite-plugin-uni";
// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
      ],
    },
  },
  plugins: [
    uni(),
  ],
  server:{
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      // 类型： Record<string, string | ProxyOp 为开发服务器配置自定义代理规则
      '/api': {
        target: "http://47.104.212.175:8081",
        // target: "http://localhost:8081",
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
