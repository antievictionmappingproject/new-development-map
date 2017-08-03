//evicton data in carto \/
//all_sf_evictons CARTO


//class declaration for each development
class Development {
  constructor(name, x, y, date) {
    this.name = name;
    this.latLng = L.latLng(x, y);
    this.marker = L.marker(this.latLng).bindPopup(this.name);
    this.date = new Date(date);
    this.group311;
    this.groupEvictData;
    this.countName = name.substring(0, 4).toLowerCase();
  }
  //function that allows for the constuction of the 1 block radius within the Development Class object
  addBounds(array){
    this.bounds = L.latLngBounds(array);
    this.radius = L.polygon(array, {color: 'red'});
    return this.radius;
  }
}
//globals for the 311 GeoJSON/Carto process MUST ADD ADJOINING DATA!
var sqlQuery311 = "SELECT * FROM table_311_cases_grafiti"//"SELECT * FROM table_311_cases_graffitti_mission_2015_ WHERE latitude < 37.758387 AND longitude > -122.423573 AND latitude > 37.753992 AND longitude < -122.416425";
var threeOneOneData = null;
//var threeOneOneDataPoints = L.featureGroup;

//globals for the block by block gross rent data
var sqlQueryGrossRent = "SELECT * FROM block_census_gross_rent_data_joined_ WHERE stfid = 060750207002 OR stfid = 060750208003 OR stfid = 060750208002 OR stfid = 060750228013 OR stfid = 060750207003 OR stfid = 060750228031 OR stfid = 060750210001 OR stfid = 060750209004 OR stfid = 060750209001 OR stfid = 060750208004 OR stfid = 060750201003 OR stfid = 060750201002 OR stfid = 060750202002 OR stfid = 060750202003 OR stfid = 060750201004 OR stfid = 060750208001 OR stfid = 060750177002 OR stfid = 060750228011"
var grossRentData = null;

//globals for the Eviction data
var sqlQueryEvictData = "SELECT * FROM all_sf_evictions all_sf_evictions_2017"
var evictionData = null;
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
//markerOptions for points
var markerOptions311 = {
    radius: 1,
    color: 'blue'
};
var markerOptionsEvict = {
    radius: 1,
    color: 'red'
};
//filter that compares a GeoJSON feature's opened date to the date of the current Development
function dateFilter(v, D, after){
  var mostRecent = new Date("7/16/2017  12:59:57 AM"); //most recent data point update if u update the 311 data
  var diff = mostRecent - D.date;
  if(after){
    var temp = new Date(D.date.valueOf() + diff); //creates a dif year date variable
    if(D.date < v  && v < temp) {
      return true;
    }
  }else{
    var temp = new Date(D.date.valueOf() - diff); //creates a diff year date variable
    //console.log(temp);
    if(D.date > v && v > temp){
       return true;
     }
  }
}

