

export default class CatastroParser {
  constructor(){
    this.catParcelUrl = "https://crossorigin.me/http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=wfs&version=2&request=getfeature&STOREDQUERIE_ID=GetParcel&srsname=EPSG:4326&REFCAT="
    this.catInfoXYUrl = "https://crossorigin.me/http://ovc.catastro.meh.es//ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_RCCOOR?"
    this.catInfoRefcatUrl = "https://crossorigin.me/http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/Consulta_DNPRC_Codigos?"
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

  _getRefCatXY(srs, x, y){
    return new Promise((resolve, reject) => {
      $.get(
        this.catInfoXYUrl, 
        {
          'SRS': srs,
          'Coordenada_X': x,
          'Coordenada_Y': y
        },
        function(xmlDoc, status){
          var pcat1 = xmlDoc.getElementsByTagName("pc1")[0].childNodes[0].nodeValue
          var pcat2 = xmlDoc.getElementsByTagName("pc2")[0].childNodes[0].nodeValue

          var json = {'refcat': pcat1 + pcat2}

          resolve( json )
        }
      )
    }
  )}

  getInfoRefCat(codProv, codMun, codMunIne, refcat) {
    return new Promise((resolve, reject) => {
      $.get(
        this.catInfoRefcatUrl,
        {
          'CodigoProvincia': codProv,
          'CodigoMunicipio': codMun,
          'CodigoMunicipioINE': codMunIne,
          'RC': refcat
        },
        function(xmlDoc, status){
          var pc1 = xmlDoc.getElementsByTagName("pc1")[0].childNodes[0].nodeValue
          var pc2 = xmlDoc.getElementsByTagName("pc2")[0].childNodes[0].nodeValue
          var prov = xmlDoc.getElementsByTagName("cp")[0].childNodes[0].nodeValue
          var provName = xmlDoc.getElementsByTagName("np")[0].childNodes[0].nodeValue
          var muni = xmlDoc.getElementsByTagName("cm")[0].childNodes[0].nodeValue
          var muniName = xmlDoc.getElementsByTagName("nm")[0].childNodes[0].nodeValue
          var dir = xmlDoc.getElementsByTagName("ldt")[0].childNodes[0].nodeValue

          var urlAccesoSede = "https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx?del=" + prov + "&muni=" + muni + "&rc1=" + pc1 + "&rc2=" + pc2

          var json = {
            'refcat': pc1 + pc2,
            'provCode': prov,
            'provName': provName,
            'muniCode': muni,
            'muniName': muniName,
            'direccion': dir,
            'urlSede': urlAccesoSede
          }

          resolve(json)
        }
      )
    })
  }

  getInfoXY(srs, x, y) {
    return new Promise((resolve, reject) => {
      this._getRefCatXY(srs, x, y).then((json) => {
        this.getInfoRefCat('', '', '', json.refcat).then((json) => {
          resolve(json)
        })
      } 
    )}
  )}
}