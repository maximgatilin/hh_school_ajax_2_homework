import { defineConfig } from 'vite';

export default defineConfig({
    base:
        process.env.NODE_ENV === 'production'
            ? 'hh_school_ajax_2_homework'
            : '/',

    server: {
        port: 5173,
        open: true,
    },
});
