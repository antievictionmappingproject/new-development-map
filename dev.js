//globals for the 311 GeoJSON/Carto process MUST ADD ADJOINING DATA!
var sqlQuery311 = "SELECT * FROM table_311_cases_graffitti_mission_2015_ WHERE latitude < 37.758387 AND longitude > -122.423573 AND latitude > 37.753992 AND longitude < -122.416425";
var threeOneOneData = null;
//var threeOneOneDataPoints = L.featureGroup;

//globals for the block by block gross rent data
var sqlQueryGrossRent = "SELECT * FROM block_census_gross_rent_data_joined_ WHERE stfid = 060750207002 OR stfid = 060750208003 OR stfid = 060750208002 OR stfid = 060750228013 OR stfid = 060750207003 OR stfid = 060750228031 OR stfid = 060750210001 OR stfid = 060750209004 OR stfid = 060750209001 OR stfid = 060750208004"
var grossRentData = null;

//gets color for the rent #
function getColor(d) {
    //takes in rent data and returns a color for the plot
    return d > 2500 ? '#800026' :
           d > 2000 ? '#bd0026' :
           d > 1500 ? '#e31a1c' :
           d > 1000 ? '#fc4e2a' :
           d > 500  ? '#fd8d3c' :
           d > 100  ? '#feb24c' :
           d > 50   ? '#fed976' :
           d > 20   ? '#ffeda0' :
           d > 10   ? '#ffffcc' :
                      '#FFEDA0';
}
//styler for the rent data
function style(feature) {
    return {
        fillColor: getColor(feature.properties.right_estimate_total),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}
//markerOptions for 311 points
var markerOptions311 = {
    radius: 2,
    color: 'red'
};
//311 caller
function add311(mymap){
    mymap.spin(true); //starts the load spinner
    //requests the GeoJSON file from Carto
    $.getJSON("https://ampitup.carto.com/api/v2/sql?format=GeoJSON&q=" + sqlQuery311, function(data)  {
      threeOneOneData = L.geoJson(data,{ //makes a new layer and assigns the GeoJSON file to it.
        pointToLayer: function (feature, layer) {
            //adds a maker at each lat and lang of the 311 dataset
            return L.circleMarker([feature.properties.latitude, feature.properties.longitude], markerOptions311);//.bindPopup();
            // new311point.bindPopup(feature.properties.opened)
            // new311point.setIcon(xIcon)
        }
      }).addTo(mymap);

    }).done(function() {
      //ends the load spinner
      mymap.spin(false);
    });
}
//gross rent block caller
function addGrossRent(mymap){
    mymap.spin(true); //starts the load spinner
    //requests the GeoJSON file from Carto
    $.getJSON("https://ampitup.carto.com/api/v2/sql?format=GeoJSON&q=" + sqlQueryGrossRent, function(data)  {
      grossRentData = L.geoJson(data,{
        style: style,
        // onEachFeature: function (feature, layer) {
        //   console.log(feature.properties.right_estimate_total)
        // }
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
  add311(mymap);

  //adds the blocks / gross rent data
  addGrossRent(mymap);

  //adds event listners on the zoom buttons
  $("#vida_button").click(function() {
      mymap.flyTo([37.755816,-122.419749], 16);
  });
});
