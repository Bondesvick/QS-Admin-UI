module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./src/**/*.html", "./src/**/*.scss", "./src/**/*.ts"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
  important: true,
};
