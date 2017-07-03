import 'jquery'
import 'bootstrap'
import Map from './map'
import 'bootstrap/dist/css/bootstrap.css'
import './styles/styles.css'
import CatastroParser from './catastroParser'


if (module.hot) {
  module.hot.accept();
}

const map = new Map()
const catastroParser = new CatastroParser()
const btnSidebar = document.getElementById('menu-toggle')

const btnSearch = document.getElementById('btn-search')


btnSearch.addEventListener('click', (evt) => {
  evt.stopPropagation()
  const refCat = document.getElementById('txt-refcat').value
  
  catastroParser.getParcel(refCat).then((geoJson) => {
    map.loadGeoJson(geoJson)
  })
})

btnSidebar.addEventListener('click', (evt) => {
  evt.preventDefault()
  $("#mySidenav").toggleClass("toggled")  
})

if (document.body.clientWidth >= 767) {
  $("#mySidenav").toggleClass("toggled")
}

/* Previene que al pulsar intro se refresque la web y dispara el evento click */
$("#navRefCatForm").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault()
    btnSearch.click()
  }
})