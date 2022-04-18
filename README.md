# [Lite XL][1] website

This website is built using markdown, and a few line ruby script.

## Local Build Quick-start Guide
- Install the required dependencies: `ruby`, and the `redcarpet` and `rouge` gems.
- If you have ruby, you can install `redcarpet` and `rouge` with `gem install redcarpet rouge`.
- Run `site.rb`. It should generate `index.html`, which can be opened directly in your browser.

## Extra goodies
- get [watchexec][2] for watching directories.
```sh
$ watchexec -e md,html -w locales -w assets ./site.rb
```


[1]: https://github.com/lite-xl/lite-xl
[2]: https://github.com/watchexec/watchexec