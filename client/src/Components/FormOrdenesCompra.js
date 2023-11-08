import { useEffect } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {SeleccionarTodasLasOrdenesDeCompra,
  RecuperarOrdenesDeCompra,
  EstadoOrdenesDeCompra,
} from '../Features/OrdenCompraSlice'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { NavLink, useNavigate } from 'react-router-dom'

function FormOrdenesCompra() {
  return (
    <div>aca devolvemos todas las ordenes de compra
      <ul><li><NavLink to={'/nuevaordendecompra'}>Generar una nueva orden de compra</NavLink></li></ul>
      <Table>tabla con las ordenes de compra</Table>
      <ul><li><NavLink to={'/ordenesdecompra'}>...Atrás</NavLink></li></ul>
    </div>
  )
}

export default FormOrdenesCompra