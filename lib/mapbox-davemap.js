/* global mapboxgl */

mapboxgl.accessToken = 'pk.eyJ1Ijoia2VlbGV5IiwiYSI6ImNqNWl3cXc4cDFscHUzM3BndDBzZ3luc3cifQ.aa6S1bxIdDR6zGFlCrF1pQ';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-122.6782433, 45.5252814],
  zoom: 8
});

map.on('load', function () {
  map.addSource("hiking-data", {
    "type": "geojson",
    "data": "https://cdn.glitch.com/655d8e0d-cbec-4a04-96b8-5b6706cc2a3a%2Fdavetrailmap.geojson?1501115059372"
  })

  map.addLayer({
    "id": "hike-keeley",
    "type": "line",
    "source": "hiking-data",
    "paint": {
      "line-color": "orange",
      "line-width": 2
    },
    "filter": ["==", "hike_type", "Hiked with Keeley"]
  })

  map.addLayer({
    "id": "hike-alone",
    "type": "line",
    "source": "hiking-data",
    "paint": {
      "line-color": "red",
      "line-width": 2
    },
    "filter": ["==", "hike_type", "Hiked Alone"]
  })

  map.addLayer({
    "id": "hike-with-friends",
    "type": "line",
    "source": "hiking-data",
    "paint": {
      "line-color": "yellow",
      "line-width": 2
    },
    "filter": ["==", "hike_type", "Hiked with Friends"]
  })

  map.addLayer({
    "id": "bike",
    "type": "line",
    "source": "hiking-data",
    "paint": {
      "line-color": "blue",
      "line-width": 2
    },
    "filter": ["==", "hike_type", "Biked"]
  })

  map.on('click', 'hike-keeley', function (e) {
    new mapboxgl.Popup()
      .setLngLat(e.features[0].geometry.coordinates)
      .setHTML(e.features[0].properties.hike_type)
      .addTo(map);
  })

});

const toggleableLayerIds = ['hike-keeley', 'hike-alone', 'hike-with-friends', 'bike'];

for (let i = 0; i < toggleableLayerIds.length; i++) {
  let id = toggleableLayerIds[i];

  let link = document.createElement('a');
  link.href = '#';
  link.className = 'active';
  link.textContent = id;

  link.onclick = function (e) {
    let clickedLayer = this.textContent;
    e.preventDefault();
    e.stopPropagation();

    let visibility = map.getLayoutProperty(clickedLayer, 'visibility');

    if (visibility === 'visible') {
      map.setLayoutProperty(clickedLayer, 'visibility', 'none');
      this.className = '';
    } else {
      this.className = 'active';
      map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
    }
  };

  let layers = document.getElementById('menu');
  layers.appendChild(link);
}