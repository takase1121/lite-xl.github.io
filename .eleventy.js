module.exports = config => {
  // jekyll's post support
  config.addCollection('posts', collection =>
    collection.getFilteredByGlob('_posts/*.md')
      .sort((a, b) => b.date - a.date))

  // jekyll's assets
  config.addPassthroughCopy('assets')

  config.addPlugin(require('eleventy-plugin-i18n'))

  config.addLiquidShortcode('kbd', require('./plugins/kbd_tag')())

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      layouts: '_layouts'
    },
    templateFormats: ['html', 'md', 'liquid'],
    HTMLTemplateEngine: 'liquid',
  }
}
