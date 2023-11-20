export default {
  plugins: {
    "postcss-preset-env": {
      stage: 0, // Enable all experimental features
      features: {
        "nesting-rules": true, // Enable nesting
      },
    },
    tailwindcss: {},
    autoprefixer: {},
  },
};
