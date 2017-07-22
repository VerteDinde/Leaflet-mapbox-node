/* global L */
const leaflet = require('leaflet');

const dataUrl = '' // geojson data

const latlong = [45.5269699, -122.6781517];
const map = L.map('map').setView(latlong, 8);

const tilesTerrain = L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function setIconColor(color) {
  return new L.Icon({
    iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

// scenic viewpoints
const scenicJSON = 'https://opendata.arcgis.com/datasets/4e8eaa8bf9c94a3ebd746a5b5fb62f02_171.geojson';

// layers
const addLayer = (features) => {
  return window.L.geoJSON(features, {
    pointToLayer: function (feature, latlng) {
      switch (feature.properties.Subtype) {
        case 'Panorama': return L.marker(latlng, { icon: setIconColor('violet') });
        case 'View of Bridges': return L.marker(latlng, { icon: setIconColor('green') });
        case 'View of Mountains': return L.marker(latlng, { icon: setIconColor('red') });
        default: return L.marker(latlng, { icon: setIconColor('orange') });
      }

    }
  }).addTo(map);
};

// Set view now that everything is ready.
map.setView(latlong, 13);

$.getJSON(scenicJSON, function (data) {
  const subtypes = {};
  data.features.forEach(feature => {
    let subtypeName = feature.properties.Subtype;
    if (!subtypes[feature.properties.Subtype]) {
      subtypes[feature.properties.Subtype] = [];
    }
    subtypes[feature.properties.Subtype].push(feature);
  });
  const layers = {};
  for (var prop in subtypes) {
    layers[prop] = (addLayer(subtypes[prop]));
  }
  console.log(layers);
  L.control.layers(null, layers).addTo(map);
  console.log(subtypes);
});