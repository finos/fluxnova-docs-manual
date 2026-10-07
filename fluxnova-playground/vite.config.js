import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        minify: true,
        lib: {entry:'./main.js',
            formats: ['es'],
            fileName: 'playground-bundle'
        },
        emptyOutDir: true,
        outDir: '../static/js/playground'
        
    }
});