

export default class CatastroParser {
  constructor(){
    this.catParcelUrl = "https://crossorigin.me/http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=wfs&version=2&request=getfeature&STOREDQUERIE_ID=GetParcel&srsname=EPSG:4326&REFCAT="
  }

  getParcel(refcat){
    return new Promise((resolve, reject) => {

      $.get(this.catParcelUrl + refcat, function(xmlDoc, status){
        var PolygonPatch = xmlDoc.getElementsByTagName("PolygonPatch")[0]
        var Exterior = PolygonPatch.getElementsByTagName("exterior")
        var interior = PolygonPatch.getElementsByTagName("interior")

        for (var ext of Exterior){
          var array = ext.getElementsByTagName("posList")[0].childNodes[0].nodeValue.trim().split(" ")
          var i = 0
          var points = []
          for (var a of Array(array.length / 2)){
            points.push([array[i + 1], array[i]])
            i = i + 2
          }
          var coordinates = [points] 
        }
        var geojsonFeature = {
          "type": "Feature",
          "properties": {
            "name": "Coors Field",
            "amenity": "Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
          },
          "geometry": {
          "type": "Polygon",
          "coordinates": coordinates
          }
        }
        resolve( geojsonFeature )  
      })
    })
  }
}