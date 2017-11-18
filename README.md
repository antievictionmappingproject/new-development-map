# New Development Map JS

Code is also inline commented with further explanations

## Global Variables:

**mostRecent:** This is the date of the most recent 311 or eviction data point it is used to calculate the middle point so I can go backwards and forwards in time. If the data is updated please change this to match the most recent data point.

**sqlQuery311:** This is the sql command to get the table of data points from Carto

The globals for the block by block rent data are all from my attempts to get rent data.
Unfortunately, nothing I used seemed to work so most of this can be deleted.

**sqlQueryEvictData:** is the same as sqlQuery311 but for the eviction data

## Global Methods:

**Development class:** This is a class to hold all the info about each Development.
Doing it this way makes it MUCH easier to add a new Development to the map, all you have to do is construct it with:

  1. a name
  2. latitude and longitude
  3. the date is was built

and the Class will automatically do the calculations for lots of things including:

* constructing a leaflet marker for the development itself, labeled with the development name in a popup (Development.marker) that can be added to the leaflet map
* constructing a leaflet latLng object coresponding to the marker
* constructing a javascript Date() class for the date the development was built

* this class also has an associated method addBounds() that takes an array of points (these should define the bounds of a block radius)
 and then constructs and returns a polygon (filled red) that can be added to the map to define the radius around the Development

 **getColor():** This is intended to help with color grading the rent polygons when added the numbers and colors can be adjusted to change the scale and gradient.

 **style():** This is a helper function to style the rent polygons that uses the getColor helper.

 **markerOptions311** & **markerOptionsEvict** are helpers to style the associated data points

 **dateFilter():** helps determine if a data point from the Carto data should be added or not based on how much older or younger it is than the Development

 **add311():**
  takes 3 arguments
  1. the main map,
  2. a Development
  3. a boolean:
    `true`: to get the points AFTER the Development went in
    `false`: to get the points before

  This function gets the geoJSON data from CARTO and adds all the points to a leaflet `L.layerGroup()` everywhere they fall within the correct time and location range. Then it adds that layer group to the map using the Leaflet handling of JSON objects

  It uses to the SQL to only request the data within the bounds of the Development Class Object it was passed and then in the JSON request filters the returned JSON information using the `dateFilter()` helper from above.

  It also counts the number of 311 points and changes an html object with a specific class (equal to the string ``"#" + D.countName  + "311s"``) to the number of points.

  It then returns the layerGroup

  **addEvict():**
  takes the same 3 argumentsas `add311()`

  This function, in the same way as `add311()`, uses a custum SQL command to get the geoJSON data from CARTO on evictions. It adds all the information to a `L.geoJSON` leaflet layer

  It then uses the Leaflet method `pointToLayer()` and the `dateFilter()` helper to filter the geojson data by date

  For each data point that gets through the filter it then adds one to the count, creates a new `Latlng` object and adds it to an array

  If the array is empty (ie this is the first valid data point) it creates a new Marker and adds it to the map

  If not, it checks to see if any of the evictions in the array happened in the same place if not it adds it to the map,

  If there was already a data point in that location, it gets the marker with the same location (based on its popup string text) and increases the radius of the marker. Finally, it changes the marker's popup to note that there were multiple evictions at this location.

  The popups also include the type of eviction from the data and note if all the reoccurring evictions are the same type or not

  The function also counts the number of eviction points and changes an html object with a specific class (equal to the string ``"#" + D.countName  + "Evictions"``) to the number of points

  *Possible Bug: repeating data points might not be handled properly all the time but handles it most of the time*

  **addRent()**
  This was my ([remusofreem](https://github.com/remusofreem)) attempt to add rent data based on city blocks, this was by far the most challenging aspect of the project and unfortunately it became clear by the end of the summer that the solution I spent the most time on (using the ZillowApi) was not fit for the task

  At some future point we need to find rent data to implement. My best hope would be gross rent data that is based on some city unit small enough to fit in the map. Then we could get  geoJSON data from the city for polygons of that unit's size, which can we can import to CARTO. After that, it wouldn't be hard for me to then add them to the map using Leaflet's `onEachFeature` handling of geojson data to color each polygon based on the rent data and some gradient.

  **timeHelper()**:
  this is a helper for the HTML that lets it switch between displaying data before and after the development went in.
