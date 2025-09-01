import {
    defineConfig
} from "vite";
import {
    fileURLToPath,
    URL
} from "node:url";

export default defineConfig({
    base: '/Eastleigh_Turf_Grass/',
    build: {
        outDir: 'dist',
        assetsDir: "",
        cssCodeSplit: false, // Bundle all CSS into a single file
        rollupOptions: {
            // Explicit MPA entries
            input: {
                index: 'index.html',
                about: 'about.html',
                products: 'products.html',
                contact: 'contact.html',
                cart: 'cart.html',
                checkout: 'checkout.html',
                login: 'login.html',
                broker: 'broker.html'
            },
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'css/[name].[hash][extname]';
                    }
                    return '[name].[hash][extname]';
                },
                chunkFileNames: "[name].[hash].js",
                entryFileNames: "[name].[hash].js",
            },
        },
        target: ['es2015', 'chrome58', 'firefox57', 'safari11'],
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
