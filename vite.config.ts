import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Caminhos relativos permitem publicar o mesmo build tanto em:
  // usuario.github.io quanto em usuario.github.io/nome-do-repositorio/
  base: "./",

  build: {
    outDir: "dist",
    assetsDir: "assets"
  }
});
