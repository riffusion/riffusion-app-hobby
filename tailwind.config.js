/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './public/index.html',
    ],
    theme: {
        extend: {
            fontFamily: {
                'sans': [
                    '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen',
                    'Ubuntu', 'Cantarell', 'Fira Sans',
                    ...defaultTheme.fontFamily.sans
                ],
            },
        },
    },
    plugins: [ require("daisyui") ],
    daisyui: {
        themes: ["light", "dark"],
        darkTheme: "dark",
        base: true,
        styled: true,
        utils: true,
        logs: false,
    },
}
