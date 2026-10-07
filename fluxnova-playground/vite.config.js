import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        minify: true,
        lib: {entry:'./main.js',
            formats: ['es'],
            fileName: 'my-bundle1'
        },
        emptyOutDir: true,
        outDir: '../static/js/playground'
        
    }
});