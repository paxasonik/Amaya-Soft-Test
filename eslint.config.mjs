// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // Figma-плагин выполняется в песочнице Figma с глобальным объектом figma
  files: ['figma-plugin/**/*.js'],
  languageOptions: {
    sourceType: 'script',
    globals: { figma: 'readonly', console: 'readonly' },
  },
})
