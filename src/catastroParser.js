

export default class CatastroParser {
  constructor(){
    this.catParcelUrl = "https://crossorigin.me/http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=wfs&version=2&request=getfeature&STOREDQUERIE_ID=GetParcel&srsname=EPSG:4326&REFCAT="
  }

  getParcel(refcat){
    return new Promise((resolve, reject) => {

      $.get(this.catParcelUrl + refcat, function(xmlDoc, status){

        /* Attributes */
        var refcat = xmlDoc.getElementsByTagName("nationalCadastralReference")[0].childNodes[0].nodeValue
        var area = xmlDoc.getElementsByTagName("areaValue")[0].childNodes[0].nodeValue

        /* Geometries */
        var PolygonPatch = xmlDoc.getElementsByTagName("PolygonPatch")

        var coordinates = []

        for (var polygon of PolygonPatch) {
          var exterior = polygon.getElementsByTagName("exterior")
          var interior = polygon.getElementsByTagName("interior")

          for (var ext of exterior){
            var array = ext.getElementsByTagName("posList")[0].childNodes[0].nodeValue.trim().split(" ")
            var i = 0
            var points = []
            for (var a of Array(array.length / 2)){
              points.push([array[i + 1], array[i]])
              i = i + 2
            }
            coordinates.push([points])
          }

          for (var ext of interior){
            var array = ext.getElementsByTagName("posList")[0].childNodes[0].nodeValue.trim().split(" ")
            var i = 0
            var points = []
            for (var a of Array(array.length / 2)){
              points.push([array[i + 1], array[i]])
              i = i + 2
            }
            coordinates.push([points])
          }
        }
        
        var geojsonFeature = {
          "type": "Feature",
          "properties": {
            "refcat": refcat,
            "area": area
          },
          "geometry": {
          "type": "MultiPolygon",
          "coordinates": coordinates
          }
        }
        resolve( geojsonFeature )  
      })
    })
  }
}