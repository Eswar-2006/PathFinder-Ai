/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            },
            typography: {
                DEFAULT: {
                    css: {
                        color: '#e2e8f0', // slate-200
                        a: {
                            color: '#a78bfa', // violet-400
                            '&:hover': {
                                color: '#8b5cf6', // violet-500
                            },
                        },
                        strong: {
                            color: '#fff',
                        },
                        'ul > li::marker': {
                            color: '#94a3b8', // slate-400
                        },
                        h1: { color: '#fff' },
                        h2: { color: '#fff' },
                        h3: { color: '#f8fafc' }, // slate-50
                        h4: { color: '#f8fafc' },
                        code: {
                            color: '#e2e8f0',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            fontWeight: '400',
                        },
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                    },
                },
            },
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(200%)' },
                }
            },
            animation: {
                shimmer: 'shimmer 2s infinite',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
