function ReturnError(error) {
    let errorrecibido = error.response.status
    return errorrecibido === 403 ?  `Error 403: Acceso no autorizado ${error.response.data.message}` :
    errorrecibido === 401 ? `Error 401 : La soliocitud ha sido rechazada ${error.response.data.message}` :
    errorrecibido === 404 ? `Error 404: Recurso no encontrado ${error.response.data.message}` :
    errorrecibido === 409 ? `Error 409: Conflicto interno ${error.response.data.message}`
    : error.message 
}

export default ReturnError