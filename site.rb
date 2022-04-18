#!/usr/bin/env ruby
require 'redcarpet'
require 'rouge'

class RedRouge < Redcarpet::Render::HTML
  def block_code(code, language) "<pre>" + Rouge.highlight(code, language || "bash", 'html') + "</pre>" end
  def image(link, title, alt_text) "<img data-src='#{link}' title='#{title}' alt='#{alt_text}'/>" end
  def link(link, title, link_content) "<a title='#{title}' #{link =~ /^(http|\/?assets)/ && "target='_blank'"} href='#{link}'>#{link_content}</a>" end
end
rc = Redcarpet::Markdown.new(RedRouge.new(with_toc_data: true), { fenced_code_blocks: true, tables: true, footnotes: true })
sitemap = File.open("sitemap.txt", "w")
sitemap.puts("https://lite-xl.com");
Dir.glob("locales/*").map { |locale| File.write(File.basename(locale) + ".html", File.read("#{locale}/template.html").gsub("{{ pages }}", 
  Dir.glob("#{locale}/**/*.md").select { |x| File.file?(x) }.map { |x| 
    sitemap.write("https://lite-xl.com/" + File.basename(locale) + (x =~ /index\.md/ ? "" : "?/" + x.downcase.gsub(/^locales\/\w+\//, "").gsub(/\.\w+$/, "")) + "\n")
    "<page id='page-#{x.downcase.gsub(/(^locales\/#{File.basename(locale)}\/|[^a-z0-9_\-\/\\\.]|\.\w+$)/,"").gsub(/[\s\\\/]+/, "-")}'>#{rc.render(File.read(x))}</page>" 
  }.join("\n")))
}
