import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Keep paths as written: the Claude app redirects AppData folders, and resolving them breaks dev-server file loads
  resolve: { preserveSymlinks: true },
  // Polling avoids the watcher crashing with EBUSY when Windows briefly locks a folder during saves
  server: { watch: { usePolling: true, interval: 300 } },
})
