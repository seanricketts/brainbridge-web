# brainbridge-web

Small public web tools for BrainBridge Collective, hosted with GitHub Pages and embedded in Nexudus.

Everything in this repo is public. Do not commit keys, member data, or anything private.

## Tools

### parking-map

Interactive "Where to park" map near 731 E Walnut St, Pasadena.

Embed in Nexudus:

```html
<div id="bb-parking-root"></div>
<script src="https://seanricketts.github.io/brainbridge-web/parking-map/parking-map.js"></script>
```

Or as an iframe:

```html
<iframe src="https://seanricketts.github.io/brainbridge-web/parking-map/parking-map.html"
        style="width:100%;height:900px;border:0" title="Where to park"></iframe>
```

To change spots, edit the `SPOTS` list in `parking-map.js` (and the same list in `parking-map.html`).
