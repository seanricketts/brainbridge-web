# brainbridge-web

Small public web tools for BrainBridge Collective, hosted with GitHub Pages and embedded in the Nexudus member portal.

Everything in this repo is public. Do not commit keys, member data, or anything private.

## Tools

Each tool is a folder with a self-contained `index.html`. The root `index.html` lists them.

| Tool | URL |
|---|---|
| Where to park | https://seanricketts.github.io/brainbridge-web/parking-map/ |

Embed in Nexudus with an Iframe block pointing at the tool URL (parking map: height about 1150px).

## Portal script

`portal-theme-sync.js` goes in the Nexudus portal custom JavaScript (as a script tag or pasted). It sends the portal light/dark theme to embedded tools.

```html
<script src="https://seanricketts.github.io/brainbridge-web/portal-theme-sync.js"></script>
```

## Light/dark theme

Tools default to dark. Add `?theme=light` or `?theme=dark` to the URL, or have the portal send
`{ type: 'bb-theme', theme: 'light' | 'dark' }` via `postMessage` to follow the portal's toggle.
