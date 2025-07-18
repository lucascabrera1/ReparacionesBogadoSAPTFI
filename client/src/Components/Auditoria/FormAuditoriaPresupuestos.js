import { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import { RecuperarAuditoriasPresupuesto,
    EstadoAuditoriasPresupuesto,
    ErroresAuditoriasPresupuesto,
    SeleccionarTodasLasAuditoriasPresupuesto,
    reinicializar
} from '../../Features/AuditoriaSlice'
import { useNavigate } from 'react-router-dom'
import { formatHumanDateTime } from '../../Util/DateFormat'
import {Accordion} from 'react-bootstrap'

function FormAuditoriaPresupuestos() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const auditorias = useSelector(SeleccionarTodasLasAuditoriasPresupuesto)
    const estadoauditorias = useSelector(EstadoAuditoriasPresupuesto)
    const erroresauditorias = useSelector(ErroresAuditoriasPresupuesto)
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        dispatch(reinicializar())
    }, [])

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
        erroresauditorias ? <div className='alert alert-danger'>{erroresauditorias}</div> :
        <div className="p-4 border rounded shadow-sm">
        <h2 className="text-lg font-bold mb-2">Historial de Auditoría</h2>
        <Accordion className="space-y-4">
            {auditorias.map((log, index) => (
                <Accordion.Item eventKey={index}>
                    <Accordion.Header>
                        <p className="text-sm text-gray-600">
                        <strong>{log.usuario}</strong> {' '}
                        {
                            log.despues.estado === "Ingresado" ? <strong>Ingresó un nuevo presupuesto</strong> :
                            log.despues.estado === "Presupuestado" ? <strong>Diagnosticó un presupuesto</strong> :
                            log.despues.estado === "Confirmado" ? <strong>Confirmó un presupuesto</strong> :
                            log.despues.estado === "Descartado" ? <strong>Descartó un presupuesto</strong> :
                            log.despues.estado === "Reparado" ? <strong>Ingresó una nueva reparación</strong> :
                            log.despues.estado === "Reparado y Entregado" ? <strong>Finalizó la reparación</strong> :
                            log.despues.estado === "Reparado y descartado" ? <strong>Devolvio un equipo que no fue reparado</strong> :
                            ""
                        }
                        {' '} en el día y la hora de {' '}
                            {formatHumanDateTime(log.timestamp)}
                        </p>
                    </Accordion.Header>
                    <Accordion.Body>
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
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
    )
}

export default FormAuditoriaPresupuestos