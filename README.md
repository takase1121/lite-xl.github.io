# [Lite XL][1] website

This website is built with markdown and a tiny ruby script as a static site generator.

## Local Build Quick-start Guide

- Install the required dependencies: `ruby`, and the `redcarpet` and `rouge` gems.
- If you have ruby, you can install `redcarpet` and `rouge` with `gem install redcarpet rouge`.
- Run `site.rb`. It should generate the website in-place. You'll need a HTTP server[₁][2][₂][3] to preview it.

> If you use `python3`'s `http.server`, the links on the website may not work correctly as `http.server` requires
> the full filename (with the `.html` file extension) while the website does not use that. `http-server` does not have
> this limitation.

## Extra goodies

#### Auto updates

get [watchexec][4] for watching directories.

```sh
$ watchexec -e md,html -w locales -w assets ./site.rb
```

#### Configuring site.rb

For normal usage you don't need to configure the script at all.
However, some of the behavior can be changed via environment variables.

- `SITE_ROOT`: change the output path of the script. This does not change the URL in the generated HTML files.
- `SITE_DOMAIN`: change the domain used in `sitemap.txt`. You won't need this.
- `SITE_LOCALE`: change the default locale of the website. You won't need this.
- `VERBOSE`: enable verbose output. Can be useful to debug which files were generated.


# Credits

[Material Design Icons][5] are used in the website. It is licensed under [Apache 2.0 License][6].



[1]: https://github.com/lite-xl/lite-xl
[2]: https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server
[3]: https://www.npmjs.com/package/http-server
[4]: https://github.com/watchexec/watchexec
[5]: https://materialdesignicons.com/
[6]: https://github.com/Templarian/MaterialDesign/blob/1d1761974cabe0868441fac6069438e5243d3446/LICENSE
