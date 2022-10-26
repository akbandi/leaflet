console.log("hello");


// IMPORTANT: Now, choose which of these two endpoints to use! 
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; 

d3.json(url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    //console.log(data); 
   createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Function to Determine Size of Marker Based on the Magnitude of the Earthquake
    function markerSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 5;
    }
    
    // To determine the color based on magnitude of earthquake
    function chooseColor(magnitude) {
        switch (true) {
         case magnitude > 90:
            return "red";
        case magnitude > 70:
            return "orange";
        case magnitude > 50:
            return "gold";
        case magnitude > 30:
            return "yellow";
        case magnitude > 10:
            return "green";
        default:
            return "lightgreen";
        }
    }
    
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, layer) {
            return L.circleMarker(layer);
        },
        style: styleInfo,
        onEachFeature: onEachFeature
    });
  
    // Send our earthquakes layer to the createMap function
    createMap(earthquakes);
}
  
function createMap(earthquakes) {
  
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
}  
  