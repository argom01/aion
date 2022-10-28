const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['"Roboto Flex"', ...defaultTheme.fontFamily.sans],
                'slab': ['"Roboto Slab"']
            }
        },
    },
    plugins: [],
};
