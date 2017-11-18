# New Development Map JS

Code is also inline commented with further explanations

## Global Variables:

**mostRecent:** this is the date of the most recent 311 datapoint or eviction it is used to calculate the middle point so I can go backwards and forwards in time

**sqlQuery311:** this is the sql command to get the table of datapoints from Carto

the globals for the block by block rent data are all from my attempts to get rent data
unfortunatley nothing I used seemed to work so most of this can be deleted

**sqlQueryEvictData:** is the same as sqlQuery311 but for the eviction data

## Global Methods:

**Development class:** this is a class to hold all the info about each Development
this makes it MUCH easier to add a new Development to the map all you have to do is construct it with
a name, latitude and longitude and the date is was built and it will automatically do the math for lots of things including:
* constructing a leaflet marker with its name in a popup (Development.marker) that can be added right away
* constructing a leaflet latLng object coresponding to it
* constructing a javascript Date() class for the date it went it

* this class also has an associated method addBounds() that takes an array of points (these should define the bounds of a block radius)
 that then constructs and returns a polygon filled red that can be added to the map to define the radius around the Development

 **getColor():** this is intended to help with color grading the rent polygons when added the numbers and colors can be adjusted to change the scale and gradient

 **style():** this is a helper function to style the rent polygons that uses the getColor helper

 **markerOptions311** & **markerOptionsEvict** are helpers to style the associated data points

 **dateFilter():** helps determine if a datapoint from the Carta data should be added or not based on how much older or younger it is than the Development

 **add311():**
  takes 3 arguments
  1. the main map,
  2. a Development
  3. a boolean:
    true: if it wants the points AFTER the Development went in
    false if it wants the points before
  this function gets the geoJSON data from CARTO and adds all the points to a leaflet L.layerGroup() everywhere to the map where they fall within the correct time and location range then adds that layer group to the map using the Leaflet handling of JSON objects

  it uses to the SQL to only request the data within the bounds of the Development Class Object it was passed and then in the JSON request filters the returned JSON information using the dateFilter() helper from above

  it also counts the number of 311 points and changes an html object with a specific class (equal to the string "#" + D.countName  + "311s") to the number of points

  it then returns the layerGroup





  *Possible Bug: repeating data points might not be handled properly*