//311 caller
function add311(mymap, D, after){
    var newGroup = L.layerGroup();
    var dotCount = 0; //counter for how many 311 reports fit
    //creates new sqlQuery for the bounds of the current Development
    var sqlQuery = sqlQuery311 + " WHERE latitude < " + D.bounds.getNorthWest().lat + " AND longitude > " + D.bounds.getNorthWest().lng + " AND latitude > " + D.bounds.getSouthEast().lat + " AND longitude < " + D.bounds.getSouthEast().lng;
    //requests the GeoJSON file from Carto
    $.getJSON("https://ampitup.carto.com/api/v2/sql?format=GeoJSON&q=" + sqlQuery, function(data)  {
      threeOneOneData = L.geoJson(data,{ //makes a new layer and assigns the GeoJSON file to it.
        pointToLayer: function (feature, layer) {
            //adds a circleMarker at each lat and lang of the 311 dataset
            var date = new Date(feature.properties.opened);
            if(dateFilter(date, D, after)){
              //console.log(true);
              dotCount++;
              var newCircleMarker = L.circleMarker([feature.properties.latitude, feature.properties.longitude], markerOptions311).bindPopup(date.toDateString());
              newGroup.addLayer(newCircleMarker);
              return  newCircleMarker;
            }
        }
      }).addTo(mymap);
      $("#" + D.countName  + "311s").html(dotCount);
    })
    return newGroup;
}
//add eviction points
function addEvict(mymap, D, after){
    var newGroup = L.layerGroup();
    var dotCount = 0; //counter for how many eviction reports fit
    //var repeatedMap = new Map; //to contain the repeated values
    var arr = [""];
    //creates new sqlQuery for the bounds of the current Development
    var sqlQuery = sqlQueryEvictData + " WHERE latitude < " + D.bounds.getNorthWest().lat + " AND longitude > " + D.bounds.getNorthWest().lng + " AND latitude > " + D.bounds.getSouthEast().lat + " AND longitude < " + D.bounds.getSouthEast().lng;
    //requests the GeoJSON file from Carto
    $.getJSON("https://ampitup.carto.com/api/v2/sql?format=GeoJSON&q=" + sqlQuery, function(data)  {
      evictionData = L.geoJson(data,{ //makes a new layer and assigns the GeoJSON file to it.
        pointToLayer: function (feature, layer) {
            //adds a circleMarker at each lat and lang of the 311 dataset
            var date = new Date(feature.properties.date); //creates a new date object matching the date of the current feature

            if(dateFilter(date, D, after)){ //if it fits the date (before/after)
              dotCount++; //adds one to the dot count | Its a hit!
              var newLatLng = L.latLng(feature.properties.latitude, feature.properties.longitude); //creates a new latLng obj from feature prop
              var popString = date.toDateString() + ": " + feature.properties.type;
              console.log(newLatLng.toString() + ", " + dotCount);
              var arr = newGroup.getLayers();
              if(arr.length == 0){
                var newCircleMarker = L.circleMarker(newLatLng, markerOptionsEvict).bindPopup(popString);
                newGroup.addLayer(newCircleMarker);
                return  newCircleMarker;
              }
              for (var i = 0; i < arr.length ; i++){ //checks to make sure that no points have same latLng
                if( !newLatLng.equals( arr[i].getLatLng() ) ){
                  var newCircleMarker = L.circleMarker(newLatLng, markerOptionsEvict).bindPopup(popString); //creates new point
                  newGroup.addLayer(newCircleMarker); //adds point to group
                  return  newCircleMarker; //adds point to map
                }else{ //if the new point matches the latLng of an old point
                  var oldPop = arr[i]._popup.getContent(); //gets the popup string attached to the marker
                  if (oldPop == popString){ //if the strings are the same adds "2x" to the end of the string
                    arr[i]._popup.setContent(oldPop + "2x");
                  }else if( oldPop[oldPop.length-1] == "x"){ //keeps adding to the x num if they are the same
                    var exNum =  parseInt(oldPop[oldPop.length -2]) + 1;
                    arr[i]._popup.setContent( oldPop.substring(0, oldPop.length-3) + " " + exNum + "x");
                  }else{ //if the strings are diffent concatenates them
                    arr[i]._popup.setContent(oldPop + " | " + popString);
                  }
                  var rad = arr[i].getRadius(); //increases the radius of the point by 5px
                  arr[i].setRadius(rad+5);
                }
            }
          }
        }
      }).addTo(mymap);
      $("#" + D.countName + "Evictions").html(dotCount);
    });
    console.log(newGroup);
    return newGroup;
}
//gross rent block caller
function addGrossRent(mymap){
    $.getJSON("https://ampitup.carto.com/api/v2/sql?format=GeoJSON&q=" + sqlQueryGrossRent, function(data)  {
      grossRentData = L.geoJson(data,{
        style: style,
        onEachFeature: function (feature, layer) {
          //this.bindPopup(feature.properties.right_estimate_total);
        }
      }).addTo(mymap);

    });
}
//updates the map on slider click
function timeHelper(map, D, after){ //a leaflet map, a Development object, a true false of wheter to get data from AFTER the dev's date or not
  D.group311.eachLayer(function (layer) {
      map.removeLayer(layer);
  });
  D.groupEvictData.eachLayer(function (layer){
    map.removeLayer(layer);
  });
  D.group311= add311(map, D, after);
  D.groupEvictData = addEvict(map, D , after);
}


