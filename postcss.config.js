module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: ['> 1%', 'last 3 versions', 'Firefox ESR', 'ie 9']
    })
  ]
}
