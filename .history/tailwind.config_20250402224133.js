/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",

        // Nếu bạn có thư mục src
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{module.css}", // Bao gồm cả CSS Module trong thư mục src

        // Nếu CSS Modules của bạn ở thư mục components
        "./components/**/*.{module.css}",

        // Đường dẫn đến file theme CSS của bạn (nếu có)
        "./styles/**/*.css",
    ],
    theme: {
        extend: {},
    },
    plugins: [require("@tailwindcss/nesting")],
};
