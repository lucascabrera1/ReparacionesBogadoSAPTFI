import { useEffect } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import { SeleccionarTodasLasAuditoriasLoginLogout, 
    EstadoAuditoriasLoginLogout, 
    ErroresAuditoriasLoginLogout,
    RecuperarAuditoriasLoginLogout
} from '../../Features/AuditoriaSlice'
import Table from 'react-bootstrap/Table'
import ButtonApp from '../Common/Button'
import { useNavigate } from 'react-router-dom'
import { formatHumanDateTime } from '../../Util/DateFormat'

function FormAuditoriaLoginLogout() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const auditorias = useSelector(SeleccionarTodasLasAuditoriasLoginLogout)
    const estadoauditorias = useSelector(EstadoAuditoriasLoginLogout)
    const erroresauditorias = useSelector(ErroresAuditoriasLoginLogout)

    useEffect(()=> {
        if (estadoauditorias === "idle") {
            dispatch(RecuperarAuditoriasLoginLogout())
        }
    }, [estadoauditorias])

    return erroresauditorias ? (<div className='alert alert-danger'>{erroresauditorias}</div>) : (
        <div>
            <h2>Registro de inicios y cierres de sesión del sistema</h2>
            <Table className= 'table table-success table-bordered border-dark table-sm'>
              <thead className='table-dark'>
                  <tr>
                    <th>Usuario</th>
                    <th>Operación</th>
                    <th>Fecha y Hora</th>
                    <th>Dirección IP</th>
                    <th>Navegador</th>
                  </tr>
              </thead>
              <tbody>
                {auditorias.map( aud => { 
                    return <tr key={aud._id}>
                      <td>{aud.user}</td>
                      <td>{aud.action}</td>
                      <td>{formatHumanDateTime(aud.timestamp)}</td>
                      <td>{aud.ip}</td>
                      <td>{aud.userAgent}</td>
                    </tr>
                })}
              </tbody>
          </Table>
          <ButtonApp 
            onClick={e => { e.preventDefault(); navigate('/')}}>
            ...Atrás
          </ButtonApp>
        </div>
    )
}

export default FormAuditoriaLoginLogout