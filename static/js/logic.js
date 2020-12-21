// Create Map
var myMap = L.map("map", {
    center: [40, -100],
    zoom: 4
});
var legend = L.control({position: 'bottomright'})


// Tile Layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

function getColor(d) {
    return  d > 500 ? '#9e0142':
            d > 100 ? '#d53e4f':
            d > 50  ? '#f46d43':
            d > 25  ? '#fdae61':
            d > 15  ? '#fee08b':
            d > 10  ? '#e6f598':
            d > 8   ? '#abdda4':
            d > 5   ? '#66c2a5':
            d > 2   ? '#3288bd':
                      '#5e4fa2';
}



link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

d3.json(link, function(data) {
    console.log(data.features)

    for (i=0; i<data.features.length; i++) {
        var d=data.features[i]
        var loc = d.geometry.coordinates
        var mag = d.properties.mag
        var place = d.properties.place
        var dt = d.properties.time
        var date = new Date(dt).toLocaleDateString('en-US')
        var time = new Date(dt).toLocaleTimeString('en-US')
        // console.log(loc[2])

        var color = getColor(loc[2])
        L.circle([loc[1], loc[0]], {
            color: 'black',
            fillColor: color,
            weight: .4,
            fillOpacity: 0.7,
            radius: 5000*mag**2
            // onEachFeature: onFeature()
        }).bindPopup('Magnitude: '+ mag + '<br> Depth: ' + loc[2] + ' miles<br>Location: ' + place + '<br>Time: ' + date + ' ' + time).addTo(myMap);
    }

})


legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1, 2, 5, 8, 10, 15, 25, 50, 100, 500],
        labels = []
        div.innerHTML += '    Depth (km)<br>'

    for (var i=0; i <grades.length; i++) {
        if (i==0) {
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' + '< 2 <br>'
        } else {
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '  <br>': '+ ') 
        }
    }
    return div
}
legend.addTo(myMap);