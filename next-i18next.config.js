module.exports = {
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    localeDetection: false,
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}