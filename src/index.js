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
const imputRefCat = document.getElementById('navRefCatForm')
const navHistorico = document.getElementById('nav-historico')

const sideNav = document.getElementById('mySidenav')

const refCatSearch = () => {
  const refCat = document.getElementById('txt-refcat').value
  
  catastroParser.getParcel(refCat).then((geoJson) => {
    map.loadGeoJson(geoJson)
  })
}


btnSearch.addEventListener('click', (evt) => {
  evt.stopPropagation()
  
  refCatSearch()
})

/* Previene que al pulsar intro se refresque la web y dispara el evento click */
imputRefCat.addEventListener('keypress', (e) => {
  if (e.which == 13) {
    e.preventDefault()
    refCatSearch()
  }
})

btnSidebar.addEventListener('click', (evt) => {
  evt.preventDefault()
  sideNav.classList.toggle('toggled')
})

if (document.body.clientWidth >= 767) {
  sideNav.classList.toggle('toggled')
}
