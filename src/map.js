import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet.nontiledlayer'

export default class Map {

  constructor() {
    this.map = L.map("map", {
                 zoom: 10,
                 center: [42.284829, -8.553642],
                 zoomControl: true,
                 attributionControl: true,
                 maxZoom: 20
    })

    const pnoa = L.tileLayer.wms('http://www.ign.es/wms-inspire/pnoa-ma?', {
      maxZoom: 20,
      layers: 'OI.OrthoimageCoverage',
      format: 'image/png',
      attribution: 'PNOA cedido por © <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
    }).addTo(this.map)
    
    const catastroUrl = 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?'

    const catastroBase = L.nonTiledLayer.wms(catastroUrl, {
      maxZoom: 20,
      layers: 'Catastro',
      format: 'image/png',
      transparent: false,
      attribution: 'Dirección General del Catastro'
    })

    const catastroOverlay = L.nonTiledLayer.wms(catastroUrl, {
      maxZoom: 20,
      layers: 'Catastro',
      format: 'image/png',
      transparent: true,
      attribution: 'Dirección General del Catastro'
    }).addTo(this.map)



    const baseMaps = {
      PNOA: pnoa,
      Catastro: catastroBase
    }

    L.control.layers(baseMaps).addTo(this.map)
  }
}

