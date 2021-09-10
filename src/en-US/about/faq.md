---
title: "FAQ"
---

Here are some frequently-asked questions.

#### Can I get smart autocompletion (intellisense/LSP)?

Check out the [LSP] plugin.

#### Where is the integrated terminal?

Lite XL does not come with a terminal due to it's complexity.
For now, we have the [console] plugin to run a command and dump its output. (not interactive)

#### Tabs and indent size?

In your user config (the cog icon in the file tree):
```lua
config.tab_type = "soft" -- soft for spaces, hard for real tabs (\t)
config.indent_size = 4   -- 4 spaces
```

#### How to bind commands to keys?

```lua
local keymap = require "core.keymap"
keymap.add { ["ctrl+escape"] = "core:quit" }
```

#### How to unbind commands for certain keys?

```lua
-- the second parameter lets you override commands for certain keys
-- in this case it maps it to nothing
keymap.add({ ["ctrl+escape"] = {} }, true)
```

#### How to get commands for those keybinds?

You can search for commands in the command palette.\
For each command, replace the spaces in the right side with dashes.\
For example: `Core: Find Command` → `core:find-command`

#### What version of Lua does Lite XL use?

Lua 5.2.4. There's some activity around using LuaJIT instead (which is 5.1) but it can provide some Lua 5.2 compatibility.

#### Vim mode?

You need to [vibe].

#### Plugin recommendations

Just in case you don't want to comb through our [plugin repository][1],
these are a list of plugins that just makes Lite XL a lot more pleasant.

| Plugin               | Use case
| ---                  | ---
| [autoinsert]         | Automatically insert closing brackets and quotes
| [bracketmatch]       | Highlight matching brackets
| [ephemeraldocviews]  | Ephemeral tabs (previewing files without creating multiple tabs)
| [gitdiff_highlight]  | Git diff gutter
| [linecopypaste]      | Copy/Paste lines when nothing is selected
| [lint+]              | Linter support
| [minimap]            | Minimap
| [selectionhighlight] | Highlight code that matches the selection
| [lite-xl-discord]    | Discord rich presence |

#### Where's feature X? How about Y?

You can get more info in the [Features page][2].


[LSP]:                https://github.com/jgmdev/lite-xl-lsp
[console]:            https://github.com/franko/console
[vibe]:               https://github.com/eugenpt/lite-xl-vibe
[autoinsert]:         https://github.com/lite-xl/lite-plugins/blob/master/plugins/autoinsert.lua?raw=1
[bracketmatch]:       https://github.com/lite-xl/lite-plugins/blob/master/plugins/bracketmatch.lua?raw=1
[ephemeraldocviews]:  https://github.com/lite-xl/lite-plugins/blob/master/plugins/ephemeraldocviews.lua?raw=1
[gitdiff_highlight]:  https://github.com/vincens2005/lite-xl-gitdiff-highlight
[linecopypaste]:      https://github.com/lite-xl/lite-plugins/blob/master/plugins/linecopypaste.lua?raw=1
[lint+]:              https://github.com/liquid600pgm/lintplus
[minimap]:            https://github.com/lite-xl/lite-plugins/blob/master/plugins/minimap.lua?raw=1
[selectionhighlight]: https://github.com/lite-xl/lite-plugins/blob/master/plugins/selectionhighlight.lua?raw=1
[lite-xl-discord]:    https://github.com/vincens2005/lite-xl-discord

[1]: https://github.com/lite-xl/lite-plugins
[2]: {{ 'en/about/features' | relative_url }}
