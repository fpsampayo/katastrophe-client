import 'jquery'
import 'materialize-css'
import '../node_modules/materialize-css/dist/css/materialize.css'
import Map from './map'
import './styles/styles.css'


if (module.hot) {
  module.hot.accept();
}

const map = new Map()

const inputRefCat = document.getElementById('navRefCatForm')
const toolMeasure = document.getElementById('tool-measure')
const toolLocate = document.getElementById('tool-locate')

const refCatSearch = () => {
  var refcat = document.getElementById('txt-refcat').value
  map.descargaParcela(refcat)
}

/* Previene que al pulsar intro se refresque la web y dispara el evento click */
inputRefCat.addEventListener('keypress', (e) => {
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

toolLocate.addEventListener('change', (e) => {
  map.activaLocation()
})

$(".button-collapse").sideNav({
  menuWidth: 250
})

$('.datepicker').pickadate({
  labelMonthNext: 'Mes siguiente',
  labelMonthPrev: 'Mes anterior',

  labelMonthSelect: 'Selecciona un mes',
  labelYearSelect: 'Selecciona un año',

  monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
  monthsShort: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
  weekdaysFull: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
  weekdaysShort: [ 'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab' ],

  weekdaysLetter: [ 'D', 'L', 'M', 'X', 'J', 'V', 'S' ],

  today: 'Hoy',
  clear: 'Limpiar',
  close: 'Cerrar',

  format: 'dd/mm/yyyy',
  selectMonths: true, 
  selectYears: 15, 
  container: document.body, 
  onSet: function(e) {
    /* Comprobamos que lo que setea el pickadate es un fecha */
    if (e.select){
      var dateString = this.get('select', 'yyyy-mm-dd')
      map.catastroHistorico(dateString)
      this.close()
    }
  }
})

$('.modal').modal();
