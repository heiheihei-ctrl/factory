import { defineConfig, loadEnv } from "vite";
import tailwindcss from 'tailwindcss';
import uni from "@dcloudio/vite-plugin-uni";

const CWD = process.cwd()
// https://vitejs.dev/config/

export default ({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, CWD)

  return {
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
    server: {
      port: 3000,
      open: true,
      cors: true,
      proxy: {
        // 类型： Record<string, string | ProxyOp 为开发服务器配置自定义代理规则
        '/api': {
          target: VITE_API_URL,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
}
