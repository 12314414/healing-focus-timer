import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 忽略 D:\ 根目录下无关的 postcss.config.js，样式全部交给 Tailwind Vite 插件
  css: { postcss: { plugins: [] } },
})
