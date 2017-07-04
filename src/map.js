import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../node_modules/leaflet-measure/dist/leaflet-measure'
import '../node_modules/leaflet-measure/dist/leaflet-measure.css'
import 'leaflet.nontiledlayer'
import 'leaflet.gridlayer.googlemutant'
import {MAX_ZOOM} from './constants' 

export default class Map {

  constructor() {
    this.map = L.map("map", {
                 zoom: 10,
                 center: [42.284829, -8.553642],
                 zoomControl: false,
                 attributionControl: true,
                 maxZoom: MAX_ZOOM
    })

    L.control.zoom({position: 'bottomright'}).addTo(this.map)

    const measureOptions = {
      position: 'topright',
      localization: 'es',
      
      primaryLengthUnit: 'meters', 
      secondaryLengthUnit: 'kilometers',
      primaryAreaUnit: 'sqmeters',
      
      captureZIndex: 10000
    }

    const measureControl = L.control.measure(measureOptions)
    measureControl.addTo(this.map)

    const pnoa = L.tileLayer.wms('https://www.ign.es/wms-inspire/pnoa-ma?', {
      maxZoom: MAX_ZOOM,
      layers: 'OI.OrthoimageCoverage',
      format: 'image/png',
      attribution: 'PNOA cedido por © <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
    }).addTo(this.map)

    const satellite = L.gridLayer.googleMutant({
      maxZoom: MAX_ZOOM,
      type: 'satellite' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    })

    
    const catastroUrl = 'https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?'

    this.catastroBase = L.nonTiledLayer.wms(
      catastroUrl, 
      {
        maxZoom: MAX_ZOOM,
        layers: 'Catastro',
        format: 'image/png',
        transparent: false,
        attribution: 'Dirección General del Catastro'
      }
    )

    this.catastroOverlay = L.nonTiledLayer.wms(catastroUrl, {
      maxZoom: MAX_ZOOM,
      layers: 'Catastro',
      format: 'image/png',
      transparent: true,
      attribution: 'DG del Catastro'
    }).addTo(this.map)

    this.highlight = L.geoJSON(null, {
      pointToLayer:  function (ftr, latLng) {
        return L.circleMarker(latLng);
      },
      style: (feature) => {
        const { properties } = feature
        return properties
      },
      onEachFeature: (feature, layer) => {
        this.map.fitBounds(layer.getBounds())
      }
    }).addTo(this.map)

    const baseMaps = {
      PNOA: pnoa,
      Catastro: this.catastroBase,
      'Google Satellite': satellite
    }

    const overLays = {
      'Catastro' : this.catastroOverlay,
      //'Catastro.wms': Spain_Catastro
    }

    /* Configuración Control de Capas */
    const layerControl = L.control.layers(baseMaps, overLays, {collapsed:false})
    layerControl.addTo(this.map)

    var htmlObject = layerControl.getContainer()

    const panelCapas = document.getElementById('panel-capas')
    panelCapas.appendChild(htmlObject)

  }

  clearHighLight() {
    this.highlight.clearLayers()
  }

  loadGeoJson(geoJson) {
    this.clearHighLight()
    this.highlight.addData(geoJson)
  }
  /**
   * Activa el catastro histórico para la fecha seleccionada
   * @param {string} dateString - Fecha en formato yyyy-mm-dd
   */
  catastroHistorico(dateString) {
    
    this.catastroOverlay._wmsUrl = "https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?TIME=" + dateString
    this.catastroBase._wmsUrl = "https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?TIME=" + dateString
    this.catastroOverlay.redraw()
    this.catastroBase.redraw()
  }

  /**
   * Desactiva el catastro histórico
   */
  desactivaCatastroHistorico() {
    this.catastroOverlay._wmsUrl = "https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?"
    this.catastroBase._wmsUrl = "https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?"
    this.catastroOverlay.redraw()
    this.catastroBase.redraw()
  }
}

