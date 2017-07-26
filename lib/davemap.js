/* global L */

// geojson data
const scenicJSON = 'https://cdn.glitch.com/655d8e0d-cbec-4a04-96b8-5b6706cc2a3a%2Fdavetrailmap.geojson?1501043424261';

var latlong = [45.5269699,-122.6781517]
var map = L.map('map').setView(latlong, 8)

var tilesTerrain = L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

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

//iterate through data for layer labels/colors
const addLayer = (features) => {
  return window.L.geoJSON(features, {
    pointToLayer: function (feature, latlng) {
          switch (feature.properties.hike_type) {
              case 'Hiked Alone': return L.marker(latlng, {icon: setIconColor('orange')});
              case 'Hiked with Keeley': return L.marker(latlng, {icon: setIconColor('red')});
              case 'Hiked with Friends': return L.marker(latlng, {icon: setIconColor('yellow')});
              case 'Biked': return L.marker(latlng, {icon: setIconColor('blue')});
              default: return L.marker(latlng, {icon: setIconColor('green')});
          }
        
    },
    onEachFeature: onEachFeature
  }).addTo(map);
}

// Set view now that everything is ready.
map.setView(latlong, 13)

// generate layers by { hike_type }
$.getJSON(scenicJSON, function(data)  {
  const hiketypes = {};
  data.features.forEach(feature => {
    var subtypeName = feature.properties.hike_type;
    if (!hiketypes[feature.properties.hike_type]) {
      hiketypes[feature.properties.hike_type] = [];
    }
    hiketypes[feature.properties.hike_type].push(feature);
  })
  const layers = {};
  for (let prop in hiketypes) {
    layers[prop] = (addLayer(hiketypes[prop]));
  }
  console.log(layers);
  L.control.layers(null, layers).addTo(map);
  console.log(hiketypes)
})

// Adds trail or viewpoint's name on hover and click
function onEachFeature (feature, layer) {
  layer.on({
    click: layer.bindPopup(`
      <h3>${feature.properties.name}</h3>
        <p>${feature.properties.hike_type}</p>
    `)
  })
}
