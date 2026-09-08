(function () {
  let leafletMap = null;
  let boundLocationInput = null;

  function findInputByLabel(text) {
    for (const label of document.querySelectorAll('label')) {
      if (!label.textContent.trim().toLowerCase().startsWith(text.toLowerCase())) continue;

      const id = label.getAttribute('for');
      if (id) {
        const byId = document.getElementById(id);
        if (byId) return byId;
      }

      // Walk forward from the label in document order and grab the next
      // input before hitting another label — more resilient to whatever
      // wrapper depth Decap happens to render than a fixed closest('div').
      const all = Array.from(document.querySelectorAll('label, input'));
      const idx = all.indexOf(label);
      for (let i = idx + 1; i < all.length; i++) {
        if (all[i].tagName === 'LABEL') break;
        if (all[i].tagName === 'INPUT') return all[i];
      }

      const fallback = label.closest('div')?.querySelector('input');
      if (fallback) return fallback;
    }
    return null;
  }

  function setReactValue(input, value) {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    setter.call(input, String(value));
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  async function geocodeOnce(query) {
    const url = 'https://nominatim.openstreetmap.org/search?q=' +
      encodeURIComponent(query) + '&format=json&limit=1&addressdetails=1';
    const res = await fetch(url, { headers: { 'User-Agent': 'ralphs-kitchen/1.0' } });
    const data = await res.json();
    if (!data[0]) return null;
    const addr = data[0].address || {};
    const city = addr.city || addr.town || addr.village || addr.municipality || null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), city };
  }

  // Nominatim only matches things that exist as named points in
  // OpenStreetMap — most small restaurants/businesses aren't tagged there,
  // so "Business Name, City, ST" often comes back empty even though the
  // business is real. Fall back to progressively broader queries (dropping
  // the leading segment each time) so we at least land on city-level
  // coordinates instead of failing outright.
  async function geocode(query) {
    const segments = query.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    for (let i = 0; i < segments.length; i++) {
      const attempt = segments.slice(i).join(', ');
      const result = await geocodeOnce(attempt);
      if (result) return Object.assign({ approximate: i > 0 }, result);
    }
    return null;
  }

  function showMap(lat, lng) {
    if (typeof L === 'undefined') return;

    if (leafletMap) {
      leafletMap.remove();
      leafletMap = null;
    }

    let container = document.getElementById('rk-map');
    if (!container) {
      container = document.createElement('div');
      container.id = 'rk-map';
      Object.assign(container.style, {
        height: '220px',
        marginTop: '10px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        overflow: 'hidden',
        zIndex: '0',
        position: 'relative',
      });
      const btn = document.getElementById('rk-geocode-btn');
      btn?.insertAdjacentElement('afterend', container);
    }

    // Let the container settle in the DOM before Leaflet measures it
    setTimeout(() => {
      leafletMap = L.map(container, { zoomControl: true }).setView([lat, lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      }).addTo(leafletMap);
      L.marker([lat, lng]).addTo(leafletMap);
      leafletMap.invalidateSize();
    }, 100);
  }

  function teardown() {
    const existing = document.getElementById('rk-geocode-btn');
    if (existing) existing.remove();
    const map = document.getElementById('rk-map');
    if (map) map.remove();
    if (leafletMap) { leafletMap.remove(); leafletMap = null; }
    boundLocationInput = null;
  }

  function tryInject() {
    const existing = document.getElementById('rk-geocode-btn');
    const currentLocationInput = findInputByLabel('Location');

    if (existing) {
      // Stale if its container left the DOM, or the entry underneath
      // switched to a different Location field (e.g. navigated to another
      // entry without a churn-heavy enough DOM change to reset us).
      const stale = !document.body.contains(existing) ||
        !document.body.contains(boundLocationInput) ||
        (currentLocationInput && currentLocationInput !== boundLocationInput);
      if (stale) {
        teardown();
      } else {
        // Already injected and still valid — check if we should show the
        // map for existing coords.
        const latInput = findInputByLabel('Latitude');
        const lngInput = findInputByLabel('Longitude');
        const lat = parseFloat(latInput?.value);
        const lng = parseFloat(lngInput?.value);
        if (lat && lng && !document.getElementById('rk-map')) showMap(lat, lng);
        return;
      }
    } else if (boundLocationInput && !document.body.contains(boundLocationInput)) {
      // No button, but we still think we're bound to a since-removed field.
      boundLocationInput = null;
    }

    const locationInput = currentLocationInput;
    if (!locationInput) return;

    boundLocationInput = locationInput;

    const btn = document.createElement('button');
    btn.id = 'rk-geocode-btn';
    btn.type = 'button';
    btn.textContent = 'Geocode →';
    Object.assign(btn.style, {
      display: 'block',
      marginTop: '6px',
      padding: '4px 12px',
      fontSize: '12px',
      cursor: 'pointer',
      border: '1px solid #ccc',
      borderRadius: '4px',
      background: '#f5f5f5',
      color: '#333',
    });

    btn.addEventListener('click', async () => {
      const query = locationInput.value.trim();
      if (!query) return;
      btn.textContent = 'Geocoding…';
      btn.disabled = true;
      try {
        const coords = await geocode(query);
        if (coords) {
          const latInput = findInputByLabel('Latitude');
          const lngInput = findInputByLabel('Longitude');
          const cityInput = findInputByLabel('City');
          if (latInput) setReactValue(latInput, coords.lat);
          if (lngInput) setReactValue(lngInput, coords.lng);
          if (cityInput && coords.city) setReactValue(cityInput, coords.city);
          showMap(coords.lat, coords.lng);
          btn.textContent = coords.approximate ? '✓ Geocoded (approx.)' : '✓ Geocoded';
        } else {
          btn.textContent = '✗ Not found';
        }
      } catch {
        btn.textContent = '✗ Error';
      }
      setTimeout(() => { btn.textContent = 'Geocode →'; btn.disabled = false; }, 2500);
    });

    locationInput.closest('div')?.insertAdjacentElement('afterend', btn);

    // Show map immediately if coords already exist (editing an existing post)
    const latInput = findInputByLabel('Latitude');
    const lngInput = findInputByLabel('Longitude');
    const lat = parseFloat(latInput?.value);
    const lng = parseFloat(lngInput?.value);
    if (lat && lng) showMap(lat, lng);
  }

  let timer;
  const observer = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(tryInject, 200);
  });

  const init = () => {
    observer.observe(document.body, { childList: true, subtree: true });
    // Belt-and-suspenders: the CMS's editor can occasionally finish
    // rendering a form (including the Location field) without firing a
    // childList mutation the debounce above catches in time — a periodic
    // check makes sure the button still shows up in that case.
    setInterval(tryInject, 750);
  };
  document.body ? init() : window.addEventListener('DOMContentLoaded', init);
})();
