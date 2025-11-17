// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'build/*', '.expo/*', 'node_modules/*'],
    settings: {
      'import/core-modules': ['expo-linear-gradient'],
    },
  },
]);