let map, service, infowindow, markers = [];

function initMap() {
  const defaultLocation = { lat: 35.4676, lng: -97.5164 }; // Oklahoma
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 13,
    mapId: "DEMO_MAP_ID"
  });

  infowindow = new google.maps.InfoWindow();
  const input = document.getElementById("searchBox");
  const searchBtn = document.getElementById("searchBtn");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  // Geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setCenter(userLoc);
        new google.maps.Marker({ map, position: userLoc, title: "You are here" });
      },
      () => console.warn("Geolocation denied, using default Oklahoma location.")
    );
  }

  // When user selects from autocomplete
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;
    map.setCenter(place.geometry.location);
    performSearch(place.formatted_address || place.name);
  });

  // Manual search
  searchBtn.addEventListener("click", () => {
    const query = input.value.trim();
    if (query) performSearch(query);
  });

  // Enter key
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch(input.value);
    }
  });

  // Default search
  performSearch("restaurants near me");
}

function performSearch(query) {
  const request = { query, fields: ["name", "geometry", "formatted_address", "rating", "opening_hours", "place_id"], };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, displayResults);
}

function displayResults(results, status) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  markers.forEach((m) => m.setMap(null));
  markers = [];

  if (status !== google.maps.places.PlacesServiceStatus.OK || !results) return;

  results.slice(0, 5).forEach((place, i) => {
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      label: `${i + 1}`,
      title: place.name,
      animation: google.maps.Animation.DROP,
    });
    markers.push(marker);

    const openStatus = place.opening_hours
      ? place.opening_hours.isOpen() ? `<span class="open">Open</span>` : `<span class="closed">Closed</span>`
      : `<span class="unknown">Unknown</span>`;

    const rating = place.rating
      ? `<span class="rating">⭐ ${place.rating.toFixed(1)}</span>`
      : "";

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${i + 1}. ${place.name}</h3>
      <p>${place.formatted_address}</p>
      <p>${rating} ${openStatus}</p>
    `;
    resultsDiv.appendChild(card);

    // Click / hover events
    card.addEventListener("mouseenter", () => marker.setAnimation(google.maps.Animation.BOUNCE));
    card.addEventListener("mouseleave", () => marker.setAnimation(null));
    card.addEventListener("click", () => {
      map.panTo(place.geometry.location);
      map.setZoom(15);
      infowindow.setContent(`<strong>${place.name}</strong><br>${place.formatted_address}`);
      infowindow.open(map, marker);
    });
  });
}
