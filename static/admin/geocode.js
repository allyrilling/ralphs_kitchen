(function () {
  let leafletMap = null;

  function findInputByLabel(text) {
    for (const label of document.querySelectorAll('label')) {
      if (label.textContent.trim().toLowerCase().includes(text.toLowerCase())) {
        const id = label.getAttribute('for');
        const input = (id && document.getElementById(id)) ||
          label.closest('div')?.querySelector('input');
        if (input) return input;
      }
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

  async function geocode(query) {
    const url = 'https://nominatim.openstreetmap.org/search?q=' +
      encodeURIComponent(query) + '&format=json&limit=1&addressdetails=1';
    const res = await fetch(url, { headers: { 'User-Agent': 'ralphs-kitchen/1.0' } });
    const data = await res.json();
    if (!data[0]) return null;
    const addr = data[0].address || {};
    const city = addr.city || addr.town || addr.village || addr.municipality || null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), city };
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

  function tryInject() {
    const existing = document.getElementById('rk-geocode-btn');
    if (existing && !document.body.contains(existing)) {
      existing.remove();
      const map = document.getElementById('rk-map');
      if (map) { map.remove(); }
      if (leafletMap) { leafletMap.remove(); leafletMap = null; }
    }
    if (document.getElementById('rk-geocode-btn')) {
      // Already injected — check if we should show map for existing coords
      const latInput = findInputByLabel('Latitude');
      const lngInput = findInputByLabel('Longitude');
      const lat = parseFloat(latInput?.value);
      const lng = parseFloat(lngInput?.value);
      if (lat && lng && !document.getElementById('rk-map')) showMap(lat, lng);
      return;
    }

    const locationInput = findInputByLabel('Location');
    if (!locationInput) return;

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
          btn.textContent = '✓ Geocoded';
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

  const init = () => observer.observe(document.body, { childList: true, subtree: true });
  document.body ? init() : window.addEventListener('DOMContentLoaded', init);
})();
