import {
    defineConfig
} from "vite";
import {
    fileURLToPath,
    URL
} from "node:url";
import {
    resolve
} from "node:path";

export default defineConfig({
    base: '/Eastleigh_Turf_Grass/',
    server: { port: 5173, strictPort: true },
    preview: { port: 5174, strictPort: true },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src",
                import.meta.url)),
        },
    },
    build: {
        outDir: "dist",
        sourcemap: true,
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                about: resolve(__dirname, "about.html"),
                products: resolve(__dirname, "products.html"),
                contact: resolve(__dirname, "contact.html"),
                cart: resolve(__dirname, "cart.html"),
                checkout: resolve(__dirname, "checkout.html"),
                login: resolve(__dirname, "login.html"),
                admin: resolve(__dirname, "admin.html"),
                broker: resolve(__dirname, "broker.html"),
            },
        },
    },
});
