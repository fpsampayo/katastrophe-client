import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../node_modules/leaflet-measure/dist/leaflet-measure'
import '../node_modules/leaflet-measure/dist/leaflet-measure.css'
import 'leaflet.nontiledlayer'
import 'leaflet.gridlayer.googlemutant'
import 'leaflet.locatecontrol'
import {MAX_ZOOM} from './constants' 
import CatastroParser from './catastroParser'

const catastroParser = new CatastroParser()

export default class Map {

  constructor() {
    this.map = L.map("map", {
                 zoom: 10,
                 center: [42.284829, -8.553642],
                 zoomControl: false,
                 attributionControl: true,
                 doubleClickZoom: true,
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

    this.measureControl = L.control.measure(measureOptions)
    this.measureControl.addTo(this.map)

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

    this.catastroUrl = 'https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?TIME='

    this.catastroBase = L.nonTiledLayer.wms(
      this.catastroUrl, 
      {
        maxZoom: MAX_ZOOM,
        layers: 'Catastro',
        format: 'image/png',
        transparent: false,
        attribution: 'Dirección General del Catastro'
      }
    )

    this.catastroOverlay = L.nonTiledLayer.wms(
      this.catastroUrl, 
      {
        maxZoom: MAX_ZOOM,
        layers: 'Catastro',
        format: 'image/png',
        transparent: true,
        attribution: 'DG del Catastro'
      }
    ).addTo(this.map)

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
      'Catastro' : this.catastroOverlay
    }

    /* Configuración Control de Capas */
    const layerControl = L.control.layers(baseMaps, overLays, {collapsed:false})
    layerControl.addTo(this.map)

    var htmlObject = layerControl.getContainer()

    const panelCapas = document.getElementById('panel-capas')
    panelCapas.appendChild(htmlObject)


    /* Location */
    this.locateControl = L.control.locate({
      position: "bottomright",
      drawCircle: true,
      follow: true,
      setView: 'once',
      keepCurrentZoomLevel: false,
      markerStyle: {
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8
      },
      circleStyle: {
        weight: 1,
        clickable: false
      },
      metric: true,
      showPopup: false,
      locateOptions: {
        maxZoom: 18,
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      }
    }).addTo(this.map)

    var locateDiv = document.getElementsByClassName('leaflet-control-locate')[0]
    locateDiv.style.display = 'none'

    this.activaIdentificacion()
  }

  descargaParcela(refcat) {
    catastroParser.getParcel(refcat).then((geoJson) => {
      this.loadGeoJson(geoJson)
    })
  }

  activaIdentificacion() {
    this.map.addEventListener('click', (e) => {
      let modalContent = document.getElementById('modal-content')
      let modalFooter = document.getElementById('modal-footer')
      modalContent.innerHTML = `
        <div class="progress light-green darken-1">
          <div class="indeterminate light-green darken-4"></div>
        </div>
      `
      modalFooter.innerHTML = null
      //$('#modal-content').html('<div class="progress light-green darken-1"><div class="indeterminate light-green darken-4"></div></div>')
      //$('#modal-footer').empty()
      $('#modal1').modal('open')
      catastroParser.getInfoXY('EPSG:4326', e.latlng.lng, e.latlng.lat).then((json) => {
        var html_content = `
          <h4><small>Referencia Catastral:</small> ` + json.refcat + `</h4>
          <p>` + json.direccion + `</p>
        `
        var html_footer = `
          <a href="` + json.accesoSede + `" class="modal-action waves-effect waves-green btn light-green darken-2" target="_blank">Sede Catastro</a>
          <a href="#" id="btn-descarga" class="modal-action waves-effect waves-green btn light-indigo darken-2">Resaltar</a>
        `
        modalContent.innerHTML = html_content
        modalFooter.innerHTML = html_footer

        let btnDescarga = document.getElementById('btn-descarga')
        btnDescarga.addEventListener('click', (e) => {
          this.descargaParcela(json.refcat)
        })
      }).catch((json) => {
        var html_content = `
          <h4>Error</h4>
          <p>` + json.message + `</p>
        `
        modalContent.innerHTML = html_content
        modalFooter.innerHTML = null
      })
    })
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
    
    this.catastroOverlay._wmsUrl = this.catastroUrl + dateString
    this.catastroBase._wmsUrl = this.catastroUrl + dateString
    this.catastroOverlay.redraw()
    this.catastroBase.redraw()
  }

  desactivaMedidor() {
    this.measureControl.remove()
  }

  activaMedidor() {
    this.measureControl.addTo(this.map)
  }

  activaLocation() {
    this.locateControl._onClick()
  }
}

