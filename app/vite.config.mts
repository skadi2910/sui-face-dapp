import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindCss from  "@tailwindcss/vite";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindCss()],
});
