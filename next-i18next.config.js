module.exports = {
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'], // 한국어만 사용
    localeDetection: false,
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}