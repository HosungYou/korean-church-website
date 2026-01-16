const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    localeDetection: false,
  },
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
