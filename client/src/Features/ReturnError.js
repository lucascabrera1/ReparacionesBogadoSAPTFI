function ReturnError(error) {
    let errorrecibido = error.response.status
    const errormessage = error.response.data.message
    return errorrecibido === 403 ?  `Error 403: Acceso no autorizado ${errormessage}` :
    errorrecibido === 401 ? `Error 401 : La solicitud ha sido rechazada ${errormessage}` :
    errorrecibido === 404 ? `Error 404: Recurso no encontrado ${errormessage}` :
    errorrecibido === 409 ? `Error 409: Conflicto interno ${errormessage}`
    : errormessage
}

export default ReturnError