//globals for the 311 GeoJSON/Carto process
var sqlQuery311 = "SELECT * FROM table_311_cases_graffitti_mission_2015_ WHERE latitude < 37.758387 AND longitude > -122.423573 AND latitude > 37.753992 AND longitude < -122.416425";
var threeOneOneData = null;
//311 caller
function add311(mymap){
    mymap.spin(true); //starts the load spinner
    //requests the GeoJSON file from Carto
    $.getJSON("https://ampitup.carto.com/api/v2/sql?format=GeoJSON&q=" + sqlQuery311, function(data)  {
    threeOneOneData = L.geoJson(data,{ //makes a new layer and assigns the GeoJSON file to it.
      onEachFeature: function (feature, layer) {
          //adds a maker at each lat and lang of the 311 dataset
          var new311point = L.marker([feature.properties.latitude, feature.properties.longitude]/*, {icon: xIcon}*/)//.bindPopup(feature.properties.opened);

          return new311point
      }
    }).addTo(mymap);

    }).done(function() {
      //ends the load spinner
      mymap.spin(false);
    });
}

//runs when html is loaded
$(document).ready(function(){

  //creates map
  var mymap = L.map('mapid').setView([37.766625, -122.440126], 12);

  //adds carto base layer to the map
  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a> | <a href="http://www.antievictionmap.com/">Anti-Eviction Mapping Project</a>'
  }).addTo(mymap);

  //adds the development markers
  var vida_apt = L.marker([37.755816,-122.419749]).addTo(mymap);

  //adds the radii (1 block square)
  var rad_vida_apt = [[37.758387, -122.423573],[37.758780, -122.416922],[37.753992, -122.416425],[  37.753599, -122.423011]];
  var vida_apt_polygon = L.polygon(rad_vida_apt, {color: 'red'}).addTo(mymap);

  //adds the 311s
  add311(mymap)

  //adds event listners on the zoom buttons
  $("#vida_button").click(function() {
      mymap.flyTo([37.755816,-122.419749], 16);
  });
});