//runs when html is loaded
$(document).ready(function(){

  //creates map
  var mymap = L.map('mapid').setView([37.759822, -122.414808/*37.766625, -122.440126*/], 14);

  //adds carto base layer to the map
  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a> | <a href="http://www.antievictionmap.com/">Anti-Eviction Mapping Project</a>'
  }).addTo(mymap);

  //creates & adds the Developments
  const Vida = new Development("Vida Condos", 37.755816, -122.419749, "2015 JAN" );
  Vida.marker.addTo(mymap);

  const Vara = new Development("Vara Apartments", 37.767121, -122.420550, "11/4/2014");
  Vara.marker.addTo(mymap);

  //const Valencia = new Development("Valencia Apartments", 37.766292, -122.421816, "OCT 16, 2012, 2:00PM")
  //Valencia.marker.addTo(mymap);
  //this Development is way to new!
  // var SixHundred_VN = new Development("600 South Van Ness", 37.763367, -122.417670, "2015 JAN");
  // SixHundred_VN.marker.addTo(mymap);

  //adds the radii (1 block square)
  var rad_vida_apt = [[37.758387, -122.423573],[37.758780, -122.416922],[37.753992, -122.416425],[  37.753599, -122.423011]];
  Vida.addBounds(rad_vida_apt).addTo(mymap);

  var rad_vara_apt = [[37.769722, -122.424578],[37.764790, -122.424113],[37.765201, -122.417518],[37.769593, -122.417856], [37.769983, -122.420374]];
  Vara.addBounds(rad_vara_apt).addTo(mymap);

  //var rad_valencia_apt = [[37.768044, -122.424439],[37.768434, -122.417851],[37.763566, -122.417422], [37.763209, -122.423988]];
  //Valencia.addBounds(rad_valencia_apt).addTo(mymap);

  //this Development is way to new!
  // var rad_sixHundred_VN = [[37.764920, -122.421925],[37.765323, -122.415367],[37.760502, -122.414882],[37.760119, -122.421466]];
  // var sixHundred_VN_polygon = L.polygon(rad_sixHundred_VN, {color: 'red'}).addTo(mymap);

  //adds the 311s
  mymap.spin(true); //starts loading symbol
  Vida.group311= add311(mymap, Vida, true);
  Vara.group311 = add311(mymap, Vara, true);

  //Valencia.group311 = add311(mymap, Valencia, true);

  //adds the blocks / gross rent data
  addGrossRent(mymap);

  //adds the eviction data
  Vida.groupEvictData= addEvict(mymap, Vida, true);
  Vara.groupEvictData = addEvict(mymap, Vara, true);
  mymap.spin(false);
  //adds event listners on the zoom buttons
  $("#vida_button").click(function() {
      mymap.flyTo(Vida.latLng, 16);
  });
  $("#vara_button").click(function() {
      mymap.flyTo(Vara.latLng, 16);
  });
  // $("#shvn_button").click(function() {
  //     mymap.flyTo(SixHundred_VN.latLng, 16);
  // });
  //adds event listners for slider
  $(".slider").click(function(){
      mymap.spin(true);
      if($('#timebox').is(':checked')){
        $(".yearSpan").html("Since");
        $("#after").css( "font-weight", "bold" );
        $("#before").css( "font-weight", "normal" );
        timeHelper(mymap, Vida, true);
        timeHelper(mymap, Vara, true);
      }else{
        $(".yearSpan").html("Before");
        $("#before").css( "font-weight", "bold" );
        $("#after").css( "font-weight", "normal" );
        timeHelper(mymap, Vida, false);
        timeHelper(mymap, Vara, false);
      }
      mymap.spin(false);
  })
});
