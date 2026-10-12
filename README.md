# OptiCraft Heritage Developer Community

Static portal for the **OptiCraft Heritage** porting community: a directory of
community-made ports (DSi, 3DS, Wii, PS2, PSP, Xbox, Android, Switch, PS4,
PS Vita, Windows, Linux, macOS…) plus a set of self-contained **browser tools**
that run 100% client-side — no backend, no build system, nothing to install.

## Pages & tools

| Page | What it does |
|------|--------------|
| `index.html` | Port list portal: all community OptiCraft Heritage ports with project links, stable downloads and nightly CI build links (via [nightly.link](https://nightly.link)). |
| `pak-tool.html` | Pack/unpack `assets.pak` (binary **MCPK v1** format). Includes a convert tab that flips the texture set for the Nintendo 3DS edition. |
| `ochpack-tool.html` | Build and inspect `.ochpack` texture packs for the PS2 port. |
| `ochpack-3ds-tool.html` | Convert a Java-style texture pack ZIP into a 3DS `.ochpack`, applying the 3DS-side texture flips. |
| `skin-tool.html` | 3DS skin converter with wizard, 2D avatar preview and QR helper for on-console download. |

## Features

- **Bilingual UI (EN/ES)** with a language switcher persisted across pages.
- All file processing happens **locally in the browser** — nothing is uploaded.
- Self-hosted assets: per-page i18n dictionaries (`data-i18n` markup), vendored JSZip, QRCode and SweetAlert2. Sounds and dialogs come from shared WebAudio / helper scripts.
- Keyboard-friendly (arrows/Enter/ESC) and usable from the Nintendo 3DS browser.

## Running it locally

No toolchain required — serve the folder statically:

```sh
# any static server works, e.g.
python -m http.server 8000
# then open http://localhost:8000/index.html
```

## Repository layout

```
css/          stylesheets (incl. vendored Font Awesome extract)
fonts/        Font Awesome webfonts, Minecraft font
images/       logos, headings, flags, background art
js/           one tool script per page + shared och-ui/och-sounds helpers + vendored libs
index.html    portal (port list + about panel)
*-tool.html   the four browser tools
```

## Project & port links references

The port list opens GitHub repos / release pages of each port author, plus
CI artifacts served through nightly.link. See `index.html` for the current
list — community contributions welcome on the official Discord
(https://discord.gg/5ndWfJzb7e).

## License

MIT — see `LICENSE`. Not affiliated with Optiprojects or Mojang /
Minecraft.
