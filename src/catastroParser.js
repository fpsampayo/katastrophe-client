/*
import Jsonix from '@boundlessgeo/jsonix'
import XLink_1_0 from 'w3c-schemas'
import XSD_1_0 from 'w3c-schemas'
import OWS_1_1_0 from 'w3c-schemas'
import WFS_2_0 from 'ogc-schemas'
import GML_3_2_1 from 'ogc-schemas'
import ISO19139_GMD_20070417 from 'ogc-schemas'
import Filter_2_0 from 'ogc-schemas'
import net_opengis_gml__3 from '../jsonix/tmp/mapping/net_opengis_gml__3'
import org_isotc211__2005_gmd from '../jsonix/tmp/mapping/org_isotc211__2005_gmd'
import org_w3__1999_xlink from '../jsonix/tmp/mapping/org_w3__1999_xlink'
*/

/*
console.log(Jsonix.Jsonix)

const context = new Jsonix.Jsonix.Context(
  [
    GML_3_2_1,
    net_opengis_gml__3,
    org_isotc211__2005_gmd,
    org_w3__1999_xlink
  ]
)

const unmarshaller = context.createUnmarshaller()

unmarshaller.unmarshalURL("https://crossorigin.me/http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=wfs&version=2&request=getfeature&STOREDQUERIE_ID=GetParcel&REFCAT=36055A01000100&srsname=EPSG:25829",
  function (data)	{
	var objectFromURL = data
    console.log(objectFromURL)
  })
*/

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