import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
// // import { defineConfig } from "vite";
// // import react from "@vitejs/plugin-react";
// // import path from "path";

// // export default defineConfig({
// //   plugins: [react()],
// //   resolve: {
// //     alias: {
// //       "@": path.resolve(__dirname, "./src"),
// //       "@components": path.resolve(__dirname, "./src/components"),
// //       "@features": path.resolve(__dirname, "./src/features"),
// //       "@basic": path.resolve(__dirname, "./src/basic"),
// //       "@store": path.resolve(__dirname, "./src/store"),
// //     },
// //   },
// // });
// // vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//       "@components": path.resolve(__dirname, "./src/components"),
//       "@features": path.resolve(__dirname, "./src/features"),
//       "@basic": path.resolve(__dirname, "./src/basic"),
//       "@store": path.resolve(__dirname, "./src/store"),
//     },
//   },
// });

