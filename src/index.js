import 'jquery'
import 'materialize-css'
import '../node_modules/materialize-css/dist/css/materialize.css'
import Map from './map'
import './styles/styles.css'
import CatastroParser from './catastroParser'


if (module.hot) {
  module.hot.accept();
}

const map = new Map()
const catastroParser = new CatastroParser()

const imputRefCat = document.getElementById('navRefCatForm')
const toolMeasure = document.getElementById('tool-measure')

const refCatSearch = () => {
  const refCat = document.getElementById('txt-refcat').value
  
  catastroParser.getParcel(refCat).then((geoJson) => {
    map.loadGeoJson(geoJson)
  })
}

/* Previene que al pulsar intro se refresque la web y dispara el evento click */

imputRefCat.addEventListener('keypress', (e) => {
  if (e.which == 13) {
    e.preventDefault()
    refCatSearch()
  }
})

toolMeasure.addEventListener('click', (e) => {
  if (e.target.checked){
    map.activaMedidor()
  } else {
    map.desactivaMedidor()
  }
})

$(".button-collapse").sideNav({
  menuWidth: 250
})

$('.datepicker').pickadate({

  // The title label to use for the month nav buttons
  labelMonthNext: 'Mes siguiente',
  labelMonthPrev: 'Mes anterior',

// The title label to use for the dropdown selectors
  labelMonthSelect: 'Selecciona un mes',
  labelYearSelect: 'Selecciona un año',

// Months and weekdays
  monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
  monthsShort: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
  weekdaysFull: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
  weekdaysShort: [ 'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab' ],

// Materialize modified
  weekdaysLetter: [ 'D', 'L', 'M', 'X', 'J', 'V', 'S' ],

// Today and clear
  today: 'Hoy',
  clear: 'Limpiar',
  close: 'Cerrar',

  format: 'dd/mm/yyyy',
  selectMonths: true, 
  selectYears: 15, 
  container: document.body, 
  onSet: function(e) {
    var dateString = this.get('select', 'yyyy-mm-dd')
    map.catastroHistorico(dateString)
    this.close()
  }
})
