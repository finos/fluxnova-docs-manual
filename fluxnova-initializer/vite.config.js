import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        minify: true,
        lib: {entry:'./script.js',
            formats: ['es'],
            fileName: 'init-bundle'
        },
        emptyOutDir: true,
        outDir: '../static/js/initializer'
        
    }
});