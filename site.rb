#!/usr/bin/env ruby
require 'redcarpet'
require 'redcarpet/render_strip'
require 'rouge'
require 'json'
require 'fileutils'

class RedRouge < Redcarpet::Render::HTML
  def block_code(code, language)
    "<pre>" + Rouge.highlight(code, language || "bash", 'html') + "</pre>"
  end

  def link(link, title, link_content)
    # make all external and asset links to open in new tab
    "<a title='#{title}' #{link =~ /^(http|\/?assets)/ && "target='_blank'"} href='#{link}'>#{link_content}</a>"
  end
end

class StripMore < Redcarpet::Render::StripDown
  def link(link, title, content) content end
end

def slugify(name)
  name
    .downcase
    .gsub(/[^a-z0-9]+/, "-") # replace non-url friendly characters with dashes
    .gsub(/\-+/, "-") # remove duplicate dashes
    .gsub(/^\-|\-$/, "") # remove trailing dashes
end



# config options
root = ENV.fetch("SITE_ROOT", "")
domain = ENV.fetch("SITE_DOMAIN", "https://lite-xl.com")
default_locale = ENV.fetch("SITE_LOCALE", "en")
verbose = ENV.key?("VERBOSE")
generateIndex = !ENV.key?("INDEX")



indexFile = []
root = root.gsub(/\/\\$/, "") + "/" unless root == ""
FileUtils.rm_rf(root) unless root == ""
renderer = Redcarpet::Markdown.new(RedRouge.new(with_toc_data: true), { fenced_code_blocks: true, tables: true, footnotes: true })
stripRenderer = Redcarpet::Markdown.new(StripMore, { fenced_code_blocks: true, tables: true, footnotes: true })
files = Dir
  .glob("locales/*")
  .map { |x| x.gsub("locales/", "") }
  .map { |locale|
    template = File.read("locales/#{locale}/template.html")
    FileUtils.rm_rf(root + locale)

    # process markdown files
    files = Dir
      .glob("locales/#{locale}/**/*.md")
      .select { |x| File.file?(x) }
      .map { |path|
        basename = path.gsub("locales/#{locale}", "").gsub(/.\w+$/, "")

        # the slugs produced by target and id is different, as target slugifies each component
        # while id slugifies everything. For instance, path "/locale/en/magic!I don't know" produces
        # target = /en/magic-i-don-t-know
        # id = magic-i-don-t-know
        target = File.join(Pathname(locale + basename).each_filename.map { |component| slugify(component) }) + ".html"

        FileUtils.mkdir_p(root + File.dirname(target)) unless Dir.exist?(root + File.dirname(target))
        mdContent = File.read(path)
        contents = renderer.render(mdContent)
        title = (contents.scan(/<\s*h1.*?>(.*?)<\s*\/h1\s*>/).first || ["Lite XL"]).first
        title = "Lite XL - #{title}" unless title == "Lite XL"
        id = slugify(basename)

        contents = template
          .gsub("{{ page }}", contents)
          .gsub("{{ title }}", title)
          .gsub("{{ id }}", id)
        File.write(root + target, contents)

        if generateIndex
          # this is inflexible; we need to rework this
          categories = Pathname(basename).each_filename.map { |component| slugify(component) }
          categories.pop
          stripContent = stripRenderer
            .render(mdContent)
            .gsub(/ {2,}/, '\t') # attempt to compact indentation
            .gsub(/([\r\n\t\v])+/, '\1') # remove duplicate space
            .strip
          indexFile.append({
            "id" => target,
            "title" => title,
            "category" => categories,
            "content" => stripContent
          })
        end


        # return target filename for sitemap
        target
      }

    # html file passthrough
    files + Dir
      .glob("locales/#{locale}/**/*.html")
      .select { |file| file != "locales/#{locale}/template.html" }
      .map { |file| [file, root + file.gsub("locales/", "")] }
      .each { |(src, dest)| FileUtils.copy_file(src, dest, true, true) }
      .map { |(_, dest)| dest }
  }
  .flatten
  .each { |path| puts("#{path} generated.") if verbose }
  .map { |path| "#{domain}/#{path == "index.html" ? '' : path}" }
  .unshift(domain) # prepend the domain

# write sitemap
File.write("#{root}sitemap.txt", files.join("\n") + "\n")

# generate index file
File.write("#{root}posts.json", JSON.generate(indexFile)) if generateIndex

# copy index.html for default locale
unless File.symlink?("#{root}index.html")
  FileUtils.copy_file("#{root}#{default_locale}/index.html", "#{root}index.html")
end

# copy other files
unless root == ""
  FileUtils.cp_r("assets", "#{root}assets")
  FileUtils.copy_file("404.html", "#{root}404.html")
end