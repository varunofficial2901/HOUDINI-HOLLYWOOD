export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        bg: "#050a0f",
        surface: "#0c1520",
        card: "#111d2e",
        border: "#1e3a5f",
        accent: "#8b5cf6",
        accent2: "#3b82f6",
        danger: "#ef4444",
        success: "#10b981",
        warning: "#f59e0b",
        muted: "#64748b",
      },
    },
  },
  plugins: [],
};
