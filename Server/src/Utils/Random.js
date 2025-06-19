export function RandomPassword (length) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let password = ""
    for (let i = 0; i<length; i++) {
        let num = Math.floor(Math.random() * chars.length)
        password += chars.substring(num, num+1)
    }
    return password
}

export function aHoraArgentina(fechaUTC) {
  // Convertimos a milisegundos, restamos 3 horas (UTC−3)
  const offset = 3 * 60 * 60 * 1000;
  const argentinaTime = new Date(fechaUTC.getTime() - offset);
  return argentinaTime;
}