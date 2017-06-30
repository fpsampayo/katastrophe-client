import 'jquery'
import 'bootstrap'
import Map from './map'
import 'bootstrap/dist/css/bootstrap.css'
import './styles/styles.css'
import './styles/simple-sidebar.css'
import CatastroParser from './catastroParser'


if (module.hot) {
  module.hot.accept();
}

const map = new Map()
const catastroParser = new CatastroParser()
const btnSearch = document.getElementById('btn-search')
const btnSidebar = document.getElementById('menu-toggle')


btnSearch.addEventListener('click', (evt) => {
  evt.stopPropagation()
  const refCat = document.getElementById('txt-refcat').value
  /*
  var json = catastroParser.getParcel(refCat)

  map.loadGeoJson(json)
  */
  catastroParser.getParcel(refCat).then((geoJson) => {
    map.loadGeoJson(geoJson)
  })
})

btnSidebar.addEventListener('click', (evt) => {
  evt.preventDefault()
  $("#wrapper").toggleClass("toggled")
})



