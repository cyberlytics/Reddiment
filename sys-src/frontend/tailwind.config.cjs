module.exports = {
    mode: 'jit',
    content: [ './src/**/*.{html,js,svelte,ts}' ],
    plugins: [
        require('@tailwindcss/typography'),
        require('flowbite/plugin')
    ]
}
