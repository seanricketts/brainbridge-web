/*!
 * BrainBridge Collective: "Where to park" map.
 * Self-contained: injects its own CSS, loads Leaflet, builds the markup and the map.
 *
 * Usage (Nexudus custom JS, or any page):
 *   <div id="bb-parking-root"></div>
 *   <script src="parking-map.js"></script>
 * If no #bb-parking-root exists, the map is inserted right after the <script> tag.
 *
 * Generated from parking-map.html. To change spots, edit the SPOTS list below.
 */
(function () {
  'use strict';
  if (window.__bbParkingMapLoaded) return;
  window.__bbParkingMapLoaded = true;

  var LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  var LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  var FONT_CSS = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap';

  /* ------------------------------ styles ------------------------------ */
  // Everything is scoped under .bb-parking so it cannot leak into the host theme.
  var CSS = [
    '.bb-parking { --bb-primary:#526D5E; --bb-primary-hover:#435A4D; --bb-bg:#222529; --bb-surface:#191B1D; --bb-border:#464950; --bb-heading:#FFFFFF; --bb-text:#B0B0B8; --bb-text-2:#C5C6CC; --bb-radius:16px; --c-public:#7FB095; --c-customers:#E0B15A; --c-restricted:#8A8D96; --c-unknown:#6FA3C7; --c-street:#C98BD1; }',
    '.bb-parking, .bb-parking * { box-sizing: border-box; }',
    ".bb-parking { font-family: 'Poppins', system-ui, sans-serif; color: var(--bb-text); background: var(--bb-bg); padding: 16px; max-width: 1200px; margin: 0 auto; line-height: 1.4; text-align: left; }",
    '.bb-parking h2 { color: var(--bb-heading); font-weight: 600; margin: 0 0 4px; font-size: 1.5rem; }',
    '.bb-parking .sub { margin: 0 0 16px; font-size: .9rem; }',
    '.bb-parking .bb-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }',
    '.bb-parking .bb-chip { font: inherit; font-size: .8rem; color: var(--bb-text-2); background: transparent; border: 1px solid var(--bb-border); border-radius: 999px; padding: 6px 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }',
    '.bb-parking .bb-chip[aria-pressed="true"] { background: var(--bb-primary); border-color: var(--bb-primary); color: #fff; }',
    '.bb-parking .bb-chip:hover { border-color: var(--bb-primary); }',
    '.bb-parking .bb-chip:focus-visible, .bb-parking .bb-item:focus-visible, .bb-parking .bb-btn:focus-visible { outline: 2px solid var(--c-public); outline-offset: 2px; }',
    '.bb-parking .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }',
    '.bb-parking .bb-grid { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }',
    '.bb-parking #bb-map { height: 600px; border-radius: var(--bb-radius); border: 1px solid var(--bb-border); background: var(--bb-surface); }',
    '.bb-parking .bb-list { background: var(--bb-surface); border: 1px solid var(--bb-border); border-radius: var(--bb-radius); max-height: 600px; overflow-y: auto; padding: 8px; }',
    '.bb-parking .bb-item { display: block; width: 100%; text-align: left; font: inherit; color: var(--bb-text); background: transparent; border: 1px solid transparent; border-radius: 12px; padding: 12px; cursor: pointer; }',
    '.bb-parking .bb-item:hover, .bb-parking .bb-item.active { background: var(--bb-bg); border-color: var(--bb-border); }',
    '.bb-parking .bb-item .t { display: flex; align-items: center; gap: 8px; color: var(--bb-heading); font-weight: 500; font-size: .95rem; }',
    '.bb-parking .bb-item .m { font-size: .8rem; margin-top: 2px; }',
    '.bb-parking .bb-item .n { font-size: .8rem; margin-top: 6px; color: var(--bb-text-2); }',
    '.bb-parking .letter { width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: #111; font-weight: 600; font-size: .75rem; flex: none; }',
    '.bb-parking .bb-btn { display: inline-block; margin-top: 8px; font: inherit; font-size: .8rem; font-weight: 500; color: #fff; background: var(--bb-primary); border: 0; border-radius: var(--bb-radius); padding: 7px 16px; text-decoration: none; cursor: pointer; }',
    '.bb-parking .bb-btn:hover { background: var(--bb-primary-hover); }',
    '.bb-parking .bb-legend { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 12px; font-size: .78rem; }',
    '.bb-parking .bb-legend span { display: inline-flex; align-items: center; gap: 6px; }',
    '.bb-parking .bb-foot { margin: 12px 0 0; font-size: .75rem; opacity: .85; }',
    '.bb-parking .bb-foot a { color: var(--c-public); }',
    '.bb-parking .bb-empty { padding: 16px; font-size: .85rem; }',
    '.bb-parking .leaflet-popup-content-wrapper, .bb-parking .leaflet-popup-tip { background: var(--bb-surface); color: var(--bb-text); border: 1px solid var(--bb-border); border-radius: 12px; }',
    ".bb-parking .leaflet-popup-content { font-family: 'Poppins', sans-serif; font-size: .82rem; margin: 12px 14px; }",
    '.bb-parking .leaflet-popup-content b { color: var(--bb-heading); }',
    '.bb-parking .leaflet-container a.bb-btn { color: #fff; }',
    '.bb-parking .bb-tiles { filter: invert(1) hue-rotate(180deg) brightness(.95) contrast(.9) saturate(.6); }',
    '.bb-parking .sw { width: 24px; height: 5px; border-radius: 3px; flex: none; }',
    '.bb-parking .bb-pin { background: var(--bb-primary); color: #fff; border: 2px solid #fff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }',
    '.bb-parking .bb-pin span { transform: rotate(45deg); font-weight: 600; font-size: .7rem; }',
    '@media (max-width: 820px) {',
    '  .bb-parking .bb-grid { grid-template-columns: 1fr; }',
    '  .bb-parking #bb-map { height: 440px; }',
    '  .bb-parking .bb-list { max-height: 360px; }',
    '}'
  ].join('\n');

  var HTML =
    '<h2>Where to park</h2>' +
    '<p class="sub">Parking lots, garages and street parking near BrainBridge Collective, 731 E Walnut St, Pasadena. Tap a spot for details.</p>' +
    '<div class="bb-filters" id="bb-filters" role="group" aria-label="Filter parking by type"></div>' +
    '<div class="bb-grid">' +
      '<div id="bb-map" role="application" aria-label="Interactive parking map"></div>' +
      '<div class="bb-list" id="bb-list" aria-label="Parking options, nearest first"></div>' +
    '</div>' +
    '<div class="bb-legend" id="bb-legend"></div>' +
    '<p class="bb-foot">Walking times are straight-line estimates. Always check posted signs for hours, rates and permit rules. ' +
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors.</p>';

  /* ------------------------------ loading ----------------------------- */
  var thisScript = document.currentScript;

  function addLink(href, id) {
    if (id && document.getElementById(id)) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href; if (id) l.id = id;
    document.head.appendChild(l);
  }

  function loadLeaflet(cb) {
    if (window.L && window.L.map) return cb();
    addLink(LEAFLET_CSS, 'bb-leaflet-css');
    var s = document.createElement('script');
    s.src = LEAFLET_JS;
    s.onload = cb;
    s.onerror = function () { console.error('[parking-map] Could not load Leaflet'); };
    document.head.appendChild(s);
  }

  function mount() {
    var root = document.getElementById('bb-parking-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'bb-parking-root';
      if (thisScript && thisScript.parentNode) thisScript.parentNode.insertBefore(root, thisScript.nextSibling);
      else document.body.appendChild(root);
    }
    if (!document.getElementById('bb-parking-css')) {
      var st = document.createElement('style');
      st.id = 'bb-parking-css'; st.textContent = CSS;
      document.head.appendChild(st);
    }
    addLink(FONT_CSS, 'bb-parking-font');
    root.innerHTML = '<div class="bb-parking">' + HTML + '</div>';
    loadLeaflet(function () { init(root); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();

  /* ------------------------------ the map ----------------------------- */
  function init(root) {
    var L = window.L;
    /* ------------------------------------------------------------------
     * EDIT HERE. Everything the map shows comes from the two lists below.
     *
     * BUILDING: where the pin goes.
     * SPOTS: one entry per lot, garage or stretch of street.
     *   name    : shown to visitors. null = "Parking lot A/B/..." placeholder.
     *   kind    : 'lot' | 'garage' | 'street'
     *   access  : 'public' | 'customers' | 'restricted' | 'unknown'
     *   fee     : text such as 'Free', '$2/hr', 'Free 2 hr limit', or null
     *   capacity: number or null
     *   notes   : short tip for visitors ('Enter from Madison Ave'), or ''
     *   poly    : [[lat,lng],...] outline of a lot/garage
     *   line    : [[lat,lng],...] centerline for kind 'street' (use instead of poly)
     * Lot outlines below came from OpenStreetMap; names, fees and rules
     * are NOT in that data and are still to be filled in.
     * ------------------------------------------------------------------ */
    var BUILDING = { name: 'BrainBridge Collective', lat: 34.1496535, lng: -118.1356279 };
  
    var SPOTS = [
    { id: 'osm-1095656196', name: 'Union - El Molino Lot', kind: 'lot', access: 'public', fee: '$1.50/hr, $8 all day', hours: '24/7 (no parking 2am-6am)', capacity: 50, ev: 'yes', enterFrom: 'Union St and El Molino Ave', notes: 'City-owned surface lot. No monthly permits.', links: [{ url: 'https://experience.arcgis.com/experience/3dede2cff5734fab83d7270a31de4c94', label: 'City of Pasadena parking info' }], dist: 241, poly: [[34.147725,-118.136818],[34.147726,-118.136782],[34.147766,-118.136782],[34.14777,-118.136477],[34.147712,-118.136473],[34.147709,-118.136404],[34.147519,-118.1364],[34.14752,-118.136501],[34.147468,-118.136499],[34.147465,-118.136812],[34.147725,-118.136818]] },
    { id: 'osm-502738485', name: '155 N Lake Garage', kind: 'garage', access: 'public', fee: null, hours: '24/7', capacity: null, ev: 'yes', enterFrom: null, notes: 'Indoor self-park. No oversize vehicles. No in-and-out: one entry and one exit only. Cash or card. Motorcycle parking. Rates not published online. Phone (626) 304-9689.', links: [{ url: 'https://go.lazparking.com/buynow?l=6690', label: 'LAZ Parking page' }], dist: 260, poly: [[34.148235,-118.133267],[34.148226,-118.133267],[34.148226,-118.133761],[34.148851,-118.133762],[34.14885,-118.133267],[34.1488,-118.133268],[34.1488,-118.133219],[34.148267,-118.133218],[34.148267,-118.133148],[34.14826,-118.133142],[34.14826,-118.133112],[34.148267,-118.133112],[34.148267,-118.132954],[34.148235,-118.132954],[34.148235,-118.133267]] },
    { id: 'propark-301-n-lake', name: '301 N Lake Garage', kind: 'garage', access: 'public', fee: '$1.25 per 15 min, $12.50 daily max', hours: 'Daily 7am-7pm', capacity: null, ev: 'no', enterFrom: 'North side of Locust St, between N Lake Ave and N Hudson Ave', notes: 'Covered self-park, no height limit. No in-and-out. Pay with the ParkChirp app; license plate required at entry.', links: [{ url: 'https://www.propark.com/facilities/301-n-lake-ave-parking/', label: 'Propark page' }], dist: 287, point: [34.1508655,-118.132881] },
    { id: 'gmaps-650-walnut', name: 'Public Parking - 650 Walnut', kind: 'lot', access: 'public', fee: null, hours: null, capacity: null, ev: null, enterFrom: null, notes: 'Rates and hours not yet confirmed. Check posted signs.', links: [{ url: 'https://www.google.com/maps/search/?api=1&query=34.14974,-118.137099', label: 'View on Google Maps' }], dist: 136, point: [34.14974,-118.1370987] },
    { id: 'street-el-molino-east-walnut-street-locust-street', name: 'El Molino: Walnut to Locust', kind: 'street', access: 'unknown', fee: null, hours: null, capacity: null, ev: null, enterFrom: null, notes: 'No parking anytime.', dist: null, line: [[34.14958,-118.1369243],[34.1496844,-118.1369245],[34.1499595,-118.1369219],[34.1500943,-118.1369233],[34.150483,-118.136928]] },
    { id: 'street-el-molino-east-union-street-east-walnut-street', name: 'El Molino: Union to Walnut', kind: 'street', access: 'unknown', fee: '$1/hr at meters', hours: null, capacity: null, ev: null, enterFrom: null, notes: '2 hr parking 9am-6pm; some stretches are no parking (7am-6pm or anytime). Street cleaning: Friday.', dist: null, line: [[34.1472483,-118.1369053],[34.1473641,-118.136909],[34.1473904,-118.1369073],[34.1475337,-118.1369034],[34.1476943,-118.1369025],[34.1477836,-118.1369027],[34.147931,-118.1369055],[34.1479845,-118.1369048],[34.1481965,-118.1369069],[34.148705,-118.1369149],[34.1487352,-118.1369152],[34.1489956,-118.1369156],[34.1494558,-118.1369224],[34.14958,-118.1369243]] },
    { id: 'street-hudson-locust-street-east-corson-street', name: 'Hudson: Locust to Corson', kind: 'street', access: 'unknown', fee: null, hours: null, capacity: null, ev: null, enterFrom: null, notes: '4 hr parking. Street cleaning: Monday.', dist: null, line: [[34.1504932,-118.1346691],[34.1505622,-118.1346696],[34.1508105,-118.1346684],[34.1511582,-118.1346682],[34.1511803,-118.1346682],[34.1512573,-118.1346681]] },
    { id: 'street-hudson-east-walnut-street-locust-street', name: 'Hudson: Walnut to Locust', kind: 'street', access: 'unknown', fee: null, hours: null, capacity: null, ev: null, enterFrom: null, notes: 'East side: 4 hr parking 7am-6pm except Sundays, once per day per block. West side: 1 hr parking 7am-6pm except Sundays, once per day per block. No parking 2am-6am. Street cleaning: Monday. Zone 6295 permit holders exempt from the time limits.', dist: null, line: [[34.1495821,-118.1346521],[34.1496714,-118.1346562],[34.1496987,-118.1346574],[34.1504176,-118.134668],[34.1504932,-118.1346691]] },
    { id: 'street-hudson-east-union-street-east-walnut-street', name: 'Hudson: Union to Walnut', kind: 'street', access: 'unknown', fee: null, hours: null, capacity: null, ev: null, enterFrom: null, notes: '2 hr parking; some stretches are no stopping. Street cleaning: Friday.', dist: null, line: [[34.1477901,-118.1338973],[34.1478584,-118.1339028],[34.1482115,-118.1338948],[34.1487721,-118.1338979],[34.1494797,-118.1339017],[34.1495873,-118.1339023],[34.1495867,-118.1340169],[34.1495821,-118.1346521]] },
    { id: 'street-locust-north-el-molino-avenue-north-hudson-avenue', name: 'Locust: El Molino to Hudson', kind: 'street', access: 'unknown', fee: null, hours: null, capacity: null, ev: null, enterFrom: null, notes: '2 hr parking 7am-6pm on the south side only; no parking on the north side. Street cleaning: 1st and 3rd Monday 8am-12pm (tow-away). Permit zone 6295.', dist: null, line: [[34.150483,-118.136928],[34.1504836,-118.1368279],[34.1504839,-118.1367788],[34.1504905,-118.1356759],[34.1504913,-118.1354987],[34.1504924,-118.1352528],[34.1504931,-118.1347599],[34.1504932,-118.1346691]] },
    { id: 'street-locust-north-hudson-avenue-north-lake-avenue', name: 'Locust: Hudson to Lake', kind: 'street', access: 'unknown', fee: null, hours: null, capacity: null, ev: null, enterFrom: null, notes: '1 hr parking 7am-6pm except Sundays, once per day per block; no parking 2am-6am; no parking on the south side. Street cleaning: Monday. Permit zone 6295 holders exempt from the 1 hr limit.', dist: null, line: [[34.1504932,-118.1346691],[34.1504954,-118.1345837],[34.150497,-118.1340453],[34.150497,-118.1340298],[34.1504982,-118.1336395],[34.1505001,-118.1329896],[34.1505014,-118.1325725],[34.1505017,-118.1324639]] },
    { id: 'street-oak-knoll-east-union-street-east-walnut-street', name: 'Oak Knoll: Union to Walnut', kind: 'street', access: 'unknown', fee: null, hours: null, capacity: null, ev: null, enterFrom: null, notes: '2 hr parking 9am-6pm; some stretches are no parking anytime. Street cleaning: Friday.', dist: null, line: [[34.1477529,-118.1352969],[34.1478421,-118.1353631],[34.1478656,-118.1353791],[34.1478951,-118.1353779],[34.1482394,-118.1353818],[34.1483391,-118.135382],[34.1488541,-118.1353617],[34.1494541,-118.1353842],[34.1494914,-118.1353856],[34.1495784,-118.1353852]] },
    { id: 'street-walnut-north-oak-knoll-avenue-north-el-molino-avenue', name: 'Walnut: Oak Knoll to El Molino', kind: 'street', access: 'unknown', fee: null, hours: null, capacity: null, ev: null, enterFrom: null, notes: '2 hr parking 9am-6pm. Street cleaning: Monday.', dist: null, line: [[34.1495784,-118.1353852],[34.1495783,-118.1357133],[34.149579,-118.1366636],[34.1495797,-118.1368439],[34.14958,-118.1369243]] },
    { id: 'street-walnut-north-hudson-avenue-north-oak-knoll-avenue', name: 'Walnut: Hudson to Oak Knoll', kind: 'street', access: 'unknown', fee: null, hours: null, capacity: null, ev: null, enterFrom: null, notes: '2 hr parking 9am-6pm. Street cleaning: Monday.', dist: null, line: [[34.1495821,-118.1346521],[34.1495784,-118.1353852]] },
    { id: 'street-walnut-north-lake-avenue-north-hudson-avenue', name: 'Walnut: Lake to Hudson', kind: 'street', access: 'unknown', fee: null, hours: null, capacity: null, ev: null, enterFrom: null, notes: 'No stopping anytime.', dist: null, line: [[34.1495793,-118.132388],[34.1495802,-118.1325574],[34.1495804,-118.1325882],[34.1496252,-118.13267],[34.1496224,-118.1329739],[34.1496191,-118.1332723],[34.1496186,-118.1333198],[34.1496153,-118.1337882],[34.1495886,-118.1338603],[34.1495873,-118.1339023]] }
    ];

    /* ---------------------------- rendering --------------------------- */
    var KINDS = { lot: 'Lots', garage: 'Garages', street: 'Street parking' };
    var ACCESS = {
      public:     { label: 'Public',            color: '#7FB095' },
      customers:  { label: 'Customers only',    color: '#E0B15A' },
      restricted: { label: 'Permit / private',  color: '#8A8D96' },
      members:    { label: 'Members (monthly permit)', color: '#5CC8C2' },
      unknown:    { label: 'Rules not yet confirmed', color: '#6FA3C7' }
    };
    var STREET_COLOR = '#C98BD1';
    // OSM "private"/"permit" -> restricted
    SPOTS.forEach(function (s) { if (s.access === 'private' || s.access === 'permit') s.access = 'restricted'; });

    function pts(s) { return s.line || s.poly || [s.point]; }
    function center(s) {
      var p = pts(s), la = 0, lo = 0;
      p.forEach(function (c) { la += c[0]; lo += c[1]; });
      return [la / p.length, lo / p.length];
    }
    function colorOf(s) { return s.kind === 'street' ? STREET_COLOR : ACCESS[s.access].color; }

    // letters in nearest-first order
    SPOTS.forEach(function (s) { s._c = center(s); s._d = s.dist != null ? s.dist : Math.round(L.latLng(s._c).distanceTo([BUILDING.lat, BUILDING.lng])); });
    // lots and garages first (nearest first), then street blocks
    SPOTS.sort(function (a, b) { return ((a.kind === 'street') - (b.kind === 'street')) || (a._d - b._d); });
    var nLetter = 0;
    SPOTS.forEach(function (s) {
      s._letter = s.kind === 'street' ? '' : String.fromCharCode(65 + (nLetter++ % 26));
      s._title = s.name || ((s.kind === 'garage' ? 'Parking garage ' : s.kind === 'street' ? 'Street parking' : 'Parking lot ') + s._letter);
    });

    function walk(m) { var min = Math.max(1, Math.round(m / 80)), ft = Math.round(m * 3.28084); return min + ' min walk (' + (ft >= 1000 ? (ft / 5280).toFixed(1) + ' mi' : ft + ' ft') + ')'; }
    function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function details(s) {
      var bits = [];
      if (s.kind === 'street') bits.push('Street parking'); else bits.push(s.kind === 'garage' ? 'Garage' : 'Lot');
      if (s.kind !== 'street') bits.push(ACCESS[s.access].label);
      if (s.fee) bits.push(s.fee);
      if (s.capacity) bits.push(s.capacity + ' spaces');
      if (s.hours) bits.push(s.hours);
      return bits.join(' · ');
    }
    function linkBtn(s) {
      return (s.links || []).map(function (l) { return linkOne(l); }).join('');
    }
    function linkOne(l) {
      if (!l || !/^https?:\/\//.test(l.url)) return '';
      return ' <a class="bb-btn" target="_blank" rel="noopener" href="' + esc(l.url) + '">' + esc(l.label || 'More info') + '</a>';
    }
    function dirUrl(s) { return 'https://www.google.com/maps/dir/?api=1&destination=' + s._c[0].toFixed(6) + ',' + s._c[1].toFixed(6) + '&travelmode=driving'; }

    var mapEl = root.querySelector('#bb-map');
    var map = L.map(mapEl, { scrollWheelZoom: false }).setView([BUILDING.lat, BUILDING.lng], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, className: 'bb-tiles',
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    map.on('focus', function () { map.scrollWheelZoom.enable(); });
    map.on('blur', function () { map.scrollWheelZoom.disable(); });

    L.marker([BUILDING.lat, BUILDING.lng], {
      icon: L.divIcon({ className: '', html: '<div class="bb-pin"><span>BB</span></div>', iconSize: [30, 30], iconAnchor: [15, 30] }),
      title: BUILDING.name, zIndexOffset: 1000
    }).addTo(map).bindPopup('<b>' + esc(BUILDING.name) + '</b><br>731 E Walnut St');

    var active = { lot: true, garage: true, street: true };
    var group = L.featureGroup().addTo(map);

    SPOTS.forEach(function (s) {
      var col = colorOf(s), g;
      if (s.kind === 'street') g = L.polyline(s.line, { color: col, weight: 6, opacity: .85 });
      else if (s.point) g = L.circle(s.point, { radius: 25, color: col, weight: 2, fillColor: col, fillOpacity: .35 });
      else g = L.polygon(s.poly, { color: col, weight: 2, fillColor: col, fillOpacity: .35, dashArray: s.access === 'unknown' ? '5 4' : null });
      var tag = s.kind === 'street' ? null : L.marker(s._c, { icon: L.divIcon({ className: '', html: '<div class="letter" style="background:' + col + '">' + s._letter + '</div>', iconSize: [24, 24], iconAnchor: [12, 12] }), keyboard: false });
      var layer = L.featureGroup(tag ? [g, tag] : [g]);
      var html = '<b>' + esc(s._title) + '</b><br>' + esc(details(s)) + '<br>' + esc(walk(s._d)) +
        (s.enterFrom ? '<br>Enter: ' + esc(s.enterFrom) : '') + (s.ev ? '<br>EV charging: ' + esc(s.ev) : '') + (s.notes ? '<br>' + esc(s.notes) : '') + '<br><a class="bb-btn" target="_blank" rel="noopener" href="' + dirUrl(s) + '">Directions</a>' + linkBtn(s);
      g.bindPopup(html); if (tag) tag.bindPopup(html);
      g.on('click', function () { select(s, false); }); if (tag) tag.on('click', function () { select(s, false); });
      s._layer = layer; s._popup = g;
    });

    var listEl = root.querySelector('#bb-list');
    function renderList() {
      var shown = SPOTS.filter(function (s) { return active[s.kind]; });
      listEl.innerHTML = shown.length ? '' : '<div class="bb-empty">Nothing to show for this filter.</div>';
      SPOTS.forEach(function (s) { s._item = null; });
      shown.forEach(function (s) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'bb-item';
        b.innerHTML = '<div class="t">' + (s._letter ? '<span class="letter" style="background:' + colorOf(s) + '">' + s._letter + '</span>' : '<span class="sw" style="background:' + colorOf(s) + '"></span>') + esc(s._title) + '</div>' +
          '<div class="m">' + esc(details(s)) + ' · ' + esc(walk(s._d)) + '</div>' + (s.notes ? '<div class="n">' + esc(s.notes) + '</div>' : '');
        b.addEventListener('click', function () { select(s, true); });
        listEl.appendChild(b);
        s._item = b;
      });
      SPOTS.forEach(function (s) {
        if (active[s.kind]) group.addLayer(s._layer); else group.removeLayer(s._layer);
      });
    }

    function select(s, fly) {
      [].forEach.call(listEl.querySelectorAll('.bb-item'), function (e) { e.classList.remove('active'); });
      if (s._item) { s._item.classList.add('active'); s._item.scrollIntoView({ block: 'nearest' }); }
      if (fly) {
        map.fitBounds(L.latLngBounds(pts(s)).extend([BUILDING.lat, BUILDING.lng]).pad(.2), { maxZoom: 18 });
        s._popup.openPopup(s._c);
      }
    }

    // filters (a chip only appears once data of that kind exists)
    var fEl = root.querySelector('#bb-filters');
    Object.keys(KINDS).forEach(function (k) {
      if (!SPOTS.some(function (s) { return s.kind === k; })) { active[k] = false; return; }
      var c = document.createElement('button');
      c.type = 'button'; c.className = 'bb-chip'; c.setAttribute('aria-pressed', 'true'); c.textContent = KINDS[k];
      c.addEventListener('click', function () {
        active[k] = !active[k]; c.setAttribute('aria-pressed', String(active[k])); renderList();
      });
      fEl.appendChild(c);
    });

    // legend
    var lg = root.querySelector('#bb-legend'), used = {};
    SPOTS.forEach(function (s) { used[s.kind === 'street' ? 'street' : s.access] = true; });
    Object.keys(ACCESS).forEach(function (k) { if (used[k]) lg.insertAdjacentHTML('beforeend', '<span><i class="dot" style="background:' + ACCESS[k].color + '"></i>' + ACCESS[k].label + '</span>'); });
    if (used.street) lg.insertAdjacentHTML('beforeend', '<span><i class="dot" style="background:' + STREET_COLOR + '"></i>Street parking</span>');
    lg.insertAdjacentHTML('beforeend', '<span><i class="dot" style="background:#526D5E;border:1px solid #fff"></i>BrainBridge</span>');

    renderList();
    // Fit once the container has its real size (it can be 0 wide while the page lays out).
    var fitted = false;
    function fit() {
      map.invalidateSize();
      if (map.getSize().x < 100) return;
      fitted = true;
      var near = L.featureGroup(SPOTS.filter(function (s) { return s._d <= 600; }).map(function (s) { return s._layer; }));
      map.fitBounds((near.getLayers().length ? near : group).getBounds().extend([BUILDING.lat, BUILDING.lng]).pad(.08), { animate: false });
    }
    fit();
    window.addEventListener('load', fit);
    if (window.ResizeObserver) new ResizeObserver(function () { if (!fitted) fit(); else map.invalidateSize(); }).observe(mapEl);
  }
})();
