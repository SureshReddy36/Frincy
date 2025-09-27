// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           50: '#eff6ff',
//           500: '#3b82f6',
//           600: '#2563eb',
//           700: '#1d4ed8',
//         },
//         border: '#e5e7eb',
//         background: '#ffffff',
//         foreground: '#111827',
//         ring: '#3b82f6'
//       }
//     },
//   },
//   plugins: [],
// }
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        border: {
          light: '#e5e7eb',
          dark: '#374151'
        },
        background: {
          light: '#ffffff',
          dark: '#111827'
        },
        foreground: {
          light: '#111827',
          dark: '#f9fafb'
        },
        ring: '#3b82f6'
      }
    },
  },
  plugins: [],
}