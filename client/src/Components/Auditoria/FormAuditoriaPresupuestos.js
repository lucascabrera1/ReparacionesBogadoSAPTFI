import { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import React from 'react'
import { RecuperarAuditoriasPresupuesto,
    EstadoAuditoriasPresupuesto,
    ErroresAuditoriasPresupuesto,
    SeleccionarTodasLasAuditoriasPresupuesto
} from '../../Features/AuditoriaSlice'
import Table from 'react-bootstrap/Table'
import ButtonApp from '../Common/Button'
import { useNavigate } from 'react-router-dom'
import { formatHumanDateTime } from '../../Util/DateFormat'


function FormAuditoriaPresupuestos() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const auditorias = useSelector(SeleccionarTodasLasAuditoriasPresupuesto)
    const estadoauditorias = useSelector(EstadoAuditoriasPresupuesto)
    const erroresauditorias = useSelector(ErroresAuditoriasPresupuesto)
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        try {
            if (estadoauditorias === "idle") {
                dispatch(RecuperarAuditoriasPresupuesto())
            }
        } catch (error) {
            console.error(error)
        } finally{
            setLoading(false)
        }
    }, [estadoauditorias])

    console.log(auditorias)
    return (
        loading ? <div>cargando auditorias...</div>:
        erroresauditorias ? <div>{erroresauditorias}</div> :
        <div className="p-4 border rounded shadow-sm">
        <h2 className="text-lg font-bold mb-2">Historial de Auditoría</h2>
        <ul className="space-y-4">
            {auditorias.map(log => (
                <li key={log._id} className="p-3 border rounded bg-gray-50">
                    <p className="text-sm text-gray-600">
                    <strong>{log.usuario}</strong> {' '}
                    {
                        log.despues.estado === "Ingresado" ? <strong>Ingresó un nuevo presupuesto</strong> :
                        log.despues.estado === "Presupuestado" ? <strong>Diagnosticó un presupuesto</strong> :
                        log.despues.estado === "Confirmado" ? <strong>Confirmó un presupuesto</strong> :
                        log.despues.estado === "Descartado" ? <strong>Descartó un presupuesto</strong> :
                        log.despues.estado === "Reparado" ? <strong>Ingresó una nueva reparación</strong> :
                        log.despues.estado === "Reparado y retirado" ? <strong>Finalizó la reparación</strong> :
                        log.despues.estado === "Reparado y descartado" ? <strong>Devolvio un equipo que no fue reparado</strong> :
                        ""
                    }
                    {' '} en el día y la hora de {' '}
                        {formatHumanDateTime(log.timestamp)}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-xs text-gray-500">Valores previos:</h4>
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                {JSON.stringify(log.antes, null, 2)}
                            </pre>
                        </div>
                        <div>
                            <h4 className="text-xs text-gray-500">Valores posteriores:</h4>
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                {JSON.stringify(log.despues, null, 2)}
                            </pre>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
    )
}

export default FormAuditoriaPresupuestos