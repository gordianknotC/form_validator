module.exports = {
  plugins: {
      config: "./tailwind.config.js"
    },
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {})
  }
};
