import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    server: { port: 5173, strictPort: true },
    preview: { port: 5174, strictPort: true },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        outDir: "dist",
        sourcemap: true,
        rollupOptions: {
            input: {
                main: 'index.html',
                about: 'about.html',
                products: 'products.html',
                contact: 'contact.html',
                cart: 'cart.html',
                checkout: 'checkout.html',
                login: 'login.html',
            },
        },
    },
});