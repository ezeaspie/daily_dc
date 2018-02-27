# daily_dc
Web app to get current weather, 5 day forecast, and metro bus times

Next steps:

1. Intergrate the Geolocation function to the metrobus location api. DONE
2. On click of the list item, get the stopID and fetch the bus prediction data. DONE
3. Show the weather and stuff - probably upon Geolocation.
4. Consider Map Coordinate implementation for the stops list - in case someone is new to metro or DC.
  4.1. Create a Map with all bus stop positions.
  4.2. On click of a map, bring up a textbox giving info on that stop. (Routes, name, id, etc.)

5. Store the stopID in local storage and write logic that shows a list if the user never gave a location.
6. Add an option to search again / insert own coordinates / select from map (since metroAPI can't take anything but coords.)
