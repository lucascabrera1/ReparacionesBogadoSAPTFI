export function formatHumanDateTime(origin) {
    let anio = origin.substring(0,4);
    let mes  = origin.substring(5,7);
    let dia  = origin.substring(8,10);
    let hora = origin.substring(11,13);
    let minuto = origin.substring(14,16)
    //return dia+"/"+mes+"/"+anio ;
    return `${dia}/${mes}/${anio} ${hora}:${minuto}`;
}

export function formatHumanDate(origin) {
    let anio = origin.substring(0,4);
    let mes  = origin.substring(5,7);
    let dia  = origin.substring(8,10);
    return dia+"/"+mes+"/"+anio 
}