# My hsnips

I'm trying to use [HyperSnips](https://github.com/draivin/hsnips) to make it easier to type $\LaTeX$ equations in VSCode/Cursor.
This is my current setup for developing HyperSnips snippets.

It turned out to be pretty hard to work directly with the vanilla `.hsnips` files, especially when I have to a bunch of JavaScript to implement something complex like auto-fraction (inspired by [Latex Suite for Obsidian](https://github.com/artisticat1/obsidian-latex-suite?tab=readme-ov-file#auto-fraction)).

That's why I'm using [snipbuild](https://github.com/RyotaUshio/snipbuild), a build tool that I wrote to solve this problem.

- Global block JavaScript is developed with TypeScript and unit-tested with [Vitest](https://vitest.dev/). It makes maintainance far easier.
    - Each `src/globals/[LANGUAGE].ts` exports what will be included in the global block of the corresponding snippet file.
- The snippet blocks for each language is located at `src/snippets/[LANGUAGE].hsnips`. It is in the exact same format as normal `.hsnips` files except:
    - It does not have the `global ... endglobal` block at the top.
    - It allows you to include common snippets shared by several (but not necessarily all) languages using `#include "..."`.
- When running `pnpm build`, [Rolldown](https://rolldown.rs/) generates the global JavaScript from `src/globals[LANGUAGE.ts]`, and the output is concatenated with the snippet blocks from `src/snippets/[LANGUAGE].hsnips`.

## Setup

### Installation

1. `pnpm i` to install dependencies
2. `pnpm build` to generate snippet files under the `dist/` directory
3. Install the generated snippet files. For example, you can use the following script on macOS (assuming you've installed both VSCode and Cursor):

    ```bash
    #!/usr/bin/env bash
    set -euo pipefail

    for app in Code Cursor; do
    dir="$HOME/Library/Application Support/$app/User/globalStorage/draivin.hsnips"
    mkdir -p "$dir"
    ln -sf $(realpath dist) "$dir/hsnips"
    done
    ```
4. Make sure you execute the `HyperSnips: Reload Snippets` command after updating the snippet files.

Once you install the snippets using symbolic links (as shown above), all you have to do after making edit to the source code is `pnpm bulid` & `HyperSnips: Reload Snippets`.

### Customize

This repo is still very young and many useful snippets are yet to be added. To customize snippets by yourself, edit the following files:

- Global blocks: `src/globals/[LANGUAGE].hsnips`
- Snippet blocks: `src/globals/[LANGUAGE].hsnips`

### Optional: Fix `<Esc>` key

Ignore this section if you're not a [vscodevim](https://github.com/VSCodeVim/Vim) user!

By default, you have to press `<Esc>` **twice** to go back to Normal mode after expanding a snippet. This is annoying!

To fix this, install [multi-command](https://github.com/ryuta46/vscode-multi-command) and add the following to `keybindings.json`:

```
  {
    "key": "escape",
    "command": "extension.multiCommand.execute",
    "args": {
      "sequence": ["leaveSnippet", "extension.vim_escape"]
    },
    "when": "editorTextFocus && vim.active && inSnippetMode"
  }
```

## Credits

- Gilles Castel's [amazing blog post](https://castel.dev/post/lecture-notes-1/) and [UtilSnip snippets](https://github.com/gillescastel/latex-snippets)
- artisticat's [Latex Suite](https://github.com/artisticat1/obsidian-latex-suite) plugin for Obsidian
    - Seriously, it proved pretty difficult to recreate in VSCode/Cursor what LaTeX Suite makes possible in Obsidian, which made me realize what a well-written piece of software it is. Crazy work.
    - Especially inspired by her implementation of [auto-fraction](https://github.com/artisticat1/obsidian-latex-suite/tree/main?tab=readme-ov-file#auto-fraction)
