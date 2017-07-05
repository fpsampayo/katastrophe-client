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
  format: 'dd/mm/yyyy',
  closeOnSelect: true,
  closeOnClear: true,
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 15, // Creates a dropdown of 15 years to control year
  container: document.body, 
  onSet: function(e) {
    setDate()
  }
})

function setDate(){
  var picker = $('.datepicker').pickadate('picker')

  var dateString = picker.get('select', 'yyyy-mm-dd')
  map.catastroHistorico(dateString)
}
