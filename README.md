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

  this function gets the geoJSON data from CARTO and adds all the points to a leaflet L.layerGroup() everywhere they fall within the correct time and location range then adds that layer group to the map using the Leaflet handling of JSON objects

  it uses to the SQL to only request the data within the bounds of the Development Class Object it was passed and then in the JSON request filters the returned JSON information using the dateFilter() helper from above

  it also counts the number of 311 points and changes an html object with a specific class (equal to the string "#" + D.countName  + "311s") to the number of points

  it then returns the layerGroup

  **addEvict():**
  takes the same 3 argumentsas add311()

  this function in the same way as add311() uses a custum SQL command to gets the geoJSON data from CARTO on evictions. It adds all the infotmation to a L.geoJSON leaflet layer

  it then uses the Leaflet method pointToLayer and the dateFilter helper to filter the geojson data by date

  for each data point that gets through the filter it then adds one to the count, creates a new Latlng object and adds it to an array

  if the array is empty (ie this is the first valid data point) it creates a new Marker and adds it to the map

  if not, it checks to see if any of the evictions in the array happened in the same place if not it adds it to the map,

  if there was already a data point in that location it gets the marker with the same data point, based on its popup string text and increases the radius of the marker and changes its popup to not that there were multiple evictions.

  The popups also include the type of eviction from the data and note if all the reoccuring evictions are the same type or not

  it also counts the number of eviction points and changes an html object with a specific class (equal to the string "#" + D.countName  + "Evictions") to the number of points

  *Possible Bug: repeating data points might not be handled properly all the time but handles it most of the time*

  **addRent()**
  this was my ( (https://github.com/remusofreem "remusofreem") ) attempt to add rent data based on city blocks, this was by far the most challenging aspect of the project and unfortunatley it became clear by the end of the summer that the solution I spent the most time on (using the ZillowApi) was not fit for the task

  At some future point we need to find rent data to implement. My best hope would be gross rent by some city geJSON data which can we can import to CARTO and then add to the map using Leaflet's onEachFeature handling of geojson data to color each piece based on rent and some gradient.

  **timeHelper()**:
  this is a helper for the HTML that lets it swtich between displaying data before and after the development went in.
