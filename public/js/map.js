// map.js
document.addEventListener('DOMContentLoaded', function() {
  // mapTilerKey and listing coordinates will be provided by EJS
  const apiKey = window.mapTilerKey;  // we will define this in EJS
  const coordinates = window.listingCoordinates;

  const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
    center: coordinates,
    zoom: 12
  });

  // Create a custom marker element
const el = document.createElement('div');
el.className = 'custom-marker';

  new maplibregl.Marker({color:"red"})
    .setLngLat(coordinates)
    .setPopup(new maplibregl.Popup().setText(window.listingTitle))
    .addTo(map);
});
